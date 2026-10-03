import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as leaveClassroom, d as getActiveUser, f as getClassroomAggregatedDashboard, k as subscribeToUserChanges } from "./router-Bs2xLfcW.mjs";
import { F as ArrowLeft, N as Award, O as CircleCheck, P as ArrowRight, b as LogOut, c as Sparkles, f as RotateCw, l as Shield, r as Users, w as Flame } from "../_libs/lucide-react.mjs";
import { t as Footer } from "./Footer-BHVuZYSJ.mjs";
import { o as JoinClassroomModal } from "./JoinClassroomModal-B86AgKo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/turma-D8xpeISS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TurmaDashboardPage() {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = (0, import_react.useState)(() => getActiveUser());
	const [dashboardData, setDashboardData] = (0, import_react.useState)(null);
	const [isJoinModalOpen, setIsJoinModalOpen] = (0, import_react.useState)(false);
	const [isLeaveModalOpen, setIsLeaveModalOpen] = (0, import_react.useState)(false);
	const [filterWorld, setFilterWorld] = (0, import_react.useState)("all");
	const refreshData = () => {
		const user = getActiveUser();
		setCurrentUser(user);
		if (!user) {
			toast.error("🔒 Faça login como aluno para acessar o painel da Turma/Clã.");
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		if (user.role === "professor") {
			toast.info("Professores gerenciam as turmas através do Onboarding.");
			navigate({
				to: "/onboarding",
				replace: true
			});
			return;
		}
		if (user.classroomCode) {
			const data = getClassroomAggregatedDashboard(user.classroomCode, user.id);
			setDashboardData(data);
		} else setDashboardData(null);
	};
	(0, import_react.useEffect)(() => {
		refreshData();
		const unsubscribe = subscribeToUserChanges(() => {
			refreshData();
		});
		return () => unsubscribe();
	}, [navigate]);
	const handleConfirmLeave = () => {
		if (!currentUser) return;
		leaveClassroom(currentUser.id);
		setIsLeaveModalOpen(false);
		toast.info("Você saiu da turma.");
		refreshData();
	};
	if (!currentUser) return null;
	if (!currentUser.classroomCode || !dashboardData) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border/50 bg-background/80 backdrop-blur-md py-4 px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/trilha",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft",
							children: "S"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-extrabold",
							children: "sinaliza mais"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/trilha",
						className: "inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-1.5 text-xs font-extrabold hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Voltar para a Trilha" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-lg w-full px-4 py-16 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border-2 border-dashed border-primary/40 bg-card p-8 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-5xl shadow-inner animate-bounce-soft",
							children: "🛡️"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl sm:text-3xl font-extrabold text-foreground",
							children: "Você ainda não entrou em uma Turma/Clã"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground leading-relaxed",
							children: "Junte-se à sua turma de LIBRAS para acompanhar o progresso coletivo das lições e somar pontos de XP com seus colegas!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsJoinModalOpen(true),
							className: "mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Digitar Código da Turma" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5" })
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinClassroomModal, {
				open: isJoinModalOpen,
				onOpenChange: setIsJoinModalOpen,
				onSuccess: refreshData
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const { classroom, activities, totalMembers, clanTotalXp, clanAverageLevel, clanOverallCompletionRate, myOverallCompletionRate, myCompletedCount } = dashboardData;
	const filteredActivities = activities.filter((act) => {
		if (filterWorld === "world1") return act.world === 1;
		if (filterWorld === "world2") return act.world === 2;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground transition-colors duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-rainbow text-lg font-black text-white shadow-soft",
							children: "S"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-extrabold",
							children: "sinaliza mais"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/trilha",
							className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-extrabold hover:bg-muted transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trilha de Sinais" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/student/profile",
							className: "flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-extrabold hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentUser.avatar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: currentUser.name
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-8 animate-fade-in",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8 shadow-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row md:items-center justify-between gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-rainbow text-3xl text-white shadow-chunky",
									children: "🛡️"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary/15 px-3 py-0.5 text-[10px] font-black uppercase text-primary tracking-wider",
											children: "Turma / Clã Oficial"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground font-mono",
											children: ["Código: ", classroom.code]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-1 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground",
										children: classroom.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🧑‍🏫 Mentor(a): ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: classroom.teacherName
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📚 ", classroom.discipline || "LIBRAS & Inclusão"] })
										]
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsLeaveModalOpen(true),
								className: "inline-flex items-center gap-1.5 self-start md:self-center rounded-2xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors",
								title: "Sair desta sala",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sair da Turma" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-muted/50 p-3.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground block",
										children: "Membros do Clã"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 font-display text-xl sm:text-2xl font-black text-foreground flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: totalMembers })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-muted/50 p-3.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground block",
										children: "XP Coletivo da Turma"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 font-display text-xl sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: clanTotalXp })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-muted/50 p-3.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground block",
										children: "Média Geral da Turma"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 font-display text-xl sm:text-2xl font-black text-indigo-500 dark:text-indigo-400 flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [clanOverallCompletionRate, "%"] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-primary/10 border border-primary/20 p-3.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase tracking-wider text-primary block",
										children: "Meu Progresso Geral"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 font-display text-xl sm:text-2xl font-black text-primary flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [myOverallCompletionRate, "%"] })]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Privacidade Garantida:" }),
							" Em conformidade com as regras da turma, você visualiza apenas as ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "médias coletivas agregadas" }),
							" da sala. Nomes, notas individuais e informações de colegas nunca são revelados."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-extrabold flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📜 Painel de Progresso das Atividades" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Compare seu progresso individual com a média de conclusão geral da turma em cada lição."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-2xl bg-muted/60 p-1 shadow-inner gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFilterWorld("all"),
									className: `rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${filterWorld === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [
										"Todas (",
										activities.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFilterWorld("world1"),
									className: `rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${filterWorld === "world1" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: "🦊 Mundo 1 (12)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFilterWorld("world2"),
									className: `rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${filterWorld === "world2" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: "🚀 Mundo 2 (12)"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: filteredActivities.map((act) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between rounded-3xl border-2 border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-2xl shadow-inner shrink-0",
											children: act.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-black uppercase tracking-wider text-muted-foreground",
												children: [
													"Fase ",
													act.nodeId,
													" • ",
													act.world === 1 ? "Mundo 1 (EF1)" : "Mundo 2 (EF2)"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-base font-extrabold text-foreground leading-snug",
												children: act.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground line-clamp-1",
												children: act.subtitle
											})
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${act.kind === "chefe" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : act.kind === "espelho" ? "bg-purple-500/20 text-purple-600 dark:text-purple-400" : act.kind === "revisao" ? "bg-sky-500/20 text-sky-600 dark:text-sky-400" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`,
										children: act.kind === "chefe" ? "Chefe" : act.kind === "espelho" ? "Espelho IA" : act.kind === "revisao" ? "Revisão" : "Micro-lição"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-3 rounded-2xl bg-muted/30 p-3.5 border border-border/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-extrabold flex items-center gap-1 text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👤" }), " Meu Progresso:"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-black text-xs ${act.myCompleted ? "text-emerald-500" : "text-muted-foreground"}`,
											children: act.myCompleted ? `Concluído (${act.myScore}%)` : "Pendente (0%)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2.5 w-full overflow-hidden rounded-full bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-full rounded-full transition-all duration-500 ${act.myCompleted ? "bg-emerald-500" : "bg-muted-foreground/20"}`,
											style: { width: `${act.myCompleted ? act.myScore : 0}%` }
										})
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-extrabold flex items-center gap-1 text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👥" }), " Progresso da Turma:"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-black text-xs text-indigo-500 dark:text-indigo-400",
												children: [act.turmaCompletionPercentage, "% da turma concluiu"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2.5 w-full overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500",
												style: { width: `${act.turmaCompletionPercentage}%` }
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-1 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Aproveitamento médio dos colegas:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-foreground",
												children: [act.turmaAverageScore, "%"]
											})]
										})
									] })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 pt-3 border-t border-border/60 flex items-center justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/licao",
										search: { nodeId: act.nodeId },
										className: `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-transform hover:-translate-y-0.5 active:translate-y-0.5 shadow-soft ${act.myCompleted ? "border border-border bg-background hover:bg-muted text-foreground" : "bg-primary text-primary-foreground shadow-chunky"}`,
										children: act.myCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Praticar Novamente" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Iniciar Atividade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })] })
									})
								})]
							}, `${act.world}-${act.nodeId}`);
						})
					})
				]
			}),
			isLeaveModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-3xl text-red-500",
							children: "⚠️"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 font-display text-2xl font-extrabold",
							children: "Sair da Turma/Clã?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								"Tem certeza que deseja sair da turma ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground",
									children: [
										"\"",
										classroom.name,
										"\""
									]
								}),
								"? Você poderá ingressar novamente mais tarde com o código da sala."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsLeaveModalOpen(false),
								className: "w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleConfirmLeave,
								className: "w-1/2 rounded-full bg-red-600 py-3 font-display text-sm font-extrabold text-white shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
								children: "Sim, Sair 🚪"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { TurmaDashboardPage as component };
