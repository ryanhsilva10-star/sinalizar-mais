import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as lazyRouteComponent, d as Link, i as HeadContent, l as createFileRoute, o as createRouter, p as useRouter, r as Scripts, s as Outlet, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bs2xLfcW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-C4VymiDr.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function brokeredPreviewStorage() {
	if (typeof window === "undefined") return void 0;
	const host = location.hostname;
	const projectId = [
		"lovableproject.com",
		"lovableproject-dev.com",
		"lovable.app",
		"gpt-eng.com",
		"gptengineer.run"
	].some((z) => host === z || host.endsWith("." + z)) ? host.match(/* @__PURE__ */ new RegExp("^(?:id-preview(?:-[a-z0-9]+)?|project)--([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:-dev)?(?=\\.|$)", "i"))?.[1] ?? host.match(/* @__PURE__ */ new RegExp("^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?=[.-])", "i"))?.[1] : void 0;
	const framed = window.parent && window.parent !== window;
	if (!projectId || !framed) return localStorage;
	const dev = host.endsWith(".lovableproject-dev.com") || host.endsWith(".gpt-eng.com");
	const EDITOR = dev ? /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$|^http:\/\/localhost:3000$/ : /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$/;
	const ancestor = location.ancestorOrigins && location.ancestorOrigins[0] || (document.referrer ? new URL(document.referrer).origin : "");
	const editorOrigins = ancestor && EDITOR.test(ancestor) ? [ancestor] : dev ? ["https://lovable.dev", "http://localhost:3000"] : ["https://lovable.dev"];
	const RESULT = "lovable-preview-auth:result";
	const TIMEOUT = 2e3;
	const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
	const request = (type, key, value) => new Promise((resolve) => {
		const requestId = newId();
		let done = false;
		let timer;
		const finish = (r) => {
			if (done) return;
			done = true;
			clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve(r);
		};
		const onMessage = (e) => {
			if (editorOrigins.indexOf(e.origin) < 0) return;
			const d = e.data;
			if (d && d.type === RESULT && d.requestId === requestId) finish(d);
		};
		window.addEventListener("message", onMessage);
		const msg = {
			type,
			requestId,
			projectId,
			key
		};
		if (value !== void 0) msg["value"] = value;
		for (const origin of editorOrigins) window.parent.postMessage(msg, origin);
		timer = setTimeout(() => finish(null), TIMEOUT);
	});
	let firstGet = true;
	const RETRY_DELAY = 250;
	return {
		getItem: async (key) => {
			let res = await request("lovable-preview-auth:get", key);
			if (!res && firstGet) {
				await new Promise((r) => setTimeout(r, RETRY_DELAY));
				res = await request("lovable-preview-auth:get", key);
			}
			firstGet = false;
			if (res && res.ok && typeof res.value === "string") {
				if (res.value === "") {
					localStorage.removeItem(key);
					return null;
				}
				return res.value;
			}
			return localStorage.getItem(key);
		},
		setItem: (key, value) => {
			localStorage.setItem(key, value);
			return request("lovable-preview-auth:set", key, value).then((res) => {
				if (res && res.ok && typeof res.value === "string" && localStorage.getItem(key) === value) {
					if (res.value === "") localStorage.removeItem(key);
					else localStorage.setItem(key, res.value);
				}
			});
		},
		removeItem: (key) => {
			localStorage.removeItem(key);
			return request("lovable-preview-auth:remove", key).then(() => void 0);
		}
	};
}
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseClient() {
	const SUPABASE_URL = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "enoftahwcfttmefmavji",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVub2Z0YWh3Y2Z0dG1lZm1hdmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MTM1MDgsImV4cCI6MjEwNTA4OTUwOH0.kAc6VsVEd6rqWc6oeLgWxxm1u_2weLn1Alw5M2P-kmA",
		"VITE_SUPABASE_URL": "https://enoftahwcfttmefmavji.supabase.co"
	}["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
	const SUPABASE_PUBLISHABLE_KEY = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "enoftahwcfttmefmavji",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVub2Z0YWh3Y2Z0dG1lZm1hdmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MTM1MDgsImV4cCI6MjEwNTA4OTUwOH0.kAc6VsVEd6rqWc6oeLgWxxm1u_2weLn1Alw5M2P-kmA",
		"VITE_SUPABASE_URL": "https://enoftahwcfttmefmavji.supabase.co"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
		auth: {
			storage: brokeredPreviewStorage(),
			persistSession: true,
			autoRefreshToken: true
		}
	});
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
function isSupabaseConfigured() {
	return Boolean(true);
}
/**
* Converte qualquer código (alfanumérico ou número) em um número inteiro positivo
* para compatibilidade estrita com a coluna codigo_sala (integer/numeric) do Supabase.
*/
function parseNumericClassroomCode(code) {
	if (!code) return 100001;
	const digitsOnly = code.replace(/\D/g, "");
	if (digitsOnly.length >= 3) {
		const parsed = parseInt(digitsOnly.slice(0, 8), 10);
		if (!isNaN(parsed) && parsed > 0) return parsed;
	}
	let hash = 0;
	for (let i = 0; i < code.length; i++) {
		hash = (hash << 5) - hash + code.charCodeAt(i);
		hash = Math.abs(hash);
	}
	return 1e5 + hash % 9e5;
}
async function registerWithSupabase(params) {
	const userPassword = params.password || "123456";
	const { data, error } = await supabase.auth.signUp({
		email: params.email,
		password: userPassword,
		options: { data: {
			name: params.name,
			role: params.role,
			world: params.world,
			avatar: params.avatar || (params.role === "professor" ? "🧑‍🏫" : "🦊"),
			discipline: params.discipline || "LIBRAS & Inclusão",
			classroom_code: params.classroomCode,
			senha: userPassword,
			streak: 1,
			lives: 5,
			xp: params.role === "professor" ? 2e3 : 100,
			level: params.role === "professor" ? 10 : 1,
			last_streak_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		} }
	});
	if (error) throw error;
	const authUser = data.user;
	if (!authUser) return null;
	try {
		await supabase.from("profiles").upsert({
			id: authUser.id,
			email: params.email,
			name: params.name,
			role: params.role,
			world: params.world,
			avatar: params.avatar || (params.role === "professor" ? "🧑‍🏫" : "🦊"),
			discipline: params.discipline || "LIBRAS & Inclusão",
			classroom_code: params.classroomCode,
			streak: 1,
			lives: 5,
			xp: params.role === "professor" ? 2e3 : 100,
			level: params.role === "professor" ? 10 : 1,
			last_streak_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		});
	} catch {}
	if (params.role === "aluno") try {
		const alunoPayload = {
			nome: params.name,
			matricula: params.email,
			celular: 0,
			nascimento: null,
			user_id: authUser.id,
			alunos_sala_id: null,
			senha: userPassword,
			pontuação_total: 100,
			pontuacao: 100
		};
		let { data: insertedAluno, error: insertError } = await supabase.from("alunos").insert(alunoPayload).select().maybeSingle();
		if (insertError) {
			const errorMsg = insertError.message?.toLowerCase() || "";
			if (errorMsg.includes("pontuacao")) delete alunoPayload.pontuacao;
			if (errorMsg.includes("senha")) delete alunoPayload.senha;
			if (errorMsg.includes("pontuação_total") || errorMsg.includes("pontuacao_total")) delete alunoPayload.pontuação_total;
			const retryResult = await supabase.from("alunos").insert(alunoPayload).select().maybeSingle();
			insertError = retryResult.error;
			insertedAluno = retryResult.data;
		}
		if (insertError) console.warn("Aviso ao inserir aluno na tabela:", insertError.message);
		if (params.classroomCode) await addAlunoToSalaInSupabase(authUser.id, params.classroomCode);
	} catch (e) {
		console.warn("Erro ao registrar aluno no Supabase:", e);
	}
	else try {
		const professorPassword = params.password || "123456";
		const { error: insertError } = await supabase.from("professor").insert({
			nome: params.name,
			email: params.email,
			senha: professorPassword,
			user_id: authUser.id,
			sala_id: null
		});
		if (insertError) console.warn("Aviso ao inserir professor na tabela:", insertError.message);
	} catch (e) {
		console.warn("Erro ao registrar professor no Supabase:", e);
	}
	return authUser;
}
async function loginWithSupabase(params) {
	if (!isSupabaseConfigured()) return null;
	const userPassword = params.password || "123456";
	const { data, error } = await supabase.auth.signInWithPassword({
		email: params.email,
		password: userPassword
	});
	if (error) throw error;
	if (data?.user && params.password) {
		try {
			await supabase.auth.updateUser({ data: { senha: params.password } });
		} catch {}
		try {
			await supabase.from("professor").update({ senha: params.password }).or(`user_id.eq.${data.user.id},email.eq.${params.email}`);
		} catch (e) {
			console.warn("Aviso ao sincronizar senha do professor no Supabase:", e);
		}
		try {
			await supabase.from("alunos").update({ senha: params.password }).or(`user_id.eq.${data.user.id},matricula.eq.${params.email}`);
		} catch {}
	}
	return data.user;
}
/**
* Cria ou atualiza a sala de aula na tabela 'sala' do Supabase
* e vincula o professor responsável através de professor.sala_id.
*/
async function createOrUpdateSalaInSupabase(classroom) {
	if (!isSupabaseConfigured()) return null;
	const numericCode = parseNumericClassroomCode(classroom.code);
	try {
		const { data: existingSala } = await supabase.from("sala").select("*").eq("codigo_sala", numericCode).maybeSingle();
		let salaRecord = existingSala;
		if (existingSala) {
			const { data: updated, error: updateErr } = await supabase.from("sala").update({ nome_sala: classroom.name }).eq("id", existingSala.id).select().single();
			if (!updateErr && updated) salaRecord = updated;
		} else {
			const payload = {
				codigo_sala: numericCode,
				nome_sala: classroom.name
			};
			if (classroom.id && classroom.id.includes("-") && classroom.id.length === 36) payload.id = classroom.id;
			const { data: created, error: createErr } = await supabase.from("sala").insert(payload).select().single();
			if (createErr) console.warn("Aviso ao criar sala no Supabase:", createErr.message);
			else salaRecord = created;
		}
		if (salaRecord?.id && classroom.teacherId) await supabase.from("professor").update({ sala_id: salaRecord.id }).or(`user_id.eq.${classroom.teacherId},id.eq.${classroom.teacherId}`);
		try {
			await supabase.from("classrooms").upsert({
				code: classroom.code,
				name: classroom.name,
				teacher_name: classroom.teacherName || "Professor",
				discipline: classroom.discipline || "LIBRAS & Inclusão",
				world: classroom.world === "ef2" ? "ef2" : "ef1",
				description: classroom.description || ""
			});
		} catch {}
		return salaRecord;
	} catch (err) {
		console.error("Erro na sincronização da sala com Supabase:", err);
		return null;
	}
}
/**
* Vincula um aluno a uma sala de aula no Supabase:
* 1. Localiza a sala pelo código numérico ou ID
* 2. Localiza o aluno na tabela 'alunos' (por user_id, id ou e-mail/matrícula)
* 3. Registra na tabela 'alunos_sala'
* 4. Atualiza a coluna alunos.alunos_sala_id
*/
async function addAlunoToSalaInSupabase(alunoIdentifier, salaCodeOrId) {
	if (!isSupabaseConfigured()) return {
		success: true,
		message: "Supabase não configurado. Salvo localmente."
	};
	try {
		let sala = null;
		const numericCode = parseNumericClassroomCode(salaCodeOrId);
		const { data: byCode } = await supabase.from("sala").select("*").eq("codigo_sala", numericCode).maybeSingle();
		if (byCode) sala = byCode;
		else if (salaCodeOrId.includes("-") && salaCodeOrId.length === 36) {
			const { data: byId } = await supabase.from("sala").select("*").eq("id", salaCodeOrId).maybeSingle();
			if (byId) sala = byId;
		}
		if (!sala) {
			const { data: byName } = await supabase.from("sala").select("*").ilike("nome_sala", `%${salaCodeOrId}%`).maybeSingle();
			if (byName) sala = byName;
		}
		if (!sala) {
			const { data: createdSala, error: createSalaErr } = await supabase.from("sala").insert({
				codigo_sala: numericCode,
				nome_sala: `Turma ${salaCodeOrId}`
			}).select().single();
			if (!createSalaErr && createdSala) sala = createdSala;
		}
		if (!sala) return {
			success: false,
			message: `Não foi possível encontrar ou registrar a sala "${salaCodeOrId}" no Supabase.`
		};
		let { data: aluno } = await supabase.from("alunos").select("*").or(`user_id.eq.${alunoIdentifier},id.eq.${alunoIdentifier},matricula.eq.${alunoIdentifier}`).maybeSingle();
		if (!aluno) {
			const { data: newAluno, error: newAlunoErr } = await supabase.from("alunos").insert({
				nome: "Aluno",
				matricula: alunoIdentifier,
				celular: 0,
				user_id: alunoIdentifier.includes("-") && alunoIdentifier.length === 36 ? alunoIdentifier : null,
				alunos_sala_id: null
			}).select().single();
			if (!newAlunoErr && newAluno) aluno = newAluno;
		}
		if (!aluno) return {
			success: false,
			message: "Registro do aluno não encontrado na tabela 'alunos' do Supabase."
		};
		const { data: existingLink } = await supabase.from("alunos_sala").select("*").eq("alunos_id", aluno.id).eq("sala_id", sala.id).maybeSingle();
		let linkId = existingLink?.id;
		if (!existingLink) {
			const { data: newLink, error: linkErr } = await supabase.from("alunos_sala").insert({
				id: crypto.randomUUID(),
				alunos_id: aluno.id,
				sala_id: sala.id
			}).select().single();
			if (linkErr) console.warn("Aviso ao vincular aluno_sala no Supabase:", linkErr.message);
			else if (newLink) linkId = newLink.id;
		}
		if (linkId) await supabase.from("alunos").update({ alunos_sala_id: linkId }).eq("id", aluno.id);
		try {
			await supabase.from("profiles").update({ classroom_code: String(sala.codigo_sala) }).eq("id", alunoIdentifier);
		} catch {}
		return {
			success: true,
			message: `Aluno vinculado à sala "${sala.nome_sala}" com sucesso no Supabase! 🎉`,
			sala,
			aluno
		};
	} catch (err) {
		console.error("Erro ao vincular aluno à sala no Supabase:", err);
		return {
			success: false,
			message: err.message || "Erro de conexão ao vincular aluno à sala no Supabase."
		};
	}
}
/**
* Remove o aluno da sala no Supabase (desvincula em alunos_sala e zera alunos_sala_id).
*/
async function removeAlunoFromSalaInSupabase(alunoIdentifier) {
	if (!isSupabaseConfigured()) return true;
	try {
		const { data: aluno } = await supabase.from("alunos").select("*").or(`user_id.eq.${alunoIdentifier},id.eq.${alunoIdentifier},matricula.eq.${alunoIdentifier}`).maybeSingle();
		if (!aluno) return false;
		await supabase.from("alunos_sala").delete().eq("alunos_id", aluno.id);
		await supabase.from("alunos").update({ alunos_sala_id: null }).eq("id", aluno.id);
		try {
			await supabase.from("profiles").update({ classroom_code: null }).eq("id", alunoIdentifier);
		} catch {}
		return true;
	} catch (err) {
		console.error("Erro ao desvincular aluno da sala no Supabase:", err);
		return false;
	}
}
/**
* Busca todas as salas de aula cadastradas no Supabase (tabela 'sala')
* junto com os dados dos professores e contagem de alunos matriculados.
*/
async function fetchSalasFromSupabase() {
	if (!isSupabaseConfigured()) return [];
	try {
		const { data: salas, error } = await supabase.from("sala").select("*");
		if (error || !salas) return [];
		const { data: profs } = await supabase.from("professor").select("*");
		const profsBySala = /* @__PURE__ */ new Map();
		if (profs) {
			for (const p of profs) if (p.sala_id) profsBySala.set(p.sala_id, p);
		}
		return salas.map((s) => {
			const prof = profsBySala.get(s.id);
			return {
				id: s.id,
				code: String(s.codigo_sala),
				name: s.nome_sala || `Sala ${s.codigo_sala}`,
				teacherId: prof?.user_id || prof?.id || "teacher_supabase",
				teacherName: prof?.nome || "Professor(a)",
				discipline: "LIBRAS & Inclusão",
				world: "all",
				description: `Código numérico de acesso: ${s.codigo_sala}`,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
	} catch (err) {
		console.warn("Erro ao buscar salas do Supabase:", err);
		return [];
	}
}
/**
* Busca todos os alunos cadastrados no Supabase (tabela 'alunos')
* incluindo as informações da sala em que estão matriculados.
*/
async function fetchAlunosFromSupabase() {
	if (!isSupabaseConfigured()) return [];
	try {
		const { data: alunos, error: errAlunos } = await supabase.from("alunos").select("*");
		if (errAlunos || !alunos) return [];
		const { data: alunosSala } = await supabase.from("alunos_sala").select("*");
		const { data: salas } = await supabase.from("sala").select("*");
		const salaById = /* @__PURE__ */ new Map();
		if (salas) for (const s of salas) salaById.set(s.id, s);
		const alunoToSalaMap = /* @__PURE__ */ new Map();
		if (alunosSala) {
			for (const as of alunosSala) if (as.alunos_id && as.sala_id) {
				const s = salaById.get(as.sala_id);
				alunoToSalaMap.set(as.alunos_id, {
					salaId: as.sala_id,
					codigoSala: s ? s.codigo_sala : null
				});
			}
		}
		return alunos.map((a) => {
			const link = alunoToSalaMap.get(a.id);
			return {
				id: a.id,
				userId: a.user_id,
				nome: a.nome,
				matricula: a.matricula,
				celular: a.celular,
				pontuacaoTotal: a.pontuação_total || 0,
				alunosSalaId: a.alunos_sala_id,
				salaId: link?.salaId || null,
				codigoSala: link?.codigoSala || null
			};
		});
	} catch (err) {
		console.warn("Erro ao buscar alunos do Supabase:", err);
		return [];
	}
}
async function fetchProfileFromSupabase(userId, email, userMetadata) {
	if (!isSupabaseConfigured()) return null;
	try {
		let profileData = null;
		try {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
			if (!error && data) profileData = data;
		} catch {}
		let alunoData = null;
		try {
			const isUUID = userId.includes("-") && userId.length === 36;
			const parts = [`matricula.eq.${email || userId}`];
			if (isUUID) parts.unshift(`user_id.eq.${userId}`, `id.eq.${userId}`);
			const { data: aluno } = await supabase.from("alunos").select("*").or(parts.join(",")).maybeSingle();
			if (aluno) alunoData = aluno;
		} catch {}
		let meta = userMetadata;
		if (!meta) try {
			const { data: authData } = await supabase.auth.getUser();
			if (authData?.user?.id === userId) meta = authData.user.user_metadata;
		} catch {}
		if (!profileData && !alunoData && !meta) return null;
		const emailVal = profileData?.email || alunoData?.matricula || meta?.email || email || "";
		const nameVal = profileData?.name || alunoData?.nome || meta?.name || "Aluno";
		const roleVal = profileData?.role || meta?.role || (alunoData ? "aluno" : "aluno");
		const worldVal = profileData?.world || meta?.world || "ef1";
		const avatarVal = profileData?.avatar || meta?.avatar || (roleVal === "professor" ? "🧑‍🏫" : "🦊");
		const streakVal = typeof profileData?.streak === "number" ? profileData.streak : typeof meta?.streak === "number" ? meta.streak : 1;
		const livesVal = typeof profileData?.lives === "number" ? profileData.lives : typeof meta?.lives === "number" ? meta.lives : 5;
		const xpVal = typeof profileData?.xp === "number" ? profileData.xp : typeof alunoData?.pontuação_total === "number" ? alunoData.pontuação_total : typeof alunoData?.pontuacao === "number" ? alunoData.pontuacao : typeof meta?.xp === "number" ? meta.xp : roleVal === "professor" ? 2e3 : 100;
		const lastStreakDateVal = profileData?.last_streak_date || meta?.lastStreakDate || meta?.last_streak_date || void 0;
		const lastLiveLostAtVal = profileData?.last_live_lost_at || meta?.lastLiveLostAt || meta?.last_live_lost_at || void 0;
		const classroomCodeVal = profileData?.classroom_code || alunoData?.codigo_sala || meta?.classroom_code || void 0;
		let completedLessons = [];
		if (userId.includes("-") && userId.length === 36) try {
			const { data: userLessons } = await supabase.from("user_completed_lessons").select("lesson_id, title, score, completed_at").eq("user_id", userId);
			if (userLessons && userLessons.length > 0) completedLessons = userLessons.map((l) => ({
				id: l.lesson_id,
				title: l.title || l.lesson_id,
				score: l.score ?? 0,
				completedAt: l.completed_at || (/* @__PURE__ */ new Date()).toISOString()
			}));
		} catch {}
		const userProfile = {
			id: userId,
			email: emailVal,
			name: nameVal,
			role: roleVal,
			world: worldVal,
			avatar: avatarVal,
			discipline: profileData?.discipline || meta?.discipline || void 0,
			level: profileData?.level || meta?.level || 1,
			xp: xpVal,
			streak: streakVal,
			lastStreakDate: lastStreakDateVal,
			lives: livesVal,
			lastLiveLostAt: lastLiveLostAtVal,
			phone: profileData?.phone || (alunoData?.celular ? String(alunoData?.celular) : void 0),
			birthDate: profileData?.birth_date || alunoData?.nascimento || void 0,
			document: profileData?.document || void 0,
			address: profileData?.address || void 0,
			classroomCode: classroomCodeVal,
			hasLoggedIn: true,
			lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
			completedLessons,
			createdAt: profileData?.created_at || (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			await supabase.from("profiles").upsert({
				id: userId,
				email: emailVal,
				name: nameVal,
				role: roleVal,
				world: worldVal,
				avatar: avatarVal,
				streak: streakVal,
				lives: livesVal,
				xp: xpVal,
				last_streak_date: lastStreakDateVal,
				classroom_code: classroomCodeVal
			});
		} catch {}
		return userProfile;
	} catch (err) {
		console.warn("Erro ao buscar perfil consolidado do Supabase:", err);
		return null;
	}
}
/**
* Atualiza a pontuação do aluno no banco de dados Supabase
* Grava na tabela 'alunos', na tabela 'profiles', e nos metadados do Supabase Auth.
*/
async function updateAlunoPontuacaoInSupabase(alunoIdentifier, pontuacao, completedLesson, email, gamification, allLessons) {
	if (!isSupabaseConfigured()) return true;
	try {
		const isUUID = alunoIdentifier.includes("-") && alunoIdentifier.length === 36;
		let filterParts = [`matricula.eq.${alunoIdentifier}`];
		if (isUUID) filterParts.unshift(`user_id.eq.${alunoIdentifier}`, `id.eq.${alunoIdentifier}`);
		if (email) filterParts.push(`matricula.eq.${email}`);
		const orFilter = filterParts.join(",");
		const updatePayloads = [
			{ pontuação_total: pontuacao },
			{ pontuacao },
			{ pontuacao_total: pontuacao }
		];
		for (const payload of updatePayloads) try {
			const { error } = await supabase.from("alunos").update(payload).or(orFilter);
			if (!error) break;
		} catch {}
		if (gamification) {
			const alunoGamificationPayloads = [
				{
					streak: gamification.streak,
					vidas: gamification.lives
				},
				{
					streak: gamification.streak,
					lives: gamification.lives
				},
				{
					ofensiva: gamification.streak,
					vidas: gamification.lives
				}
			];
			for (const payload of alunoGamificationPayloads) try {
				const { error } = await supabase.from("alunos").update(payload).or(orFilter);
				if (!error) break;
			} catch {}
		}
		let targetUserId = isUUID ? alunoIdentifier : null;
		if (!targetUserId) try {
			const { data: sessionData } = await supabase.auth.getSession();
			if (sessionData?.session?.user?.id) {
				if (!email || sessionData.session.user.email?.toLowerCase() === email.toLowerCase()) targetUserId = sessionData.session.user.id;
			}
		} catch {}
		if (!targetUserId && email) try {
			const { data: profRow } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
			if (profRow?.id) targetUserId = profRow.id;
		} catch {}
		if (!targetUserId && email) try {
			const { data: alunoRow } = await supabase.from("alunos").select("user_id").eq("matricula", email).maybeSingle();
			if (alunoRow?.user_id) targetUserId = alunoRow.user_id;
		} catch {}
		const effectiveId = targetUserId || alunoIdentifier;
		const lessonsToPersist = [];
		if (allLessons && allLessons.length > 0) lessonsToPersist.push(...allLessons);
		else if (completedLesson) lessonsToPersist.push(completedLesson);
		try {
			const profileData = {
				id: effectiveId,
				xp: pontuacao,
				last_active_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (email) profileData.email = email;
			if (gamification) {
				profileData.streak = gamification.streak;
				profileData.lives = gamification.lives;
				if (gamification.lastStreakDate) profileData.last_streak_date = gamification.lastStreakDate;
				if (gamification.lastLiveLostAt) profileData.last_live_lost_at = gamification.lastLiveLostAt;
			}
			if (lessonsToPersist.length > 0) profileData.completed_lessons = lessonsToPersist;
			const { error: upsertErr } = await supabase.from("profiles").upsert(profileData, { onConflict: "id" });
			if (upsertErr) await supabase.from("profiles").update(profileData).eq("id", effectiveId);
		} catch {}
		try {
			const authMetadataUpdate = { xp: pontuacao };
			if (gamification) {
				authMetadataUpdate.streak = gamification.streak;
				authMetadataUpdate.lives = gamification.lives;
				if (gamification.lastStreakDate) authMetadataUpdate.lastStreakDate = gamification.lastStreakDate;
				if (gamification.lastLiveLostAt) authMetadataUpdate.lastLiveLostAt = gamification.lastLiveLostAt;
			}
			if (lessonsToPersist.length > 0) authMetadataUpdate.completedLessons = lessonsToPersist;
			await supabase.auth.updateUser({ data: authMetadataUpdate });
		} catch {}
		if (lessonsToPersist.length > 0 && targetUserId) try {
			const records = lessonsToPersist.map((les) => ({
				user_id: targetUserId,
				lesson_id: les.id,
				title: les.title,
				score: les.score,
				completed_at: les.completedAt || (/* @__PURE__ */ new Date()).toISOString()
			}));
			await supabase.from("user_completed_lessons").upsert(records, { onConflict: "user_id,lesson_id" });
		} catch (e) {
			console.warn("Aviso ao salvar em user_completed_lessons:", e);
		}
		return true;
	} catch (err) {
		console.warn("Aviso ao atualizar pontuação do aluno no Supabase:", err);
		return false;
	}
}
/**
* Busca as lições concluídas de um conjunto de usuários (alunos) a partir da
* tabela 'user_completed_lessons' e da tabela 'profiles' no Supabase.
* Retorna um Map indexado tanto por ID quanto por E-mail para match instantâneo.
*/
async function fetchCompletedLessonsForUsers(studentsOrIds) {
	const result = /* @__PURE__ */ new Map();
	if (!isSupabaseConfigured() || studentsOrIds.length === 0) return result;
	try {
		const studentInfoList = studentsOrIds.map((item) => typeof item === "string" ? {
			id: item,
			email: item.includes("@") ? item : void 0
		} : item);
		const allIds = /* @__PURE__ */ new Set();
		const allEmails = /* @__PURE__ */ new Set();
		const uuidToAliasesMap = /* @__PURE__ */ new Map();
		for (const s of studentInfoList) {
			if (s.id) {
				allIds.add(s.id);
				if (s.id.includes("-") && s.id.length === 36) {
					if (!uuidToAliasesMap.has(s.id)) uuidToAliasesMap.set(s.id, /* @__PURE__ */ new Set());
					uuidToAliasesMap.get(s.id).add(s.id);
				}
			}
			if (s.email) allEmails.add(s.email.toLowerCase());
		}
		try {
			const { data: profs } = await supabase.from("profiles").select("id, email, completed_lessons");
			if (profs && Array.isArray(profs)) for (const p of profs) {
				const pId = p.id;
				const pEmail = p.email?.toLowerCase();
				if (!uuidToAliasesMap.has(pId)) uuidToAliasesMap.set(pId, /* @__PURE__ */ new Set());
				uuidToAliasesMap.get(pId).add(pId);
				if (pEmail) uuidToAliasesMap.get(pId).add(pEmail);
				for (const s of studentInfoList) {
					const matchId = s.id === pId;
					const matchEmail = s.email && s.email.toLowerCase() === pEmail;
					if (matchId || matchEmail) {
						uuidToAliasesMap.get(pId).add(s.id);
						if (s.email) uuidToAliasesMap.get(pId).add(s.email.toLowerCase());
						if (Array.isArray(p.completed_lessons) && p.completed_lessons.length > 0) {
							const lessons = p.completed_lessons.map((cl) => ({
								id: cl.id,
								title: cl.title || cl.id,
								score: cl.score ?? 0,
								completedAt: cl.completedAt || cl.completed_at || (/* @__PURE__ */ new Date()).toISOString()
							}));
							result.set(s.id, lessons);
							if (s.email) result.set(s.email.toLowerCase(), lessons);
							result.set(pId, lessons);
						}
					}
				}
			}
		} catch {}
		try {
			const { data: alunos } = await supabase.from("alunos").select("id, user_id, matricula");
			if (alunos && Array.isArray(alunos)) for (const a of alunos) {
				const aUserId = a.user_id;
				const aEmail = a.matricula?.toLowerCase();
				if (aUserId && aUserId.includes("-") && aUserId.length === 36) {
					if (!uuidToAliasesMap.has(aUserId)) uuidToAliasesMap.set(aUserId, /* @__PURE__ */ new Set());
					uuidToAliasesMap.get(aUserId).add(a.id);
					if (aEmail) uuidToAliasesMap.get(aUserId).add(aEmail);
					for (const s of studentInfoList) if (s.id === a.id || s.id === aUserId || s.email && s.email.toLowerCase() === aEmail) {
						uuidToAliasesMap.get(aUserId).add(s.id);
						if (s.email) uuidToAliasesMap.get(aUserId).add(s.email.toLowerCase());
					}
				}
			}
		} catch {}
		const searchUuids = Array.from(uuidToAliasesMap.keys()).filter((u) => u.includes("-") && u.length === 36);
		if (searchUuids.length > 0) {
			const { data, error } = await supabase.from("user_completed_lessons").select("user_id, lesson_id, title, score, completed_at").in("user_id", searchUuids);
			if (!error && data && data.length > 0) for (const row of data) {
				const uid = row.user_id;
				const lessonItem = {
					id: row.lesson_id,
					title: row.title || row.lesson_id,
					score: row.score ?? 0,
					completedAt: row.completed_at || (/* @__PURE__ */ new Date()).toISOString()
				};
				const aliases = uuidToAliasesMap.get(uid) || /* @__PURE__ */ new Set([uid]);
				for (const alias of aliases) {
					if (!result.has(alias)) result.set(alias, []);
					const list = result.get(alias);
					if (!list.some((l) => l.id === lessonItem.id)) list.push(lessonItem);
				}
			}
		}
	} catch (err) {
		console.warn("Aviso ao buscar lições concluídas dos alunos no Supabase:", err);
	}
	return result;
}
var STORAGE_KEY = "sinaliza_mais_users_v1";
var CLASSROOMS_KEY = "sinaliza_mais_classrooms_v1";
var ACTIVE_USER_KEY = "sinaliza_mais_active_user_id_v1";
var DEFAULT_CLASSROOMS = [{
	id: "cls_1",
	code: "LIBRAS2026",
	name: "Turma Inclusiva - 5º Ano A",
	teacherId: "usr_prof_1",
	teacherName: "Profe. Helena Silva",
	discipline: "LIBRAS & Inclusão",
	world: "ef1",
	description: "Turma matutina de introdução aos sinais básicos, cores e primeiros diálogos em LIBRAS.",
	createdAt: "2026-09-01T10:00:00.000Z"
}, {
	id: "cls_2",
	code: "TEEN-LIBRAS",
	name: "Sinais Avançados - 8º Ano",
	teacherId: "usr_prof_1",
	teacherName: "Profe. Helena Silva",
	discipline: "LIBRAS & Inclusão",
	world: "ef2",
	description: "Turma vespertina com foco em conversação, expressões faciais e desafios práticos.",
	createdAt: "2026-09-05T14:00:00.000Z"
}];
var DEFAULT_USERS = [
	{
		id: "usr_1",
		name: "Luizinho Explorer",
		email: "luizinho@sinalizamais.com",
		password: "123",
		role: "aluno",
		world: "ef1",
		avatar: "🦊",
		level: 3,
		xp: 450,
		streak: 5,
		phone: "(11) 98765-4321",
		birthDate: "2015-05-12",
		document: "123.456.789-00",
		address: "Rua das Flores, 123 - São Paulo/SP",
		classroomCode: "LIBRAS2026",
		lastActiveAt: (/* @__PURE__ */ new Date(Date.now() - 3e5)).toISOString(),
		completedLessons: [
			{
				id: "les_1",
				title: "Oi & Tchau em LIBRAS",
				score: 100,
				completedAt: "2026-09-01"
			},
			{
				id: "les_2",
				title: "Apresentação e Meu Nome",
				score: 90,
				completedAt: "2026-09-03"
			},
			{
				id: "les_3",
				title: "Cores Quentes (Vermelho, Amarelo)",
				score: 100,
				completedAt: "2026-09-05"
			}
		],
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "usr_2",
		name: "Nova Teen",
		email: "nova@sinalizamais.com",
		password: "123",
		role: "aluno",
		world: "ef2",
		avatar: "🚀",
		level: 7,
		xp: 1280,
		streak: 12,
		phone: "(21) 99887-6655",
		birthDate: "2011-10-20",
		document: "987.654.321-11",
		address: "Av. Paulista, 1000 - São Paulo/SP",
		classroomCode: "TEEN-LIBRAS",
		lastActiveAt: (/* @__PURE__ */ new Date(Date.now() - 15e5)).toISOString(),
		completedLessons: [
			{
				id: "trail_node_1",
				title: "Oi & Tchau em LIBRAS",
				score: 100,
				completedAt: "2026-09-01"
			},
			{
				id: "trail_node_2",
				title: "Meu nome é… em LIBRAS",
				score: 95,
				completedAt: "2026-09-02"
			},
			{
				id: "trail_node_3",
				title: "Revisão relâmpago: Saudações",
				score: 100,
				completedAt: "2026-09-03"
			},
			{
				id: "trail_node_4",
				title: "Desafio do Chefe: Cumprimentos",
				score: 100,
				completedAt: "2026-09-04"
			},
			{
				id: "trail_node_5",
				title: "Cores quentes em LIBRAS",
				score: 90,
				completedAt: "2026-09-05"
			},
			{
				id: "trail_node_6",
				title: "Cores frias em LIBRAS",
				score: 95,
				completedAt: "2026-09-06"
			},
			{
				id: "trail_node_7",
				title: "Desafio do espelho com IA",
				score: 100,
				completedAt: "2026-09-07"
			},
			{
				id: "trail_node_8",
				title: "Desafio do Chefe: Arco-íris",
				score: 100,
				completedAt: "2026-09-08"
			},
			{
				id: "trail_node_9",
				title: "Bichos de casa em LIBRAS",
				score: 90,
				completedAt: "2026-09-09"
			},
			{
				id: "trail_node_10",
				title: "Bichos da fazenda em LIBRAS",
				score: 100,
				completedAt: "2026-09-10"
			},
			{
				id: "trail_node_11",
				title: "Revisão relâmpago: Animais",
				score: 95,
				completedAt: "2026-09-11"
			},
			{
				id: "trail_node_12",
				title: "Desafio do Chefe: Castelo do Saber",
				score: 100,
				completedAt: "2026-09-11"
			}
		],
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "usr_prof_1",
		name: "Profe. Helena Silva",
		email: "helena.prof@sinalizamais.com",
		password: "123",
		role: "professor",
		discipline: "LIBRAS & Inclusão",
		world: "ef1",
		avatar: "🧑‍🏫",
		level: 15,
		xp: 4500,
		streak: 30,
		phone: "(11) 91122-3344",
		birthDate: "1988-03-15",
		document: "456.789.123-55",
		address: "Alameda dos Anjos, 45 - São Paulo/SP",
		completedLessons: [],
		lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}
];
/**
* Garante que os dados padrão (usuários e salas) sempre existam no localStorage.
*/
function seedDefaultUsers() {
	if (typeof window === "undefined") return;
	try {
		const rawUsers = localStorage.getItem(STORAGE_KEY);
		if (!rawUsers) localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
		else {
			const existing = JSON.parse(rawUsers);
			let changed = false;
			for (const defaultUser of DEFAULT_USERS) {
				const idx = existing.findIndex((u) => u.id === defaultUser.id);
				if (idx === -1) {
					existing.push(defaultUser);
					changed = true;
				} else {
					if (!existing[idx].password && defaultUser.password) {
						existing[idx].password = defaultUser.password;
						changed = true;
					}
					if (!existing[idx].classroomCode && defaultUser.classroomCode) {
						existing[idx].classroomCode = defaultUser.classroomCode;
						changed = true;
					}
				}
			}
			if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
		}
		seedDefaultClassrooms();
		syncClassroomsFromSupabase().catch((err) => console.warn("Sincronização em background Supabase:", err));
	} catch (err) {
		console.error("Erro ao fazer seed:", err);
	}
}
function seedDefaultClassrooms() {
	if (typeof window === "undefined") return;
	try {
		const rawClassrooms = localStorage.getItem(CLASSROOMS_KEY);
		if (!rawClassrooms) localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
		else {
			const existing = JSON.parse(rawClassrooms);
			let changed = false;
			for (const defClassroom of DEFAULT_CLASSROOMS) if (!existing.some((c) => c.id === defClassroom.id || c.code === defClassroom.code)) {
				existing.push(defClassroom);
				changed = true;
			}
			if (changed) localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(existing));
		}
	} catch (err) {
		console.error("Erro ao fazer seed das salas:", err);
	}
}
var MAX_LIVES = 5;
var LIVES_REGEN_MINUTES = 60;
/** Retorna a data atual no formato YYYY-MM-DD */
function getTodayDate() {
	return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
/**
* Calcula o novo valor do streak considerando a data do último incremento:
* - Mesmo dia  → mantém o streak atual (não incrementa duas vezes)
* - Dia anterior → incrementa streak
* - Mais de 1 dia atrás → reseta para 1 (sequência quebrada)
* - Sem data anterior → seta 1
*/
function computeNewStreak(currentStreak, lastStreakDate) {
	const today = getTodayDate();
	if (!lastStreakDate) return {
		streak: 1,
		lastStreakDate: today
	};
	const last = new Date(lastStreakDate);
	const now = new Date(today);
	const diffDays = Math.round((now.getTime() - last.getTime()) / 864e5);
	if (diffDays === 0) return {
		streak: currentStreak,
		lastStreakDate
	};
	else if (diffDays === 1) return {
		streak: currentStreak + 1,
		lastStreakDate: today
	};
	else return {
		streak: 1,
		lastStreakDate: today
	};
}
/**
* Regenera vidas passivamente com base no tempo decorrido desde a última perda.
* A cada LIVES_REGEN_MINUTES minutos sem jogar, uma vida é recuperada (máx MAX_LIVES).
*/
function regenerateLives(user) {
	const currentLives = user.lives ?? MAX_LIVES;
	if (currentLives >= MAX_LIVES) return {
		lives: MAX_LIVES,
		lastLiveLostAt: user.lastLiveLostAt
	};
	if (!user.lastLiveLostAt) return { lives: MAX_LIVES };
	const diffMs = Date.now() - new Date(user.lastLiveLostAt).getTime();
	const diffMinutes = Math.floor(diffMs / 6e4);
	const livesRegained = Math.floor(diffMinutes / LIVES_REGEN_MINUTES);
	if (livesRegained <= 0) return {
		lives: currentLives,
		lastLiveLostAt: user.lastLiveLostAt
	};
	const newLives = Math.min(MAX_LIVES, currentLives + livesRegained);
	return {
		lives: newLives,
		lastLiveLostAt: newLives >= MAX_LIVES ? void 0 : user.lastLiveLostAt
	};
}
/**
* Desconta 1 vida do usuário ativo quando ele erra uma questão.
* Persiste no localStorage e retorna o novo número de vidas.
*/
function loseLife(userId) {
	const users = getUsers();
	const idx = users.findIndex((u) => u.id === userId);
	if (idx === -1) return MAX_LIVES;
	const user = users[idx];
	const { lives: currentLives } = regenerateLives(user);
	const newLives = Math.max(0, currentLives - 1);
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	users[idx] = {
		...user,
		lives: newLives,
		lastLiveLostAt: newLives < MAX_LIVES ? nowIso : void 0,
		lastActiveAt: nowIso
	};
	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
		notifyUserChanges({
			type: "loseLife",
			userId,
			lives: newLives
		});
		if (user.role === "aluno") updateAlunoPontuacaoInSupabase(user.id, user.xp ?? 0, void 0, user.email, {
			streak: user.streak ?? 1,
			lives: newLives,
			lastStreakDate: user.lastStreakDate,
			lastLiveLostAt: newLives < MAX_LIVES ? nowIso : void 0
		}).catch((err) => console.warn("Aviso ao sincronizar vidas no Supabase:", err));
	}
	return newLives;
}
function getMaxLives() {
	return MAX_LIVES;
}
function getUsers() {
	if (typeof window === "undefined") return DEFAULT_USERS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
			return DEFAULT_USERS;
		}
		return JSON.parse(raw);
	} catch (err) {
		console.error("Erro ao carregar usuários:", err);
		return DEFAULT_USERS;
	}
}
function saveUser(userData) {
	const users = getUsers();
	if (!userData.id) {
		if (users.some((u) => u.email.toLowerCase() === userData.email.trim().toLowerCase())) throw new Error("Este e-mail já está cadastrado no sistema.");
	}
	const existingIndex = users.findIndex((u) => userData.id && u.id === userData.id || u.email.toLowerCase() === userData.email.toLowerCase());
	let updatedUser;
	if (existingIndex >= 0) {
		const prev = users[existingIndex];
		updatedUser = {
			...prev,
			...userData,
			email: userData.email.trim().toLowerCase(),
			name: userData.name.trim(),
			role: userData.role || prev.role || "aluno",
			discipline: userData.discipline !== void 0 ? userData.discipline : prev.discipline,
			level: userData.level !== void 0 ? userData.level : prev.level ?? 1,
			xp: userData.xp !== void 0 ? userData.xp : prev.xp ?? 100,
			streak: userData.streak !== void 0 ? userData.streak : prev.streak ?? 1,
			lives: userData.lives !== void 0 ? userData.lives : prev.lives ?? 5,
			lastStreakDate: userData.lastStreakDate !== void 0 ? userData.lastStreakDate : prev.lastStreakDate,
			lastLiveLostAt: userData.lastLiveLostAt !== void 0 ? userData.lastLiveLostAt : prev.lastLiveLostAt,
			completedLessons: userData.completedLessons !== void 0 ? userData.completedLessons : prev.completedLessons ?? [],
			lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		users[existingIndex] = updatedUser;
	} else {
		updatedUser = {
			id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
			name: userData.name.trim(),
			email: userData.email.trim().toLowerCase(),
			password: userData.password || "",
			role: userData.role || "aluno",
			discipline: userData.discipline || "",
			world: userData.world || "ef1",
			avatar: userData.avatar || (userData.role === "professor" ? "🧑‍🏫" : userData.world === "ef2" ? "🚀" : "🦊"),
			level: userData.level || (userData.role === "professor" ? 10 : 1),
			xp: userData.xp !== void 0 ? userData.xp : userData.role === "professor" ? 2e3 : 100,
			streak: userData.streak !== void 0 ? userData.streak : 1,
			lives: userData.lives !== void 0 ? userData.lives : 5,
			lastStreakDate: userData.lastStreakDate,
			lastLiveLostAt: userData.lastLiveLostAt,
			completedLessons: userData.completedLessons || [],
			classroomCode: userData.classroomCode || "",
			lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		users.push(updatedUser);
	}
	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
		notifyUserChanges({
			type: "saveUser",
			user: updatedUser
		});
		if (updatedUser.role === "aluno") {
			const pontuacao = updatedUser.xp ?? 0;
			const lastLesson = updatedUser.completedLessons?.[updatedUser.completedLessons.length - 1];
			updateAlunoPontuacaoInSupabase(updatedUser.id, pontuacao, lastLesson ? {
				id: lastLesson.id,
				title: lastLesson.title,
				score: lastLesson.score
			} : void 0, updatedUser.email, {
				streak: updatedUser.streak,
				lives: updatedUser.lives ?? 5,
				lastStreakDate: updatedUser.lastStreakDate,
				lastLiveLostAt: updatedUser.lastLiveLostAt
			}, updatedUser.completedLessons).catch((err) => console.warn("Aviso ao sincronizar pontuação no Supabase:", err));
		}
	}
	return updatedUser;
}
function deleteUser(userId) {
	let users = getUsers();
	users = users.filter((u) => u.id !== userId);
	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
		if (getActiveUserId() === userId) logoutUser();
		else notifyUserChanges({
			type: "deleteUser",
			userId
		});
	}
}
function getActiveUserId() {
	if (typeof window === "undefined") return null;
	const activeId = localStorage.getItem(ACTIVE_USER_KEY);
	if (!activeId) return null;
	return activeId;
}
function setActiveUserId(userId) {
	if (typeof window === "undefined") return;
	localStorage.setItem(ACTIVE_USER_KEY, userId);
	notifyUserChanges({
		type: "setActiveUser",
		userId
	});
}
function getActiveUser() {
	const activeId = getActiveUserId();
	if (!activeId) return null;
	return getUsers().find((u) => u.id === activeId) || null;
}
function logoutUser() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ACTIVE_USER_KEY);
	notifyUserChanges({ type: "logout" });
}
function loginUser(email, password) {
	const users = getUsers();
	const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase() && (!password || u.password === password));
	if (idx === -1) return null;
	let user = users[idx];
	if (!user.hasLoggedIn) user = {
		...user,
		completedLessons: [],
		hasLoggedIn: true,
		lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	else user = {
		...user,
		lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	users[idx] = user;
	if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
	setActiveUserId(user.id);
	return user;
}
function getClassrooms() {
	if (typeof window === "undefined") return DEFAULT_CLASSROOMS;
	try {
		const raw = localStorage.getItem(CLASSROOMS_KEY);
		if (!raw) {
			localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
			return DEFAULT_CLASSROOMS;
		}
		return JSON.parse(raw);
	} catch (err) {
		console.error("Erro ao carregar salas de aula:", err);
		return DEFAULT_CLASSROOMS;
	}
}
function getClassroomByCode(code) {
	if (!code) return null;
	const trimmed = code.trim().toUpperCase();
	return getClassrooms().find((c) => c.code.toUpperCase() === trimmed) || null;
}
function generateRandomClassroomCode() {
	return Math.floor(1e5 + Math.random() * 9e5).toString();
}
function saveClassroom(classroomData) {
	const classrooms = getClassrooms();
	const code = classroomData.code ? classroomData.code.trim().toUpperCase() : generateRandomClassroomCode();
	if (classrooms.find((c) => c.code.toUpperCase() === code && c.id !== classroomData.id)) {
		if (!classroomData.code) return saveClassroom(classroomData);
		throw new Error(`O código de sala "${code}" já está em uso por outra turma.`);
	}
	code.toUpperCase();
	let updatedClassroom;
	const existingIdx = classrooms.findIndex((c) => classroomData.id && c.id === classroomData.id);
	if (existingIdx >= 0) {
		const oldCode = classrooms[existingIdx].code;
		updatedClassroom = {
			...classrooms[existingIdx],
			...classroomData,
			name: classroomData.name.trim(),
			code
		};
		classrooms[existingIdx] = updatedClassroom;
		if (oldCode !== code) {
			const users = getUsers();
			let changed = false;
			for (let i = 0; i < users.length; i++) if (users[i].classroomCode === oldCode) {
				users[i].classroomCode = code;
				changed = true;
			}
			if (changed && typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
		}
	} else {
		updatedClassroom = {
			id: classroomData.id || `cls_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
			code,
			name: classroomData.name.trim(),
			teacherId: classroomData.teacherId,
			teacherName: classroomData.teacherName || "Professor",
			discipline: classroomData.discipline || "LIBRAS",
			world: classroomData.world || "all",
			description: classroomData.description || "",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		classrooms.push(updatedClassroom);
	}
	if (typeof window !== "undefined") {
		localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(classrooms));
		notifyUserChanges({
			type: "saveClassroom",
			classroom: updatedClassroom
		});
		createOrUpdateSalaInSupabase(updatedClassroom).catch((err) => console.warn("Aviso ao salvar sala no Supabase:", err));
	}
	return updatedClassroom;
}
function deleteClassroom(classroomId) {
	const classrooms = getClassrooms();
	const target = classrooms.find((c) => c.id === classroomId);
	if (!target) return;
	const filtered = classrooms.filter((c) => c.id !== classroomId);
	if (typeof window !== "undefined") {
		localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(filtered));
		const users = getUsers();
		let changed = false;
		for (let i = 0; i < users.length; i++) if (users[i].classroomCode === target.code) {
			users[i].classroomCode = void 0;
			changed = true;
		}
		if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
		notifyUserChanges({
			type: "deleteClassroom",
			classroomId
		});
	}
}
/**
* Retorna todos os alunos matriculados em uma sala específica.
*/
function getStudentsInClassroom(classroomCode) {
	if (!classroomCode) return [];
	const normalized = classroomCode.trim().toUpperCase();
	return getUsers().filter((u) => u.role === "aluno" && u.classroomCode && u.classroomCode.toUpperCase() === normalized);
}
/**
* O aluno entra em uma sala existente através do código.
*/
function joinClassroom(studentId, code) {
	const normalizedCode = code.trim().toUpperCase();
	const classroom = getClassroomByCode(normalizedCode);
	if (!classroom) return {
		success: false,
		message: `A sala com código "${normalizedCode}" não foi encontrada. Verifique com seu professor.`
	};
	const users = getUsers();
	const idx = users.findIndex((u) => u.id === studentId);
	if (idx === -1) return {
		success: false,
		message: "Usuário não encontrado."
	};
	if (users[idx].classroomCode?.toUpperCase() === normalizedCode) return {
		success: true,
		message: `Você já está matriculado na sala "${classroom.name}"!`,
		classroom
	};
	users[idx] = {
		...users[idx],
		classroomCode: normalizedCode,
		lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
		notifyUserChanges({
			type: "joinClassroom",
			studentId,
			code: normalizedCode
		});
		addAlunoToSalaInSupabase(studentId, normalizedCode).catch((err) => console.warn("Aviso ao vincular aluno na sala do Supabase:", err));
	}
	return {
		success: true,
		message: `Você entrou com sucesso na sala "${classroom.name}" (${classroom.teacherName})! 🎉`,
		classroom
	};
}
/**
* Remove o aluno de sua sala atual.
*/
function leaveClassroom(studentId) {
	const users = getUsers();
	const idx = users.findIndex((u) => u.id === studentId);
	if (idx >= 0) {
		users[idx] = {
			...users[idx],
			classroomCode: void 0,
			lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
			notifyUserChanges({
				type: "leaveClassroom",
				studentId
			});
			removeAlunoFromSalaInSupabase(studentId).catch((err) => console.warn("Aviso ao remover aluno da sala no Supabase:", err));
		}
	}
}
/**
* Sincroniza salas e alunos cadastrados no Supabase com o armazenamento local,
* garantindo que salas criadas por professores apareçam para todos os alunos.
*/
async function syncClassroomsFromSupabase() {
	if (typeof window === "undefined") return;
	try {
		const remoteSalas = await fetchSalasFromSupabase();
		if (remoteSalas && remoteSalas.length > 0) {
			const local = getClassrooms();
			let changed = false;
			for (const rem of remoteSalas) {
				const idx = local.findIndex((c) => c.code === rem.code || c.id === rem.id);
				if (idx === -1) {
					local.push(rem);
					changed = true;
				} else {
					local[idx] = {
						...local[idx],
						...rem
					};
					changed = true;
				}
			}
			if (changed) {
				localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(local));
				notifyUserChanges({ type: "syncClassrooms" });
			}
		}
		const remoteAlunos = await fetchAlunosFromSupabase();
		if (remoteAlunos && remoteAlunos.length > 0) {
			const localUsers = getUsers();
			let changed = false;
			for (const ra of remoteAlunos) {
				const uIdx = localUsers.findIndex((u) => ra.userId && u.id === ra.userId || u.id === ra.id || u.email.toLowerCase() === ra.matricula.toLowerCase());
				const salaCode = ra.codigoSala ? String(ra.codigoSala) : void 0;
				if (uIdx >= 0) {
					const prev = localUsers[uIdx];
					const newXp = Math.max(prev.xp || 0, ra.pontuacaoTotal || 100);
					if (salaCode && prev.classroomCode !== salaCode) {
						prev.classroomCode = salaCode;
						changed = true;
					}
					if (ra.userId && prev.id !== ra.userId) {
						prev.id = ra.userId;
						changed = true;
					}
					if (prev.xp !== newXp) {
						prev.xp = newXp;
						changed = true;
					}
				} else {
					localUsers.push({
						id: ra.userId || ra.id,
						name: ra.nome,
						email: ra.matricula,
						role: "aluno",
						world: "ef1",
						avatar: "🦊",
						level: 1,
						xp: ra.pontuacaoTotal || 100,
						streak: 1,
						classroomCode: salaCode,
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					});
					changed = true;
				}
			}
			if (changed) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(localUsers));
				notifyUserChanges({ type: "syncAlunos" });
			}
		}
	} catch (err) {
		console.warn("Erro ao sincronizar dados com Supabase:", err);
	}
}
/**
* Permite ao professor desvincular um aluno da sala.
*/
function removeStudentFromClassroom(studentId) {
	leaveClassroom(studentId);
}
/**
* Determina se um usuário está online no momento:
* - É o usuário ativo da sessão local atual, OU
* - Teve atividade registrada nos últimos 15 minutos.
*/
function isUserOnline(user) {
	const activeId = getActiveUserId();
	if (activeId && activeId === user.id) return true;
	if (user.lastActiveAt) return Date.now() - new Date(user.lastActiveAt).getTime() <= 9e5;
	return false;
}
function notifyUserChanges(detail) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("sinaliza-mais:user-changed", { detail }));
}
function subscribeToUserChanges(callback) {
	if (typeof window === "undefined") return () => {};
	const handler = () => callback();
	window.addEventListener("sinaliza-mais:user-changed", handler);
	window.addEventListener("storage", handler);
	return () => {
		window.removeEventListener("sinaliza-mais:user-changed", handler);
		window.removeEventListener("storage", handler);
	};
}
var onUserChange = subscribeToUserChanges;
var ALL_TRAIL_ACTIVITIES = [
	{
		nodeId: 1,
		world: 1,
		title: "Letras A, B, C",
		subtitle: "Primeiras Letras em LIBRAS",
		icon: "🦫",
		kind: "licao"
	},
	{
		nodeId: 2,
		world: 1,
		title: "Letras D, E, F",
		subtitle: "Apresentação e Meu Nome",
		icon: "🦖",
		kind: "licao"
	},
	{
		nodeId: 3,
		world: 1,
		title: "Revisão: A, B, C",
		subtitle: "Revisão relâmpago: Saudações",
		icon: "⚡",
		kind: "revisao"
	},
	{
		nodeId: 4,
		world: 1,
		title: "Chefe: D, E, F",
		subtitle: "Desafio do Chefe: Cumprimentos",
		icon: "🏆",
		kind: "chefe"
	},
	{
		nodeId: 5,
		world: 1,
		title: "Letras G, H, I",
		subtitle: "Cores Quentes em LIBRAS",
		icon: "🦒",
		kind: "licao"
	},
	{
		nodeId: 6,
		world: 1,
		title: "Letras J, K, L",
		subtitle: "Cores Frias em LIBRAS",
		icon: "🦁",
		kind: "licao"
	},
	{
		nodeId: 7,
		world: 1,
		title: "Espelho IA: G, H, I",
		subtitle: "Desafio do espelho com IA",
		icon: "🪞",
		kind: "espelho"
	},
	{
		nodeId: 8,
		world: 1,
		title: "Chefe: J, K, L",
		subtitle: "Desafio do Chefe: Arco-íris",
		icon: "👑",
		kind: "chefe"
	},
	{
		nodeId: 9,
		world: 1,
		title: "Letras M, N, O",
		subtitle: "Bichos de casa em LIBRAS",
		icon: "🐵",
		kind: "licao"
	},
	{
		nodeId: 10,
		world: 1,
		title: "Letras P, Q, R",
		subtitle: "Bichos da fazenda em LIBRAS",
		icon: "🐼",
		kind: "licao"
	},
	{
		nodeId: 11,
		world: 1,
		title: "Revisão: M, N, O",
		subtitle: "Revisão relâmpago: Animais",
		icon: "⚡",
		kind: "revisao"
	},
	{
		nodeId: 12,
		world: 1,
		title: "Chefe Mundo 1: P, Q, R",
		subtitle: "Desafio do Chefe: Castelo do Saber",
		icon: "🏰",
		kind: "chefe"
	},
	{
		nodeId: 13,
		world: 2,
		title: "Letras S, T, U",
		subtitle: "Ilha dos Bichos Aventureiros",
		icon: "🐸",
		kind: "licao"
	},
	{
		nodeId: 14,
		world: 2,
		title: "Letras V, W, X",
		subtitle: "Sinais Avançados de Aventura",
		icon: "🐮",
		kind: "licao"
	},
	{
		nodeId: 15,
		world: 2,
		title: "Revisão: S, T, U",
		subtitle: "Revisão relâmpago: Bichos II",
		icon: "⚡",
		kind: "revisao"
	},
	{
		nodeId: 16,
		world: 2,
		title: "Chefe: V, W, X",
		subtitle: "Desafio do Chefe Aventureiro",
		icon: "🏠",
		kind: "chefe"
	},
	{
		nodeId: 17,
		world: 2,
		title: "Letras Y, Z, A",
		subtitle: "Ilha dos Sinais Dinâmicos",
		icon: "🦬",
		kind: "licao"
	},
	{
		nodeId: 18,
		world: 2,
		title: "Dinâmicos: H, J, Z",
		subtitle: "Movimentos & Polegar",
		icon: "🔄",
		kind: "licao"
	},
	{
		nodeId: 19,
		world: 2,
		title: "Espelho IA: F, T, S",
		subtitle: "Câmera e Visão Computacional",
		icon: "🪞",
		kind: "espelho"
	},
	{
		nodeId: 20,
		world: 2,
		title: "Chefe: K, P, D",
		subtitle: "Desafio do Guardião dos Sinais",
		icon: "🕊️",
		kind: "chefe"
	},
	{
		nodeId: 21,
		world: 2,
		title: "Dedos Unidos: R, U, V",
		subtitle: "Portão Real do Trono A-Z",
		icon: "✌️",
		kind: "licao"
	},
	{
		nodeId: 22,
		world: 2,
		title: "Dedos p/ Baixo: M, N, W",
		subtitle: "Configurações de Mão Invertidas",
		icon: "👇",
		kind: "licao"
	},
	{
		nodeId: 23,
		world: 2,
		title: "Super Revisão: A, L, Y",
		subtitle: "Desafio de Velocidade e Precisão",
		icon: "⚡",
		kind: "revisao"
	},
	{
		nodeId: 24,
		world: 2,
		title: "Grande Trono: X, Y, Z",
		subtitle: "Mestre Supremo do Alfabeto LIBRAS",
		icon: "👑",
		kind: "chefe"
	}
];
/**
* Retorna as métricas agregadas da turma/clã de forma 100% segura e anônima.
* O aluno NUNCA recebe nomes, avatares ou dados individuais de colegas.
*/
function getClassroomAggregatedDashboard(classroomCode, currentUserId) {
	if (!classroomCode) return null;
	const classroom = getClassroomByCode(classroomCode);
	if (!classroom) return null;
	const users = getUsers();
	const currentUser = users.find((u) => u.id === currentUserId);
	const clanMembers = users.filter((u) => u.role === "aluno" && u.classroomCode && u.classroomCode.toUpperCase() === classroomCode.toUpperCase());
	const totalMembers = clanMembers.length;
	const clanTotalXp = clanMembers.reduce((acc, m) => acc + (m.xp || 0), 0);
	const clanAverageLevel = totalMembers > 0 ? Math.round(clanMembers.reduce((acc, m) => acc + (m.level || 1), 0) / totalMembers) : 1;
	let myCompletedCount = 0;
	let totalClanCompletionSum = 0;
	const activities = ALL_TRAIL_ACTIVITIES.map((act) => {
		const nodeKey = `trail_node_${act.nodeId}`;
		const legacyKey = `les_${act.nodeId}`;
		const myLesson = currentUser?.completedLessons?.find((l) => l.id === nodeKey || l.id === legacyKey);
		const myCompleted = !!myLesson;
		const myScore = myLesson ? myLesson.score : 0;
		if (myCompleted) myCompletedCount++;
		let completedInClan = 0;
		let scoreSumInClan = 0;
		for (const member of clanMembers) {
			const memLesson = member.completedLessons?.find((l) => l.id === nodeKey || l.id === legacyKey);
			if (memLesson) {
				completedInClan++;
				scoreSumInClan += memLesson.score;
			}
		}
		const turmaCompletionPercentage = totalMembers > 0 ? Math.round(completedInClan / totalMembers * 100) : 0;
		const turmaAverageScore = completedInClan > 0 ? Math.round(scoreSumInClan / completedInClan) : 0;
		totalClanCompletionSum += turmaCompletionPercentage;
		return {
			nodeId: act.nodeId,
			world: act.world,
			title: act.title,
			subtitle: act.subtitle,
			icon: act.icon,
			kind: act.kind,
			myScore,
			myCompleted,
			turmaAverageScore,
			turmaCompletionPercentage,
			turmaCompletedCount: completedInClan
		};
	});
	return {
		classroom,
		totalMembers,
		clanTotalXp,
		clanAverageLevel,
		clanOverallCompletionRate: activities.length > 0 ? Math.round(totalClanCompletionSum / activities.length) : 0,
		myOverallCompletionRate: activities.length > 0 ? Math.round(myCompletedCount / activities.length * 100) : 0,
		myCompletedCount,
		activities
	};
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "O sinal que você procura não está aqui. Vamos voltar para a trilha?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105",
						children: "Voltar ao início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold text-foreground",
					children: "Algo deu errado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Tente novamente ou volte para o início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground",
						children: "Tentar de novo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-full border border-input px-5 py-2.5 text-sm font-bold",
						children: "Início"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "sinaliza mais — Aprenda LIBRAS brincando" },
			{
				name: "description",
				content: "Plataforma gamificada de LIBRAS para crianças e adolescentes. Trilhas, avatares e IA para aprender a Língua Brasileira de Sinais brincando."
			},
			{
				name: "author",
				content: "sinaliza mais"
			},
			{
				property: "og:title",
				content: "sinaliza mais — Aprenda LIBRAS brincando"
			},
			{
				property: "og:description",
				content: "Trilhas de LIBRAS gamificadas para o Ensino Fundamental. Aprenda a Língua Brasileira de Sinais com avatares, streaks e desafios."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	(0, import_react.useEffect)(() => {
		seedDefaultUsers();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-lyE4xAed.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./licao-DvjBW2iZ.mjs");
/** Função utilitária para embaralhar alternativas de resposta */
/**
* CURRÍCULO 100% ALFABETO EM LIBRAS:
* Cada lição ensina exatamente 3 letras por vez com os bichinhos mascotes,
* usando as imagens/vídeos oficiais como exemplo de referência!
*/
var LESSONS_DATA = {
	1: {
		id: 1,
		title: "Letras A, B e C com os Mascotes",
		subtitle: "Lição 1: Primeiras Letras do Alfabeto em LIBRAS",
		colors: [
			{
				pt: "Letra A",
				letter: "A",
				targetLetter: "A",
				sign: "Punho fechado com polegar lateral",
				emoji: "🦫",
				animalEmoji: "🦫",
				animalName: "Capivarinha Luvi",
				species: "Capivara",
				tone: "bg-sunshine",
				signTip: "Feche a mão em punho e apoie o polegar estendido ao lado do dedo indicador.",
				handShapeDesc: "Punho fechado com polegar ao lado",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra B",
				letter: "B",
				targetLetter: "B",
				sign: "4 dedos eretos com polegar na palma",
				emoji: "🐰",
				animalEmoji: "🐰",
				animalName: "Coelhinho Theo",
				species: "Coelho",
				tone: "bg-sky",
				signTip: "Mantenha os 4 dedos unidos apontando para cima e dobre o polegar sobre a palma.",
				handShapeDesc: "Mão em 'B' com dedos unidos",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra C",
				letter: "C",
				targetLetter: "C",
				sign: "Dedos curvados em formato de C",
				emoji: "🐱",
				animalEmoji: "🐱",
				animalName: "Gatinha Mel",
				species: "Gatinha",
				tone: "bg-coral",
				signTip: "Curve os dedos e o polegar suavemente formando um semicírculo em forma de 'C'.",
				handShapeDesc: "Dedos em arco semicircular",
				bodyLocation: "Frente do peito"
			}
		]
	},
	2: {
		id: 2,
		title: "Letras D, E e F com os Mascotes",
		subtitle: "Lição 2: Letras de Dedo Indicador e Polegar",
		colors: [
			{
				pt: "Letra D",
				letter: "D",
				targetLetter: "D",
				sign: "Indicador para cima e dedos no polegar",
				emoji: "🦖",
				animalEmoji: "🦖",
				animalName: "Dinossauro Dino",
				species: "Dino",
				tone: "bg-mint",
				signTip: "Aponte apenas o indicador para o alto e encoste os outros dedos no polegar.",
				handShapeDesc: "Indicador ereto com base em anel",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra E",
				letter: "E",
				targetLetter: "E",
				sign: "Dedos curvados apoiados no polegar",
				emoji: "🐘",
				animalEmoji: "🐘",
				animalName: "Elefantinho Nino",
				species: "Elefante",
				tone: "bg-grape",
				signTip: "Dobre os 4 dedos com as pontinhas apoiadas no polegar recolhido.",
				handShapeDesc: "Dedos recolhidos no polegar",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra F",
				letter: "F",
				targetLetter: "F",
				sign: "Polegar por FORA do indicador dobrado",
				emoji: "🦭",
				animalEmoji: "🦭",
				animalName: "Foquinha Pipoca",
				species: "Foca",
				tone: "bg-sky",
				signTip: "Dobre o indicador e coloque o polegar por FORA dele. Lembre-se: F = Fora!",
				handShapeDesc: "Indicador dobrado com polegar externo",
				bodyLocation: "Frente do peito"
			}
		]
	},
	3: {
		id: 3,
		title: "Revisão: Letras A, B e C",
		subtitle: "Fixação e Prática Rápida com os Bichinhos",
		colors: [
			{
				pt: "Letra A",
				letter: "A",
				targetLetter: "A",
				sign: "Punho fechado com polegar lateral",
				emoji: "🦫",
				animalEmoji: "🦫",
				animalName: "Capivarinha Luvi",
				species: "Capivara",
				tone: "bg-sunshine",
				signTip: "Punho fechado com o polegar ao lado do indicador.",
				handShapeDesc: "Punho fechado",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra B",
				letter: "B",
				targetLetter: "B",
				sign: "4 dedos eretos e polegar recolhido",
				emoji: "🐰",
				animalEmoji: "🐰",
				animalName: "Coelhinho Theo",
				species: "Coelho",
				tone: "bg-sky",
				signTip: "4 dedos unidos apontados para cima.",
				handShapeDesc: "Mão em 'B'",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra C",
				letter: "C",
				targetLetter: "C",
				sign: "Dedos em semicírculo 'C'",
				emoji: "🐱",
				animalEmoji: "🐱",
				animalName: "Gatinha Mel",
				species: "Gatinha",
				tone: "bg-coral",
				signTip: "Curvatura aberta em C.",
				handShapeDesc: "Arco em C",
				bodyLocation: "Frente do peito"
			}
		]
	},
	4: {
		id: 4,
		title: "Chefe da Ilha 1: Letras D, E e F",
		subtitle: "Desafio de Maestria das Letras Iniciais",
		colors: [
			{
				pt: "Letra D",
				letter: "D",
				targetLetter: "D",
				sign: "Indicador ereto para cima",
				emoji: "🦖",
				animalEmoji: "🦖",
				animalName: "Dinossauro Dino",
				species: "Dino",
				tone: "bg-mint",
				signTip: "Indicador apontando para cima com círculo na base.",
				handShapeDesc: "Haste do D",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra E",
				letter: "E",
				targetLetter: "E",
				sign: "Dedos recolhidos no polegar",
				emoji: "🐘",
				animalEmoji: "🐘",
				animalName: "Elefantinho Nino",
				species: "Elefante",
				tone: "bg-grape",
				signTip: "Dedos curvados sobre o polegar.",
				handShapeDesc: "Letra E dobrada",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra F",
				letter: "F",
				targetLetter: "F",
				sign: "Polegar por FORA do indicador",
				emoji: "🦭",
				animalEmoji: "🦭",
				animalName: "Foquinha Pipoca",
				species: "Foca",
				tone: "bg-sky",
				signTip: "Polegar cruzado por fora do dedo indicador.",
				handShapeDesc: "Letra F oficial",
				bodyLocation: "Frente do peito"
			}
		]
	},
	5: {
		id: 5,
		title: "Letras G, H e I com os Mascotes",
		subtitle: "Lição 3: Movimento e Dedos Especiais",
		colors: [
			{
				pt: "Letra G",
				letter: "G",
				targetLetter: "G",
				sign: "Indicador e polegar paralelos para cima",
				emoji: "🦒",
				animalEmoji: "🦒",
				animalName: "Girafinha Gigi",
				species: "Girafa",
				tone: "bg-sunshine",
				signTip: "Estenda o indicador para cima com o polegar ao lado formando uma haste.",
				handShapeDesc: "Indicador e polegar paralelos",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra H",
				letter: "H",
				targetLetter: "H",
				sign: "Dedos em V com polegar no meio girando",
				emoji: "🦛",
				animalEmoji: "🦛",
				animalName: "Hipopótamo Pipo",
				species: "Hipopótamo",
				tone: "bg-mint",
				signTip: "Faça o sinal em 'V' com o polegar no meio e faça um giro suave do pulso.",
				handShapeDesc: "Mão em 'V' com giro",
				bodyLocation: "Espaço neutro"
			},
			{
				pt: "Letra I",
				letter: "I",
				targetLetter: "I",
				sign: "Dedo mindinho estendido para cima",
				emoji: "🦎",
				animalEmoji: "🦎",
				animalName: "Iguana Izi",
				species: "Iguana",
				tone: "bg-neon",
				signTip: "Feche a mão e estenda somente o dedo mínimo (mindinho) para o alto.",
				handShapeDesc: "Mindinho ereto",
				bodyLocation: "Frente do peito"
			}
		]
	},
	6: {
		id: 6,
		title: "Letras J, K e L com os Mascotes",
		subtitle: "Lição 4: Traçado no Ar e Ângulo Reto",
		colors: [
			{
				pt: "Letra J",
				letter: "J",
				targetLetter: "J",
				sign: "Mindinho desenhando um 'J' no ar",
				emoji: "🐊",
				animalEmoji: "🐊",
				animalName: "Jacarezinho Joca",
				species: "Jacaré",
				tone: "bg-mint",
				signTip: "Mantenha a mão em 'I' (mindinho) e desenhe a curva da letra J no ar.",
				handShapeDesc: "Traçado com mindinho",
				bodyLocation: "Ar em frente ao corpo"
			},
			{
				pt: "Letra K",
				letter: "K",
				targetLetter: "K",
				sign: "Dedos em V com polegar no meio subindo",
				emoji: "🐨",
				animalEmoji: "🐨",
				animalName: "Coala Kiki",
				species: "Coala",
				tone: "bg-grape",
				signTip: "Forme o 'V' com o polegar entre os dedos e faça um movimento curto para cima.",
				handShapeDesc: "Mão em 'K' com impulso",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra L",
				letter: "L",
				targetLetter: "L",
				sign: "Indicador e polegar em ângulo reto 'L'",
				emoji: "🦁",
				animalEmoji: "🦁",
				animalName: "Leãozinho Léo",
				species: "Leão",
				tone: "bg-coral",
				signTip: "Abra o indicador para cima e o polegar para o lado formando a letra 'L'.",
				handShapeDesc: "Ângulo reto 'L'",
				bodyLocation: "Frente do peito"
			}
		]
	},
	7: {
		id: 7,
		title: "Espelho com IA: Letras G, H e I",
		subtitle: "Prática e Validação na Câmera com os Mascotes",
		colors: [
			{
				pt: "Letra G",
				letter: "G",
				targetLetter: "G",
				sign: "Indicador para cima com polegar",
				emoji: "🦒",
				animalEmoji: "🦒",
				animalName: "Girafinha Gigi",
				species: "Girafa",
				tone: "bg-sunshine",
				signTip: "Mostre o indicador ereto para a câmera.",
				handShapeDesc: "na câmera",
				bodyLocation: "Centro do vídeo"
			},
			{
				pt: "Letra H",
				letter: "H",
				targetLetter: "H",
				sign: "Dedos em V com giro suave",
				emoji: "🦛",
				animalEmoji: "🦛",
				animalName: "Hipopótamo Pipo",
				species: "Hipopótamo",
				tone: "bg-mint",
				signTip: "Faça o formato em V com polegar no meio.",
				handShapeDesc: "Letra H na câmera",
				bodyLocation: "Centro do vídeo"
			},
			{
				pt: "Letra I",
				letter: "I",
				targetLetter: "I",
				sign: "Mindinho para cima",
				emoji: "🦎",
				animalEmoji: "🦎",
				animalName: "Iguana Izi",
				species: "Iguana",
				tone: "bg-neon",
				signTip: "Erga o mindinho bem firme por 2 segundos.",
				handShapeDesc: "Letra I na câmera",
				bodyLocation: "Centro do vídeo"
			}
		]
	},
	8: {
		id: 8,
		title: "Chefe da Ilha 2: Letras J, K e L",
		subtitle: "Desafio de Agilidade do Meio do Alfabeto",
		colors: [
			{
				pt: "Letra J",
				letter: "J",
				targetLetter: "J",
				sign: "Mindinho desenhando curva do J",
				emoji: "🐊",
				animalEmoji: "🐊",
				animalName: "Jacarezinho Joca",
				species: "Jacaré",
				tone: "bg-mint",
				signTip: "Desenhe a curvinha do J no ar com alegria.",
				handShapeDesc: "Traçado do J",
				bodyLocation: "Ar"
			},
			{
				pt: "Letra K",
				letter: "K",
				targetLetter: "K",
				sign: "Mão em V com polegar no meio",
				emoji: "🐨",
				animalEmoji: "🐨",
				animalName: "Coala Kiki",
				species: "Coala",
				tone: "bg-grape",
				signTip: "Formato do K com impulso para cima.",
				handShapeDesc: "Letra K",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra L",
				letter: "L",
				targetLetter: "L",
				sign: "Indicador e polegar em 'L'",
				emoji: "🦁",
				animalEmoji: "🦁",
				animalName: "Leãozinho Léo",
				species: "Leão",
				tone: "bg-coral",
				signTip: "Formato perfeito de 'L' com os dedos.",
				handShapeDesc: "Letra L",
				bodyLocation: "Frente do peito"
			}
		]
	},
	9: {
		id: 9,
		title: "Letras M, N e O com os Mascotes",
		subtitle: "Lição 5: Dedos Apontados para Baixo e Círculo",
		colors: [
			{
				pt: "Letra M",
				letter: "M",
				targetLetter: "M",
				sign: "Três dedos apontando para baixo",
				emoji: "🐵",
				animalEmoji: "🐵",
				animalName: "Macaquinho Mico",
				species: "Macaco",
				tone: "bg-sunshine",
				signTip: "Aponte 3 dedos (indicador, médio e anelar) para baixo apoiados no polegar.",
				handShapeDesc: "3 dedos para baixo",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra N",
				letter: "N",
				targetLetter: "N",
				sign: "Dois dedos apontando para baixo",
				emoji: "🐋",
				animalEmoji: "🐋",
				animalName: "Narval Nino",
				species: "Narval",
				tone: "bg-sky",
				signTip: "Aponte apenas 2 dedos (indicador e médio) para baixo sobre o polegar.",
				handShapeDesc: "2 dedos para baixo",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra O",
				letter: "O",
				targetLetter: "O",
				sign: "Todas as pontas dos dedos unidas no polegar",
				emoji: "🐑",
				animalEmoji: "🐑",
				animalName: "Ovelhinha Olívia",
				species: "Ovelha",
				tone: "bg-coral",
				signTip: "Junte as pontas de todos os dedos no polegar formando um círculo 'O' fechado.",
				handShapeDesc: "Círculo O fechado",
				bodyLocation: "Frente do peito"
			}
		]
	},
	10: {
		id: 10,
		title: "Letras P, Q e R com os Mascotes",
		subtitle: "Lição 6: Pinças e Dedos Cruzados",
		colors: [
			{
				pt: "Letra P",
				letter: "P",
				targetLetter: "P",
				sign: "Configuração em K apontada na horizontal",
				emoji: "🐼",
				animalEmoji: "🐼",
				animalName: "Pandinha Pan",
				species: "Panda",
				tone: "bg-grape",
				signTip: "Faça a mão como a letra K, mas posicione os dedos na horizontal para a frente.",
				handShapeDesc: "Mão em 'P' horizontal",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra Q",
				letter: "Q",
				targetLetter: "Q",
				sign: "Indicador e polegar para baixo em pinça",
				emoji: "🦘",
				animalEmoji: "🦘",
				animalName: "Quokka Quico",
				species: "Quokka",
				tone: "bg-mint",
				signTip: "Aponte o indicador e o polegar para baixo como uma pinça invertida.",
				handShapeDesc: "Pinça para baixo",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra R",
				letter: "R",
				targetLetter: "R",
				sign: "Médio cruzado sobre o indicador (dedos cruzados)",
				emoji: "🦊",
				animalEmoji: "🦊",
				animalName: "Raposinha Rubi",
				species: "Raposa",
				tone: "bg-coral",
				signTip: "Cruze o dedo médio sobre o indicador estendido, como sinal de boa sorte.",
				handShapeDesc: "Dedos cruzados 'R'",
				bodyLocation: "Frente do peito"
			}
		]
	},
	11: {
		id: 11,
		title: "Revisão: Letras M, N e O",
		subtitle: "Fixação e Prática Rápida com os Mascotes",
		colors: [
			{
				pt: "Letra M",
				letter: "M",
				targetLetter: "M",
				sign: "3 dedos para baixo",
				emoji: "🐵",
				animalEmoji: "🐵",
				animalName: "Macaquinho Mico",
				species: "Macaco",
				tone: "bg-sunshine",
				signTip: "3 dedinhos virados para baixo.",
				handShapeDesc: "Letra M",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra N",
				letter: "N",
				targetLetter: "N",
				sign: "2 dedos para baixo",
				emoji: "🐋",
				animalEmoji: "🐋",
				animalName: "Narval Nino",
				species: "Narval",
				tone: "bg-sky",
				signTip: "2 dedinhos virados para baixo.",
				handShapeDesc: "Letra N",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra O",
				letter: "O",
				targetLetter: "O",
				sign: "Círculo fechado em O",
				emoji: "🐑",
				animalEmoji: "🐑",
				animalName: "Ovelhinha Olívia",
				species: "Ovelha",
				tone: "bg-coral",
				signTip: "Círculo completo com os dedos.",
				handShapeDesc: "Letra O",
				bodyLocation: "Frente do peito"
			}
		]
	},
	12: {
		id: 12,
		title: "Grande Chefe Mundo 1: Letras P, Q e R",
		subtitle: "Batalha do Castelo do Saber e Conclusão do Mundo 1",
		colors: [
			{
				pt: "Letra P",
				letter: "P",
				targetLetter: "P",
				sign: "Mão na horizontal em P",
				emoji: "🐼",
				animalEmoji: "🐼",
				animalName: "Pandinha Pan",
				species: "Panda",
				tone: "bg-grape",
				signTip: "Dedo médio e indicador na horizontal.",
				handShapeDesc: "Letra P",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra Q",
				letter: "Q",
				targetLetter: "Q",
				sign: "Pinça apontada para baixo",
				emoji: "🦘",
				animalEmoji: "🦘",
				animalName: "Quokka Quico",
				species: "Quokka",
				tone: "bg-mint",
				signTip: "Indicador e polegar para baixo.",
				handShapeDesc: "Letra Q",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra R",
				letter: "R",
				targetLetter: "R",
				sign: "Dedos cruzados da sorte",
				emoji: "🦊",
				animalEmoji: "🦊",
				animalName: "Raposinha Rubi",
				species: "Raposa",
				tone: "bg-coral",
				signTip: "Médio cruzado no indicador.",
				handShapeDesc: "Letra R",
				bodyLocation: "Frente do peito"
			}
		]
	},
	13: {
		id: 13,
		title: "Letras S, T e U com os Mascotes",
		subtitle: "Lição 7: Polegar na Frente, Dentro e Dedos Juntos",
		colors: [
			{
				pt: "Letra S",
				letter: "S",
				targetLetter: "S",
				sign: "Punho fechado com polegar na FRENTE dos dedos",
				emoji: "🐸",
				animalEmoji: "🐸",
				animalName: "Sapinho Sapeca",
				species: "Sapo",
				tone: "bg-neon",
				signTip: "Feche a mão em punho e cruze o polegar na FRENTE dos dedos indicador e médio.",
				handShapeDesc: "Polegar na frente do punho",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra T",
				letter: "T",
				targetLetter: "T",
				sign: "Indicador dobrado com polegar por DENTRO",
				emoji: "🐢",
				animalEmoji: "🐢",
				animalName: "Tartaruga Tatá",
				species: "Tartaruga",
				tone: "bg-mint",
				signTip: "Dobre o indicador e esconda o polegar por DENTRO dele. Lembre-se: T = de 'Toca' (dentro)!",
				handShapeDesc: "Polegar escondido por dentro",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra U",
				letter: "U",
				targetLetter: "U",
				sign: "Indicador e médio eretos e bem UNIDOS",
				emoji: "🐻",
				animalEmoji: "🐻",
				animalName: "Ursinho Uli",
				species: "Urso",
				tone: "bg-sunshine",
				signTip: "Estenda o indicador e o dedo médio bem coladinhos para cima.",
				handShapeDesc: "2 dedos juntos eretos",
				bodyLocation: "Frente do peito"
			}
		]
	},
	14: {
		id: 14,
		title: "Letras V, W e X com os Mascotes",
		subtitle: "Lição 8: Sinais da Paz, Três Dedos e Gancho",
		colors: [
			{
				pt: "Letra V",
				letter: "V",
				targetLetter: "V",
				sign: "Indicador e médio eretos e AFASTADOS",
				emoji: "🐮",
				animalEmoji: "🐮",
				animalName: "Vaquinha Vivi",
				species: "Vaca",
				tone: "bg-coral",
				signTip: "Abra o indicador e o médio formando o sinal em 'V' da vitória.",
				handShapeDesc: "Dedos em 'V' abertos",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra W",
				letter: "W",
				targetLetter: "W",
				sign: "Três dedos eretos para cima e afastados",
				emoji: "🦡",
				animalEmoji: "🦡",
				animalName: "Wombat Wally",
				species: "Wombat",
				tone: "bg-grape",
				signTip: "Levante o indicador, médio e anelar abertos apontando para cima formando um 'W'.",
				handShapeDesc: "3 dedos em 'W'",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra X",
				letter: "X",
				targetLetter: "X",
				sign: "Indicador em gancho puxando para trás",
				emoji: "🦜",
				animalEmoji: "🦜",
				animalName: "Pássaro Xexéu",
				species: "Pássaro",
				tone: "bg-sky",
				signTip: "Curve o indicador como um pequeno anzol e puxe a mão suavemente para trás.",
				handShapeDesc: "Gancho puxando em 'X'",
				bodyLocation: "Espaço neutro"
			}
		]
	},
	15: {
		id: 15,
		title: "Revisão: Letras S, T e U",
		subtitle: "Fixação e Prática com os Mascotes",
		colors: [
			{
				pt: "Letra S",
				letter: "S",
				targetLetter: "S",
				sign: "Punho fechado com polegar na frente",
				emoji: "🐸",
				animalEmoji: "🐸",
				animalName: "Sapinho Sapeca",
				species: "Sapo",
				tone: "bg-neon",
				signTip: "Polegar cruzado na frente do punho.",
				handShapeDesc: "Letra S",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra T",
				letter: "T",
				targetLetter: "T",
				sign: "Polegar por dentro do indicador",
				emoji: "🐢",
				animalEmoji: "🐢",
				animalName: "Tartaruga Tatá",
				species: "Tartaruga",
				tone: "bg-mint",
				signTip: "Polegar escondido por dentro do indicador.",
				handShapeDesc: "Letra T",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra U",
				letter: "U",
				targetLetter: "U",
				sign: "2 dedos juntos para cima",
				emoji: "🐻",
				animalEmoji: "🐻",
				animalName: "Ursinho Uli",
				species: "Urso",
				tone: "bg-sunshine",
				signTip: "Dois dedos colados para cima.",
				handShapeDesc: "Letra U",
				bodyLocation: "Frente do peito"
			}
		]
	},
	16: {
		id: 16,
		title: "Chefe da Ilha 4: Letras V, W e X",
		subtitle: "Desafio de Agilidade dos Mascotes Aventureiros",
		colors: [
			{
				pt: "Letra V",
				letter: "V",
				targetLetter: "V",
				sign: "Dedos em V abertos",
				emoji: "🐮",
				animalEmoji: "🐮",
				animalName: "Vaquinha Vivi",
				species: "Vaca",
				tone: "bg-coral",
				signTip: "Dois dedos abertos em 'V'.",
				handShapeDesc: "Letra V",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra W",
				letter: "W",
				targetLetter: "W",
				sign: "Três dedos abertos em 'W'",
				emoji: "🦡",
				animalEmoji: "🦡",
				animalName: "Wombat Wally",
				species: "Wombat",
				tone: "bg-grape",
				signTip: "Três dedos levantados para cima.",
				handShapeDesc: "Letra W",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra X",
				letter: "X",
				targetLetter: "X",
				sign: "Gancho puxando para trás",
				emoji: "🦜",
				animalEmoji: "🦜",
				animalName: "Pássaro Xexéu",
				species: "Pássaro",
				tone: "bg-sky",
				signTip: "Gancho puxando para trás com suavidade.",
				handShapeDesc: "Letra X",
				bodyLocation: "Frente do peito"
			}
		]
	},
	17: {
		id: 17,
		title: "Letras Y, Z e A com os Mascotes",
		subtitle: "Lição 9: Hang Loose, Zigue-Zague e Recapitulação",
		colors: [
			{
				pt: "Letra Y",
				letter: "Y",
				targetLetter: "Y",
				sign: "Polegar e mínimo abertos (Hang Loose)",
				emoji: "🦬",
				animalEmoji: "🦬",
				animalName: "Yak Yoyo",
				species: "Yak",
				tone: "bg-sunshine",
				signTip: "Estenda o polegar e o dedo mínimo para os lados como o sinal de Hang Loose.",
				handShapeDesc: "Mão em 'Y' aberta",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra Z",
				letter: "Z",
				targetLetter: "Z",
				sign: "Indicador desenhando um Z no ar",
				emoji: "🦓",
				animalEmoji: "🦓",
				animalName: "Zebrinha Zazá",
				species: "Zebra",
				tone: "bg-grape",
				signTip: "Aponte o indicador e desenhe o zigue-zague da letra Z no ar.",
				handShapeDesc: "Traçado do Z no ar",
				bodyLocation: "Ar em frente ao corpo"
			},
			{
				pt: "Letra A",
				letter: "A",
				targetLetter: "A",
				sign: "Punho fechado com polegar lateral",
				emoji: "🦫",
				animalEmoji: "🦫",
				animalName: "Capivarinha Luvi",
				species: "Capivara",
				tone: "bg-sunshine",
				signTip: "Punho fechado com polegar encostado na lateral do indicador.",
				handShapeDesc: "Punho fechado",
				bodyLocation: "Frente do peito"
			}
		]
	},
	18: {
		id: 18,
		title: "Letras Dinâmicas: H, J e Z",
		subtitle: "Lição 10: Letras com Movimento no Ar em LIBRAS",
		colors: [
			{
				pt: "Letra H",
				letter: "H",
				targetLetter: "H",
				sign: "Dedos em V com rotação suave do pulso",
				emoji: "🦛",
				animalEmoji: "🦛",
				animalName: "Hipopótamo Pipo",
				species: "Hipopótamo",
				tone: "bg-mint",
				signTip: "Faça o giro de pulso com os dedos em V e o polegar no meio.",
				handShapeDesc: "Rotação com V",
				bodyLocation: "Espaço neutro"
			},
			{
				pt: "Letra J",
				letter: "J",
				targetLetter: "J",
				sign: "Mindinho traçando anzol do J",
				emoji: "🐊",
				animalEmoji: "🐊",
				animalName: "Jacarezinho Joca",
				species: "Jacaré",
				tone: "bg-mint",
				signTip: "Desenhe a curva do J com o dedo mindinho.",
				handShapeDesc: "Curva do J",
				bodyLocation: "Ar"
			},
			{
				pt: "Letra Z",
				letter: "Z",
				targetLetter: "Z",
				sign: "Indicador traçando zigue-zague do Z",
				emoji: "🦓",
				animalEmoji: "🦓",
				animalName: "Zebrinha Zazá",
				species: "Zebra",
				tone: "bg-grape",
				signTip: "Desenhe as 3 linhas do Z no ar.",
				handShapeDesc: "Zigue-zague do Z",
				bodyLocation: "Ar"
			}
		]
	},
	19: {
		id: 19,
		title: "Espelho com IA: Letras F, T e S",
		subtitle: "Diferenciação Crítica de Polegar na Câmera",
		colors: [
			{
				pt: "Letra F",
				letter: "F",
				targetLetter: "F",
				sign: "Polegar por FORA do indicador",
				emoji: "🦭",
				animalEmoji: "🦭",
				animalName: "Foquinha Pipoca",
				species: "Foca",
				tone: "bg-sky",
				signTip: "Mostre o polegar claramente pelo lado de FORA do indicador.",
				handShapeDesc: "Polegar por fora",
				bodyLocation: "Frente da câmera"
			},
			{
				pt: "Letra T",
				letter: "T",
				targetLetter: "T",
				sign: "Polegar por DENTRO do indicador",
				emoji: "🐢",
				animalEmoji: "🐢",
				animalName: "Tartaruga Tatá",
				species: "Tartaruga",
				tone: "bg-mint",
				signTip: "Encaixe o polegar por DENTRO do indicador dobrado.",
				handShapeDesc: "Polegar por dentro",
				bodyLocation: "Frente da câmera"
			},
			{
				pt: "Letra S",
				letter: "S",
				targetLetter: "S",
				sign: "Punho fechado com polegar na frente",
				emoji: "🐸",
				animalEmoji: "🐸",
				animalName: "Sapinho Sapeca",
				species: "Sapo",
				tone: "bg-neon",
				signTip: "Cruze o polegar na frente dos dedos do punho fechado.",
				handShapeDesc: "Polegar na frente",
				bodyLocation: "Frente da câmera"
			}
		]
	},
	20: {
		id: 20,
		title: "Chefe da Ilha 5: Letras K, P e D",
		subtitle: "Desafio de Orientação Espacial e Dedos",
		colors: [
			{
				pt: "Letra K",
				letter: "K",
				targetLetter: "K",
				sign: "Mão em K com impulso para cima",
				emoji: "🐨",
				animalEmoji: "🐨",
				animalName: "Coala Kiki",
				species: "Coala",
				tone: "bg-grape",
				signTip: "Dedos em V com polegar no meio apontando para cima.",
				handShapeDesc: "Letra K vertical",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra P",
				letter: "P",
				targetLetter: "P",
				sign: "Mão em P apontando na horizontal",
				emoji: "🐼",
				animalEmoji: "🐼",
				animalName: "Pandinha Pan",
				species: "Panda",
				tone: "bg-grape",
				signTip: "Mesma configuração do K, virada na horizontal.",
				handShapeDesc: "Letra P horizontal",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra D",
				letter: "D",
				targetLetter: "D",
				sign: "Indicador ereto para cima",
				emoji: "🦖",
				animalEmoji: "🦖",
				animalName: "Dinossauro Dino",
				species: "Dino",
				tone: "bg-mint",
				signTip: "Apenas indicador levantado com base circular.",
				handShapeDesc: "Letra D",
				bodyLocation: "Frente do peito"
			}
		]
	},
	21: {
		id: 21,
		title: "Dedos Unidos e Abertos: R, U e V",
		subtitle: "Lição 11: Variações de Dois Dedos em LIBRAS",
		colors: [
			{
				pt: "Letra R",
				letter: "R",
				targetLetter: "R",
				sign: "Dedos cruzados da sorte",
				emoji: "🦊",
				animalEmoji: "🦊",
				animalName: "Raposinha Rubi",
				species: "Raposa",
				tone: "bg-coral",
				signTip: "Médio cruzado sobre o indicador.",
				handShapeDesc: "Cruzamento em R",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra U",
				letter: "U",
				targetLetter: "U",
				sign: "Dois dedos colados para cima",
				emoji: "🐻",
				animalEmoji: "🐻",
				animalName: "Ursinho Uli",
				species: "Urso",
				tone: "bg-sunshine",
				signTip: "Indicador e médio estendidos juntos.",
				handShapeDesc: "Dedos unidos em U",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra V",
				letter: "V",
				targetLetter: "V",
				sign: "Dois dedos abertos em 'V'",
				emoji: "🐮",
				animalEmoji: "🐮",
				animalName: "Vaquinha Vivi",
				species: "Vaca",
				tone: "bg-coral",
				signTip: "Indicador e médio abertos em 'V'.",
				handShapeDesc: "Dedos abertos em V",
				bodyLocation: "Frente do peito"
			}
		]
	},
	22: {
		id: 22,
		title: "Dedos para Baixo e Cima: M, N e W",
		subtitle: "Lição 12: Contagem de Dedos em LIBRAS",
		colors: [
			{
				pt: "Letra M",
				letter: "M",
				targetLetter: "M",
				sign: "3 dedos para baixo",
				emoji: "🐵",
				animalEmoji: "🐵",
				animalName: "Macaquinho Mico",
				species: "Macaco",
				tone: "bg-sunshine",
				signTip: "Três dedos apontados para baixo.",
				handShapeDesc: "Letra M",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra N",
				letter: "N",
				targetLetter: "N",
				sign: "2 dedos para baixo",
				emoji: "🐋",
				animalEmoji: "🐋",
				animalName: "Narval Nino",
				species: "Narval",
				tone: "bg-sky",
				signTip: "Dois dedos apontados para baixo.",
				handShapeDesc: "Letra N",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra W",
				letter: "W",
				targetLetter: "W",
				sign: "3 dedos para cima",
				emoji: "🦡",
				animalEmoji: "🦡",
				animalName: "Wombat Wally",
				species: "Wombat",
				tone: "bg-grape",
				signTip: "Três dedos levantados para cima.",
				handShapeDesc: "Letra W",
				bodyLocation: "Frente do peito"
			}
		]
	},
	23: {
		id: 23,
		title: "Super Revisão: Letras A, L e Y",
		subtitle: "Fixação e Velocidade com os Mascotes",
		colors: [
			{
				pt: "Letra A",
				letter: "A",
				targetLetter: "A",
				sign: "Punho fechado com polegar ao lado",
				emoji: "🦫",
				animalEmoji: "🦫",
				animalName: "Capivarinha Luvi",
				species: "Capivara",
				tone: "bg-sunshine",
				signTip: "Punho fechado com polegar lateral.",
				handShapeDesc: "Letra A",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra L",
				letter: "L",
				targetLetter: "L",
				sign: "Mão em 'L' com indicador e polegar",
				emoji: "🦁",
				animalEmoji: "🦁",
				animalName: "Leãozinho Léo",
				species: "Leão",
				tone: "bg-coral",
				signTip: "Ângulo reto 'L' perfeito.",
				handShapeDesc: "Letra L",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra Y",
				letter: "Y",
				targetLetter: "Y",
				sign: "Hang Loose com polegar e mindinho",
				emoji: "🦬",
				animalEmoji: "🦬",
				animalName: "Yak Yoyo",
				species: "Yak",
				tone: "bg-sunshine",
				signTip: "Sinal de Hang Loose em 'Y'.",
				handShapeDesc: "Letra Y",
				bodyLocation: "Frente do peito"
			}
		]
	},
	24: {
		id: 24,
		title: "O Grande Trono: Letras X, Y e Z",
		subtitle: "Grande Chefe Final e Maestria do Alfabeto LIBRAS",
		colors: [
			{
				pt: "Letra X",
				letter: "X",
				targetLetter: "X",
				sign: "Gancho puxando para trás",
				emoji: "🦜",
				animalEmoji: "🦜",
				animalName: "Pássaro Xexéu",
				species: "Pássaro",
				tone: "bg-sky",
				signTip: "Puxe o gancho do X para trás com firmeza.",
				handShapeDesc: "Letra X final",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra Y",
				letter: "Y",
				targetLetter: "Y",
				sign: "Polegar e mindinho abertos em Y",
				emoji: "🦬",
				animalEmoji: "🦬",
				animalName: "Yak Yoyo",
				species: "Yak",
				tone: "bg-sunshine",
				signTip: "Sinal de Hang Loose com movimento suave.",
				handShapeDesc: "Letra Y final",
				bodyLocation: "Frente do peito"
			},
			{
				pt: "Letra Z",
				letter: "Z",
				targetLetter: "Z",
				sign: "Zigue-zague triunfal do Z",
				emoji: "🦓",
				animalEmoji: "🦓",
				animalName: "Zebrinha Zazá",
				species: "Zebra",
				tone: "bg-grape",
				signTip: "Desenhe o Z no ar para coroar o final do alfabeto em LIBRAS!",
				handShapeDesc: "Letra Z triunfal",
				bodyLocation: "Ar em frente ao corpo"
			}
		]
	}
};
var Route$5 = createFileRoute("/licao")({
	validateSearch: (search) => {
		const raw = search?.nodeId;
		const parsed = typeof raw === "number" ? raw : parseInt(String(raw || ""), 10);
		return { nodeId: parsed >= 1 && parsed <= 24 ? parsed : 1 };
	},
	head: () => ({ meta: [{ title: "Lição do Alfabeto em LIBRAS com Mascotes · sinaliza mais" }, {
		name: "description",
		content: "Aprenda o alfabeto em LIBRAS com os bichinhos mascotes, 3 letras por lição, com modelos visuais de exemplo e inteligência artificial."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./login-Bx6QgqNF.mjs");
var Route$4 = createFileRoute("/login")({
	validateSearch: (search) => {
		return { mode: search?.mode === "register" ? "register" : "login" };
	},
	head: () => ({ meta: [{ title: "Acesso e Cadastro · sinaliza mais LIBRAS" }, {
		name: "description",
		content: "Área de login e cadastro no sinaliza mais para alunos e professores gerenciarem seu progresso e salas de aula."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./onboarding-DbUK5zHi.mjs");
var Route$3 = createFileRoute("/onboarding")({
	head: () => ({ meta: [{ title: "Painel do Professor · sinaliza mais LIBRAS" }, {
		name: "description",
		content: "Área exclusiva para professores gerenciarem salas de aula, turmas e professores no sinaliza mais."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./trilha-B6xbpRhT.mjs");
var Route$2 = createFileRoute("/trilha")({
	validateSearch: (search) => {
		const raw = search?.world;
		const parsed = typeof raw === "number" ? raw : parseInt(String(raw || ""), 10);
		return { world: parsed === 1 || parsed === 2 ? parsed : 1 };
	},
	head: () => ({ meta: [
		{ title: "Minha Trilha de LIBRAS com Mapa 3D · sinaliza mais" },
		{
			name: "description",
			content: "Mapa interativo de aventura com micro-lições de LIBRAS: saudações, alfabeto, cores, bichos e família com efeitos de parallax e gamificação."
		},
		{
			property: "og:title",
			content: "Minha Trilha de LIBRAS · sinaliza mais"
		},
		{
			property: "og:description",
			content: "Avance pelo mapa interativo aprendendo LIBRAS com micro-lições gamificadas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
/** Calcula o estado dinâmico dos nós com base nas lições concluídas do usuário e no mundo ativo. */
var $$splitComponentImporter$1 = () => import("./turma-D8xpeISS.mjs");
var Route$1 = createFileRoute("/turma")({
	head: () => ({ meta: [{ title: "Painel da Turma / Clã · sinaliza mais LIBRAS" }, {
		name: "description",
		content: "Acompanhe o progresso colaborativo da sua turma e compare seu desempenho individual com a média geral do Clã em LIBRAS."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./profile-BNTak261.mjs");
var Route = createFileRoute("/student/profile")({
	head: () => ({ meta: [{ title: "Meu Perfil de Aluno · sinaliza mais LIBRAS" }, {
		name: "description",
		content: "Gerencie suas informações cadastrais e acompanhe seu progresso de aprendizado em LIBRAS."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	LicaoRoute: Route$5.update({
		id: "/licao",
		path: "/licao",
		getParentRoute: () => Route$7
	}),
	LoginRoute: Route$4.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$7
	}),
	OnboardingRoute: Route$3.update({
		id: "/onboarding",
		path: "/onboarding",
		getParentRoute: () => Route$7
	}),
	TrilhaRoute: Route$2.update({
		id: "/trilha",
		path: "/trilha",
		getParentRoute: () => Route$7
	}),
	TurmaRoute: Route$1.update({
		id: "/turma",
		path: "/turma",
		getParentRoute: () => Route$7
	}),
	StudentProfileRoute: Route.update({
		id: "/student/profile",
		path: "/student/profile",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { syncClassroomsFromSupabase as A, loseLife as C, saveClassroom as D, removeStudentFromClassroom as E, loginWithSupabase as F, registerWithSupabase as I, fetchCompletedLessonsForUsers as M, fetchProfileFromSupabase as N, saveUser as O, isSupabaseConfigured as P, logoutUser as S, regenerateLives as T, getUsers as _, Route$5 as a, leaveClassroom as b, deleteClassroom as c, getActiveUser as d, getClassroomAggregatedDashboard as f, getStudentsInClassroom as g, getMaxLives as h, LESSONS_DATA as i, addAlunoToSalaInSupabase as j, subscribeToUserChanges as k, deleteUser as l, getClassrooms as m, Route$2 as n, ALL_TRAIL_ACTIVITIES as o, getClassroomByCode as p, Route$4 as r, computeNewStreak as s, router_exports as t, generateRandomClassroomCode as u, isUserOnline as v, onUserChange as w, loginUser as x, joinClassroom as y };
