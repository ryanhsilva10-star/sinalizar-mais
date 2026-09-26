import React, { useState } from "react";
import {
  ALL_ALPHABET_LETTERS,
  getAlphabetReference,
  type AlphabetLetterReference,
} from "@/utils/alphabetReference";
import { soundFx } from "@/lib/sound-effects";
import { X, Play, Eye, RotateCw, CheckCircle2, Sparkles, BookOpen } from "lucide-react";

type AlphabetReferenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialLetter?: string;
  onSelectLetterForPractice?: (letter: string) => void;
};

export const AlphabetReferenceModal: React.FC<AlphabetReferenceModalProps> = ({
  isOpen,
  onClose,
  initialLetter = "A",
  onSelectLetterForPractice,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string>(initialLetter.toUpperCase());
  const [activeTab, setActiveTab] = useState<"all" | "static" | "movement">("all");
  const [activeAngleView, setActiveAngleView] = useState<"primary" | "secondary">("primary");

  if (!isOpen) return null;

  const currentRef = getAlphabetReference(selectedLetter);

  const filteredLetters = ALL_ALPHABET_LETTERS.filter((ref) => {
    if (activeTab === "movement") return ref.hasMovement;
    if (activeTab === "static") return !ref.hasMovement;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-pop">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-chunky">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-rainbow text-xl shadow-soft">
              📖
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                Guia Oficial do Alfabeto em LIBRAS
              </h2>
              <p className="text-xs text-muted-foreground">
                Modelos de referência oficial para a execução correta de cada sinal (A-Z)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition-transform hover:scale-110 active:scale-95"
            aria-label="Fechar Guia"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-6 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Todas (26 Letras)
            </button>
            <button
              onClick={() => setActiveTab("movement")}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all ${
                activeTab === "movement"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              ⚡ Com Movimento (H, J, K, X, Z)
            </button>
            <button
              onClick={() => setActiveTab("static")}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all ${
                activeTab === "static"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              ✋ Configurações Estáticas
            </button>
          </div>

          <span className="text-xs font-bold text-muted-foreground">
            {filteredLetters.length} letras disponíveis
          </span>
        </div>

        {/* Content Area */}
        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12">
          {/* Alphabet Letter Grid Selector (Left Column) */}
          <div className="border-b border-border p-4 md:col-span-5 md:border-b-0 md:border-r">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
              {filteredLetters.map((item) => {
                const isSelected = selectedLetter === item.letter;
                return (
                  <button
                    key={item.letter}
                    onClick={() => {
                      setSelectedLetter(item.letter);
                      setActiveAngleView("primary");
                      soundFx.playPop();
                    }}
                    className={`group relative flex flex-col items-center justify-center rounded-2xl p-2.5 transition-all border-2 ${
                      isSelected
                        ? "border-primary bg-primary/15 shadow-sm scale-105"
                        : "border-border/60 bg-card hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    <span className="font-display text-lg font-black text-foreground">
                      {item.letter}
                    </span>
                    <span className="text-xs">{item.emoji}</span>
                    {item.hasMovement && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector for Selected Letter (Right Column) */}
          <div className="p-6 md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Header of the Selected Letter */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    <BookOpen className="h-4 w-4" />
                    <span>Referência Oficial</span>
                  </div>
                  <h3 className="font-display text-2xl font-black text-foreground">
                    {currentRef.name} {currentRef.emoji}
                  </h3>
                </div>

                {currentRef.hasMovement ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                    <RotateCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Sinal com Movimento</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                    ✋ Configuração Estática
                  </span>
                )}
              </div>

              {/* Media Display of the Official Model */}
              <div className="my-4 flex justify-center">
                <div className="relative aspect-4/3 w-full max-w-sm overflow-hidden rounded-3xl border-4 border-primary/20 bg-black shadow-chunky">
                  {currentRef.mediaType === "video" ? (
                    <video
                      key={currentRef.letter}
                      src={currentRef.primaryMedia}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      key={currentRef.letter + activeAngleView}
                      src={
                        activeAngleView === "secondary" && currentRef.secondaryMedia
                          ? currentRef.secondaryMedia
                          : currentRef.primaryMedia
                      }
                      alt={`Modelo oficial ${currentRef.name}`}
                      className="h-full w-full object-cover"
                    />
                  )}

                  {/* Dual view button */}
                  {currentRef.secondaryMedia && (
                    <div className="absolute bottom-2 left-2 flex gap-1 rounded-full bg-black/70 p-1 backdrop-blur-xs">
                      <button
                        onClick={() => setActiveAngleView("primary")}
                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                          activeAngleView === "primary"
                            ? "bg-primary text-white"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        Frente
                      </button>
                      <button
                        onClick={() => setActiveAngleView("secondary")}
                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                          activeAngleView === "secondary"
                            ? "bg-primary text-white"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        Lado
                      </button>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    {currentRef.orientationDescription}
                  </div>
                </div>
              </div>

              {/* Explicações e Dicas */}
              <div className="space-y-3 text-left">
                <div className="rounded-2xl bg-muted/60 p-3.5 border border-border text-xs">
                  <strong className="text-foreground block font-bold mb-1">
                    ✋ Configuração da Mão:
                  </strong>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentRef.handShapeDescription}
                  </p>
                </div>

                {currentRef.movementInstructions && (
                  <div className="rounded-2xl bg-amber-500/10 p-3.5 border border-amber-500/20 text-xs">
                    <strong className="text-amber-900 dark:text-amber-200 block font-bold mb-1">
                      🔄 Movimento &amp; Sequência:
                    </strong>
                    <p className="text-amber-950 dark:text-amber-100 leading-relaxed font-medium">
                      {currentRef.movementInstructions}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl bg-primary/5 p-3.5 border border-primary/20 text-xs">
                  <strong className="text-primary block font-bold mb-1">
                    💡 Dica de Execução Correta:
                  </strong>
                  <p className="text-foreground/90 leading-relaxed">
                    {currentRef.pedagogicalTip}
                  </p>
                </div>

                {/* Pontos Críticos */}
                {currentRef.correctionCues.length > 0 && (
                  <div className="space-y-1">
                    {currentRef.correctionCues.map((cue, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-mint shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-foreground">{cue.rule}:</strong> {cue.correction}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ação Praticar */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border">
              {onSelectLetterForPractice && (
                <button
                  onClick={() => {
                    onSelectLetterForPractice(currentRef.letter);
                    onClose();
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 font-display text-sm font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95"
                >
                  📸 Praticar Letra {currentRef.letter} na Câmera
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
