-- Migration: Initial Schema for Sinalizar mais (Auth, Profiles, Classrooms, Lessons)
-- Date: 2026-09-28

-- 1. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'aluno' CHECK (role IN ('aluno', 'professor')),
    world TEXT NOT NULL DEFAULT 'ef1' CHECK (world IN ('ef1', 'ef2')),
    avatar TEXT DEFAULT '🦊',
    discipline TEXT DEFAULT 'LIBRAS & Inclusão',
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    streak INT DEFAULT 1,
    phone TEXT,
    birth_date TEXT,
    document TEXT,
    address TEXT,
    classroom_code TEXT,
    has_logged_in BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users." 
    ON public.profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Users can insert their own profile." 
    ON public.profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id);

-- 2. Create Classrooms Table
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_name TEXT NOT NULL,
    discipline TEXT DEFAULT 'LIBRAS & Inclusão',
    world TEXT NOT NULL DEFAULT 'ef1' CHECK (world IN ('ef1', 'ef2')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on classrooms
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- Classrooms Policies
CREATE POLICY "Classrooms are viewable by authenticated users." 
    ON public.classrooms FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Teachers can insert classrooms." 
    ON public.classrooms FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their classrooms." 
    ON public.classrooms FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their classrooms." 
    ON public.classrooms FOR DELETE 
    TO authenticated 
    USING (auth.uid() = teacher_id);

-- 3. Create User Completed Lessons Table
CREATE TABLE IF NOT EXISTS public.user_completed_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    title TEXT NOT NULL,
    score INT NOT NULL DEFAULT 100,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Enable RLS on user_completed_lessons
ALTER TABLE public.user_completed_lessons ENABLE ROW LEVEL SECURITY;

-- User Completed Lessons Policies
CREATE POLICY "Users can view completed lessons." 
    ON public.user_completed_lessons FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Users can insert their completed lessons." 
    ON public.user_completed_lessons FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their completed lessons." 
    ON public.user_completed_lessons FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- 4. Automatic Profile Trigger on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        name,
        role,
        world,
        avatar,
        discipline,
        classroom_code,
        created_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'aluno'),
        COALESCE(NEW.raw_user_meta_data->>'world', 'ef1'),
        COALESCE(NEW.raw_user_meta_data->>'avatar', '🦊'),
        COALESCE(NEW.raw_user_meta_data->>'discipline', 'LIBRAS & Inclusão'),
        NEW.raw_user_meta_data->>'classroom_code',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.profiles.name),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
