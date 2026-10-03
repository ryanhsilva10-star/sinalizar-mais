import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as syncClassroomsFromSupabase, d as getActiveUser, j as addAlunoToSalaInSupabase, p as getClassroomByCode, y as joinClassroom } from "./router-Bs2xLfcW.mjs";
import { P as ArrowRight, c as Sparkles, t as X } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JoinClassroomModal-B86AgKo7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function JoinClassroomModal({ open, onOpenChange, onSuccess }) {
	const navigate = useNavigate();
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(null);
		const trimmed = code.trim().toUpperCase();
		if (!trimmed) {
			setErrorMessage("Por favor, digite o código da sala de aula.");
			toast.error("Digite o código da sala de aula.");
			return;
		}
		if (trimmed.length < 3) {
			setErrorMessage("O código precisa ter pelo menos 3 caracteres.");
			toast.error("O código precisa ter pelo menos 3 caracteres.");
			return;
		}
		const user = getActiveUser();
		if (!user) {
			toast.error("Você precisa estar conectado como aluno para ingressar.");
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
			if (!classroom) {
				const err = `Código "${trimmed}" não encontrado. Verifique com seu professor!`;
				setErrorMessage(err);
				toast.error(err);
				setLoading(false);
				return;
			}
			const res = joinClassroom(user.id, trimmed);
			setLoading(false);
			if (res.success) {
				toast.success(res.message);
				setCode("");
				onOpenChange(false);
				if (onSuccess) onSuccess();
				navigate({ to: "/turma" });
			} else {
				setErrorMessage(res.message);
				toast.error(res.message);
			}
		} catch (err) {
			setLoading(false);
			toast.error(err.message || "Erro ao ingressar na sala.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[92vw] sm:max-w-md rounded-3xl border-2 border-primary/30 bg-card p-0 overflow-hidden shadow-2xl animate-fade-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-gradient-rainbow px-6 pt-8 pb-6 text-center text-white relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm shadow-lg animate-bounce-soft",
					children: "🛡️"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-2xl font-extrabold text-white",
					children: "Entrar na sua Turma / Clã"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-white/95 font-medium",
					children: "Digite o código fornecido pelo seu professor para desbloquear o painel colaborativo do seu Clã!"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "classroom-code-input",
						className: "block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5",
						children: "Código da Sala / Turma:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "classroom-code-input",
						type: "text",
						value: code,
						onChange: (e) => {
							setCode(e.target.value.toUpperCase());
							if (errorMessage) setErrorMessage(null);
						},
						placeholder: "Ex: LIBRAS2026",
						maxLength: 12,
						autoFocus: true,
						className: `w-full rounded-2xl border-2 bg-background px-4 py-3.5 text-center font-mono text-lg font-black tracking-widest uppercase outline-none transition-all ${errorMessage ? "border-red-500 bg-red-500/5 focus:border-red-600" : "border-border focus:border-primary focus:ring-4 focus:ring-primary/20"}`
					}),
					errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs font-bold text-red-500 text-center animate-shake",
						children: ["⚠️ ", errorMessage]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[11px] text-muted-foreground text-center",
						children: "💡 Peça o código ao seu professor de LIBRAS para ingressar na turma."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Conectando..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ingressar na Turma" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onOpenChange(false),
						className: "w-full rounded-full border border-border py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
						children: "Cancelar"
					})]
				})]
			})]
		})
	});
}
//#endregion
export { DialogTitle as a, DialogHeader as i, DialogContent as n, JoinClassroomModal as o, DialogDescription as r, Dialog as t };
