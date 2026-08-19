import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import luviMascot from "@/assets/luvi-mascot.png";

export const Route = createFileRoute("/licao")({
  head: () => ({
    meta: [
      { title: "Lição demo: Cores em LIBRAS · SinaLINK" },
      { name: "description", content: "Experimente uma micro-lição de LIBRAS com o Luvi. 5 telas rápidas com atividades interativas." },
      { property: "og:title", content: "Lição demo: Cores em LIBRAS · SinaLINK" },
      { property: "og:description", content: "5 telas, 3 minutos, aprenda cores em LIBRAS brincando." },
    ],
  }),
  component: LessonPage,
});

type Color = { pt: string; sign: string; emoji: string; tone: string };
const COLORS: Color[] = [
  { pt: "VERMELHO", sign: "indicador tocando o lábio", emoji: "🍎", tone: "bg-coral" },
  { pt: "AZUL", sign: "mão em B balançando na altura do ombro", emoji: "💙", tone: "bg-sky" },
  { pt: "AMARELO", sign: "mão em Y balançando no lado do rosto", emoji: "🌻", tone: "bg-sunshine" },
];

function LessonPage() {
  const [step, setStep] = useState(0);
  const total = 5;
  const next = () => setStep((s) => Math.min(s + 1, total));
  const restart = () => setStep(0);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <TopBar step={step} total={total} onExit={restart} />
      <div className="mx-auto max-w-3xl px-7 py-12">
        {step === 0 && <ScreenIntro onNext={next} />}
        {step === 1 && <ScreenTeach onNext={next} />}
        {step === 2 && <ScreenQuiz onNext={next} target={COLORS[1]} />}
        {step === 3 && <ScreenBubble onNext={next} target={COLORS[2]} />}
        {step === 4 && <ScreenMirror onNext={next} target={COLORS[0]} />}
        {step === 5 && <ScreenReward onRestart={restart} />}
      </div>
    </div>
  );
}

function TopBar({ step, total, onExit }: { step: number; total: number; onExit: () => void }) {
  const pct = (step / total) * 100;
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-card text-lg font-bold" aria-label="Sair">✕</Link>
        <div className="flex-1">
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-rainbow transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 shadow-soft">
          <span className="text-lg">❤️</span>
          <span className="font-display font-extrabold">5</span>
        </div>
        <button onClick={onExit} className="hidden text-xs font-bold text-muted-foreground hover:text-foreground md:block">Reiniciar</button>
      </div>
    </div>
  );
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return <div className="animate-pop rounded-4xl bg-card p-8 shadow-chunky md:p-12">{children}</div>;
}

