-- Clear old seed data (English names, only 3 cities)
delete from public.regional_prices;

-- Add updated_at column if not exists
alter table public.regional_prices
add column if not exists updated_at timestamptz default now();

-- Update the unique constraint to use nama_bahan,wilayah
-- (already has unique(nama_bahan, wilayah) from initial schema)
