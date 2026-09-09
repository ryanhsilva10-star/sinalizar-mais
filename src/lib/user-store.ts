export interface CompletedLesson {
  id: string;
  title: string;
  score: number;
  completedAt: string;
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
  hasLoggedIn?: boolean; // true após o primeiro login bem-sucedido
  createdAt: string;
}

const STORAGE_KEY = "sinalink_users_v1";
const ACTIVE_USER_KEY = "sinalink_active_user_id_v1";

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
    completedLessons: [
      { id: "les_10", title: "Alfabeto Manual A-Z", score: 100, completedAt: "2026-08-25" },
      { id: "les_11", title: "Expressões Faciais Gramaticais", score: 95, completedAt: "2026-08-28" },
      { id: "les_12", title: "Sinais de Família e Amigos", score: 100, completedAt: "2026-09-02" },
      { id: "les_13", title: "Desafio de IA - Sinalizando Cores", score: 88, completedAt: "2026-09-06" },
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
    createdAt: new Date().toISOString(),
  },
];

/**
 * Garante que os usuários padrão (mock) sempre existam no localStorage.
 * Usuários reais cadastrados são preservados. Executado uma vez na inicialização.
 */
export function seedDefaultUsers(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Primeiro acesso: salva os dados mocados completos
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return;
    }
    const existing: User[] = JSON.parse(raw);
    let changed = false;
    for (const defaultUser of DEFAULT_USERS) {
      const idx = existing.findIndex((u) => u.id === defaultUser.id);
      if (idx === -1) {
        // Usuário padrão não existe ainda → adiciona
        existing.push(defaultUser);
        changed = true;
      } else {
        // Garante que o campo password esteja preenchido no usuário padrão
        if (!existing[idx].password && defaultUser.password) {
          existing[idx].password = defaultUser.password;
          changed = true;
        }
      }
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.error("Erro ao fazer seed dos usuários:", err);
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

/**
 * Reseta o localStorage para os dados mocados originais.
 * Útil para testes e desenvolvimento.
 */
export function resetToDefaults(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function saveUser(userData: Partial<User> & { name: string; email: string }): User {
  const users = getUsers();
  const existingIndex = users.findIndex(
    (u) => (userData.id && u.id === userData.id) || u.email.toLowerCase() === userData.email.toLowerCase()
  );

  let updatedUser: User;

  if (existingIndex >= 0) {
    // Atualiza usuário existente
    updatedUser = {
      ...users[existingIndex],
      ...userData,
      email: userData.email.trim().toLowerCase(),
      name: userData.name.trim(),
      role: userData.role || users[existingIndex].role || "aluno",
      discipline: userData.discipline !== undefined ? userData.discipline : users[existingIndex].discipline,
    };
    users[existingIndex] = updatedUser;
  } else {
    // Cria novo usuário
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
    
    // Se o usuário ativo for deletado, desloga
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
  return users.find((u) => u.id === activeId) || null;
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
    };
    users[idx] = user;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }

  setActiveUserId(user.id);
  return user;
}
