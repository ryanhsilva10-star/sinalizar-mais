import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getActiveUser, saveUser } from "@/lib/user-store";

export function JoinClassroomFab() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getActiveUser();

  // Só exibe para alunos logados
  if (!user || user.role !== "aluno") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      toast.error("Digite o código da sala.");
      return;
    }

    if (trimmed.length < 4) {
      toast.error("O código deve ter pelo menos 4 caracteres.");
      return;
    }

    setLoading(true);

    // Simula uma pequena latência para feedback visual
    setTimeout(() => {
      saveUser({
        ...user,
        classroomCode: trimmed,
      });

      toast.success(`Você entrou na sala ${trimmed}! 🎉`);
      setCode("");
      setOpen(false);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      {/* FAB — Floating Action Button */}
      <button
        id="join-classroom-fab"
        onClick={() => setOpen(true)}
        aria-label="Entrar em uma sala"
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full
          bg-gradient-rainbow text-3xl text-white shadow-glow-teen
          transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95
          animate-bounce-soft md:bottom-8 md:right-8"
        style={{ animationDuration: "2.8s" }}
      >
        <PlusIcon />
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] sm:max-w-sm rounded-3xl border-2 border-primary/20 bg-card p-0 overflow-hidden">
          {/* Header decorativo */}
          <div className="bg-gradient-rainbow px-6 pt-8 pb-6 text-center text-white">
            <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm shadow-lg">
              🏫
            </span>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-extrabold text-white">
                Entrar na sala
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-white/80">
                Peça o código para o seu professor e digite abaixo.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
            {/* Mostra o código atual se já tiver */}
            {user.classroomCode && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-mint/20 px-4 py-2.5 text-sm">
                <span className="text-lg">✅</span>
                <span className="font-bold text-foreground">
                  Sala atual:{" "}
                  <span className="font-display text-primary">
                    {user.classroomCode}
                  </span>
                </span>
              </div>
            )}

            <label
              htmlFor="classroom-code-input"
              className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
            >
              Código da sala
            </label>
            <input
              id="classroom-code-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: SALA-2026"
              maxLength={20}
              autoFocus
              className="w-full rounded-xl border-2 border-border bg-background px-4 py-3.5
                text-center font-display text-xl font-extrabold tracking-[0.15em] text-foreground
                placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-body placeholder:text-sm
                focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30
                transition-all"
            />

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full
                bg-primary px-6 py-3.5 font-display text-base font-extrabold text-primary-foreground
                shadow-chunky transition-all
                hover:-translate-y-0.5 hover:shadow-lg
                active:translate-y-0 active:scale-[0.98]
                disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Entrando…</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Entrar na sala</span>
                </>
              )}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PlusIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="drop-shadow-md"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
