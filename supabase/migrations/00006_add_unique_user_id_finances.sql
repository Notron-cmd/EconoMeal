-- Add unique constraint on user_id for user_finances to support upsert (ON CONFLICT)
alter table public.user_finances
  add constraint user_finances_user_id_key unique (user_id);