import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as logoutUser, d as getActiveUser } from "./router-Bs2xLfcW.mjs";
import { t as luvi_mascot_default } from "./luvi-mascot-oOSQQfKg.mjs";
import { t as X, v as Menu } from "../_libs/lucide-react.mjs";
import { t as Footer } from "./Footer-BHVuZYSJ.mjs";
import { n as TurmaClaNavbarButton, t as JoinClassroomFab } from "./TurmaClaNavbarButton-BI1qPLkQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-lyE4xAed.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nova_avatar_default = "/assets/nova-avatar-oRYp64n1.png";
function LandingPage() {
	const [helpMode, setHelpMode] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
				helpMode,
				setHelpMode
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldsSection, { helpMode }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailSection, { helpMode }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GamificationSection, { helpMode }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivitiesSection, { helpMode }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonCTA, { helpMode }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinClassroomFab, {})
		]
	});
}
function Header() {
	const [currentUser, setCurrentUser] = (0, import_react.useState)(() => getActiveUser());
	const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setCurrentUser(getActiveUser());
	}, []);
	const handleLogout = () => {
		logoutUser();
		setCurrentUser(null);
		toast.info("Sessão encerrada.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/sinaliza-mais-logo.jpg",
						alt: "Sinaliza Mais - Logo",
						className: "h-16 w-16 rounded-xl object-cover shadow-soft"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl font-extrabold",
						children: "sinaliza mais"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-8 text-sm font-bold text-muted-foreground md:flex text-secondary-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#mundos",
							className: "hover:text-foreground",
							children: "Mundos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trilha",
							className: "hover:text-foreground",
							children: "Trilha"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#jogos",
							className: "hover:text-foreground",
							children: "Atividades"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#escolas",
							className: "hover:text-foreground",
							children: "Para escolas"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:block",
					children: currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TurmaClaNavbarButton, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: currentUser.role === "professor" ? "/onboarding" : "/student/profile",
								className: "flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-extrabold hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentUser.avatar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentUser.name })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleLogout,
								className: "rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400",
								children: "🚪 Sair"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							search: { mode: "register" },
							className: "inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5",
							children: "➕ Cadastrar Novo Usuário"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							search: { mode: "login" },
							className: "inline-flex items-center rounded-full border border-border bg-card px-4 py-2.5 text-sm font-extrabold text-foreground hover:bg-muted transition-colors",
							children: "🔑 Login"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "md:hidden p-2 text-foreground",
					onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
					"aria-label": "Menu",
					children: isMobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 24 })
				})
			]
		}), isMobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-col gap-4 text-sm font-bold text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#mundos",
						className: "hover:text-foreground",
						onClick: () => setIsMobileMenuOpen(false),
						children: "Mundos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/trilha",
						className: "hover:text-foreground",
						onClick: () => setIsMobileMenuOpen(false),
						children: "Trilha"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#jogos",
						className: "hover:text-foreground",
						onClick: () => setIsMobileMenuOpen(false),
						children: "Atividades"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#escolas",
						className: "hover:text-foreground",
						onClick: () => setIsMobileMenuOpen(false),
						children: "Para escolas"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border/60 pt-4 mt-2",
				children: currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TurmaClaNavbarButton, { isMobile: true }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: currentUser.role === "professor" ? "/onboarding" : "/student/profile",
							onClick: () => setIsMobileMenuOpen(false),
							className: "flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-extrabold justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentUser.avatar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentUser.name })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								handleLogout();
								setIsMobileMenuOpen(false);
							},
							className: "w-full rounded-full border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-extrabold text-red-600 justify-center",
							children: "🚪 Sair"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						search: { mode: "register" },
						onClick: () => setIsMobileMenuOpen(false),
						className: "w-full rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground justify-center flex items-center text-center shadow-chunky",
						children: "➕ Cadastrar Novo Usuário"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						search: { mode: "login" },
						onClick: () => setIsMobileMenuOpen(false),
						className: "w-full rounded-full border border-border bg-card px-4 py-3 text-sm font-extrabold justify-center flex items-center text-center hover:bg-muted",
						children: "🔑 Login / Entrar"
					})]
				})
			})]
		})]
	});
}
function Hero({ helpMode, setHelpMode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-gradient-hero",
		children: [
			helpMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "O Hero é a introdução do site. Ele chama a atenção do usuário para começar a trilha." })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-accent/60 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-secondary/50 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl items-center gap-8 md:gap-12 px-6 py-12 md:grid-cols-2 md:py-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 text-center md:text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-neon" }), " Nova plataforma escolar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 font-display text-4xl sm:text-5xl font-extrabold leading-[1.05] text-foreground md:text-6xl",
							children: [
								"Aprender ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-rainbow bg-clip-text text-transparent",
									children: "LIBRAS"
								}),
								" virou brincadeira."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 mx-auto md:mx-0 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground",
							children: "Trilhas, avatares 3D e desafios com IA para o Ensino Fundamental sinaliza do jeito certo — e se divertir muito no caminho."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									search: { mode: "register" },
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1",
									children: "➕ Cadastrar Novo Usuário →"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									search: { mode: "login" },
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/10 bg-card px-7 py-4 text-base font-extrabold text-foreground shadow-soft transition-transform hover:-translate-y-1",
									children: "🔑 Fazer Login"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col items-center gap-1 w-full sm:w-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setHelpMode(!helpMode),
										className: `w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 px-5 py-3.5 text-sm font-extrabold shadow-soft transition-all ${helpMode ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-foreground/10 bg-muted/60 text-foreground hover:-translate-y-1"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🤔" }), " Como funciona?"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									n: "120+",
									l: "sinais animados"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block h-8 w-px bg-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									n: "2 mundos",
									l: "EF1 e EF2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block h-8 w-px bg-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									n: "IA",
									l: "corrige seu sinal"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-10 md:mt-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 rounded-[3rem] bg-gradient-rainbow opacity-20 blur-2xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative animate-float",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: luvi_mascot_default,
								alt: "Luvi, mascote tatu-bola do sinaliza mais, acenando",
								width: 1024,
								height: 1024,
								className: "mx-auto w-full max-w-xs sm:max-w-md drop-shadow-2xl"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingBadge, {
							className: "left-0 top-4 sm:top-12 rotate-[-8deg] bg-card scale-75 sm:scale-100",
							emoji: "👋",
							text: "OI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingBadge, {
							className: "right-0 top-20 sm:top-32 rotate-[6deg] bg-accent scale-75 sm:scale-100",
							emoji: "🌈",
							text: "COR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingBadge, {
							className: "bottom-0 sm:bottom-8 left-4 sm:left-8 rotate-[4deg] bg-mint scale-75 sm:scale-100",
							emoji: "🐢",
							text: "TARTARUGA"
						})
					]
				})]
			})
		]
	});
}
function Stat({ n, l }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-display text-2xl font-extrabold text-foreground",
		children: n
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wide",
		children: l
	})] });
}
function FloatingBadge({ className, emoji, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `absolute flex items-center gap-2 rounded-2xl border-2 border-foreground/10 px-4 py-2 shadow-chunky ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-2xl",
			children: emoji
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-sm font-extrabold tracking-wide",
			children: text
		})]
	});
}
function WorldsSection({ helpMode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "mundos",
		className: "relative mx-auto max-w-6xl px-6 py-24",
		children: [
			helpMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -top-4 md:top-12 left-1/2 -translate-x-1/2 z-20 animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Nesta seção mostramos que o app tem adaptações visuais e de conteúdo para diferentes faixas etárias."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sm:hidden",
							children: "Explica os 2 mundos diferentes do app."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-extrabold uppercase tracking-[0.2em] text-primary",
						children: "Dois mundos, uma linguagem"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl font-extrabold md:text-5xl",
						children: "Uma trilha certa para cada idade."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "O aluno é diagnosticado no onboarding e cai no mundo com a linguagem visual, tema e ritmo certos."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 grid gap-8 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group relative overflow-hidden rounded-4xl bg-gradient-card-ef1 p-8 shadow-chunky",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-card px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary",
								children: "EF1 · 1º ao 5º ano"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-4xl",
								children: "🌈"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 font-display text-3xl font-extrabold",
							children: "Mundo Cores & Bichos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-sm text-sm text-foreground/70",
							children: "Cartoon 3D, mascote fofo, cores saturadas e micro-vitórias a cada toque."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: luvi_mascot_default,
							alt: "Luvi",
							width: 1024,
							height: 1024,
							loading: "lazy",
							className: "mx-auto -mb-6 mt-6 w-56 transition-transform group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"Saudações",
								"Alfabeto",
								"Cores",
								"Bichos",
								"Família",
								"Escola"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-card/80 px-3 py-1 text-xs font-bold",
								children: t
							}, t))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group relative overflow-hidden rounded-4xl bg-gradient-teen p-8 text-teen-fg shadow-glow-teen",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider backdrop-blur",
								children: "EF2 · 6º ao 9º ano"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-4xl",
								children: "🎧"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 font-teen text-3xl font-bold",
							children: "Mundo Conexão"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-sm text-sm text-white/80",
							children: "Estética teen, cultura surda, gírias e gramática espacial em contexto real."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: nova_avatar_default,
							alt: "Nova",
							width: 1024,
							height: 1024,
							loading: "lazy",
							className: "mx-auto -mb-6 mt-6 w-56 transition-transform group-hover:scale-105 drop-shadow-2xl"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"Sentimentos",
								"Rotina",
								"Gírias",
								"Redes",
								"Profissões",
								"Gramática"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur",
								children: t
							}, t))
						})
					]
				})]
			})
		]
	});
}
function TrailSection({ helpMode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "trilha",
		className: "relative border-y border-border bg-muted/40 py-16 md:py-24",
		children: [helpMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute -top-4 left-1/2 -translate-x-1/2 z-20 animate-in fade-in",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Exemplo visual da trilha de aprendizado, gamificada para manter o aluno engajado." })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-6 relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-extrabold uppercase tracking-[0.2em] text-primary",
					children: "Trilha estilo Duolingo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 max-w-xl font-display text-3xl sm:text-4xl font-extrabold md:text-5xl",
					children: "Uma ilha por vez. Zero pressão, muita conquista."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-full bg-card px-5 py-3 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl",
						children: "🔥"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-extrabold",
							children: "Ofensiva de 12 dias"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Escudo de fim de semana ativo"
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-12 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: [
					{
						n: 1,
						t: "Oi, tudo bem?",
						d: "Saudações",
						c: "bg-coral",
						done: true
					},
					{
						n: 2,
						t: "A a Z",
						d: "Datilológico",
						c: "bg-sunshine",
						done: true
					},
					{
						n: 3,
						t: "1, 2, 3…",
						d: "Números",
						c: "bg-mint",
						done: true,
						current: false
					},
					{
						n: 4,
						t: "Arco-íris",
						d: "Cores",
						c: "bg-sky",
						current: true
					},
					{
						n: 5,
						t: "Zoo",
						d: "Bichos",
						c: "bg-grape text-white"
					},
					{
						n: 6,
						t: "Família",
						d: "Parentes",
						c: "bg-coral"
					},
					{
						n: 7,
						t: "Escola",
						d: "Objetos",
						c: "bg-mint"
					},
					{
						n: 8,
						t: "Boss 🎉",
						d: "Aniversário",
						c: "bg-gradient-rainbow text-white"
					}
				].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/trilha",
					search: { world: 1 },
					className: `relative flex flex-col items-start justify-between rounded-3xl p-5 shadow-chunky transition-transform hover:-translate-y-1 block h-full ${l.c} ${l.current ? "ring-4 ring-foreground/80 animate-pop" : ""} ${!l.done && !l.current ? "opacity-90" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full items-center justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 place-items-center rounded-full bg-background/40 font-display text-lg font-extrabold",
								children: l.n
							}),
							l.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: "⭐"
							}),
							l.current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-foreground px-2 py-0.5 text-[10px] font-extrabold uppercase text-background",
								children: "Aqui"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl font-extrabold",
							children: l.t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold opacity-80",
							children: l.d
						})]
					})]
				}) }, l.n))
			})]
		})]
	});
}
function GamificationSection({ helpMode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative mx-auto max-w-6xl px-6 py-24",
		children: [
			helpMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-8 left-1/2 -translate-x-1/2 z-20 animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lista dos recursos de gamificação que incentivam o uso diário do aplicativo." })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-extrabold uppercase tracking-[0.2em] text-primary",
						children: "Gamificação"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl font-extrabold md:text-5xl",
						children: "Mecânicas feitas para aprender, e não para viciar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "Reforço positivo, feedback fofo e progresso visível — sempre respeitando o ritmo da criança."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 md:grid-cols-3",
				children: [
					{
						icon: "❤️",
						title: "5 corações",
						desc: "recarregam em 4 horinhas, e sem nenhuma punição pesada.",
						tone: "bg-coral/15"
					},
					{
						icon: "🔥",
						title: "Ofensivas",
						desc: "Bônus para manter seu progresso no fim de semana.",
						tone: "bg-sunshine/25"
					},
					{
						icon: "🌟",
						title: "Estrelinhas & 💎 Cristais",
						desc: "Personalize seu Luv com estrelinhas e cristais adquiridos (EF2).",
						tone: "bg-mint/25"
					},
					{
						icon: "🏆",
						title: "Ligas semanais",
						desc: "Suba o nível da sua liga junto com o amigos.",
						tone: "bg-sky/25"
					},
					{
						icon: "🎯",
						title: "Missões diárias",
						desc: "3 missões divertidas + desafio semanal em equipe!.",
						tone: "bg-grape/25"
					},
					{
						icon: "📊",
						title: "Painel do professor",
						desc: "Mapa de dificuldades + relatórios de apredizagem e Classroom.",
						tone: "bg-accent/40"
					}
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-3xl border-2 border-foreground/5 ${i.tone} p-6 shadow-soft transition-transform hover:-translate-y-1`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-card text-3xl shadow-chunky",
							children: i.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-extrabold",
							children: i.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-foreground/70",
							children: i.desc
						})
					]
				}, i.title))
			})
		]
	});
}
function ActivitiesSection({ helpMode }) {
	const acts = [
		{
			lesson: 1,
			emoji: "🤟",
			title: "Qual é o sinal?",
			desc: "4 sinais. Selecione o correto — feedback destaca o parâmetro errado (mão, movimento, locação).",
			label: "Lição 1 · Iniciar",
			unlocked: true
		},
		{
			lesson: 2,
			emoji: "🔮",
			title: "Estoure a Bolha",
			desc: "Bolhas com sinais flutuam. Estoure a bolha que corresponde à palavra. Ritmo suave, sem game over.",
			label: "Lição 2 · Começar",
			unlocked: true
		},
		{
			lesson: 3,
			emoji: "🧩",
			title: "Tradutor de Frases",
			desc: "Arraste blocos de sinais na ordem correta em LIBRAS (Tópico-Comentário).",
			label: "Lição 3 · Avançar",
			unlocked: true
		},
		{
			lesson: 4,
			emoji: "🎭",
			title: "Desafio do Espelho",
			desc: "Webcam + IA validam configuração, ponto de articulação e movimento. Cartão de precisão com estrelas.",
			label: "Lição 4 · Jogar",
			unlocked: true
		},
		{
			lesson: 5,
			emoji: "🧏‍♂️",
			title: "Soletre em LIBRAS",
			desc: "Datilologia guiada — reproduza pela câmera ou monte arrastando cartões.",
			label: "Lição 5 · Praticar",
			unlocked: true
		},
		{
			lesson: 6,
			emoji: "🎬",
			title: "Leitura de Cena",
			desc: "Micro-histórias com sinalizantes surdos reais. Treina fluência receptiva de verdade.",
			label: "Lição 6 · Assistir",
			unlocked: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "jogos",
		className: "relative border-y border-border bg-teen-bg py-20 text-teen-fg",
		children: [helpMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-in fade-in",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Demonstra as diferentes atividades e minigames que o aluno encontrará nas lições." })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-6 relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold uppercase tracking-[0.2em] text-neon",
							children: "6 formatos interativos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-teen text-4xl font-bold md:text-5xl",
							children: "Aprenda jogando."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-white/70",
							children: "Avatares 3D com controle de velocidade (0.5x / 1x) e ângulo (frontal/lateral)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-white/70",
							children: "Essencial para aprender a sinalização."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
					children: acts.map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/licao",
						search: { nodeId: a.lesson },
						className: "group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:-translate-y-2 hover:bg-white/10 hover:border-white/25 hover:shadow-glow-teen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon",
						"aria-label": `${a.title} — ${a.label}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute right-4 top-4 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white/60",
								children: ["#", a.lesson]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-rainbow text-3xl shadow-glow-teen transition-transform group-hover:scale-110",
								children: a.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-teen text-xl font-bold",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 flex-1 text-sm leading-relaxed text-white/70",
								children: a.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 rounded-full bg-neon/20 px-4 py-1.5 text-xs font-extrabold text-neon ring-1 ring-neon/40 transition-all group-hover:bg-neon group-hover:text-teen-bg group-hover:ring-neon",
									children: [a.label, " →"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: acts.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-neon" : i < idx ? "w-1.5 bg-white/40" : "w-1.5 bg-white/15"}` }, i))
								})]
							})
						]
					}, a.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/licao",
						search: { nodeId: 1 },
						className: "inline-flex items-center gap-2 rounded-full bg-neon px-8 py-4 font-teen text-base font-bold text-teen-bg shadow-glow-teen transition-transform hover:-translate-y-1 active:scale-95",
						children: "▶ Começar pela Lição 1"
					})
				})
			]
		})]
	});
}
function LessonCTA({ helpMode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "escolas",
		className: "relative mx-auto max-w-6xl px-6 py-24",
		children: [helpMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-8 left-1/2 -translate-x-1/2 z-20 animate-in fade-in",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-full bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chamada para ação final (CTA) incentivando escolas e alunos a começarem a usar." })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-4xl bg-gradient-rainbow p-10 shadow-chunky md:p-16 z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-center gap-10 md:grid-cols-[1.4fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl sm:text-4xl font-extrabold leading-tight text-white md:text-5xl text-center md:text-left",
							children: "Desafio de 3 minutos com o Luvi."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-lg text-base sm:text-lg text-white/90 text-center md:text-left mx-auto md:mx-0",
							children: "Cores em LIBRAS, 5 telas rápidas para aprender."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { mode: "register" },
								className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-4 text-base font-extrabold text-background shadow-chunky transition-transform hover:-translate-y-1",
								children: "➕ Cadastrar Novo Usuário →"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { mode: "login" },
								className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-7 py-4 text-base font-extrabold text-white backdrop-blur transition-transform hover:-translate-y-1",
								children: "🔑 Fazer Login →"
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: luvi_mascot_default,
							alt: "",
							width: 1024,
							height: 1024,
							loading: "lazy",
							className: "mx-auto w-64 animate-bounce-soft drop-shadow-2xl",
							"aria-hidden": true
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { LandingPage as component };
