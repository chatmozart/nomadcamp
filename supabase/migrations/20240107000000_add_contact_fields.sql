alter table "public"."properties" 
add column if not exists "contact_name" text,
add column if not exists "contact_email" text,
add column if not exists "contact_whatsapp" text;