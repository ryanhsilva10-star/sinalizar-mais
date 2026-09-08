import { useState, useEffect, useRef, useCallback } from "react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";
import type { Landmark } from "../utils/librasClassifier";

export type LandmarkerState = {
  isInitialized: boolean;
  isLoadingModel: boolean;
  isDetecting: boolean;
  error: string | null;
  landmarks: Landmark[] | null;
  landmarksList: Landmark[][] | null;
};

const initialLandmarkerState: LandmarkerState = {
  isInitialized: false,
  isLoadingModel: false,
  isDetecting: false,
  error: null,
  landmarks: null,
  landmarksList: null,
};

// Mapeamento de cores para os 21 pontos dos dedos
const LANDMARK_STYLE_MAP: Record<number, { color: string; textColor: string }> = {
  // 0: Pulso (Preto / Escuro)
  0: { color: "#0f172a", textColor: "#ffffff" },

  // Polegar (Vermelho: 1 claro -> 4 escuro/intenso)
  1: { color: "#fca5a5", textColor: "#000000" },
  2: { color: "#f87171", textColor: "#ffffff" },
  3: { color: "#ef4444", textColor: "#ffffff" },
  4: { color: "#991b1b", textColor: "#ffffff" }, // Ponta do polegar

  // Indicador (Verde: 5 claro -> 8 escuro/intenso)
  5: { color: "#86efac", textColor: "#000000" },
  6: { color: "#4ade80", textColor: "#000000" },
  7: { color: "#22c55e", textColor: "#ffffff" },
  8: { color: "#166534", textColor: "#ffffff" }, // Ponta do indicador

  // Dedo do Meio / Médio (Azul: 9 claro -> 12 escuro/intenso)
  9: { color: "#93c5fd", textColor: "#000000" },
  10: { color: "#60a5fa", textColor: "#000000" },
  11: { color: "#3b82f6", textColor: "#ffffff" },
  12: { color: "#1e40af", textColor: "#ffffff" }, // Ponta do médio

  // Anelar (Laranja/Amarelo: 13 claro -> 16 escuro/intenso)
  13: { color: "#fef08a", textColor: "#000000" },
  14: { color: "#facc15", textColor: "#000000" },
  15: { color: "#f97316", textColor: "#ffffff" },
  16: { color: "#9a3412", textColor: "#ffffff" }, // Ponta do anelar

  // Dedo Mínimo (Roxo/Rosa: 17 claro -> 20 escuro/intenso)
  17: { color: "#f5d0fe", textColor: "#000000" },
  18: { color: "#e879f9", textColor: "#000000" },
  19: { color: "#c084fc", textColor: "#ffffff" },
  20: { color: "#6b21a8", textColor: "#ffffff" }, // Ponta do mínimo
};

type UseHandLandmarkerOptions = {
  numHands?: number;
  autoInit?: boolean;
};

