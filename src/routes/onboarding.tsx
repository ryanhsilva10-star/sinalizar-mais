import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  getUsers,
  saveUser,
  deleteUser,
  getActiveUser,
  logoutUser,
} from "@/lib/user-store";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Painel Onboarding do Professor · SinaLINK LIBRAS" },
      {
        name: "description",
        content:
          "Área exclusiva para professores gerenciarem alunos, visualizarem o progresso e lições concluídas no SinaLINK.",
      },
    ],
  }),
  component: OnboardingPage,
});

const AVATARS = [
  { icon: "🧑‍🏫", label: "Professora / Professor" },
  { icon: "👩‍🏫", label: "Professora LIBRAS" },
  { icon: "👨‍🏫", label: "Professor Mestre" },
  { icon: "🎓", label: "Educador Inclusivo" },
  { icon: "📚", label: "Mestre dos Sinais" },
  { icon: "🦊", label: "Luvi Raposa" },
  { icon: "🚀", label: "Nova Astro" },
  { icon: "🐼", label: "Panda Sinais" },
  { icon: "🦁", label: "Leão Corajoso" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);

  // Modos de visualização da página: 'manage' (Alunos) | 'create' | 'teachers'
  const [mode, setMode] = useState<"manage" | "create" | "teachers">("manage");

  // Estado do formulário (Criar / Editar)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"aluno" | "professor">("aluno");
  const [discipline, setDiscipline] = useState("");
  const [world, setWorld] = useState<"ef1" | "ef2">("ef1");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");

  // Estado para o modal de exclusão
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Estado para o modal de lições realizadas do aluno
  const [selectedStudentForLessons, setSelectedStudentForLessons] = useState<User | null>(null);

  // Guarda de Autorização da Rota (Apenas Professores)
  const refreshUserData = () => {
    const list = getUsers();
    setUsersList(list);

    const active = getActiveUser();
    
    // 1. Não autenticado -> redireciona para Login
    if (!active) {
      toast.error("🔒 Acesso restrito a professores. Faça login para acessar o onboarding.");
      navigate({ to: "/login", replace: true });
      return;
    }

    // 2. Autenticado como Aluno -> nega acesso e redireciona para Meu Perfil
    if (active.role === "aluno") {
      toast.error("🔒 Alunos não possuem acesso ao Onboarding. Redirecionando para seu Perfil.");
      navigate({ to: "/student/profile", replace: true });
      return;
    }

    setActiveUser(active);
  };

  useEffect(() => {
    refreshUserData();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    toast.info("Sessão encerrada com sucesso.");
    navigate({ to: "/login", replace: true });
  };

  const studentsList = usersList.filter((u) => u.role !== "professor");
  const teachersList = usersList.filter((u) => u.role === "professor");

  // Selecionar usuário para editar
  const handleEditUser = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password || "");
    setRole(user.role || "aluno");
    setDiscipline(user.discipline || "");
    setWorld(user.world);
    setSelectedAvatar(user.avatar);
    setMode("create");
    toast.info(`Editando perfil de ${user.name}`);
  };

  // Limpar formulário
  const resetForm = (targetRole: "aluno" | "professor" = "aluno") => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole(targetRole);
    setDiscipline("");
    setWorld("ef1");
    setSelectedAvatar(targetRole === "professor" ? "🧑‍🏫" : "🦊");
  };

  // Submeter formulário (Salvar Usuário)
  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Por favor, preencha o nome e o e-mail.");
      return;
    }

    try {
      const saved = saveUser({
        id: editingId || undefined,
        name,
        email,
        password,
        role,
        discipline: role === "professor" ? discipline : undefined,
        world,
        avatar: selectedAvatar,
      });

      refreshUserData();
      toast.success(
        editingId
          ? `Perfil de "${saved.name}" atualizado!`
          : `${role === "professor" ? "Professor(a)" : "Aluno"} "${saved.name}" salvo com sucesso! 🎉`
      );

      resetForm();
      if (role === "professor") {
        setMode("teachers");
      } else {
        setMode("manage");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar o usuário.");
    }
  };

  // Confirmar Exclusão de Usuário
  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    try {
      const deletedName = userToDelete.name;
      deleteUser(userToDelete.id);
      setUserToDelete(null);
      refreshUserData();
      toast.success(`Usuário "${deletedName}" deletado com sucesso.`);

      if (editingId === userToDelete.id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar usuário.");
    }
  };

  if (!activeUser) return null;

  const isTeen = world === "ef2";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isTeen ? "bg-slate-950 text-slate-100" : "bg-background text-foreground"
      }`}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft">
              S
            </span>
            <span className="font-display text-2xl font-extrabold">SinaLINK</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xl">{activeUser.avatar}</span>
            <div className="hidden text-left md:block">
              <p className="text-xs font-extrabold leading-none flex items-center gap-1.5">
                {activeUser.name}
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600 dark:text-blue-400">
                  👨‍🏫 Professor
                </span>
              </p>
              <p className="text-[10px] text-muted-foreground">
                {activeUser.discipline || "Educação LIBRAS"}
              </p>
            </div>

            <Link
              to="/trilha"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-extrabold hover:bg-muted"
            >
              🗺️ Trilha
            </Link>

            {/* BOTÃO DE LOG-OFF */}
            <button
              onClick={handleLogout}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors"
              title="Encerrar sessão"
            >
              🚪 Sair / Log-off
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-16">
        {/* Navigation Mode Selector */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center rounded-2xl bg-muted/60 p-1.5 shadow-inner gap-1">
            <button
              onClick={() => setMode("manage")}
              className={`rounded-xl px-4 py-2.5 text-xs md:text-sm font-extrabold transition-all ${
                mode === "manage"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              👥 Gerenciar Alunos ({studentsList.length})
            </button>

            <button
              onClick={() => setMode("teachers")}
              className={`rounded-xl px-4 py-2.5 text-xs md:text-sm font-extrabold transition-all ${
                mode === "teachers"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🧑‍🏫 Professores ({teachersList.length})
            </button>

            <button
              onClick={() => {
                resetForm("aluno");
                setMode("create");
              }}
              className={`rounded-xl px-4 py-2.5 text-xs md:text-sm font-extrabold transition-all ${
                mode === "create"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ➕ {editingId ? "Editar Usuário" : "Salvar Usuário"}
            </button>
          </div>
        </div>

        {/* MODES CONTENT */}

        {/* MODE 1: CREATE / SAVE USER FORM */}
        {mode === "create" && (
          <div className="mx-auto max-w-xl">
            <section
              className={`rounded-3xl border border-border p-6 shadow-xl md:p-8 ${
                isTeen ? "bg-slate-900 border-indigo-500/30" : "bg-card"
              }`}
            >
              <div className="text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  {editingId ? "Atualizar Perfil" : "Painel do Professor"}
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold md:text-4xl">
                  {editingId ? `Editando: ${name}` : "Salvar Usuário"}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cadastre novos alunos ou professores e defina as configurações da conta.
                </p>
              </div>

              <form onSubmit={handleSaveUserSubmit} className="mt-8 flex flex-col gap-5">
                {/* Role Selector: Aluno vs Professor */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Perfil do Usuário:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRole("aluno");
                        if (selectedAvatar === "🧑‍🏫") setSelectedAvatar("🦊");
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-3 font-extrabold transition-all ${
                        role === "aluno"
                          ? "border-primary bg-primary/10 text-foreground scale-[1.02]"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-xl">🎒</span>
                      <span>Aluno</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole("professor");
                        setSelectedAvatar("🧑‍🏫");
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-3 font-extrabold transition-all ${
                        role === "professor"
                          ? "border-blue-500 bg-blue-500/10 text-foreground scale-[1.02]"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-xl">🧑‍🏫</span>
                      <span>Professor(a)</span>
                    </button>
                  </div>
                </div>

                {/* World Picker (EF1 vs EF2) */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nível de Ensino / Trilha Principal:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWorld("ef1")}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                        world === "ef1"
                          ? "border-primary bg-primary/10 shadow-soft scale-[1.02]"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-2xl">🦊</span>
                      <span className="mt-1 font-display font-extrabold text-sm">EF1 • Infantil</span>
                      <span className="text-[11px] text-muted-foreground">1º ao 5º ano</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWorld("ef2")}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                        world === "ef2"
                          ? "border-indigo-500 bg-indigo-500/10 shadow-soft scale-[1.02]"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-2xl">🚀</span>
                      <span className="mt-1 font-display font-extrabold text-sm">EF2 • Teen</span>
                      <span className="text-[11px] text-muted-foreground">6º ao 9º ano</span>
                    </button>
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Escolha o Avatar:
                  </label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {AVATARS.map((av) => (
                      <button
                        key={av.icon}
                        type="button"
                        onClick={() => setSelectedAvatar(av.icon)}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all ${
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

                {/* User Name */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nome Completo ou Nome do Professor *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "professor" ? "Ex: Profe. Helena Silva" : "Ex: Pedro Sinais"}
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Discipline (for Professor) */}
                {role === "professor" && (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Disciplina / Área de Atuação
                    </label>
                    <input
                      type="text"
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      placeholder="Ex: LIBRAS, Educação Inclusiva, Pedagogia"
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
                    placeholder="usuario@sinalink.com"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Senha (opcional)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Actions */}
                <div className="mt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5"
                  >
                    💾 {editingId ? "Salvar Alterações" : `Salvar ${role === "professor" ? "Professor" : "Usuário"} →`}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => resetForm("aluno")}
                      className="w-full rounded-full border border-border py-2 text-xs font-bold hover:bg-muted"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>
        )}

        {/* MODE 2: MANAGE ALUNOS (STUDENTS) */}
        {mode === "manage" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <h1 className="font-display text-3xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
                  👥 Gerenciar Alunos & Lições
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-black text-primary">
                    {studentsList.length}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Acompanhe o relatório de lições realizadas pelos alunos e gerencie suas contas.
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm("aluno");
                  setMode("create");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
              >
                ➕ Salvar Novo Aluno
              </button>
            </div>

            {studentsList.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <span className="text-4xl">🎒</span>
                <h3 className="mt-2 font-display text-lg font-extrabold">Nenhum aluno cadastrado</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Adicione novos alunos através do formulário de cadastro.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {studentsList.map((usr) => {
                  const lessonsCount = usr.completedLessons?.length || 0;

                  return (
                    <div
                      key={usr.id}
                      className="relative flex flex-col justify-between rounded-3xl border-2 border-border bg-card p-5 transition-all hover:border-border/80 shadow-sm"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{usr.avatar}</span>
                            <div>
                              <h3 className="font-display text-lg font-extrabold">{usr.name}</h3>
                              <p className="text-xs text-muted-foreground">{usr.email}</p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                              usr.world === "ef2"
                                ? "bg-indigo-500/20 text-indigo-400"
                                : "bg-amber-500/20 text-amber-600"
                            }`}
                          >
                            Mundo {usr.world.toUpperCase()}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="rounded-2xl bg-muted/50 p-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Nível</p>
                            <p className="font-extrabold">{usr.level}</p>
                          </div>
                          <div className="rounded-2xl bg-muted/50 p-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">XP</p>
                            <p className="font-extrabold text-amber-500">⚡ {usr.xp}</p>
                          </div>
                          <div className="rounded-2xl bg-muted/50 p-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Lições</p>
                            <p className="font-extrabold text-emerald-500">📜 {lessonsCount}</p>
                          </div>
                        </div>

                        {/* Ver Lições Concluídas Button */}
                        <div className="mt-4">
                          <button
                            onClick={() => setSelectedStudentForLessons(usr)}
                            className="w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2.5 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-colors"
                          >
                            <span>📜 Ver Lições Realizadas ({lessonsCount})</span>
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center justify-end gap-2 border-t border-border/60 pt-4">
                        <button
                          onClick={() => handleEditUser(usr)}
                          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={() => setUserToDelete(usr)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODE 3: TEACHERS TAB */}
        {mode === "teachers" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <h1 className="font-display text-3xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
                  🧑‍🏫 Professores Cadastrados
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-600 dark:text-blue-400">
                    {teachersList.length}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professores possuem autorização para monitorar o desempenho e gerenciar os alunos.
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm("professor");
                  setMode("create");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                ➕ Salvar Novo Professor
              </button>
            </div>

            {teachersList.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <span className="text-4xl">🧑‍🏫</span>
                <h3 className="mt-2 font-display text-lg font-extrabold">Nenhum professor cadastrado</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Adicione novos professores através do formulário de cadastro.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {teachersList.map((prof) => {
                  const isActive = activeUser?.id === prof.id;
                  return (
                    <div
                      key={prof.id}
                      className={`relative flex flex-col justify-between rounded-3xl border-2 p-5 transition-all ${
                        isActive
                          ? "border-blue-500 bg-blue-500/10 shadow-md"
                          : "border-border bg-card hover:border-border/80"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{prof.avatar}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-display text-lg font-extrabold">{prof.name}</h3>
                                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600 dark:text-blue-400">
                                  Prof.
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{prof.email}</p>
                            </div>
                          </div>

                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                            {prof.discipline || "LIBRAS"}
                          </span>
                        </div>

                        {/* Teacher Card Info */}
                        <div className="mt-4 rounded-2xl bg-muted/40 p-3 text-xs">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Área de Atuação:</p>
                          <p className="font-extrabold text-sm">{prof.discipline || "LIBRAS & Acessibilidade"}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center justify-end gap-2 border-t border-border/60 pt-4">
                        <button
                          onClick={() => handleEditUser(prof)}
                          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={() => setUserToDelete(prof)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* STUDENT LESSONS MODAL FOR TEACHERS */}
      {selectedStudentForLessons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedStudentForLessons.avatar}</span>
                <div>
                  <h3 className="font-display text-xl font-extrabold">
                    Relatório de Lições • {selectedStudentForLessons.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedStudentForLessons.email} • Mundo {selectedStudentForLessons.world.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForLessons(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-3 pr-1">
              {!selectedStudentForLessons.completedLessons ||
              selectedStudentForLessons.completedLessons.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-6">
                  Nenhuma lição registrada para este aluno ainda.
                </p>
              ) : (
                selectedStudentForLessons.completedLessons.map((les) => (
                  <div
                    key={les.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5 text-xs"
                  >
                    <div>
                      <p className="font-bold text-sm">{les.title}</p>
                      <p className="text-[10px] text-muted-foreground">Concluído em: {les.completedAt}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                        ⭐ {les.score}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudentForLessons(null)}
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold text-primary-foreground shadow-soft"
              >
                Fechar Relatório
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-3xl text-red-500">
                ⚠️
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold">Deletar Conta?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tem certeza que deseja excluir{" "}
                {userToDelete.role === "professor" ? "o(a) professor(a)" : "o aluno"}{" "}
                <strong className="text-foreground">"{userToDelete.name}"</strong> ({userToDelete.email})?
                Esta ação exclui permanentemente os dados.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 rounded-full bg-red-600 py-3 font-display text-sm font-extrabold text-white shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                Sim, Deletar 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}