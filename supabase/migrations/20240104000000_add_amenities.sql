-- Create amenities table
create table "public"."amenities" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "icon" text not null,
    primary key ("id")
);

-- Create property_amenities junction table
create table "public"."property_amenities" (
    "property_id" uuid not null references properties(id) on delete cascade,
    "amenity_id" uuid not null references amenities(id) on delete cascade,
    primary key ("property_id", "amenity_id")
);

-- Insert default amenities with Lucide icon names
insert into "public"."amenities" ("name", "icon") values
    ('WiFi', 'Wifi'),
    ('TV', 'Tv'),
    ('Air conditioning', 'Wind'),
    ('Heating', 'Flame'),
    ('Kitchen', 'UtensilsCrossed'),
    ('Washer', 'Shirt'),
    ('Dryer', 'Fan'),
    ('Free parking', 'Car'),
    ('Dedicated workspace', 'LayoutDashboard'),
    ('Pool', 'Waves'),
    ('Hot tub', 'Bath'),
    ('BBQ grill', 'Flame'),
    ('Exercise equipment', 'Dumbbell'),
    ('Security cameras', 'Camera'),
    ('Smoke alarm', 'Bell'),
    ('First aid kit', 'Heart'),
    ('Fire extinguisher', 'Flame'),
    ('Basic essentials', 'Package'),
    ('Bed linens', 'BedDouble'),
    ('Coffee maker', 'Coffee');

-- Set up RLS policies
alter table "public"."amenities" enable row level security;
alter table "public"."property_amenities" enable row level security;

create policy "Anyone can read amenities"
    on amenities for select
    to authenticated
    using (true);

create policy "Property owners can manage property amenities"
    on property_amenities for all
    to authenticated
    using (
        exists (
            select 1 from properties
            where properties.id = property_id
            and properties.owner_id = auth.uid()
        )
    );