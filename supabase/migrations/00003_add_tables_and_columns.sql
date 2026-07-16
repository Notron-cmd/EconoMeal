-- Add columns to profiles
alter table public.profiles
add column if not exists provinsi text,
add column if not exists avatar_url text;

-- Add name column to expense_logs and expand meal_type
alter table public.expense_logs
add column if not exists name text;

alter table public.expense_logs
drop constraint if exists expense_logs_meal_type_check;

alter table public.expense_logs
add constraint expense_logs_meal_type_check
  check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack', 'grocery', 'other'));

-- Recipes table
create table if not exists public.recipes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  image_url text,
  cooking_time_minutes int,
  servings int default 2,
  ingredients jsonb,
  steps jsonb,
  nutrition jsonb,
  cost_estimate numeric,
  equipment_needed text[],
  meal_type text,
  dietary_tags text[],
  created_at timestamptz default now()
);

-- Daily nutrition tracking
create table if not exists public.daily_nutrition (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  total_calories numeric default 0,
  total_protein numeric default 0,
  total_carbs numeric default 0,
  total_fats numeric default 0,
  unique(user_id, date)
);

-- User streaks
create table if not exists public.user_streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  current_streak int default 0,
  longest_streak int default 0,
  last_active_date date default current_date
);

-- Saver tips
create table if not exists public.saver_tips (
  id bigint generated always as identity primary key,
  tip_text text not null,
  savings_amount numeric,
  category text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.recipes enable row level security;
alter table public.daily_nutrition enable row level security;
alter table public.user_streaks enable row level security;
alter table public.saver_tips enable row level security;

-- RLS policies for recipes (public read)
create policy "Recipes public read"
  on public.recipes for select using (true);

-- RLS policies for daily_nutrition
create policy "Users can view own nutrition"
  on public.daily_nutrition for select using (auth.uid() = user_id);

create policy "Users can upsert own nutrition"
  on public.daily_nutrition for insert with check (auth.uid() = user_id);

create policy "Users can update own nutrition"
  on public.daily_nutrition for update using (auth.uid() = user_id);

-- RLS policies for user_streaks
create policy "Users can view own streak"
  on public.user_streaks for select using (auth.uid() = user_id);

create policy "Users can upsert own streak"
  on public.user_streaks for insert with check (auth.uid() = user_id);

create policy "Users can update own streak"
  on public.user_streaks for update using (auth.uid() = user_id);

-- RLS policies for saver_tips (public read)
create policy "Saver tips public read"
  on public.saver_tips for select using (true);

-- Seed some recipes
insert into public.recipes (name, description, image_url, cooking_time_minutes, servings, ingredients, steps, nutrition, cost_estimate, equipment_needed, meal_type, dietary_tags) values
(
  'Lentil & Sweet Potato Curry',
  'High-protein, vegan comfort food that''s easy on the wallet.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBuneNgj4IUlgNcmQPG1euF9d3IDii_jqJ5PfFJfTRSclAIHXlyQV3KrXzKUsdniWMf6s9bP0wfGOOqNmx9RrVaH6dvnjNKY0f5kgvsq2x1ewgtUwmUCeCB6ldkJqF87ykNCxQkwkeQccQ37DpVo68AzFTGJ4KLEGLvMxc_YoHwfS8MinZrOutnIPAu5cSsoFdXQA8E1umwvbDGYMMNhoRDuWK9apYGSYQtZr0Gwi4eiCqG2UZqBz05Kg',
  20,
  2,
  '[{"name":"Red Lentils","amount":"1 cup"},{"name":"Coconut Milk","amount":"1/2 can"},{"name":"Fresh Ginger","amount":"1 tbsp"},{"name":"Turmeric Powder","amount":"1 tsp"},{"name":"Sweet Potato","amount":"1 large"},{"name":"Onion","amount":"1 medium"},{"name":"Garlic","amount":"3 cloves"}]',
  '["Rinse red lentils under cold water until the water runs clear. Set aside.","In a large pot, saute onion and ginger for 5 minutes until soft and fragrant.","Add spices, lentils, diced sweet potato, and 3 cups of water. Simmer for 15-20 minutes until lentils are soft.","Stir in coconut milk, simmer for 2 more minutes. Serve hot with rice or bread."]',
  '{"calories":340,"protein":18,"carbs":42,"fats":6}',
  2.50,
  '{"Single Pot"}',
  'dinner',
  '{"vegan","gluten-free"}'
),
(
  'Chickpea Power Salad',
  'A fresh and filling salad packed with plant-based protein.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgIyZHVw8mTDLhH53ZIufzCLAL65xQ-tyRJOwsC7yt3bNLHAaBsmrgZwDOFujVAnzU0hYb9awKMYDmuQ-iqZqWiKb5tARIxqvAgUaq-91akOwmOy2QT0KOpsg3GKPCyrWT0TjzLDgSUsVHuKpPT6Cqjf9Jr__FeHxl_5YgAM05bdAjQIjK8EyZtwN_R_U7H_yu4CQ4hZjR_M8Xjdt9aMghXRGUgLttLHbz5_0iyRu5Hq0tLnMBn2x8Fw',
  15,
  2,
  '[{"name":"Chickpeas","amount":"1 can"},{"name":"Mixed Greens","amount":"3 cups"},{"name":"Cherry Tomatoes","amount":"1 cup"},{"name":"Cucumber","amount":"1 medium"},{"name":"Lemon Juice","amount":"2 tbsp"},{"name":"Olive Oil","amount":"1 tbsp"}]',
  '["Rinse and drain chickpeas.","Chop cucumber and halve cherry tomatoes.","Toss all ingredients together with lemon juice and olive oil.","Season with salt and pepper to taste. Serve chilled."]',
  '{"calories":280,"protein":12,"carbs":35,"fats":8}',
  1.80,
  '{"No Cook"}',
  'lunch',
  '{"vegan","gluten-free","dairy-free"}'
),
(
  'Garlic Spinach Pasta',
  'Quick, cheap, and wildly satisfying weeknight dinner.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAkvl3uLFuzrXGhrnPXbT_CI7tCSpnlxzvq_54ZTZ42CUcpwGKD9utjSGafwmTw7jk3Xb5EpX9ynpTD1SWJMnAhakY_kfsRZEB4_95v8wc1plZ-FePduDf0ju_O7bvh5xugBO4yYqdD2TRTtkjKdTSW6BqKAa1B-OK05IHpdQvmp8GZjpBlVfdP5AXO21luItuoXG7bnyguARF991-tGrGl0FAJsSG0QpYdaqZVboZ45mKN0FAsaFCl1w',
  12,
  2,
  '[{"name":"Pasta","amount":"200g"},{"name":"Spinach","amount":"3 cups"},{"name":"Garlic","amount":"4 cloves"},{"name":"Olive Oil","amount":"2 tbsp"},{"name":"Parmesan","amount":"2 tbsp"}]',
  '["Cook pasta according to package directions. Reserve 1/2 cup pasta water.","In a large pan, saute sliced garlic in olive oil until fragrant.","Add spinach and cook until wilted, about 2 minutes.","Toss in cooked pasta, add pasta water as needed. Top with parmesan."]',
  '{"calories":380,"protein":14,"carbs":48,"fats":10}',
  2.10,
  '{"Single Pot"}',
  'dinner',
  '{"vegetarian"}'
),
(
  'Veggie Tofu Stir-fry',
  'Crispy tofu and colorful veggies in a savory sauce.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAVBC5fLsNKtCPs-OIq93l0wJVQbJXRwBFniL2U_mtoZMpMLN3EOh-nQ9aAJic-MXqcdgSRDYgZD9OA5R8nC3maSBdon0WM1tItXVF3qC7CD9ciQJpOjXZrk5aeVf4QfV25oWTGGs1F-DgIkbHnQz05sx6N4ZF4ICiVfe_7TEgjjZMehtz1yliAeTGXQToUuyvcMgpustkAV-RgQUVYFP8CVa6JRSPRyZCKiHfQAe2r3pq__e5PizADnQ',
  18,
  2,
  '[{"name":"Firm Tofu","amount":"200g"},{"name":"Broccoli","amount":"1 cup"},{"name":"Bell Pepper","amount":"1 medium"},{"name":"Soy Sauce","amount":"2 tbsp"},{"name":"Garlic","amount":"2 cloves"},{"name":"Rice","amount":"1 cup cooked"}]',
  '["Press and cube tofu. Pan-fry until golden on all sides.","Stir-fry garlic, broccoli, and bell pepper for 3-4 minutes.","Add tofu back to pan with soy sauce. Toss to coat.","Serve over steamed rice."]',
  '{"calories":320,"protein":22,"carbs":30,"fats":12}',
  2.90,
  '{"Single Pot"}',
  'dinner',
  '{"vegan","dairy-free"}'
),
(
  'Golden Egg & Spinach Rice',
  'A quick one-pan meal using basic fridge staples.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCTC63erkocuO86tASMd_x0yUlCxrrTPsiNrHwVsqdakeyDKoztah-8KxFHNeDgRTk3cVCXedNUJA0iDo5g3I9ZDUQFZcxj0qGdP30ianePBsxo_KXVJQA7TgG3HyrByY1lZ0AdayNkuVpnjsKIEHuo1Vz43ukH-PdIb7EW7RxUr-HPIaas5RnKkvzoIByj38YlcmAzAcjaMmzJtnsXOW3lg_aK9Ni55gYOEJk_JI30c69YAWluQrmbjA',
  15,
  1,
  '[{"name":"Eggs","amount":"2"},{"name":"Spinach","amount":"2 cups"},{"name":"Rice","amount":"1 cup cooked"},{"name":"Garlic","amount":"2 cloves"},{"name":"Soy Sauce","amount":"1 tbsp"}]',
  '["Scramble eggs in a hot pan with a little oil. Set aside.","Saute garlic until fragrant, then add spinach until wilted.","Add rice and soy sauce, stir-fry for 2 minutes.","Mix eggs back in. Serve hot."]',
  '{"calories":350,"protein":16,"carbs":40,"fats":11}',
  1.50,
  '{"Single Pot"}',
  'lunch',
  '{"gluten-free"}'
)
on conflict do nothing;

-- Seed saver tips
insert into public.saver_tips (tip_text, savings_amount, category) values
  ('Buying bulk grains instead of pre-packaged boxes could save you money this week.', 12, 'bulk'),
  ('Frozen vegetables are just as nutritious as fresh and cost 40% less.', 8, 'seasonal'),
  ('Planning your meals for the week reduces food waste and saves money.', 15, 'planning'),
  ('Rice and beans make a complete protein and cost under $1 per serving.', 10, 'staples'),
  ('Shop at local markets in the evening for discounted fresh produce.', 6, 'seasonal'),
  ('Cook once, eat twice — double your recipe and save half for tomorrow.', 20, 'planning')
on conflict do nothing;

-- Seed regional prices for common ingredients
insert into public.regional_prices (nama_bahan, wilayah, estimasi_harga, satuan) values
  ('Rice', 'Jakarta', 15000, 'kg'),
  ('Rice', 'Bandung', 14000, 'kg'),
  ('Rice', 'Surabaya', 14500, 'kg'),
  ('Eggs', 'Jakarta', 30000, 'kg'),
  ('Eggs', 'Bandung', 28000, 'kg'),
  ('Eggs', 'Surabaya', 29000, 'kg'),
  ('Spinach', 'Jakarta', 5000, 'ikat'),
  ('Spinach', 'Bandung', 4000, 'ikat'),
  ('Spinach', 'Surabaya', 4500, 'ikat'),
  ('Chicken Breast', 'Jakarta', 35000, 'kg'),
  ('Chicken Breast', 'Bandung', 32000, 'kg'),
  ('Chicken Breast', 'Surabaya', 33000, 'kg'),
  ('Tofu', 'Jakarta', 10000, 'kg'),
  ('Tofu', 'Bandung', 8000, 'kg'),
  ('Tofu', 'Surabaya', 9000, 'kg'),
  ('Tempeh', 'Jakarta', 12000, 'kg'),
  ('Tempeh', 'Bandung', 10000, 'kg'),
  ('Tempeh', 'Surabaya', 11000, 'kg'),
  ('Tomato', 'Jakarta', 15000, 'kg'),
  ('Tomato', 'Bandung', 13000, 'kg'),
  ('Tomato', 'Surabaya', 14000, 'kg'),
  ('Potato', 'Jakarta', 18000, 'kg'),
  ('Potato', 'Bandung', 16000, 'kg'),
  ('Potato', 'Surabaya', 17000, 'kg'),
  ('Carrot', 'Jakarta', 15000, 'kg'),
  ('Carrot', 'Bandung', 13000, 'kg'),
  ('Carrot', 'Surabaya', 14000, 'kg'),
  ('Onion', 'Jakarta', 20000, 'kg'),
  ('Onion', 'Bandung', 18000, 'kg'),
  ('Onion', 'Surabaya', 19000, 'kg'),
  ('Garlic', 'Jakarta', 25000, 'kg'),
  ('Garlic', 'Bandung', 23000, 'kg'),
  ('Garlic', 'Surabaya', 24000, 'kg'),
  ('Cooking Oil', 'Jakarta', 20000, 'liter'),
  ('Cooking Oil', 'Bandung', 18000, 'liter'),
  ('Cooking Oil', 'Surabaya', 19000, 'liter'),
  ('Mie Instan', 'Jakarta', 3500, 'bungkus'),
  ('Mie Instan', 'Bandung', 3000, 'bungkus'),
  ('Mie Instan', 'Surabaya', 3200, 'bungkus')
on conflict do nothing;
