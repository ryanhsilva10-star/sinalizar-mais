import { createFileRoute, Link } from "@tanstack/react-router";
import luviMascot from "@/assets/luvi-mascot.png";

export const Route = createFileRoute("/onboarding/cores/verde")({
  component: VerdePage,
});

function VerdePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <Link to="/onboarding" className="inline-block mb-4 text-primary underline">
        ← Voltar ao Desafio
      </Link>
      <h1 className="text-4xl font-display font-bold mb-4">Verde</h1>
      <p className="mb-6">Sinal da cor verde em Libras.</p>
      <video src="/videos/cores/verde.mp4" controls className="w-full max-w-2xl rounded-lg shadow" />
    </div>
  );
}
