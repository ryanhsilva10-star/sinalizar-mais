import { supabase } from "@/integrations/supabase/client";
import { User, Classroom } from "./user-store";

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && url !== "https://placeholder.supabase.co");
}

/**
 * Converte qualquer código (alfanumérico ou número) em um número inteiro positivo
 * para compatibilidade estrita com a coluna codigo_sala (integer/numeric) do Supabase.
 */
export function parseNumericClassroomCode(code: string): number {
  if (!code) return 100001;
  const digitsOnly = code.replace(/\D/g, "");
  if (digitsOnly.length >= 3) {
    const parsed = parseInt(digitsOnly.slice(0, 8), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // Gera hash numérico estável caso o código seja apenas letras (ex: "TURMAA")
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash = Math.abs(hash);
  }
  return 100000 + (hash % 900000);
}

export async function registerWithSupabase(params: {
  email: string;
  password?: string;
  name: string;
  role: "aluno" | "professor";
  world: "ef1" | "ef2";
  avatar?: string;
  discipline?: string;
  classroomCode?: string;
}) {
  const userPassword = params.password || "123456";

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: userPassword,
    options: {
      data: {
        name: params.name,
        role: params.role,
        world: params.world,
        avatar: params.avatar || (params.role === "professor" ? "🧑‍🏫" : "🦊"),
        discipline: params.discipline || "LIBRAS & Inclusão",
        classroom_code: params.classroomCode,
        senha: userPassword,
        streak: 1,
        lives: 5,
        xp: params.role === "professor" ? 2000 : 100,
        level: params.role === "professor" ? 10 : 1,
        last_streak_date: new Date().toISOString().split("T")[0],
      },
    },
  });

  if (error) throw error;

  const authUser = data.user;
  if (!authUser) return null;

  // Inserir registro inicial na tabela profiles (upsert resiliente)
  try {
    await (supabase as any).from("profiles").upsert({
      id: authUser.id,
      email: params.email,
      name: params.name,
      role: params.role,
      world: params.world,
      avatar: params.avatar || (params.role === "professor" ? "🧑‍🏫" : "🦊"),
      discipline: params.discipline || "LIBRAS & Inclusão",
      classroom_code: params.classroomCode,
      streak: 1,
      lives: 5,
      xp: params.role === "professor" ? 2000 : 100,
      level: params.role === "professor" ? 10 : 1,
      last_streak_date: new Date().toISOString().split("T")[0],
    });
  } catch {}

  // Inserir o registro na tabela correspondente do banco de dados
  if (params.role === "aluno") {
    try {
      // Tenta inserir incluindo 'senha' e 'pontuação_total'/'pontuacao', caso a coluna exista no banco Supabase
      const alunoPayload: any = {
        nome: params.name,
        matricula: params.email,
        celular: 0,
        nascimento: null,
        user_id: authUser.id,
        alunos_sala_id: null,
        senha: userPassword,
        pontuação_total: 100,
        pontuacao: 100,
      };

      let { data: insertedAluno, error: insertError } = await (supabase as any)
        .from("alunos")
        .insert(alunoPayload)
        .select()
        .maybeSingle();

      // Se der erro por coluna desconhecida (ex: 'senha' ou 'pontuacao'), faz fallback removendo campos extras
      if (insertError) {
        const errorMsg = insertError.message?.toLowerCase() || "";
        if (errorMsg.includes("pontuacao")) {
          delete alunoPayload.pontuacao;
        }
        if (errorMsg.includes("senha")) {
          delete alunoPayload.senha;
        }
        if (errorMsg.includes("pontuação_total") || errorMsg.includes("pontuacao_total")) {
          delete alunoPayload.pontuação_total;
        }

        const retryResult = await (supabase as any)
          .from("alunos")
          .insert(alunoPayload)
          .select()
          .maybeSingle();
        insertError = retryResult.error;
        insertedAluno = retryResult.data;
      }

      if (insertError) {
        console.warn("Aviso ao inserir aluno na tabela:", insertError.message);
      }

      // Se informou código de sala no cadastro, vincula imediatamente no Supabase
      if (params.classroomCode) {
        await addAlunoToSalaInSupabase(authUser.id, params.classroomCode);
      }
    } catch (e) {
      console.warn("Erro ao registrar aluno no Supabase:", e);
    }
  } else {
    try {
      const professorPassword = params.password || "123456";
      const { error: insertError } = await (supabase as any)
        .from("professor")
        .insert({
          nome: params.name,
          email: params.email,
          senha: professorPassword,
          user_id: authUser.id,
          sala_id: null,
        });

      if (insertError) {
        console.warn("Aviso ao inserir professor na tabela:", insertError.message);
      }
    } catch (e) {
      console.warn("Erro ao registrar professor no Supabase:", e);
    }
  }

  return authUser;
}

