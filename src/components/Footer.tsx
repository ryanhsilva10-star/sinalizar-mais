import React from "react";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#111b21] text-[#939bb0] font-sans antialiased border-t-4 border-[#58cc02] selection:bg-[#58cc02] selection:text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-6">
        
        <div className="flex items-center gap-3">
          <img src="/sinaliza-mais-logo.jpg" alt="Sinaliza Mais - Logo" className="w-10 h-10 rounded-xl object-cover shadow-[0_2px_0_0_#46a302] transform -rotate-3" />
          <h3 className="text-xl font-black text-white tracking-wide">
            sinaliza mais
          </h3>
        </div>

        {/* Links Funcionais */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-[#e5e7eb]">
          <a href="/login" className="hover:text-[#58cc02] transition-colors">Entrar</a>
          <a href="/trilha" className="hover:text-[#58cc02] transition-colors">Jogar / Aprender</a>
          <a href="mailto:contato@sinalizamais.com" className="hover:text-[#58cc02] transition-colors">Suporte</a>
        </div>

        <div className="w-full h-px bg-[#232e38] my-4"></div>

        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#6d778d] text-center sm:text-left">
          <span>© {new Date().getFullYear()} sinaliza mais. Todos os direitos reservados.</span>
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
