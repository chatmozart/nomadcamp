-- Drop existing bucket if it exists
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow authenticated uploads" on storage.objects;

-- Recreate the properties storage bucket
insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do nothing;

-- Allow public access to the bucket
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'properties' );

-- Allow authenticated users to upload images
create policy "Allow authenticated uploads" 
on storage.objects for insert 
to authenticated 
with check (
  bucket_id = 'properties' 
  and (storage.extension(name) = 'jpg' or 
       storage.extension(name) = 'jpeg' or 
       storage.extension(name) = 'png' or 
       storage.extension(name) = 'webp')
);

-- Grant necessary permissions
grant all on storage.objects to authenticated;
grant usage on schema storage to authenticated;