import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import luviMascot from "@/assets/luvi-mascot.png";
import { LibrasLessonMirror, type LessonMirrorScore } from "@/components/LibrasLessonMirror";
import { soundFx } from "@/lib/sound-effects";

export const Route = createFileRoute("/licao")({
  head: () => ({
    meta: [
      { title: "Lição interativa com IA: Cores em LIBRAS · SinaLINK" },
      {
        name: "description",
        content:
          "Aprenda sinais e cores em LIBRAS com feedback de inteligência artificial em tempo real na câmera e gamificação.",
      },
      { property: "og:title", content: "Lição com IA: Cores em LIBRAS · SinaLINK" },
      {
        property: "og:description",
        content: "Reconhecimento de LIBRAS com IA em tempo real e micro-lições interativas.",
      },
    ],
  }),
  component: LessonPage,
});

type Color = {
  pt: string;
  sign: string;
  emoji: string;
  tone: string;
  targetLetter: string;
  signTip: string;
};

const COLORS: Color[] = [
  {
    pt: "AZUL",
    sign: "Mão em 'B' balançando suavemente",
    emoji: "💙",
    tone: "bg-sky",
    targetLetter: "B",
    signTip: "4 dedos estendidos para CIMA e polegar dobrado na palma.",
  },
  {
    pt: "AMARELO",
    sign: "Mão em 'Y' descendo ao lado do rosto",
    emoji: "🌻",
    tone: "bg-sunshine",
    targetLetter: "Y",
    signTip: "Polegar e dedo mínimo estendidos para os lados (Hang Loose).",
  },
  {
    pt: "VERMELHO",
    sign: "Mão em 'D' com indicador tocando o lábio",
    emoji: "🍎",
    tone: "bg-coral",
    targetLetter: "D",
    signTip: "Indicador estendido para CIMA e pontas dos demais dedos unidas ao polegar.",
  },
];

function LessonPage() {
  const [step, setStep] = useState(0);
  const [mirrorScore, setMirrorScore] = useState<LessonMirrorScore | null>(null);
  const total = 5;

  const next = () => {
    soundFx.playPop();
    setStep((s) => Math.min(s + 1, total));
  };

  const restart = () => {
    setMirrorScore(null);
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-hero shadow">
      <TopBar step={step} total={total} onExit={restart} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-7 sm:py-12">
        {step === 0 && <ScreenIntro onNext={next} />}
        {step === 1 && <ScreenTeach onNext={next} />}
        {step === 2 && <ScreenQuiz onNext={next} target={COLORS[0]} />}
        {step === 3 && <ScreenBubble onNext={next} target={COLORS[1]} />}
        {step === 4 && (
          <ScreenMirror
            target={COLORS[0]}
            onNext={(score) => {
              setMirrorScore(score);
              next();
            }}
          />
        )}
        {step === 5 && <ScreenReward score={mirrorScore} onRestart={restart} />}
      </div>
    </div>
  );
}

function TopBar({ step, total, onExit }: { step: number; total: number; onExit: () => void }) {
  const pct = (step / total) * 100;
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
        <Link
          to="/trilha"
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-card text-lg font-bold transition-transform hover:scale-105"
          aria-label="Sair da Lição"
        >
          ✕
        </Link>
        <div className="flex-1">
          <div className="h-3 overflow-hidden rounded-full bg-muted shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-rainbow transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-soft">
          <span className="text-lg">❤️</span>
          <span className="font-display font-extrabold">5</span>
        </div>
        <button
          onClick={onExit}
          className="hidden text-xs font-bold text-muted-foreground hover:text-foreground md:block"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-pop rounded-4xl bg-card p-6 shadow-chunky md:p-12 border border-border/50">
      {children}
    </div>
  );
}

function ScreenIntro({ onNext }: { onNext: () => void }) {
  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          EF1 · Nível 4 · Lição com IA
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
          Vamos aprender as cores em LIBRAS!
        </h1>
        <img
          src={luviMascot}
          alt="Luvi acenando com balões coloridos"
          width={1024}
          height={1024}
          className="mx-auto my-6 w-56 animate-bounce-soft drop-shadow-xl/25 sm:w-64"
        />
        <div className="mx-auto mb-6 flex max-w-xs justify-center gap-3 drop-shadow-xl/25">
          {COLORS.map((c, idx) => (
            <span
              key={c.pt}
              className={`grid h-14 w-14 place-items-center rounded-2xl ${c.tone} text-2xl shadow-chunky animate-float`}
              style={{ animationDelay: `${idx * 0.4}s` }}
            >
              {c.emoji}
            </span>
          ))}
        </div>
        <button
          onClick={onNext}
          className="rounded-full bg-primary px-10 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:scale-95"
        >
          ▶ Começar Lição
        </button>
      </div>
    </ScreenShell>
  );
}

