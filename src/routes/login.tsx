import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getUsers,
  loginUser,
  saveUser,
  getActiveUser,
  User,
} from "@/lib/user-store";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar & Acessar · SinaLINK LIBRAS" },
      {
        name: "description",
        content: "Entre na sua conta de Aluno ou Professor para acessar as trilhas de LIBRAS.",
      },
    ],
  }),
  component: LoginPage,
});

const AVATARS = [
  { icon: "🦊", label: "Luvi Raposa" },
  { icon: "🚀", label: "Nova Astro" },
  { icon: "🧑‍🏫", label: "Professora / Professor" },
  { icon: "🐼", label: "Panda Sinais" },
  { icon: "🦁", label: "Leão Corajoso" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Register State
  const [name, setName] = useState("");
  const [role, setRole] = useState<"aluno" | "professor">("aluno");
  const [discipline, setDiscipline] = useState("");
  const [world, setWorld] = useState<"ef1" | "ef2">("ef1");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");

  useEffect(() => {
    const list = getUsers();
    setUsersList(list);

    // Se já houver um usuário autenticado, redireciona para a página apropriada
    const current = getActiveUser();
    if (current) {
      if (current.role === "professor") {
        navigate({ to: "/onboarding", replace: true });
      } else {
        navigate({ to: "/student/profile", replace: true });
      }
    }
  }, [navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Por favor, informe seu e-mail.");
      return;
    }

    const user = loginUser(email, password);
    if (!user) {
      toast.error("Credenciais inválidas ou usuário não encontrado.");
      return;
    }

    toast.success(`Bem-vindo(a) de volta, ${user.name}!`);

    if (user.role === "professor") {
      navigate({ to: "/onboarding", replace: true });
    } else {
      navigate({ to: "/student/profile", replace: true });
    }
  };

  const handleQuickLogin = (usr: User) => {
    const logged = loginUser(usr.email, usr.password);
    if (logged) {
      toast.success(`Logado como ${logged.name} (${logged.role === "professor" ? "Professor" : "Aluno"})`);
      if (logged.role === "professor") {
        navigate({ to: "/onboarding", replace: true });
      } else {
        navigate({ to: "/student/profile", replace: true });
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    const saved = saveUser({
      name,
      email,
      password,
      role,
      discipline: role === "professor" ? discipline : undefined,
      world,
      avatar: selectedAvatar,
    });

    // efetua o login explícito com o usuário cadastrado
    loginUser(saved.email, saved.password);

    toast.success(`Conta criada com sucesso! Bem-vindo(a), ${saved.name}.`);

    if (saved.role === "professor") {
      navigate({ to: "/onboarding", replace: true });
    } else {
      navigate({ to: "/student/profile", replace: true });
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
            <span className="font-display text-2xl font-extrabold">SinaLINK</span>
          </Link>
          <Link
            to="/trilha"
            className="rounded-full border border-border px-4 py-2 text-xs font-extrabold hover:bg-muted"
          >
            🗺️ Trilha Pública
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
                className={`w-1/2 rounded-xl py-2.5 text-sm font-extrabold transition-all ${
                  mode === "login"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔑 Entrar
              </button>
              <button
                onClick={() => setMode("register")}
                className={`w-1/2 rounded-xl py-2.5 text-sm font-extrabold transition-all ${
                  mode === "register"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ➕ Criar Conta
              </button>
            </div>
          </div>

          {mode === "login" ? (
            <div>
              <div className="text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Acesso à Plataforma
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold">Entrar no SinaLINK</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Identifique-se com seu e-mail para acessar seu perfil ou onboarding.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
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
                  Entrar na Plataforma →
                </button>
              </form>

              {/* Quick Select Preset Account */}
              {usersList.length > 0 && (
                <div className="mt-8 border-t border-border/60 pt-6">
                  <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ou selecione um perfil de teste:
                  </p>
                  <div className="flex flex-col gap-2">
                    {usersList.map((usr) => (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => handleQuickLogin(usr)}
                        className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-left transition-all hover:bg-muted/60"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{usr.avatar}</span>
                          <div>
                            <p className="font-display font-extrabold text-xs">{usr.name}</p>
                            <p className="text-[10px] text-muted-foreground">{usr.email}</p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                            usr.role === "professor"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {usr.role === "professor" ? "Professor" : "Aluno"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Novo Cadastro
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold">Criar Nova Conta</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Selecione o perfil desejado para começar a usar o SinaLINK.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="mt-6 flex flex-col gap-4">
                {/* Role Switcher */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Tipo de Perfil:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("aluno")}
                      className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-3 font-extrabold transition-all ${
                        role === "aluno"
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <span>🎒 Aluno</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("professor")}
                      className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-3 font-extrabold transition-all ${
                        role === "professor"
                          ? "border-blue-500 bg-blue-500/10 text-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <span>🧑‍🏫 Professor</span>
                    </button>
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
                    placeholder="Seu nome"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Discipline (for Professor) */}
                {role === "professor" && (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Disciplina / Matéria
                    </label>
                    <input
                      type="text"
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      placeholder="Ex: LIBRAS & Inclusão"
                      className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
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
                  Criar Minha Conta →
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
