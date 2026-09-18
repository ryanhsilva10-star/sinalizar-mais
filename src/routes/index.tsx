import { createFileRoute, Link } from "@tanstack/react-router";
import luviMascot from "@/assets/luvi-mascot.png";
import novaAvatar from "@/assets/nova-avatar.png";
import Footer from "@/components/Footer";
import { JoinClassroomFab } from "@/components/JoinClassroomFab";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

import { useState, useEffect } from "react";

function LandingPage() {
  const [helpMode, setHelpMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero helpMode={helpMode} setHelpMode={setHelpMode} />
      <WorldsSection helpMode={helpMode} />
      <TrailSection helpMode={helpMode} />
      <GamificationSection helpMode={helpMode} />
      <ActivitiesSection helpMode={helpMode} />
      <LessonCTA helpMode={helpMode} />
      <Footer />
      <JoinClassroomFab />
    </div>
  );
}

import { getActiveUser, logoutUser } from "@/lib/user-store";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";

function Header() {
  const [currentUser, setCurrentUser] = useState(() => getActiveUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getActiveUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    toast.info("Sessão encerrada.");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft">S</span>
          <span className="font-display text-2xl font-extrabold">SinaLINK</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-muted-foreground md:flex text-secondary-foreground">
          <a href="#mundos" className="hover:text-foreground">Mundos</a>
          <Link to="/trilha" className="hover:text-foreground">Trilha</Link>
          <a href="#jogos" className="hover:text-foreground">Atividades</a>
          <a href="#escolas" className="hover:text-foreground">Para escolas</a>
        </nav>

        <div className="hidden md:block">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={currentUser.role === "professor" ? "/onboarding" : "/student/profile"}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-extrabold hover:bg-muted"
              >
                <span>{currentUser.avatar}</span>
                <span>{currentUser.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400"
              >
                🚪 Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-extrabold text-muted-foreground hover:text-foreground px-3 py-2"
              >
                Entrar
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5"
              >
                Começar agora
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
            <a href="#mundos" className="hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>Mundos</a>
            <Link to="/trilha" className="hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>Trilha</Link>
            <a href="#jogos" className="hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>Atividades</a>
            <a href="#escolas" className="hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>Para escolas</a>
          </nav>
          
          <div className="border-t border-border/60 pt-4 mt-2">
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <Link
                  to={currentUser.role === "professor" ? "/onboarding" : "/student/profile"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-extrabold justify-center"
                >
                  <span>{currentUser.avatar}</span>
                  <span>{currentUser.name}</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full rounded-full border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-extrabold text-red-600 justify-center"
                >
                  🚪 Sair
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-full border border-border bg-card px-4 py-3 text-sm font-extrabold justify-center flex items-center text-center"
                >
                  Entrar
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-extrabold text-primary-foreground justify-center flex items-center text-center shadow-chunky"
                >
                  Começar agora
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ helpMode, setHelpMode }: { helpMode: boolean; setHelpMode: (v: boolean) => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {helpMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2">
            <span>💡</span> 
            <span>O Hero é a introdução do site. Ele chama a atenção do usuário para começar a trilha.</span>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-accent/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-secondary/50 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:gap-12 px-6 py-12 md:grid-cols-2 md:py-28">
        <div className="relative z-10 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-soft">
            <span className="h-2 w-2 rounded-full bg-neon" /> Nova plataforma escolar
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl font-extrabold leading-[1.05] text-foreground md:text-6xl">
            Aprender <span className="bg-gradient-rainbow bg-clip-text text-transparent">LIBRAS</span> virou brincadeira.
          </h1>
          <p className="mt-6 mx-auto md:mx-0 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground">
            Trilhas, avatares 3D e desafios com IA para o Ensino Fundamental sinalizar do jeito certo — e se divertir muito no caminho.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              to="/trilha"
              search={{ world: 1 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1"
            >
              Começar trilha grátis →
            </Link>
            <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setHelpMode(!helpMode)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 px-7 py-4 text-base font-extrabold shadow-soft transition-all ${
                  helpMode 
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                    : "border-foreground/10 bg-card text-foreground hover:-translate-y-1"
                }`}
              >
                <span>🤔</span> Como funciona?
              </button>
              <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${helpMode ? "text-blue-500" : "text-muted-foreground/60"}`}>
                Modo Ajuda: {helpMode ? "Ligado" : "Desligado"}
              </span>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground">
            <Stat n="120+" l="sinais animados" />
            <div className="hidden sm:block h-8 w-px bg-border" />
            <Stat n="2 mundos" l="EF1 e EF2" />
            <div className="hidden sm:block h-8 w-px bg-border" />
            <Stat n="IA" l="corrige seu sinal" />
          </div>
        </div>
        <div className="relative mt-10 md:mt-0">
          <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-rainbow opacity-20 blur-2xl" />
          <div className="relative animate-float">
            <img
              src={luviMascot}
              alt="Luvi, mascote tatu-bola do SinaLINK, acenando"
              width={1024}
              height={1024}
              className="mx-auto w-full max-w-xs sm:max-w-md drop-shadow-2xl"
            />
          </div>
          <FloatingBadge className="left-0 top-4 sm:top-12 rotate-[-8deg] bg-card scale-75 sm:scale-100" emoji="👋" text="OI" />
          <FloatingBadge className="right-0 top-20 sm:top-32 rotate-[6deg] bg-accent scale-75 sm:scale-100" emoji="🌈" text="COR" />
          <FloatingBadge className="bottom-0 sm:bottom-8 left-4 sm:left-8 rotate-[4deg] bg-mint scale-75 sm:scale-100" emoji="🐢" text="TARTARUGA" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-extrabold text-foreground">{n}</div>
      <div className="text-xs uppercase tracking-wide">{l}</div>
    </div>
  );
}

function FloatingBadge({ className, emoji, text }: { className: string; emoji: string; text: string }) {
  return (
    <div className={`absolute flex items-center gap-2 rounded-2xl border-2 border-foreground/10 px-4 py-2 shadow-chunky ${className}`}>
      <span className="text-2xl">{emoji}</span>
      <span className="font-display text-sm font-extrabold tracking-wide">{text}</span>
    </div>
  );
}

function WorldsSection({ helpMode }: { helpMode: boolean }) {
  return (
    <section id="mundos" className="relative mx-auto max-w-6xl px-6 py-24">
      {helpMode && (
        <div className="absolute -top-4 md:top-12 left-1/2 -translate-x-1/2 z-20 animate-in fade-in">
          <div className="rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
            <span>💡</span> 
            <span className="hidden sm:inline">Nesta seção mostramos que o app tem adaptações visuais e de conteúdo para diferentes faixas etárias.</span>
            <span className="sm:hidden">Explica os 2 mundos diferentes do app.</span>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-2xl text-center relative z-10">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Dois mundos, uma linguagem</span>
        <h2 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">Uma trilha certa para cada idade.</h2>
        <p className="mt-4 text-muted-foreground">O aluno é diagnosticado no onboarding e cai no mundo com a linguagem visual, tema e ritmo certos.</p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {/* EF1 */}
        <article className="group relative overflow-hidden rounded-4xl bg-gradient-card-ef1 p-8 shadow-chunky">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">EF1 · 1º ao 5º ano</span>
            <span className="font-display text-4xl">🌈</span>
          </div>
          <h3 className="mt-6 font-display text-3xl font-extrabold">Mundo Cores & Bichos</h3>
          <p className="mt-2 max-w-sm text-sm text-foreground/70">Cartoon 3D, mascote fofo, cores saturadas e micro-vitórias a cada toque.</p>
          <img src={luviMascot} alt="Luvi" width={1024} height={1024} loading="lazy" className="mx-auto -mb-6 mt-6 w-56 transition-transform group-hover:scale-105" />
          <div className="flex flex-wrap gap-2">
            {["Saudações","Alfabeto","Cores","Bichos","Família","Escola"].map(t=>(
              <span key={t} className="rounded-full bg-card/80 px-3 py-1 text-xs font-bold">{t}</span>
            ))}
          </div>
        </article>

        {/* EF2 */}
        <article className="group relative overflow-hidden rounded-4xl bg-gradient-teen p-8 text-teen-fg shadow-glow-teen">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider backdrop-blur">EF2 · 6º ao 9º ano</span>
            <span className="font-display text-4xl">🎧</span>
          </div>
          <h3 className="mt-6 font-teen text-3xl font-bold">Mundo Conexão</h3>
          <p className="mt-2 max-w-sm text-sm text-white/80">Estética teen, cultura surda, gírias e gramática espacial em contexto real.</p>
          <img src={novaAvatar} alt="Nova" width={1024} height={1024} loading="lazy" className="mx-auto -mb-6 mt-6 w-56 transition-transform group-hover:scale-105 drop-shadow-2xl" />
          <div className="flex flex-wrap gap-2">
            {["Sentimentos","Rotina","Gírias","Redes","Profissões","Gramática"].map(t=>(
              <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">{t}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function TrailSection({ helpMode }: { helpMode: boolean }) {
  const levels = [
    { n: 1, t: "Oi, tudo bem?", d: "Saudações", c: "bg-coral", done: true },
    { n: 2, t: "A a Z", d: "Datilológico", c: "bg-sunshine", done: true },
    { n: 3, t: "1, 2, 3…", d: "Números", c: "bg-mint", done: true, current: false },
    { n: 4, t: "Arco-íris", d: "Cores", c: "bg-sky", current: true },
    { n: 5, t: "Zoo", d: "Bichos", c: "bg-grape text-white" },
    { n: 6, t: "Família", d: "Parentes", c: "bg-coral" },
    { n: 7, t: "Escola", d: "Objetos", c: "bg-mint" },
    { n: 8, t: "Boss 🎉", d: "Aniversário", c: "bg-gradient-rainbow text-white" },
  ];
  return (
    <section id="trilha" className="relative border-y border-border bg-muted/40 py-16 md:py-24">
      {helpMode && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 animate-in fade-in">
          <div className="rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2">
            <span>💡</span> 
            <span>Exemplo visual da trilha de aprendizado, gamificada para manter o aluno engajado.</span>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Trilha estilo Duolingo</span>
            <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl font-extrabold md:text-5xl">Uma ilha por vez. Zero pressão, muita conquista.</h2>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-card px-5 py-3 shadow-soft">
            <span className="text-2xl">🔥</span>
            <div className="text-sm">
              <div className="font-extrabold">Ofensiva de 12 dias</div>
              <div className="text-xs text-muted-foreground">Escudo de fim de semana ativo</div>
            </div>
          </div>
        </div>

        <ol className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {levels.map((l) => (
            <li key={l.n}>
              <Link
                to="/trilha"
                search={{ world: 1 }}
                className={`relative flex flex-col items-start justify-between rounded-3xl p-5 shadow-chunky transition-transform hover:-translate-y-1 block h-full ${l.c} ${l.current ? "ring-4 ring-foreground/80 animate-pop" : ""} ${!l.done && !l.current ? "opacity-90" : ""}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-background/40 font-display text-lg font-extrabold">{l.n}</span>
                  {l.done && <span className="text-2xl">⭐</span>}
                  {l.current && <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-extrabold uppercase text-background">Aqui</span>}
                </div>
                <div className="mt-8">
                  <div className="font-display text-xl font-extrabold">{l.t}</div>
                  <div className="text-xs font-bold opacity-80">{l.d}</div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function GamificationSection({ helpMode }: { helpMode: boolean }) {
  const items = [
    { icon: "❤️", title: "5 corações", desc: "recarregam em 4 horinhas, e sem nenhuma punição pesada.", tone: "bg-coral/15" },
    { icon: "🔥", title: "Ofensivas", desc: "Bônus para manter seu progresso no fim de semana.", tone: "bg-sunshine/25" },
    { icon: "🌟", title: "Estrelinhas & 💎 Cristais", desc: "Personalize seu Luv com estrelinhas e cristais adquiridos (EF2).", tone: "bg-mint/25" },
    { icon: "🏆", title: "Ligas semanais", desc: "Suba o nível da sua liga junto com o amigos.", tone: "bg-sky/25" },
    { icon: "🎯", title: "Missões diárias", desc: "3 missões divertidas + desafio semanal em equipe!.", tone: "bg-grape/25" },
    { icon: "📊", title: "Painel do professor", desc: "Mapa de dificuldades + relatórios de apredizagem e Classroom.", tone: "bg-accent/40" },
  ];
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      {helpMode && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 animate-in fade-in">
          <div className="rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2">
            <span>💡</span> 
            <span>Lista dos recursos de gamificação que incentivam o uso diário do aplicativo.</span>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-2xl text-center relative z-10">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Gamificação</span>
        <h2 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">Mecânicas feitas para aprender, e não para viciar.</h2>
        <p className="mt-4 text-muted-foreground">Reforço positivo, feedback fofo e progresso visível — sempre respeitando o ritmo da criança.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className={`rounded-3xl border-2 border-foreground/5 ${i.tone} p-6 shadow-soft transition-transform hover:-translate-y-1`}>
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-card text-3xl shadow-chunky">{i.icon}</div>
            <h3 className="font-display text-xl font-extrabold">{i.title}</h3>
            <p className="mt-1 text-sm text-foreground/70">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivitiesSection({ helpMode }: { helpMode: boolean }) {
  const acts = [
    {
      emoji: "🤟",
      title: "Qual é o sinal?",
      desc: "4 sinais. Selecione o correto — feedback destaca o parâmetro errado (mão, movimento, locação).",
      highlight: true,
    },
    { emoji: "🔮", title: "Estoure a Bolha", desc: "Bolhas com sinais flutuam. Estore a bolha que corresponde à palavra. Ritmo suave, sem game over." },
    { emoji: "🧩", title: "Tradutor de Frases", desc: "Arraste blocos de sinais na ordem correta em LIBRAS (Tópico-Comentário)." },
    { emoji: "🎭", title: "Desafio do Espelho", desc: "Webcam + IA validam configuração, ponto de articulação e movimento. Cartão de precisão com estrelas." },
    { emoji: "🧏‍♂️", title: "Soletre em libras", desc: "Datilologia guiada — reproduza pela câmera ou monte arrastando cartões." },
    { emoji: "🎬", title: "Leitura de Cena", desc: "Micro-histórias com sinalizantes surdos reais. Treina fluência receptiva de verdade." },
  ];
  return (
    <section id="jogos" className="relative border-y border-border bg-teen-bg py-20 text-teen-fg">
      {helpMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-in fade-in">
          <div className="rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2">
            <span>💡</span> 
            <span>Demonstra as diferentes atividades e minigames que o aluno encontrará nas lições.</span>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-neon">7 formatos interativos</span>
          <h2 className="mt-3 font-teen text-4xl font-bold md:text-5xl">Aprenda sozinho.</h2>
          <p className="mt-4 text-white/70">Avatares 3D com controle de velocidade (0.5x / 1x) e ângulo (frontal/lateral) </p>
          <p className="mt-4 text-white/70"> Essencial para aprender a sinalização no seu próprio ritmo. </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/trilha"
              search={{ world: 1 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rainbow px-7 py-3.5 text-sm font-extrabold text-white shadow-glow-teen transition-transform hover:-translate-y-1 active:scale-95"
            >
              <span>🗺️</span>
              <span>Minha Primeira Trilha →</span>
            </Link>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {acts.map((a) => {
            const isQualSinal = a.title === "Qual é o sinal?";
            return (
              <Link
                key={a.title}
                to="/trilha"
                search={{ world: 1 }}
                className="group block focus:outline-none focus:ring-2 focus:ring-neon rounded-3xl"
              >
                <div
                  className={`relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-6 backdrop-blur transition-all ${
                    isQualSinal
                      ? "border-neon/80 bg-white/10 shadow-glow-teen hover:-translate-y-1.5 hover:border-neon ring-2 ring-neon/40"
                      : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"
                  }`}
                >
                  {isQualSinal && (
                    <span className="absolute right-4 top-4 rounded-full bg-neon/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-neon border border-neon/40 shadow-sm animate-pulse">
                      ⭐ Minha Primeira Trilha
                    </span>
                  )}
                  <div>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-rainbow text-3xl shadow-glow-teen px-2 py-2">
                      {a.emoji}
                    </div>
                    <h3 className="font-teen text-xl font-bold text-center">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70 text-center">{a.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    {isQualSinal ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neon px-5 py-2.5 text-xs font-black text-slate-900 shadow-chunky transition-transform group-hover:scale-105">
                        Abrir minha primeira trilha →
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-white/50 group-hover:text-neon transition-colors">
                        Praticar na Trilha →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LessonCTA({ helpMode }: { helpMode: boolean }) {
  return (
    <section id="escolas" className="relative mx-auto max-w-6xl px-6 py-24">
      {helpMode && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 animate-in fade-in">
          <div className="rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2">
            <span>💡</span> 
            <span>Chamada para ação final (CTA) incentivando escolas e alunos a começarem a usar.</span>
          </div>
        </div>
      )}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-rainbow p-10 shadow-chunky md:p-16 z-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight text-white md:text-5xl text-center md:text-left">
              Desafio de 3 minutos com o Luvi.
            </h2>
            <p className="mt-4 max-w-lg text-base sm:text-lg text-white/90 text-center md:text-left mx-auto md:mx-0">
              Cores em LIBRAS, 5 telas rápidas para aprender.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3">
              <Link
                to="/trilha"
                search={{ world: 1 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-4 text-base font-extrabold text-background shadow-chunky transition-transform hover:-translate-y-1"
              >
                Aprenda sozinho →
              </Link>
              <a
                href="#"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-7 py-4 text-base font-extrabold text-white backdrop-blur transition-transform hover:-translate-y-1"
              >
                Jogar com a sala →
              </a>
            </div>
          </div>
          <div className="relative">
            <img src={luviMascot} alt="" width={1024} height={1024} loading="lazy" className="mx-auto w-64 animate-bounce-soft drop-shadow-2xl" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}


