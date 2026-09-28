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
  getClassrooms,
  saveClassroom,
  deleteClassroom,
  getStudentsInClassroom,
  removeStudentFromClassroom,
  isUserOnline,
  generateRandomClassroomCode,
  Classroom,
} from "@/lib/user-store";
import Footer from "@/components/Footer";
import {
  Eye,
  EyeOff,
  Plus,
  Copy,
  Check,
  Trash2,
  Edit3,
  X,
  UserMinus,
  Maximize2,
  Minimize2,
  Search,
  Users,
} from "lucide-react";
import { ALL_TRAIL_ACTIVITIES } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Painel do Professor · SinaLINK LIBRAS" },
      {
        name: "description",
        content:
          "Área exclusiva para professores gerenciarem salas de aula, turmas e professores no SinaLINK.",
      },
    ],
  }),
  component: OnboardingPage,
});

const PROFESSOR_AVATARS = [
  { icon: "🧑‍🏫", label: "Professor(a) Geral" },
  { icon: "👩‍🏫", label: "Professora LIBRAS" },
  { icon: "👨‍🏫", label: "Professor Mestre" },
  { icon: "🎓", label: "Educador(a) Inclusivo(a)" },
  { icon: "📚", label: "Mestre dos Sinais" },
  { icon: "🦊", label: "Luvi Guia" },
  { icon: "🚀", label: "Nova Astro" },
  { icon: "🐼", label: "Panda Sinais" },
  { icon: "🦁", label: "Leão Corajoso" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [classroomsList, setClassroomsList] = useState<Classroom[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);

  // Modos de visualização da página: 'classrooms' (Minhas Salas) | 'teachers' | 'create' (Cadastrar Professor)
  const [mode, setMode] = useState<"classrooms" | "teachers" | "create">("classrooms");

  // Estado do formulário de Professor (Criar / Editar)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [world, setWorld] = useState<"ef1" | "ef2">("ef1");
  const [selectedAvatar, setSelectedAvatar] = useState("🧑‍🏫");

  // Estado para o modal de exclusão de professor
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Estado para o modal de lições realizadas do aluno (ao visualizar alunos de uma sala)
  const [selectedStudentForLessons, setSelectedStudentForLessons] = useState<User | null>(null);

  // Estados para Gerenciamento de Salas de Aula
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [classroomName, setClassroomName] = useState("");
  const [classroomDiscipline, setClassroomDiscipline] = useState("");
  const [classroomWorld, setClassroomWorld] = useState<"ef1" | "ef2" | "all">("all");
  const [classroomCode, setClassroomCode] = useState("");
  const [classroomDescription, setClassroomDescription] = useState("");
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);
  const [selectedClassroomForStudents, setSelectedClassroomForStudents] = useState<Classroom | null>(null);
  const [visibleCodes, setVisibleCodes] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Estado do modal avançado de progresso de alunos
  const [isStudentModalFullscreen, setIsStudentModalFullscreen] = useState(false);
  const [studentModalWorldFilter, setStudentModalWorldFilter] = useState<"all" | "world1" | "world2">("all");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  const refreshUserData = () => {
    const list = getUsers();
    setUsersList(list);

    const crs = getClassrooms();
    setClassroomsList(crs);

    const active = getActiveUser();

    // 1. Não autenticado -> redireciona para Login
    if (!active) {
      toast.error("🔒 Acesso restrito a professores. Faça login para acessar o painel.");
      navigate({ to: "/login", replace: true });
      return;
    }

    // 2. Autenticado como Aluno -> nega acesso e redireciona para Trilha
    if (active.role === "aluno") {
      toast.error("🔒 Área exclusiva para professores. Redirecionando para a trilha.");
      navigate({ to: "/trilha", replace: true });
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

  const teachersList = usersList.filter((u) => u.role === "professor");

  // Filtra as salas pertencentes ao professor logado
  const teacherClassrooms = activeUser
    ? classroomsList.filter(
        (c) =>
          c.teacherId === activeUser.id ||
          c.teacherName === activeUser.name ||
          (activeUser.email === "helena.prof@sinalink.com" && c.teacherId === "usr_prof_1")
      )
    : [];

  // ==========================================
  // HANDLERS DE PROFESSORES (CRIAR / EDITAR)
  // ==========================================

  const handleEditTeacher = (prof: User) => {
    setEditingId(prof.id);
    setName(prof.name);
    setEmail(prof.email);
    setPassword(prof.password || "");
    setDiscipline(prof.discipline || "");
    setWorld(prof.world);
    setSelectedAvatar(prof.avatar || "🧑‍🏫");
    setMode("create");
    toast.info(`Editando perfil do(a) Professor(a) ${prof.name}`);
  };

  const resetProfessorForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setDiscipline("");
    setWorld("ef1");
    setSelectedAvatar("🧑‍🏫");
  };

  const handleSaveProfessorSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Por favor, preencha o nome e o e-mail do professor.");
      return;
    }

    try {
      const saved = saveUser({
        id: editingId || undefined,
        name,
        email,
        password,
        role: "professor",
        discipline: discipline.trim() || "LIBRAS & Inclusão",
        world,
        avatar: selectedAvatar,
      });

      refreshUserData();
      toast.success(
        editingId
          ? `Perfil de "${saved.name}" atualizado com sucesso!`
          : `Professor(a) "${saved.name}" cadastrado(a) com sucesso! 🎉`
      );

      resetProfessorForm();
      setMode("teachers");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao salvar professor.");
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    refreshUserData();
    toast.success(`Conta do(a) professor(a) "${userToDelete.name}" foi excluída.`);
    setUserToDelete(null);
  };

  // ==========================================
  // HANDLERS DE SALAS DE AULA
  // ==========================================

  const handleOpenAddClassroomModal = () => {
    setEditingClassroom(null);
    setClassroomName("");
    setClassroomDiscipline(activeUser?.discipline || "LIBRAS & Inclusão");
    setClassroomWorld("all");
    setClassroomCode(generateRandomClassroomCode());
    setClassroomDescription("");
    setIsClassroomModalOpen(true);
  };

  const handleOpenEditClassroomModal = (cls: Classroom) => {
    setEditingClassroom(cls);
    setClassroomName(cls.name);
    setClassroomDiscipline(cls.discipline || "");
    setClassroomWorld(cls.world || "all");
    setClassroomCode(cls.code);
    setClassroomDescription(cls.description || "");
    setIsClassroomModalOpen(true);
  };

  const handleSaveClassroomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classroomName.trim()) {
      toast.error("Por favor, informe o nome da sala de aula.");
      return;
    }

    if (!activeUser) return;

    try {
      const saved = saveClassroom({
        id: editingClassroom?.id,
        name: classroomName,
        teacherId: activeUser.id,
        teacherName: activeUser.name,
        discipline: classroomDiscipline.trim() || undefined,
        world: classroomWorld,
        code: classroomCode.trim().toUpperCase() || undefined,
        description: classroomDescription.trim() || undefined,
      });

      refreshUserData();
      setIsClassroomModalOpen(false);
      toast.success(
        editingClassroom
          ? `Sala "${saved.name}" atualizada com sucesso! 🎉`
          : `Sala "${saved.name}" criada com sucesso! Código de acesso: ${saved.code} 🎉`
      );
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar sala de aula.");
    }
  };

  const handleConfirmDeleteClassroom = () => {
    if (!classroomToDelete) return;
    deleteClassroom(classroomToDelete.id);
    refreshUserData();
    if (selectedClassroomForStudents?.id === classroomToDelete.id) {
      setSelectedClassroomForStudents(null);
    }
    toast.success(`Sala "${classroomToDelete.name}" foi excluída.`);
    setClassroomToDelete(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
    toast.success(`📋 Código "${code}" copiado para a área de transferência!`);
  };

  const toggleCodeVisibility = (id: string) => {
    setVisibleCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRemoveStudentFromClass = (studentId: string, studentName: string) => {
    removeStudentFromClassroom(studentId);
    refreshUserData();
    toast.info(`Aluno "${studentName}" foi desvinculado desta sala.`);
  };

  if (!activeUser) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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
              className="rounded-full border border-border px-3.5 py-1.5 text-xs font-extrabold hover:bg-muted transition-colors"
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
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        {/* Navigation Mode Selector */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center rounded-2xl bg-muted/60 p-1.5 shadow-inner gap-1">
            <button
              onClick={() => setMode("classrooms")}
              className={`rounded-xl px-5 py-2.5 text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 ${
                mode === "classrooms"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🏫 Minhas Salas</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  mode === "classrooms"
                    ? "bg-white/25 text-white"
                    : "bg-primary/15 text-primary"
                }`}
              >
                {teacherClassrooms.length}
              </span>
            </button>

            <button
              onClick={() => setMode("teachers")}
              className={`rounded-xl px-5 py-2.5 text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 ${
                mode === "teachers"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🧑‍🏫 Professores</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  mode === "teachers"
                    ? "bg-white/25 text-white"
                    : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                }`}
              >
                {teachersList.length}
              </span>
            </button>

            <button
              onClick={() => {
                resetProfessorForm();
                setMode("create");
              }}
              className={`rounded-xl px-5 py-2.5 text-xs md:text-sm font-extrabold transition-all ${
                mode === "create"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ➕ {editingId ? "Editar Professor" : "Cadastrar Professor"}
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* ABA: MINHAS SALAS                         */}
        {/* ========================================== */}
        {mode === "classrooms" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header da Seção de Salas */}
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <h1 className="font-display text-3xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
                  🏫 Minhas Salas de Aula
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-black text-primary">
                    {teacherClassrooms.length} {teacherClassrooms.length === 1 ? "turma" : "turmas"}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas turmas, crie códigos de acesso exclusivos e acompanhe os alunos matriculados em tempo real.
                </p>
              </div>

              {/* BOTÃO ADICIONAR SALA */}
              <button
                onClick={handleOpenAddClassroomModal}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Sala</span>
              </button>
            </div>

            {/* Lista de Salas */}
            {teacherClassrooms.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center bg-card/40">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-4xl text-primary">
                  🏫
                </span>
                <h3 className="mt-4 font-display text-xl font-extrabold">Nenhuma sala de aula cadastrada</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Crie sua primeira sala para gerar um código de acesso e permitir que seus alunos se conectem à turma pelo SinaLINK.
                </p>
                <button
                  onClick={handleOpenAddClassroomModal}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Minha Primeira Sala</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {teacherClassrooms.map((cls) => {
                  const enrolledStudents = getStudentsInClassroom(cls.code);
                  const onlineCount = enrolledStudents.filter(isUserOnline).length;
                  const isCodeVisible = visibleCodes[cls.id] ?? true;

                  const worldIcon =
                    cls.world === "ef2" ? "🚀" : cls.world === "ef1" ? "🦊" : "🎓";
                  const worldLabel =
                    cls.world === "ef2"
                      ? "Mundo EF2 • Teen (6º ao 9º)"
                      : cls.world === "ef1"
                      ? "Mundo EF1 • Infantil (1º ao 5º)"
                      : "Todos os Níveis (EF1 & EF2)";

                  return (
                    <div
                      key={cls.id}
                      className="relative flex flex-col justify-between rounded-3xl border-2 border-border bg-card p-6 shadow-md transition-all hover:border-primary/50 hover:shadow-lg"
                    >
                      <div className="space-y-4">
                        {/* Topo do Card da Sala */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-inner">
                              {worldIcon}
                            </span>
                            <div>
                              <h3 className="font-display text-xl font-extrabold leading-tight text-foreground">
                                {cls.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                <span>📚 {cls.discipline || "LIBRAS & Inclusão"}</span>
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                              cls.world === "ef2"
                                ? "bg-indigo-500/20 text-indigo-500 dark:text-indigo-400"
                                : cls.world === "ef1"
                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {cls.world === "ef2" ? "EF2 Teen" : cls.world === "ef1" ? "EF1 Infantil" : "Geral"}
                          </span>
                        </div>

                        {/* Descrição se houver */}
                        {cls.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 italic bg-muted/30 p-2.5 rounded-xl">
                            "{cls.description}"
                          </p>
                        )}

                        {/* BOX DO CÓDIGO DA SALA */}
                        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-3.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                                Código de Acesso da Turma:
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-lg font-black tracking-widest text-primary">
                                  {isCodeVisible ? cls.code : "••••••"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleCodeVisibility(cls.id)}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  title={isCodeVisible ? "Ocultar código" : "Mostrar código"}
                                >
                                  {isCodeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCopyCode(cls.code)}
                              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shadow-sm ${
                                copiedCode === cls.code
                                  ? "bg-emerald-500 text-white scale-105"
                                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                              }`}
                              title="Copiar código da sala"
                            >
                              {copiedCode === cls.code ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copiar Código</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            💡 Os alunos usam este código no botão flutuante <strong>"🏫 Sala de Aula"</strong> para ingressar.
                          </p>
                        </div>

                        {/* RESUMO DOS ALUNOS MATRICULADOS */}
                        <div className="rounded-2xl bg-muted/40 p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-background text-sm shadow-sm">
                              👥
                            </span>
                            <div>
                              <p className="text-xs font-extrabold">
                                {enrolledStudents.length}{" "}
                                {enrolledStudents.length === 1 ? "aluno matriculado" : "alunos matriculados"}
                              </p>
                              {onlineCount > 0 ? (
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  {onlineCount} online agora
                                </p>
                              ) : (
                                <p className="text-[10px] text-muted-foreground">
                                  {cls.createdAt ? `Criada em ${new Date(cls.createdAt).toLocaleDateString("pt-BR")}` : worldLabel}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedClassroomForStudents(cls)}
                            className="shrink-0 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-extrabold text-foreground hover:bg-muted transition-colors shadow-sm"
                          >
                            Ver Alunos ({enrolledStudents.length})
                          </button>
                        </div>
                      </div>

                      {/* AÇÕES DA SALA (EDITAR / EXCLUIR) */}
                      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {worldLabel}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditClassroomModal(cls)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => setClassroomToDelete(cls)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* ABA: PROFESSORES CADASTRADOS              */}
        {/* ========================================== */}
        {mode === "teachers" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <h1 className="font-display text-3xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
                  🧑‍🏫 Professores Cadastrados
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-600 dark:text-blue-400">
                    {teachersList.length}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professores possuem autorização para criar salas de aula e monitorar turmas no SinaLINK.
                </p>
              </div>
              <button
                onClick={() => {
                  resetProfessorForm();
                  setMode("create");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                <span>Cadastrar Novo Professor</span>
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
                                {isActive && (
                                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                                    Você
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{prof.email}</p>
                            </div>
                          </div>

                          <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
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
                          onClick={() => handleEditTeacher(prof)}
                          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted transition-colors"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={() => setUserToDelete(prof)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors"
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

        {/* ========================================== */}
        {/* ABA: CADASTRAR / EDITAR PROFESSOR         */}
        {/* ========================================== */}
        {mode === "create" && (
          <div className="mx-auto max-w-xl animate-fade-in">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
              <div className="text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  {editingId ? "Atualizar Perfil" : "Painel do Professor"}
                </span>
                <h1 className="mt-1 font-display text-3xl font-extrabold md:text-4xl">
                  {editingId ? `Editando: ${name}` : "Cadastrar Professor(a)"}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cadastre novos professores para gerenciar turmas e salas no SinaLINK.
                </p>
              </div>

              <form onSubmit={handleSaveProfessorSubmit} className="mt-8 flex flex-col gap-5">
                {/* Avatar Picker */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Escolha o Avatar do Professor:
                  </label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {PROFESSOR_AVATARS.map((av) => (
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

                {/* Teacher Name */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nome Completo do Professor *
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
                    placeholder="Ex: LIBRAS, Educação Inclusiva, Pedagogia"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* World Picker (EF1 vs EF2) */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Trilha de Atuação Principal:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                {/* Email */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail de Acesso *
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

                {/* Actions */}
                <div className="mt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5"
                  >
                    💾 {editingId ? "Salvar Alterações" : "Salvar Professor(a) →"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        resetProfessorForm();
                        setMode("teachers");
                      }}
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
      </main>

      {/* ========================================== */}
      {/* MODAL ADICIONAR / EDITAR SALA DE AULA      */}
      {/* ========================================== */}
      {isClassroomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  🏫
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold">
                    {editingClassroom ? "Editar Sala de Aula" : "Adicionar Nova Sala de Aula"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Preencha os dados da turma para gerar o código de acesso.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClassroomModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClassroomSubmit} className="mt-6 flex flex-col gap-4">
              {/* Nome da Sala */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nome da Turma / Sala *
                </label>
                <input
                  type="text"
                  value={classroomName}
                  onChange={(e) => setClassroomName(e.target.value)}
                  placeholder="Ex: Turma Inclusiva - 5º Ano A"
                  required
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-primary"
                />
              </div>

              {/* Disciplina */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Disciplina / Área
                </label>
                <input
                  type="text"
                  value={classroomDiscipline}
                  onChange={(e) => setClassroomDiscipline(e.target.value)}
                  placeholder="Ex: LIBRAS & Inclusão, Educação Especial"
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-primary"
                />
              </div>

              {/* Nível / Trilha da Turma */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nível de Ensino / Trilha da Turma:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setClassroomWorld("ef1")}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${
                      classroomWorld === "ef1"
                        ? "border-primary bg-primary/10 shadow-soft font-extrabold"
                        : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xl">🦊</span>
                    <span className="mt-1 text-xs">EF1 Infantil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClassroomWorld("ef2")}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${
                      classroomWorld === "ef2"
                        ? "border-indigo-500 bg-indigo-500/10 shadow-soft font-extrabold text-indigo-400"
                        : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xl">🚀</span>
                    <span className="mt-1 text-xs">EF2 Teen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClassroomWorld("all")}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${
                      classroomWorld === "all"
                        ? "border-emerald-500 bg-emerald-500/10 shadow-soft font-extrabold text-emerald-600 dark:text-emerald-400"
                        : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xl">🎓</span>
                    <span className="mt-1 text-xs">Todos / Geral</span>
                  </button>
                </div>
              </div>

              {/* Código de Acesso da Sala */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Código de Acesso da Turma:
                  </label>
                  <button
                    type="button"
                    onClick={() => setClassroomCode(generateRandomClassroomCode())}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    🎲 Gerar Novo Código
                  </button>
                </div>
                <input
                  type="text"
                  value={classroomCode}
                  onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                  placeholder="EX: LIBRAS2026"
                  maxLength={12}
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-mono text-sm font-extrabold tracking-widest uppercase outline-none transition-colors focus:border-primary"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Os alunos digitarão esse código no aplicativo para ingressar na turma.
                </p>
              </div>

              {/* Descrição */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Descrição / Avisos da Turma (opcional)
                </label>
                <textarea
                  value={classroomDescription}
                  onChange={(e) => setClassroomDescription(e.target.value)}
                  placeholder="Ex: Aulas às terças e quintas. Foco em conversação e desafios práticos."
                  rows={2}
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-primary resize-none"
                />
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsClassroomModalOpen(false)}
                  className="w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-full bg-primary py-3 font-display text-sm font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  💾 {editingClassroom ? "Salvar Alterações" : "Criar Sala de Aula"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================== */}
      {/* MODAL AVANÇADO: PROGRESSO DE ALUNOS         */}
      {/* =========================================== */}
      {selectedClassroomForStudents && (() => {
        const allEnrolled = getStudentsInClassroom(selectedClassroomForStudents.code);
        const filteredStudents = allEnrolled.filter((s) =>
          s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
        );
        const clsWorld = selectedClassroomForStudents.world || "all";
        const activitiesToShow = ALL_TRAIL_ACTIVITIES.filter((act) => {
          if (studentModalWorldFilter === "world1") return act.world === 1;
          if (studentModalWorldFilter === "world2") return act.world === 2;
          if (clsWorld === "ef1") return act.world === 1;
          if (clsWorld === "ef2") return act.world === 2;
          return true;
        });

        const getStudentScore = (student: (typeof allEnrolled)[0], nodeId: number): number | null => {
          const lesson = student.completedLessons?.find(
            (l) => l.id === `trail_node_${nodeId}` || l.id === `les_${nodeId}`
          );
          return lesson ? lesson.score : null;
        };

        const getActivityAvg = (nodeId: number): number | null => {
          const scores = allEnrolled
            .map((s) => getStudentScore(s, nodeId))
            .filter((sc): sc is number => sc !== null);
          if (scores.length === 0) return null;
          return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        };

        const getStudentAvg = (student: (typeof allEnrolled)[0]): number | null => {
          const scores = activitiesToShow
            .map((act) => getStudentScore(student, act.nodeId))
            .filter((sc): sc is number => sc !== null);
          if (scores.length === 0) return null;
          return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        };

        const getCellColors = (score: number | null) => {
          if (score === null) return { bg: "rgba(120,120,140,0.07)", fill: "rgba(120,120,140,0.18)", text: "#9ca3af" };
          if (score >= 80) return { bg: "rgba(16,185,129,0.08)", fill: "rgba(16,185,129,0.55)", text: "#065f46" };
          if (score >= 60) return { bg: "rgba(14,165,233,0.08)", fill: "rgba(14,165,233,0.50)", text: "#0c4a6e" };
          if (score >= 30) return { bg: "rgba(245,158,11,0.08)", fill: "rgba(245,158,11,0.55)", text: "#78350f" };
          return { bg: "rgba(239,68,68,0.08)", fill: "rgba(239,68,68,0.40)", text: "#7f1d1d" };
        };

        const modalSizeClass = isStudentModalFullscreen
          ? "fixed inset-2 z-[60] rounded-2xl"
          : "w-full max-w-6xl rounded-3xl max-h-[90vh]";

        const closeModal = () => {
          setSelectedClassroomForStudents(null);
          setIsStudentModalFullscreen(false);
          setStudentSearchQuery("");
          setStudentModalWorldFilter("all");
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm animate-fade-in">
            <div className={`${modalSizeClass} border border-border bg-card shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>

              {/* ── CABEÇALHO ── */}
              <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 bg-card shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">🏫</span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-extrabold leading-tight truncate">
                      {selectedClassroomForStudents.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>Código: <strong className="text-primary font-mono">{selectedClassroomForStudents.code}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {allEnrolled.length} aluno(s)</span>
                      <span>•</span>
                      <span>{selectedClassroomForStudents.discipline || "LIBRAS"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Filtro de Mundo */}
                  <div className="hidden sm:flex items-center gap-1 rounded-xl border border-border bg-background p-1">
                    {(["all", "world1", "world2"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setStudentModalWorldFilter(f)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold transition-all ${
                          studentModalWorldFilter === f
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f === "all" ? "Todos" : f === "world1" ? "🌍 EF1" : "🚀 EF2"}
                      </button>
                    ))}
                  </div>

                  {/* Busca de aluno */}
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar aluno…"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="w-36 rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>

                  {/* Fullscreen toggle */}
                  <button
                    onClick={() => setIsStudentModalFullscreen((v) => !v)}
                    title={isStudentModalFullscreen ? "Modo janela" : "Tela cheia"}
                    className="rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {isStudentModalFullscreen
                      ? <Minimize2 className="h-4 w-4" />
                      : <Maximize2 className="h-4 w-4" />}
                  </button>

                  {/* Fechar */}
                  <button
                    onClick={closeModal}
                    className="rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ── FILTROS MOBILE ── */}
              <div className="flex sm:hidden items-center gap-2 px-4 py-2 border-b border-border/40 bg-background/50 shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar aluno…"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-7 pr-3 py-1.5 text-xs font-medium outline-none focus:border-primary transition-all"
                  />
                </div>
                <select
                  value={studentModalWorldFilter}
                  onChange={(e) => setStudentModalWorldFilter(e.target.value as "all" | "world1" | "world2")}
                  className="rounded-xl border border-border bg-background px-2 py-1.5 text-xs font-bold outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="world1">🌍 EF1</option>
                  <option value="world2">🚀 EF2</option>
                </select>
              </div>

              {/* ── TABELA MATRIZ ── */}
              {allEnrolled.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-6">
                  <span className="text-5xl mb-4">🎒</span>
                  <h4 className="font-display text-base font-extrabold">Nenhum aluno matriculado ainda</h4>
                  <p className="mt-2 text-xs text-muted-foreground max-w-xs">
                    Compartilhe o código{" "}
                    <strong className="text-primary font-mono">{selectedClassroomForStudents.code}</strong>{" "}
                    com seus alunos para que eles possam ingressar.
                  </p>
                  <button
                    onClick={() => handleCopyCode(selectedClassroomForStudents.code)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-xs font-extrabold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copiar Código
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-auto">
                  <table className="border-collapse" style={{ minWidth: `${280 + activitiesToShow.length * 68 + 72}px` }}>
                    <thead>
                      <tr className="bg-card">
                        <th
                          className="sticky left-0 z-20 bg-card border-b border-r border-border/60 px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
                          style={{ minWidth: 280 }}
                        >
                          Aluno
                        </th>
                        {activitiesToShow.map((act) => (
                          <th
                            key={act.nodeId}
                            className="border-b border-border/40 px-1 py-2 text-center"
                            style={{ width: 68, minWidth: 60 }}
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-base leading-none">{act.icon}</span>
                              <span
                                className="text-[8px] font-extrabold leading-tight text-center text-muted-foreground"
                                style={{ maxWidth: 56 }}
                                title={act.title}
                              >
                                {act.nodeId}. {act.title.length > 10 ? act.title.slice(0, 10) + "…" : act.title}
                              </span>
                              <span className={`text-[7px] font-bold rounded px-1 ${act.world === 1 ? "text-emerald-600 bg-emerald-500/10" : "text-violet-600 bg-violet-500/10"}`}>
                                {act.world === 1 ? "EF1" : "EF2"}
                              </span>
                            </div>
                          </th>
                        ))}
                        <th
                          className="border-b border-l border-border/60 px-2 py-3 text-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
                          style={{ width: 72, minWidth: 72 }}
                        >
                          Média
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={activitiesToShow.length + 2} className="py-10 text-center text-sm text-muted-foreground">
                            Nenhum aluno encontrado para "{studentSearchQuery}".
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student, idx) => {
                          const online = isUserOnline(student);
                          const studentAvg = getStudentAvg(student);
                          const avgColors = getCellColors(studentAvg);
                          const initials = student.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

                          return (
                            <tr
                              key={student.id}
                              className={`group transition-colors hover:bg-primary/5 ${idx % 2 === 0 ? "bg-background" : "bg-card"}`}
                            >
                              {/* Coluna de info (sticky) */}
                              <td
                                className={`sticky left-0 z-10 border-b border-r border-border/40 px-3 py-2.5 ${idx % 2 === 0 ? "bg-background" : "bg-card"} group-hover:bg-primary/5 transition-colors`}
                                style={{ minWidth: 280 }}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="relative shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg leading-none">
                                      {student.avatar && /\p{Emoji}/u.test(student.avatar) ? student.avatar : (
                                        <span className="font-extrabold text-xs text-primary">{initials}</span>
                                      )}
                                    </div>
                                    {online && (
                                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-background" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-display font-extrabold text-xs text-foreground truncate">{student.name}</p>
                                      {online && (
                                        <span className="shrink-0 rounded-full bg-emerald-500/20 px-1.5 text-[8px] font-black text-emerald-600 dark:text-emerald-400">
                                          Online
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground truncate">{student.email}</p>
                                    <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground font-bold">
                                      <span>Nv.{student.level}</span>
                                      <span>⚡{student.xp}XP</span>
                                      <button
                                        onClick={() => setSelectedStudentForLessons(student)}
                                        className="text-blue-500 hover:text-blue-600 hover:underline"
                                      >
                                        📜{student.completedLessons?.length || 0} lições
                                      </button>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveStudentFromClass(student.id, student.name)}
                                    title="Desvincular aluno"
                                    className="ml-auto shrink-0 rounded-lg p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                  >
                                    <UserMinus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>

                              {/* Quadradinhos de Desempenho */}
                              {activitiesToShow.map((act) => {
                                const score = getStudentScore(student, act.nodeId);
                                const colors = getCellColors(score);
                                const pct = score ?? 0;
                                return (
                                  <td
                                    key={act.nodeId}
                                    className="border-b border-border/30 p-1 text-center"
                                    title={`${act.title}\n${score !== null ? `Nota: ${score}%` : "Não concluído"}`}
                                  >
                                    <div
                                      className="relative mx-auto rounded-lg overflow-hidden"
                                      style={{ width: 48, height: 48, background: colors.bg, border: `1px solid ${colors.fill}` }}
                                    >
                                      {/* Preenchimento proporcional: baixo → cima */}
                                      <div
                                        className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out rounded-b-lg"
                                        style={{ height: `${pct}%`, background: colors.fill }}
                                      />
                                      {/* Texto centralizado */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span
                                          className="font-extrabold text-[11px] leading-none"
                                          style={{
                                            color: score !== null ? colors.text : "#9ca3af",
                                            textShadow: score !== null && pct >= 50 ? "0 0 4px rgba(255,255,255,0.7)" : undefined,
                                          }}
                                        >
                                          {score !== null ? `${score}%` : "—"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                );
                              })}

                              {/* Média individual */}
                              <td className="border-b border-l border-border/40 p-1 text-center">
                                <div
                                  className="relative mx-auto rounded-lg overflow-hidden"
                                  style={{ width: 52, height: 48, background: avgColors.bg, border: `2px solid ${avgColors.fill}` }}
                                >
                                  <div
                                    className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-500"
                                    style={{ height: `${studentAvg ?? 0}%`, background: avgColors.fill }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                      className="font-extrabold text-[11px] leading-none"
                                      style={{
                                        color: studentAvg !== null ? avgColors.text : "#9ca3af",
                                        textShadow: studentAvg !== null && studentAvg >= 50 ? "0 0 4px rgba(255,255,255,0.7)" : undefined,
                                      }}
                                    >
                                      {studentAvg !== null ? `${studentAvg}%` : "—"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>

                    {/* Rodapé: Média da turma por atividade */}
                    {allEnrolled.length > 0 && (
                      <tfoot>
                        <tr className="bg-muted/50">
                          <td
                            className="sticky left-0 z-10 bg-muted/50 border-t-2 border-border/70 px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
                          >
                            📊 Média da Turma
                          </td>
                          {activitiesToShow.map((act) => {
                            const avg = getActivityAvg(act.nodeId);
                            const colors = getCellColors(avg);
                            const pct = avg ?? 0;
                            return (
                              <td key={act.nodeId} className="border-t-2 border-border/70 p-1 text-center">
                                <div
                                  className="relative mx-auto rounded-lg overflow-hidden"
                                  style={{ width: 48, height: 40, background: colors.bg, border: `1px solid ${colors.fill}` }}
                                >
                                  <div className="absolute bottom-0 left-0 right-0 rounded-b-lg" style={{ height: `${pct}%`, background: colors.fill }} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                      className="font-extrabold text-[10px]"
                                      style={{
                                        color: avg !== null ? colors.text : "#9ca3af",
                                        textShadow: avg !== null && pct >= 50 ? "0 0 4px rgba(255,255,255,0.5)" : undefined,
                                      }}
                                    >
                                      {avg !== null ? `${avg}%` : "—"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                          <td className="border-t-2 border-l border-border/70 p-1 text-center">
                            {(() => {
                              const allAvgs = activitiesToShow
                                .map((act) => getActivityAvg(act.nodeId))
                                .filter((a): a is number => a !== null);
                              const overallAvg = allAvgs.length > 0
                                ? Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length)
                                : null;
                              const colors = getCellColors(overallAvg);
                              return (
                                <div
                                  className="relative mx-auto rounded-lg overflow-hidden"
                                  style={{ width: 52, height: 40, background: colors.bg, border: `2px solid ${colors.fill}` }}
                                >
                                  <div className="absolute bottom-0 left-0 right-0 rounded-b-lg" style={{ height: `${overallAvg ?? 0}%`, background: colors.fill }} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                      className="font-extrabold text-[10px]"
                                      style={{
                                        color: overallAvg !== null ? colors.text : "#9ca3af",
                                        textShadow: overallAvg !== null && (overallAvg ?? 0) >= 50 ? "0 0 4px rgba(255,255,255,0.5)" : undefined,
                                      }}
                                    >
                                      {overallAvg !== null ? `${overallAvg}%` : "—"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}

              {/* ── RODAPÉ DO MODAL ── */}
              <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 bg-card shrink-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>{allEnrolled.length} aluno(s) matriculado(s)</span>
                  {filteredStudents.length !== allEnrolled.length && (
                    <span>• mostrando {filteredStudents.length}</span>
                  )}
                  <div className="hidden sm:flex items-center gap-3">
                    {[
                      { label: "≥80%", color: "rgba(16,185,129,0.55)" },
                      { label: "60–79%", color: "rgba(14,165,233,0.50)" },
                      { label: "30–59%", color: "rgba(245,158,11,0.55)" },
                      { label: "<30%", color: "rgba(239,68,68,0.40)" },
                    ].map(({ label, color }) => (
                      <div key={label} className="flex items-center gap-1">
                        <div className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
                        <span className="text-[10px]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-extrabold text-primary-foreground shadow-soft hover:opacity-90 transition-opacity"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================== */}
      {/* MODAL RELATÓRIO DE LIÇÕES DO ALUNO        */}
      {/* ========================================== */}
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
                <X className="h-5 w-5" />
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

      {/* ========================================== */}
      {/* MODAL CONFIRMAÇÃO EXCLUSÃO DE SALA         */}
      {/* ========================================== */}
      {classroomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-3xl text-red-500">
                ⚠️
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold">Excluir Sala de Aula?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tem certeza que deseja excluir a sala{" "}
                <strong className="text-foreground">"{classroomToDelete.name}"</strong> (Código: {classroomToDelete.code})?
                Os alunos matriculados serão desvinculados da sala.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setClassroomToDelete(null)}
                className="w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteClassroom}
                className="w-1/2 rounded-full bg-red-600 py-3 font-display text-sm font-extrabold text-white shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                Sim, Excluir Sala 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL CONFIRMAÇÃO EXCLUSÃO DE PROFESSOR   */}
      {/* ========================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-3xl text-red-500">
                ⚠️
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold">Deletar Professor(a)?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tem certeza que deseja excluir a conta do(a) professor(a){" "}
                <strong className="text-foreground">"{userToDelete.name}"</strong> ({userToDelete.email})?
                Esta ação é irreversível.
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