-- Migration: Garantir colunas de pontuação e senha na tabela public.alunos
-- Date: 2026-09-30

-- 1. Garante que a coluna de pontuação exista (suporta tanto pontuação_total quanto pontuacao)
ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS "pontuação_total" numeric DEFAULT 0;

ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS pontuacao numeric DEFAULT 0;

-- 2. Garante a coluna senha caso ainda não tenha sido criada
ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS senha text;
