import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import luviMascot from "@/assets/luvi-mascot.png";
import { LibrasLessonMirror, type LessonMirrorScore } from "@/components/LibrasLessonMirror";
import { soundFx } from "@/lib/sound-effects";
import { getActiveUser, saveUser, User } from "@/lib/user-store";
import { toast } from "sonner";

export type LessonItem = {
  pt: string;
  sign: string;
  emoji: string;
  tone: string;
  targetLetter: string;
  signTip: string;
  handShapeDesc?: string;
  bodyLocation?: string;
};

export type LessonNodeData = {
  id: number;
  title: string;
  subtitle: string;
  colors: LessonItem[];
};

export const LESSONS_DATA: Record<number, LessonNodeData> = {
  1: {
    id: 1,
    title: "Oi & Tchau em LIBRAS",
    subtitle: "Saudações para Iniciantes do Zero",
    colors: [
      {
        pt: "OI",
        sign: "Mão em 'O' acenando suavemente",
        emoji: "👋",
        tone: "bg-sky",
        targetLetter: "O",
        signTip: "Junte a ponta dos dedos formando um 'O' com a mão e acene suavemente.",
        handShapeDesc: "Dedos curvados formando a letra 'O'",
        bodyLocation: "Ao lado do rosto / ombro",
      },
      {
        pt: "TCHAU",
        sign: "Mão aberta em 'B' acenando",
        emoji: "✋",
        tone: "bg-sunshine",
        targetLetter: "B",
        signTip: "Mão aberta com os 4 dedos juntos e polegar dobrado, balançando para os lados.",
        handShapeDesc: "Mão em 'B' (palma para frente)",
        bodyLocation: "Altura do peito ou ombro",
      },
      {
        pt: "BOM DIA",
        sign: "Mão nos lábios abrindo para frente",
        emoji: "🌅",
        tone: "bg-coral",
        targetLetter: "B",
        signTip: "Toque a ponta dos dedos nos lábios e abra a mão para frente como o nascer do sol.",
        handShapeDesc: "Mão fechando na boca e abrindo em 'B'",
        bodyLocation: "Lábios e abrindo para frente",
      },
    ],
  },
  2: {
    id: 2,
    title: "Meu nome é… em LIBRAS",
    subtitle: "Apresentação Pessoal e Identidade",
    colors: [
      {
        pt: "NOME",
        sign: "Indicador e médio juntos tocando a palma",
        emoji: "🪪",
        tone: "bg-grape",
        targetLetter: "N",
        signTip: "Junte indicador e médio como a letra 'N' e passe suavemente no peito ou dorso da outra mão.",
        handShapeDesc: "Mão em 'N' (dois dedos apontados)",
        bodyLocation: "Peito ou dorso da mão passiva",
      },
      {
        pt: "MEU",
        sign: "Mão aberta no centro do peito",
        emoji: "👤",
        tone: "bg-sky",
        targetLetter: "M",
        signTip: "Encoste a palma da mão aberta no peito com gentileza para indicar posse (meu/minha).",
        handShapeDesc: "Palma aberta espalmada",
        bodyLocation: "Centro do peito",
      },
      {
        pt: "PRAZER",
        sign: "Mão aberta fazendo círculos no peito",
        emoji: "😊",
        tone: "bg-mint",
        targetLetter: "P",
        signTip: "Faça movimentos circulares leves no peito sorrindo para mostrar alegria no encontro.",
        handShapeDesc: "Mão espalmada em círculo",
        bodyLocation: "Região do tórax",
      },
    ],
  },
  3: {
    id: 3,
    title: "Revisão relâmpago: Saudações",
    subtitle: "Fixação e Prática Interativa",
    colors: [
      {
        pt: "OI",
        sign: "Mão em 'O' acenando",
        emoji: "👋",
        tone: "bg-sky",
        targetLetter: "O",
        signTip: "Mão em 'O' acenando alegremente.",
        handShapeDesc: "Letra 'O'",
        bodyLocation: "Ao lado do rosto",
      },
      {
        pt: "NOME",
        sign: "Indicador e médio em 'N'",
        emoji: "🪪",
        tone: "bg-grape",
        targetLetter: "N",
        signTip: "Dois dedos juntos indicando nome.",
        handShapeDesc: "Letra 'N'",
        bodyLocation: "Frente do corpo",
      },
      {
        pt: "TCHAU",
        sign: "Mão aberta acenando",
        emoji: "✋",
        tone: "bg-sunshine",
        targetLetter: "B",
        signTip: "Mão aberta acenando de despedida.",
        handShapeDesc: "Letra 'B'",
        bodyLocation: "Altura do ombro",
      },
    ],
  },
  4: {
    id: 4,
    title: "Desafio do Chefe: Cumprimentos",
    subtitle: "Cortesia e Boa Convivência",
    colors: [
      {
        pt: "OBRIGADO",
        sign: "Mão na testa descendo ao peito",
        emoji: "🏆",
        tone: "bg-coral",
        targetLetter: "O",
        signTip: "Toque a ponta dos dedos na testa e leve a mão para frente em sinal de gratidão.",
        handShapeDesc: "Mão em 'O' ou espalmada",
        bodyLocation: "Testa até o peito",
      },
      {
        pt: "POR FAVOR",
        sign: "Mãos postas juntas no peito",
        emoji: "🙏",
        tone: "bg-sunshine",
        targetLetter: "P",
        signTip: "Junte as duas palmas das mãos na altura do peito, como num pedido respeitoso.",
        handShapeDesc: "Mãos unidas espalmadas",
        bodyLocation: "Peito",
      },
      {
        pt: "DESCULPA",
        sign: "Mão em 'Y' encostada no queixo",
        emoji: "🤝",
        tone: "bg-neon",
        targetLetter: "Y",
        signTip: "Faça a mão em 'Y' (Hang Loose) e encoste o polegar no queixo com olhar amigável.",
        handShapeDesc: "Mão em 'Y' (Polegar e mínimo estendidos)",
        bodyLocation: "Queixo",
      },
    ],
  },
  5: {
    id: 5,
    title: "Cores quentes em LIBRAS",
    subtitle: "Vermelho, Amarelo e Laranja",
    colors: [
      {
        pt: "VERMELHO",
        sign: "Mão em 'D' tocando o lábio",
        emoji: "🍎",
        tone: "bg-coral",
        targetLetter: "D",
        signTip: "Aponte o indicador para cima e toque no lábio inferior descendo levemente.",
        handShapeDesc: "Mão em 'D' (indicador estendido)",
        bodyLocation: "Lábio inferior",
      },
      {
        pt: "AMARELO",
        sign: "Mão em 'Y' descendo no rosto",
        emoji: "🌻",
        tone: "bg-sunshine",
        targetLetter: "Y",
        signTip: "Faça a letra 'Y' e desça a mão suavemente ao lado do rosto.",
        handShapeDesc: "Mão em 'Y'",
        bodyLocation: "Bochecha / Rosto",
      },
      {
        pt: "LARANJA",
        sign: "Mão abrindo e fechando na boca",
        emoji: "🍊",
        tone: "bg-coral",
        targetLetter: "L",
        signTip: "Abra e feche os dedos em garra na frente da boca como se espremesse uma laranja.",
        handShapeDesc: "Mão em garra / 'C' fechando",
        bodyLocation: "Frente da boca",
      },
    ],
  },
  6: {
    id: 6,
    title: "Cores frias em LIBRAS",
    subtitle: "Azul, Amarelo e Vermelho",
    colors: [
      {
        pt: "AZUL",
        sign: "Mão em 'B' balançando levemente",
        emoji: "💙",
        tone: "bg-sky",
        targetLetter: "B",
        signTip: "4 dedos estendidos para CIMA e polegar dobrado na palma, balançando o pulso.",
        handShapeDesc: "Letra 'B' estendida",
        bodyLocation: "Espaço neutro na frente do peito",
      },
      {
        pt: "AMARELO",
        sign: "Mão em 'Y' descendo ao lado do rosto",
        emoji: "🌻",
        tone: "bg-sunshine",
        targetLetter: "Y",
        signTip: "Polegar e dedo mínimo estendidos para os lados (Hang Loose) descendo no rosto.",
        handShapeDesc: "Letra 'Y'",
        bodyLocation: "Ao lado da bochecha",
      },
      {
        pt: "VERMELHO",
        sign: "Mão em 'D' tocando o lábio",
        emoji: "🍎",
        tone: "bg-coral",
        targetLetter: "D",
        signTip: "Indicador estendido para CIMA e pontas dos demais dedos unidas ao polegar.",
        handShapeDesc: "Letra 'D'",
        bodyLocation: "Lábios",
      },
    ],
  },
  7: {
    id: 7,
    title: "Desafio do espelho com IA",
    subtitle: "Prática e Validação na Câmera",
    colors: [
      {
        pt: "AZUL",
        sign: "Mão em 'B' no espelho com IA",
        emoji: "🪞",
        tone: "bg-sky",
        targetLetter: "B",
        signTip: "Posicione a mão em 'B' bem visível para o sensor de câmera.",
        handShapeDesc: "Letra 'B'",
        bodyLocation: "Frente da câmera",
      },
      {
        pt: "VERMELHO",
        sign: "Mão em 'D' no espelho com IA",
        emoji: "🍎",
        tone: "bg-coral",
        targetLetter: "D",
        signTip: "Faça a letra 'D' focando no centro da tela.",
        handShapeDesc: "Letra 'D'",
        bodyLocation: "Frente da câmera",
      },
      {
        pt: "AMARELO",
        sign: "Mão em 'Y' no espelho com IA",
        emoji: "🌻",
        tone: "bg-sunshine",
        targetLetter: "Y",
        signTip: "Mantenha a mão em 'Y' firme por 2 segundos para validar.",
        handShapeDesc: "Letra 'Y'",
        bodyLocation: "Frente da câmera",
      },
    ],
  },
  8: {
    id: 8,
    title: "Desafio do Chefe: Arco-íris",
    subtitle: "Mistura e Identificação de Cores",
    colors: [
      {
        pt: "ARCO-IRIS",
        sign: "Mão em 'A' desenhando um arco no ar",
        emoji: "🌈",
        tone: "bg-grape",
        targetLetter: "A",
        signTip: "Mão fechada em 'A' desenhando um grande arco colorido de um lado ao outro.",
        handShapeDesc: "Mão em 'A' deslizando",
        bodyLocation: "Ar (de esquerda a direita)",
      },
      {
        pt: "AZUL",
        sign: "Mão em 'B' balançando",
        emoji: "💙",
        tone: "bg-sky",
        targetLetter: "B",
        signTip: "4 dedos estendidos em 'B'.",
        handShapeDesc: "Letra 'B'",
        bodyLocation: "Espaço neutro",
      },
      {
        pt: "AMARELO",
        sign: "Mão em 'Y' descendo",
        emoji: "🌻",
        tone: "bg-sunshine",
        targetLetter: "Y",
        signTip: "Sinal de amarelo com 'Y'.",
        handShapeDesc: "Letra 'Y'",
        bodyLocation: "Rosto",
      },
    ],
  },
  9: {
    id: 9,
    title: "Bichos de casa em LIBRAS",
    subtitle: "Animais Domésticos do Cotidiano",
    colors: [
      {
        pt: "CAO",
        sign: "Mão estalando dedos em 'C' perto da perna",
        emoji: "🐶",
        tone: "bg-sunshine",
        targetLetter: "C",
        signTip: "Faça a mão em 'C' e estale os dedos próximo à perna como se chamasse um cãozinho.",
        handShapeDesc: "Mão em 'C' estalando",
        bodyLocation: "Altura da perna / cintura",
      },
      {
        pt: "GATO",
        sign: "Mão puxando os bigodes na bochecha",
        emoji: "🐱",
        tone: "bg-mint",
        targetLetter: "G",
        signTip: "Puxe os dedos para o lado a partir da bochecha imitando os bigodes do gato.",
        handShapeDesc: "Dedos puxando lateralmente",
        bodyLocation: "Bochechas",
      },
      {
        pt: "COELHO",
        sign: "Mãos em 'C' simulando orelhas balançando",
        emoji: "🐰",
        tone: "bg-sky",
        targetLetter: "C",
        signTip: "Coloque as mãos atrás da cabeça e balance os dedos imitando as orelhas do coelho.",
        handShapeDesc: "Mãos atrás da cabeça",
        bodyLocation: "Topo da cabeça",
      },
    ],
  },
  10: {
    id: 10,
    title: "Bichos da fazenda em LIBRAS",
    subtitle: "Animais da Fazenda",
    colors: [
      {
        pt: "VACA",
        sign: "Mão em 'Y' na cabeça simulando chifres",
        emoji: "🐄",
        tone: "bg-grape",
        targetLetter: "V",
        signTip: "Encoste a base do polegar em 'Y' nas têmporas simulando os chifres da vaca.",
        handShapeDesc: "Mão em 'Y' nas têmporas",
        bodyLocation: "Lado da cabeça",
      },
      {
        pt: "CAVALO",
        sign: "Mão em 'U' ao lado da cabeça balançando",
        emoji: "🐴",
        tone: "bg-coral",
        targetLetter: "C",
        signTip: "Coloque a mão na têmpora com indicador e médio estendidos imitando a orelha do cavalo.",
        handShapeDesc: "Mão em 'U' (dois dedos estendidos)",
        bodyLocation: "Têmpora",
      },
      {
        pt: "GALINHA",
        sign: "Mão em 'G' simulando bico abrindo na boca",
        emoji: "🐔",
        tone: "bg-sunshine",
        targetLetter: "G",
        signTip: "Junte indicador e polegar em bico na frente da boca e abra/feche imitando a galinha.",
        handShapeDesc: "Mão em 'G' (bico)",
        bodyLocation: "Frente da boca",
      },
    ],
  },
  11: {
    id: 11,
    title: "Revisão relâmpago: Animais",
    subtitle: "Fixação e Prática Divertida",
    colors: [
      {
        pt: "CAO",
        sign: "Mão em 'C' estalando",
        emoji: "🐶",
        tone: "bg-sunshine",
        targetLetter: "C",
        signTip: "Sinal de cão em LIBRAS.",
        handShapeDesc: "Letra 'C'",
        bodyLocation: "Perna / Cintura",
      },
      {
        pt: "VACA",
        sign: "Mão em 'Y' simulando chifres",
        emoji: "🐄",
        tone: "bg-grape",
        targetLetter: "V",
        signTip: "Chifres da vaca em 'Y'.",
        handShapeDesc: "Letra 'Y'",
        bodyLocation: "Cabeça",
      },
      {
        pt: "GATO",
        sign: "Bigode do gato",
        emoji: "🐱",
        tone: "bg-mint",
        targetLetter: "G",
        signTip: "Bigode do gato.",
        handShapeDesc: "Bigodes",
        bodyLocation: "Bochecha",
      },
    ],
  },
  12: {
    id: 12,
    title: "Desafio do Chefe: Castelo do Saber",
    subtitle: "Grande Celebração do Conhecimento",
    colors: [
      {
        pt: "CASTELO",
        sign: "Mãos levantadas formando torres",
        emoji: "🏰",
        tone: "bg-neon",
        targetLetter: "C",
        signTip: "Eleve os braços formando o contorno das torres de um castelo no ar.",
        handShapeDesc: "Mãos imitando torres",
        bodyLocation: "Ar (acima dos ombros)",
      },
      {
        pt: "SABER",
        sign: "Mão em 'S' tocando o lado da cabeça",
        emoji: "🧠",
        tone: "bg-sky",
        targetLetter: "S",
        signTip: "Toque o lado da testa indicando que você aprendeu com sabedoria.",
        handShapeDesc: "Mão em 'S' ou indicador na cabeça",
        bodyLocation: "Têmpora / Testa",
      },
      {
        pt: "VITORIA",
        sign: "Mão em 'V' levantada em celebração",
        emoji: "🏆",
        tone: "bg-sunshine",
        targetLetter: "V",
        signTip: "Faça o sinal de 'V' bem alto com o braço estendido comemorando!",
        handShapeDesc: "Sinal de 'V' de Vitória",
        bodyLocation: "No ar",
      },
    ],
  },
};

