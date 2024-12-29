-- First, enable RLS if not already enabled
ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all properties" ON "public"."properties";
DROP POLICY IF EXISTS "Users can insert their own properties" ON "public"."properties";
DROP POLICY IF EXISTS "Users can update their own properties" ON "public"."properties";
DROP POLICY IF EXISTS "Users can delete their own properties" ON "public"."properties";

-- Create comprehensive policies
CREATE POLICY "Anyone can view all properties"
    ON "public"."properties"
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert their own properties"
    ON "public"."properties"
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own properties"
    ON "public"."properties"
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own properties"
    ON "public"."properties"
    FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- Also ensure the property_images table has proper policies
ALTER TABLE IF EXISTS "public"."property_images" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view property images" ON "public"."property_images";
DROP POLICY IF EXISTS "Users can manage their property images" ON "public"."property_images";

CREATE POLICY "Anyone can view property images"
    ON "public"."property_images"
    FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their property images"
    ON "public"."property_images"
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM properties p
            WHERE p.id = property_images.property_id
            AND p.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM properties p
            WHERE p.id = property_images.property_id
            AND p.owner_id = auth.uid()
        )
    );