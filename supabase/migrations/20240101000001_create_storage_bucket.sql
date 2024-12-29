-- First, ensure we start fresh by dropping existing policies and bucket
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop bucket if exists "properties";

-- Create the properties bucket
insert into storage.buckets (id, name, public)
values ('properties', 'properties', true);

-- Allow public read access to all files in the bucket
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
grant all on storage.buckets to authenticated;