-- ==============================================================================
-- Migration: Funções e Políticas RLS (Row Level Security) para o Sinalizar mais
-- Regra: Consultas relacionais entre tabelas são encapsuladas em funções SECURITY DEFINER,
-- evitando subqueries inline (SELECTs) diretamente dentro das definições das policies.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. GARANTIR IDs AUTOMÁTICOS
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.sala ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS public.alunos_sala ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS public.professor ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS public.alunos ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- ------------------------------------------------------------------------------
-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.sala ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alunos_sala ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.professor ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alunos ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. FUNÇÕES AUXILIARES (SECURITY DEFINER)
-- ------------------------------------------------------------------------------

-- Função: Verifica se o usuário autenticado é um professor
CREATE OR REPLACE FUNCTION public.is_professor(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN EXISTS (
        SELECT 1 
        FROM public.professor 
        WHERE user_id = p_user_id OR id = p_user_id
    );
END;
$$;

-- Função: Verifica se o usuário autenticado é um aluno
CREATE OR REPLACE FUNCTION public.is_aluno(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN EXISTS (
        SELECT 1 
        FROM public.alunos 
        WHERE user_id = p_user_id OR id = p_user_id
    );
END;
$$;

-- Função: Retorna o ID do aluno a partir do auth.uid()
CREATE OR REPLACE FUNCTION public.get_aluno_id(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_aluno_id uuid;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT id INTO v_aluno_id
    FROM public.alunos
    WHERE user_id = p_user_id OR id = p_user_id
    LIMIT 1;

    RETURN v_aluno_id;
END;
$$;

-- Função: Verifica se o usuário pode gerenciar a sala (é o professor da sala ou professor cadastrado)
CREATE OR REPLACE FUNCTION public.can_manage_sala(p_sala_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Verifica se é o professor vinculado diretamente a essa sala
    IF EXISTS (
        SELECT 1 
        FROM public.professor 
        WHERE sala_id = p_sala_id AND (user_id = p_user_id OR id = p_user_id)
    ) THEN
        RETURN true;
    END IF;

    -- Permite caso seja qualquer professor cadastrado no sistema
    RETURN public.is_professor(p_user_id);
END;
$$;

-- Função: Verifica se o usuário pode gerenciar o vínculo entre o aluno e a sala
CREATE OR REPLACE FUNCTION public.can_manage_alunos_sala(p_alunos_id uuid, p_sala_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Caso 1: O próprio aluno está gerenciando sua matrícula
    IF p_alunos_id IS NOT NULL AND p_alunos_id = public.get_aluno_id(p_user_id) THEN
        RETURN true;
    END IF;

    -- Caso 2: Um professor que gerencia a sala ou qualquer professor cadastrado
    IF public.can_manage_sala(p_sala_id, p_user_id) THEN
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- Função: Verifica se o usuário pode alterar os dados do aluno (o próprio aluno ou um professor)
CREATE OR REPLACE FUNCTION public.can_manage_aluno(p_aluno_user_id uuid, p_check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_check_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- O próprio aluno alterando seus dados
    IF p_aluno_user_id = p_check_user_id THEN
        RETURN true;
    END IF;

    -- Um professor pode gerenciar o aluno (ex: atribuir alunos_sala_id)
    RETURN public.is_professor(p_check_user_id);
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. POLICIES PARA A TABELA 'sala'
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "sala_select_policy" ON public.sala;
CREATE POLICY "sala_select_policy" 
    ON public.sala FOR SELECT 
    TO public 
    USING (true);

DROP POLICY IF EXISTS "sala_insert_policy" ON public.sala;
CREATE POLICY "sala_insert_policy" 
    ON public.sala FOR INSERT 
    TO authenticated 
    WITH CHECK (public.is_professor(auth.uid()) OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "sala_update_policy" ON public.sala;
CREATE POLICY "sala_update_policy" 
    ON public.sala FOR UPDATE 
    TO authenticated 
    USING (public.can_manage_sala(id, auth.uid()));

DROP POLICY IF EXISTS "sala_delete_policy" ON public.sala;
CREATE POLICY "sala_delete_policy" 
    ON public.sala FOR DELETE 
    TO authenticated 
    USING (public.can_manage_sala(id, auth.uid()));

-- ------------------------------------------------------------------------------
-- 5. POLICIES PARA A TABELA 'alunos_sala'
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "alunos_sala_select_policy" ON public.alunos_sala;
CREATE POLICY "alunos_sala_select_policy" 
    ON public.alunos_sala FOR SELECT 
    TO public 
    USING (true);

DROP POLICY IF EXISTS "alunos_sala_insert_policy" ON public.alunos_sala;
CREATE POLICY "alunos_sala_insert_policy" 
    ON public.alunos_sala FOR INSERT 
    TO authenticated 
    WITH CHECK (public.can_manage_alunos_sala(alunos_id, sala_id, auth.uid()));

DROP POLICY IF EXISTS "alunos_sala_update_policy" ON public.alunos_sala;
CREATE POLICY "alunos_sala_update_policy" 
    ON public.alunos_sala FOR UPDATE 
    TO authenticated 
    USING (public.can_manage_alunos_sala(alunos_id, sala_id, auth.uid()));

DROP POLICY IF EXISTS "alunos_sala_delete_policy" ON public.alunos_sala;
CREATE POLICY "alunos_sala_delete_policy" 
    ON public.alunos_sala FOR DELETE 
    TO authenticated 
    USING (public.can_manage_alunos_sala(alunos_id, sala_id, auth.uid()));

-- ------------------------------------------------------------------------------
-- 6. POLICIES PARA A TABELA 'professor'
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "professor_select_policy" ON public.professor;
CREATE POLICY "professor_select_policy" 
    ON public.professor FOR SELECT 
    TO public 
    USING (true);

DROP POLICY IF EXISTS "professor_insert_policy" ON public.professor;
CREATE POLICY "professor_insert_policy" 
    ON public.professor FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "professor_update_policy" ON public.professor;
CREATE POLICY "professor_update_policy" 
    ON public.professor FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id OR auth.uid() = id);

DROP POLICY IF EXISTS "professor_delete_policy" ON public.professor;
CREATE POLICY "professor_delete_policy" 
    ON public.professor FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id OR auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 7. POLICIES PARA A TABELA 'alunos'
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "alunos_select_policy" ON public.alunos;
CREATE POLICY "alunos_select_policy" 
    ON public.alunos FOR SELECT 
    TO public 
    USING (true);

DROP POLICY IF EXISTS "alunos_insert_policy" ON public.alunos;
CREATE POLICY "alunos_insert_policy" 
    ON public.alunos FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "alunos_update_policy" ON public.alunos;
CREATE POLICY "alunos_update_policy" 
    ON public.alunos FOR UPDATE 
    TO authenticated 
    USING (public.can_manage_aluno(user_id, auth.uid()));

DROP POLICY IF EXISTS "alunos_delete_policy" ON public.alunos;
CREATE POLICY "alunos_delete_policy" 
    ON public.alunos FOR DELETE 
    TO authenticated 
    USING (public.can_manage_aluno(user_id, auth.uid()));