export async function loginWithSupabase(params: { email: string; password?: string }) {
  if (!isSupabaseConfigured()) return null;

  const userPassword = params.password || "123456";

  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: userPassword,
  });

  if (error) throw error;

  // Atualiza ou preenche o campo 'senha' no Supabase
  if (data?.user && params.password) {
    try {
      // 1. Atualiza nos metadados do auth do usuário
      await supabase.auth.updateUser({
        data: { senha: params.password },
      });
    } catch {}

    try {
      // 2. Atualiza na tabela professor
      await (supabase as any)
        .from("professor")
        .update({ senha: params.password })
        .or(`user_id.eq.${data.user.id},email.eq.${params.email}`);
    } catch (e) {
      console.warn("Aviso ao sincronizar senha do professor no Supabase:", e);
    }

    try {
      // 3. Atualiza na tabela alunos caso a coluna senha exista
      await (supabase as any)
        .from("alunos")
        .update({ senha: params.password })
        .or(`user_id.eq.${data.user.id},matricula.eq.${params.email}`);
    } catch {}
  }

  return data.user;
}

export async function logoutWithSupabase() {
  if (!isSupabaseConfigured()) return;
  await supabase.auth.signOut();
}

/**
 * Cria ou atualiza a sala de aula na tabela 'sala' do Supabase
 * e vincula o professor responsável através de professor.sala_id.
 */
export async function createOrUpdateSalaInSupabase(classroom: {
  id?: string;
  code: string;
  name: string;
  teacherId?: string;
  teacherName?: string;
  discipline?: string;
  world?: string;
  description?: string;
}) {
  if (!isSupabaseConfigured()) return null;

  const numericCode = parseNumericClassroomCode(classroom.code);

  try {
    // 1. Tenta buscar sala existente pelo código numérico
    const { data: existingSala } = await (supabase as any)
      .from("sala")
      .select("*")
      .eq("codigo_sala", numericCode)
      .maybeSingle();

    let salaRecord = existingSala;

    if (existingSala) {
      const { data: updated, error: updateErr } = await (supabase as any)
        .from("sala")
        .update({
          nome_sala: classroom.name,
        })
        .eq("id", existingSala.id)
        .select()
        .single();

      if (!updateErr && updated) salaRecord = updated;
    } else {
      // Cria nova sala
      const payload: any = {
        codigo_sala: numericCode,
        nome_sala: classroom.name,
      };
      // Apenas adiciona id se for UUID válido
      if (classroom.id && classroom.id.includes("-") && classroom.id.length === 36) {
        payload.id = classroom.id;
      }

      const { data: created, error: createErr } = await (supabase as any)
        .from("sala")
        .insert(payload)
        .select()
        .single();

      if (createErr) {
        console.warn("Aviso ao criar sala no Supabase:", createErr.message);
      } else {
        salaRecord = created;
      }
    }

    // 2. Se temos a sala e o professor, atualiza sala_id do professor
    if (salaRecord?.id && classroom.teacherId) {
      await (supabase as any)
        .from("professor")
        .update({ sala_id: salaRecord.id })
        .or(`user_id.eq.${classroom.teacherId},id.eq.${classroom.teacherId}`);
    }

    // 3. Fallback: sincroniza também na tabela 'classrooms' se ela existir
    try {
      await (supabase as any)
        .from("classrooms")
        .upsert({
          code: classroom.code,
          name: classroom.name,
          teacher_name: classroom.teacherName || "Professor",
          discipline: classroom.discipline || "LIBRAS & Inclusão",
          world: classroom.world === "ef2" ? "ef2" : "ef1",
          description: classroom.description || "",
        });
    } catch {}

    return salaRecord;
  } catch (err) {
    console.error("Erro na sincronização da sala com Supabase:", err);
    return null;
  }
}

