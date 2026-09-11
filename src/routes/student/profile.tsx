import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getActiveUser,
  saveUser,
  logoutUser,
  User,
} from "@/lib/user-store";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "Meu Perfil de Aluno · SinaLINK LIBRAS" },
      {
        name: "description",
        content: "Gerencie suas informações cadastrais e acompanhe seu progresso de aprendizado em LIBRAS.",
      },
    ],
  }),
  component: StudentProfilePage,
});

const AVATARS = [
  { icon: "🦊", label: "Luvi Raposa" },
  { icon: "🚀", label: "Nova Astro" },
  { icon: "🐼", label: "Panda Sinais" },
  { icon: "🦁", label: "Leão Corajoso" },
  { icon: "🦉", label: "Coruja Sábia" },
  { icon: "👾", label: "Gamer Teen" },
];

function StudentProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [document, setDocument] = useState("");
  const [address, setAddress] = useState("");
  const [world, setWorld] = useState<"ef1" | "ef2">("ef1");
  const [avatar, setAvatar] = useState("🦊");

  // Regra de Guarda de Autorização da Rota
  useEffect(() => {
    const active = getActiveUser();
    
    // 1. Não autenticado -> redireciona para login
    if (!active) {
      toast.error("Sessão não encontrada. Por favor, faça login.");
      navigate({ to: "/login", replace: true });
      return;
    }

    // 2. Autenticado como Professor -> redireciona para o Onboarding
    if (active.role === "professor") {
      toast.info("Perfil de Professor detectado. Redirecionando para o Onboarding.");
      navigate({ to: "/onboarding", replace: true });
      return;
    }

    // 3. Autenticado como Aluno -> carrega dados cadastrais
    setCurrentUser(active);
    setName(active.name);
    setEmail(active.email);
    setPhone(active.phone || "");
    setBirthDate(active.birthDate || "");
    setDocument(active.document || "");
    setAddress(active.address || "");
    setWorld(active.world || "ef1");
    setAvatar(active.avatar || "🦊");
  }, [navigate]);

  // Função para Log-off
  const handleLogout = () => {
    logoutUser();
    toast.info("Sessão encerrada com sucesso.");
    navigate({ to: "/login", replace: true });
  };

  // Salvar edições cadastrais do Aluno
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!name.trim() || !email.trim()) {
      toast.error("Nome e E-mail são obrigatórios.");
      return;
    }

    try {
      // Garante que o aluno edita estritamente seus próprios dados (currentUser.id)
      const updated = saveUser({
        id: currentUser.id,
        name,
        email,
        phone,
        birthDate,
        document,
        address,
        world,
        avatar,
        role: "aluno",
      });

      setCurrentUser(updated);
      toast.success("Seus dados cadastrais foram atualizados com sucesso! 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar os dados do perfil.");
    }
  };

  if (!currentUser) return null;

  const isTeen = world === "ef2";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isTeen ? "bg-slate-950 text-slate-100" : "bg-background text-foreground"
      }`}
    >
      {/* Header com Botão de Log-off */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft">
              S
            </span>
            <span className="font-display text-2xl font-extrabold">SinaLINK</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div className="hidden text-left md:block">
              <p className="text-xs font-extrabold leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-muted-foreground">
                🎒 Aluno • Nível {currentUser.level}
              </p>
            </div>

            <Link
              to="/trilha"
              className="rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-xs font-extrabold hover:bg-primary/20"
            >
              🗺️ Ir para a Trilha
            </Link>

            {/* BOTÃO DE LOG-OFF */}
            <button
              onClick={handleLogout}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors"
              title="Encerrar sessão completamente"
            >
              🚪 Sair / Log-off
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Banner do Aluno & Status */}
        <div className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-4xl shadow-inner">
              {avatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold">{name}</h1>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                  Conta de Aluno
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs w-full md:w-auto">
            <div className="rounded-2xl bg-muted/50 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Nível</p>
              <p className="font-extrabold text-base">{currentUser.level}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">XP</p>
              <p className="font-extrabold text-base text-amber-500">⚡ {currentUser.xp}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Ofensiva</p>
              <p className="font-extrabold text-base text-rose-500">🔥 {currentUser.streak}d</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Formulário de Cadastro do Aluno (2 Colunas) */}
          <div className="md:col-span-2">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
              <div className="border-b border-border/60 pb-4 mb-6">
                <h2 className="font-display text-xl font-extrabold">Gerenciar Meu Perfil</h2>
                <p className="text-xs text-muted-foreground">
                  Atualize suas informações cadastrais. Os dados salvos são atualizados instantaneamente.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                {/* Escolha do Avatar */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Avatar:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.icon}
                        type="button"
                        onClick={() => setAvatar(av.icon)}
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-2xl transition-all ${
                          avatar === av.icon
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-105"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {av.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nome Completo */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Telefone */}
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Documento */}
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Documento (CPF / RA)
                    </label>
                    <input
                      type="text"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
                    />
                  </div>

                  {/* Mundo / Nível de Ensino */}
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Trilha Principal
                    </label>
                    <select
                      value={world}
                      onChange={(e) => setWorld(e.target.value as "ef1" | "ef2")}
                      className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
                    >
                      <option value="ef1">EF1 • Infantil (1º ao 5º ano)</option>
                      <option value="ef2">EF2 • Teen (6º ao 9º ano)</option>
                    </select>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, cidade/UF"
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-full bg-primary py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  💾 Salvar Alterações no Cadastro
                </button>
              </form>
            </section>
          </div>

          {/* Histórico de Lições Concluídas (1 Coluna) */}
          <div>
            <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">
              <h3 className="font-display text-lg font-extrabold flex items-center gap-2">
                <span>📜</span> Minhas Lições Concluídas
              </h3>
              <p className="mt-1 text-xs text-muted-foreground mb-4">
                Sinais praticados e pontuação acumulada.
              </p>

              <div className="space-y-3">
                {!currentUser.completedLessons || currentUser.completedLessons.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-6">
                    Você ainda não completou lições. Comece praticando na Trilha!
                  </p>
                ) : (
                  currentUser.completedLessons.map((les) => (
                    <div
                      key={les.id}
                      className="rounded-2xl border border-border bg-background p-3 text-xs"
                    >
                      <p className="font-bold">{les.title}</p>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{les.completedAt}</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          ⭐ {les.score}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/trilha"
                className="mt-6 block w-full rounded-full bg-emerald-600 py-3 text-center font-display text-sm font-extrabold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Praticar Novos Sinais →
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
