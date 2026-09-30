import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
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
  getClassroomByCode,
  syncClassroomsFromSupabase,
} from "@/lib/user-store";
import { addAlunoToSalaInSupabase } from "@/lib/supabase-auth";
import { Shield, Sparkles, ArrowRight } from "lucide-react";

interface JoinClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function JoinClassroomModal({
  open,
  onOpenChange,
  onSuccess,
}: JoinClassroomModalProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      setErrorMessage("Por favor, digite o código da sala de aula.");
      toast.error("Digite o código da sala de aula.");
      return;
    }

    if (trimmed.length < 3) {
      setErrorMessage("O código precisa ter pelo menos 3 caracteres.");
      toast.error("O código precisa ter pelo menos 3 caracteres.");
      return;
    }

    const user = getActiveUser();
    if (!user) {
      toast.error("Você precisa estar conectado como aluno para ingressar.");
      return;
    }

    setLoading(true);

    try {
      // 1. Tenta achar sala localmente ou sincroniza do Supabase
      let classroom = getClassroomByCode(trimmed);
      if (!classroom) {
        await syncClassroomsFromSupabase();
        classroom = getClassroomByCode(trimmed);
      }

      if (!classroom) {
        // Tenta vínculo direto no Supabase caso seja sala remota recém-criada
        const supRes = await addAlunoToSalaInSupabase(user.id, trimmed);
        if (supRes.success) {
          await syncClassroomsFromSupabase();
          classroom = getClassroomByCode(trimmed);
        }
      }

      if (!classroom) {
        const err = `Código "${trimmed}" não encontrado. Verifique com seu professor!`;
        setErrorMessage(err);
        toast.error(err);
        setLoading(false);
        return;
      }

      const res = joinClassroom(user.id, trimmed);
      setLoading(false);

      if (res.success) {
        toast.success(res.message);
        setCode("");
        onOpenChange(false);
        if (onSuccess) onSuccess();
        navigate({ to: "/turma" });
      } else {
        setErrorMessage(res.message);
        toast.error(res.message);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Erro ao ingressar na sala.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:max-w-md rounded-3xl border-2 border-primary/30 bg-card p-0 overflow-hidden shadow-2xl animate-fade-in">
        {/* Header Decorativo */}
        <div className="bg-gradient-rainbow px-6 pt-8 pb-6 text-center text-white relative">
          <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm shadow-lg animate-bounce-soft">
            🛡️
          </span>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold text-white">
              Entrar na sua Turma / Clã
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-white/95 font-medium">
              Digite o código fornecido pelo seu professor para desbloquear o painel colaborativo do seu Clã!
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Formulário de Entrada */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="classroom-code-input"
              className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Código da Sala / Turma:
            </label>
            <input
              id="classroom-code-input"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Ex: LIBRAS2026"
              maxLength={12}
              autoFocus
              className={`w-full rounded-2xl border-2 bg-background px-4 py-3.5 text-center font-mono text-lg font-black tracking-widest uppercase outline-none transition-all ${
                errorMessage
                  ? "border-red-500 bg-red-500/5 focus:border-red-600"
                  : "border-border focus:border-primary focus:ring-4 focus:ring-primary/20"
              }`}
            />
            {errorMessage && (
              <p className="mt-2 text-xs font-bold text-red-500 text-center animate-shake">
                ⚠️ {errorMessage}
              </p>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground text-center">
              💡 Peça o código ao seu professor de LIBRAS para ingressar na turma.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Conectando...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Ingressar na Turma</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-full border border-border py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
