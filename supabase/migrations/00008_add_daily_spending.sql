create table if not exists public.daily_spending (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  total_spent numeric not null default 0,
  unique(user_id, date)
);

alter table public.daily_spending enable row level security;

create policy "Users can view own spending"
  on public.daily_spending for select
  using (auth.uid() = user_id);

create policy "Users can insert own spending"
  on public.daily_spending for insert
  with check (auth.uid() = user_id);

create policy "Users can update own spending"
  on public.daily_spending for update
  using (auth.uid() = user_id);
