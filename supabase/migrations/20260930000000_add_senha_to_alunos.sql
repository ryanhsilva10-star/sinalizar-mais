-- Migration: Adicionar coluna 'senha' na tabela public.alunos
-- Date: 2026-09-30

ALTER TABLE IF EXISTS public.alunos
  ADD COLUMN IF NOT EXISTS senha text;
