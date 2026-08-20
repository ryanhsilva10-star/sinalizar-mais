import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import luviMascot from "@/assets/luvi-mascot.png";
import novaAvatar from "@/assets/nova-avatar.png";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding · Descubra seu mundo em LIBRAS · SinaLINK" },
      {
        name: "description",
        content:
          "Responda 4 perguntas rápidas e o SinaLINK escolhe a trilha de LIBRAS ideal: Mundo Cores & Bichos (EF1) ou Mundo Conexão (EF2).",
      },
      { property: "og:title", content: "Onboarding · Descubra seu mundo em LIBRAS" },
      {
        property: "og:description",
        content: "Diagnóstico rápido para alocar o aluno na trilha certa de LIBRAS.",
      },
    ],
  }),
  component: OnboardingPage,
});

type Answer = { label: string; emoji: string; world: "ef1" | "ef2" | "both" };
type Question = { id: string; title: string; hint: string; options: Answer[] };

const QUESTIONS: Question[] = [
  {
    id: "ano",
    title: "Quantos anos você tem?",
    hint: "Isso define o ritmo e a linguagem visual da sua trilha.",
    options: [
      { label: "1º ao 3º ano", emoji: "🧒", world: "ef1" },
      { label: "4º ao 5º ano", emoji: "🎒", world: "ef1" },
      { label: "6º ao 7º ano", emoji: "🛹", world: "ef2" },
      { label: "8º ao 9º ano", emoji: "🎧", world: "ef2" },
    ],
  },
  {
    id: "nivel",
    title: "Você já sabe alguma coisa de LIBRAS?",
    hint: "Sem pressão — a gente ajusta o começo pra você.",
    options: [
      { label: "Nunca pratiquei", emoji: "🌱", world: "both" },
      { label: "Sei o alfabeto", emoji: "🔤", world: "both" },
      { label: "Converso um pouco", emoji: "💬", world: "both" },
      { label: "Uso no dia a dia", emoji: "🤟", world: "both" },
    ],
  },
  {
    id: "motivo",
    title: "Qual é a sua finalidade?",
    hint: "Usamos isso para escolher os temas das primeiras lições.",
    options: [
      { label: "Falar com um amigo", emoji: "🫂", world: "both" },
      { label: "dia a dia em casa", emoji: "🏠", world: "both" },
      { label: "Pedido da escola", emoji: "🏫", world: "both" },
      { label: "Curiosidade mesmo", emoji: "✨", world: "both" },
    ],
  },
  {
    id: "meta",
    title: "Quanto tempo por dia?",
    hint: "Sua meta diária define a ofensiva (streak).",
    options: [
      { label: "3 min · Tranquilo", emoji: "🐢", world: "both" },
      { label: "5 min · Normal", emoji: "🐇", world: "both" },
      { label: "10 min · Sério", emoji: "🔥", world: "both" },
      { label: "15 min · Insano", emoji: "🚀", world: "both" },
    ],
  },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [name, setName] = useState("");

  const total = QUESTIONS.length + 1;
  const done = step >= total;
  const world: "ef1" | "ef2" = answers["ano"]?.world === "ef2" ? "ef2" : "ef1";

  const pick = (q: Question, a: Answer) => {
    setAnswers((prev) => ({ ...prev, [q.id]: a }));
    setTimeout(() => setStep((s) => s + 1), 260);
  };

  return (
    <div className={world === "ef2" && done ? "min-h-screen bg-gradient-teen" : "min-h-screen bg-gradient-hero"}>
      <header className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
        <Link
          to="/"
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-card text-lg font-bold"
          aria-label="Voltar ao início"
        >
          ✕
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-rainbow transition-all duration-500"
            style={{ width: `${(Math.min(step, total) / total) * 100}%` }}
          />
        </div>
        <span className="font-display text-sm font-extrabold text-muted-foreground">
          {Math.min(step + 1, total)}/{total}
        </span>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        {step < QUESTIONS.length && (
          <QuestionCard q={QUESTIONS[step]!} selected={answers[QUESTIONS[step]!.id]} onPick={pick} />
        )}

        {step === QUESTIONS.length && (
          <section className="animate-pop rounded-4xl bg-card p-8 shadow-chunky md:p-12">
            <div className="text-center">
              <img
                src={luviMascot}
                alt="Luvi, mascote do SinaLINK, acenando"
                width={1024}
                height={1024}
                className="mx-auto w-40 animate-bounce-soft"
              />
              <h1 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Como podemos te chamar?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                O Luvi usa seu nome (e o sinal dele!) durante as lições.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome ou apelido"
                aria-label="Seu nome"
                className="mx-auto mt-6 block w-full max-w-sm rounded-2xl border-2 border-input bg-background px-5 py-4 text-center font-display text-xl font-extrabold outline-none focus:border-primary"
              />
              <button
                onClick={() => setStep((s) => s + 1)}
                className="mt-6 rounded-full bg-primary px-10 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1"
              >
                Ver meu mundo →
              </button>
            </div>
          </section>
        )}

        {done && (
          <ResultCard
            world={world}
            name={name.trim()}
            goal={answers["meta"]?.label ?? "5 min · Normal"}
            onStart={() => navigate({ to: "/trilha" })}
          />
        )}
      </main>
    </div>
  );
}

