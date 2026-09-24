export interface CompletedLesson {
  id: string;
  title: string;
  score: number;
  completedAt: string;
}

export interface Classroom {
  id: string;
  code: string; // código da sala (único, uppercase, ex: LIBRAS2026)
  name: string; // nome amigável da turma
  teacherId: string; // id do professor proprietário
  teacherName: string;
  discipline?: string;
  world?: "ef1" | "ef2" | "all";
  description?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: "aluno" | "professor";
  discipline?: string;
  world: "ef1" | "ef2";
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  phone?: string;
  birthDate?: string;
  document?: string;
  address?: string;
  completedLessons?: CompletedLesson[];
  classroomCode?: string; // código da sala em que o aluno está matriculado
  hasLoggedIn?: boolean; // true após o primeiro login bem-sucedido
  lastActiveAt?: string; // timestamp da última atividade do usuário
  createdAt: string;
}

const STORAGE_KEY = "sinalink_users_v1";
const CLASSROOMS_KEY = "sinalink_classrooms_v1";
const ACTIVE_USER_KEY = "sinalink_active_user_id_v1";

export const DEFAULT_CLASSROOMS: Classroom[] = [
  {
    id: "cls_1",
    code: "LIBRAS2026",
    name: "Turma Inclusiva - 5º Ano A",
    teacherId: "usr_prof_1",
    teacherName: "Profe. Helena Silva",
    discipline: "LIBRAS & Inclusão",
    world: "ef1",
    description: "Turma matutina de introdução aos sinais básicos, cores e primeiros diálogos em LIBRAS.",
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "cls_2",
    code: "TEEN-LIBRAS",
    name: "Sinais Avançados - 8º Ano",
    teacherId: "usr_prof_1",
    teacherName: "Profe. Helena Silva",
    discipline: "LIBRAS & Inclusão",
    world: "ef2",
    description: "Turma vespertina com foco em conversação, expressões faciais e desafios práticos.",
    createdAt: "2026-09-05T14:00:00.000Z",
  },
];

