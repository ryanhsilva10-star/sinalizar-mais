import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as syncClassroomsFromSupabase, D as saveClassroom, E as removeStudentFromClassroom, M as fetchCompletedLessonsForUsers, O as saveUser, S as logoutUser, _ as getUsers, c as deleteClassroom, d as getActiveUser, g as getStudentsInClassroom, j as addAlunoToSalaInSupabase, l as deleteUser, m as getClassrooms, o as ALL_TRAIL_ACTIVITIES, u as generateRandomClassroomCode, v as isUserOnline, y as joinClassroom } from "./router-Bs2xLfcW.mjs";
import { A as Check, D as Copy, E as EyeOff, T as Eye, _ as Minimize2, a as UserMinus, g as PenLine, i as UserPlus, m as Plus, r as Users, s as Trash2, t as X, u as Search, y as Maximize2 } from "../_libs/lucide-react.mjs";
import { t as Footer } from "./Footer-BHVuZYSJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-DbUK5zHi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROFESSOR_AVATARS = [
	{
		icon: "🧑‍🏫",
		label: "Professor(a) Geral"
	},
	{
		icon: "👩‍🏫",
		label: "Professora LIBRAS"
	},
	{
		icon: "👨‍🏫",
		label: "Professor Mestre"
	},
	{
		icon: "🎓",
		label: "Educador(a) Inclusivo(a)"
	},
	{
		icon: "📚",
		label: "Mestre dos Sinais"
	},
	{
		icon: "🦊",
		label: "Luvi Guia"
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
	}
];
function OnboardingPage() {
	const navigate = useNavigate();
	const [usersList, setUsersList] = (0, import_react.useState)([]);
	const [classroomsList, setClassroomsList] = (0, import_react.useState)([]);
	const [activeUser, setActiveUser] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("classrooms");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [discipline, setDiscipline] = (0, import_react.useState)("");
	const [world, setWorld] = (0, import_react.useState)("ef1");
	const [selectedAvatar, setSelectedAvatar] = (0, import_react.useState)("🧑‍🏫");
	const [userToDelete, setUserToDelete] = (0, import_react.useState)(null);
	const [selectedStudentForLessons, setSelectedStudentForLessons] = (0, import_react.useState)(null);
	const [isClassroomModalOpen, setIsClassroomModalOpen] = (0, import_react.useState)(false);
	const [editingClassroom, setEditingClassroom] = (0, import_react.useState)(null);
	const [classroomName, setClassroomName] = (0, import_react.useState)("");
	const [classroomDiscipline, setClassroomDiscipline] = (0, import_react.useState)("");
	const [classroomWorld, setClassroomWorld] = (0, import_react.useState)("all");
	const [classroomCode, setClassroomCode] = (0, import_react.useState)("");
	const [classroomDescription, setClassroomDescription] = (0, import_react.useState)("");
	const [classroomToDelete, setClassroomToDelete] = (0, import_react.useState)(null);
	const [selectedClassroomForStudents, setSelectedClassroomForStudents] = (0, import_react.useState)(null);
	const [visibleCodes, setVisibleCodes] = (0, import_react.useState)({});
	const [copiedCode, setCopiedCode] = (0, import_react.useState)(null);
	const [isStudentModalFullscreen, setIsStudentModalFullscreen] = (0, import_react.useState)(false);
	const [studentModalWorldFilter, setStudentModalWorldFilter] = (0, import_react.useState)("all");
	const [studentSearchQuery, setStudentSearchQuery] = (0, import_react.useState)("");
	const [studentLessonsMap, setStudentLessonsMap] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const [isAddStudentModalOpen, setIsAddStudentModalOpen] = (0, import_react.useState)(false);
	const [classroomToEnroll, setClassroomToEnroll] = (0, import_react.useState)(null);
	const [studentAddSearch, setStudentAddSearch] = (0, import_react.useState)("");
	const [enrollingLoading, setEnrollingLoading] = (0, import_react.useState)(false);
	const handleEnrollStudent = async (studentId, classroom) => {
		if (!studentId || !classroom) return;
		setEnrollingLoading(true);
		try {
			const res = joinClassroom(studentId, classroom.code);
			await addAlunoToSalaInSupabase(studentId, classroom.code);
			refreshUserData();
			toast.success(res.message || `Aluno matriculado na sala "${classroom.name}" com sucesso! 🎉`);
			setIsAddStudentModalOpen(false);
			setStudentAddSearch("");
		} catch (err) {
			toast.error(err.message || "Erro ao matricular aluno.");
		} finally {
			setEnrollingLoading(false);
		}
	};
	const refreshUserData = () => {
		const list = getUsers();
		setUsersList(list);
		const crs = getClassrooms();
		setClassroomsList(crs);
		const active = getActiveUser();
		if (!active) {
			toast.error("🔒 Acesso restrito a professores. Faça login para acessar o painel.");
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		if (active.role === "aluno") {
			toast.error("🔒 Área exclusiva para professores. Redirecionando para a trilha.");
			navigate({
				to: "/trilha",
				replace: true
			});
			return;
		}
		setActiveUser(active);
	};
	(0, import_react.useEffect)(() => {
		refreshUserData();
		syncClassroomsFromSupabase().then(() => {
			refreshUserData();
		});
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		if (!selectedClassroomForStudents) {
			setStudentLessonsMap(/* @__PURE__ */ new Map());
			return;
		}
		syncClassroomsFromSupabase().then(() => {
			refreshUserData();
		});
		const studentInfo = getStudentsInClassroom(selectedClassroomForStudents.code).map((s) => ({
			id: s.id,
			email: s.email
		}));
		if (studentInfo.length === 0) return;
		fetchCompletedLessonsForUsers(studentInfo).then((map) => {
			setStudentLessonsMap(map);
		});
	}, [selectedClassroomForStudents]);
	const handleLogout = () => {
		logoutUser();
		toast.info("Sessão encerrada com sucesso.");
		navigate({
			to: "/login",
			replace: true
		});
	};
	const teachersList = usersList.filter((u) => u.role === "professor");
	const teacherClassrooms = activeUser ? classroomsList.filter((c) => c.teacherId === activeUser.id || c.teacherName === activeUser.name || activeUser.email === "helena.prof@sinalizamais.com" && c.teacherId === "usr_prof_1") : [];
	const handleEditTeacher = (prof) => {
		setEditingId(prof.id);
		setName(prof.name);
		setEmail(prof.email);
		setPassword(prof.password || "");
		setDiscipline(prof.discipline || "");
		setWorld(prof.world);
		setSelectedAvatar(prof.avatar || "🧑‍🏫");
		setMode("create");
		toast.info(`Editando perfil do(a) Professor(a) ${prof.name}`);
	};
	const resetProfessorForm = () => {
		setEditingId(null);
		setName("");
		setEmail("");
		setPassword("");
		setDiscipline("");
		setWorld("ef1");
		setSelectedAvatar("🧑‍🏫");
	};
	const handleSaveProfessorSubmit = (e) => {
		e.preventDefault();
		if (!name.trim() || !email.trim()) {
			toast.error("Por favor, preencha o nome e o e-mail do professor.");
			return;
		}
		try {
			const saved = saveUser({
				id: editingId || void 0,
				name,
				email,
				password,
				role: "professor",
				discipline: discipline.trim() || "LIBRAS & Inclusão",
				world,
				avatar: selectedAvatar
			});
			refreshUserData();
			toast.success(editingId ? `Perfil de "${saved.name}" atualizado com sucesso!` : `Professor(a) "${saved.name}" cadastrado(a) com sucesso! 🎉`);
			resetProfessorForm();
			setMode("teachers");
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Erro ao salvar professor.");
		}
	};
	const handleConfirmDelete = () => {
		if (!userToDelete) return;
		deleteUser(userToDelete.id);
		refreshUserData();
		toast.success(`Conta do(a) professor(a) "${userToDelete.name}" foi excluída.`);
		setUserToDelete(null);
	};
	const handleOpenAddClassroomModal = () => {
		setEditingClassroom(null);
		setClassroomName("");
		setClassroomDiscipline(activeUser?.discipline || "LIBRAS & Inclusão");
		setClassroomWorld("all");
		setClassroomCode(generateRandomClassroomCode());
		setClassroomDescription("");
		setIsClassroomModalOpen(true);
	};
	const handleOpenEditClassroomModal = (cls) => {
		setEditingClassroom(cls);
		setClassroomName(cls.name);
		setClassroomDiscipline(cls.discipline || "");
		setClassroomWorld(cls.world || "all");
		setClassroomCode(cls.code);
		setClassroomDescription(cls.description || "");
		setIsClassroomModalOpen(true);
	};
	const handleSaveClassroomSubmit = (e) => {
		e.preventDefault();
		if (!classroomName.trim()) {
			toast.error("Por favor, informe o nome da sala de aula.");
			return;
		}
		if (!activeUser) return;
		try {
			const saved = saveClassroom({
				id: editingClassroom?.id,
				name: classroomName,
				teacherId: activeUser.id,
				teacherName: activeUser.name,
				discipline: classroomDiscipline.trim() || void 0,
				world: classroomWorld,
				code: classroomCode.trim().toUpperCase() || void 0,
				description: classroomDescription.trim() || void 0
			});
			refreshUserData();
			setIsClassroomModalOpen(false);
			toast.success(editingClassroom ? `Sala "${saved.name}" atualizada com sucesso! 🎉` : `Sala "${saved.name}" criada com sucesso! Código de acesso: ${saved.code} 🎉`);
		} catch (err) {
			toast.error(err.message || "Erro ao salvar sala de aula.");
		}
	};
	const handleConfirmDeleteClassroom = () => {
		if (!classroomToDelete) return;
		deleteClassroom(classroomToDelete.id);
		refreshUserData();
		if (selectedClassroomForStudents?.id === classroomToDelete.id) setSelectedClassroomForStudents(null);
		toast.success(`Sala "${classroomToDelete.name}" foi excluída.`);
		setClassroomToDelete(null);
	};
	const handleCopyCode = (code) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		setTimeout(() => setCopiedCode(null), 2500);
		toast.success(`📋 Código "${code}" copiado para a área de transferência!`);
	};
	const toggleCodeVisibility = (id) => {
		setVisibleCodes((prev) => ({
			...prev,
			[id]: !prev[id]
		}));
	};
	const handleRemoveStudentFromClass = (studentId, studentName) => {
		removeStudentFromClassroom(studentId);
		refreshUserData();
		toast.info(`Aluno "${studentName}" foi desvinculado desta sala.`);
	};
	if (!activeUser) return null;
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/sinaliza-mais-logo.jpg",
							alt: "Sinaliza Mais - Logo",
							className: "h-10 w-10 rounded-xl object-cover shadow-soft"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-extrabold",
							children: "sinaliza mais"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl",
								children: activeUser.avatar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden text-left md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-extrabold leading-none flex items-center gap-1.5",
									children: [activeUser.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600 dark:text-blue-400",
										children: "👨‍🏫 Professor"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: activeUser.discipline || "Educação LIBRAS"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/trilha",
								className: "rounded-full border border-border px-3.5 py-1.5 text-xs font-extrabold hover:bg-muted transition-colors",
								children: "🗺️ Trilha"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleLogout,
								className: "rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors",
								title: "Encerrar sessão",
								children: "🚪 Sair / Log-off"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-10 md:py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-10 flex flex-col items-center text-center animate-fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/sinaliza-mais-logo.jpg",
								alt: "Sinaliza Mais - Aprenda LIBRAS de forma divertida!",
								className: "h-32 w-32 rounded-3xl object-cover shadow-xl ring-4 ring-primary/20 md:h-40 md:w-40 transition-transform hover:scale-105"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-2xl font-extrabold md:text-3xl",
								children: "Painel do Professor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground max-w-md",
								children: "Gerencie suas turmas, acompanhe o progresso dos alunos e ensine LIBRAS de forma inclusiva e divertida! 🤟"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-8 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex flex-wrap justify-center rounded-2xl bg-muted/60 p-1.5 shadow-inner gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setMode("classrooms"),
									className: `rounded-xl px-5 py-2.5 text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 ${mode === "classrooms" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏫 Minhas Salas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[10px] font-black ${mode === "classrooms" ? "bg-white/25 text-white" : "bg-primary/15 text-primary"}`,
										children: teacherClassrooms.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setMode("teachers"),
									className: `rounded-xl px-5 py-2.5 text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 ${mode === "teachers" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🧑‍🏫 Professores" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[10px] font-black ${mode === "teachers" ? "bg-white/25 text-white" : "bg-blue-500/15 text-blue-600 dark:text-blue-400"}`,
										children: teachersList.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										resetProfessorForm();
										setMode("create");
									},
									className: `rounded-xl px-5 py-2.5 text-xs md:text-sm font-extrabold transition-all ${mode === "create" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`,
									children: ["➕ ", editingId ? "Editar Professor" : "Cadastrar Professor"]
								})
							]
						})
					}),
					mode === "classrooms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-3xl font-extrabold flex items-center gap-2 justify-center md:justify-start",
								children: ["🏫 Minhas Salas de Aula", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-primary/20 px-3 py-1 text-xs font-black text-primary",
									children: [
										teacherClassrooms.length,
										" ",
										teacherClassrooms.length === 1 ? "turma" : "turmas"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Gerencie suas turmas, crie códigos de acesso exclusivos e acompanhe os alunos matriculados em tempo real."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleOpenAddClassroomModal,
								className: "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Adicionar Sala" })]
							})]
						}), teacherClassrooms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border-2 border-dashed border-border p-12 text-center bg-card/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-4xl text-primary",
									children: "🏫"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-display text-xl font-extrabold",
									children: "Nenhuma sala de aula cadastrada"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto",
									children: "Crie sua primeira sala para gerar um código de acesso e permitir que seus alunos se conectem à turma pelo sinaliza mais."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleOpenAddClassroomModal,
									className: "mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Adicionar Minha Primeira Sala" })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: teacherClassrooms.map((cls) => {
								const enrolledStudents = getStudentsInClassroom(cls.code);
								const onlineCount = enrolledStudents.filter(isUserOnline).length;
								const isCodeVisible = visibleCodes[cls.id] ?? true;
								const worldIcon = cls.world === "ef2" ? "🚀" : cls.world === "ef1" ? "🦊" : "🎓";
								const worldLabel = cls.world === "ef2" ? "Mundo EF2 • Teen (6º ao 9º)" : cls.world === "ef1" ? "Mundo EF1 • Infantil (1º ao 5º)" : "Todos os Níveis (EF1 & EF2)";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex flex-col justify-between rounded-3xl border-2 border-border bg-card p-6 shadow-md transition-all hover:border-primary/50 hover:shadow-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-inner",
														children: worldIcon
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-display text-xl font-extrabold leading-tight text-foreground",
														children: cls.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📚 ", cls.discipline || "LIBRAS & Inclusão"] })
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${cls.world === "ef2" ? "bg-indigo-500/20 text-indigo-500 dark:text-indigo-400" : cls.world === "ef1" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`,
													children: cls.world === "ef2" ? "EF2 Teen" : cls.world === "ef1" ? "EF1 Infantil" : "Geral"
												})]
											}),
											cls.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground line-clamp-2 italic bg-muted/30 p-2.5 rounded-xl",
												children: [
													"\"",
													cls.description,
													"\""
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-3.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block",
														children: "Código de Acesso da Turma:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 mt-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-lg font-black tracking-widest text-primary",
															children: isCodeVisible ? cls.code : "••••••"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => toggleCodeVisibility(cls.id),
															className: "text-muted-foreground hover:text-foreground transition-colors",
															title: isCodeVisible ? "Ocultar código" : "Mostrar código",
															children: isCodeVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
														})]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleCopyCode(cls.code),
														className: `flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shadow-sm ${copiedCode === cls.code ? "bg-emerald-500 text-white scale-105" : "bg-primary text-primary-foreground hover:bg-primary/90"}`,
														title: "Copiar código da sala",
														children: copiedCode === cls.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copiado!" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copiar Código" })] })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground mt-2",
													children: [
														"💡 Os alunos usam este código no botão flutuante ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"🏫 Sala de Aula\"" }),
														" para ingressar."
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl bg-muted/40 p-3.5 flex items-center justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "grid h-8 w-8 place-items-center rounded-xl bg-background text-sm shadow-sm",
														children: "👥"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs font-extrabold",
														children: [
															enrolledStudents.length,
															" ",
															enrolledStudents.length === 1 ? "aluno matriculado" : "alunos matriculados"
														]
													}), onlineCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
															onlineCount,
															" online agora"
														]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground",
														children: cls.createdAt ? `Criada em ${new Date(cls.createdAt).toLocaleDateString("pt-BR")}` : worldLabel
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => {
															setClassroomToEnroll(cls);
															setIsAddStudentModalOpen(true);
														},
														className: "inline-flex items-center gap-1 rounded-xl bg-primary/10 border border-primary/30 px-2.5 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/20 transition-colors shadow-sm",
														title: "Adicionar aluno nesta sala",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "hidden sm:inline",
															children: "+ Aluno"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => setSelectedClassroomForStudents(cls),
														className: "rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-extrabold text-foreground hover:bg-muted transition-colors shadow-sm",
														children: [
															"Ver Alunos (",
															enrolledStudents.length,
															")"
														]
													})]
												})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex items-center justify-between border-t border-border/60 pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground font-medium",
											children: worldLabel
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => handleOpenEditClassroomModal(cls),
												className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Editar" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setClassroomToDelete(cls),
												className: "inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Excluir" })]
											})]
										})]
									})]
								}, cls.id);
							})
						})]
					}),
					mode === "teachers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-3xl font-extrabold flex items-center gap-2 justify-center md:justify-start",
								children: ["🧑‍🏫 Professores Cadastrados", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-600 dark:text-blue-400",
									children: teachersList.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Professores possuem autorização para criar salas de aula e monitorar turmas no sinaliza mais."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									resetProfessorForm();
									setMode("create");
								},
								className: "inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-soft transition-transform hover:-translate-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cadastrar Novo Professor" })]
							})]
						}), teachersList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-dashed border-border p-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-4xl",
									children: "🧑‍🏫"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-lg font-extrabold",
									children: "Nenhum professor cadastrado"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Adicione novos professores através do formulário de cadastro."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: teachersList.map((prof) => {
								const isActive = activeUser?.id === prof.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `relative flex flex-col justify-between rounded-3xl border-2 p-5 transition-all ${isActive ? "border-blue-500 bg-blue-500/10 shadow-md" : "border-border bg-card hover:border-border/80"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-4xl",
												children: prof.avatar
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-display text-lg font-extrabold",
													children: prof.name
												}), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400",
													children: "Você"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: prof.email
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-blue-500/20 px-2.5 py-1 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400",
											children: prof.discipline || "LIBRAS"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 rounded-2xl bg-muted/40 p-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold text-muted-foreground",
											children: "Área de Atuação:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-extrabold text-sm",
											children: prof.discipline || "LIBRAS & Acessibilidade"
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex items-center justify-end gap-2 border-t border-border/60 pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleEditTeacher(prof),
											className: "rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted transition-colors",
											children: "✏️ Editar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setUserToDelete(prof),
											className: "rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-red-400 transition-colors",
											children: "🗑️ Deletar"
										})]
									})]
								}, prof.id);
							})
						})]
					}),
					mode === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-xl animate-fade-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold uppercase tracking-widest text-primary",
										children: editingId ? "Atualizar Perfil" : "Painel do Professor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-1 font-display text-3xl font-extrabold md:text-4xl",
										children: editingId ? `Editando: ${name}` : "Cadastrar Professor(a)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: "Cadastre novos professores para gerenciar turmas e salas no sinaliza mais."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSaveProfessorSubmit,
								className: "mt-8 flex flex-col gap-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Escolha o Avatar do Professor:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap justify-center gap-3",
										children: PROFESSOR_AVATARS.map((av) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setSelectedAvatar(av.icon),
											className: `flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all ${selectedAvatar === av.icon ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110 shadow-md" : "bg-muted hover:bg-muted/80"}`,
											title: av.label,
											children: av.icon
										}, av.icon))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Nome Completo do Professor *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "Ex: Profe. Helena Silva",
										required: true,
										className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Disciplina / Área de Atuação *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: discipline,
										onChange: (e) => setDiscipline(e.target.value),
										placeholder: "Ex: LIBRAS, Educação Inclusiva, Pedagogia",
										required: true,
										className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-medium outline-none transition-colors focus:border-primary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Trilha de Atuação Principal:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setWorld("ef1"),
											className: `flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${world === "ef1" ? "border-primary bg-primary/10 shadow-soft scale-[1.02]" : "border-border bg-background hover:bg-muted/50"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-2xl",
													children: "🦊"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1 font-display font-extrabold text-sm",
													children: "EF1 • Infantil"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground",
													children: "1º ao 5º ano"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setWorld("ef2"),
											className: `flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${world === "ef2" ? "border-indigo-500 bg-indigo-500/10 shadow-soft scale-[1.02]" : "border-border bg-background hover:bg-muted/50"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-2xl",
													children: "🚀"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1 font-display font-extrabold text-sm",
													children: "EF2 • Teen"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground",
													children: "6º ao 9º ano"
												})
											]
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "E-mail de Acesso *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "professor@sinalizamais.com",
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-col gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "submit",
											className: "w-full rounded-full bg-primary py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:translate-y-0.5",
											children: ["💾 ", editingId ? "Salvar Alterações" : "Salvar Professor(a) →"]
										}), editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												resetProfessorForm();
												setMode("teachers");
											},
											className: "w-full rounded-full border border-border py-2 text-xs font-bold hover:bg-muted",
											children: "Cancelar Edição"
										})]
									})
								]
							})]
						})
					})
				]
			}),
			isClassroomModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/60 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-2xl",
								children: "🏫"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl font-extrabold",
								children: editingClassroom ? "Editar Sala de Aula" : "Adicionar Nova Sala de Aula"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Preencha os dados da turma para gerar o código de acesso."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsClassroomModalOpen(false),
							className: "rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveClassroomSubmit,
						className: "mt-6 flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Nome da Turma / Sala *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: classroomName,
								onChange: (e) => setClassroomName(e.target.value),
								placeholder: "Ex: Turma Inclusiva - 5º Ano A",
								required: true,
								className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Disciplina / Área"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: classroomDiscipline,
								onChange: (e) => setClassroomDiscipline(e.target.value),
								placeholder: "Ex: LIBRAS & Inclusão, Educação Especial",
								className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Nível de Ensino / Trilha da Turma:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setClassroomWorld("ef1"),
										className: `flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${classroomWorld === "ef1" ? "border-primary bg-primary/10 shadow-soft font-extrabold" : "border-border bg-background hover:bg-muted/50 text-muted-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl",
											children: "🦊"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 text-xs",
											children: "EF1 Infantil"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setClassroomWorld("ef2"),
										className: `flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${classroomWorld === "ef2" ? "border-indigo-500 bg-indigo-500/10 shadow-soft font-extrabold text-indigo-400" : "border-border bg-background hover:bg-muted/50 text-muted-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl",
											children: "🚀"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 text-xs",
											children: "EF2 Teen"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setClassroomWorld("all"),
										className: `flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${classroomWorld === "all" ? "border-emerald-500 bg-emerald-500/10 shadow-soft font-extrabold text-emerald-600 dark:text-emerald-400" : "border-border bg-background hover:bg-muted/50 text-muted-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl",
											children: "🎓"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 text-xs",
											children: "Todos / Geral"
										})]
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Código de Acesso da Turma:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setClassroomCode(generateRandomClassroomCode()),
										className: "text-[11px] font-bold text-primary hover:underline",
										children: "🎲 Gerar Novo Código"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: classroomCode,
									onChange: (e) => setClassroomCode(e.target.value.toUpperCase()),
									placeholder: "EX: LIBRAS2026",
									maxLength: 12,
									className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-mono text-sm font-extrabold tracking-widest uppercase outline-none transition-colors focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-1",
									children: "Os alunos digitarão esse código no aplicativo para ingressar na turma."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Descrição / Avisos da Turma (opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: classroomDescription,
								onChange: (e) => setClassroomDescription(e.target.value),
								placeholder: "Ex: Aulas às terças e quintas. Foco em conversação e desafios práticos.",
								rows: 2,
								className: "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-primary resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsClassroomModalOpen(false),
									className: "w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted transition-colors",
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "w-1/2 rounded-full bg-primary py-3 font-display text-sm font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
									children: ["💾 ", editingClassroom ? "Salvar Alterações" : "Criar Sala de Aula"]
								})]
							})
						]
					})]
				})
			}),
			selectedClassroomForStudents && (() => {
				const allEnrolled = getStudentsInClassroom(selectedClassroomForStudents.code);
				const filteredStudents = allEnrolled.filter((s) => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || s.email.toLowerCase().includes(studentSearchQuery.toLowerCase()));
				const clsWorld = selectedClassroomForStudents.world || "all";
				const activitiesToShow = ALL_TRAIL_ACTIVITIES.filter((act) => {
					if (studentModalWorldFilter === "world1") return act.world === 1;
					if (studentModalWorldFilter === "world2") return act.world === 2;
					if (clsWorld === "ef1") return act.world === 1;
					if (clsWorld === "ef2") return act.world === 2;
					return true;
				});
				const getStudentScore = (student, nodeId) => {
					const supabaseLessons = studentLessonsMap.get(student.id) || (student.email ? studentLessonsMap.get(student.email.toLowerCase()) : void 0);
					const lesson = (supabaseLessons && supabaseLessons.length > 0 ? supabaseLessons : student.completedLessons ?? []).find((l) => l.id === `trail_node_${nodeId}` || l.id === `les_${nodeId}`);
					return lesson ? lesson.score : null;
				};
				const getActivityAvg = (nodeId) => {
					const scores = allEnrolled.map((s) => getStudentScore(s, nodeId)).filter((sc) => sc !== null);
					if (scores.length === 0) return null;
					return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
				};
				const getStudentAvg = (student) => {
					const scores = activitiesToShow.map((act) => getStudentScore(student, act.nodeId)).filter((sc) => sc !== null);
					if (scores.length === 0) return null;
					return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
				};
				const getCellColors = (score) => {
					if (score === null) return {
						bg: "rgba(120,120,140,0.07)",
						fill: "rgba(120,120,140,0.18)",
						text: "#9ca3af"
					};
					if (score >= 80) return {
						bg: "rgba(16,185,129,0.08)",
						fill: "rgba(16,185,129,0.55)",
						text: "#065f46"
					};
					if (score >= 60) return {
						bg: "rgba(14,165,233,0.08)",
						fill: "rgba(14,165,233,0.50)",
						text: "#0c4a6e"
					};
					if (score >= 30) return {
						bg: "rgba(245,158,11,0.08)",
						fill: "rgba(245,158,11,0.55)",
						text: "#78350f"
					};
					return {
						bg: "rgba(239,68,68,0.08)",
						fill: "rgba(239,68,68,0.40)",
						text: "#7f1d1d"
					};
				};
				const modalSizeClass = isStudentModalFullscreen ? "fixed inset-2 z-[60] rounded-2xl" : "w-full max-w-6xl rounded-3xl max-h-[90vh]";
				const closeModal = () => {
					setSelectedClassroomForStudents(null);
					setIsStudentModalFullscreen(false);
					setStudentSearchQuery("");
					setStudentModalWorldFilter("all");
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm animate-fade-in",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${modalSizeClass} border border-border bg-card shadow-2xl flex flex-col overflow-hidden transition-all duration-300`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 bg-card shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl shrink-0",
										children: "🏫"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-extrabold leading-tight truncate",
											children: selectedClassroomForStudents.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs text-muted-foreground flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Código: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-primary font-mono",
													children: selectedClassroomForStudents.code
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
														" ",
														allEnrolled.length,
														" aluno(s)"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedClassroomForStudents.discipline || "LIBRAS" })
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "hidden sm:flex items-center gap-1 rounded-xl border border-border bg-background p-1",
											children: [
												"all",
												"world1",
												"world2"
											].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setStudentModalWorldFilter(f),
												className: `rounded-lg px-2.5 py-1 text-[10px] font-extrabold transition-all ${studentModalWorldFilter === f ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
												children: f === "all" ? "Todos" : f === "world1" ? "🌍 EF1" : "🚀 EF2"
											}, f))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative hidden sm:block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												placeholder: "Buscar aluno…",
												value: studentSearchQuery,
												onChange: (e) => setStudentSearchQuery(e.target.value),
												className: "w-36 rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setClassroomToEnroll(selectedClassroomForStudents);
												setIsAddStudentModalOpen(true);
											},
											className: "inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: "Adicionar Aluno"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setIsStudentModalFullscreen((v) => !v),
											title: isStudentModalFullscreen ? "Modo janela" : "Tela cheia",
											className: "rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
											children: isStudentModalFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: closeModal,
											className: "rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex sm:hidden items-center gap-2 px-4 py-2 border-b border-border/40 bg-background/50 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Buscar aluno…",
										value: studentSearchQuery,
										onChange: (e) => setStudentSearchQuery(e.target.value),
										className: "w-full rounded-xl border border-border bg-background pl-7 pr-3 py-1.5 text-xs font-medium outline-none focus:border-primary transition-all"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: studentModalWorldFilter,
									onChange: (e) => setStudentModalWorldFilter(e.target.value),
									className: "rounded-xl border border-border bg-background px-2 py-1.5 text-xs font-bold outline-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "Todos"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "world1",
											children: "🌍 EF1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "world2",
											children: "🚀 EF2"
										})
									]
								})]
							}),
							allEnrolled.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex flex-col items-center justify-center py-16 text-center px-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-5xl mb-4",
										children: "🎒"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-display text-base font-extrabold",
										children: "Nenhum aluno matriculado ainda"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-muted-foreground max-w-xs",
										children: [
											"Compartilhe o código",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-primary font-mono",
												children: selectedClassroomForStudents.code
											}),
											" ",
											"com seus alunos para que eles possam ingressar."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex items-center justify-center gap-2.5 flex-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setClassroomToEnroll(selectedClassroomForStudents);
												setIsAddStudentModalOpen(true);
											},
											className: "inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-extrabold text-primary-foreground shadow-soft hover:bg-primary/90 transition-transform hover:-translate-y-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), "Adicionar Aluno Nesta Sala"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleCopyCode(selectedClassroomForStudents.code),
											className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-5 py-2.5 text-xs font-extrabold text-primary hover:bg-primary/20 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }),
												"Copiar Código (",
												selectedClassroomForStudents.code,
												")"
											]
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 overflow-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "border-collapse",
									style: { minWidth: `${280 + activitiesToShow.length * 68 + 72}px` },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "bg-card",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "sticky left-0 z-20 bg-card border-b border-r border-border/60 px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground",
													style: { minWidth: 280 },
													children: "Aluno"
												}),
												activitiesToShow.map((act) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "border-b border-border/40 px-1 py-2 text-center",
													style: {
														width: 68,
														minWidth: 60
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-col items-center gap-0.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-base leading-none",
																children: act.icon
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-[8px] font-extrabold leading-tight text-center text-muted-foreground",
																style: { maxWidth: 56 },
																title: act.title,
																children: [
																	act.nodeId,
																	". ",
																	act.title.length > 10 ? act.title.slice(0, 10) + "…" : act.title
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `text-[7px] font-bold rounded px-1 ${act.world === 1 ? "text-emerald-600 bg-emerald-500/10" : "text-violet-600 bg-violet-500/10"}`,
																children: act.world === 1 ? "EF1" : "EF2"
															})
														]
													})
												}, act.nodeId)),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "border-b border-l border-border/60 px-2 py-3 text-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground",
													style: {
														width: 72,
														minWidth: 72
													},
													children: "Média"
												})
											]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											colSpan: activitiesToShow.length + 2,
											className: "py-10 text-center text-sm text-muted-foreground",
											children: [
												"Nenhum aluno encontrado para \"",
												studentSearchQuery,
												"\"."
											]
										}) }) : filteredStudents.map((student, idx) => {
											const online = isUserOnline(student);
											const studentAvg = getStudentAvg(student);
											const avgColors = getCellColors(studentAvg);
											const initials = student.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: `group transition-colors hover:bg-primary/5 ${idx % 2 === 0 ? "bg-background" : "bg-card"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: `sticky left-0 z-10 border-b border-r border-border/40 px-3 py-2.5 ${idx % 2 === 0 ? "bg-background" : "bg-card"} group-hover:bg-primary/5 transition-colors`,
														style: { minWidth: 280 },
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2.5",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "relative shrink-0",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg leading-none",
																		children: student.avatar && /\p{Emoji}/u.test(student.avatar) ? student.avatar : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "font-extrabold text-xs text-primary",
																			children: initials
																		})
																	}), online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-background" })]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "min-w-0",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "flex items-center gap-1.5",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																				className: "font-display font-extrabold text-xs text-foreground truncate",
																				children: student.name
																			}), online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																				className: "shrink-0 rounded-full bg-emerald-500/20 px-1.5 text-[8px] font-black text-emerald-600 dark:text-emerald-400",
																				children: "Online"
																			})]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																			className: "text-[10px] text-muted-foreground truncate",
																			children: student.email
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground font-bold",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Nv.", student.level] }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																					"⚡",
																					student.xp,
																					"XP"
																				] }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																					onClick: () => setSelectedStudentForLessons(student),
																					className: "text-blue-500 hover:text-blue-600 hover:underline",
																					children: [
																						"📜",
																						studentLessonsMap.get(student.id)?.length ?? (student.email ? studentLessonsMap.get(student.email.toLowerCase())?.length : void 0) ?? student.completedLessons?.length ?? 0,
																						" lições"
																					]
																				})
																			]
																		})
																	]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => handleRemoveStudentFromClass(student.id, student.name),
																	title: "Desvincular aluno",
																	className: "ml-auto shrink-0 rounded-lg p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "h-3.5 w-3.5" })
																})
															]
														})
													}),
													activitiesToShow.map((act) => {
														const score = getStudentScore(student, act.nodeId);
														const colors = getCellColors(score);
														const pct = score ?? 0;
														return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border-b border-border/30 p-1 text-center",
															title: `${act.title}\n${score !== null ? `Nota: ${score}%` : "Não concluído"}`,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "relative mx-auto rounded-lg overflow-hidden",
																style: {
																	width: 48,
																	height: 48,
																	background: colors.bg,
																	border: `1px solid ${colors.fill}`
																},
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out rounded-b-lg",
																	style: {
																		height: `${pct}%`,
																		background: colors.fill
																	}
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "absolute inset-0 flex items-center justify-center",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "font-extrabold text-[11px] leading-none",
																		style: {
																			color: score !== null ? colors.text : "#9ca3af",
																			textShadow: score !== null && pct >= 50 ? "0 0 4px rgba(255,255,255,0.7)" : void 0
																		},
																		children: score !== null ? `${score}%` : "—"
																	})
																})]
															})
														}, act.nodeId);
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-b border-l border-border/40 p-1 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "relative mx-auto rounded-lg overflow-hidden",
															style: {
																width: 52,
																height: 48,
																background: avgColors.bg,
																border: `2px solid ${avgColors.fill}`
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-500",
																style: {
																	height: `${studentAvg ?? 0}%`,
																	background: avgColors.fill
																}
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute inset-0 flex items-center justify-center",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-extrabold text-[11px] leading-none",
																	style: {
																		color: studentAvg !== null ? avgColors.text : "#9ca3af",
																		textShadow: studentAvg !== null && studentAvg >= 50 ? "0 0 4px rgba(255,255,255,0.7)" : void 0
																	},
																	children: studentAvg !== null ? `${studentAvg}%` : "—"
																})
															})]
														})
													})
												]
											}, student.id);
										}) }),
										allEnrolled.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "bg-muted/50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "sticky left-0 z-10 bg-muted/50 border-t-2 border-border/70 px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground",
													children: "📊 Média da Turma"
												}),
												activitiesToShow.map((act) => {
													const avg = getActivityAvg(act.nodeId);
													const colors = getCellColors(avg);
													const pct = avg ?? 0;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t-2 border-border/70 p-1 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "relative mx-auto rounded-lg overflow-hidden",
															style: {
																width: 48,
																height: 40,
																background: colors.bg,
																border: `1px solid ${colors.fill}`
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute bottom-0 left-0 right-0 rounded-b-lg",
																style: {
																	height: `${pct}%`,
																	background: colors.fill
																}
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute inset-0 flex items-center justify-center",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-extrabold text-[10px]",
																	style: {
																		color: avg !== null ? colors.text : "#9ca3af",
																		textShadow: avg !== null && pct >= 50 ? "0 0 4px rgba(255,255,255,0.5)" : void 0
																	},
																	children: avg !== null ? `${avg}%` : "—"
																})
															})]
														})
													}, act.nodeId);
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "border-t-2 border-l border-border/70 p-1 text-center",
													children: (() => {
														const allAvgs = activitiesToShow.map((act) => getActivityAvg(act.nodeId)).filter((a) => a !== null);
														const overallAvg = allAvgs.length > 0 ? Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length) : null;
														const colors = getCellColors(overallAvg);
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "relative mx-auto rounded-lg overflow-hidden",
															style: {
																width: 52,
																height: 40,
																background: colors.bg,
																border: `2px solid ${colors.fill}`
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute bottom-0 left-0 right-0 rounded-b-lg",
																style: {
																	height: `${overallAvg ?? 0}%`,
																	background: colors.fill
																}
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute inset-0 flex items-center justify-center",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-extrabold text-[10px]",
																	style: {
																		color: overallAvg !== null ? colors.text : "#9ca3af",
																		textShadow: overallAvg !== null && (overallAvg ?? 0) >= 50 ? "0 0 4px rgba(255,255,255,0.5)" : void 0
																	},
																	children: overallAvg !== null ? `${overallAvg}%` : "—"
																})
															})]
														});
													})()
												})
											]
										}) })
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-t border-border/60 px-5 py-3 bg-card shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [allEnrolled.length, " aluno(s) matriculado(s)"] }),
										filteredStudents.length !== allEnrolled.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• mostrando ", filteredStudents.length] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "hidden sm:flex items-center gap-3",
											children: [
												{
													label: "≥80%",
													color: "rgba(16,185,129,0.55)"
												},
												{
													label: "60–79%",
													color: "rgba(14,165,233,0.50)"
												},
												{
													label: "30–59%",
													color: "rgba(245,158,11,0.55)"
												},
												{
													label: "<30%",
													color: "rgba(239,68,68,0.40)"
												}
											].map(({ label, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-2.5 w-2.5 rounded-sm",
													style: { background: color }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px]",
													children: label
												})]
											}, label))
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: closeModal,
									className: "rounded-full bg-primary px-5 py-2 text-xs font-extrabold text-primary-foreground shadow-soft hover:opacity-90 transition-opacity",
									children: "Fechar"
								})]
							})
						]
					})
				});
			})(),
			selectedStudentForLessons && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/60 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl",
									children: selectedStudentForLessons.avatar
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-xl font-extrabold",
									children: ["Relatório de Lições • ", selectedStudentForLessons.name]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										selectedStudentForLessons.email,
										" • Mundo ",
										selectedStudentForLessons.world.toUpperCase()
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedStudentForLessons(null),
								className: "rounded-full p-2 text-muted-foreground hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 max-h-80 overflow-y-auto space-y-3 pr-1",
							children: (() => {
								const mapLessons = studentLessonsMap.get(selectedStudentForLessons.id) || (selectedStudentForLessons.email ? studentLessonsMap.get(selectedStudentForLessons.email.toLowerCase()) : void 0);
								const lessonsToShow = mapLessons && mapLessons.length > 0 ? mapLessons : selectedStudentForLessons.completedLessons ?? [];
								return lessonsToShow.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-sm text-muted-foreground py-6",
									children: "Nenhuma lição registrada para este aluno ainda."
								}) : lessonsToShow.map((les) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-2xl border border-border bg-background p-3.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-sm",
										children: les.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground",
										children: ["Concluído em: ", les.completedAt]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400",
											children: [
												"⭐ ",
												les.score,
												"%"
											]
										})
									})]
								}, les.id));
							})()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedStudentForLessons(null),
								className: "rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold text-primary-foreground shadow-soft",
								children: "Fechar Relatório"
							})
						})
					]
				})
			}),
			classroomToDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-3xl text-red-500",
								children: "⚠️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-2xl font-extrabold",
								children: "Excluir Sala de Aula?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									"Tem certeza que deseja excluir a sala",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [
											"\"",
											classroomToDelete.name,
											"\""
										]
									}),
									" (Código: ",
									classroomToDelete.code,
									")? Os alunos matriculados serão desvinculados da sala."
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setClassroomToDelete(null),
							className: "w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleConfirmDeleteClassroom,
							className: "w-1/2 rounded-full bg-red-600 py-3 font-display text-sm font-extrabold text-white shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
							children: "Sim, Excluir Sala 🗑️"
						})]
					})]
				})
			}),
			userToDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-3xl text-red-500",
								children: "⚠️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-2xl font-extrabold",
								children: "Deletar Professor(a)?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									"Tem certeza que deseja excluir a conta do(a) professor(a)",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [
											"\"",
											userToDelete.name,
											"\""
										]
									}),
									" (",
									userToDelete.email,
									")? Esta ação é irreversível."
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setUserToDelete(null),
							className: "w-1/2 rounded-full border-2 border-border py-3 font-display text-sm font-extrabold hover:bg-muted",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleConfirmDelete,
							className: "w-1/2 rounded-full bg-red-600 py-3 font-display text-sm font-extrabold text-white shadow-chunky transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
							children: "Sim, Deletar 🗑️"
						})]
					})]
				})
			}),
			isAddStudentModalOpen && classroomToEnroll && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-3xl border-2 border-primary/30 bg-card p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 border-b border-border/60 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-2xl",
									children: "🎒"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-extrabold",
									children: "Matricular Aluno na Turma"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: [
										"Sala: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: classroomToEnroll.name
										}),
										" • Código: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-primary font-mono",
											children: classroomToEnroll.code
										})
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setIsAddStudentModalOpen(false);
									setClassroomToEnroll(null);
									setStudentAddSearch("");
								},
								className: "rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Digite o e-mail exato do aluno…",
									value: studentAddSearch,
									onChange: (e) => setStudentAddSearch(e.target.value),
									className: "w-full rounded-2xl border border-border bg-background pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-primary transition-all",
									autoFocus: true
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto space-y-2.5 pr-1",
							children: (() => {
								const allStudents = usersList.filter((u) => u.role === "aluno");
								const currentEnrolledCodes = [classroomToEnroll.code.toUpperCase()];
								const query = studentAddSearch.trim().toLowerCase();
								const eligibleStudents = allStudents.filter((student) => {
									if (student.classroomCode && currentEnrolledCodes.includes(student.classroomCode.toUpperCase())) return false;
									if (!query) return false;
									return student.email.toLowerCase() === query;
								});
								if (!query) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-dashed border-border p-8 text-center bg-muted/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-3xl block mb-2",
											children: "🔒"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-foreground",
											children: "Por motivos de segurança, a lista de alunos não é exibida."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto",
											children: "Digite o e-mail exato do aluno acima para encontrá-lo e matriculá-lo na turma."
										})
									]
								});
								if (eligibleStudents.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-dashed border-border p-8 text-center bg-muted/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-3xl block mb-2",
											children: "👤"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-foreground",
											children: "Nenhum aluno encontrado com este e-mail."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto",
											children: [
												"Verifique se o e-mail está correto ou se o aluno já está matriculado nesta turma. Alunos também podem entrar usando o código ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-primary font-bold",
													children: classroomToEnroll.code
												}),
												"."
											]
										})
									]
								});
								return eligibleStudents.map((st) => {
									const currentRoom = st.classroomCode ? getClassrooms().find((c) => c.code === st.classroomCode) : null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-3 hover:border-primary/50 transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl shrink-0",
												children: st.avatar || "🦊"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-extrabold text-foreground truncate",
														children: st.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground truncate",
														children: st.email
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 mt-0.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-[9px] font-bold text-primary",
																children: ["Nv.", st.level]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[9px] text-muted-foreground",
																children: "•"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[9px] text-muted-foreground",
																children: currentRoom ? `Sala atual: ${currentRoom.name}` : "Sem turma atribuída"
															})
														]
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											disabled: enrollingLoading,
											onClick: () => handleEnrollStudent(st.id, classroomToEnroll),
											className: "shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Matricular" })]
										})]
									}, st.id);
								});
							})()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 border-t border-border/60 mt-3 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setIsAddStudentModalOpen(false);
									setClassroomToEnroll(null);
									setStudentAddSearch("");
								},
								className: "rounded-full border border-border px-5 py-2 text-xs font-extrabold text-muted-foreground hover:bg-muted",
								children: "Fechar"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { OnboardingPage as component };
