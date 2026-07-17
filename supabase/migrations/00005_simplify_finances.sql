-- Drop expense_logs table and policies
drop policy if exists "Users can view own expenses" on public.expense_logs;
drop policy if exists "Users can insert own expenses" on public.expense_logs;
drop table if exists public.expense_logs;

-- Drop meal_history table and policies
drop policy if exists "Users can view own meal history" on public.meal_history;
drop policy if exists "Users can insert own meal history" on public.meal_history;
drop table if exists public.meal_history;

-- Drop nutrition tracking policies (table kept but RLS simplified later if needed)
drop policy if exists "Users can view own nutrition" on public.daily_nutrition;
drop policy if exists "Users can upsert own nutrition" on public.daily_nutrition;
drop policy if exists "Users can update own nutrition" on public.daily_nutrition;

-- Simplify user_finances: remove generated column, old columns, rename
alter table public.user_finances
  drop column if exists daily_budget,
  drop column if exists pengeluaran_tetap,
  drop column if exists target_tabungan;
  rename column uang_bulanan to anggaran_makan;
