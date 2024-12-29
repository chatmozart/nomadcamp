create table "public"."properties" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text,
    "price" numeric not null,
    "location" text not null,
    "image_url" text,
    "owner_id" uuid not null references auth.users(id) on delete cascade,
    primary key ("id")
);

-- Set up Row Level Security (RLS)
alter table "public"."properties" enable row level security;

-- Create policies
create policy "Users can view all properties"
    on properties for select
    to authenticated
    using (true);

create policy "Users can insert their own properties"
    on properties for insert
    to authenticated
    with check (auth.uid() = owner_id);

create policy "Users can update their own properties"
    on properties for update
    to authenticated
    using (auth.uid() = owner_id);

create policy "Users can delete their own properties"
    on properties for delete
    to authenticated
    using (auth.uid() = owner_id);