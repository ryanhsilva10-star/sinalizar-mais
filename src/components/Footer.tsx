import React, { useState } from "react";
import {
  Globe,
  ChevronDown,
  ChevronUp,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Sparkles,
  Smartphone,
  Check,
  ShieldCheck,
  Heart
} from "lucide-react";

// Lista de idiomas disponíveis
const LANGUAGES = [
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹" },
];

// Dados das colunas de links do rodapé
const FOOTER_COLUMNS = [
  {
    id: "sobre",
    title: "Sobre nós",
    links: [
      { label: "Quem somos", href: "#" },
      { label: "Nossa missão", href: "#" },
      { label: "Método de ensino", href: "#" },
      { label: "Carreiras", href: "#", badge: "Vagas!" },
      { label: "Imprensa & Mídia", href: "#" },
      { label: "Loja Oficial", href: "#" },
    ],
  },
  {
    id: "cursos",
    title: "Cursos & Recursos",
    links: [
      { label: "LIBRAS para Iniciantes", href: "#" },
      { label: "LIBRAS para Escolas", href: "#" },
      { label: "Dicionário Visual", href: "#" },
      { label: "Frases do Dia", href: "#" },
      { label: "Guia para Pais", href: "#" },
      { label: "Blog & Artigos", href: "#" },
    ],
  },
  {
    id: "produtos",
    title: "Aplicativos",
    links: [
      { label: "SinaLINK para iOS", href: "#" },
      { label: "SinaLINK para Android", href: "#" },
      { label: "SinaLINK Kids (EF1)", href: "#" },
      { label: "SinaLINK Teen (EF2)", href: "#" },
      { label: "SinaLINK para Escolas", href: "#" },
    ],
  },
  {
    id: "suporte",
    title: "Ajuda & Suporte",
    links: [
      { label: "Central de Ajuda", href: "#" },
      { label: "Perguntas Frequentes", href: "#" },
      { label: "Suporte aos Alunos", href: "#" },
      { label: "Comunidade & Fórum", href: "#" },
      { label: "Status do Sistema", href: "#" },
    ],
  },
  {
    id: "legal",
    title: "Legal & Ética",
    links: [
      { label: "Termos de Uso", href: "#" },
      { label: "Política de Privacidade", href: "#" },
      { label: "Diretrizes da Comunidade", href: "#" },
      { label: "Acessibilidade", href: "#" },
      { label: "Preferências de Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <footer className="w-full bg-[#111b21] text-[#939bb0] font-sans antialiased border-t-4 border-[#58cc02] selection:bg-[#58cc02] selection:text-white">
      {/* Top Banner / Chamada de Incentivo (Estilo Duolingo) */}
      <div className="border-b border-[#2b3544] bg-[#14232c] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#58cc02] text-white flex items-center justify-center font-black text-2xl shadow-[0_4px_0_0_#46a302] transform -rotate-3 transition-transform hover:rotate-0">
              S
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Aprenda LIBRAS de graça, para sempre.
              </h3>
              <p className="text-sm font-semibold text-[#8492a6] mt-0.5">
                Mais de 10.000 alunos já estão praticando sinais todos os dias.
              </p>
            </div>
          </div>
          <a
            href="/onboarding"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-[#58cc02] text-white font-extrabold text-base tracking-wider uppercase shadow-[0_4px_0_0_#46a302] hover:bg-[#61e002] active:translate-y-1 active:shadow-none transition-all duration-150"
          >
            Comece Agora
          </a>
        </div>
      </div>

      {/* Grid Principal de Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {FOOTER_COLUMNS.map((col) => {
            const isOpen = !!openAccordions[col.id];
            return (
              <div key={col.id} className="border-b border-[#232e38] md:border-none pb-4 md:pb-0">
                {/* Header Mobile (Acordeão) / Header Desktop */}
                <button
                  onClick={() => toggleAccordion(col.id)}
                  className="w-full flex items-center justify-between md:cursor-default py-2 md:py-0 text-left group"
                  aria-expanded={isOpen}
                >
                  <h4 className="text-white font-black text-base uppercase tracking-wider text-[#e5e7eb] group-hover:text-[#58cc02] md:group-hover:text-[#e5e7eb] transition-colors">
                    {col.title}
                  </h4>
                  <span className="md:hidden text-[#58cc02] transition-transform duration-200">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>

                {/* Lista de Links */}
                <ul
                  className={`mt-3 space-y-2.5 transition-all duration-300 overflow-hidden md:max-h-none md:opacity-100 ${
                    isOpen ? "max-h-96 opacity-100 py-1" : "max-h-0 opacity-0 md:max-h-none"
                  }`}
                >
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#939bb0] hover:text-[#58cc02] transition-colors duration-150"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-lg bg-[#ff4b4b] text-white shadow-[0_2px_0_0_#d42f2f]">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Linha Intermediária: Idiomas, Badges das Lojas & Redes Sociais */}
        <div className="mt-12 pt-8 border-t border-[#232e38] flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Seletor de Idioma Customizado */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#182630] border-2 border-[#2b3846] text-white font-bold text-sm shadow-[0_3px_0_0_#2b3846] hover:bg-[#20313e] hover:border-[#58cc02] transition-all duration-150"
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
            >
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#1cb0f6]" />
                <span className="text-base">{selectedLang.flag}</span>
                <span>{selectedLang.label}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#8492a6] transition-transform duration-200 ${
                  isLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Menu Dropdown / Dropup */}
            {isLangOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-full sm:w-64 bg-[#182630] border-2 border-[#2b3846] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="px-3 py-1.5 text-xs font-black text-[#6d778d] uppercase tracking-wider">
                  Selecione o Idioma
                </div>
                <div className="space-y-1 mt-1 max-h-48 overflow-y-auto">
                  {LANGUAGES.map((lang) => {
                    const isSelected = lang.code === selectedLang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                          isSelected
                            ? "bg-[#58cc02] text-white font-extrabold shadow-[0_2px_0_0_#46a302]"
                            : "text-[#939bb0] hover:bg-[#233342] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        {isSelected && <Check size={16} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Download App Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#182630] border-2 border-[#2b3846] text-white font-bold text-xs shadow-[0_3px_0_0_#2b3846] hover:bg-[#20313e] hover:border-[#1cb0f6] active:translate-y-0.5 active:shadow-none transition-all duration-150"
            >
              <svg className="w-6 h-6 fill-current text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.73c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.45-.62.72-1.16 1.88-1.01 3.01 1.08.08 2.18-.54 2.85-1.36z"/>
              </svg>
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-[#8492a6] font-semibold uppercase">Baixe na</span>
                <span className="text-sm font-extrabold text-white">App Store</span>
              </div>
            </a>

            <a
              href="#"
              className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#182630] border-2 border-[#2b3846] text-white font-bold text-xs shadow-[0_3px_0_0_#2b3846] hover:bg-[#20313e] hover:border-[#58cc02] active:translate-y-0.5 active:shadow-none transition-all duration-150"
            >
              <svg className="w-6 h-6 fill-current text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M3.6 2.25c-.27.18-.4.49-.4.85v17.8c0 .36.13.67.4.85l9.44-9.44L3.6 2.25zm11.2 7.74l3.15-1.82c.87-.5 1.45-.5 1.93 0l-3.32 3.32-1.76-1.5zm-1.76 1.76l1.76 1.76 3.32 3.32c-.48.5-1.06.5-1.93 0l-3.15-1.82-1.76-1.5c1.76-1.76 1.76-1.76 1.76-1.76zM4.6 21.05l8.44-8.44L4.6 4.17v16.88z"/>
              </svg>
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-[#8492a6] font-semibold uppercase">Disponível no</span>
                <span className="text-sm font-extrabold text-white">Google Play</span>
              </div>
            </a>
          </div>

          {/* Redes Sociais */}
          <div className="flex items-center gap-3">
            {[
              { icon: Instagram, href: "#", label: "Instagram", color: "hover:border-[#e1306c] hover:text-[#e1306c]" },
              { icon: Youtube, href: "#", label: "YouTube", color: "hover:border-[#ff0000] hover:text-[#ff0000]" },
              { icon: Twitter, href: "#", label: "Twitter", color: "hover:border-[#1da1f2] hover:text-[#1da1f2]" },
              { icon: Facebook, href: "#", label: "Facebook", color: "hover:border-[#1877f2] hover:text-[#1877f2]" },
              { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:border-[#0a66c2] hover:text-[#0a66c2]" },
            ].map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-2xl bg-[#182630] border-2 border-[#2b3846] text-[#939bb0] flex items-center justify-center shadow-[0_3px_0_0_#2b3846] active:translate-y-0.5 active:shadow-none transition-all duration-150 ${social.color}`}
                >
                  <IconComponent size={18} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Rodapé Inferior: Copyright e Links Finais */}
        <div className="mt-12 pt-8 border-t border-[#232e38] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#6d778d] text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SinaLINK / Duolingo Style UI. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Feito com</span>
            <Heart size={14} className="text-[#ff4b4b] fill-current animate-pulse" />
            <span>para promover acessibilidade em LIBRAS.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
