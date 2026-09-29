import { supabase } from "@/integrations/supabase/client";
import { User, Classroom } from "./user-store";

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && url !== "https://placeholder.supabase.co");
}

export async function registerWithSupabase(params: {
  email: string;
  password?: string;
  name: string;
  role: "aluno" | "professor";
  world: "ef1" | "ef2";
  avatar?: string;
  discipline?: string;
  classroomCode?: string;
}) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password || "123456",
    options: {
      data: {
        name: params.name,
        role: params.role,
        world: params.world,
        avatar: params.avatar || (params.role === "professor" ? "🧑‍🏫" : "🦊"),
        discipline: params.discipline || "LIBRAS & Inclusão",
        classroom_code: params.classroomCode,
      },
    },
  });

  if (error) throw error;
  return data.user;
}

export async function loginWithSupabase(params: { email: string; password?: string }) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password || "123456",
  });

  if (error) throw error;
  return data.user;
}

export async function logoutWithSupabase() {
  if (!isSupabaseConfigured()) return;
  await supabase.auth.signOut();
}

export async function fetchProfileFromSupabase(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as "aluno" | "professor",
    world: data.world as "ef1" | "ef2",
    avatar: data.avatar || "🦊",
    discipline: data.discipline || undefined,
    level: data.level || 1,
    xp: data.xp || 0,
    streak: data.streak || 1,
    phone: data.phone || undefined,
    birthDate: data.birth_date || undefined,
    document: data.document || undefined,
    address: data.address || undefined,
    classroomCode: data.classroom_code || undefined,
    hasLoggedIn: data.has_logged_in || false,
    lastActiveAt: data.last_active_at || new Date().toISOString(),
    completedLessons: [],
    createdAt: data.created_at || new Date().toISOString(),
  };
}

export async function fetchClassroomsFromSupabase(): Promise<Classroom[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await (supabase as any).from("classrooms").select("*");
  if (error || !data) return [];

  return data.map((c: any) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    teacherId: c.teacher_id,
    teacherName: c.teacher_name,
    discipline: c.discipline || "LIBRAS & Inclusão",
    world: c.world as "ef1" | "ef2",
    description: c.description || "",
    createdAt: c.created_at,
  }));
}

export async function createClassroomInSupabase(classroom: {
  code: string;
  name: string;
  teacherId: string;
  teacherName: string;
  discipline?: string;
  world: "ef1" | "ef2";
  description?: string;
}) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await (supabase as any)
    .from("classrooms")
    .insert({
      code: classroom.code,
      name: classroom.name,
      teacher_id: classroom.teacherId,
      teacher_name: classroom.teacherName,
      discipline: classroom.discipline || "LIBRAS & Inclusão",
      world: classroom.world,
      description: classroom.description || "",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
