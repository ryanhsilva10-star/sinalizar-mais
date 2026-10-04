import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import luviMascot from "@/assets/luvi-mascot.png";
import { ParallaxTrailMap, type TrailNode } from "@/components/ParallaxTrailMap";
import { AlphabetReferenceModal } from "@/components/AlphabetReferenceModal";
import { soundFx } from "@/lib/sound-effects";
import { getActiveUser, loginUser, logoutUser, User, regenerateLives, saveUser, onUserChange } from "@/lib/user-store";
import { toast } from "sonner";
import { JoinClassroomFab } from "@/components/JoinClassroomFab";
import { TurmaClaNavbarButton } from "@/components/TurmaClaNavbarButton";
import { BookOpen } from "lucide-react";

type TrilhaSearch = {
  world?: number;
};

export const Route = createFileRoute("/trilha")({
  validateSearch: (search: Record<string, unknown>): TrilhaSearch => {
    const raw = search?.world;
    const parsed = typeof raw === "number" ? raw : parseInt(String(raw || ""), 10);
    return {
      world: parsed === 1 || parsed === 2 ? parsed : 1,
    };
  },
  head: () => ({
    meta: [
      { title: "Minha Trilha de LIBRAS com Mapa 3D · sinaliza mais" },
      {
        name: "description",
        content:
          "Mapa interativo de aventura com micro-lições de LIBRAS: saudações, alfabeto, cores, bichos e família com efeitos de parallax e gamificação.",
      },
      { property: "og:title", content: "Minha Trilha de LIBRAS · sinaliza mais" },
      {
        property: "og:description",
        content: "Avance pelo mapa interativo aprendendo LIBRAS com micro-lições gamificadas.",
      },
    ],
  }),
  component: TrailPage,
});

type Island = {
  id: number;
  name: string;
  subtitle: string;
  tone: string;
  nodes: TrailNode[];
};

// MUNDO 1: ALFABETO DOS BICHINHOS (Fases 1 a 12 - Letras A a R)
const TRAIL_NODES_BASE_WORLD1: Omit<TrailNode, "state" | "stars">[] = [
  // Ilha das Primeiras Letras (1-4)
  { id: 1, islandId: 1, islandName: "Ilha das Primeiras Letras", title: "Letras A, B, C", icon: "🦫", kind: "licao", x: 10, y: 88 },
  { id: 2, islandId: 1, islandName: "Ilha das Primeiras Letras", title: "Letras D, E, F", icon: "🦖", kind: "licao", x: 22, y: 76 },
  { id: 3, islandId: 1, islandName: "Ilha das Primeiras Letras", title: "Revisão: A, B, C", icon: "⚡", kind: "revisao", x: 34, y: 64 },
  { id: 4, islandId: 1, islandName: "Ilha das Primeiras Letras", title: "Chefe: D, E, F", icon: "🏆", kind: "chefe", x: 40, y: 54 },
  // Ilha dos Bichinhos do Meio (5-8)
  { id: 5, islandId: 2, islandName: "Ilha dos Bichinhos do Meio", title: "Letras G, H, I", icon: "🦒", kind: "licao", x: 48, y: 48 },
  { id: 6, islandId: 2, islandName: "Ilha dos Bichinhos do Meio", title: "Letras J, K, L", icon: "🦁", kind: "licao", x: 57, y: 52 },
  { id: 7, islandId: 2, islandName: "Ilha dos Bichinhos do Meio", title: "Espelho IA: G, H, I", icon: "🪞", kind: "espelho", x: 67, y: 54 },
  { id: 8, islandId: 2, islandName: "Ilha dos Bichinhos do Meio", title: "Chefe: J, K, L", icon: "👑", kind: "chefe", x: 76, y: 45 },
  // Ilha das Letras do Castelo (9-12)
  { id: 9, islandId: 3, islandName: "Ilha das Letras do Castelo", title: "Letras M, N, O", icon: "🐵", kind: "licao", x: 70, y: 35 },
  { id: 10, islandId: 3, islandName: "Ilha das Letras do Castelo", title: "Letras P, Q, R", icon: "🐼", kind: "licao", x: 62, y: 25 },
  { id: 11, islandId: 3, islandName: "Ilha das Letras do Castelo", title: "Revisão: M, N, O", icon: "⚡", kind: "revisao", x: 68, y: 18 },
  { id: 12, islandId: 3, islandName: "Ilha das Letras do Castelo", title: "Chefe Mundo 1: P, Q, R", icon: "🏰", kind: "chefe", x: 80, y: 13 },
];

