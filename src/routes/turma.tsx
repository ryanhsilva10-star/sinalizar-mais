import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getActiveUser,
  getClassroomAggregatedDashboard,
  leaveClassroom,
  subscribeToUserChanges,
  ClanAggregatedDashboard,
  User,
} from "@/lib/user-store";
import { JoinClassroomModal } from "@/components/JoinClassroomModal";
import Footer from "@/components/Footer";
import {
  Shield,
  Users,
  Sparkles,
  Trophy,
  ArrowRight,
  RotateCw,
  LogOut,
  Lock,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  Flame,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/turma")({
  head: () => ({
    meta: [
      { title: "Painel da Turma / Clã · sinaliza mais LIBRAS" },
      {
        name: "description",
        content:
          "Acompanhe o progresso colaborativo da sua turma e compare seu desempenho individual com a média geral do Clã em LIBRAS.",
      },
    ],
  }),
  component: TurmaDashboardPage,
});

function TurmaDashboardPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(() => getActiveUser());
  const [dashboardData, setDashboardData] = useState<ClanAggregatedDashboard | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [filterWorld, setFilterWorld] = useState<"all" | "world1" | "world2">("all");

  const refreshData = () => {
    const user = getActiveUser();
    setCurrentUser(user);

    if (!user) {
      toast.error("🔒 Faça login como aluno para acessar o painel da Turma/Clã.");
      navigate({ to: "/login", replace: true });
      return;
    }

    if (user.role === "professor") {
      toast.info("Professores gerenciam as turmas através do Onboarding.");
      navigate({ to: "/onboarding", replace: true });
      return;
    }

    if (user.classroomCode) {
      const data = getClassroomAggregatedDashboard(user.classroomCode, user.id);
      setDashboardData(data);
    } else {
      setDashboardData(null);
    }
  };

  useEffect(() => {
    refreshData();

    // Observer: recarrega métricas imediatamente caso haja alteração de lições ou salas
    const unsubscribe = subscribeToUserChanges(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleConfirmLeave = () => {
    if (!currentUser) return;
    leaveClassroom(currentUser.id);
    setIsLeaveModalOpen(false);
    toast.info("Você saiu da turma.");
    refreshData();
  };

  if (!currentUser) return null;

  // CASO 1: Aluno logado, mas ainda não cadastrado em nenhuma turma
  if (!currentUser.classroomCode || !dashboardData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md py-4 px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link to="/trilha" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft">
                S
              </span>
              <span className="font-display text-2xl font-extrabold">sinaliza mais</span>
            </Link>
            <Link
              to="/trilha"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-1.5 text-xs font-extrabold hover:bg-muted"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar para a Trilha</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-lg w-full px-4 py-16 text-center">
          <div className="rounded-3xl border-2 border-dashed border-primary/40 bg-card p-8 shadow-xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-5xl shadow-inner animate-bounce-soft">
              🛡️
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              Você ainda não entrou em uma Turma/Clã
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Junte-se à sua turma de LIBRAS para acompanhar o progresso coletivo das lições e somar pontos de XP com seus colegas!
            </p>

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5"
            >
              <Sparkles className="h-5 w-5" />
              <span>Digitar Código da Turma</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </main>

        <JoinClassroomModal
          open={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
          onSuccess={refreshData}
        />

        <Footer />
      </div>
    );
  }

  // CASO 2: Aluno matriculado na turma -> Exibe Dashboard com Métricas Agregadas
  const { classroom, activities, totalMembers, clanTotalXp, clanAverageLevel, clanOverallCompletionRate, myOverallCompletionRate, myCompletedCount } = dashboardData;

  const filteredActivities = activities.filter((act) => {
    if (filterWorld === "world1") return act.world === 1;
    if (filterWorld === "world2") return act.world === 2;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft">
              S
            </span>
            <span className="font-display text-2xl font-extrabold">sinaliza mais</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/trilha"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-extrabold hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Trilha de Sinais</span>
            </Link>

            <Link
              to="/student/profile"
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-extrabold hover:bg-muted"
            >
              <span>{currentUser.avatar}</span>
              <span className="hidden sm:inline">{currentUser.name}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-8 animate-fade-in">
        {/* HERO CARD DO CLÃ / TURMA */}
        <section className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-rainbow text-3xl text-white shadow-chunky">
                🛡️
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/15 px-3 py-0.5 text-[10px] font-black uppercase text-primary tracking-wider">
                    Turma / Clã Oficial
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground font-mono">
                    Código: {classroom.code}
                  </span>
                </div>

                <h1 className="mt-1 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
                  {classroom.name}
                </h1>

                <p className="mt-1 text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>🧑‍🏫 Mentor(a): <strong className="text-foreground">{classroom.teacherName}</strong></span>
                  <span>•</span>
                  <span>📚 {classroom.discipline || "LIBRAS & Inclusão"}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex items-center gap-1.5 self-start md:self-center rounded-2xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors"
              title="Sair desta sala"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair da Turma</span>
            </button>
          </div>

          {/* GRID DE MÉTRICAS COLETIVAS DO CLÃ (DADOS AGREGADOS) */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60">
            <div className="rounded-2xl bg-muted/50 p-3.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Membros do Clã
              </span>
              <p className="mt-0.5 font-display text-xl sm:text-2xl font-black text-foreground flex items-center justify-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span>{totalMembers}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-muted/50 p-3.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                XP Coletivo da Turma
              </span>
              <p className="mt-0.5 font-display text-xl sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1.5">
                <Flame className="h-4 w-4" />
                <span>{clanTotalXp}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-muted/50 p-3.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Média Geral da Turma
              </span>
              <p className="mt-0.5 font-display text-xl sm:text-2xl font-black text-indigo-500 dark:text-indigo-400 flex items-center justify-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>{clanOverallCompletionRate}%</span>
              </p>
            </div>

            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                Meu Progresso Geral
              </span>
              <p className="mt-0.5 font-display text-xl sm:text-2xl font-black text-primary flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{myOverallCompletionRate}%</span>
              </p>
            </div>
          </div>
        </section>

        {/* AVISO DE PRIVACIDADE E SEGURANÇA */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
          <Shield className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p>
            <strong>Privacidade Garantida:</strong> Em conformidade com as regras da turma, você visualiza apenas as <strong>médias coletivas agregadas</strong> da sala. Nomes, notas individuais e informações de colegas nunca são revelados.
          </p>
        </div>

        {/* SELETOR DE MUNDOS / FILTRO DE ATIVIDADES */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold flex items-center gap-2">
              <span>📜 Painel de Progresso das Atividades</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compare seu progresso individual com a média de conclusão geral da turma em cada lição.
            </p>
          </div>

          <div className="inline-flex rounded-2xl bg-muted/60 p-1 shadow-inner gap-1">
            <button
              onClick={() => setFilterWorld("all")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${filterWorld === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Todas ({activities.length})
            </button>
            <button
              onClick={() => setFilterWorld("world1")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${filterWorld === "world1"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              🦊 Mundo 1 (12)
            </button>
            <button
              onClick={() => setFilterWorld("world2")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${filterWorld === "world2"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              🚀 Mundo 2 (12)
            </button>
          </div>
        </div>

        {/* LISTA DAS 24 ATIVIDADES COM DUAS MÉTRICAS VISUAIS CADA */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredActivities.map((act) => {
            return (
              <div
                key={`${act.world}-${act.nodeId}`}
                className="flex flex-col justify-between rounded-3xl border-2 border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  {/* Topo do Card de Atividade */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-2xl shadow-inner shrink-0">
                        {act.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Fase {act.nodeId} • {act.world === 1 ? "Mundo 1 (EF1)" : "Mundo 2 (EF2)"}
                        </span>
                        <h3 className="font-display text-base font-extrabold text-foreground leading-snug">
                          {act.title}
                        </h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{act.subtitle}</p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${act.kind === "chefe"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : act.kind === "espelho"
                            ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                            : act.kind === "revisao"
                              ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                              : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      {act.kind === "chefe"
                        ? "Chefe"
                        : act.kind === "espelho"
                          ? "Espelho IA"
                          : act.kind === "revisao"
                            ? "Revisão"
                            : "Micro-lição"}
                    </span>
                  </div>

                  {/* DUAS BARRAS DE MÉTRICAS VISUAIS (MEU PROGRESSO vs PROGRESSO DA TURMA) */}
                  <div className="mt-4 space-y-3 rounded-2xl bg-muted/30 p-3.5 border border-border/50">
                    {/* MÉTRICA 1: MEU PROGRESSO INDIVIDUAL */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold flex items-center gap-1 text-foreground">
                          <span>👤</span> Meu Progresso:
                        </span>
                        <span
                          className={`font-black text-xs ${act.myCompleted ? "text-emerald-500" : "text-muted-foreground"
                            }`}
                        >
                          {act.myCompleted ? `Concluído (${act.myScore}%)` : "Pendente (0%)"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${act.myCompleted ? "bg-emerald-500" : "bg-muted-foreground/20"
                            }`}
                          style={{ width: `${act.myCompleted ? act.myScore : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* MÉTRICA 2: PROGRESSO DA TURMA / CLÃ */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold flex items-center gap-1 text-foreground">
                          <span>👥</span> Progresso da Turma:
                        </span>
                        <span className="font-black text-xs text-indigo-500 dark:text-indigo-400">
                          {act.turmaCompletionPercentage}% da turma concluiu
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                          style={{ width: `${act.turmaCompletionPercentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                        <span>Aproveitamento médio dos colegas:</span>
                        <strong className="text-foreground">{act.turmaAverageScore}%</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTÃO DE AÇÃO DA ATIVIDADE */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-end">
                  <Link
                    to="/licao"
                    search={{ nodeId: act.nodeId }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-transform hover:-translate-y-0.5 active:translate-y-0.5 shadow-soft ${act.myCompleted
                        ? "border border-border bg-background hover:bg-muted text-foreground"
                        : "bg-primary text-primary-foreground shadow-chunky"
                      }`}
                  >
                    {act.myCompleted ? (
                      <>
                        <RotateCw className="h-3 w-3" />
                        <span>Praticar Novamente</span>
                      </>
                    ) : (
                      <>
                        <span>Iniciar Atividade</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL DE CONFIRMAÇÃO PARA SAIR DA TURMA */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-3xl text-red-500">
              ⚠️
            </span>
            <h3 className="mt-4 font-display text-2xl font-extrabold">Sair da Turma/Clã?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza que deseja sair da turma <strong className="text-foreground">"{classroom.name}"</strong>?
              Você poderá ingressar novamente mais tarde com o código da sala.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLeave}
                className="w-1/2 rounded-full bg-red-600 py-3 font-display text-sm font-extrabold text-white shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                Sim, Sair 🚪
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
