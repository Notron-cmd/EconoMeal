-- Add pantry_staples column to profiles
alter table public.profiles
add column if not exists pantry_staples text[] default '{}';
