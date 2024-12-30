-- Enable RLS on amenities table
alter table "public"."amenities" enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can read amenities" on "public"."amenities";

-- Create public read access policy for amenities
create policy "Anyone can read amenities"
on "public"."amenities"
for select
to public
using (true);

-- Enable RLS on property_amenities table
alter table "public"."property_amenities" enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can read property amenities" on "public"."property_amenities";

-- Create public read access policy for property_amenities
create policy "Anyone can read property amenities"
on "public"."property_amenities"
for select
to public
using (true);

-- Verify amenities exist and are accessible
do $$
declare
  amenity_count integer;
begin
  select count(*) into amenity_count from public.amenities;
  if amenity_count = 0 then
    raise warning 'No amenities found in the database. Please ensure amenities are properly seeded.';
  else
    raise notice '% amenities found in the database', amenity_count;
  end if;
end $$;