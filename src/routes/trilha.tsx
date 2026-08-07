import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import luviMascot from "@/assets/luvi-mascot.png";

export const Route = createFileRoute("/trilha")({
  head: () => ({
    meta: [
      { title: "Minha trilha de LIBRAS · SinaLINK" },
      {
        name: "description",
        content:
          "Mapa de ilhas com micro-lições de LIBRAS: saudações, alfabeto, cores, bichos e família. Ganhe XP, estrelinhas e mantenha a ofensiva.",
      },
      { property: "og:title", content: "Minha trilha de LIBRAS · SinaLINK" },
      {
        property: "og:description",
        content: "Avance de ilha em ilha aprendendo LIBRAS com micro-lições gamificadas.",
      },
    ],
  }),
  component: TrailPage,
});

type NodeState = "done" | "current" | "locked";
type TrailNode = {
  id: number;
  title: string;
  icon: string;
  kind: "licao" | "revisao" | "espelho" | "chefe";
  state: NodeState;
  stars: number;
};

type Island = {
  name: string;
  subtitle: string;
  tone: string;
  nodes: TrailNode[];
};

const ISLANDS: Island[] = [
  {
    name: "Ilha do Oi",
    subtitle: "Saudações e apresentação",
    tone: "bg-sunshine",
    nodes: [
      { id: 1, title: "Oi & Tchau", icon: "👋", kind: "licao", state: "done", stars: 3 },
      { id: 2, title: "Meu nome é…", icon: "🪪", kind: "licao", state: "done", stars: 3 },
      { id: 3, title: "Revisão relâmpago", icon: "⚡", kind: "revisao", state: "done", stars: 2 },
      { id: 4, title: "Chefe: Cumprimentos", icon: "🏆", kind: "chefe", state: "done", stars: 3 },
    ],
  },
  {
    name: "Ilha das Cores",
    subtitle: "Vermelho, azul, amarelo e mais",
    tone: "bg-coral",
    nodes: [
      { id: 5, title: "Cores quentes", icon: "🍎", kind: "licao", state: "done", stars: 3 },
      { id: 6, title: "Cores frias", icon: "💙", kind: "licao", state: "current", stars: 0 },
      { id: 7, title: "Desafio do espelho", icon: "🪞", kind: "espelho", state: "locked", stars: 0 },
      { id: 8, title: "Chefe: Arco-íris", icon: "🌈", kind: "chefe", state: "locked", stars: 0 },
    ],
  },
  {
    name: "Ilha dos Bichos",
    subtitle: "Animais da fazenda e da floresta",
    tone: "bg-mint",
    nodes: [
      { id: 9, title: "Bichos de casa", icon: "🐶", kind: "licao", state: "locked", stars: 0 },
      { id: 10, title: "Bichos da fazenda", icon: "🐄", kind: "licao", state: "locked", stars: 0 },
      { id: 11, title: "Revisão relâmpago", icon: "⚡", kind: "revisao", state: "locked", stars: 0 },
      { id: 12, title: "Chefe: Zoológico", icon: "🦁", kind: "chefe", state: "locked", stars: 0 },
    ],
  },
];

const KIND_LABEL: Record<TrailNode["kind"], string> = {
  licao: "Micro-lição · 3 min",
  revisao: "Revisão espaçada",
  espelho: "Câmera + IA",
  chefe: "Chefe da ilha",
};

function TrailPage() {
  const [selected, setSelected] = useState<TrailNode | null>(null);

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      <TrailHeader />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <section className="mb-10 flex items-center gap-5 rounded-4xl bg-card p-6 shadow-soft">
          <img
            src={luviMascot}
            alt="Luvi, mascote do SinaLINK, acenando"
            width={1024}
            height={1024}
            className="w-24 shrink-0 animate-bounce-soft"
          />
          <div>
            <h1 className="font-display text-2xl font-extrabold">Mundo Cores &amp; Bichos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Você está a <b>1 lição</b> do Chefe da Ilha das Cores. Bora?
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[42%] rounded-full bg-gradient-rainbow" />
            </div>
            <div className="mt-1.5 text-xs font-bold text-muted-foreground">42% do mundo concluído</div>
          </div>
        </section>

        <div className="space-y-14">
          {ISLANDS.map((island, ii) => (
            <IslandBlock key={island.name} island={island} index={ii} onSelect={setSelected} />
          ))}
        </div>

        <div className="mt-16 rounded-4xl border-4 border-dashed border-border p-8 text-center">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-2 font-display text-xl font-extrabold">Ilha da Família</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Termine a Ilha dos Bichos para desbloquear mais 4 lições.
          </p>
        </div>
      </main>

      {selected && <NodeSheet node={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function TrailHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="SinaLINK, início">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rainbow font-display text-lg font-extrabold text-primary-foreground">
            S
          </span>
          <span className="hidden font-display text-lg font-extrabold sm:block">SinaLINK</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Stat icon="🔥" value="12" label="ofensiva" />
          <Stat icon="⭐" value="340" label="XP" />
          <Stat icon="❤️" value="5" label="vidas" />
        </div>
      </div>
    </header>
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
    <section aria-label={island.name}>
      <div className="mb-6 flex items-center gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${island.tone} font-display text-xl font-extrabold shadow-chunky`}>
          {index + 1}
        </span>
        <div>
          <h2 className="font-display text-xl font-extrabold">{island.name}</h2>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{island.subtitle}</p>
        </div>
        {locked && <span className="ml-auto text-2xl" aria-hidden>🔒</span>}
      </div>

      <ol className="relative space-y-6">
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
        onClick={() => onSelect(node)}
        aria-label={`${node.title} — concluído`}
        className={`${base} bg-mint shadow-chunky hover:-translate-y-1`}
      >
        {node.icon}
        <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-card text-sm shadow-soft">
          ✓
        </span>
      </button>
    );
  }
  return (
    <div className="relative">
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 font-display text-xs font-extrabold text-primary-foreground shadow-chunky animate-bounce-soft">
        COMEÇAR
      </span>
      <button
        onClick={() => onSelect(node)}
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <button className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <div className="animate-pop relative w-full max-w-md rounded-t-4xl bg-card p-8 shadow-chunky sm:rounded-4xl">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-rainbow text-4xl shadow-chunky">
            {node.icon}
          </div>
          <h2 className="mt-4 font-display text-2xl font-extrabold">{node.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{KIND_LABEL[node.kind]}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Reward icon="⭐" label="+10 XP" />
            <Reward icon="🌟" label="3 estrelas" />
            <Reward icon="🎬" label="5 telas" />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/licao"
              className="rounded-full bg-primary px-8 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky"
            >
              {node.state === "done" ? "Refazer lição" : "Começar lição"}
            </Link>
            <button onClick={onClose} className="text-sm font-bold text-muted-foreground hover:text-foreground">
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