/**
 * Vincula um aluno a uma sala de aula no Supabase:
 * 1. Localiza a sala pelo código numérico ou ID
 * 2. Localiza o aluno na tabela 'alunos' (por user_id, id ou e-mail/matrícula)
 * 3. Registra na tabela 'alunos_sala'
 * 4. Atualiza a coluna alunos.alunos_sala_id
 */
export async function addAlunoToSalaInSupabase(
  alunoIdentifier: string,
  salaCodeOrId: string
): Promise<{ success: boolean; message: string; sala?: any; aluno?: any }> {
  if (!isSupabaseConfigured()) {
    return { success: true, message: "Supabase não configurado. Salvo localmente." };
  }

  try {
    // 1. Encontra a sala
    let sala: any = null;
    const numericCode = parseNumericClassroomCode(salaCodeOrId);

    const { data: byCode } = await (supabase as any)
      .from("sala")
      .select("*")
      .eq("codigo_sala", numericCode)
      .maybeSingle();

    if (byCode) {
      sala = byCode;
    } else if (salaCodeOrId.includes("-") && salaCodeOrId.length === 36) {
      const { data: byId } = await (supabase as any)
        .from("sala")
        .select("*")
        .eq("id", salaCodeOrId)
        .maybeSingle();
      if (byId) sala = byId;
    }

    if (!sala) {
      // Tenta buscar por nome parcial
      const { data: byName } = await (supabase as any)
        .from("sala")
        .select("*")
        .ilike("nome_sala", `%${salaCodeOrId}%`)
        .maybeSingle();
      if (byName) sala = byName;
    }

    // Se ainda não encontrou sala no Supabase, tenta criar automaticamente a partir do código
    if (!sala) {
      const { data: createdSala, error: createSalaErr } = await (supabase as any)
        .from("sala")
        .insert({
          codigo_sala: numericCode,
          nome_sala: `Turma ${salaCodeOrId}`,
        })
        .select()
        .single();

      if (!createSalaErr && createdSala) {
        sala = createdSala;
      }
    }

    if (!sala) {
      return {
        success: false,
        message: `Não foi possível encontrar ou registrar a sala "${salaCodeOrId}" no Supabase.`,
      };
    }

    // 2. Encontra ou cria o registro do aluno na tabela 'alunos'
    let { data: aluno } = await (supabase as any)
      .from("alunos")
      .select("*")
      .or(`user_id.eq.${alunoIdentifier},id.eq.${alunoIdentifier},matricula.eq.${alunoIdentifier}`)
      .maybeSingle();

    if (!aluno) {
      // Cria registro do aluno no banco de dados
      const { data: newAluno, error: newAlunoErr } = await (supabase as any)
        .from("alunos")
        .insert({
          nome: "Aluno",
          matricula: alunoIdentifier,
          celular: 0,
          user_id: alunoIdentifier.includes("-") && alunoIdentifier.length === 36 ? alunoIdentifier : null,
          alunos_sala_id: null,
        })
        .select()
        .single();

      if (!newAlunoErr && newAluno) {
        aluno = newAluno;
      }
    }

    if (!aluno) {
      return {
        success: false,
        message: "Registro do aluno não encontrado na tabela 'alunos' do Supabase.",
      };
    }

    // 3. Verifica se o vínculo já existe em 'alunos_sala'
    const { data: existingLink } = await (supabase as any)
      .from("alunos_sala")
      .select("*")
      .eq("alunos_id", aluno.id)
      .eq("sala_id", sala.id)
      .maybeSingle();

    let linkId = existingLink?.id;

    if (!existingLink) {
      const { data: newLink, error: linkErr } = await (supabase as any)
        .from("alunos_sala")
        .insert({
          id: crypto.randomUUID(),
          alunos_id: aluno.id,
          sala_id: sala.id,
        })
        .select()
        .single();

      if (linkErr) {
        console.warn("Aviso ao vincular aluno_sala no Supabase:", linkErr.message);
      } else if (newLink) {
        linkId = newLink.id;
      }
    }

    // 4. Atualiza a coluna alunos_sala_id no aluno
    if (linkId) {
      await (supabase as any)
        .from("alunos")
        .update({ alunos_sala_id: linkId })
        .eq("id", aluno.id);
    }

    // 5. Atualiza classroom_code em 'profiles' como fallback
    try {
      await (supabase as any)
        .from("profiles")
        .update({ classroom_code: String(sala.codigo_sala) })
        .eq("id", alunoIdentifier);
    } catch {}

    return {
      success: true,
      message: `Aluno vinculado à sala "${sala.nome_sala}" com sucesso no Supabase! 🎉`,
      sala,
      aluno,
    };
  } catch (err: any) {
    console.error("Erro ao vincular aluno à sala no Supabase:", err);
    return {
      success: false,
      message: err.message || "Erro de conexão ao vincular aluno à sala no Supabase.",
    };
  }
}