function QuestionCard({
  q,
  selected,
  onPick,
}: {
  q: Question;
  selected?: Answer;
  onPick: (q: Question, a: Answer) => void;
}) {
  return (
    <section className="animate-pop rounded-4xl bg-card p-8 shadow-lg md:p-12">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">{q.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{q.hint}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {q.options.map((o) => {
          const isSel = selected?.label === o.label;
          return (
            <button
              key={o.label}
              onClick={() => onPick(q, o)}
              className={`flex items-center gap-4 rounded-3xl border-4 bg-muted p-5 text-left transition-all ${
                isSel
                  ? "border-mint bg-mint/20 animate-pop"
                  : "border-transparent hover:-translate-y-1 hover:border-blue-20"
              }`}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card text-2xl shadow-soft">
                {o.emoji}
              </span>
              <span className="font-display text-lg font-extrabold">{o.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ResultCard({
  world,
  name,
  goal,
  onStart,
}: {
  world: "ef1" | "ef2";
  name: string;
  goal: string;
  onStart: () => void;
}) {
  const isTeen = world === "ef2";
  return (
    <section
      className={`animate-pop rounded-4xl p-8 shadow-chunky md:p-12 ${
        isTeen ? "bg-teen-bg text-teen-fg shadow-glow-teen" : "bg-card"
      }`}
    >
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Seu mundo é</span>
        <h1 className={`mt-3 font-extrabold ${isTeen ? "font-teen text-4xl md:text-5xl" : "font-display text-4xl md:text-5xl"}`}>
          {isTeen ? "Mundo Conexão" : "Mundo Cores & Bichos"}
        </h1>
        <img
          src={isTeen ? novaAvatar : luviMascot}
          alt={isTeen ? "Nova, avatar guia do Mundo Conexão" : "Luvi, mascote do Mundo Cores & Bichos"}
          width={1024}
          height={1024}
          className="mx-auto my-6 w-52 animate-bounce-soft"
        />
        <p className={isTeen ? "text-teen-fg/70" : "text-muted-foreground"}>
          {name ? `Bora, ${name}! ` : ""}
          {isTeen
            ? "Cultura surda, gírias e gramática espacial em contexto real."
            : "Cores, bichos e micro-vitórias a cada toque, com o Luvi do seu lado."}
        </p>

        <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
          <Badge icon="🎯" label={goal.split(" · ")[0] ?? "5 min"} sub="meta diária" teen={isTeen} />
          <Badge icon="🔥" label="Dia 1" sub="ofensiva" teen={isTeen} />
          <Badge icon="❤️" label="5" sub="vidas" teen={isTeen} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={onStart}
            className="rounded-full bg-primary px-10 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1"
          >
            Abrir minha trilha →
          </button>
          <Link
            to="/licao"
            className={`rounded-full border-2 px-8 py-4 font-display text-lg font-extrabold ${
              isTeen ? "border-teen-fg/30" : "border-foreground/20 bg-card"
            }`}
          >
            Testar lição demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function Badge({ icon, label, sub, teen }: { icon: string; label: string; sub: string; teen: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${teen ? "bg-teen-fg/10" : "bg-muted"}`}>
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 font-display text-lg font-extrabold">{label}</div>
      <div className={`text-[11px] font-bold uppercase tracking-wide ${teen ? "text-teen-fg/60" : "text-muted-foreground"}`}>
        {sub}
      </div>
    </div>
  );
}
