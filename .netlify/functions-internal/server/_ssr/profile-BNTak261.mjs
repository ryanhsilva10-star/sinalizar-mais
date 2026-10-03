import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as syncClassroomsFromSupabase, O as saveUser, S as logoutUser, T as regenerateLives, b as leaveClassroom, d as getActiveUser, p as getClassroomByCode, w as onUserChange, y as joinClassroom } from "./router-Bs2xLfcW.mjs";
import { t as Footer } from "./Footer-BHVuZYSJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BNTak261.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AVATARS = [
	{
		icon: "🦊",
		label: "Luvi Raposa"
	},
	{
		icon: "🚀",
		label: "Nova Astro"
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
function StudentProfilePage() {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [roomCodeInput, setRoomCodeInput] = (0, import_react.useState)("");
	const [isJoiningRoom, setIsJoiningRoom] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [birthDate, setBirthDate] = (0, import_react.useState)("");
	const [document, setDocument] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [world, setWorld] = (0, import_react.useState)("ef1");
	const [avatar, setAvatar] = (0, import_react.useState)("🦊");
	(0, import_react.useEffect)(() => {
		let active = getActiveUser();
		if (!active) {
			toast.error("Sessão não encontrada. Por favor, faça login.");
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		if (active.role === "professor") {
			toast.info("Perfil de Professor detectado. Redirecionando para o Onboarding.");
			navigate({
				to: "/onboarding",
				replace: true
			});
			return;
		}
		const { lives: regLives, lastLiveLostAt: regLast } = regenerateLives(active);
		if (regLives !== active.lives) active = saveUser({
			...active,
			lives: regLives,
			lastLiveLostAt: regLast
		});
		setCurrentUser(active);
		setName(active.name);
		setEmail(active.email);
		setPhone(active.phone || "");
		setBirthDate(active.birthDate || "");
		setDocument(active.document || "");
		setAddress(active.address || "");
		setWorld(active.world || "ef1");
		setAvatar(active.avatar || "🦊");
		const unsub = onUserChange(() => {
			const refreshed = getActiveUser();
			if (refreshed) setCurrentUser(refreshed);
		});
		return () => unsub();
	}, [navigate]);
	const handleLogout = () => {
		logoutUser();
		toast.info("Sessão encerrada com sucesso.");
		navigate({
			to: "/login",
			replace: true
		});
	};
	const handleJoinClassroom = async (e) => {
		e.preventDefault();
		if (!currentUser) return;
		const trimmed = roomCodeInput.trim().toUpperCase();
		if (!trimmed) {
			toast.error("Informe o código da sala.");
			return;
		}
		setIsJoiningRoom(true);
		try {
			let classroom = getClassroomByCode(trimmed);
			if (!classroom) {
				await syncClassroomsFromSupabase();
				classroom = getClassroomByCode(trimmed);
			}
			const res = joinClassroom(currentUser.id, trimmed);
			setIsJoiningRoom(false);
			if (res.success) {
				toast.success(res.message);
				setRoomCodeInput("");
				const refreshed = getActiveUser();
				if (refreshed) setCurrentUser(refreshed);
			} else toast.error(res.message);
		} catch (err) {
			setIsJoiningRoom(false);
			toast.error(err.message || "Erro ao entrar na sala.");
		}
	};
	const handleLeaveClassroom = () => {
		if (!currentUser) return;
		leaveClassroom(currentUser.id);
		toast.info("Você saiu da sala de aula.");
		const refreshed = getActiveUser();
		if (refreshed) setCurrentUser(refreshed);
	};
	const handleSaveProfile = (e) => {
		e.preventDefault();
		if (!currentUser) return;
		if (!name.trim() || !email.trim()) {
			toast.error("Nome e E-mail são obrigatórios.");
			return;
		}
		try {
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
				streak: currentUser.streak,
				lives: currentUser.lives,
				lastStreakDate: currentUser.lastStreakDate,
				lastLiveLostAt: currentUser.lastLiveLostAt,
				xp: currentUser.xp,
				level: currentUser.level,
				completedLessons: currentUser.completedLessons
			});
			setCurrentUser(updated);
			toast.success("Seus dados cadastrais foram atualizados com sucesso! 🎉");
		} catch (err) {
			console.error(err);
			toast.error("Erro ao atualizar os dados do perfil.");
		}
	};
	if (!currentUser) return null;
	const currentClassroom = currentUser.classroomCode ? getClassroomByCode(currentUser.classroomCode) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `min-h-screen transition-colors duration-300 ${world === "ef2" ? "bg-slate-950 text-slate-100" : "bg-background text-foreground"}`,
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
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: currentUser.avatar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden text-left md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-extrabold leading-none",
									children: currentUser.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: ["🎒 Aluno • Nível ", currentUser.level]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/trilha",
								className: "rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-xs font-extrabold hover:bg-primary/20",
								children: "🗺️ Ir para a Trilha"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleLogout,
								className: "rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors",
								title: "Encerrar sessão completamente",
								children: "🚪 Sair / Log-off"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 rounded-3xl border border-border bg-card p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-16 w-16 place-items-center rounded-2xl bg-muted text-4xl shadow-inner",
							children: avatar
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400",
								children: "Conta de Aluno"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: email
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs w-full md:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-muted/50 px-3.5 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold uppercase text-muted-foreground",
									children: "Nível"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-extrabold text-base",
									children: currentUser.level ?? 1
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-muted/50 px-3.5 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold uppercase text-muted-foreground",
									children: "XP"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-extrabold text-base text-amber-500",
									children: ["⚡ ", currentUser.xp ?? 0]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-muted/50 px-3.5 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold uppercase text-muted-foreground",
									children: "Ofensiva"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-extrabold text-base text-rose-500",
									children: [
										"🔥 ",
										currentUser.streak ?? 1,
										"d"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-muted/50 px-3.5 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold uppercase text-muted-foreground",
									children: "Vidas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-extrabold text-base text-red-500",
									children: [
										"❤️ ",
										currentUser.lives ?? 5,
										"/5"
									]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 md:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-border/60 pb-4 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-extrabold",
									children: "Gerenciar Meu Perfil"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Atualize suas informações cadastrais. Os dados salvos são atualizados instantaneamente."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSaveProfile,
								className: "flex flex-col gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Avatar:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: AVATARS.map((av) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setAvatar(av.icon),
											className: `flex h-11 w-11 items-center justify-center rounded-2xl text-2xl transition-all ${avatar === av.icon ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-105" : "bg-muted hover:bg-muted/80"}`,
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
										required: true,
										className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "E-mail *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										required: true,
										className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Telefone / WhatsApp"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: phone,
											onChange: (e) => setPhone(e.target.value),
											placeholder: "(11) 99999-9999",
											className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Data de Nascimento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											value: birthDate,
											onChange: (e) => setBirthDate(e.target.value),
											className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Documento (CPF / RA)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: document,
											onChange: (e) => setDocument(e.target.value),
											placeholder: "000.000.000-00",
											className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Trilha Principal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: world,
											onChange: (e) => setWorld(e.target.value),
											className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "ef1",
												children: "EF1 • Infantil (1º ao 5º ano)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "ef2",
												children: "EF2 • Teen (6º ao 9º ano)"
											})]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Endereço Completo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: address,
										onChange: (e) => setAddress(e.target.value),
										placeholder: "Rua, número, cidade/UF",
										className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary text-sm"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "mt-4 w-full rounded-full bg-primary py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
										children: "💾 Salvar Alterações no Cadastro"
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 border-b border-border/60 pb-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-lg font-extrabold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏫" }), " Minha Sala de Aula"]
								}), currentClassroom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400",
									children: "Conectado"
								})]
							}), currentClassroom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-primary/20 bg-primary/5 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-base font-extrabold text-foreground",
												children: currentClassroom.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: ["🧑‍🏫 Professor: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: currentClassroom.teacherName
												})]
											}),
											currentClassroom.discipline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: ["📚 ", currentClassroom.discipline]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex items-center justify-between rounded-xl bg-background/80 p-2.5 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-muted-foreground",
													children: "Código da Sala:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-black text-primary text-sm tracking-wider",
													children: currentClassroom.code
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Seu professor tem livre acesso ao seu progresso e notas nesta sala."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/turma",
										className: "w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-extrabold text-primary-foreground shadow-soft hover:bg-primary/90 transition-all",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🛡️ Acessar Painel da Turma/Clã →" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleLeaveClassroom,
										className: "w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-extrabold text-red-600 hover:bg-red-500/20 transition-colors",
										children: "🚪 Sair desta Sala"
									})
								]
							}) : currentUser.classroomCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold",
										children: ["Código vinculado: ", currentUser.classroomCode]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground mt-1",
										children: "Aguardando confirmação do professor ou código atualizado."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleLeaveClassroom,
									className: "w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-bold text-red-600",
									children: "Desvincular"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-3",
								children: "Você ainda não está em nenhuma sala. Digite o código passado pelo seu professor para que ele acompanhe seu aprendizado!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleJoinClassroom,
								className: "space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: roomCodeInput,
									onChange: (e) => setRoomCodeInput(e.target.value.toUpperCase()),
									placeholder: "Ex: LIBRAS2026",
									maxLength: 20,
									className: "w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-center font-display text-sm font-extrabold uppercase tracking-wider outline-none focus:border-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isJoiningRoom || !roomCodeInput.trim(),
									className: "w-full rounded-full bg-primary py-2.5 text-xs font-extrabold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50",
									children: isJoiningRoom ? "Entrando…" : "🚀 Entrar na Sala"
								})]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-lg font-extrabold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📜" }), " Minhas Lições Concluídas"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground mb-4",
									children: "Sinais praticados e pontuação acumulada."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: !currentUser.completedLessons || currentUser.completedLessons.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-center text-xs text-muted-foreground py-6",
										children: "Você ainda não completou lições. Comece praticando na Trilha!"
									}) : currentUser.completedLessons.map((les) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background p-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold",
											children: les.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex items-center justify-between text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: les.completedAt
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-black text-emerald-600 dark:text-emerald-400",
												children: [
													"⭐ ",
													les.score,
													"%"
												]
											})]
										})]
									}, les.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/trilha",
									className: "mt-6 block w-full rounded-full bg-emerald-600 py-3 text-center font-display text-sm font-extrabold text-white shadow-soft transition-transform hover:-translate-y-0.5",
									children: "Praticar Novos Sinais →"
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { StudentProfilePage as component };
