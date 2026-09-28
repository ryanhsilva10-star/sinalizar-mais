import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  getActiveUser,
  getClassroomByCode,
  subscribeToUserChanges,
  User,
} from "@/lib/user-store";
import { JoinClassroomModal } from "@/components/JoinClassroomModal";
import { Shield } from "lucide-react";

interface TurmaClaNavbarButtonProps {
  className?: string;
  isMobile?: boolean;
}

export function TurmaClaNavbarButton({
  className = "",
  isMobile = false,
}: TurmaClaNavbarButtonProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(() => getActiveUser());
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    // Inscreve no Observer para manter o botão 100% reativo a alterações
    const unsubscribe = subscribeToUserChanges(() => {
      setCurrentUser(getActiveUser());
    });
    return () => unsubscribe();
  }, []);

  // REGRA: Exibir esse botão ESTRITAMENTE para alunos logados
  if (!currentUser || currentUser.role !== "aluno") {
    return null;
  }

  const hasClassroom =
    !!currentUser.classroomCode && !!getClassroomByCode(currentUser.classroomCode);

  const handleClick = () => {
    if (hasClassroom) {
      // Já está em uma turma -> Redireciona diretamente para o painel da turma
      navigate({ to: "/turma" });
    } else {
      // Não está em nenhuma turma -> Abre modal para digitar código
      setIsJoinModalOpen(true);
    }
  };

  if (isMobile) {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full rounded-full border-2 border-primary/40 bg-primary/10 px-4 py-3 text-sm font-extrabold text-primary justify-center flex items-center gap-2 hover:bg-primary/20 transition-all ${className}`}
        >
          <span className="text-lg">🛡️</span>
          <span>Turma/Clã</span>
          {hasClassroom && (
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </button>

        <JoinClassroomModal
          open={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
          onSuccess={() => setCurrentUser(getActiveUser())}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-xs font-extrabold transition-all shadow-sm ${
          hasClassroom
            ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 active:scale-95"
            : "border-primary/30 bg-card text-foreground hover:border-primary hover:bg-primary/5 hover:scale-105 active:scale-95"
        } ${className}`}
        title={
          hasClassroom
            ? `Acessar meu Clã / Turma (${currentUser.classroomCode})`
            : "Entrar em uma Turma / Clã com código"
        }
      >
        <span className="text-sm">🛡️</span>
        <span>Turma/Clã</span>
        {hasClassroom ? (
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Turma Ativa"></span>
        ) : (
          <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px] font-black text-primary uppercase">
            Novo
          </span>
        )}
      </button>

      <JoinClassroomModal
        open={isJoinModalOpen}
        onOpenChange={setIsJoinModalOpen}
        onSuccess={() => setCurrentUser(getActiveUser())}
      />
    </>
  );
}