/**
 * Remove o aluno da sala no Supabase (desvincula em alunos_sala e zera alunos_sala_id).
 */
export async function removeAlunoFromSalaInSupabase(alunoIdentifier: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    const { data: aluno } = await (supabase as any)
      .from("alunos")
      .select("*")
      .or(`user_id.eq.${alunoIdentifier},id.eq.${alunoIdentifier},matricula.eq.${alunoIdentifier}`)
      .maybeSingle();

    if (!aluno) return false;

    // Remove registros da tabela de relacionamento
    await (supabase as any)
      .from("alunos_sala")
      .delete()
      .eq("alunos_id", aluno.id);

    // Limpa a chave estrangeira em alunos
    await (supabase as any)
      .from("alunos")
      .update({ alunos_sala_id: null })
      .eq("id", aluno.id);

    // Limpa profiles se existir
    try {
      await (supabase as any)
        .from("profiles")
        .update({ classroom_code: null })
        .eq("id", alunoIdentifier);
    } catch {}

    return true;
  } catch (err) {
    console.error("Erro ao desvincular aluno da sala no Supabase:", err);
    return false;
  }
}

/**
 * Busca todas as salas de aula cadastradas no Supabase (tabela 'sala')
 * junto com os dados dos professores e contagem de alunos matriculados.
 */
export async function fetchSalasFromSupabase(): Promise<Classroom[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data: salas, error } = await (supabase as any).from("sala").select("*");
    if (error || !salas) return [];

    // Busca professores
    const { data: profs } = await (supabase as any).from("professor").select("*");
    const profsBySala = new Map<string, any>();
    if (profs) {
      for (const p of profs) {
        if (p.sala_id) profsBySala.set(p.sala_id, p);
      }
    }

    return salas.map((s: any) => {
      const prof = profsBySala.get(s.id);
      return {
        id: s.id,
        code: String(s.codigo_sala),
        name: s.nome_sala || `Sala ${s.codigo_sala}`,
        teacherId: prof?.user_id || prof?.id || "teacher_supabase",
        teacherName: prof?.nome || "Professor(a)",
        discipline: "LIBRAS & Inclusão",
        world: "all" as const,
        description: `Código numérico de acesso: ${s.codigo_sala}`,
        createdAt: new Date().toISOString(),
      };
    });
  } catch (err) {
    console.warn("Erro ao buscar salas do Supabase:", err);
    return [];
  }
}

/**
 * Busca todos os alunos cadastrados no Supabase (tabela 'alunos')
 * incluindo as informações da sala em que estão matriculados.
 */
export async function fetchAlunosFromSupabase(): Promise<
  Array<{
    id: string;
    userId: string | null;
    nome: string;
    matricula: string;
    celular: number;
    pontuacaoTotal: number;
    alunosSalaId: string | null;
    salaId?: string | null;
    codigoSala?: number | null;
  }>
> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data: alunos, error: errAlunos } = await (supabase as any).from("alunos").select("*");
    if (errAlunos || !alunos) return [];

    // Busca vínculos da tabela alunos_sala
    const { data: alunosSala } = await (supabase as any).from("alunos_sala").select("*");
    const { data: salas } = await (supabase as any).from("sala").select("*");

    const salaById = new Map<string, any>();
    if (salas) {
      for (const s of salas) salaById.set(s.id, s);
    }

    const alunoToSalaMap = new Map<string, { salaId: string; codigoSala: number }>();
    if (alunosSala) {
      for (const as of alunosSala) {
        if (as.alunos_id && as.sala_id) {
          const s = salaById.get(as.sala_id);
          alunoToSalaMap.set(as.alunos_id, {
            salaId: as.sala_id,
            codigoSala: s ? s.codigo_sala : null,
          });
        }
      }
    }

    return alunos.map((a: any) => {
      const link = alunoToSalaMap.get(a.id);
      return {
        id: a.id,
        userId: a.user_id,
        nome: a.nome,
        matricula: a.matricula,
        celular: a.celular,
        pontuacaoTotal: a.pontuação_total || 0,
        alunosSalaId: a.alunos_sala_id,
        salaId: link?.salaId || null,
        codigoSala: link?.codigoSala || null,
      };
    });
  } catch (err) {
    console.warn("Erro ao buscar alunos do Supabase:", err);
    return [];
  }
}

