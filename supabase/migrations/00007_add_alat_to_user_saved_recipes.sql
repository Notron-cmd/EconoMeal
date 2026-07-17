alter table public.user_saved_recipes
add column if not exists alat jsonb default '[]'::jsonb;
