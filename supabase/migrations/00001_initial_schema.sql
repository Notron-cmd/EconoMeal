-- Enable UUID extension
create extension if not exists "pgcrypto";

-- 1. Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  kota_domisili text,
  alat_masak text[] default '{}',
  alergi text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. User finances table
create table if not exists public.user_finances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  uang_bulanan numeric not null,
  target_tabungan numeric default 0,
  pengeluaran_tetap numeric default 0,
  daily_budget numeric generated always as (
    (uang_bulanan - pengeluaran_tetap - target_tabungan) / 30
  ) stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Regional food prices
create table if not exists public.regional_prices (
  id bigint generated always as identity primary key,
  nama_bahan text not null,
  wilayah text not null,
  estimasi_harga numeric not null,
  satuan text default 'kg',
  updated_at timestamptz default now(),
  unique(nama_bahan, wilayah)
);

-- 4. Expense logs
create table if not exists public.expense_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  note text,
  logged_at timestamptz default now()
);

-- 5. Saved recipes / meal history
create table if not exists public.meal_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipe_name text not null,
  ingredients jsonb,
  nutrition jsonb,
  cost_estimate numeric,
  cooked_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.user_finances enable row level security;
alter table public.regional_prices enable row level security;
alter table public.expense_logs enable row level security;
alter table public.meal_history enable row level security;

-- RLS policies: users can only access their own data
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own finances"
  on public.user_finances for select using (auth.uid() = user_id);

create policy "Users can manage own finances"
  on public.user_finances for all using (auth.uid() = user_id);

create policy "Users can view own expenses"
  on public.expense_logs for select using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expense_logs for insert with check (auth.uid() = user_id);

create policy "Users can view own meal history"
  on public.meal_history for select using (auth.uid() = user_id);

create policy "Users can insert own meal history"
  on public.meal_history for insert with check (auth.uid() = user_id);

-- Regional prices are public read
create policy "Regional prices public read"
  on public.regional_prices for select using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

-- Trigger the function on auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