export async function fetchProfileFromSupabase(
  userId: string,
  email?: string,
  userMetadata?: any
): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    let profileData: any = null;

    // 1. Tenta buscar da tabela 'profiles'
    try {
      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (!error && data) {
        profileData = data;
      }
    } catch {}

    // 2. Se for aluno, busca dados na tabela 'alunos' (para resgatar pontuação e outros dados)
    let alunoData: any = null;
    try {
      const isUUID = userId.includes("-") && userId.length === 36;
      const parts = [`matricula.eq.${email || userId}`];
      if (isUUID) parts.unshift(`user_id.eq.${userId}`, `id.eq.${userId}`);
      const { data: aluno } = await (supabase as any)
        .from("alunos")
        .select("*")
        .or(parts.join(","))
        .maybeSingle();
      if (aluno) {
        alunoData = aluno;
      }
    } catch {}

    // 3. Busca metadados de autenticação do usuário caso não tenham sido passados
    let meta = userMetadata;
    if (!meta) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.id === userId) {
          meta = authData.user.user_metadata;
        }
      } catch {}
    }

    // Se não encontrou absolutamente nada em lugar nenhum, retorna null
    if (!profileData && !alunoData && !meta) {
      return null;
    }

    const emailVal = profileData?.email || alunoData?.matricula || meta?.email || email || "";
    const nameVal = profileData?.name || alunoData?.nome || meta?.name || "Aluno";
    const roleVal = (profileData?.role || meta?.role || (alunoData ? "aluno" : "aluno")) as "aluno" | "professor";
    const worldVal = (profileData?.world || meta?.world || "ef1") as "ef1" | "ef2";
    const avatarVal = profileData?.avatar || meta?.avatar || (roleVal === "professor" ? "🧑‍🏫" : "🦊");

    const streakVal =
      typeof profileData?.streak === "number"
        ? profileData.streak
        : typeof meta?.streak === "number"
        ? meta.streak
        : 1;

    const livesVal =
      typeof profileData?.lives === "number"
        ? profileData.lives
        : typeof meta?.lives === "number"
        ? meta.lives
        : 5;

    const xpVal =
      typeof profileData?.xp === "number"
        ? profileData.xp
        : typeof alunoData?.pontuação_total === "number"
        ? alunoData.pontuação_total
        : typeof alunoData?.pontuacao === "number"
        ? alunoData.pontuacao
        : typeof meta?.xp === "number"
        ? meta.xp
        : roleVal === "professor" ? 2000 : 100;

    const lastStreakDateVal =
      profileData?.last_streak_date || meta?.lastStreakDate || meta?.last_streak_date || undefined;

    const lastLiveLostAtVal =
      profileData?.last_live_lost_at || meta?.lastLiveLostAt || meta?.last_live_lost_at || undefined;

    const classroomCodeVal =
      profileData?.classroom_code || alunoData?.codigo_sala || meta?.classroom_code || undefined;

    // Busca lições concluídas na tabela user_completed_lessons caso userId seja UUID
    let completedLessons: Array<{ id: string; title: string; score: number; completedAt: string }> = [];
    if (userId.includes("-") && userId.length === 36) {
      try {
        const { data: userLessons } = await (supabase as any)
          .from("user_completed_lessons")
          .select("lesson_id, title, score, completed_at")
          .eq("user_id", userId);
        if (userLessons && userLessons.length > 0) {
          completedLessons = userLessons.map((l: any) => ({
            id: l.lesson_id,
            title: l.title || l.lesson_id,
            score: l.score ?? 0,
            completedAt: l.completed_at || new Date().toISOString(),
          }));
        }
      } catch {}
    }

    const userProfile: User = {
      id: userId,
      email: emailVal,
      name: nameVal,
      role: roleVal,
      world: worldVal,
      avatar: avatarVal,
      discipline: profileData?.discipline || meta?.discipline || undefined,
      level: profileData?.level || meta?.level || 1,
      xp: xpVal,
      streak: streakVal,
      lastStreakDate: lastStreakDateVal,
      lives: livesVal,
      lastLiveLostAt: lastLiveLostAtVal,
      phone: profileData?.phone || (alunoData?.celular ? String(alunoData?.celular) : undefined),
      birthDate: profileData?.birth_date || alunoData?.nascimento || undefined,
      document: profileData?.document || undefined,
      address: profileData?.address || undefined,
      classroomCode: classroomCodeVal,
      hasLoggedIn: true,
      lastActiveAt: new Date().toISOString(),
      completedLessons,
      createdAt: profileData?.created_at || new Date().toISOString(),
    };

    // Sincroniza de volta na tabela profiles caso não existisse ou estivesse incompleta
    try {
      await (supabase as any).from("profiles").upsert({
        id: userId,
        email: emailVal,
        name: nameVal,
        role: roleVal,
        world: worldVal,
        avatar: avatarVal,
        streak: streakVal,
        lives: livesVal,
        xp: xpVal,
        last_streak_date: lastStreakDateVal,
        classroom_code: classroomCodeVal,
      });
    } catch {}

    return userProfile;
  } catch (err) {
    console.warn("Erro ao buscar perfil consolidado do Supabase:", err);
    return null;
  }
}