function ScreenTeach({ onNext }: { onNext: () => void }) {
  const [i, setI] = useState(0);
  const c = COLORS[i];
  const advance = () => (i < COLORS.length - 1 ? setI(i + 1) : onNext());

  return (
    <ScreenShell>
      <div className="text-center">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Passo 1: Visualização
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
            {i + 1} de {COLORS.length}
          </span>
        </div>

        <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          Aprenda o sinal de <span className="text-primary">{c.pt}</span>
        </h2>

        <div className="relative mx-auto mt-6 grid h-72 w-full max-w-md place-items-center overflow-hidden rounded-3xl bg-muted border border-border">
          <div className="text-center">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-3xl bg-gradient-rainbow text-5xl shadow-glow-teen animate-wiggle">
              🤟
            </div>
            <div className="mt-3 font-display text-sm font-extrabold uppercase tracking-wide text-foreground">
              Configuração de Mão: Letra {c.targetLetter}
            </div>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">{c.signTip}</p>
          </div>

          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-extrabold shadow-soft">
              {c.emoji} {c.pt}
            </span>
          </div>
        </div>

        <div
          className={`mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl ${c.tone} px-6 py-3 shadow-chunky`}
        >
          <span className="text-3xl">{c.emoji}</span>
          <span className="font-display text-3xl font-extrabold text-slate-900">{c.pt}</span>
        </div>

        <div className="mt-8">
          <button
            onClick={advance}
            className="rounded-full bg-foreground px-10 py-4 font-display text-lg font-extrabold text-background transition-transform hover:-translate-y-1 shadow-chunky active:scale-95"
          >
            {i < COLORS.length - 1 ? "Próxima Cor →" : "Entendi, vamos aos Desafios! ✓"}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenQuiz({ target, onNext }: { target: Color; onNext: () => void }) {
  const [choice, setChoice] = useState<string | null>(null);
  const correct = choice === target.pt;

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Desafio de Fixação
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Qual cor usa a mão na letra{" "}
          <span className="rounded-xl bg-accent px-3 py-1">{target.targetLetter}</span>?
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{target.signTip}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLORS.map((c) => {
            const isSel = choice === c.pt;
            const isRight = isSel && c.pt === target.pt;
            const isWrong = isSel && c.pt !== target.pt;
            return (
              <button
                key={c.pt}
                onClick={() => {
                  if (!choice) {
                    setChoice(c.pt);
                    if (c.pt === target.pt) soundFx.playChime();
                    else soundFx.playPop();
                  }
                }}
                className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl border-4 bg-muted transition-all ${
                  isRight
                    ? "border-mint bg-mint/20 animate-pop"
                    : isWrong
                    ? "border-destructive bg-destructive/10"
                    : "border-transparent hover:border-primary hover:-translate-y-1"
                }`}
              >
                <div className="text-4xl">{c.emoji}</div>
                <div className="mt-2 font-display text-lg font-black">{c.pt}</div>
                <span className="mt-1 text-[11px] font-bold text-muted-foreground">
                  (Mão em {c.targetLetter})
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 min-h-[80px]">
          {correct && (
            <div className="animate-pop rounded-2xl bg-mint/30 p-4 border border-mint/40">
              <div className="font-display text-xl font-extrabold text-foreground">Perfeito! 🎉</div>
              <p className="text-sm text-foreground/80">
                O sinal de <b>{target.pt}</b> é feito com a mão em <b>{target.targetLetter}</b>.
              </p>
            </div>
          )}
          {choice && !correct && (
            <div className="animate-pop rounded-2xl bg-destructive/10 p-4 border border-destructive/20">
              <div className="font-display text-xl font-extrabold">Quase! 👀</div>
              <p className="text-sm text-foreground/80">
                A resposta certa é <b>{target.pt}</b> (mão em {target.targetLetter}).
              </p>
            </div>
          )}
        </div>

        {choice && (
          <button
            onClick={onNext}
            className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105"
          >
            Continuar →
          </button>
        )}
      </div>
    </ScreenShell>
  );
}

function ScreenBubble({ target, onNext }: { target: Color; onNext: () => void }) {
  const [popped, setPopped] = useState<string | null>(null);

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Estoure a bolha 🫧
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Estoure o sinal de <span className="rounded-xl bg-accent px-3 py-1">{target.pt}</span>
        </h2>
        <div className="relative mt-8 grid h-72 place-items-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky/30 to-mint/20 border border-border">
          <div className="flex items-end justify-around gap-6 drop-shadow-xl/25">
            {COLORS.map((c, i) => {
              const isPopped = popped === c.pt;
              const isRight = isPopped && c.pt === target.pt;
              return (
                <button
                  key={c.pt}
                  onClick={() => {
                    if (!popped) {
                      setPopped(c.pt);
                      if (c.pt === target.pt) soundFx.playChime();
                      else soundFx.playPop();
                    }
                  }}
                  disabled={!!popped}
                  style={{ animationDelay: `${i * 0.5}s` }}
                  className={`animate-float rounded-full ${c.tone} shadow-chunky transition-all ${
                    isPopped
                      ? isRight
                        ? "scale-125 opacity-30"
                        : "scale-75 opacity-40"
                      : "hover:scale-110"
                  }`}
                >
                  <div className="grid h-24 w-24 place-items-center text-4xl">{c.emoji}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6 min-h-[60px]">
          {popped && popped === target.pt && (
            <div className="animate-pop font-display text-2xl font-extrabold text-mint">
              Boa! Estourou certinho! 🎯
            </div>
          )}
          {popped && popped !== target.pt && (
            <div className="animate-pop text-lg font-bold text-destructive">
              Ops, era o {target.pt}!
            </div>
          )}
        </div>
        {popped && (
          <button
            onClick={onNext}
            className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105"
          >
            Próximo desafio: Espelho com IA →
          </button>
        )}
      </div>
    </ScreenShell>
  );
}

function ScreenMirror({
  target,
  onNext,
}: {
  target: Color;
  onNext: (score: LessonMirrorScore) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<Color>(target);

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          🪞 Desafio do Espelho com IA
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Faça o sinal na câmera: <span className="text-primary">{selectedColor.pt}</span>
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Posicione a mão e faça a configuração da <strong>Letra {selectedColor.targetLetter}</strong>
        </p>

        {/* Color / Letter switcher */}
        <div className="my-5 flex flex-wrap justify-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c.pt}
              onClick={() => {
                setSelectedColor(c);
                soundFx.playPop();
              }}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-extrabold transition-all ${
                selectedColor.pt === c.pt
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.pt} (Mão {c.targetLetter})</span>
            </button>
          ))}
        </div>

        {/* Real-time MediaPipe AI Hand Detection Mirror */}
        <LibrasLessonMirror
          targetLetter={selectedColor.targetLetter}
          targetLabel={selectedColor.pt}
          targetDescription={selectedColor.signTip}
          onComplete={onNext}
          onSkip={() => {
            onNext({
              accuracy: 3,
              orientationScore: 3,
              stabilityScore: 2,
              detectedLetter: selectedColor.targetLetter,
            });
          }}
        />
      </div>
    </ScreenShell>
  );
}

function ScreenReward({
  score,
  onRestart,
}: {
  score: LessonMirrorScore | null;
  onRestart: () => void;
}) {
  return (
    <ScreenShell>
      <div className="text-center">
        <div className="relative">
          <img
            src={luviMascot}
            alt="Luvi celebrando"
            width={1024}
            height={1024}
            className="mx-auto w-56 animate-bounce-soft"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-rainbow opacity-30 blur-3xl drop-shadow-xl/25" />
        </div>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Lição completa! 🎉</h1>
        <p className="mt-3 text-muted-foreground">
          Você aprendeu cores em LIBRAS e validou seus sinais com inteligência artificial!
        </p>

        {/* Breakdown das estrelas */}
        <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
          <div className="rounded-2xl bg-card p-3 shadow-soft border border-border">
            <div className="text-xs font-extrabold uppercase text-muted-foreground">Config. Mão</div>
            <div className="mt-1 text-lg">{"⭐".repeat(score?.accuracy || 3)}</div>
          </div>
          <div className="rounded-2xl bg-card p-3 shadow-soft border border-border">
            <div className="text-xs font-extrabold uppercase text-muted-foreground">Orientação</div>
            <div className="mt-1 text-lg">{"⭐".repeat(score?.orientationScore || 3)}</div>
          </div>
          <div className="rounded-2xl bg-card p-3 shadow-soft border border-border">
            <div className="text-xs font-extrabold uppercase text-muted-foreground">Estabilidade</div>
            <div className="mt-1 text-lg">{"⭐".repeat(score?.stabilityScore || 3)}</div>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
          <RewardCard icon="⭐" label="+25 XP" tone="bg-sunshine" />
          <RewardCard icon="🌟" label="+3 Estrelas" tone="bg-mint" />
          <RewardCard icon="🔥" label="Streak +1" tone="bg-coral text-white" />
        </div>

        <div className="mt-8 rounded-2xl bg-muted p-4 border border-border">
          <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">
            Progresso na Trilha de LIBRAS
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-background shadow-inner">
            <div className="h-full w-2/4 rounded-full bg-gradient-rainbow" />
          </div>
          <div className="mt-3 text-sm font-bold">50% concluído · Próximo: Desafio do Chefe 🏆</div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={onRestart}
            className="rounded-full border-2 border-foreground/20 bg-card px-7 py-4 font-display font-extrabold shadow-soft hover:bg-muted"
          >
            Repetir lição
          </button>
          <Link
            to="/trilha"
            className="rounded-full bg-primary px-7 py-4 font-display font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105"
          >
            Voltar para o Mapa da Trilha
          </Link>
        </div>
      </div>
    </ScreenShell>
  );
}

function RewardCard({ icon, label, tone }: { icon: string; label: string; tone: string }) {
  return (
    <div className={`animate-pop rounded-2xl ${tone} p-4 shadow-soft`}>
      <div className="text-3xl">{icon}</div>
      <div className="mt-1 font-display text-sm font-extrabold">{label}</div>
    </div>
  );
}
