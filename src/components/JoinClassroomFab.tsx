import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getActiveUser,
  joinClassroom,
  leaveClassroom,
  getClassroomByCode,
  Classroom,
} from "@/lib/user-store";

export function JoinClassroomFab() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getActiveUser();

  // Só exibe para alunos logados
  if (!user || user.role !== "aluno") return null;

  const currentClassroom: Classroom | null = user.classroomCode
    ? getClassroomByCode(user.classroomCode)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      toast.error("Digite o código da sala.");
      return;
    }

    if (trimmed.length < 3) {
      toast.error("O código deve ter pelo menos 3 caracteres.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = joinClassroom(user.id, trimmed);
      setLoading(false);

      if (res.success) {
        toast.success(res.message);
        setCode("");
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    }, 400);
  };

  const handleLeave = () => {
    if (!user.classroomCode) return;
    leaveClassroom(user.id);
    toast.info("Você saiu da sala de aula.");
    setOpen(false);
  };

  return (
    <>
      {/* FAB — Floating Action Button */}
      <button
        id="join-classroom-fab"
        onClick={() => setOpen(true)}
        aria-label="Entrar em uma sala"
        title="Entrar em uma Sala de Aula"
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full
          bg-gradient-rainbow text-3xl text-white shadow-glow-teen
          transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95
          animate-bounce-soft md:bottom-8 md:right-8"
        style={{ animationDuration: "2.8s" }}
      >
        <span className="text-2xl">🏫</span>
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
                Sala de Aula
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-white/90">
                Peça o código para o seu professor e digite abaixo para se conectar.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 pt-4">
            {/* Mostra o código e nome da sala atual se já tiver */}
            {user.classroomCode && (
              <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-foreground">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                      ✓ Conectado
                    </span>
                    <p className="mt-1.5 font-display text-sm font-extrabold text-foreground">
                      {currentClassroom ? currentClassroom.name : `Sala: ${user.classroomCode}`}
                    </p>
                    {currentClassroom && (
                      <p className="text-[11px] text-muted-foreground">
                        🧑‍🏫 {currentClassroom.teacherName}
                      </p>
                    )}
                    <p className="mt-1 font-mono text-[11px] font-bold text-primary">
                      Código: {user.classroomCode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLeave}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-extrabold text-red-600 hover:bg-red-500/20 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}

            {/* Form de Entrada ou Troca */}
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="classroom-code-input"
                className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                {user.classroomCode ? "Trocar de código de sala" : "Código fornecido pelo professor"}
              </label>
              <input
                id="classroom-code-input"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: LIBRAS2026"
                maxLength={20}
                autoFocus
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-3.5
                  text-center font-display text-xl font-extrabold tracking-[0.15em] text-foreground
                  placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-body placeholder:text-sm
                  focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30
                  transition-all uppercase"
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
                    <span>Localizando sala…</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>{user.classroomCode ? "Mudar de sala" : "Entrar na sala"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
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
