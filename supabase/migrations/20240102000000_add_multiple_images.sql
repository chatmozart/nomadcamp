-- Add new images table to store multiple images per property
create table "public"."property_images" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "property_id" uuid not null references properties(id) on delete cascade,
    "image_url" text not null,
    "order" integer not null default 0,
    primary key ("id")
);

-- Set up Row Level Security (RLS)
alter table "public"."property_images" enable row level security;

-- Create policies
create policy "Users can view all property images"
    on property_images for select
    to authenticated
    using (true);

create policy "Users can insert images for their properties"
    on property_images for insert
    to authenticated
    with check (
        exists (
            select 1 from properties
            where id = property_id
            and owner_id = auth.uid()
        )
    );

create policy "Users can update images for their properties"
    on property_images for update
    to authenticated
    using (
        exists (
            select 1 from properties
            where id = property_id
            and owner_id = auth.uid()
        )
    );

create policy "Users can delete images for their properties"
    on property_images for delete
    to authenticated
    using (
        exists (
            select 1 from properties
            where id = property_id
            and owner_id = auth.uid()
        )
    );

-- Add constraint to limit images per property
create function check_image_limit()
returns trigger as $$
begin
  if (select count(*) from property_images where property_id = NEW.property_id) >= 10 then
    raise exception 'Maximum of 10 images allowed per property';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger enforce_image_limit
before insert on property_images
for each row
execute function check_image_limit();