export async function fetchClassroomsFromSupabase(): Promise<Classroom[]> {
  return fetchSalasFromSupabase();
}

export async function createClassroomInSupabase(classroom: {
  code: string;
  name: string;
  teacherId: string;
  teacherName: string;
  discipline?: string;
  world: "ef1" | "ef2" | "all";
  description?: string;
}) {
  return createOrUpdateSalaInSupabase(classroom);
}

/**
 * Atualiza a pontuação do aluno no banco de dados Supabase
 * Grava na tabela 'alunos', na tabela 'profiles', e nos metadados do Supabase Auth.
 */
export async function updateAlunoPontuacaoInSupabase(
  alunoIdentifier: string,
  pontuacao: number,
  completedLesson?: { id: string; title: string; score: number },
  email?: string,
  gamification?: { streak: number; lives: number; lastStreakDate?: string; lastLiveLostAt?: string },
  allLessons?: Array<{ id: string; title: string; score: number; completedAt?: string }>
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    // Monta filtro OR incluindo e-mail caso disponível
    const isUUID = alunoIdentifier.includes("-") && alunoIdentifier.length === 36;
    let filterParts = [`matricula.eq.${alunoIdentifier}`];
    if (isUUID) {
      filterParts.unshift(`user_id.eq.${alunoIdentifier}`, `id.eq.${alunoIdentifier}`);
    }
    if (email) {
      filterParts.push(`matricula.eq.${email}`);
    }
    const orFilter = filterParts.join(",");

    // 1. Tenta atualizar na tabela alunos (suportando variações de nome de coluna)
    const updatePayloads = [
      { pontuação_total: pontuacao },
      { pontuacao: pontuacao },
      { pontuacao_total: pontuacao },
    ];

    for (const payload of updatePayloads) {
      try {
        const { error } = await (supabase as any)
          .from("alunos")
          .update(payload)
          .or(orFilter);
        if (!error) break;
      } catch {}
    }

    // Tenta atualizar colunas de gamificação na tabela alunos caso existam
    if (gamification) {
      const alunoGamificationPayloads = [
        { streak: gamification.streak, vidas: gamification.lives },
        { streak: gamification.streak, lives: gamification.lives },
        { ofensiva: gamification.streak, vidas: gamification.lives },
      ];
      for (const payload of alunoGamificationPayloads) {
        try {
          const { error } = await (supabase as any)
            .from("alunos")
            .update(payload)
            .or(orFilter);
          if (!error) break;
        } catch {}
      }
    }

    // Resolve o UUID real do aluno no Supabase Auth para tabelas com chave estrangeira UUID
    let targetUserId: string | null = isUUID ? alunoIdentifier : null;

    if (!targetUserId) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.id) {
          if (!email || sessionData.session.user.email?.toLowerCase() === email.toLowerCase()) {
            targetUserId = sessionData.session.user.id;
          }
        }
      } catch {}
    }

    if (!targetUserId && email) {
      try {
        const { data: profRow } = await (supabase as any)
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        if (profRow?.id) targetUserId = profRow.id;
      } catch {}
    }

    if (!targetUserId && email) {
      try {
        const { data: alunoRow } = await (supabase as any)
          .from("alunos")
          .select("user_id")
          .eq("matricula", email)
          .maybeSingle();
        if (alunoRow?.user_id) targetUserId = alunoRow.user_id;
      } catch {}
    }

    const effectiveId = targetUserId || alunoIdentifier;

    // Prepara a lista de lições para persistência
    const lessonsToPersist: Array<{ id: string; title: string; score: number; completedAt?: string }> = [];
    if (allLessons && allLessons.length > 0) {
      lessonsToPersist.push(...allLessons);
    } else if (completedLesson) {
      lessonsToPersist.push(completedLesson);
    }

    // 2. Atualiza ou insere na tabela profiles (campo xp, streak, lives, last_streak_date, completed_lessons)
    try {
      const profileData: Record<string, any> = {
        id: effectiveId,
        xp: pontuacao,
        last_active_at: new Date().toISOString(),
      };
      if (email) profileData.email = email;
      if (gamification) {
        profileData.streak = gamification.streak;
        profileData.lives = gamification.lives;
        if (gamification.lastStreakDate) {
          profileData.last_streak_date = gamification.lastStreakDate;
        }
        if (gamification.lastLiveLostAt) {
          profileData.last_live_lost_at = gamification.lastLiveLostAt;
        }
      }
      if (lessonsToPersist.length > 0) {
        profileData.completed_lessons = lessonsToPersist;
      }
      const { error: upsertErr } = await (supabase as any)
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });

      if (upsertErr) {
        await (supabase as any)
          .from("profiles")
          .update(profileData)
          .eq("id", effectiveId);
      }
    } catch {}

    // 3. Atualiza nos metadados do Supabase Auth (garante persistência sem depender de tabelas)
    try {
      const authMetadataUpdate: Record<string, any> = {
        xp: pontuacao,
      };
      if (gamification) {
        authMetadataUpdate.streak = gamification.streak;
        authMetadataUpdate.lives = gamification.lives;
        if (gamification.lastStreakDate) {
          authMetadataUpdate.lastStreakDate = gamification.lastStreakDate;
        }
        if (gamification.lastLiveLostAt) {
          authMetadataUpdate.lastLiveLostAt = gamification.lastLiveLostAt;
        }
      }
      if (lessonsToPersist.length > 0) {
        authMetadataUpdate.completedLessons = lessonsToPersist;
      }
      await supabase.auth.updateUser({
        data: authMetadataUpdate,
      });
    } catch {}

    // 4. Salva em user_completed_lessons (tabela relacional para o relatório do professor)
    if (lessonsToPersist.length > 0 && targetUserId) {
      try {
        const records = lessonsToPersist.map((les) => ({
          user_id: targetUserId,
          lesson_id: les.id,
          title: les.title,
          score: les.score,
          completed_at: les.completedAt || new Date().toISOString(),
        }));
        await (supabase as any)
          .from("user_completed_lessons")
          .upsert(records, { onConflict: "user_id,lesson_id" });
      } catch (e) {
        console.warn("Aviso ao salvar em user_completed_lessons:", e);
      }
    }

    return true;
  } catch (err) {
    console.warn("Aviso ao atualizar pontuação do aluno no Supabase:", err);
    return false;
  }
}


