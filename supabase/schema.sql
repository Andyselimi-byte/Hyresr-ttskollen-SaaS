-- Run this in your Supabase SQL editor

create table if not exists profiles (
  id uuid references auth.users on delete cascade,
  email text,
  subscription_status text default 'free', -- 'free' | 'premium'
  stripe_customer_id text,
  created_at timestamptz default now(),
  primary key (id)
);

create table if not exists contracts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  file_path text,
  analysis jsonb,
  created_at timestamptz default now()
);

create table if not exists rent_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  input jsonb,
  result jsonb,
  created_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table profiles enable row level security;
alter table contracts enable row level security;
alter table rent_analyses enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can manage own contracts"
  on contracts for all using (auth.uid() = user_id);

create policy "Users can manage own rent analyses"
  on rent_analyses for all using (auth.uid() = user_id);
