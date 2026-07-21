-- Historik för avtalsanalyser
-- Kör detta i Supabase → SQL Editor → New query → klistra in → Run

create table if not exists public.contract_analyses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  file_name   text,
  summary     text,
  risk_level  text,
  analysis    jsonb not null,
  created_at  timestamptz not null default now()
);

-- Index för snabb hämtning av en användares historik
create index if not exists contract_analyses_user_idx
  on public.contract_analyses (user_id, created_at desc);

-- Rad-säkerhet: varje användare ser och hanterar endast sina egna analyser
alter table public.contract_analyses enable row level security;

drop policy if exists "own analyses select" on public.contract_analyses;
create policy "own analyses select"
  on public.contract_analyses for select
  using (auth.uid() = user_id);

drop policy if exists "own analyses insert" on public.contract_analyses;
create policy "own analyses insert"
  on public.contract_analyses for insert
  with check (auth.uid() = user_id);

drop policy if exists "own analyses delete" on public.contract_analyses;
create policy "own analyses delete"
  on public.contract_analyses for delete
  using (auth.uid() = user_id);
