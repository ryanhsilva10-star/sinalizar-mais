import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import trailBg from "@/assets/trail-adventure-bg.jpg";
import mapMascot from "@/assets/map-character.jpg";
import luviMascot from "@/assets/luvi-mascot.png";
import { soundFx } from "@/lib/sound-effects";

export type NodeState = "done" | "current" | "locked";
export type TrailNode = {
  id: number;
  islandId: number;
  islandName: string;
  title: string;
  icon: string;
  kind: "licao" | "revisao" | "espelho" | "chefe";
  state: NodeState;
  stars: number;
  // Percentage coordinates on the adventure map (0-100%)
  x: number;
  y: number;
};

interface ParallaxTrailMapProps {
  nodes: TrailNode[];
  selectedNode: TrailNode | null;
  onSelectNode: (node: TrailNode) => void;
  timeOfDay?: "day" | "sunset" | "night";
}

const MAP_HINTS = [
  "Olá explorador! Clique em uma lição para aprender novos sinais em LIBRAS! 👋",
  "Você está muito perto do Chefe da Ilha das Cores! 🌈",
  "Dica do Mapa: pratique em frente ao espelho com o Desafio de IA! 🪞",
  "Sabia que cada sinal que você aprende fortalece sua ofensiva de XP? ⭐",
  "Cruze a ponte mágica e siga o rio para chegar ao Castelo do Saber! 🏰",
];

