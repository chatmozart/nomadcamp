-- Add new price columns for different rental durations
alter table "public"."properties" 
  add column if not exists "price_three_months" numeric,
  add column if not exists "price_six_months" numeric,
  add column if not exists "price_one_year" numeric;

-- Update RLS policies to include new columns
drop policy if exists "Users can update their own properties" on properties;

create policy "Users can update their own properties"
  on properties 
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);