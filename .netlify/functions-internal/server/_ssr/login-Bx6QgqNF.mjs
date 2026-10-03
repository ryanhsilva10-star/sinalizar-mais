import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as loginWithSupabase, I as registerWithSupabase, N as fetchProfileFromSupabase, O as saveUser, P as isSupabaseConfigured, d as getActiveUser, r as Route$4, x as loginUser } from "./router-Bs2xLfcW.mjs";
import { t as Footer } from "./Footer-BHVuZYSJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Bx6QgqNF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var USER_AVATARS = [
	{
		icon: "🦊",
		label: "Luvi Raposa"
	},
	{
		icon: "🚀",
		label: "Nova Astro"
	},
	{
		icon: "🧑‍🏫",
		label: "Professor(a)"
	},
	{
		icon: "🐼",
		label: "Panda Sinais"
	},
	{
		icon: "🦁",
		label: "Leão Corajoso"
	},
	{
		icon: "🦉",
		label: "Coruja Sábia"
	},
	{
		icon: "👾",
		label: "Gamer Teen"
	}
];
function LoginPage() {
	const navigate = useNavigate();
	const search = Route$4.useSearch();
	const [mode, setMode] = (0, import_react.useState)(search.mode || "login");
	(0, import_react.useEffect)(() => {
		if (search.mode) setMode(search.mode);
	}, [search.mode]);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [accountRole, setAccountRole] = (0, import_react.useState)("aluno");
	const [name, setName] = (0, import_react.useState)("");
	const [discipline, setDiscipline] = (0, import_react.useState)("");
	const [world, setWorld] = (0, import_react.useState)("ef1");
	const [selectedAvatar, setSelectedAvatar] = (0, import_react.useState)("🦊");
	const [classroomCode, setClassroomCode] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const current = getActiveUser();
		if (current) {
			if (current.role === "professor") navigate({
				to: "/onboarding",
				replace: true
			});
			else navigate({
				to: "/trilha",
				replace: true
			});
		}
	}, [navigate]);
	const handleLoginSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim()) {
			toast.error("Por favor, informe seu e-mail.");
			return;
		}
		let supabaseAuthSucceeded = false;
		if (isSupabaseConfigured()) try {
			const authUser = await loginWithSupabase({
				email,
				password
			});
			if (authUser) {
				supabaseAuthSucceeded = true;
				const profile = await fetchProfileFromSupabase(authUser.id, authUser.email, authUser.user_metadata);
				if (profile) saveUser({
					...profile,
					password,
					id: authUser.id
				});
				else {
					const meta = authUser.user_metadata || {};
					saveUser({
						id: authUser.id,
						email: authUser.email,
						name: meta.name || "Usuário",
						role: meta.role || "aluno",
						world: meta.world || "ef1",
						avatar: meta.avatar || "🦊",
						discipline: meta.discipline,
						classroomCode: meta.classroom_code,
						streak: meta.streak ?? 1,
						lives: meta.lives ?? 5,
						lastStreakDate: meta.lastStreakDate || meta.last_streak_date,
						xp: meta.xp ?? 100,
						level: meta.level ?? 1,
						password
					});
				}
			}
		} catch (err) {
			console.warn("[Login] Supabase auth attempt notice:", err?.message || err);
		}
		const user = supabaseAuthSucceeded ? loginUser(email) : loginUser(email, password);
		if (!user) {
			if (supabaseAuthSucceeded) toast.error("Perfil não encontrado localmente. Tente novamente.");
			else toast.error("Credenciais inválidas ou usuário não encontrado. Verifique seu e-mail e senha.");
			return;
		}
		if (user.role === "professor") {
			toast.success(`Bem-vindo(a) de volta, Professor(a) ${user.name}!`);
			navigate({
				to: "/onboarding",
				replace: true
			});
		} else {
			toast.success(`Bem-vindo(a) de volta, ${user.name}! 🎉`);
			navigate({
				to: "/trilha",
				replace: true
			});
		}
	};
	const handleRegisterSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim() || !email.trim()) {
			toast.error("Por favor, preencha o nome e o e-mail.");
			return;
		}
		try {
			let authUserId;
			if (isSupabaseConfigured()) try {
				const authUser = await registerWithSupabase({
					email,
					password,
					name,
					role: accountRole,
					world,
					avatar: selectedAvatar,
					discipline,
					classroomCode
				});
				if (authUser?.id) authUserId = authUser.id;
			} catch (supabaseErr) {
				console.warn("[Register] Supabase sign up notice:", supabaseErr?.message || supabaseErr);
			}
			if (accountRole === "aluno") {
				const saved = saveUser({
					id: authUserId,
					name,
					email,
					password,
					role: "aluno",
					world,
					avatar: selectedAvatar,
					classroomCode: classroomCode.trim().toUpperCase() || void 0,
					level: 1,
					xp: 100,
					streak: 1,
					lives: 5,
					lastStreakDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					completedLessons: []
				});
				loginUser(saved.email, saved.password);
				toast.success(`Conta de Aluno criada com sucesso! Bem-vindo(a), ${saved.name}! 🚀`);
				navigate({
					to: "/trilha",
					replace: true
				});
			} else {
				const saved = saveUser({
					id: authUserId,
					name,
					email,
					password,
					role: "professor",
					discipline: discipline.trim() || "LIBRAS & Inclusão",
					world,
					avatar: selectedAvatar
				});
				loginUser(saved.email, saved.password);
				toast.success(`Conta de Professor(a) criada com sucesso! Bem-vindo(a), ${saved.name}. 🎉`);
				navigate({
					to: "/onboarding",
					replace: true
				});
			}
		} catch (error) {
			toast.error(error.message || "Ocorreu um erro ao criar a conta.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border/50 bg-background/80 backdrop-blur-md py-4 px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between",
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/trilha",
						className: "rounded-full border border-border px-4 py-2 text-xs font-extrabold hover:bg-muted transition-colors",
						children: "🗺️ Trilha Pública de Sinais"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-md w-full px-4 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-2xl bg-muted/60 p-1 shadow-inner w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMode("login"),
								className: `w-1/2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition-all ${mode === "login" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`,
								children: "🔑 Entrar / Login"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMode("register"),
								className: `w-1/2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition-all ${mode === "register" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`,
								children: "➕ Cadastrar Usuário"
							})]
						})
					}), mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-2xl mb-3 shadow-inner",
									children: "🔑"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold uppercase tracking-widest text-primary",
									children: "Identificação do Usuário"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-1 font-display text-3xl font-extrabold",
									children: "Acessar Conta"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: "Entre com seu e-mail e senha de aluno ou professor para acessar seu painel."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleLoginSubmit,
							className: "mt-6 flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "E-mail do Usuário"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "seu.email@exemplo.com",
									required: true,
									className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Senha"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••",
									className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "mt-2 w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5",
									children: "Entrar na Conta →"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 border-t border-border/60 pt-4 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Ainda não tem conta?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMode("register"),
										className: "font-extrabold text-primary hover:underline cursor-pointer",
										children: "Cadastre-se gratuitamente agora →"
									})
								]
							})
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold uppercase tracking-widest text-primary",
									children: "Novo Cadastro"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-1 font-display text-3xl font-extrabold",
									children: "Criar Nova Conta"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: "Escolha o tipo de perfil e cadastre-se para aprender ou ensinar LIBRAS."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground text-center",
								children: "Sou um(a):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setAccountRole("aluno");
										setSelectedAvatar("🦊");
									},
									className: `flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${accountRole === "aluno" ? "border-primary bg-primary/10 shadow-soft scale-[1.02]" : "border-border bg-background hover:bg-muted/50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: "🎓"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 font-display font-extrabold text-sm",
										children: "Aluno(a)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setAccountRole("professor");
										setSelectedAvatar("🧑‍🏫");
									},
									className: `flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${accountRole === "professor" ? "border-primary bg-primary/10 shadow-soft scale-[1.02]" : "border-border bg-background hover:bg-muted/50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: "🧑‍🏫"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 font-display font-extrabold text-sm",
										children: "Professor(a)"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleRegisterSubmit,
							className: "mt-4 flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Escolha seu Avatar:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap justify-center gap-2",
									children: USER_AVATARS.map((av) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSelectedAvatar(av.icon),
										className: `flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition-all ${selectedAvatar === av.icon ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110 shadow-md" : "bg-muted hover:bg-muted/80"}`,
										title: av.label,
										children: av.icon
									}, av.icon))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Nome Completo *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: accountRole === "aluno" ? "Ex: Luizinho Silva" : "Ex: Profe. Helena Silva",
									required: true,
									className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
								})] }),
								accountRole === "professor" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Disciplina / Área *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: discipline,
									onChange: (e) => setDiscipline(e.target.value),
									placeholder: "Ex: LIBRAS & Inclusão",
									required: true,
									className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Trilha de Ensino / Nível:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWorld("ef1"),
										className: `rounded-xl border-2 py-2 px-3 text-xs font-extrabold transition-all ${world === "ef1" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
										children: "🌈 EF1 (1º ao 5º Ano)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWorld("ef2"),
										className: `rounded-xl border-2 py-2 px-3 text-xs font-extrabold transition-all ${world === "ef2" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
										children: "🚀 EF2 (6º ao 9º Ano)"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "E-mail *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "usuario@exemplo.com",
									required: true,
									className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Senha"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••",
									className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "mt-2 w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5",
									children: accountRole === "aluno" ? "Cadastrar Aluno e Começar →" : "Criar Conta de Professor →"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 border-t border-border/60 pt-4 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Já possui uma conta?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMode("login"),
										className: "font-extrabold text-primary hover:underline cursor-pointer",
										children: "Fazer Login →"
									})
								]
							})
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { LoginPage as component };
