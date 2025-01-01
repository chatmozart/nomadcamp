-- Create profiles table
create table "public"."profiles" (
    "id" uuid not null references auth.users(id) on delete cascade,
    "name" text,
    "email" text,
    "whatsapp" text,
    "updated_at" timestamp with time zone,
    primary key ("id")
);

-- Enable RLS
alter table "public"."profiles" enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on profiles for select
    to authenticated
    using ( auth.uid() = id );

create policy "Users can update their own profile"
    on profiles for update
    to authenticated
    using ( auth.uid() = id );

create policy "Users can insert their own profile"
    on profiles for insert
    to authenticated
    with check ( auth.uid() = id );

-- Create a function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name, email)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        new.email
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to automatically create profile for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Backfill existing users
insert into public.profiles (id, name, email)
select 
    id,
    coalesce((raw_user_meta_data->>'full_name')::text, ''),
    email
from auth.users
on conflict (id) do nothing;