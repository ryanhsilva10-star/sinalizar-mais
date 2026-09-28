import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  loginUser,
  saveUser,
  getActiveUser,
} from "@/lib/user-store";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acesso do Professor · SinaLINK LIBRAS" },
      {
        name: "description",
        content: "Área de login e cadastro exclusiva para professores gerenciarem suas turmas e salas de aula no SinaLINK.",
      },
    ],
  }),
  component: LoginPage,
});

const PROFESSOR_AVATARS = [
  { icon: "🧑‍🏫", label: "Professor(a) Geral" },
  { icon: "👩‍🏫", label: "Professora LIBRAS" },
  { icon: "👨‍🏫", label: "Professor Mestre" },
  { icon: "🎓", label: "Educador Inclusivo" },
  { icon: "📚", label: "Mestre dos Sinais" },
  { icon: "🦊", label: "Luvi Guia" },
  { icon: "🚀", label: "Nova Astro" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [name, setName] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [world, setWorld] = useState<"ef1" | "ef2">("ef1");
  const [selectedAvatar, setSelectedAvatar] = useState("🧑‍🏫");

  useEffect(() => {
    // Se já houver um professor autenticado, redireciona para o onboarding
    const current = getActiveUser();
    if (current && current.role === "professor") {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Por favor, informe seu e-mail de professor.");
      return;
    }

    const user = loginUser(email, password);
    if (!user) {
      toast.error("Credenciais inválidas ou conta de professor não encontrada.");
      return;
    }

    if (user.role !== "professor") {
      toast.error("🔒 Este acesso é exclusivo para professores. Alunos podem acessar a Trilha diretamente!");
      return;
    }

    toast.success(`Bem-vindo(a) de volta, Professor(a) ${user.name}!`);
    navigate({ to: "/onboarding", replace: true });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Por favor, preencha o nome e o e-mail.");
      return;
    }

    try {
      const saved = saveUser({
        name,
        email,
        password,
        role: "professor",
        discipline: discipline.trim() || "LIBRAS & Inclusão",
        world,
        avatar: selectedAvatar,
      });

      // Efetua login com o novo professor
      loginUser(saved.email, saved.password);

      toast.success(`Conta de Professor(a) criada com sucesso! Bem-vindo(a), ${saved.name}. 🎉`);
      navigate({ to: "/onboarding", replace: true });
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao criar a conta de professor.");
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
                className={`w-1/2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition-all ${
                  mode === "login"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔑 Entrar
              </button>
              <button
                onClick={() => setMode("register")}
                className={`w-1/2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition-all ${
                  mode === "register"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ➕ Cadastrar Professor
              </button>
            </div>
          </div>

          {mode === "login" ? (
            <div>
              <div className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-2xl mb-3 shadow-inner">
                  🧑‍🏫
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Área do Professor
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold">Painel do Professor</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Acesse com sua conta de professor para gerenciar salas de aula e códigos de turma.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail do Professor
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="professor@sinalink.com"
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
                  Entrar no Painel →
                </button>
              </form>

              <div className="mt-6 border-t border-border/60 pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  É um aluno?{" "}
                  <Link to="/trilha" className="font-extrabold text-primary hover:underline">
                    Acessar Trilha de Sinais diretamente →
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Novo Professor
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold">Criar Conta Docente</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cadastre-se como professor para criar salas e acompanhar alunos no SinaLINK.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="mt-6 flex flex-col gap-4">
                {/* Avatar */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Escolha seu Avatar:
                  </label>
                  <div className="flex flex-wrap justify-center gap-2">
                    {PROFESSOR_AVATARS.map((av) => (
                      <button
                        key={av.icon}
                        type="button"
                        onClick={() => setSelectedAvatar(av.icon)}
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition-all ${
                          selectedAvatar === av.icon
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
                    placeholder="Ex: Profe. Helena Silva"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Discipline */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Disciplina / Área de Atuação *
                  </label>
                  <input
                    type="text"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    placeholder="Ex: LIBRAS & Inclusão, Educação Básica"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail Institucional ou Pessoal *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="professor@escola.com"
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
                  Criar Conta de Professor →
                </button>
              </form>

              <div className="mt-6 border-t border-border/60 pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  É um aluno?{" "}
                  <Link to="/trilha" className="font-extrabold text-primary hover:underline">
                    Acessar Trilha de Sinais diretamente →
                  </Link>
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
