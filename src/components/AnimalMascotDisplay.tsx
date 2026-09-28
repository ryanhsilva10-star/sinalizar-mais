import React from "react";
import { getAnimalMascot, type AnimalMascot } from "@/utils/animalMascots";
import { getAlphabetReference } from "@/utils/alphabetReference";

interface AnimalMascotDisplayProps {
  letter: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSpeechBubble?: boolean;
  speechText?: string;
  className?: string;
  interactive?: boolean;
  showLibrasTip?: boolean;
  showLetterBadge?: boolean; // Se false (ex: quiz/bolhas), NÃO exibe a letra para o aluno adivinhar pelo sinal da mão
  onMascotClick?: () => void;
}

export const AnimalMascotDisplay: React.FC<AnimalMascotDisplayProps> = ({
  letter,
  size = "md",
  showSpeechBubble = false,
  speechText,
  className = "",
  interactive = false,
  showLibrasTip = false,
  showLetterBadge = true,
  onMascotClick,
}) => {
  const mascot: AnimalMascot = getAnimalMascot(letter);
  const ref = getAlphabetReference(letter);

  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-28 w-28 sm:h-32 sm:w-32",
    lg: "h-40 w-40 sm:h-48 sm:w-48",
    xl: "h-52 w-52 sm:h-60 sm:w-60",
  };

  const bubbleText = speechText || mascot.librasExplanation;

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Balão de Fala do Bichinho (apenas em modo apresentação) */}
      {showSpeechBubble && (
        <div className="relative mb-3 max-w-sm animate-pop rounded-2xl bg-card border-2 border-primary/20 px-4 py-2.5 shadow-chunky text-xs sm:text-sm font-extrabold text-foreground">
          <div className="flex items-center gap-1.5 text-primary mb-1 font-display font-black text-[11px] uppercase tracking-wider">
            <span>{mascot.emoji}</span>
            <span>{mascot.animalName} ensina:</span>
          </div>
          <p className="font-bold leading-snug">{bubbleText}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-card" />
        </div>
      )}

      {/* Card Visual do Mascote fazendo o sinal com a mãozinha */}
      <div
        onClick={onMascotClick}
        className={`group relative overflow-hidden rounded-3xl ${mascot.tone} p-2.5 shadow-chunky border-2 border-border/60 transition-transform ${
          interactive ? "cursor-pointer hover:scale-105 active:scale-95" : ""
        } ${sizeClasses[size]}`}
      >
        {/* Renderização do Mascote com a Mãozinha fazendo o sinal em LIBRAS */}
        <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-2xl bg-card/40 backdrop-blur-xs p-1">
          {/* Imagem do Mascote com a mãozinha fazendo o sinal */}
          {mascot.letter === "A" || mascot.letter === "B" ? (
            <img
              src={mascot.image}
              alt={`${mascot.animalName} fazendo o sinal em LIBRAS`}
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-between py-1">
              {/* Cabeça do Mascote */}
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl animate-bounce-soft">{mascot.emoji}</span>
              </div>

              {/* Mãozinha fazendo o sinal em LIBRAS */}
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-xl border border-black/20 bg-black/5 shadow-xs">
                {ref.mediaType === "video" ? (
                  <video
                    src={ref.primaryMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={ref.primaryMedia}
                    alt={`Sinal da mãozinha do ${mascot.animalName}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                {mascot.species}
              </span>
            </div>
          )}

          {/* Badge da Letra (SÓ aparece se showLetterBadge for true — modo apresentação) */}
          {showLetterBadge && (
            <div className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 font-display text-xs font-black text-white shadow-md border border-white/30 backdrop-blur-xs">
              {letter}
            </div>
          )}

          {/* Badge da Espécie */}
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-xs">
            <span>{mascot.emoji}</span>
          </div>
        </div>
      </div>

      {/* Identificação do Bichinho */}
      <div className="mt-2">
        <span className="inline-flex items-center gap-1 font-display text-sm sm:text-base font-black text-foreground">
          <span>{mascot.emoji}</span>
          <span>{mascot.animalName}</span>
        </span>
        {/* Só indica a letra no texto se showLetterBadge for true */}
        {showLetterBadge ? (
          <div className="text-[11px] font-bold text-muted-foreground">
            Bichinho da <strong>Letra {letter}</strong>
          </div>
        ) : (
          <div className="text-[11px] font-bold text-muted-foreground">
            Observe o sinal da mãozinha! ✋
          </div>
        )}
      </div>

      {/* Dica da patinha (apenas em modo apresentação) */}
      {showLibrasTip && showLetterBadge && (
        <div className="mt-2 max-w-xs rounded-xl bg-muted/80 p-2 text-left text-[11px] text-muted-foreground border border-border">
          <strong className="text-foreground block font-black">🐾 Patinha em LIBRAS:</strong>
          {mascot.pawDescription}
        </div>
      )}
    </div>
  );
};