type LicaoSearch = {
  nodeId?: number;
};

export const Route = createFileRoute("/licao")({
  validateSearch: (search: Record<string, unknown>): LicaoSearch => {
    const raw = search?.nodeId;
    const parsed = typeof raw === "number" ? raw : parseInt(String(raw || ""), 10);
    return {
      nodeId: !isNaN(parsed) && parsed >= 1 && parsed <= 12 ? parsed : 6,
    };
  },
  head: () => ({
    meta: [
      { title: "Lição interativa com IA · SinaLINK" },
      {
        name: "description",
        content:
          "Aprenda sinais em LIBRAS com feedback de inteligência artificial em tempo real na câmera e gamificação.",
      },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const nodeId = search.nodeId || 6;
  const currentLesson = LESSONS_DATA[nodeId] || LESSONS_DATA[6];
  const colors = currentLesson.colors;

  const [isValidating, setIsValidating] = useState(true);
  const [authorizedUser, setAuthorizedUser] = useState<User | null>(null);

  const [step, setStep] = useState(0);
  const [mirrorScore, setMirrorScore] = useState<LessonMirrorScore | null>(null);
  const total = 5;

  useEffect(() => {
    setStep(0);
    setMirrorScore(null);
  }, [nodeId]);

  useEffect(() => {
    const user = getActiveUser();

    if (!user) {
      toast.error("🔒 Faça login como Aluno para acessar as lições de LIBRAS.");
      navigate({ to: "/login", replace: true });
      return;
    }

    if (user.role === "professor") {
      toast.info("🔒 Professores não realizam lições diretas de alunos. Redirecionando para o Painel.");
      navigate({ to: "/onboarding", replace: true });
      return;
    }

    setAuthorizedUser(user);
    setIsValidating(false);
  }, [navigate]);

  const next = () => {
    soundFx.playPop();
    const nextStep = Math.min(step + 1, total);
    setStep(nextStep);

    // Ao atingir o passo final (Recompensa), salva a lição concluída
    if (nextStep === total && authorizedUser) {
      const scoreVal = mirrorScore
        ? Math.round(((mirrorScore.accuracy + mirrorScore.orientationScore + mirrorScore.stabilityScore) / 9) * 100)
        : 85;

      const lessonId = `trail_node_${nodeId}`;
      const existingLessons = authorizedUser.completedLessons ?? [];
      const alreadyDone = existingLessons.some((l) => l.id === lessonId);
      if (!alreadyDone) {
        const updated = saveUser({
          ...authorizedUser,
          completedLessons: [
            ...existingLessons,
            {
              id: lessonId,
              title: currentLesson.title,
              score: scoreVal,
              completedAt: new Date().toISOString().split("T")[0],
            },
          ],
          xp: (authorizedUser.xp ?? 0) + 25,
          streak: (authorizedUser.streak ?? 0) + 1,
        });
        setAuthorizedUser(updated);
      }
    }
  };

  const restart = () => {
    setMirrorScore(null);
    setStep(0);
  };

  const handleNextLesson = () => {
    const nextId = nodeId + 1;
    if (nextId <= 12) {
      navigate({ to: "/licao", search: { nodeId: nextId } });
      soundFx.playChime();
    }
  };

  if (isValidating || !authorizedUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 font-display text-sm font-extrabold text-muted-foreground">
            Verificando permissões da lição...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero shadow">
      <TopBar step={step} total={total} title={currentLesson.title} onExit={restart} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-7 sm:py-12">
        {step === 0 && <ScreenIntro lesson={currentLesson} onNext={next} />}
        {step === 1 && <ScreenTeach lesson={currentLesson} onNext={next} />}
        {step === 2 && <ScreenQuiz target={colors[0]} colors={colors} onNext={next} />}
        {step === 3 && <ScreenBubble target={colors[1] || colors[0]} colors={colors} onNext={next} />}
        {step === 4 && (
          <ScreenMirror
            target={colors[0]}
            colors={colors}
            onNext={(score) => {
              setMirrorScore(score);
              next();
            }}
          />
        )}
        {step === 5 && (
          <ScreenReward
            nodeId={nodeId}
            score={mirrorScore}
            onRestart={restart}
            onNextLesson={handleNextLesson}
          />
        )}
      </div>
    </div>
  );
}

function TopBar({
  step,
  total,
  title,
  onExit,
}: {
  step: number;
  total: number;
  title: string;
  onExit: () => void;
}) {
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
          <div className="flex justify-between text-xs font-extrabold mb-1">
            <span className="text-primary truncate max-w-[200px] sm:max-w-none">{title}</span>
            <span className="text-muted-foreground">{step}/{total}</span>
          </div>
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

function ScreenIntro({ lesson, onNext }: { lesson: LessonNodeData; onNext: () => void }) {
  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          EF1 · Fase {lesson.id} · Lição Interativa para Iniciantes
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-bold">{lesson.subtitle}</p>

        {/* Card Dica de Iniciante */}
        <div className="mx-auto my-5 flex max-w-md items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-left text-xs text-amber-900 dark:text-amber-200 shadow-xs">
          <span className="text-3xl shrink-0">💡</span>
          <div>
            <strong className="font-extrabold block text-amber-950 dark:text-amber-100 text-sm">
              Primeira vez aprendendo LIBRAS?
            </strong>
            A LIBRAS é uma língua visual! Observe o formato dos dedos (Configuração de Mão) e a posição no corpo. Siga os passos no seu próprio ritmo!
          </div>
        </div>

        <img
          src={luviMascot}
          alt="Luvi acenando"
          width={1024}
          height={1024}
          className="mx-auto my-4 w-48 animate-bounce-soft drop-shadow-xl/25 sm:w-56"
        />

        <div className="mx-auto mb-6 flex max-w-xs justify-center gap-3 drop-shadow-xl/25">
          {lesson.colors.map((c, idx) => (
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
          ▶ Começar Lição Passo a Passo
        </button>
      </div>
    </ScreenShell>
  );
}

function ScreenTeach({ lesson, onNext }: { lesson: LessonNodeData; onNext: () => void }) {
  const [i, setI] = useState(0);
  const colors = lesson.colors;
  const c = colors[i] || colors[0];
  const advance = () => (i < colors.length - 1 ? setI(i + 1) : onNext());

  return (
    <ScreenShell>
      <div className="text-center">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Passo 1: Aprendizado e Gestos
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
            Sinal {i + 1} de {colors.length}
          </span>
        </div>

        <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          Como fazer o sinal de <span className="text-primary">{c.pt}</span>
        </h2>

        {/* Card Principal Didático de LIBRAS */}
        <div className="relative mx-auto mt-6 grid h-80 w-full max-w-md place-items-center overflow-hidden rounded-3xl bg-muted border border-border p-4 shadow-inner">
          <div className="text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-gradient-rainbow text-5xl shadow-glow-teen animate-wiggle">
              {c.emoji}
            </div>
            
            <div className="mt-3 font-display text-sm font-extrabold uppercase tracking-wide text-foreground">
              Configuração de Mão: Letra {c.targetLetter}
            </div>

            {c.handShapeDesc && (
              <div className="mt-1 text-xs font-bold text-primary">
                ✋ Formato: {c.handShapeDesc}
              </div>
            )}

            {c.bodyLocation && (
              <div className="mt-0.5 text-xs text-muted-foreground">
                📍 Ponto de Articulação: {c.bodyLocation}
              </div>
            )}

            <p className="mx-auto mt-2 max-w-xs text-xs font-medium text-foreground/90 bg-card/70 p-2 rounded-xl border border-border">
              {c.signTip}
            </p>
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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={advance}
            className="rounded-full bg-foreground px-10 py-4 font-display text-lg font-extrabold text-background transition-transform hover:-translate-y-1 shadow-chunky active:scale-95"
          >
            {i < colors.length - 1 ? "Próximo Sinal →" : "Entendi, vamos aos Desafios Interativos! ✓"}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenQuiz({
  target,
  colors,
  onNext,
}: {
  target: LessonItem;
  colors: LessonItem[];
  onNext: () => void;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const correct = choice === target.pt;

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Passo 2: Desafio de Fixação
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Qual opção usa a mão na letra{" "}
          <span className="rounded-xl bg-accent px-3 py-1">{target.targetLetter}</span>?
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">Dica: {target.signTip}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {colors.map((c) => {
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
                Você identificou corretamente! O sinal de <b>{target.pt}</b> utiliza a configuração de mão na letra <b>{target.targetLetter}</b>.
              </p>
            </div>
          )}
          {choice && !correct && (
            <div className="animate-pop rounded-2xl bg-destructive/10 p-4 border border-destructive/20">
              <div className="font-display text-xl font-extrabold">Quase! 👀</div>
              <p className="text-sm text-foreground/80">
                A resposta certa é <b>{target.pt}</b> (mão em {target.targetLetter}). Não se preocupe, errar faz parte do aprendizado!
              </p>
            </div>
          )}
        </div>

        {choice && (
          <button
            onClick={onNext}
            className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105"
          >
            Continuar para o Jogo das Bolhas →
          </button>
        )}
      </div>
    </ScreenShell>
  );
}

function ScreenBubble({
  target,
  colors,
  onNext,
}: {
  target: LessonItem;
  colors: LessonItem[];
  onNext: () => void;
}) {
  const [popped, setPopped] = useState<string | null>(null);

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Passo 3: Jogo das Bolhas Flutuantes 🫧
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Estoure a bolha do sinal de: <span className="rounded-xl bg-accent px-3 py-1">{target.pt}</span>
        </h2>

        <div className="relative mt-8 grid h-72 place-items-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky/30 to-mint/20 border border-border">
          <div className="flex items-end justify-around gap-6 drop-shadow-xl/25">
            {colors.map((c, i) => {
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
              Boa! Estourou a bolha certa! 🎯
            </div>
          )}
          {popped && popped !== target.pt && (
            <div className="animate-pop text-lg font-bold text-destructive">
              Ops, a bolha certa era {target.pt}!
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
  colors,
  onNext,
}: {
  target: LessonItem;
  colors: LessonItem[];
  onNext: (score: LessonMirrorScore) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<LessonItem>(target);

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Passo 4: 🪞 Desafio do Espelho com IA
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          Faça o sinal na câmera: <span className="text-primary">{selectedColor.pt}</span>
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Posicione a mão e faça a configuração da <strong>Letra {selectedColor.targetLetter}</strong>
        </p>

        {/* Color / Letter switcher */}
        <div className="my-5 flex flex-wrap justify-center gap-2">
          {colors.map((c) => (
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
  nodeId,
  score,
  onRestart,
  onNextLesson,
}: {
  nodeId: number;
  score: LessonMirrorScore | null;
  onRestart: () => void;
  onNextLesson: () => void;
}) {
  const nextNodeId = nodeId + 1;
  const hasNextLesson = nextNodeId <= 12;
  const nextLessonData = LESSONS_DATA[nextNodeId];

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
          Parabéns! Você aprendeu e validou novos sinais em LIBRAS com auxílio da inteligência artificial!
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
            <div
              className="h-full rounded-full bg-gradient-rainbow transition-all duration-500"
              style={{ width: `${Math.round((nodeId / 12) * 100)}%` }}
            />
          </div>
          <div className="mt-3 text-sm font-bold">
            Fase {nodeId} de 12 concluída ({Math.round((nodeId / 12) * 100)}%)
          </div>
        </div>

        {/* Botão para Próxima Lição em Destaque */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {hasNextLesson ? (
            <button
              onClick={onNextLesson}
              className="w-full max-w-md rounded-full bg-primary px-8 py-5 font-display text-xl font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-bounce-soft"
            >
              <span>▶ Próxima Lição: {nextLessonData?.title || `Fase ${nextNodeId}`}</span>
              <span className="text-2xl">→</span>
            </button>
          ) : (
            <div className="w-full max-w-md rounded-2xl bg-mint/30 border border-mint p-4 text-emerald-900 dark:text-emerald-200 font-display font-black text-center shadow-soft">
              🏆 Parabéns! Você concluiu todas as 12 lições do Mundo 1!
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 w-full max-w-md mt-2">
            <button
              onClick={onRestart}
              className="flex-1 rounded-full border-2 border-foreground/20 bg-card px-6 py-4 font-display font-extrabold shadow-soft hover:bg-muted"
            >
              🔄 Repetir lição
            </button>
            <Link
              to="/trilha"
              className="flex-1 rounded-full border-2 border-primary/40 bg-card px-6 py-4 font-display font-extrabold text-primary text-center shadow-soft hover:bg-primary/10"
            >
              🗺️ Ver Trilha
            </Link>
          </div>
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
