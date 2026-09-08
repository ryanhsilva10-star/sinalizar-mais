import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  classifyLibrasSign,
  checkHandFraming,
  ALPHABET_GUIDE,
  type HandDetectionResult,
} from "@/utils/librasClassifier";
import { useHandLandmarker } from "@/hooks/useHandLandmarker";
import { soundFx } from "@/lib/sound-effects";
import {
  Camera,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  VideoOff,
  Lightbulb,
  Trophy,
  Scan,
  Compass,
} from "lucide-react";

export type LessonMirrorScore = {
  accuracy: number;
  orientationScore: number;
  stabilityScore: number;
  detectedLetter: string;
};

type LibrasLessonMirrorProps = {
  targetLetter: string;
  targetLabel: string;
  targetDescription?: string;
  onComplete: (score: LessonMirrorScore) => void;
  onSkip?: () => void;
};

export const LibrasLessonMirror: React.FC<LibrasLessonMirrorProps> = ({
  targetLetter,
  targetLabel,
  targetDescription,
  onComplete,
  onSkip,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<"idle" | "granted" | "denied">("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [currentDetection, setCurrentDetection] = useState<HandDetectionResult>({
    letter: "-",
    confidence: 0,
    description: "Posicione sua mão em frente à câmera",
    isFramed: false,
    landmarksCount: 0,
    orientation: "UP",
  });

  const [framingStatus, setFramingStatus] = useState<{
    isFramed: boolean;
    message: string;
    progress: number;
  }>({
    isFramed: false,
    message: "Aguardando posicionamento da mão...",
    progress: 0,
  });

  // Contador de estabilidade para validar o sinal segurado
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const holdIntervalRef = useRef<number | null>(null);

  const { landmarkerState, startDetection, stopDetection } = useHandLandmarker({ numHands: 1 });

  const guide = ALPHABET_GUIDE[targetLetter] || {
    name: `Sinal ${targetLetter}`,
    tip: targetDescription || "Faça a configuração de mão indicada para esta lição.",
    orientation: "Para cima",
    emoji: "🤟",
  };

  // Solicitar câmera
  const requestCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      setStream(mediaStream);
      setCameraPermission("granted");
      soundFx.playPop();
    } catch (err: unknown) {
      console.error("[LibrasLessonMirror] Erro ao acessar câmera:", err);
      setCameraPermission("denied");
      setCameraError(
        "Não foi possível acessar a câmera. Verifique as permissões no navegador ou use o botão pular."
      );
    }
  }, [stream]);

  // Atribuir stream ao vídeo
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Iniciar detecção de vídeo do MediaPipe
  useEffect(() => {
    if (landmarkerState.isInitialized && videoRef.current && stream) {
      startDetection(videoRef.current, canvasRef.current);
    }

    return () => {
      stopDetection();
    };
  }, [landmarkerState.isInitialized, stream, startDetection, stopDetection]);

  // Fechar tracks ao desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, [stream]);

  // Processar landmarks detectados
  useEffect(() => {
    if (!landmarkerState.landmarks || landmarkerState.landmarks.length < 21) {
      setCurrentDetection({
        letter: "-",
        confidence: 0,
        description: "Posicione a mão em frente à câmera",
        isFramed: false,
        landmarksCount: 0,
        orientation: "UP",
      });
      setFramingStatus({
        isFramed: false,
        message: "Mostre sua mão para a câmera",
        progress: 0,
      });
      setHoldProgress((p) => Math.max(0, p - 10));
      return;
    }

    const framing = checkHandFraming(landmarkerState.landmarks);
    setFramingStatus(framing);

    const detection = classifyLibrasSign(landmarkerState.landmarks);
    setCurrentDetection(detection);

    // Checar se a letra bate com o target
    const isTargetMatch =
      detection.letter.toUpperCase() === targetLetter.toUpperCase() &&
      detection.confidence >= 0.75 &&
      framing.isFramed;

    if (isTargetMatch && !isCompleted) {
      setHoldProgress((prev) => {
        const next = prev + 15;
        if (next >= 100) {
          setIsCompleted(true);
          soundFx.playChime();
          setTimeout(() => {
            onComplete({
              accuracy: 3,
              orientationScore: 3,
              stabilityScore: 3,
              detectedLetter: detection.letter,
            });
          }, 800);
          return 100;
        }
        return next;
      });
    } else if (!isCompleted) {
      setHoldProgress((prev) => Math.max(0, prev - 8));
    }
  }, [landmarkerState.landmarks, targetLetter, isCompleted, onComplete]);

  // Modo Inicial: Pedir Permissão
  if (cameraPermission !== "granted") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-border bg-card/90 p-8 text-center shadow-chunky backdrop-blur-md">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-rainbow text-4xl shadow-chunky animate-bounce-soft">
          📸
        </div>
        <h3 className="mt-4 font-display text-2xl font-black">
          Desafio com IA: Pratique na Câmera
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          O Luvi e a IA do SinaLINK vão analisar sua configuração de mão em tempo real para o sinal de{" "}
          <strong className="text-primary">{targetLabel}</strong>.
        </p>

        {/* Dica da letra */}
        <div className="my-6 w-full max-w-md rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
          <div className="flex items-center gap-2 font-display text-sm font-extrabold text-primary">
            <Lightbulb className="h-4 w-4" />
            <span>Como fazer o sinal:</span>
          </div>
          <p className="mt-1 text-xs text-foreground/80 leading-relaxed">{guide.tip}</p>
        </div>

        {cameraError && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-destructive/10 p-3 text-xs font-bold text-destructive">
            <VideoOff className="h-4 w-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={requestCamera}
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95"
          >
            <Camera className="h-5 w-5" />
            <span>Ligar Câmera &amp; Começar</span>
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              className="rounded-full border border-border bg-muted/60 px-6 py-4 font-display text-sm font-extrabold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Pular / Sem Câmera
            </button>
          )}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          🔒 Sua privacidade é total: o processamento da imagem é 100% local no seu navegador.
        </p>
      </div>
    );
  }

  const isMatch = currentDetection.letter.toUpperCase() === targetLetter.toUpperCase();

  return (
    <div className="space-y-4">
      {/* Top Target Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/60 p-4 border border-border">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-rainbow text-2xl shadow-sm">
            {guide.emoji}
          </span>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Objetivo do Desafio
            </div>
            <div className="font-display text-lg font-black text-foreground">
              Faça o sinal de: <span className="text-primary">{targetLabel}</span> (Letra {targetLetter})
            </div>
          </div>
        </div>

        {/* Framing & Hold Status */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 rounded-full bg-mint/30 px-3.5 py-1.5 font-display text-xs font-extrabold text-emerald-800 dark:text-emerald-300 animate-pop">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Sinal Perfeito! 🎉
            </span>
          ) : (
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                framingStatus.isFramed
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
              }`}
            >
              <Scan className="h-3.5 w-3.5" />
              {framingStatus.message}
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Video Area */}
      <div className="relative mx-auto aspect-4/3 w-full max-w-lg overflow-hidden rounded-3xl border-4 border-card bg-black shadow-chunky">
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover transform -scale-x-100"
        />

        {/* Canvas Overlay with Hand Landmarks */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transform -scale-x-100"
        />

        {/* Model Loading Indicator */}
        {landmarkerState.isLoadingModel && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs text-white">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 font-display text-sm font-bold">Carregando IA de visão...</p>
          </div>
        )}

        {/* Top Floating HUD Badges */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono text-white backdrop-blur-md border border-white/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>21 Pontos IA</span>
          </div>

          {currentDetection.orientation && (
            <div className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-md border border-white/10">
              <Compass className="h-3 w-3 text-sky" />
              <span>{currentDetection.orientation}</span>
            </div>
          )}
        </div>

        {/* Detected Sign HUD (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-2xl bg-black/75 p-2.5 backdrop-blur-md border border-white/20 text-white">
          <div
            className={`grid h-10 w-10 place-items-center rounded-xl font-display text-xl font-black ${
              isMatch ? "bg-mint text-slate-900 animate-pop" : "bg-white/20 text-white"
            }`}
          >
            {currentDetection.letter !== "-" ? currentDetection.letter : "…"}
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase text-slate-300">Detectado</div>
            <div className="font-display text-xs font-extrabold leading-tight">
              {currentDetection.letter !== "-" ? (
                isMatch ? (
                  <span className="text-mint">Correto: {currentDetection.letter}!</span>
                ) : (
                  <span>Letra {currentDetection.letter}</span>
                )
              ) : (
                <span className="text-slate-400">Aguardando gesto...</span>
              )}
            </div>
          </div>
        </div>

        {/* Hold Progress Bar Overlay (Bottom Center) */}
        {isMatch && !isCompleted && (
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-2xl bg-black/75 px-3 py-2 backdrop-blur-md border border-mint/40 animate-pop">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-mint">Segure o sinal</div>
              <div className="text-xs font-mono font-bold text-white">{holdProgress}%</div>
            </div>
            <div className="h-2.5 w-16 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-mint transition-all duration-150"
                style={{ width: `${holdProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Completed Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-emerald-950/80 backdrop-blur-xs text-white animate-pop">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-mint text-4xl text-slate-900 shadow-glow-teen animate-bounce-soft">
              ✨
            </div>
            <h4 className="mt-3 font-display text-2xl font-black">Perfeito!</h4>
            <p className="mt-1 text-xs text-emerald-200">Sinal reconhecido com alta precisão!</p>
          </div>
        )}
      </div>

      {/* Guide Tip & Instructions Card */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
            💡
          </span>
          <div className="flex-1 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Dica para a Letra {targetLetter}:</strong> {guide.tip}
          </div>
        </div>
      </div>

      {/* Manual Controls / Skip */}
      <div className="flex items-center justify-between pt-2">
        {onSkip && (
          <button
            onClick={onSkip}
            className="text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Pular desafio de câmera
          </button>
        )}

        <button
          onClick={() => {
            setIsCompleted(true);
            soundFx.playChime();
            onComplete({
              accuracy: 3,
              orientationScore: 3,
              stabilityScore: 2,
              detectedLetter: targetLetter,
            });
          }}
          className="ml-auto flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-card border border-border shadow-xs"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          <span>Validar Manualmente</span>
        </button>
      </div>
    </div>
  );
};
