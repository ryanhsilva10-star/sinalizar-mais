import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  HeartHandshake,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Users,
  GraduationCap,
  Brain,
  Building2,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Mail,
  Phone,
  BarChart3,
  Globe2,
  BookOpen,
  Laptop,
  Check,
  Layers,
  ChevronLeft
} from "lucide-react";

export const Route = createFileRoute("/apresentacao")({
  component: ApresentacaoComponent,
});

export function ApresentacaoComponent() {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [selectedSlide, setSelectedSlide] = useState<number>(1);
  const [demoRole, setDemoRole] = useState<"aluno" | "professor">("aluno");

  const totalSlides = 8;

  const scrollToSection = (id: string, slideNum: number) => {
    setSelectedSlide(slideNum);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* HEADER / NAVIGATION CORPORATIVA */}
      <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-emerald-100 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-200">
              S+
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Sinalizar mais</span>
              <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Pitch Deck Executivo • Inovação & ESG
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200 text-xs font-medium">
            <button
              onClick={() => scrollToSection("capa", 1)}
              className={`px-3 py-1.5 rounded-full transition-all ${selectedSlide === 1 ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Capa
            </button>
            <button
              onClick={() => scrollToSection("esg-impacto", 2)}
              className={`px-3 py-1.5 rounded-full transition-all ${selectedSlide === 2 ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Impacto ESG
            </button>
            <button
              onClick={() => scrollToSection("solucao-kids", 3)}
              className={`px-3 py-1.5 rounded-full transition-all ${selectedSlide === 3 ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Produto & Kids
            </button>
            <button
              onClick={() => scrollToSection("tecnologia", 4)}
              className={`px-3 py-1.5 rounded-full transition-all ${selectedSlide === 4 ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Tecnologia
            </button>
            <button
              onClick={() => scrollToSection("mercado", 5)}
              className={`px-3 py-1.5 rounded-full transition-all ${selectedSlide === 5 ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Mercado
            </button>
            <button
              onClick={() => scrollToSection("negocio", 6)}
              className={`px-3 py-1.5 rounded-full transition-all ${selectedSlide === 6 ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Modelo B2B
            </button>
            <button
              onClick={() => scrollToSection("personas", 7)}
              className={`px-3 py-1.5 rounded-full transition-all ${selectedSlide === 7 ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Personas
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/trilha"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Testar Trilha Vivo <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => scrollToSection("cta", 8)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md hover:brightness-110 transition-all"
            >
              Agendar Demo
            </button>
          </div>
        </div>
      </header>

      {/* SEÇÃO 1: CAPA */}
      <section id="capa" className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-emerald-50/30 to-[#FDFBF7]">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-sm text-xs font-semibold text-emerald-800">
            <Award className="w-4 h-4 text-emerald-600" /> Pitch Deck Institucional • Educação Inclusiva & Inovação ESG
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Sinalizar <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">mais</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-['Space_Grotesk']">
              Conectando mundos através da Libras.
            </p>
            <p className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg leading-relaxed">
              Plataforma gamificada de acessibilidade e educação inclusiva desenvolvida para o Ensino Fundamental 1 e 2.
            </p>
          </div>

          {/* DESTAQUES DA CAPA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Impacto Social ESG</h3>
              <p className="text-xs text-slate-500">Alinhado às metas globais de inclusão e ODS 4 (Educação de Qualidade) e ODS 10.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Módulo Kids Gamificado</h3>
              <p className="text-xs text-slate-500">Metodologia com o mascote "Passarinho dos Sinais", missões e inteligência artificial.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Modelo SaaS B2B</h3>
              <p className="text-xs text-slate-500">Escalabilidade para redes públicas de ensino e colégios privados com painel do professor.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("esg-impacto", 2)}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              Iniciar Apresentação <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection("solucao-kids", 3)}
              className="px-6 py-3.5 rounded-xl bg-white text-slate-700 font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Ver Módulo Kids 🐤
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: O PROBLEMA & IMPACTO SOCIAL (ESG SERASA) */}
      <section id="esg-impacto" className="py-20 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Slide 02 • O Cenário Atual
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              O Desafio da Inclusão Escolar no Brasil
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              A barreira da comunicação afeta milhões de crianças diariamente nas salas de aula brasileiras.
            </p>
          </div>

          {/* ESTATÍSTICAS IMPACTANTES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="text-4xl font-black text-emerald-700 mb-2">+10,7 Mi</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Pessoas Surdas ou com Deficiência Auditiva</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Segundo o IBGE, uma parcela gigante da população enfrenta barreiras severas na educação e integração social por falta de acessibilidade.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="text-4xl font-black text-amber-600 mb-2">98%</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Escolas sem Ferramentas Interativas de Libras</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A grande maioria dos colégios de EF1 e EF2 não possui softwares educativos gamificados focados na alfabetização em Libras para crianças ouvintes e surdas.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-teal-100 shadow-sm relative overflow-hidden group hover:border-teal-300 transition-all">
              <div className="text-4xl font-black text-teal-700 mb-2">80%</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Aumento de Engajamento via Gamificação</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Crianças aprendem até 4x mais rápido quando o ensino de Libras é associado a elementos lúdicos, mascotes interativos e feedback imediato.
              </p>
            </div>
          </div>

          {/* ALINHAMENTO ESG & IMPACTO SOCIAL */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-lg">Alinhamento Estratégico com Diretrizes ESG & ODS</h3>
                  <p className="text-xs text-emerald-200">Investimento com alto retorno social, governança inclusiva e transformação comunitária</p>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                Inclusão Social, Educação & Tech
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ODS 4: Educação de Qualidade
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Proporciona aprendizado inclusivo, equitativo e de qualidade na educação básica fundamental.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ODS 10: Redução das Desigualdades
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Promove a inclusão social e a comunicação entre alunos ouvintes e surdos na mesma sala.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ODS 9: Inovação & Infraestrutura
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Aplica Inteligência Artificial (Visão Computacional) para levar tecnologia de ponta às salas brasileiras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: A SOLUÇÃO & PRODUTO (MÓDULO KIDS & MASCOTE) */}
      <section id="solucao-kids" className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Slide 03 • A Solução & Módulo Kids
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Conheça a Plataforma <span className="text-emerald-600">Sinalizar mais</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Uma experiência completa que une os alunos no Módulo Kids e capacita professores com um Dashboard estratégico.
            </p>
          </div>

          {/* CARD DA MASCOTE "PASSARINHO DOS SINAIS" */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-teal-500/10 p-8 sm:p-10 rounded-3xl border border-emerald-200 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative group">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-white p-3 shadow-xl border-4 border-amber-300 overflow-hidden flex items-center justify-center bg-gradient-to-b from-amber-50 to-emerald-50">
                  {/* Ilustração Visual do Passarinho dos Sinais */}
                  <div className="text-center space-y-2">
                    <div className="text-6xl animate-bounce">🐤</div>
                    <div className="font-extrabold text-slate-900 text-lg font-['Baloo_2']">
                      Passarinho dos Sinais
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Mascote Guia de Libras
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 italic">
                "Aprender Libras é voar alto na inclusão!"
              </p>
            </div>

            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Metodologia Lúdica Kids</span>
                <h3 className="text-2xl font-bold text-slate-900 font-['Baloo_2']">
                  Módulo Infantil: Aprender brincando com o Passarinho
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  O **Passarinho dos Sinais** é o mascote carismático que acompanha as crianças no Ensino Fundamental 1 e 2. Ele guia os alunos por fases progressivas, ensinando o alfabeto datilológico, números, saudações, animais e expressões do dia a dia com animações e feedback amoroso.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Trilhas Progressivas</h4>
                    <p className="text-slate-500">Unidades organizadas por temas práticos e cotidianos.</p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">XP, Ofensivas & Estrelas</h4>
                    <p className="text-slate-500">Recompensas imediatas que mantêm a motivação em alta.</p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Visão IA em Tempo Real</h4>
                    <p className="text-slate-500">A câmera valida a posição dos gestos das mãos das crianças.</p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Painel do Professor</h4>
                    <p className="text-slate-500">Monitoramento detalhado do desempenho da sala.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: DEMONSTRAÇÃO DO PROJETO & TECNOLOGIA */}
      <section id="tecnologia" className="py-20 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Slide 04 • Arquitetura & Tecnologia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Engenharia Moderna & Escalável
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Construído sobre uma infraestrutura segura de alto desempenho para suporte a milhares de requisições simultâneas.
            </p>
          </div>

          {/* TOGGLE INTERATIVO DE FLUXO */}
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-bold">
              <button
                onClick={() => setDemoRole("aluno")}
                className={`px-5 py-2 rounded-lg transition-all ${demoRole === "aluno" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}
              >
                Fluxo do Aluno (Módulo Kids)
              </button>
              <button
                onClick={() => setDemoRole("professor")}
                className={`px-5 py-2 rounded-lg transition-all ${demoRole === "professor" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}
              >
                Fluxo do Professor (Gestão B2B)
              </button>
            </div>
          </div>

          {/* FLUXO SELECIONADO */}
          {demoRole === "aluno" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto flex items-center justify-center text-sm">1</div>
                <h4 className="font-bold text-slate-900 text-sm">Escolha do Módulo</h4>
                <p className="text-xs text-slate-500">Aluno entra na trilha temática com o Passarinho dos Sinais.</p>
              </div>
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto flex items-center justify-center text-sm">2</div>
                <h4 className="font-bold text-slate-900 text-sm">Prática Interativa</h4>
                <p className="text-xs text-slate-500">Assiste a vídeos explicativos e responde quizzes de datilologia.</p>
              </div>
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto flex items-center justify-center text-sm">3</div>
                <h4 className="font-bold text-slate-900 text-sm">Reconhecimento IA</h4>
                <p className="text-xs text-slate-500">Validação da posição correta das mãos pela webcam com MediaPipe.</p>
              </div>
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto flex items-center justify-center text-sm">4</div>
                <h4 className="font-bold text-slate-900 text-sm">Conquista & XP</h4>
                <p className="text-xs text-slate-500">Recebe pontos, avança o nível e registra o progresso no banco.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold mx-auto flex items-center justify-center text-sm">1</div>
                <h4 className="font-bold text-slate-900 text-sm">Convite Seguro</h4>
                <p className="text-xs text-slate-500">Professor adiciona alunos à turma diretamente pelo e-mail.</p>
              </div>
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold mx-auto flex items-center justify-center text-sm">2</div>
                <h4 className="font-bold text-slate-900 text-sm">Navegação Livre</h4>
                <p className="text-xs text-slate-500">Professor tem acesso à trilha inteira liberada para planejar aulas.</p>
              </div>
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold mx-auto flex items-center justify-center text-sm">3</div>
                <h4 className="font-bold text-slate-900 text-sm">Dashboard de Progresso</h4>
                <p className="text-xs text-slate-500">Acompanha porcentagens e lições concluídas em tempo real.</p>
              </div>
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold mx-auto flex items-center justify-center text-sm">4</div>
                <h4 className="font-bold text-slate-900 text-sm">Relatórios ESG</h4>
                <p className="text-xs text-slate-500">Geração de relatórios pedagógicos para a coordenação da escola.</p>
              </div>
            </div>
          )}

          {/* DIAGRAMA DA STACK TECNOLÓGICA */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Matriz da Stack Tecnológica
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="font-bold text-white text-sm">Front-end</div>
                <p className="text-slate-400">React 19, TanStack Start, Vite, Tailwind CSS v4, Radix UI.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="font-bold text-white text-sm">Visão Computacional</div>
                <p className="text-slate-400">MediaPipe Tasks Vision (Google IA) para detecção de gestos no browser.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="font-bold text-white text-sm">Back-end & DB</div>
                <p className="text-slate-400">Supabase (PostgreSQL), Autenticação JWT, Row Level Security (RLS).</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="font-bold text-white text-sm">Infra & Escalabilidade</div>
                <p className="text-slate-400">Deploy serverless em Nuvem com suporte a 100k+ alunos simultâneos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: ANÁLISE DE MERCADO & DIFERENCIAIS */}
      <section id="mercado" className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Slide 05 • Posicionamento & Análise Competitiva
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Matriz Comparativa de Diferenciais
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Por que o **Sinalizar mais** é a escolha ideal para o contexto escolar e corporativo em comparação a soluções genéricas.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold">
                  <th className="p-4">Funcionalidade / Critério</th>
                  <th className="p-4 text-center bg-emerald-50 text-emerald-900 border-x border-emerald-100">
                    Sinalizar mais 🐤
                  </th>
                  <th className="p-4 text-center">Hand Talk / VLibras</th>
                  <th className="p-4 text-center">Duolingo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Foco Pedagógico em Sala de Aula (EF1 e EF2)</td>
                  <td className="p-4 text-center bg-emerald-50/50 font-bold text-emerald-700 border-x border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" /> Sim, 100% Escolar
                  </td>
                  <td className="p-4 text-center">Tradução Genérica de Texto</td>
                  <td className="p-4 text-center">Idiomas Falados (Não Libras)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Mascote Guia Infantil (Passarinho dos Sinais)</td>
                  <td className="p-4 text-center bg-emerald-50/50 font-bold text-emerald-700 border-x border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" /> Exclusivo
                  </td>
                  <td className="p-4 text-center">Avatar 3D Genérico</td>
                  <td className="p-4 text-center">Duo (Outros Idiomas)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Painel do Professor com Métricas Reais de Turma</td>
                  <td className="p-4 text-center bg-emerald-50/50 font-bold text-emerald-700 border-x border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" /> Sim, com % de Progresso
                  </td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 mx-auto text-slate-300" /> Não</td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 mx-auto text-slate-300" /> Limitado</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Validação de Gestos por Visão Computacional (IA)</td>
                  <td className="p-4 text-center bg-emerald-50/50 font-bold text-emerald-700 border-x border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" /> Integrado
                  </td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 mx-auto text-slate-300" /> Não</td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 mx-auto text-slate-300" /> Não</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Relatórios de Impacto ESG para Investidores/Mantenedores</td>
                  <td className="p-4 text-center bg-emerald-50/50 font-bold text-emerald-700 border-x border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" /> Nativo B2B
                  </td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 mx-auto text-slate-300" /> Não</td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 mx-auto text-slate-300" /> Não</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: MODELO DE NEGÓCIO & SUSTENTABILIDADE */}
      <section id="negocio" className="py-20 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Slide 06 • Modelo de Negócio B2B & ESG
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Sustentabilidade Financeira & Escalabilidade
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Estratégia híbrida que garante acesso gratuito à comunidade e receita sustentável via licenciamento corporativo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-slate-200 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                B2C / Freemium
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Módulo Básico Gratuito</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Alunos e professores individuais podem acessar as primeiras unidades e aprender o alfabeto datilológico gratuitamente.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Acesso às unidades introdutórias</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Mascote Passarinho dos Sinais liberado</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Criação de até 1 turma por professor</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-8 rounded-3xl space-y-6 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                B2B SaaS / Parcerias Corporativas & ESG
              </div>
              <h3 className="text-2xl font-bold text-white">Licenciamento de Redes & Apadrinhamento ESG</h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Grandes corporações e mantenedoras com programas de ESG e Inclusão Social podem apadrinhar redes de ensino públicas e privadas, viabilizando a implantação completa da tecnologia para milhares de estudantes.
              </p>
              <ul className="space-y-2.5 text-xs text-emerald-200">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Licenciamento por número de alunos/escolas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Relatórios de Impacto Social com a marca da empresa mantenedora</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Suporte pedagógico dedicado e treinamento docente</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: PERSONAS (PROFESSORA GEGE & ALUNO) */}
      <section id="personas" className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Slide 07 • Histórias de Sucesso & Personas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Quem Transformamos Todos os Dias
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Conheça as personas reais que inspiram o desenvolvimento do **Sinalizar mais**.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PERSONA 1: PROFESSORA GEGE */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-2xl border-2 border-amber-300">
                  👩‍🏫
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">GeGe Professora</h3>
                  <p className="text-xs text-slate-500">Educadora de 4º ano do Ensino Fundamental</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-slate-900">Dor Principal:</span> Dificuldade em incluir alunos surdos de forma natural na dinâmica da sala de aula sem isolá-los.
                </div>
                <div>
                  <span className="font-bold text-slate-900">Como o Sinalizar mais resolve:</span> Ela abre a trilha liberada para planejar a aula e usa o Módulo Kids no telão da sala. As crianças ouvintes aprendem Libras brincando com o Passarinho, eliminando a barreira da comunicação.
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-xs font-semibold italic border border-amber-200">
                "Ver a turma inteira sinalizando bom dia para o colega surdo foi a maior conquista do meu ano letivo!"
              </div>
            </div>

            {/* PERSONA 2: LUCAS ALUNO */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-2xl border-2 border-emerald-300">
                  👦
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Lucas (9 anos)</h3>
                  <p className="text-xs text-slate-500">Aluno do Ensino Fundamental 1</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-slate-900">Dor Principal:</span> Achava as aulas tradicionais de acessibilidade cansativas e desmotivantes.
                </div>
                <div>
                  <span className="font-bold text-slate-900">Como o Sinalizar mais resolve:</span> Lucas ama jogos! Ele quer manter sua ofensiva de dias com o Passarinho dos Sinais, ganha estrelas e pratica os sinais na frente da câmera.
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 text-xs font-semibold italic border border-emerald-200">
                "Eu adoro jogar com o Passarinho verde! Agora já sei falar meu nome em Libras!"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8: CALL TO ACTION (CTA CORPORATIVO) */}
      <section id="cta" className="py-24 px-4 bg-gradient-to-b from-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Slide 08 • O Próximo Passo
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Vamos transformar a educação inclusiva juntos?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Convidamos gestores educacionais, investidores de impacto e comitês de ESG a fazerem parte dessa revolução de acessibilidade, inclusão social e inovação com o **Sinalizar mais**.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="mailto:contato@sinalizarmais.com.br"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm shadow-xl hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Agendar Demonstração Executiva
            </a>
            <Link
              to="/trilha"
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Explorar Módulo Kids 🐤
            </Link>
          </div>

          <div className="pt-12 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              © 2026 Sinalizar mais • Plataforma de Educação Inclusiva em Libras
            </div>
            <div className="flex gap-6">
              <span>Pitch Deck Executivo & ESG</span>
              <span>ODS 4, 9 & 10</span>
              <span>Educação Inclusiva Brasil</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
