-- Add published column to properties table
ALTER TABLE "public"."properties" 
ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;

-- Update RLS policies to handle published state
DROP POLICY IF EXISTS "Anyone can view all properties" ON "public"."properties";

CREATE POLICY "Users can view published properties or their own"
    ON "public"."properties"
    FOR SELECT
    USING (
        published = true 
        OR 
        auth.uid() = owner_id
    );