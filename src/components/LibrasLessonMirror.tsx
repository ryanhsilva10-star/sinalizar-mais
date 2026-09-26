import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  checkHandFraming,
  evaluateSignAgainstTarget,
  type Landmark,
} from "@/utils/librasClassifier";
import {
  getAlphabetReference,
  type AlphabetLetterReference,
} from "@/utils/alphabetReference";
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
  Play,
  RotateCw,
  Eye,
  AlertCircle,
  Layers,
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

  // Referência visual oficial da letra
  const reference: AlphabetLetterReference = getAlphabetReference(targetLetter);
  const [activeMediaView, setActiveMediaView] = useState<"primary" | "secondary">("primary");

  // Buffer de histórico de landmarks para análise de movimento e estabilidade
  const motionHistoryRef = useRef<Landmark[][]>([]);

  // Estados de detecção e diagnóstico
  const [framingStatus, setFramingStatus] = useState<{
    isFramed: boolean;
    message: string;
    progress: number;
  }>({
    isFramed: false,
    message: "Aguardando posicionamento da mão...",
    progress: 0,
  });

  const [evaluation, setEvaluation] = useState(() =>
    evaluateSignAgainstTarget(null, targetLetter)
  );

  // Contador de estabilidade para validar o sinal segurado / movimento completo
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRefMediaRef = useRef<HTMLVideoElement | null>(null);

  const { landmarkerState, startDetection, stopDetection } = useHandLandmarker({ numHands: 1 });

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

  // Atribuir stream ao elemento de vídeo
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
    };
  }, [stream]);

  // Processar landmarks detectados e comparar com o modelo oficial
  useEffect(() => {
    if (!landmarkerState.landmarks || landmarkerState.landmarks.length < 21) {
      setFramingStatus({
        isFramed: false,
        message: "Mostre sua mão para a câmera",
        progress: 0,
      });
      setEvaluation(evaluateSignAgainstTarget(null, targetLetter));
      setHoldProgress((p) => Math.max(0, p - 12));
      return;
    }

    // Atualiza buffer de movimento (mantém últimos 12 frames)
    motionHistoryRef.current.push(landmarkerState.landmarks);
    if (motionHistoryRef.current.length > 12) {
      motionHistoryRef.current.shift();
    }

    const framing = checkHandFraming(landmarkerState.landmarks);
    setFramingStatus(framing);

    const evalResult = evaluateSignAgainstTarget(
      landmarkerState.landmarks,
      targetLetter,
      motionHistoryRef.current
    );
    setEvaluation(evalResult);

    if (evalResult.isTargetMatch && framing.isFramed && !isCompleted) {
      setHoldProgress((prev) => {
        const increment = reference.hasMovement ? 22 : 18;
        const next = prev + increment;
        if (next >= 100) {
          setIsCompleted(true);
          soundFx.playChime();
          setTimeout(() => {
            onComplete({
              accuracy: evalResult.accuracyStars,
              orientationScore: evalResult.orientationScore,
              stabilityScore: evalResult.stabilityScore,
              detectedLetter: evalResult.detectedLetter,
            });
          }, 700);
          return 100;
        }
        return next;
      });
    } else if (!isCompleted) {
      setHoldProgress((prev) => Math.max(0, prev - 6));
    }
  }, [
    landmarkerState.landmarks,
    targetLetter,
    reference.hasMovement,
    isCompleted,
    onComplete,
  ]);

  // Tela Inicial: Solicitação de Permissão com Apresentação do Modelo
  if (cameraPermission !== "granted") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-border bg-card/95 p-6 text-center shadow-chunky backdrop-blur-md">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <span>🎯 Modelo Oficial de Referência · Letra {reference.letter}</span>
        </div>

        {/* Card do Modelo Oficial */}
        <div className="my-4 flex flex-col items-center justify-center">
          <div className="relative overflow-hidden rounded-3xl border-4 border-primary/30 bg-muted shadow-chunky">
            {reference.mediaType === "video" ? (
              <div className="relative h-60 w-60 sm:h-72 sm:w-72">
                <video
                  src={reference.primaryMedia}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                  <Play className="h-3 w-3 text-mint fill-mint" />
                  <span>Sinal com Movimento</span>
                </div>
              </div>
            ) : (
              <div className="relative h-60 w-60 sm:h-72 sm:w-72">
                <img
                  src={
                    activeMediaView === "secondary" && reference.secondaryMedia
                      ? reference.secondaryMedia
                      : reference.primaryMedia
                  }
                  alt={`Modelo correto do sinal da letra ${reference.letter}`}
                  className="h-full w-full object-cover"
                />
                {reference.secondaryMedia && (
                  <div className="absolute bottom-2 inset-x-2 flex justify-center gap-1">
                    <button
                      onClick={() => setActiveMediaView("primary")}
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold transition-all ${
                        activeMediaView === "primary"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-black/60 text-white hover:bg-black/80"
                      }`}
                    >
                      Frente
                    </button>
                    <button
                      onClick={() => setActiveMediaView("secondary")}
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold transition-all ${
                        activeMediaView === "secondary"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-black/60 text-white hover:bg-black/80"
                      }`}
                    >
                      Lado
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <h3 className="mt-4 font-display text-2xl font-black">
            Pratique na Câmera: <span className="text-primary">{targetLabel}</span> (Letra {targetLetter})
          </h3>
          <p className="mt-1 max-w-md text-xs text-muted-foreground">
            A câmera e a IA analisarão seu movimento em tempo real e compararão com o <strong>modelo oficial de referência</strong> acima.
          </p>
        </div>

        {/* Dica Pedagógica e Erros Comuns */}
        <div className="my-3 w-full max-w-md space-y-2 text-left">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-primary">
              <Lightbulb className="h-4 w-4 shrink-0" />
              <span>Como reproduzir o modelo oficial:</span>
            </div>
            <p className="mt-1 text-xs text-foreground/90 leading-relaxed font-medium">
              {reference.pedagogicalTip}
            </p>
            {reference.movementInstructions && (
              <p className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                🔄 Movimento: {reference.movementInstructions}
              </p>
            )}
          </div>
        </div>

        {cameraError && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-destructive/10 p-3 text-xs font-bold text-destructive">
            <VideoOff className="h-4 w-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={requestCamera}
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95"
          >
            <Camera className="h-5 w-5" />
            <span>Ligar Câmera &amp; Comparar com Modelo</span>
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
          🔒 Processamento de visão 100% privado e local no seu navegador.
        </p>
      </div>
    );
  }

  const isMatch = evaluation.isTargetMatch;

  return (
    <div className="space-y-4">
      {/* Top Banner de Objetivo com Destaque para o Sinal de Referência */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-rainbow text-2xl shadow-sm">
            {reference.emoji}
          </span>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Desafio Prático com IA
            </div>
            <div className="font-display text-lg font-black text-foreground">
              Reproduza: <span className="text-primary">{targetLabel}</span> (Letra {targetLetter})
            </div>
          </div>
        </div>

        {/* Status de Enquadramento */}
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

      {/* Grid Comparativo: Modelo Oficial (Esquerda) vs Câmera do Usuário (Direita) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Painel 1: MODELO OFICIAL DE REFERÊNCIA */}
        <div className="flex flex-col rounded-3xl border-2 border-primary/30 bg-muted/40 p-4 shadow-chunky">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-primary">
              <Eye className="h-4 w-4" />
              <span>Modelo Oficial Correto</span>
            </div>
            {reference.hasMovement && (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <RotateCw className="h-3 w-3 animate-spin" />
                <span>Movimento</span>
              </span>
            )}
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black border border-border/50">
            {reference.mediaType === "video" ? (
              <video
                ref={videoRefMediaRef}
                src={reference.primaryMedia}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={
                  activeMediaView === "secondary" && reference.secondaryMedia
                    ? reference.secondaryMedia
                    : reference.primaryMedia
                }
                alt={`Exemplo correto de ${reference.letter}`}
                className="h-full w-full object-cover"
              />
            )}

            {/* Alternador de Ângulo (Frente / Lado para F e T) */}
            {reference.secondaryMedia && (
              <div className="absolute bottom-2 left-2 z-10 flex gap-1 rounded-full bg-black/70 p-1 backdrop-blur-xs">
                <button
                  onClick={() => setActiveMediaView("primary")}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    activeMediaView === "primary"
                      ? "bg-primary text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Frente
                </button>
                <button
                  onClick={() => setActiveMediaView("secondary")}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    activeMediaView === "secondary"
                      ? "bg-primary text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Lado
                </button>
              </div>
            )}

            {/* Badge de Orientação */}
            <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
              {reference.orientationDescription}
            </div>
          </div>

          {/* Dica Rápida do Modelo */}
          <div className="mt-3 rounded-xl bg-card p-2.5 text-left text-xs border border-border">
            <strong className="text-foreground block font-bold mb-0.5">Configuração Exata:</strong>
            <span className="text-muted-foreground text-[11px] leading-tight">
              {reference.handShapeDescription}
            </span>
          </div>
        </div>

        {/* Painel 2: CÂMERA DO USUÁRIO COM MEDIAPIPE */}
        <div className="flex flex-col rounded-3xl border-2 border-border bg-card p-4 shadow-chunky">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-foreground">
              <Camera className="h-4 w-4 text-emerald-600" />
              <span>Sua Execução na Câmera</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>IA Ativa</span>
            </div>
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black border border-border">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover transform -scale-x-100"
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover transform -scale-x-100"
            />

            {/* Carregando Modelo */}
            {landmarkerState.isLoadingModel && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs text-white">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-xs font-bold">Carregando IA de visão...</p>
              </div>
            )}

            {/* Letra Detectada HUD */}
            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 rounded-xl bg-black/80 px-2.5 py-1.5 backdrop-blur-md border border-white/20 text-white">
              <div
                className={`grid h-8 w-8 place-items-center rounded-lg font-display text-base font-black ${
                  isMatch ? "bg-mint text-slate-900 animate-pop" : "bg-white/20 text-white"
                }`}
              >
                {evaluation.detectedLetter !== "-" ? evaluation.detectedLetter : "…"}
              </div>
              <div className="text-left text-[11px]">
                <div className="text-[9px] font-bold uppercase text-slate-400">Detectado</div>
                <div className="font-bold">
                  {isMatch ? (
                    <span className="text-mint">Correto: {evaluation.detectedLetter}!</span>
                  ) : (
                    <span>{evaluation.detectedLetter !== "-" ? `Letra ${evaluation.detectedLetter}` : "Aguardando..."}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Barra de Progresso de Sinal Segurado */}
            {isMatch && !isCompleted && (
              <div className="absolute bottom-2 right-2 z-20 flex items-center gap-2 rounded-xl bg-black/80 px-3 py-1.5 backdrop-blur-md border border-mint/50 animate-pop">
                <span className="text-[10px] font-bold uppercase text-mint">
                  {reference.hasMovement ? "Movimento" : "Segure"}
                </span>
                <div className="h-2 w-14 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-mint transition-all duration-100"
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tela de Sucesso */}
            {isCompleted && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-emerald-950/85 backdrop-blur-xs text-white animate-pop">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-mint text-3xl text-slate-900 shadow-glow-teen animate-bounce-soft">
                  ✨
                </div>
                <h4 className="mt-2 font-display text-xl font-black">Perfeito!</h4>
                <p className="text-xs text-emerald-200">Sinal validado com o modelo oficial!</p>
              </div>
            )}
          </div>

          {/* Feedback Diagnóstico da Câmera em Tempo Real */}
          <div
            className={`mt-3 rounded-xl p-2.5 text-left text-xs font-bold transition-colors ${
              isMatch
                ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/30"
            }`}
          >
            <div className="flex items-start gap-1.5">
              {isMatch ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              )}
              <div className="flex-1 text-[11px] leading-tight">
                {evaluation.feedback}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dicas de Correção Específicas Baseadas no Modelo */}
      {reference.correctionCues.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft text-left">
          <div className="flex items-center gap-2 font-display text-xs font-extrabold text-foreground mb-2">
            <Layers className="h-4 w-4 text-primary" />
            <span>Pontos de Atenção para o Sinal Correto:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {reference.correctionCues.map((cue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-xl bg-muted/60 p-2.5 border border-border/50 text-foreground/80"
              >
                <span className="font-extrabold text-primary shrink-0">✓</span>
                <span className="text-[11px] leading-relaxed">
                  <strong className="text-foreground">{cue.rule}:</strong> {cue.correction}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controles e Validação Manual de Acessibilidade */}
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