const DEFAULT_USERS: User[] = [
  {
    id: "usr_1",
    name: "Luizinho Explorer",
    email: "luizinho@sinalink.com",
    password: "123",
    role: "aluno",
    world: "ef1",
    avatar: "🦊",
    level: 3,
    xp: 450,
    streak: 5,
    phone: "(11) 98765-4321",
    birthDate: "2015-05-12",
    document: "123.456.789-00",
    address: "Rua das Flores, 123 - São Paulo/SP",
    classroomCode: "LIBRAS2026",
    lastActiveAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min atrás
    completedLessons: [
      { id: "les_1", title: "Oi & Tchau em LIBRAS", score: 100, completedAt: "2026-09-01" },
      { id: "les_2", title: "Apresentação e Meu Nome", score: 90, completedAt: "2026-09-03" },
      { id: "les_3", title: "Cores Quentes (Vermelho, Amarelo)", score: 100, completedAt: "2026-09-05" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_2",
    name: "Nova Teen",
    email: "nova@sinalink.com",
    password: "123",
    role: "aluno",
    world: "ef2",
    avatar: "🚀",
    level: 7,
    xp: 1280,
    streak: 12,
    phone: "(21) 99887-6655",
    birthDate: "2011-10-20",
    document: "987.654.321-11",
    address: "Av. Paulista, 1000 - São Paulo/SP",
    classroomCode: "TEEN-LIBRAS",
    lastActiveAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    completedLessons: [
      { id: "trail_node_1", title: "Oi & Tchau em LIBRAS", score: 100, completedAt: "2026-09-01" },
      { id: "trail_node_2", title: "Meu nome é… em LIBRAS", score: 95, completedAt: "2026-09-02" },
      { id: "trail_node_3", title: "Revisão relâmpago: Saudações", score: 100, completedAt: "2026-09-03" },
      { id: "trail_node_4", title: "Desafio do Chefe: Cumprimentos", score: 100, completedAt: "2026-09-04" },
      { id: "trail_node_5", title: "Cores quentes em LIBRAS", score: 90, completedAt: "2026-09-05" },
      { id: "trail_node_6", title: "Cores frias em LIBRAS", score: 95, completedAt: "2026-09-06" },
      { id: "trail_node_7", title: "Desafio do espelho com IA", score: 100, completedAt: "2026-09-07" },
      { id: "trail_node_8", title: "Desafio do Chefe: Arco-íris", score: 100, completedAt: "2026-09-08" },
      { id: "trail_node_9", title: "Bichos de casa em LIBRAS", score: 90, completedAt: "2026-09-09" },
      { id: "trail_node_10", title: "Bichos da fazenda em LIBRAS", score: 100, completedAt: "2026-09-10" },
      { id: "trail_node_11", title: "Revisão relâmpago: Animais", score: 95, completedAt: "2026-09-11" },
      { id: "trail_node_12", title: "Desafio do Chefe: Castelo do Saber", score: 100, completedAt: "2026-09-11" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_prof_1",
    name: "Profe. Helena Silva",
    email: "helena.prof@sinalink.com",
    password: "123",
    role: "professor",
    discipline: "LIBRAS & Inclusão",
    world: "ef1",
    avatar: "🧑‍🏫",
    level: 15,
    xp: 4500,
    streak: 30,
    phone: "(11) 91122-3344",
    birthDate: "1988-03-15",
    document: "456.789.123-55",
    address: "Alameda dos Anjos, 45 - São Paulo/SP",
    completedLessons: [],
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

/**
 * Garante que os dados padrão (usuários e salas) sempre existam no localStorage.
 */
export function seedDefaultUsers(): void {
  if (typeof window === "undefined") return;
  try {
    // 1. Seed Usuários
    const rawUsers = localStorage.getItem(STORAGE_KEY);
    if (!rawUsers) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    } else {
      const existing: User[] = JSON.parse(rawUsers);
      let changed = false;
      for (const defaultUser of DEFAULT_USERS) {
        const idx = existing.findIndex((u) => u.id === defaultUser.id);
        if (idx === -1) {
          existing.push(defaultUser);
          changed = true;
        } else {
          if (!existing[idx].password && defaultUser.password) {
            existing[idx].password = defaultUser.password;
            changed = true;
          }
          if (!existing[idx].classroomCode && defaultUser.classroomCode) {
            existing[idx].classroomCode = defaultUser.classroomCode;
            changed = true;
          }
        }
      }
      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
    }

    // 2. Seed Salas de Aula
    seedDefaultClassrooms();
  } catch (err) {
    console.error("Erro ao fazer seed:", err);
  }
}

export function seedDefaultClassrooms(): void {
  if (typeof window === "undefined") return;
  try {
    const rawClassrooms = localStorage.getItem(CLASSROOMS_KEY);
    if (!rawClassrooms) {
      localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
    } else {
      const existing: Classroom[] = JSON.parse(rawClassrooms);
      let changed = false;
      for (const defClassroom of DEFAULT_CLASSROOMS) {
        if (!existing.some((c) => c.id === defClassroom.id || c.code === defClassroom.code)) {
          existing.push(defClassroom);
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(existing));
      }
    }
  } catch (err) {
    console.error("Erro ao fazer seed das salas:", err);
  }
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw) as User[];
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    return DEFAULT_USERS;
  }
}

export function resetToDefaults(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function saveUser(userData: Partial<User> & { name: string; email: string }): User {
  const users = getUsers();
  const existingIndex = users.findIndex(
    (u) => (userData.id && u.id === userData.id) || u.email.toLowerCase() === userData.email.toLowerCase()
  );

  let updatedUser: User;

  if (existingIndex >= 0) {
    updatedUser = {
      ...users[existingIndex],
      ...userData,
      email: userData.email.trim().toLowerCase(),
      name: userData.name.trim(),
      role: userData.role || users[existingIndex].role || "aluno",
      discipline: userData.discipline !== undefined ? userData.discipline : users[existingIndex].discipline,
      lastActiveAt: new Date().toISOString(),
    };
    users[existingIndex] = updatedUser;
  } else {
    updatedUser = {
      id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password || "",
      role: userData.role || "aluno",
      discipline: userData.discipline || "",
      world: userData.world || "ef1",
      avatar: userData.avatar || (userData.role === "professor" ? "🧑‍🏫" : userData.world === "ef2" ? "🚀" : "🦊"),
      level: userData.level || (userData.role === "professor" ? 10 : 1),
      xp: userData.xp || (userData.role === "professor" ? 2000 : 100),
      streak: userData.streak || 1,
      classroomCode: userData.classroomCode || "",
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    users.push(updatedUser);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  return updatedUser;
}

export function deleteUser(userId: string): void {
  let users = getUsers();
  users = users.filter((u) => u.id !== userId);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    const activeId = getActiveUserId();
    if (activeId === userId) {
      logoutUser();
    }
  }
}

export function getActiveUserId(): string | null {
  if (typeof window === "undefined") return null;
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  if (!activeId) return null;
  return activeId;
}

export function setActiveUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_USER_KEY, userId);
}

export function getActiveUser(): User | null {
  const activeId = getActiveUserId();
  if (!activeId) return null;
  const users = getUsers();
  const user = users.find((u) => u.id === activeId) || null;
  return user;
}

export function touchActiveUser(): void {
  const active = getActiveUser();
  if (active) {
    saveUser({
      ...active,
      lastActiveAt: new Date().toISOString(),
    });
  }
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function loginUser(email: string, password?: string): User | null {
  const users = getUsers();
  const idx = users.findIndex(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && (!password || u.password === password)
  );

  if (idx === -1) return null;

  let user = users[idx];

  // Na primeira vez que o usuário faz login, zera as lições concluídas
  if (!user.hasLoggedIn) {
    user = {
      ...user,
      completedLessons: [],
      hasLoggedIn: true,
      lastActiveAt: new Date().toISOString(),
    };
  } else {
    user = {
      ...user,
      lastActiveAt: new Date().toISOString(),
    };
  }

  users[idx] = user;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  setActiveUserId(user.id);
  return user;
}

// ==========================================
// MÉTODOS DE GERENCIAMENTO DE SALAS DE AULA
// ==========================================

export function getClassrooms(): Classroom[] {
  if (typeof window === "undefined") return DEFAULT_CLASSROOMS;
  try {
    const raw = localStorage.getItem(CLASSROOMS_KEY);
    if (!raw) {
      localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
      return DEFAULT_CLASSROOMS;
    }
    return JSON.parse(raw) as Classroom[];
  } catch (err) {
    console.error("Erro ao carregar salas de aula:", err);
    return DEFAULT_CLASSROOMS;
  }
}

export function getClassroomByCode(code: string): Classroom | null {
  if (!code) return null;
  const trimmed = code.trim().toUpperCase();
  const classrooms = getClassrooms();
  return classrooms.find((c) => c.code.toUpperCase() === trimmed) || null;
}

export function getClassroomsByTeacher(teacherId: string): Classroom[] {
  const classrooms = getClassrooms();
  return classrooms.filter((c) => c.teacherId === teacherId);
}

export function saveClassroom(
  classroomData: Partial<Classroom> & { name: string; code: string; teacherId: string }
): Classroom {
  const classrooms = getClassrooms();
  const normalizedCode = classroomData.code.trim().toUpperCase();

  // Verifica unicidade de código se for nova sala ou edição de código
  const existingWithCode = classrooms.find(
    (c) => c.code.toUpperCase() === normalizedCode && c.id !== classroomData.id
  );
  if (existingWithCode) {
    throw new Error(`O código de sala "${normalizedCode}" já está em uso por outra turma.`);
  }

  let updatedClassroom: Classroom;
  const existingIdx = classrooms.findIndex((c) => classroomData.id && c.id === classroomData.id);

  if (existingIdx >= 0) {
    const oldCode = classrooms[existingIdx].code;
    updatedClassroom = {
      ...classrooms[existingIdx],
      ...classroomData,
      name: classroomData.name.trim(),
      code: normalizedCode,
    };
    classrooms[existingIdx] = updatedClassroom;

    // Se o código mudou, atualiza os alunos que estavam no código antigo
    if (oldCode !== normalizedCode) {
      const users = getUsers();
      let changed = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].classroomCode === oldCode) {
          users[i].classroomCode = normalizedCode;
          changed = true;
        }
      }
      if (changed && typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      }
    }
  } else {
    updatedClassroom = {
      id: classroomData.id || `cls_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      code: normalizedCode,
      name: classroomData.name.trim(),
      teacherId: classroomData.teacherId,
      teacherName: classroomData.teacherName || "Professor",
      discipline: classroomData.discipline || "LIBRAS",
      world: classroomData.world || "all",
      description: classroomData.description || "",
      createdAt: new Date().toISOString(),
    };
    classrooms.push(updatedClassroom);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(classrooms));
  }

  return updatedClassroom;
}

export function deleteClassroom(classroomId: string): void {
  const classrooms = getClassrooms();
  const target = classrooms.find((c) => c.id === classroomId);
  if (!target) return;

  const filtered = classrooms.filter((c) => c.id !== classroomId);
  if (typeof window !== "undefined") {
    localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(filtered));

    // Desvincula alunos da sala deletada
    const users = getUsers();
    let changed = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].classroomCode === target.code) {
        users[i].classroomCode = undefined;
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }
}

/**
 * Retorna todos os alunos matriculados em uma sala específica.
 */
export function getStudentsInClassroom(classroomCode: string): User[] {
  if (!classroomCode) return [];
  const normalized = classroomCode.trim().toUpperCase();
  const users = getUsers();
  return users.filter(
    (u) => u.role === "aluno" && u.classroomCode && u.classroomCode.toUpperCase() === normalized
  );
}

/**
 * O aluno entra em uma sala existente através do código.
 */
export function joinClassroom(
  studentId: string,
  code: string
): { success: boolean; message: string; classroom?: Classroom } {
  const normalizedCode = code.trim().toUpperCase();
  const classroom = getClassroomByCode(normalizedCode);

  if (!classroom) {
    return {
      success: false,
      message: `A sala com código "${normalizedCode}" não foi encontrada. Verifique com seu professor.`,
    };
  }

  const users = getUsers();
  const idx = users.findIndex((u) => u.id === studentId);
  if (idx === -1) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    };
  }

  if (users[idx].classroomCode?.toUpperCase() === normalizedCode) {
    return {
      success: true,
      message: `Você já está matriculado na sala "${classroom.name}"!`,
      classroom,
    };
  }

  users[idx] = {
    ...users[idx],
    classroomCode: normalizedCode,
    lastActiveAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  return {
    success: true,
    message: `Você entrou com sucesso na sala "${classroom.name}" (${classroom.teacherName})! 🎉`,
    classroom,
  };
}

/**
 * Remove o aluno de sua sala atual.
 */
export function leaveClassroom(studentId: string): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === studentId);
  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      classroomCode: undefined,
      lastActiveAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }
}

/**
 * Permite ao professor desvincular um aluno da sala.
 */
export function removeStudentFromClassroom(studentId: string): void {
  leaveClassroom(studentId);
}

/**
 * Determina se um usuário está online no momento:
 * - É o usuário ativo da sessão local atual, OU
 * - Teve atividade registrada nos últimos 15 minutos.
 */
export function isUserOnline(user: User): boolean {
  const activeId = getActiveUserId();
  if (activeId && activeId === user.id) return true;

  if (user.lastActiveAt) {
    const diffMs = Date.now() - new Date(user.lastActiveAt).getTime();
    return diffMs <= 15 * 60 * 1000; // 15 minutos
  }
  return false;
}

