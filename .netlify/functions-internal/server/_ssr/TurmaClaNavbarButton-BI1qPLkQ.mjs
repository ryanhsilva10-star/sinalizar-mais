import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as syncClassroomsFromSupabase, b as leaveClassroom, d as getActiveUser, j as addAlunoToSalaInSupabase, k as subscribeToUserChanges, p as getClassroomByCode, y as joinClassroom } from "./router-Bs2xLfcW.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as JoinClassroomModal, r as DialogDescription, t as Dialog } from "./JoinClassroomModal-B86AgKo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TurmaClaNavbarButton-BI1qPLkQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JoinClassroomFab() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const user = getActiveUser();
	if (!user || user.role !== "aluno") return null;
	const currentClassroom = user.classroomCode ? getClassroomByCode(user.classroomCode) : null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		const trimmed = code.trim().toUpperCase();
		if (!trimmed) {
			toast.error("Digite o código da sala.");
			return;
		}
		if (trimmed.length < 3) {
			toast.error("O código deve ter pelo menos 3 caracteres.");
			return;
		}
		setLoading(true);
		try {
			let classroom = getClassroomByCode(trimmed);
			if (!classroom) {
				await syncClassroomsFromSupabase();
				classroom = getClassroomByCode(trimmed);
			}
			if (!classroom) {
				if ((await addAlunoToSalaInSupabase(user.id, trimmed)).success) {
					await syncClassroomsFromSupabase();
					classroom = getClassroomByCode(trimmed);
				}
			}
			const res = joinClassroom(user.id, trimmed);
			setLoading(false);
			if (res.success) {
				toast.success(res.message);
				setCode("");
				setOpen(false);
			} else toast.error(res.message);
		} catch (err) {
			setLoading(false);
			toast.error(err.message || "Erro ao entrar na sala.");
		}
	};
	const handleLeave = () => {
		if (!user.classroomCode) return;
		leaveClassroom(user.id);
		toast.info("Você saiu da sala de aula.");
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		id: "join-classroom-fab",
		onClick: () => setOpen(true),
		"aria-label": "Entrar em uma sala",
		title: "Entrar em uma Sala de Aula",
		className: "fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full\r\n          bg-gradient-rainbow text-3xl text-white shadow-glow-teen\r\n          transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95\r\n          animate-bounce-soft md:bottom-8 md:right-8",
		style: { animationDuration: "2.8s" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-2xl",
			children: "🏫"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[90vw] sm:max-w-sm rounded-3xl border-2 border-primary/20 bg-card p-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-gradient-rainbow px-6 pt-8 pb-6 text-center text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm shadow-lg",
					children: "🏫"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-2xl font-extrabold text-white",
					children: "Sala de Aula"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-white/90",
					children: "Peça o código para o seu professor e digite abaixo para se conectar."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 pb-6 pt-4",
				children: [user.classroomCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase",
								children: "✓ Conectado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 font-display text-sm font-extrabold text-foreground",
								children: currentClassroom ? currentClassroom.name : `Sala: ${user.classroomCode}`
							}),
							currentClassroom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: ["🧑‍🏫 ", currentClassroom.teacherName]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-[11px] font-bold text-primary",
								children: ["Código: ", user.classroomCode]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleLeave,
							className: "rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-extrabold text-red-600 hover:bg-red-500/20 transition-colors",
							children: "Sair"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "classroom-code-input",
							className: "mb-2 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground",
							children: user.classroomCode ? "Trocar de código de sala" : "Código fornecido pelo professor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "classroom-code-input",
							type: "text",
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "Ex: LIBRAS2026",
							maxLength: 20,
							autoFocus: true,
							className: "w-full rounded-xl border-2 border-border bg-background px-4 py-3.5\r\n                  text-center font-display text-xl font-extrabold tracking-[0.15em] text-foreground\r\n                  placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-body placeholder:text-sm\r\n                  focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30\r\n                  transition-all uppercase"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading || !code.trim(),
							className: "mt-4 flex w-full items-center justify-center gap-2 rounded-full\r\n                  bg-primary px-6 py-3.5 font-display text-base font-extrabold text-primary-foreground\r\n                  shadow-chunky transition-all\r\n                  hover:-translate-y-0.5 hover:shadow-lg\r\n                  active:translate-y-0 active:scale-[0.98]\r\n                  disabled:opacity-50 disabled:pointer-events-none",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Localizando sala…" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🚀" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: user.classroomCode ? "Mudar de sala" : "Entrar na sala" })] })
						})
					]
				})]
			})]
		})
	})] });
}
function LoadingSpinner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "h-5 w-5 animate-spin",
		viewBox: "0 0 24 24",
		fill: "none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			className: "opacity-25",
			cx: "12",
			cy: "12",
			r: "10",
			stroke: "currentColor",
			strokeWidth: "4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			className: "opacity-75",
			fill: "currentColor",
			d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
		})]
	});
}
function TurmaClaNavbarButton({ className = "", isMobile = false }) {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = (0, import_react.useState)(() => getActiveUser());
	const [isJoinModalOpen, setIsJoinModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsubscribe = subscribeToUserChanges(() => {
			setCurrentUser(getActiveUser());
		});
		return () => unsubscribe();
	}, []);
	if (!currentUser || currentUser.role !== "aluno") return null;
	const hasClassroom = !!currentUser.classroomCode && !!getClassroomByCode(currentUser.classroomCode);
	const handleClick = () => {
		if (hasClassroom) navigate({ to: "/turma" });
		else setIsJoinModalOpen(true);
	};
	if (isMobile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: handleClick,
		className: `w-full rounded-full border-2 border-primary/40 bg-primary/10 px-4 py-3 text-sm font-extrabold text-primary justify-center flex items-center gap-2 hover:bg-primary/20 transition-all ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lg",
				children: "🛡️"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Turma/Clã" }),
			hasClassroom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinClassroomModal, {
		open: isJoinModalOpen,
		onOpenChange: setIsJoinModalOpen,
		onSuccess: () => setCurrentUser(getActiveUser())
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: handleClick,
		className: `inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-xs font-extrabold transition-all shadow-sm ${hasClassroom ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 active:scale-95" : "border-primary/30 bg-card text-foreground hover:border-primary hover:bg-primary/5 hover:scale-105 active:scale-95"} ${className}`,
		title: hasClassroom ? `Acessar meu Clã / Turma (${currentUser.classroomCode})` : "Entrar em uma Turma / Clã com código",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: "🛡️"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Turma/Clã" }),
			hasClassroom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-0.5",
				title: "Turma Ativa"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px] font-black text-primary uppercase",
				children: "Novo"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinClassroomModal, {
		open: isJoinModalOpen,
		onOpenChange: setIsJoinModalOpen,
		onSuccess: () => setCurrentUser(getActiveUser())
	})] });
}
//#endregion
export { TurmaClaNavbarButton as n, JoinClassroomFab as t };