export function ParallaxTrailMap({
  nodes,
  selectedNode,
  onSelectNode,
  timeOfDay = "day",
}: ParallaxTrailMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [mascotBubbleOpen, setMascotBubbleOpen] = useState(true);
  const [mascotJumping, setMascotJumping] = useState(false);
  const [activeRipples, setActiveRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [castleShimmer, setCastleShimmer] = useState(false);
  const [bridgeBouncing, setBridgeBouncing] = useState(false);
  const [parallaxIntensity, setParallaxIntensity] = useState<"normal" | "high" | "off">("normal");

  // Smooth lerp animation loop for parallax
  useEffect(() => {
    if (parallaxIntensity === "off") {
      setMousePos({ x: 0, y: 0 });
      return;
    }

    let animationFrameId: number;
    const lerp = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.08,
        y: prev.y + (targetPos.y - prev.y) * 0.08,
      }));
      animationFrameId = requestAnimationFrame(lerp);
    };

    animationFrameId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos, parallaxIntensity]);

  // Handle pointer tracking
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (parallaxIntensity === "off") return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const mult = parallaxIntensity === "high" ? 1.5 : 1.0;
      setTargetPos({ x: x * mult, y: y * mult });
    },
    [parallaxIntensity]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovering(false);
    setTargetPos({ x: 0, y: 0 });
  }, []);

  // Trigger mascot interaction
  const handleMascotClick = () => {
    soundFx.playWobble();
    setMascotJumping(true);
    setHintIndex((prev) => (prev + 1) % MAP_HINTS.length);
    setMascotBubbleOpen(true);
    setTimeout(() => setMascotJumping(false), 600);
  };

  // Water ripple interaction on river
  const handleRiverClick = (e: React.MouseEvent<HTMLDivElement>) => {
    soundFx.playSplash();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newRipple = { id: Date.now() + Math.random(), x, y };
    setActiveRipples((prev) => [...prev.slice(-4), newRipple]);
    setTimeout(() => {
      setActiveRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  // Castle interaction
  const handleCastleClick = () => {
    soundFx.playChime();
    setCastleShimmer(true);
    setTimeout(() => setCastleShimmer(false), 1500);
  };

  // Bridge interaction
  const handleBridgeClick = () => {
    soundFx.playPop();
    setBridgeBouncing(true);
    setTimeout(() => setBridgeBouncing(false), 500);
  };

  // Parallax multipliers
  const pxSkyX = mousePos.x * 6;
  const pxSkyY = mousePos.y * 4;
  const pxBgX = mousePos.x * 12;
  const pxBgY = mousePos.y * 8;
  const pxElementsX = mousePos.x * 18;
  const pxElementsY = mousePos.y * 12;
  const pxForegroundX = mousePos.x * 24;
  const pxForegroundY = mousePos.y * 16;

  // Active current node for Luvi placement
  const currentNode = useMemo(() => {
    return nodes.find((n) => n.state === "current") || nodes[0];
  }, [nodes]);

  // SVG curved path connecting all nodes
  const pathD = useMemo(() => {
    if (nodes.length === 0) return "";
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const curr = nodes[i];
      const cx1 = (prev.x + curr.x) / 2;
      const cy1 = prev.y;
      const cx2 = (prev.x + curr.x) / 2;
      const cy2 = curr.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [nodes]);

  // Atmosphere filters based on timeOfDay
  const atmosphereOverlay = useMemo(() => {
    switch (timeOfDay) {
      case "sunset":
        return "bg-gradient-to-t from-amber-600/25 via-purple-600/20 to-orange-500/30 mix-blend-color-burn";
      case "night":
        return "bg-gradient-to-b from-indigo-950/70 via-blue-950/50 to-slate-900/60 mix-blend-multiply";
      default:
        return "bg-transparent";
    }
  }, [timeOfDay]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-4 border-amber-300/80 bg-sky-200 shadow-2xl transition-all duration-700">
      {/* Interactive Controls Bar */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-2xl bg-card/90 px-3 py-1.5 shadow-md backdrop-blur-md">
        <span className="hidden text-xs font-extrabold text-muted-foreground sm:inline">
          Modo 3D:
        </span>
        <button
          onClick={() => {
            const next = parallaxIntensity === "normal" ? "high" : parallaxIntensity === "high" ? "off" : "normal";
            setParallaxIntensity(next);
            soundFx.playPop();
          }}
          className="flex items-center gap-1 rounded-xl bg-muted px-2.5 py-1 text-xs font-extrabold text-foreground transition-all hover:scale-105"
          title="Alternar intensidade do efeito Parallax 3D"
        >
          <span>🧭</span>
          <span>
            {parallaxIntensity === "high"
              ? "Super Parallax"
              : parallaxIntensity === "normal"
              ? "Parallax Ativo"
              : "Estático"}
          </span>
        </button>
      </div>

      {/* Main Parallax Canvas Container */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={handlePointerLeave}
        className="relative aspect-[16/9] min-h-[480px] w-full cursor-crosshair select-none overflow-hidden sm:min-h-[620px] md:min-h-[720px]"
        style={{
          perspective: "1200px",
        }}
      >
        {/* Layer 1: Animated Sky, Clouds & Sun/Moon (Far Depth) */}
        <div
          className="pointer-events-none absolute inset-[-5%] transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${-pxSkyX}px, ${-pxSkyY}px, 0) scale(1.08)`,
          }}
        >
          {/* Celestial Body: Sun or Moon */}
          {timeOfDay === "night" ? (
            <div className="absolute right-[28%] top-[12%] h-16 w-16 animate-pulse rounded-full bg-amber-100 shadow-[0_0_50px_rgba(254,240,138,0.8)]">
              <span className="absolute -top-1 right-2 text-2xl">✨</span>
            </div>
          ) : (
            <div
              className={`absolute right-[28%] top-[12%] h-20 w-20 rounded-full ${
                timeOfDay === "sunset"
                  ? "bg-gradient-to-tr from-orange-500 to-amber-300 shadow-[0_0_60px_rgba(249,115,22,0.9)]"
                  : "bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_70px_rgba(253,224,71,0.9)]"
              } animate-bounce-soft`}
            />
          )}

          {/* Drifting Cartoon Clouds */}
          <div className="absolute left-[8%] top-[16%] animate-[float_8s_ease-in-out_infinite] opacity-90">
            <CloudSvg width={110} height={60} opacity={0.95} />
          </div>
          <div className="absolute left-[38%] top-[8%] animate-[float_11s_ease-in-out_infinite_1s] opacity-80">
            <CloudSvg width={140} height={75} opacity={0.9} />
          </div>
          <div className="absolute right-[8%] top-[18%] animate-[float_9s_ease-in-out_infinite_2s] opacity-95">
            <CloudSvg width={120} height={65} opacity={0.95} />
          </div>

          {/* Night Stars */}
          {timeOfDay === "night" && (
            <div className="absolute inset-0">
              <span className="absolute left-[15%] top-[10%] animate-ping text-yellow-200">✦</span>
              <span className="absolute left-[25%] top-[25%] animate-pulse text-yellow-100">✧</span>
              <span className="absolute left-[50%] top-[12%] animate-pulse text-yellow-300">★</span>
              <span className="absolute right-[20%] top-[8%] animate-ping text-yellow-200">✦</span>
              <span className="absolute right-[40%] top-[22%] animate-pulse text-amber-200">✧</span>
            </div>
          )}
        </div>

        {/* Layer 2: Main Illustrated Adventure Map (Mid Depth with 3D Tilt) */}
        <div
          className="absolute inset-[-4%] transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${-pxBgX}px, ${-pxBgY}px, 0) scale(1.06) rotateX(${
              -mousePos.y * 2
            }deg) rotateY(${mousePos.x * 2.5}deg)`,
            transformOrigin: "center center",
          }}
        >
          <img
            src={trailBg}
            alt="Mapa de aventura da Trilha de LIBRAS"
            className="h-full w-full object-cover object-center"
          />

          {/* Interactive Castle Clickable Area (Top-Right) */}
          <div
            onClick={handleCastleClick}
            className={`absolute right-[7%] top-[8%] h-[28%] w-[24%] cursor-pointer rounded-3xl transition-transform duration-300 hover:scale-105 ${
              castleShimmer ? "animate-wiggle" : ""
            }`}
            title="Castelo do Saber! Clique para ver a magia!"
          >
            {castleShimmer && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="animate-ping text-5xl">✨</span>
                <span className="absolute -top-4 text-3xl animate-bounce">🏰🌟</span>
              </div>
            )}
          </div>

          {/* Interactive Bridge Clickable Area (Bottom-Left) */}
          <div
            onClick={handleBridgeClick}
            className={`absolute bottom-[16%] left-[8%] h-[20%] w-[32%] cursor-pointer rounded-2xl transition-transform ${
              bridgeBouncing ? "-translate-y-2 scale-105" : "hover:brightness-110"
            }`}
            title="Ponte dos Primeiros Sinais! Clique para testar a madeira."
          >
            {bridgeBouncing && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 font-display text-xs font-black text-white shadow-md animate-pop">
                TOC TOC! 🪵
              </span>
            )}
          </div>

          {/* Interactive River Clickable Wave Area */}
          <div
            onClick={handleRiverClick}
            className="absolute bottom-[2%] left-[42%] top-[38%] w-[48%] cursor-pointer"
            title="Rio dos Sinais! Clique na água para criar ondulações."
          >
            {/* Animated Ripples */}
            {activeRipples.map((ripple) => (
              <div
                key={ripple.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-4 border-cyan-200 bg-cyan-400/30"
                style={{
                  left: `${ripple.x}%`,
                  top: `${ripple.y}%`,
                  width: "70px",
                  height: "40px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Atmosphere Tint Layer */}
        <div className={`pointer-events-none absolute inset-0 transition-all duration-700 ${atmosphereOverlay}`} />

        {/* Layer 3: Interactive Character Mascot "O Mapa" (Hill Mascot on Top-Left) */}
        <div
          className="absolute left-[6%] top-[18%] z-20 transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${-pxElementsX * 0.9}px, ${-pxElementsY * 0.9}px, 0)`,
          }}
        >
          <div className="relative group">
            {/* Speech Bubble from O Mapa */}
            {mascotBubbleOpen && (
              <div className="animate-pop absolute -top-20 left-12 z-30 w-56 rounded-2xl border-2 border-amber-400 bg-amber-50 p-3 shadow-chunky sm:w-64">
                <div className="flex items-start justify-between gap-1">
                  <p className="font-body text-xs font-bold leading-snug text-amber-950 sm:text-sm">
                    {MAP_HINTS[hintIndex]}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMascotBubbleOpen(false);
                    }}
                    className="text-xs text-amber-600 hover:text-amber-900"
                  >
                    ✕
                  </button>
                </div>
                <div className="absolute -bottom-2.5 left-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-amber-400 bg-amber-50" />
              </div>
            )}

            {/* Mascot Character Avatar Button */}
            <button
              onClick={handleMascotClick}
              className={`relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-amber-300 bg-amber-100 shadow-chunky transition-transform hover:scale-110 active:scale-95 sm:h-28 sm:w-28 ${
                mascotJumping ? "animate-bounce" : "animate-bounce-soft"
              }`}
              title="Eu sou o Mapa! Clique em mim para ouvir dicas!"
            >
              <img
                src={mapMascot}
                alt="O Mapa — Guia interativo da trilha"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-amber-500/90 py-0.5 text-center font-display text-[10px] font-extrabold text-white">
                O MAPA 🗺️
              </span>
            </button>
          </div>
        </div>

        {/* Layer 4: SVG Winding Path Connecting All Nodes */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${-pxElementsX}px, ${-pxElementsY}px, 0)`,
          }}
        >
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Trail drop shadow line */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(0, 0, 0, 0.25)"
              strokeWidth="3.2"
              strokeLinecap="round"
              transform="translate(0.3, 0.6)"
            />
            {/* Main Trail dashed path */}
            <path
              d={pathD}
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.5"
              strokeDasharray="2.5,2.5"
              strokeLinecap="round"
              className="animate-[dash_20s_linear_infinite]"
            />
          </svg>
        </div>

        {/* Layer 5: Trail Nodes Interactive Buttons Overlay */}
        <div
          className="absolute inset-0 z-20 transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${-pxElementsX}px, ${-pxElementsY}px, 0)`,
          }}
        >
          {nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const isCurrent = node.state === "current";
            const isDone = node.state === "done";
            const isLocked = node.state === "locked";

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
              >
                {/* Luvi Mascot standing on current active node */}
                {isCurrent && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center">
                    <span className="whitespace-nowrap rounded-full bg-primary px-3 py-1 font-display text-[11px] font-extrabold text-primary-foreground shadow-chunky animate-bounce-soft">
                      VOCÊ ESTÁ AQUI 🎯
                    </span>
                    <img
                      src={luviMascot}
                      alt="Luvi"
                      className="w-12 -mt-1 animate-[wiggle_1.8s_ease-in-out_infinite]"
                    />
                  </div>
                )}

                {/* Node Button */}
                <div className="relative group">
                  <button
                    onClick={() => {
                      if (!isLocked) {
                        soundFx.playPop();
                        onSelectNode(node);
                      }
                    }}
                    disabled={isLocked}
                    className={`relative grid h-14 w-14 place-items-center rounded-full text-2xl font-black transition-all sm:h-16 sm:w-16 ${
                      isDone
                        ? "bg-mint shadow-chunky hover:-translate-y-1 hover:scale-110 active:scale-95"
                        : isCurrent
                        ? "bg-gradient-rainbow shadow-chunky hover:-translate-y-1 hover:scale-110 ring-4 ring-amber-300 animate-pulse active:scale-95"
                        : "cursor-not-allowed bg-slate-300/80 text-slate-500 opacity-70 shadow-sm"
                    } ${isSelected ? "ring-4 ring-primary scale-110" : ""}`}
                    aria-label={`${node.title} — ${node.state}`}
                  >
                    {isLocked ? "🔒" : node.icon}

                    {/* Done checkmark badge */}
                    {isDone && (
                      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-black text-emerald-600 shadow-soft">
                        ✓
                      </span>
                    )}

                    {/* Island index indicator badge */}
                    <span className="absolute -top-1 -left-1 grid h-5 w-5 place-items-center rounded-full bg-card font-display text-[10px] font-extrabold text-foreground shadow-soft">
                      {node.id}
                    </span>
                  </button>

                  {/* Node Hover Tooltip Card */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-44 rounded-2xl bg-card/95 p-2.5 text-center shadow-chunky backdrop-blur-sm group-hover:block z-30 animate-pop">
                    <div className="font-display text-xs font-black text-foreground">
                      {node.title}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground">
                      {node.islandName}
                    </div>
                    {isDone && (
                      <div className="mt-1 text-xs">
                        {"⭐".repeat(node.stars)}
                        {"☆".repeat(3 - node.stars)}
                      </div>
                    )}
                    {isCurrent && (
                      <span className="mt-1 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-black text-primary">
                        Próxima Lição
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 6: Dynamic Floating Foreground Elements (Fastest Parallax) */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${-pxForegroundX}px, ${-pxForegroundY}px, 0)`,
          }}
        >
          {/* Fluttering Butterflies */}
          <div className="absolute left-[20%] top-[45%] animate-[float_4s_ease-in-out_infinite] text-xl">
            🦋
          </div>
          <div className="absolute right-[22%] top-[60%] animate-[float_5s_ease-in-out_infinite_1.5s] text-2xl">
            🦋
          </div>

          {/* Tropical Leaves / Flower Sparkles */}
          <div className="absolute left-[3%] bottom-[6%] text-2xl animate-bounce-soft">
            🌺
          </div>
          <div className="absolute right-[4%] bottom-[8%] text-2xl animate-[wiggle_2s_ease-in-out_infinite]">
            🌴
          </div>
        </div>
      </div>

      {/* Map Footer Helper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-300/60 bg-card/90 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-xl">🗺️</span>
          <div>
            <div className="font-display text-sm font-extrabold">Trilha Gamificada de LIBRAS</div>
            <div className="text-xs text-muted-foreground">
              Mova o cursor para explorar em 3D · Clique no Mapa e no Rio para interagir!
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-extrabold">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-mint text-[10px]">✓</span>
            <span>Concluídas</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[10px]">⭐</span>
            <span>Atual</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-sm">🔒</span>
            <span>Bloqueadas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloudSvg({
  width = 120,
  height = 60,
  opacity = 0.9,
}: {
  width?: number;
  height?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 60"
      fill="white"
      style={{ opacity, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))" }}
    >
      <path d="M25 45 C15 45 8 38 8 28 C8 19 16 13 24 13 C26 7 34 2 45 2 C58 2 68 9 70 17 C75 14 84 14 90 19 C98 24 98 33 94 38 C104 39 110 46 110 52 C110 58 104 60 95 60 L25 60 C15 60 10 54 10 48 Z" />
    </svg>
  );
}
