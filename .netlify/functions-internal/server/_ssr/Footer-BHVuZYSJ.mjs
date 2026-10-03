import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Heart } from "../_libs/lucide-react.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "w-full bg-[#111b21] text-[#939bb0] font-sans antialiased border-t-4 border-[#58cc02] selection:bg-[#58cc02] selection:text-white py-10 mt-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/sinaliza-mais-logo.jpg",
						alt: "Sinaliza Mais - Logo",
						className: "w-10 h-10 rounded-xl object-cover shadow-[0_2px_0_0_#46a302] transform -rotate-3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-black text-white tracking-wide",
						children: "sinaliza mais"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-[#e5e7eb]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/login",
							className: "hover:text-[#58cc02] transition-colors",
							children: "Entrar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/trilha",
							className: "hover:text-[#58cc02] transition-colors",
							children: "Jogar / Aprender"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "mailto:contato@sinalizamais.com",
							className: "hover:text-[#58cc02] transition-colors",
							children: "Suporte"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-px bg-[#232e38] my-4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#6d778d] text-center sm:text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" sinaliza mais. Todos os direitos reservados."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Feito com" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								size: 14,
								className: "text-[#ff4b4b] fill-current animate-pulse"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "para promover acessibilidade em LIBRAS." })
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { Footer as t };
