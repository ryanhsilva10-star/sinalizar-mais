-- Migration: Correção de RLS e relacionamento entre sala, professor, alunos e alunos_sala
-- Permite que professores criem salas no Supabase e que alunos sejam vinculados às salas
-- Date: 2026-09-29

-- 1. Garantir que as colunas ID possuam gerador de UUID padrão
ALTER TABLE IF EXISTS public.sala 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE IF EXISTS public.alunos_sala 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE IF EXISTS public.professor 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE IF EXISTS public.alunos 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE IF EXISTS public.sala ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.professor ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alunos_sala ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para tabela public.sala
DROP POLICY IF EXISTS "Permitir leitura de salas" ON public.sala;
CREATE POLICY "Permitir leitura de salas" ON public.sala
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir insercao de salas" ON public.sala;
CREATE POLICY "Permitir insercao de salas" ON public.sala
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao de salas" ON public.sala;
CREATE POLICY "Permitir atualizacao de salas" ON public.sala
  FOR UPDATE TO public USING (true);

DROP POLICY IF EXISTS "Permitir exclusao de salas" ON public.sala;
CREATE POLICY "Permitir exclusao de salas" ON public.sala
  FOR DELETE TO public USING (true);

-- 4. Políticas para tabela public.professor
DROP POLICY IF EXISTS "Permitir leitura de professores" ON public.professor;
CREATE POLICY "Permitir leitura de professores" ON public.professor
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir insercao de professores" ON public.professor;
CREATE POLICY "Permitir insercao de professores" ON public.professor
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao de professores" ON public.professor;
CREATE POLICY "Permitir atualizacao de professores" ON public.professor
  FOR UPDATE TO public USING (true);

DROP POLICY IF EXISTS "Permitir exclusao de professores" ON public.professor;
CREATE POLICY "Permitir exclusao de professores" ON public.professor
  FOR DELETE TO public USING (true);

-- 5. Políticas para tabela public.alunos
DROP POLICY IF EXISTS "Permitir leitura de alunos" ON public.alunos;
CREATE POLICY "Permitir leitura de alunos" ON public.alunos
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir insercao de alunos" ON public.alunos;
CREATE POLICY "Permitir insercao de alunos" ON public.alunos
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao de alunos" ON public.alunos;
CREATE POLICY "Permitir atualizacao de alunos" ON public.alunos
  FOR UPDATE TO public USING (true);

DROP POLICY IF EXISTS "Permitir exclusao de alunos" ON public.alunos;
CREATE POLICY "Permitir exclusao de alunos" ON public.alunos
  FOR DELETE TO public USING (true);

-- 6. Políticas para tabela public.alunos_sala
DROP POLICY IF EXISTS "Permitir leitura de alunos_sala" ON public.alunos_sala;
CREATE POLICY "Permitir leitura de alunos_sala" ON public.alunos_sala
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir insercao em alunos_sala" ON public.alunos_sala;
CREATE POLICY "Permitir insercao em alunos_sala" ON public.alunos_sala
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao em alunos_sala" ON public.alunos_sala;
CREATE POLICY "Permitir atualizacao em alunos_sala" ON public.alunos_sala
  FOR UPDATE TO public USING (true);

DROP POLICY IF EXISTS "Permitir exclusao em alunos_sala" ON public.alunos_sala;
CREATE POLICY "Permitir exclusao em alunos_sala" ON public.alunos_sala
  FOR DELETE TO public USING (true);
