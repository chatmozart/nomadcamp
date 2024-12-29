alter table "public"."properties" 
  add column if not exists "price_three_months" numeric,
  add column if not exists "price_six_months" numeric,
  add column if not exists "price_one_year" numeric;