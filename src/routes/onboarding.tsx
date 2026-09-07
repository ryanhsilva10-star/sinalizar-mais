import React, { useState } from "react";
import { Link } from "react-router-dom";

// Opcional: Se você quiser passar se é o tema EF1 ou EF2
interface LoginProps {
  world?: "ef1" | "ef2";
  onLoginSuccess?: () => void;
}

export function LoginCard({ world = "ef1", onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const isTeen = world === "ef2";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica de autenticação com seu backend/Firebase
    console.log("Submit:", { email, password, mode: isRegister ? "registro" : "login" });
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <section
      className={`animate-pop w-full max-w-md rounded-4xl p-8 shadow-chunky md:p-10 ${
        isTeen ? "bg-teen-bg text-teen-fg shadow-glow-teen" : "bg-card text-card-foreground"
      }`}
    >
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          {isRegister ? "Nova conta" : "Bem-vindo de volta"}
        </span>

        <h1
          className={`mt-2 font-extrabold ${
            isTeen ? "font-teen text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"
          }`}
        >
          {isRegister ? "Crie seu perfil" : "Entre para praticar"}
        </h1>

        <p className={`mt-2 text-sm ${isTeen ? "text-teen-fg/70" : "text-muted-foreground"}`}>
          {isRegister
            ? "Salve seu progresso, conquiste cristais e mantenha sua ofensiva!"
            : "Sua trilha de LIBRAS te espera. Continue de onde parou."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              E-mail ou Usuário
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className={`w-full rounded-2xl border-2 px-4 py-3 font-medium outline-none transition-colors ${
                isTeen
                  ? "border-teen-fg/20 bg-teen-fg/5 focus:border-primary"
                  : "border-border bg-background focus:border-primary"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Senha
              </label>
              {!isRegister && (
                <Link
                  to="/recuperar-senha"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Esqueceu?
                </Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full rounded-2xl border-2 px-4 py-3 font-medium outline-none transition-colors ${
                isTeen
                  ? "border-teen-fg/20 bg-teen-fg/5 focus:border-primary"
                  : "border-border bg-background focus:border-primary"
              }`}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform active:translate-y-0.5 hover:-translate-y-1"
          >
            {isRegister ? "Criar minha conta →" : "Entrar →"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isTeen ? "border-teen-fg/10" : "border-border"}`} />
          </div>
          <span
            className={`relative px-3 text-xs font-extrabold uppercase tracking-widest ${
              isTeen ? "bg-teen-bg text-teen-fg/50" : "bg-card text-muted-foreground"
            }`}
          >
            ou
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className={`w-full rounded-full border-2 py-3 font-display text-base font-extrabold transition-colors ${
            isTeen
              ? "border-teen-fg/30 text-teen-fg hover:bg-teen-fg/10"
              : "border-foreground/20 bg-card text-foreground hover:bg-muted"
          }`}
        >
          {isRegister ? "Já tenho uma conta" : "Criar nova conta"}
        </button>
      </div>
    </section>
  );
}