// MUNDO 2: O CASTELO DOS BICHINHOS AVENTUREIROS (Fases 13 a 24 - Letras S a Z e Maestria)
const TRAIL_NODES_BASE_WORLD2: Omit<TrailNode, "state" | "stars">[] = [
  // Ilha dos Bichos Aventureiros (13-16)
  { id: 13, islandId: 4, islandName: "Ilha dos Bichos Aventureiros", title: "Letras S, T, U", icon: "🐸", kind: "licao", x: 12, y: 84 },
  { id: 14, islandId: 4, islandName: "Ilha dos Bichos Aventureiros", title: "Letras V, W, X", icon: "🐮", kind: "licao", x: 25, y: 72 },
  { id: 15, islandId: 4, islandName: "Ilha dos Bichos Aventureiros", title: "Revisão: S, T, U", icon: "⚡", kind: "revisao", x: 38, y: 60 },
  { id: 16, islandId: 4, islandName: "Ilha dos Bichos Aventureiros", title: "Chefe: V, W, X", icon: "🏠", kind: "chefe", x: 44, y: 50 },
  // Ilha dos Sinais Dinâmicos (17-20)
  { id: 17, islandId: 5, islandName: "Ilha dos Sinais Dinâmicos", title: "Letras Y, Z, A", icon: "🦬", kind: "licao", x: 54, y: 46 },
  { id: 18, islandId: 5, islandName: "Ilha dos Sinais Dinâmicos", title: "Dinâmicos: H, J, Z", icon: "🔄", kind: "licao", x: 64, y: 52 },
  { id: 19, islandId: 5, islandName: "Ilha dos Sinais Dinâmicos", title: "Espelho IA: F, T, S", icon: "🪞", kind: "espelho", x: 74, y: 46 },
  { id: 20, islandId: 5, islandName: "Ilha dos Sinais Dinâmicos", title: "Chefe: K, P, D", icon: "🕊️", kind: "chefe", x: 80, y: 36 },
  // O Portão Real do Trono A-Z (21-24)
  { id: 21, islandId: 6, islandName: "O Portão Real do Trono A-Z", title: "Dedos Unidos: R, U, V", icon: "✌️", kind: "licao", x: 70, y: 26 },
  { id: 22, islandId: 6, islandName: "O Portão Real do Trono A-Z", title: "Dedos p/ Baixo: M, N, W", icon: "👇", kind: "licao", x: 60, y: 18 },
  { id: 23, islandId: 6, islandName: "O Portão Real do Trono A-Z", title: "Super Revisão: A, L, Y", icon: "⚡", kind: "revisao", x: 68, y: 12 },
  { id: 24, islandId: 6, islandName: "O Portão Real do Trono A-Z", title: "Grande Trono: X, Y, Z", icon: "👑", kind: "chefe", x: 82, y: 8 },
];

const ISLANDS_WORLD1: Island[] = [
  { id: 1, name: "Ilha das Primeiras Letras", subtitle: "Aprenda A, B, C e D, E, F com os mascotes", tone: "bg-sky", nodes: [] },
  { id: 2, name: "Ilha dos Bichinhos do Meio", subtitle: "Aprenda G, H, I e J, K, L em LIBRAS", tone: "bg-grape", nodes: [] },
  { id: 3, name: "Ilha das Letras do Castelo", subtitle: "Aprenda M, N, O e P, Q, R com a turma", tone: "bg-neon", nodes: [] },
];

const ISLANDS_WORLD2: Island[] = [
  { id: 4, name: "Ilha dos Bichos Aventureiros", subtitle: "Aprenda S, T, U e V, W, X em LIBRAS", tone: "bg-coral", nodes: [] },
  { id: 5, name: "Ilha dos Sinais Dinâmicos", subtitle: "Letras Y, Z, Movimentos e Desafios de Polegar", tone: "bg-sunshine", nodes: [] },
  { id: 6, name: "O Portão Real do Trono A-Z", subtitle: "Domínio completo do alfabeto manual em LIBRAS", tone: "bg-sky", nodes: [] },
];