function ScreenIntro({ onNext }: { onNext: () => void }) {
  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">EF1 · Nível 4 · Lição 1</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">Vamos aprender as cores em LIBRAS!</h1>
        <img src={luviMascot} alt="Luvi acenando com balões coloridos" width={1024} height={1024} className="mx-auto my-6 w-64 animate-bounce-soft" />
        <div className="mx-auto mb-6 flex max-w-xs justify-center gap-3">
          {COLORS.map((c) => (
            <span key={c.pt} className={`grid h-14 w-14 place-items-center rounded-2xl ${c.tone} text-2xl shadow-chunky animate-float`} style={{ animationDelay: `${COLORS.indexOf(c) * 0.4}s` }}>
              {c.emoji}
            </span>
          ))}
        </div>
        <button onClick={onNext} className="rounded-full bg-primary px-10 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1">
          ▶ Começar
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
        <h2 className="font-display text-2xl font-extrabold">Aprenda o sinal ({i + 1}/{COLORS.length})</h2>
        <div className="relative mx-auto mt-6 grid h-72 w-full max-w-md place-items-center overflow-hidden rounded-3xl bg-muted">
          {/* Avatar placeholder — em produção, GIF/vídeo do avatar sinalizando */}
          <div className="text-center">
            <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-gradient-rainbow text-6xl shadow-glow-teen animate-wiggle">
              🤟
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Avatar 3D sinalizando</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.sign}</p>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button className="rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-soft">▶ 1x</button>
            <button className="rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-soft">🐢 0.5x</button>
            <button className="rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-soft">🔄 lado</button>
          </div>
        </div>
        <div className={`mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl ${c.tone} px-6 py-3 shadow-chunky`}>
          <span className="text-3xl">{c.emoji}</span>
          <span className="font-display text-3xl font-extrabold">{c.pt}</span>
        </div>
        <div className="mt-8">
          <button onClick={advance} className="rounded-full bg-foreground px-10 py-4 font-display text-lg font-extrabold text-background transition-transform hover:-translate-y-1">
            Entendi ✓
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
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Qual é o sinal?</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Toque no avatar que sinaliza <span className="rounded-xl bg-accent px-3 py-1">{target.pt}</span>
        </h2>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {COLORS.map((c) => {
            const isSel = choice === c.pt;
            const isRight = isSel && c.pt === target.pt;
            const isWrong = isSel && c.pt !== target.pt;
            return (
              <button
                key={c.pt}
                onClick={() => !choice && setChoice(c.pt)}
                className={`group relative grid aspect-square place-items-center rounded-3xl border-4 bg-muted transition-all ${
                  isRight ? "border-mint bg-mint/20 animate-pop" :
                  isWrong ? "border-destructive bg-destructive/10" :
                  "border-transparent hover:border-primary hover:-translate-y-1"
                }`}
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-rainbow text-4xl shadow-chunky">🤟</div>
                <span className="absolute bottom-2 text-xs font-bold text-muted-foreground opacity-60">Avatar {COLORS.indexOf(c) + 1}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-8 min-h-[80px]">
          {correct && (
            <div className="animate-pop rounded-2xl bg-mint/30 p-4">
              <div className="font-display text-xl font-extrabold text-foreground">Perfeito! 🎉</div>
              <p className="text-sm text-foreground/70">Luvi está pulando de alegria.</p>
            </div>
          )}
          {choice && !correct && (
            <div className="animate-pop rounded-2xl bg-destructive/10 p-4">
              <div className="font-display text-xl font-extrabold">Quase! 👀</div>
              <p className="text-sm text-foreground/70">O sinal correto é o <b>{target.pt}</b>. Tente na próxima!</p>
            </div>
          )}
        </div>
        {choice && (
          <button onClick={onNext} className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky">
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
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Estoure a bolha 🫧</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Estoure o sinal de <span className="rounded-xl bg-accent px-3 py-1">{target.pt}</span>
        </h2>
        <div className="relative mt-8 grid h-72 place-items-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky/30 to-mint/20">
          <div className="flex items-end justify-around gap-6">
            {COLORS.map((c, i) => {
              const isPopped = popped === c.pt;
              const isRight = isPopped && c.pt === target.pt;
              return (
                <button
                  key={c.pt}
                  onClick={() => !popped && setPopped(c.pt)}
                  disabled={!!popped}
                  style={{ animationDelay: `${i * 0.5}s` }}
                  className={`animate-float rounded-full ${c.tone} shadow-chunky transition-all ${
                    isPopped ? (isRight ? "scale-125 opacity-30" : "scale-75 opacity-40") : "hover:scale-110"
                  }`}
                >
                  <div className="grid h-24 w-24 place-items-center text-4xl">{c.emoji}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6 min-h-[60px]">
          {popped && popped === target.pt && <div className="animate-pop font-display text-2xl font-extrabold text-mint">Boa! Estourou certinho! 🎯</div>}
          {popped && popped !== target.pt && <div className="animate-pop text-lg font-bold text-destructive">Ops, era o {target.pt}!</div>}
        </div>
        {popped && (
          <button onClick={onNext} className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky">
            Próximo desafio →
          </button>
        )}
      </div>
    </ScreenShell>
  );
}

function ScreenMirror({ target, onNext }: { target: Color; onNext: () => void }) {
  const [state, setState] = useState<"idle" | "recording" | "result">("idle");
  const start = () => {
    setState("recording");
    setTimeout(() => setState("result"), 2200);
  };
  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">🪞 Desafio do espelho</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Faça o sinal de <span className="rounded-xl bg-accent px-3 py-1">{target.pt}</span>
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Avatar */}
          <div className="grid h-64 place-items-center rounded-3xl bg-muted">
            <div className="text-center">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-rainbow text-5xl shadow-glow-teen animate-wiggle">🤟</div>
              <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">Avatar exemplo</p>
            </div>
          </div>
          {/* Câmera */}
          <div className="relative grid h-64 place-items-center overflow-hidden rounded-3xl border-4 border-dashed border-primary/50 bg-foreground/90 text-background">
            {state === "idle" && (
              <div className="text-center">
                <div className="text-5xl">📷</div>
                <p className="mt-2 text-sm font-bold">Sua câmera</p>
                <p className="text-xs opacity-70">Contorno-guia da mão</p>
              </div>
            )}
            {state === "recording" && (
              <div className="text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-3xl animate-pop">3</div>
                <p className="mt-3 text-sm font-bold">Gravando…</p>
              </div>
            )}
            {state === "result" && (
              <div className="text-center">
                <div className="text-5xl">✨</div>
                <p className="mt-2 font-display text-xl font-extrabold">Ótimo sinal!</p>
              </div>
            )}
          </div>
        </div>

        {state === "result" && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { l: "Mão", s: 3 },
              { l: "Local", s: 3 },
              { l: "Movimento", s: 2 },
            ].map((r) => (
              <div key={r.l} className="animate-pop rounded-2xl bg-card p-3 shadow-soft">
                <div className="text-xs font-bold uppercase text-muted-foreground">{r.l}</div>
                <div className="text-xl">{"⭐".repeat(r.s)}{"☆".repeat(3 - r.s)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          {state === "idle" && (
            <button onClick={start} className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky">
              🎬 Começar 3-2-1
            </button>
          )}
          {state === "result" && (
            <button onClick={onNext} className="rounded-full bg-foreground px-12 py-5 font-display text-lg font-extrabold text-background shadow-chunky">
              Finalizar lição →
            </button>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenReward({ onRestart }: { onRestart: () => void }) {
  return (
    <ScreenShell>
      <div className="text-center">
        <div className="relative">
          <img src={luviMascot} alt="Luvi celebrando" width={1024} height={1024} className="mx-auto w-56 animate-bounce-soft" />
          <div className="absolute inset-0 -z-10 bg-gradient-rainbow opacity-30 blur-3xl" />
        </div>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Lição completa! 🎉</h1>
        <p className="mt-3 text-muted-foreground">Você acabou de aprender 3 cores em LIBRAS.</p>

        <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
          <RewardCard icon="⭐" label="+10 XP" tone="bg-sunshine" />
          <RewardCard icon="🌟" label="+3 Estrelinhas" tone="bg-mint" />
          <RewardCard icon="🔥" label="Streak 12" tone="bg-coral text-white" />
        </div>

        <div className="mt-9 rounded-2xl bg-muted p-4">
          <div className="mb-3 text-xs font-bold uppercase text-muted-foreground">Progresso da trilha "Cores"</div>
          <div className="h-4 overflow-hidden rounded-full bg-background">
            <div className="h-full w-1/4 rounded-full bg-gradient-rainbow" />
          </div>
          <div className="mt-4 text-sm font-bold">25% concluído · Próxima: Verde & Rosa</div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={onRestart} className="rounded-full border-4 border-foreground/20 bg-card px-7 py-4 font-display font-extrabold shadow-soft">
            Repetir lição
          </button>
          <Link to="/" className="rounded-full bg-primary px-7 py-4 font-display font-extrabold text-primary-foreground shadow-chunky">
            Voltar ao início
          </Link>
        </div>
      </div>
    </ScreenShell>
  );
}

function RewardCard({ icon, label, tone }: { icon: string; label: string; tone: string }) {
  return (
    <div className={`animate-pop rounded-2xl ${tone} p-4 shadow-chunky`}>
      <div className="text-3xl">{icon}</div>
      <div className="mt-1 font-display text-sm font-extrabold">{label}</div>
    </div>
  );
}