/**
 * Busca as lições concluídas de um conjunto de usuários (alunos) a partir da
 * tabela 'user_completed_lessons' e da tabela 'profiles' no Supabase.
 * Retorna um Map indexado tanto por ID quanto por E-mail para match instantâneo.
 */
export async function fetchCompletedLessonsForUsers(
  studentsOrIds: Array<{ id: string; email?: string } | string>
): Promise<Map<string, Array<{ id: string; title: string; score: number; completedAt: string }>>> {
  const result = new Map<string, Array<{ id: string; title: string; score: number; completedAt: string }>>();
  if (!isSupabaseConfigured() || studentsOrIds.length === 0) return result;

  try {
    // Normaliza para array de objetos { id, email }
    const studentInfoList: Array<{ id: string; email?: string }> = studentsOrIds.map((item) =>
      typeof item === "string" ? { id: item, email: item.includes("@") ? item : undefined } : item
    );

    const allIds = new Set<string>();
    const allEmails = new Set<string>();
    const uuidToAliasesMap = new Map<string, Set<string>>();

    for (const s of studentInfoList) {
      if (s.id) {
        allIds.add(s.id);
        if (s.id.includes("-") && s.id.length === 36) {
          if (!uuidToAliasesMap.has(s.id)) uuidToAliasesMap.set(s.id, new Set());
          uuidToAliasesMap.get(s.id)!.add(s.id);
        }
      }
      if (s.email) {
        allEmails.add(s.email.toLowerCase());
      }
    }

    // 1. Busca mapeamento de email -> UUID e lições em profiles
    try {
      const { data: profs } = await (supabase as any)
        .from("profiles")
        .select("id, email, completed_lessons");
      if (profs && Array.isArray(profs)) {
        for (const p of profs) {
          const pId = p.id;
          const pEmail = p.email?.toLowerCase();
          if (!uuidToAliasesMap.has(pId)) uuidToAliasesMap.set(pId, new Set());
          uuidToAliasesMap.get(pId)!.add(pId);
          if (pEmail) uuidToAliasesMap.get(pId)!.add(pEmail);

          // Verifica se algum aluno procurado bate por ID ou por E-mail
          for (const s of studentInfoList) {
            const matchId = s.id === pId;
            const matchEmail = s.email && s.email.toLowerCase() === pEmail;
            if (matchId || matchEmail) {
              uuidToAliasesMap.get(pId)!.add(s.id);
              if (s.email) uuidToAliasesMap.get(pId)!.add(s.email.toLowerCase());

              // Se o profiles tem completed_lessons gravado em JSON, popula o resultado
              if (Array.isArray(p.completed_lessons) && p.completed_lessons.length > 0) {
                const lessons = p.completed_lessons.map((cl: any) => ({
                  id: cl.id,
                  title: cl.title || cl.id,
                  score: cl.score ?? 0,
                  completedAt: cl.completedAt || cl.completed_at || new Date().toISOString(),
                }));
                result.set(s.id, lessons);
                if (s.email) result.set(s.email.toLowerCase(), lessons);
                result.set(pId, lessons);
              }
            }
          }
        }
      }
    } catch {}

    // 2. Busca também na tabela alunos para resolver user_id por matricula (email)
    try {
      const { data: alunos } = await (supabase as any)
        .from("alunos")
        .select("id, user_id, matricula");
      if (alunos && Array.isArray(alunos)) {
        for (const a of alunos) {
          const aUserId = a.user_id;
          const aEmail = a.matricula?.toLowerCase();
          if (aUserId && aUserId.includes("-") && aUserId.length === 36) {
            if (!uuidToAliasesMap.has(aUserId)) uuidToAliasesMap.set(aUserId, new Set());
            uuidToAliasesMap.get(aUserId)!.add(a.id);
            if (aEmail) uuidToAliasesMap.get(aUserId)!.add(aEmail);

            for (const s of studentInfoList) {
              if (s.id === a.id || s.id === aUserId || (s.email && s.email.toLowerCase() === aEmail)) {
                uuidToAliasesMap.get(aUserId)!.add(s.id);
                if (s.email) uuidToAliasesMap.get(aUserId)!.add(s.email.toLowerCase());
              }
            }
          }
        }
      }
    } catch {}

    // 3. Consulta na tabela user_completed_lessons por todos os UUIDs mapeados
    const searchUuids = Array.from(uuidToAliasesMap.keys()).filter((u) => u.includes("-") && u.length === 36);

    if (searchUuids.length > 0) {
      const { data, error } = await (supabase as any)
        .from("user_completed_lessons")
        .select("user_id, lesson_id, title, score, completed_at")
        .in("user_id", searchUuids);

      if (!error && data && data.length > 0) {
        for (const row of data) {
          const uid: string = row.user_id;
          const lessonItem = {
            id: row.lesson_id,
            title: row.title || row.lesson_id,
            score: row.score ?? 0,
            completedAt: row.completed_at || new Date().toISOString(),
          };

          const aliases = uuidToAliasesMap.get(uid) || new Set([uid]);
          for (const alias of aliases) {
            if (!result.has(alias)) result.set(alias, []);
            const list = result.get(alias)!;
            if (!list.some((l) => l.id === lessonItem.id)) {
              list.push(lessonItem);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Aviso ao buscar lições concluídas dos alunos no Supabase:", err);
  }

  return result;
}
