import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import luviMascot from "@/assets/luvi-mascot.png";
import { ParallaxTrailMap, type TrailNode } from "@/components/ParallaxTrailMap";
import { soundFx } from "@/lib/sound-effects";
import { getActiveUser, logoutUser, User } from "@/lib/user-store";
import { toast } from "sonner";

export const Route = createFileRoute("/trilha")({
  head: () => ({
    meta: [
      { title: "Minha Trilha de LIBRAS com Mapa 3D · SinaLINK" },
      {
        name: "description",
        content:
          "Mapa interativo de aventura com micro-lições de LIBRAS: saudações, alfabeto, cores, bichos e família com efeitos de parallax e gamificação.",
      },
      { property: "og:title", content: "Minha Trilha de LIBRAS · SinaLINK" },
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

// Dados base dos nós — estado e estrelas são sempre calculados dinamicamente
const TRAIL_NODES_BASE: Omit<TrailNode, "state" | "stars">[] = [
  // Ilha do Oi
  { id: 1, islandId: 1, islandName: "Ilha do Oi", title: "Oi & Tchau", icon: "👋", kind: "licao", x: 10, y: 88 },
  { id: 2, islandId: 1, islandName: "Ilha do Oi", title: "Meu nome é…", icon: "🪪", kind: "licao", x: 22, y: 76 },
  { id: 3, islandId: 1, islandName: "Ilha do Oi", title: "Revisão relâmpago", icon: "⚡", kind: "revisao", x: 34, y: 64 },
  { id: 4, islandId: 1, islandName: "Ilha do Oi", title: "Chefe: Cumprimentos", icon: "🏆", kind: "chefe", x: 40, y: 54 },
  // Ilha das Cores
  { id: 5, islandId: 2, islandName: "Ilha das Cores", title: "Cores quentes", icon: "🍎", kind: "licao", x: 48, y: 48 },
  { id: 6, islandId: 2, islandName: "Ilha das Cores", title: "Cores frias", icon: "💙", kind: "licao", x: 57, y: 52 },
  { id: 7, islandId: 2, islandName: "Ilha das Cores", title: "Desafio do espelho", icon: "🪞", kind: "espelho", x: 67, y: 54 },
  { id: 8, islandId: 2, islandName: "Ilha das Cores", title: "Chefe: Arco-íris", icon: "🌈", kind: "chefe", x: 76, y: 45 },
  // Ilha dos Bichos
  { id: 9, islandId: 3, islandName: "Ilha dos Bichos", title: "Bichos de casa", icon: "🐶", kind: "licao", x: 70, y: 35 },
  { id: 10, islandId: 3, islandName: "Ilha dos Bichos", title: "Bichos da fazenda", icon: "🐄", kind: "licao", x: 62, y: 25 },
  { id: 11, islandId: 3, islandName: "Ilha dos Bichos", title: "Revisão relâmpago", icon: "⚡", kind: "revisao", x: 68, y: 18 },
  { id: 12, islandId: 3, islandName: "Ilha dos Bichos", title: "Chefe: Castelo do Saber", icon: "🏰", kind: "chefe", x: 80, y: 13 },
];

/** Calcula o estado dinâmico dos nós com base nas lições concluídas do usuário. */
function computeNodes(completedLessons: import("@/lib/user-store").CompletedLesson[]): TrailNode[] {
  const completedIds = new Set(completedLessons.map((l) => l.id));
  let foundCurrent = false;
  return TRAIL_NODES_BASE.map((base) => {
    const lessonId = `trail_node_${base.id}`;
    if (completedIds.has(lessonId)) {
      // Já concluído — calcula estrelas pelo score salvo
      const lesson = completedLessons.find((l) => l.id === lessonId);
      const stars = lesson ? (lesson.score >= 90 ? 3 : lesson.score >= 60 ? 2 : 1) : 1;
      return { ...base, state: "done" as const, stars };
    }
    if (!foundCurrent) {
      // Primeiro nó não concluído = "atual"
      foundCurrent = true;
      return { ...base, state: "current" as const, stars: 0 };
    }
    return { ...base, state: "locked" as const, stars: 0 };
  });
}

const ISLANDS: Island[] = [
  { id: 1, name: "Ilha do Oi", subtitle: "Saudações e apresentação", tone: "bg-sky", nodes: [] },
  { id: 2, name: "Ilha das Cores", subtitle: "Vermelho, azul, amarelo e mais", tone: "bg-grape", nodes: [] },
  { id: 3, name: "Ilha dos Animais", subtitle: "Animais da fazenda e da floresta", tone: "bg-neon", nodes: [] },
];

function buildIslands(nodes: TrailNode[]): Island[] {
  return ISLANDS.map((island) => ({
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
  const [isValidating, setIsValidating] = useState(true);
  const [authorizedUser, setAuthorizedUser] = useState<User | null>(null);

  // Nós e ilhas calculados dinamicamente pelo progresso do usuário
  const [trailNodes, setTrailNodes] = useState<TrailNode[]>([]);
  const [islands, setIslands] = useState<Island[]>(ISLANDS);

  const [selected, setSelected] = useState<TrailNode | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  // Guarda de Rota: Apenas Alunos Autenticados têm acesso à Trilha
  useEffect(() => {
    const user = getActiveUser();

    // 1. Não autenticado -> Redireciona para /login
    if (!user) {
      toast.error("🔒 Faça login como Aluno para acessar as trilhas de LIBRAS.");
      navigate({ to: "/login", replace: true });
      return;
    }

    // 2. Professor -> Redireciona para /onboarding (Painel do Professor)
    if (user.role === "professor") {
      toast.info("🔒 Professores não possuem acesso direto à trilha de lições. Redirecionando para o Painel.");
      navigate({ to: "/onboarding", replace: true });
      return;
    }

    // 3. Aluno Autenticado -> Calcula progresso e concede acesso
    const lessons = user.completedLessons ?? [];
    const computed = computeNodes(lessons);
    setTrailNodes(computed);
    setIslands(buildIslands(computed));
    setAuthorizedUser(user);
    setIsValidating(false);
  }, [navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-hero pb-24 text-foreground selection:bg-primary/20">
      {/* Top Header with Stats and Controls */}
      <TrailHeader
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        viewMode={viewMode}
        onToggleView={setViewMode}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* World Banner Progress */}
        <section className="mb-6 flex flex-col items-center gap-4 rounded-4xl bg-card p-6 shadow-soft sm:flex-row sm:gap-6">
          <img
            src={luviMascot}
            alt="Luvi, mascote do SinaLINK, acenando"
            width={1024}
            height={1024}
            className="w-20 shrink-0 animate-bounce-soft sm:w-24"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-2xl font-black text-foreground">
                Mundo Cores &amp; Bichos
              </h1>
              <span className="rounded-full bg-amber-100 px-3 py-0.5 font-display text-xs font-black text-amber-800">
                Fase {islands.findIndex((isl) => isl.nodes.some((n) => n.state === "current")) + 1} de {islands.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {trailNodes.filter((n) => n.state === "done").length === 0
                ? "Bem-vindo(a)! Comece sua jornada pelo primeiro sinal! 🌟"
                : `Você completou ${trailNodes.filter((n) => n.state === "done").length} de ${trailNodes.length} lições. Continue avançando! 🏰`}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-muted shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-rainbow transition-all duration-700"
                  style={{
                    width: `${Math.round((trailNodes.filter((n) => n.state === "done").length / trailNodes.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="font-display text-xs font-black text-muted-foreground">
                {Math.round((trailNodes.filter((n) => n.state === "done").length / trailNodes.length) * 100)}% concluído
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
                  Interaja com os elementos do relevo e clique nos pontos para aprender LIBRAS
                </p>
              </div>

              {/* Day / Sunset / Night quick toggle */}
              <div className="flex items-center gap-1 rounded-2xl bg-card p-1 shadow-soft">
                <button
                  onClick={() => {
                    setTimeOfDay("day");
                    soundFx.playPop();
                  }}
                  className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all ${
                    timeOfDay === "day"
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
                  className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all ${
                    timeOfDay === "sunset"
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
                  className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all ${
                    timeOfDay === "night"
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
              {ISLANDS.map((island) => {
                const doneCount = island.nodes.filter((n) => n.state === "done").length;
                const isCurrent = island.nodes.some((n) => n.state === "current");
                return (
                  <div
                    key={island.id}
                    className={`rounded-3xl border-2 p-4 transition-all ${
                      isCurrent
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

        {/* Locked Next World Banner */}
        <div className="mt-12 rounded-4xl border-4 border-dashed border-border p-8 text-center bg-card/40 backdrop-blur-sm shadow-lg">
          <div className="text-4xl animate-bounce-soft">🏰🔒</div>
          <h2 className="mt-8 font-display text-xl font-extrabold">
            Mundo 2: O Castelo da Família e Expressões
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
            Termine a jornada na Ilha dos Bichos para cruzar o portão do castelo e desbloquear novas aventuras!
          </p>
        </div>
      </main>

      {/* Node Detail Sheet Modal */}
      {selected && <NodeSheet node={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function TrailHeader({
  timeOfDay,
  setTimeOfDay,
  isMuted,
  onToggleMute,
  viewMode,
  onToggleView,
}: {
  timeOfDay: "day" | "sunset" | "night";
  setTimeOfDay: (t: "day" | "sunset" | "night") => void;
  isMuted: boolean;
  onToggleMute: () => void;
  viewMode: "map" | "list";
  onToggleView: (v: "map" | "list") => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="SinaLINK, início">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rainbow font-display text-lg font-extrabold text-primary-foreground shadow-sm">
            S
          </span>
          <span className="hidden font-display text-lg font-extrabold sm:block">SinaLINK</span>
        </Link>

        {/* View Mode switcher */}
        <div className="flex items-center rounded-2xl bg-muted p-1 text-xs font-black">
          <button
            onClick={() => {
              onToggleView("map");
              soundFx.playPop();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
              viewMode === "map"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>🗺️</span>
            <span>Mapa 3D</span>
          </button>
          <button
            onClick={() => {
              onToggleView("list");
              soundFx.playPop();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
              viewMode === "list"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>📋</span>
            <span>Lista</span>
          </button>
        </div>

        {/* Game Stats & Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft transition-transform hover:scale-105"
            title={isMuted ? "Ativar som" : "Desativar som"}
            aria-label={isMuted ? "Ativar som" : "Desativar som"}
          >
            <span className="text-base">{isMuted ? "🔇" : "🔊"}</span>
          </button>
          <Stat icon="🔥" value="12" label="ofensiva" />
          <Stat icon="⭐" value="340" label="XP" />
          <Stat icon="❤️" value="5" label="vidas" />

          <TrailUserAuthControls />
        </div>
      </div>
    </header>
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
    <div className="flex items-center gap-2">
      <Link
        to={currentUser.role === "professor" ? "/onboarding" : "/student/profile"}
        className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-extrabold hover:bg-muted"
        title="Meu Perfil / Painel"
      >
        <span>{currentUser.avatar}</span>
        <span className="hidden md:inline">{currentUser.name.split(" ")[0]}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400"
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
      className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-soft"
      title={label}
      aria-label={`${value} ${label}`}
    >
      <span className="text-base">{icon}</span>
      <span className="font-display text-sm font-extrabold">{value}</span>
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
              onClick={() => soundFx.playChime()}
              className="rounded-full bg-primary px-8 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95"
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
