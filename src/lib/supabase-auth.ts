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
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password || "123456",
    options: {
      data: {
        name: params.name,
        role: params.role,
        world: params.world,
        avatar: params.avatar || (params.role === "professor" ? "🧑‍🏫" : "🦊"),
        discipline: params.discipline || "LIBRAS & Inclusão",
        classroom_code: params.classroomCode,
      },
    },
  });

  if (error) throw error;

  const authUser = data.user;
  if (!authUser) return null;

  // Inserir o registro na tabela correspondente do banco de dados
  if (params.role === "aluno") {
    try {
      const { data: insertedAluno, error: insertError } = await (supabase as any)
        .from("alunos")
        .insert({
          nome: params.name,
          matricula: params.email,
          celular: 0,
          nascimento: null,
          user_id: authUser.id,
          alunos_sala_id: null,
        })
        .select()
        .maybeSingle();

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
      const { error: insertError } = await (supabase as any)
        .from("professor")
        .insert({
          nome: params.name,
          email: params.email,
          senha: null,
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password || "123456",
  });

  if (error) throw error;
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

export async function fetchProfileFromSupabase(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role as "aluno" | "professor",
      world: data.world as "ef1" | "ef2",
      avatar: data.avatar || "🦊",
      discipline: data.discipline || undefined,
      level: data.level || 1,
      xp: data.xp || 0,
      streak: data.streak || 1,
      phone: data.phone || undefined,
      birthDate: data.birth_date || undefined,
      document: data.document || undefined,
      address: data.address || undefined,
      classroomCode: data.classroom_code || undefined,
      hasLoggedIn: data.has_logged_in || false,
      lastActiveAt: data.last_active_at || new Date().toISOString(),
      completedLessons: [],
      createdAt: data.created_at || new Date().toISOString(),
    };
  } catch {
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