export function useHandLandmarker(options?: UseHandLandmarkerOptions) {
  const numHands = options?.numHands ?? 1;
  const autoInit = options?.autoInit ?? true;

  const [landmarkerState, setLandmarkerState] = useState<LandmarkerState>(initialLandmarkerState);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  // Inicializa o modelo MediaPipe HandLandmarker
  useEffect(() => {
    if (typeof window === "undefined" || !autoInit) return;

    let isMounted = true;

    async function initMediaPipe() {
      setLandmarkerState((prev) => ({
        ...prev,
        isLoadingModel: true,
        error: null,
      }));

      try {
        const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");

        if (!isMounted) return;

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        if (!isMounted) return;

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: numHands,
        });

        if (!isMounted) return;

        handLandmarkerRef.current = landmarker;

        setLandmarkerState({
          isInitialized: true,
          isLoadingModel: false,
          isDetecting: false,
          error: null,
          landmarks: null,
          landmarksList: null,
        });
      } catch (err: unknown) {
        console.error("[MediaPipe] Erro ao carregar o modelo HandLandmarker:", err);
        if (isMounted) {
          const errorMsg =
            err instanceof Error ? err.message : "Falha ao conectar com o modelo de visão";
          setLandmarkerState((prev) => ({
            ...prev,
            isInitialized: false,
            isLoadingModel: false,
            error: `Erro ao inicializar o detector de mãos: ${errorMsg}`,
          }));
        }
      }
    }

    void initMediaPipe();

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
        handLandmarkerRef.current = null;
      }
    };
  }, [numHands, autoInit]);

  // Desenha os 21 pontos numerados e as conexões no Canvas
  const drawLandmarks = useCallback(
    (allHands: Landmark[][], canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Conexões das articulações da mão
      const CONNECTIONS = [
        [0, 1], [1, 2], [2, 3], [3, 4],     // Polegar
        [0, 5], [5, 6], [6, 7], [7, 8],     // Indicador
        [5, 9], [9, 10], [10, 11], [11, 12], // Médio
        [9, 13], [13, 14], [14, 15], [15, 16], // Anelar
        [13, 17], [17, 18], [18, 19], [19, 20], // Mínimo
        [0, 17], // Palma
      ];

      for (const landmarks of allHands) {
        if (!landmarks || landmarks.length < 21) continue;

        // Linhas de conexão suaves com gradiente visual
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        for (const [start, end] of CONNECTIONS) {
          const p1 = landmarks[start];
          const p2 = landmarks[end];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
            ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
            ctx.stroke();
          }
        }

        // Desenhar cada um dos 21 pontos (landmarks) com números e estilo contrastante
        for (let i = 0; i < landmarks.length; i++) {
          const pt = landmarks[i];
          const cx = pt.x * canvas.width;
          const cy = pt.y * canvas.height;
          const style = LANDMARK_STYLE_MAP[i] || { color: "#ffffff", textColor: "#000000" };

          const radius = i === 0 ? 10 : 8.5;

          // Círculo base preenchido
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
          ctx.fillStyle = style.color;
          ctx.fill();

          // Borda contrastante
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = i === 0 ? "#ffffff" : "rgba(0, 0, 0, 0.8)";
          ctx.stroke();

          // Número do Landmark
          ctx.fillStyle = style.textColor;
          ctx.font = "bold 9px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(i.toString(), cx, cy + 0.5);
        }
      }
    },
    []
  );

  // Inicia o loop de detecção contínua do vídeo
  const startDetection = useCallback(
    (videoElement: HTMLVideoElement, canvasElement?: HTMLCanvasElement | null) => {
      if (!handLandmarkerRef.current) {
        console.warn("[MediaPipe] Modelo ainda não está pronto.");
        return;
      }

      setLandmarkerState((prev) => ({
        ...prev,
        isDetecting: true,
      }));

      function detectFrame() {
        if (!videoElement || videoElement.paused || videoElement.ended) {
          animFrameIdRef.current = requestAnimationFrame(detectFrame);
          return;
        }

        const currentTime = videoElement.currentTime;
        if (currentTime !== lastVideoTimeRef.current && handLandmarkerRef.current) {
          lastVideoTimeRef.current = currentTime;

          try {
            const results = handLandmarkerRef.current.detectForVideo(
              videoElement,
              performance.now()
            );

            if (results.landmarks && results.landmarks.length > 0) {
              const allHands = results.landmarks as Landmark[][];
              setLandmarkerState((prev) => ({
                ...prev,
                landmarks: allHands[0],
                landmarksList: allHands,
              }));

              if (canvasElement) {
                drawLandmarks(allHands, canvasElement, videoElement);
              }
            } else {
              setLandmarkerState((prev) => ({
                ...prev,
                landmarks: null,
                landmarksList: null,
              }));

              if (canvasElement) {
                const ctx = canvasElement.getContext("2d");
                if (ctx) ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
              }
            }
          } catch (err) {
            console.error("[MediaPipe] Erro durante detecção do frame:", err);
          }
        }

        animFrameIdRef.current = requestAnimationFrame(detectFrame);
      }

      animFrameIdRef.current = requestAnimationFrame(detectFrame);
    },
    [drawLandmarks]
  );

  const stopDetection = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setLandmarkerState((prev) => ({
      ...prev,
      isDetecting: false,
      landmarks: null,
      landmarksList: null,
    }));
  }, []);

  return {
    landmarkerState,
    startDetection,
    stopDetection,
  };
}
