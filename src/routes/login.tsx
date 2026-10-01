import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  loginUser,
  saveUser,
  getActiveUser,
} from "@/lib/user-store";
import Footer from "@/components/Footer";

type LoginSearch = {
  mode?: "login" | "register";
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      mode: search?.mode === "register" ? "register" : "login",
    };
  },
  head: () => ({
    meta: [
      { title: "Acesso e Cadastro · sinaliza mais LIBRAS" },
      {
        name: "description",
        content: "Área de login e cadastro no sinaliza mais para alunos e professores gerenciarem seu progresso e salas de aula.",
      },
    ],
  }),
  component: LoginPage,
});

const USER_AVATARS = [
  { icon: "🦊", label: "Luvi Raposa" },
  { icon: "🚀", label: "Nova Astro" },
  { icon: "🧑‍🏫", label: "Professor(a)" },
  { icon: "🐼", label: "Panda Sinais" },
  { icon: "🦁", label: "Leão Corajoso" },
  { icon: "🦉", label: "Coruja Sábia" },
  { icon: "👾", label: "Gamer Teen" },
];

import { loginWithSupabase, registerWithSupabase, isSupabaseConfigured, fetchProfileFromSupabase } from "@/lib/supabase-auth";

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"login" | "register">(search.mode || "login");

  // Sync mode with URL search params
  useEffect(() => {
    if (search.mode) {
      setMode(search.mode);
    }
  }, [search.mode]);

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [accountRole, setAccountRole] = useState<"aluno" | "professor">("aluno");
  const [name, setName] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [world, setWorld] = useState<"ef1" | "ef2">("ef1");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [classroomCode, setClassroomCode] = useState("");

  useEffect(() => {
    // Se já houver um usuário autenticado
    const current = getActiveUser();
    if (current) {
      if (current.role === "professor") {
        navigate({ to: "/onboarding", replace: true });
      } else {
        navigate({ to: "/trilha", replace: true });
      }
    }
  }, [navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Por favor, informe seu e-mail.");
      return;
    }

    let supabaseAuthSucceeded = false;

    if (isSupabaseConfigured()) {
      try {
        const authUser = await loginWithSupabase({ email, password });
        if (authUser) {
          supabaseAuthSucceeded = true;
          // Sync user profile from Supabase to local storage so loginUser doesn't fail
          const profile = await fetchProfileFromSupabase(authUser.id);
          if (profile) {
            saveUser({ ...profile, password, id: authUser.id });
          } else {
            saveUser({
              id: authUser.id,
              email: authUser.email!,
              name: authUser.user_metadata?.name || "Usuário",
              role: authUser.user_metadata?.role || "aluno",
              world: authUser.user_metadata?.world || "ef1",
              avatar: authUser.user_metadata?.avatar || "🦊",
              discipline: authUser.user_metadata?.discipline,
              classroomCode: authUser.user_metadata?.classroom_code,
              password: password,
            });
          }
        }
      } catch (err: any) {
        console.warn("[Login] Supabase auth attempt notice:", err?.message || err);
        // Se o Supabase falhar (ex: confirmação de email pendente ou credencial diferente no cloud),
        // tentamos autenticar localmente antes de disparar erro bloqueante.
      }
    }

    // Se Supabase autenticou com sucesso, faz login local apenas pelo email
    // (ignora senha local que pode estar desatualizada ou diferente)
    const user = supabaseAuthSucceeded
      ? loginUser(email)
      : loginUser(email, password);

    if (!user) {
      if (supabaseAuthSucceeded) {
        toast.error("Perfil não encontrado localmente. Tente novamente.");
      } else {
        toast.error("Credenciais inválidas ou usuário não encontrado. Verifique seu e-mail e senha.");
      }
      return;
    }

    if (user.role === "professor") {
      toast.success(`Bem-vindo(a) de volta, Professor(a) ${user.name}!`);
      navigate({ to: "/onboarding", replace: true });
    } else {
      toast.success(`Bem-vindo(a) de volta, ${user.name}! 🎉`);
      navigate({ to: "/trilha", replace: true });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Por favor, preencha o nome e o e-mail.");
      return;
    }

    try {
      let authUserId: string | undefined;
      if (isSupabaseConfigured()) {
        try {
          const authUser = await registerWithSupabase({
            email,
            password,
            name,
            role: accountRole,
            world,
            avatar: selectedAvatar,
            discipline,
            classroomCode,
          });
          if (authUser?.id) {
            authUserId = authUser.id;
          }
        } catch (supabaseErr: any) {
          console.warn("[Register] Supabase sign up notice:", supabaseErr?.message || supabaseErr);
          // Se for erro de usuário já cadastrado no Supabase ou outro erro temporário,
          // tentamos salvar e autenticar localmente
        }
      }

      if (accountRole === "aluno") {
        const saved = saveUser({
          id: authUserId,
          name,
          email,
          password,
          role: "aluno",
          world,
          avatar: selectedAvatar,
          classroomCode: classroomCode.trim().toUpperCase() || undefined,
          level: 1,
          xp: 100,
          streak: 1,
          completedLessons: [],
        });

        loginUser(saved.email, saved.password);
        toast.success(`Conta de Aluno criada com sucesso! Bem-vindo(a), ${saved.name}! 🚀`);
        navigate({ to: "/trilha", replace: true });
      } else {
        const saved = saveUser({
          id: authUserId,
          name,
          email,
          password,
          role: "professor",
          discipline: discipline.trim() || "LIBRAS & Inclusão",
          world,
          avatar: selectedAvatar,
        });

        loginUser(saved.email, saved.password);
        toast.success(`Conta de Professor(a) criada com sucesso! Bem-vindo(a), ${saved.name}. 🎉`);
        navigate({ to: "/onboarding", replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao criar a conta.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header Minimalista */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md py-4 px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft">
              S
            </span>
            <span className="font-display text-2xl font-extrabold">sinaliza mais</span>
          </Link>
          <Link
            to="/trilha"
            className="rounded-full border border-border px-4 py-2 text-xs font-extrabold hover:bg-muted transition-colors"
          >
            🗺️ Trilha Pública de Sinais
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md w-full px-4 py-12">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
          {/* Mode Switcher */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-2xl bg-muted/60 p-1 shadow-inner w-full">
              <button
                onClick={() => setMode("login")}
                className={`w-1/2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition-all ${mode === "login"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                🔑 Entrar / Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`w-1/2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition-all ${mode === "register"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                ➕ Cadastrar Usuário
              </button>
            </div>
          </div>

          {mode === "login" ? (
            <div>
              <div className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-2xl mb-3 shadow-inner">
                  🔑
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Identificação do Usuário
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold">Acessar Conta</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Entre com seu e-mail e senha de aluno ou professor para acessar seu painel.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail do Usuário
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5"
                >
                  Entrar na Conta →
                </button>
              </form>

              <div className="mt-6 border-t border-border/60 pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Ainda não tem conta?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    Cadastre-se gratuitamente agora →
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Novo Cadastro
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold">Criar Nova Conta</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Escolha o tipo de perfil e cadastre-se para aprender ou ensinar LIBRAS.
                </p>
              </div>

              {/* Selector de Perfil: Aluno vs Professor */}
              <div className="mt-6 mb-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                  Sou um(a):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountRole("aluno");
                      setSelectedAvatar("🦊");
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${accountRole === "aluno"
                        ? "border-primary bg-primary/10 shadow-soft scale-[1.02]"
                        : "border-border bg-background hover:bg-muted/50"
                      }`}
                  >
                    <span className="text-2xl">🎓</span>
                    <span className="mt-1 font-display font-extrabold text-sm">Aluno(a)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountRole("professor");
                      setSelectedAvatar("🧑‍🏫");
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${accountRole === "professor"
                        ? "border-primary bg-primary/10 shadow-soft scale-[1.02]"
                        : "border-border bg-background hover:bg-muted/50"
                      }`}
                  >
                    <span className="text-2xl">🧑‍🏫</span>
                    <span className="mt-1 font-display font-extrabold text-sm">Professor(a)</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="mt-4 flex flex-col gap-4">
                {/* Avatar */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Escolha seu Avatar:
                  </label>
                  <div className="flex flex-wrap justify-center gap-2">
                    {USER_AVATARS.map((av) => (
                      <button
                        key={av.icon}
                        type="button"
                        onClick={() => setSelectedAvatar(av.icon)}
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition-all ${selectedAvatar === av.icon
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110 shadow-md"
                            : "bg-muted hover:bg-muted/80"
                          }`}
                        title={av.label}
                      >
                        {av.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={accountRole === "aluno" ? "Ex: Luizinho Silva" : "Ex: Profe. Helena Silva"}
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {accountRole === "professor" && (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Disciplina / Área *
                    </label>
                    <input
                      type="text"
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      placeholder="Ex: LIBRAS & Inclusão"
                      required
                      className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                    />
                  </div>
                )}

                {/* Trilha/Mundo */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Trilha de Ensino / Nível:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWorld("ef1")}
                      className={`rounded-xl border-2 py-2 px-3 text-xs font-extrabold transition-all ${world === "ef1" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                        }`}
                    >
                      🌈 EF1 (1º ao 5º Ano)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorld("ef2")}
                      className={`rounded-xl border-2 py-2 px-3 text-xs font-extrabold transition-all ${world === "ef2" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                        }`}
                    >
                      🚀 EF2 (6º ao 9º Ano)
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@exemplo.com"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5"
                >
                  {accountRole === "aluno" ? "Cadastrar Aluno e Começar →" : "Criar Conta de Professor →"}
                </button>
              </form>

              <div className="mt-6 border-t border-border/60 pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Já possui uma conta?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    Fazer Login →
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
