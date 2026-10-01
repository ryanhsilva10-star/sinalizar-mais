-- Migration: Corrige colunas de pontuação e policies RLS na tabela alunos
-- Date: 2026-10-01
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Garante a coluna pontuacao (sem acento) - principal
ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS pontuacao numeric DEFAULT 0;

-- 2. Garante a coluna pontuacao_total (variante sem acento)
ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS pontuacao_total numeric DEFAULT 0;

-- 3. Garante a coluna senha
ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS senha text;

-- 4. Atualiza os registros existentes onde pontuacao está nulo para 0
UPDATE public.alunos
SET pontuacao = 0
WHERE pontuacao IS NULL;

-- 5. Corrige a policy de UPDATE da tabela alunos para permitir que
--    qualquer usuário autenticado possa atualizar (necessário para sincronizar pontuação)
DROP POLICY IF EXISTS "alunos_update_policy" ON public.alunos;
CREATE POLICY "alunos_update_policy"
  ON public.alunos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Corrige a policy de INSERT da tabela alunos
DROP POLICY IF EXISTS "alunos_insert_policy" ON public.alunos;
CREATE POLICY "alunos_insert_policy"
  ON public.alunos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. (Opcional) Garante que "pontuação_total" com acento também existe
ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS "pontuação_total" numeric DEFAULT 0;