/** Calcula o estado dinâmico dos nós com base nas lições concluídas do usuário e no mundo ativo. */
function computeNodes(
  completedLessons: import("@/lib/user-store").CompletedLesson[],
  world: 1 | 2,
  isTeacher: boolean = false
): TrailNode[] {
  const completedIds = new Set(completedLessons.map((l) => l.id));
  const baseNodes = world === 1 ? TRAIL_NODES_BASE_WORLD1 : TRAIL_NODES_BASE_WORLD2;

  // No Mundo 2, se o Mundo 1 não foi concluído (Fase 12), todas as fases ficam travadas (se não for professor)
  const isWorld1Completed = completedIds.has("trail_node_12") || completedIds.has("les_12");

  let foundCurrent = false;

  return baseNodes.map((base) => {
    const lessonId = `trail_node_${base.id}`;
    const legacyId = `les_${base.id}`;
    const isDone = completedIds.has(lessonId) || completedIds.has(legacyId);

    if (isDone) {
      const lesson = completedLessons.find((l) => l.id === lessonId || l.id === legacyId);
      const stars = lesson ? (lesson.score >= 90 ? 3 : lesson.score >= 60 ? 2 : 1) : 1;
      return { ...base, state: "done" as const, stars };
    }

    if (isTeacher) {
      return { ...base, state: "current" as const, stars: 0 };
    }

    if (world === 2 && !isWorld1Completed) {
      return { ...base, state: "locked" as const, stars: 0 };
    }

    if (!foundCurrent) {
      foundCurrent = true;
      return { ...base, state: "current" as const, stars: 0 };
    }

    return { ...base, state: "locked" as const, stars: 0 };
  });
}

function buildIslands(nodes: TrailNode[], world: 1 | 2): Island[] {
  const template = world === 1 ? ISLANDS_WORLD1 : ISLANDS_WORLD2;
  return template.map((island) => ({
    ...island,
    nodes: nodes.filter((n) => n.islandId === island.id),
  }));
}

const KIND_LABEL: Record<TrailNode["kind"], string> = {
  licao: "Micro-lição · 3 min",
  revisao: "Revisão espaçada",
  espelho: "Câmera + IA",
  chefe: "Chefe da ilha",
};

function TrailPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isValidating, setIsValidating] = useState(true);
  const [authorizedUser, setAuthorizedUser] = useState<User | null>(null);

  // Estado do Mundo ativo (1: Cores & Bichos, 2: Castelo da Família & Expressões)
  const [activeWorld, setActiveWorld] = useState<1 | 2>(1);
  const [isWorld2Unlocked, setIsWorld2Unlocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // Nós e ilhas calculados dinamicamente pelo progresso do usuário
  const [trailNodes, setTrailNodes] = useState<TrailNode[]>([]);
  const [islands, setIslands] = useState<Island[]>(ISLANDS_WORLD1);

  const [selected, setSelected] = useState<TrailNode | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [isAlphabetModalOpen, setIsAlphabetModalOpen] = useState(false);

  // Guarda de Rota: Apenas Alunos Autenticados têm acesso à Trilha
  useEffect(() => {
    let user = getActiveUser();

    // 1. Não autenticado -> Concede acesso direto com Aluno de demonstração para acesso sem fricção
    if (!user) {
      user = loginUser("luizinho@sinalizamais.com", "123");
      if (user) {
        toast.info("👋 Bem-vindo(a) à sua primeira trilha de LIBRAS!");
      } else {
        toast.error("🔒 Faça login como Aluno para acessar as trilhas de LIBRAS.");
        navigate({ to: "/login", replace: true });
        return;
      }
    }

    // Regenera vidas passivas do usuário caso o tempo tenha passado
    if (user) {
      const { lives: regLives, lastLiveLostAt: regLast } = regenerateLives(user);
      if (regLives !== user.lives) {
        user = saveUser({ ...user, lives: regLives, lastLiveLostAt: regLast });
      }
    }

    // 3. Autenticado -> Calcula progresso e concede acesso
    const isTeacher = user.role === "professor";
    const lessons = user.completedLessons ?? [];
    const completedSet = new Set(lessons.map((l) => l.id));
    const unlocked2 = isTeacher || completedSet.has("trail_node_12") || completedSet.has("les_12");
    setIsWorld2Unlocked(unlocked2);

    // Se o usuário especificou mundo na busca ou já concluiu o Mundo 1
    const targetWorld: 1 | 2 = (search.world as 1 | 2) || (unlocked2 ? 2 : 1);
    setActiveWorld(targetWorld);

    const computed = computeNodes(lessons, targetWorld, isTeacher);
    setTrailNodes(computed);
    setIslands(buildIslands(computed, targetWorld));
    setAuthorizedUser(user);
    setIsValidating(false);

    // Listener para atualizações de vidas, streak e XP em tempo real
    const unsub = onUserChange(() => {
      const refreshed = getActiveUser();
      if (refreshed) {
        setAuthorizedUser(refreshed);
      }
    });

    return () => {
      unsub();
    };
  }, [navigate, search.world]);

  // Recalcula nós e ilhas ao alternar de mundo
  const handleSelectWorld = (worldNum: 1 | 2) => {
    soundFx.playPop();
    if (worldNum === 2 && !isWorld2Unlocked) {
      setShowLockModal(true);
      return;
    }
    setActiveWorld(worldNum);
    if (authorizedUser) {
      const isTeacher = authorizedUser.role === "professor";
      const lessons = authorizedUser.completedLessons ?? [];
      const computed = computeNodes(lessons, worldNum, isTeacher);
      setTrailNodes(computed);
      setIslands(buildIslands(computed, worldNum));
    }
  };

  const handleToggleMute = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundFx.playPop();
  };

  const handleSelectNode = (node: TrailNode) => {
    setSelected(node);
  };

  // Enquanto valida ou se não autorizado, não exibe nenhum elemento da trilha
  if (isValidating || !authorizedUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 font-display text-sm font-extrabold text-muted-foreground">
            Verificando permissões de acesso à trilha...
          </p>
        </div>
      </div>
    );
  }

  const completedCount = trailNodes.filter((n) => n.state === "done").length;
  const progressPercent = Math.round((completedCount / trailNodes.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-hero pb-24 text-foreground selection:bg-primary/20">
      {/* Top Header with Stats and Controls */}
      <TrailHeader
        user={authorizedUser}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        viewMode={viewMode}
        onToggleView={setViewMode}
        onOpenAlphabet={() => setIsAlphabetModalOpen(true)}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Selector de Mundos (Abas de Navegação) */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <button
            onClick={() => handleSelectWorld(1)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 font-display text-xs sm:text-sm font-black transition-all ${activeWorld === 1
                ? "bg-primary text-primary-foreground shadow-chunky scale-105"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground shadow-soft"
              }`}
          >
            <span>🐾</span>
            <span className="hidden sm:inline">Mundo 1: Alfabeto dos Bichinhos (A-R)</span>
            <span className="sm:hidden">Mundo 1 (A-R)</span>
          </button>

          <button
            onClick={() => handleSelectWorld(2)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 font-display text-xs sm:text-sm font-black transition-all ${activeWorld === 2
                ? "bg-gradient-rainbow text-white shadow-chunky scale-105"
                : isWorld2Unlocked
                  ? "bg-card text-foreground hover:bg-muted shadow-soft"
                  : "bg-muted/80 text-muted-foreground cursor-pointer shadow-soft opacity-80"
              }`}
          >
            <span>👑</span>
            <span className="hidden sm:inline">Mundo 2: O Trono do Alfabeto (S-Z)</span>
            <span className="sm:hidden">Mundo 2 (S-Z)</span>
            {!isWorld2Unlocked && <span className="ml-1 text-xs">🔒</span>}
            {isWorld2Unlocked && <span className="ml-1 text-xs">✨</span>}
          </button>
        </div>

        {/* World Banner Progress */}
        <section className="mb-6 flex flex-col items-center gap-4 rounded-4xl bg-card p-6 shadow-soft sm:flex-row sm:gap-6">
          <img
            src={luviMascot}
            alt="Luvi, mascote do sinaliza mais, acenando"
            width={1024}
            height={1024}
            className="w-20 shrink-0 animate-bounce-soft sm:w-24"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-2xl font-black text-foreground">
                {activeWorld === 1
                  ? "Mundo 1: Alfabeto dos Bichinhos"
                  : "Mundo 2: O Grande Trono do Alfabeto"}
              </h1>
              <span className="rounded-full bg-amber-100 px-3 py-0.5 font-display text-xs font-black text-amber-800">
                Ilha {islands.findIndex((isl) => isl.nodes.some((n) => n.state === "current")) + 1} de {islands.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeWorld === 1
                ? completedCount === 0
                  ? "Bem-vindo(a)! Aprenda o alfabeto em LIBRAS, 3 letras por lição com os bichinhos! 🐾"
                  : `Você completou ${completedCount} de ${trailNodes.length} lições do Mundo 1. Continue avançando! 🌟`
                : isWorld2Unlocked
                  ? `Bem-vindo ao Trono Real! Você completou ${completedCount} de ${trailNodes.length} lições do Mundo 2! 👑`
                  : "Conclua a Fase 12 na Ilha das Letras do Castelo para abrir os portões do Mundo 2! 🔒"}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-muted shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-rainbow transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-display text-xs font-black text-muted-foreground">
                {progressPercent}% concluído
              </span>
            </div>
          </div>
        </section>

        {/* View Mode: Interactive Parallax 3D Map or Classic List */}
        {viewMode === "map" ? (
          <section className="mb-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-black">Mapa de Aventura Interativo</h2>
                <p className="text-xs text-muted-foreground">
                  {activeWorld === 1
                    ? "Explore o relevo das ilhas e clique nos nós para aprender LIBRAS"
                    : "Explore o pátio real e os salões do Castelo da Família & Expressões"}
                </p>
              </div>

              {/* Day / Sunset / Night quick toggle */}
              <div className="flex items-center gap-1 rounded-2xl bg-card p-1 shadow-soft">
                <button
                  onClick={() => {
                    setTimeOfDay("day");
                    soundFx.playPop();
                  }}
                  className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all ${timeOfDay === "day"
                      ? "bg-amber-400 text-amber-950 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                  title="Dia Ensolarado"
                >
                  ☀️ Dia
                </button>
                <button
                  onClick={() => {
                    setTimeOfDay("sunset");
                    soundFx.playPop();
                  }}
                  className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all ${timeOfDay === "sunset"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                  title="Pôr do Sol"
                >
                  🌅 Ocaso
                </button>
                <button
                  onClick={() => {
                    setTimeOfDay("night");
                    soundFx.playPop();
                  }}
                  className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all ${timeOfDay === "night"
                      ? "bg-indigo-900 text-indigo-100 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                  title="Noite Estrelada"
                >
                  🌙 Noite
                </button>
              </div>
            </div>

            {/* Interactive Dynamic Parallax Canvas */}
            <ParallaxTrailMap
              nodes={trailNodes}
              selectedNode={selected}
              onSelectNode={handleSelectNode}
              timeOfDay={timeOfDay}
            />

            {/* Islands Quick Overview Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {islands.map((island) => {
                const doneCount = island.nodes.filter((n) => n.state === "done").length;
                const isCurrent = island.nodes.some((n) => n.state === "current");
                return (
                  <div
                    key={island.id}
                    className={`rounded-3xl border-2 p-4 transition-all ${isCurrent
                        ? "border-emerald-300 bg-card/60 shadow-soft"
                        : doneCount === island.nodes.length
                          ? "border-emerald-400  bg-card/60 shadow-soft"
                          : "border-emerald-200 bg-card/60 shadow-soft"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-2xl ${island.tone} font-display text-lg font-black shadow-sm`}
                      >
                        {island.id}
                      </span>
                      <div>
                        <div className="font-display text-sm font-black">{island.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {doneCount}/{island.nodes.length} lições completas
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* Classic Island List Mode */
          <div className="space-y-14">
            {islands.map((island, ii) => (
              <IslandBlock
                key={island.name}
                island={island}
                index={ii}
                onSelect={handleSelectNode}
              />
            ))}
          </div>
        )}

        {/* Dynamic Bottom World Transition Banner */}
        {activeWorld === 1 ? (
          <div
            onClick={() => handleSelectWorld(2)}
            className={`mt-12 cursor-pointer rounded-4xl border-4 p-8 text-center backdrop-blur-sm shadow-lg transition-transform hover:scale-[1.01] ${isWorld2Unlocked
                ? "border-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/20"
                : "border-dashed border-border bg-card/40"
              }`}
          >
            <div className="text-4xl animate-bounce-soft">
              {isWorld2Unlocked ? "🏰✨" : "🏰🔒"}
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold">
              Mundo 2: O Castelo da Família e Expressões
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              {isWorld2Unlocked
                ? "Parabéns! O Portão do Castelo está aberto! Clique para explorar o Mundo 2!"
                : "Termine a jornada na Ilha dos Bichos (Fase 12) para cruzar o portão do castelo e desbloquear novas aventuras!"}
            </p>
            <button
              className={`mt-4 rounded-full px-6 py-2.5 font-display text-xs font-black shadow-soft ${isWorld2Unlocked
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
            >
              {isWorld2Unlocked ? "Entrar no Castelo 🏰" : "Ver Portão do Castelo 🔒"}
            </button>
          </div>
        ) : (
          <div
            onClick={() => handleSelectWorld(1)}
            className="mt-12 cursor-pointer rounded-4xl border-2 border-sky-300 bg-sky-500/10 p-6 text-center shadow-lg transition-transform hover:scale-[1.01]"
          >
            <div className="text-3xl">🌊</div>
            <h3 className="mt-2 font-display text-lg font-extrabold text-sky-900 dark:text-sky-200">
              Voltar ao Mundo 1: Cores &amp; Bichos
            </h3>
            <p className="mt-1 text-xs text-sky-700 dark:text-sky-300">
              Revise lições de saudações, cores e animais a qualquer momento!
            </p>
          </div>
        )}
      </main>

      {/* Modal de Alerta de Portão Trancado */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
          <div className="animate-pop relative w-full max-w-md rounded-4xl bg-card p-8 shadow-chunky text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-100 text-4xl shadow-chunky">
              🏰🔒
            </div>
            <h2 className="mt-4 font-display text-2xl font-black text-foreground">
              Portão do Castelo Trancado!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Para cruzar o portão do castelo e explorar o <strong>Mundo 2: O Castelo da Família e Expressões</strong>, você precisa vencer o desafio final da Ilha dos Bichos no Mundo 1!
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowLockModal(false);
                  handleSelectWorld(1);
                }}
                className="rounded-full bg-primary px-6 py-3 font-display text-sm font-black text-primary-foreground shadow-chunky transition-transform hover:scale-105"
              >
                Ir para a Fase 12 (Chefe da Ilha dos Bichos)
              </button>
              <button
                onClick={() => setShowLockModal(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Entendi, continuar no Mundo 1
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Node Detail Sheet Modal */}
      {selected && <NodeSheet node={selected} onClose={() => setSelected(null)} />}

      {/* Modal Interativo do Alfabeto Oficial LIBRAS */}
      <AlphabetReferenceModal
        isOpen={isAlphabetModalOpen}
        onClose={() => setIsAlphabetModalOpen(false)}
      />

      {/* Botão flutuante para entrar em sala de aula */}
      <JoinClassroomFab />
    </div>
  );
}

function TrailHeader({
  user,
  timeOfDay,
  setTimeOfDay,
  isMuted,
  onToggleMute,
  viewMode,
  onToggleView,
  onOpenAlphabet,
}: {
  user: User | null;
  timeOfDay: "day" | "sunset" | "night";
  setTimeOfDay: (t: "day" | "sunset" | "night") => void;
  isMuted: boolean;
  onToggleMute: () => void;
  viewMode: "map" | "list";
  onToggleView: (v: "map" | "list") => void;
  onOpenAlphabet?: () => void;
}) {
  const streakVal = user?.streak ?? 1;
  const xpVal = user?.xp ?? 0;
  const livesVal = user?.lives ?? 5;

  const [showBottomNav, setShowBottomNav] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastScrollY = window.scrollY;
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Esconde a nav se scrollar para baixo (mais de 50px de margem)
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowBottomNav(false);
      } else {
        // Mostra a nav se scrollar para cima
        setShowBottomNav(true);
      }
      lastScrollY = currentScrollY;

      // Oculta automaticamente após 3 segundos sem interação na tela
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.scrollY > 50) {
          setShowBottomNav(false);
        }
      }, 3000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", () => setShowBottomNav(true), { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", () => setShowBottomNav(true));
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
          <Link to="/" className="flex items-center gap-2" aria-label="sinaliza mais, início">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-rainbow font-display text-lg font-extrabold text-primary-foreground shadow-sm">
              S
            </span>
            <span className="hidden font-display text-lg font-extrabold sm:block">sinaliza mais</span>
          </Link>

          {/* View Mode switcher - HIDDEN ON MOBILE (moved to bottom) */}
          <div className="hidden sm:flex items-center rounded-2xl bg-muted p-1 text-xs font-black">
            <button
              onClick={() => {
                onToggleView("map");
                soundFx.playPop();
              }}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 sm:px-3 py-1.5 transition-all ${viewMode === "map"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span>🗺️</span>
              <span className="hidden xs:inline">Mapa 3D</span>
            </button>
            <button
              onClick={() => {
                onToggleView("list");
                soundFx.playPop();
              }}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 sm:px-3 py-1.5 transition-all ${viewMode === "list"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span>📋</span>
              <span className="hidden xs:inline">Lista</span>
            </button>
          </div>

          {/* Game Stats */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Stat icon="🔥" value={`${streakVal}`} label={`${streakVal} dias de ofensiva`} />
            <Stat icon="⭐" value={`${xpVal}`} label={`${xpVal} XP total`} />
            <Stat icon="❤️" value={`${livesVal}`} label={`${livesVal} vidas restantes`} />

            <div className="hidden sm:flex items-center gap-2">
              {onOpenAlphabet && (
                <button
                  onClick={onOpenAlphabet}
                  className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/20 shadow-xs"
                  title="Abrir Guia Oficial de Alfabeto em LIBRAS (A-Z)"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Guia A-Z</span>
                </button>
              )}
              <button
                onClick={onToggleMute}
                className="grid h-8 w-8 place-items-center rounded-full bg-card shadow-soft transition-transform hover:scale-105"
                title={isMuted ? "Ativar som" : "Desativar som"}
                aria-label={isMuted ? "Ativar som" : "Desativar som"}
              >
                <span className="text-sm">{isMuted ? "🔇" : "🔊"}</span>
              </button>
              <TrailUserAuthControls />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Nav (Mobile Only) */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-300 ease-in-out ${showBottomNav ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-background/90 backdrop-blur-md border-t border-border px-3 py-2.5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center justify-between gap-2">
          
          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card shadow-soft"
            title={isMuted ? "Ativar som" : "Desativar som"}
          >
            <span className="text-lg">{isMuted ? "🔇" : "🔊"}</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex flex-1 items-center justify-center rounded-2xl bg-muted p-1 text-xs font-black">
            <button
              onClick={() => { onToggleView("map"); soundFx.playPop(); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 transition-all ${viewMode === "map" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              <span>🗺️ Mapa</span>
            </button>
            <button
              onClick={() => { onToggleView("list"); soundFx.playPop(); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 transition-all ${viewMode === "list" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              <span>📋 Lista</span>
            </button>
          </div>

          <TrailUserAuthControls />
        </div>
      </div>
    </>
  );
}



function TrailUserAuthControls() {
  const [currentUser, setCurrentUser] = useState(() => getActiveUser());

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    toast.info("Sessão encerrada.");
  };

  if (!currentUser) {
    return (
      <Link
        to="/login"
        className="rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground shadow-soft"
      >
        🔑 Entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Botão Turma/Clã estritamente para alunos logados */}
      <div className="hidden sm:block">
        <TurmaClaNavbarButton />
      </div>

      <Link
        to={currentUser.role === "professor" ? "/onboarding" : "/student/profile"}
        className="flex items-center justify-center h-10 w-10 sm:h-auto sm:w-auto sm:gap-1 rounded-full sm:border sm:border-border bg-card sm:px-2.5 sm:py-1 text-xs font-extrabold hover:bg-muted shadow-soft sm:shadow-none"
        title="Meu Perfil / Painel"
      >
        <span className="text-lg sm:text-base">{currentUser.avatar}</span>
        <span className="hidden sm:inline">{currentUser.name.split(" ")[0]}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="hidden sm:inline-block rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400"
        title="Sair / Log-off"
      >
        🚪 Sair
      </button>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div
      className="flex items-center gap-1 rounded-full bg-card px-2 py-1.5 shadow-soft sm:gap-1.5 sm:px-3"
      title={label}
      aria-label={`${value} ${label}`}
    >
      <span className="text-sm sm:text-base">{icon}</span>
      <span className="font-display text-xs font-extrabold sm:text-sm">{value}</span>
    </div>
  );
}

function IslandBlock({
  island,
  index,
  onSelect,
}: {
  island: Island;
  index: number;
  onSelect: (n: TrailNode) => void;
}) {
  const locked = island.nodes.every((n) => n.state === "locked");
  return (
    <section aria-label={island.name} className="rounded-3xl bg-card/60 p-6 shadow-soft backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-3">
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl ${island.tone} font-display text-xl font-extrabold shadow-chunky`}
        >
          {index + 1}
        </span>
        <div>
          <h2 className="font-display text-xl font-extrabold">{island.name}</h2>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {island.subtitle}
          </p>
        </div>
        {locked && (
          <span className="ml-auto text-2xl" aria-hidden>
            🔒
          </span>
        )}
      </div>

      <ol className="relative space-y-8">
        {island.nodes.map((n, i) => {
          const offset = ["ml-0", "ml-16", "ml-28", "ml-16"][i % 4];
          return (
            <li key={n.id} className={`flex items-center gap-4 ${offset}`}>
              <TrailButton node={n} onSelect={onSelect} />
              <div className={n.state === "locked" ? "opacity-40" : ""}>
                <div className="font-display text-base font-extrabold">{n.title}</div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {KIND_LABEL[n.kind]}
                </div>
                {n.state === "done" && (
                  <div className="text-sm" aria-label={`${n.stars} de 3 estrelas`}>
                    {"⭐".repeat(n.stars)}
                    {"☆".repeat(3 - n.stars)}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TrailButton({ node, onSelect }: { node: TrailNode; onSelect: (n: TrailNode) => void }) {
  const base =
    "relative grid h-20 w-20 shrink-0 place-items-center rounded-full text-3xl transition-transform";
  if (node.state === "locked") {
    return (
      <button
        disabled
        aria-label={`${node.title} — bloqueado`}
        className={`${base} cursor-not-allowed bg-muted opacity-60`}
      >
        🔒
      </button>
    );
  }
  if (node.state === "done") {
    return (
      <button
        onClick={() => {
          soundFx.playPop();
          onSelect(node);
        }}
        aria-label={`${node.title} — concluído`}
        className={`${base} bg-mint shadow-chunky hover:-translate-y-1`}
      >
        {node.icon}
        <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-card text-sm font-black text-emerald-600 shadow-soft">
          ✓
        </span>
      </button>
    );
  }
  return (
    <div className="relative">
      <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 font-display text-xs font-extrabold text-primary-foreground shadow-chunky animate-bounce-soft">
        COMEÇAR
      </span>
      <button
        onClick={() => {
          soundFx.playPop();
          onSelect(node);
        }}
        aria-label={`${node.title} — próxima lição`}
        className={`${base} bg-gradient-rainbow shadow-chunky hover:-translate-y-1`}
      >
        {node.icon}
      </button>
    </div>
  );
}

function NodeSheet({ node, onClose }: { node: TrailNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <button className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <div className="animate-pop relative w-full max-w-md rounded-t-4xl bg-card p-8 shadow-chunky sm:rounded-4xl">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-rainbow text-4xl shadow-chunky">
            {node.icon}
          </div>
          <div className="mt-2 text-xs font-black uppercase tracking-wider text-primary">
            {node.islandName} · Fase {node.id}
          </div>
          <h2 className="mt-1 font-display text-2xl font-extrabold">{node.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{KIND_LABEL[node.kind]}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Reward icon="⭐" label="+10 XP" />
            <Reward icon="🌟" label="3 estrelas" />
            <Reward icon="🎬" label="5 telas" />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/licao"
              search={{ nodeId: node.id }}
              onClick={() => soundFx.playChime()}
              className="rounded-full bg-primary px-8 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95 text-center"
            >
              {node.state === "done" ? "Refazer lição" : "Começar lição"}
            </Link>
            <button
              onClick={onClose}
              className="text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reward({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 text-xs font-extrabold">{label}</div>
    </div>
  );
}
