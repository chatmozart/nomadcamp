-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read amenities" ON "public"."amenities";
DROP POLICY IF EXISTS "Anyone can read property amenities" ON "public"."property_amenities";

-- Create public read access policy for amenities
CREATE POLICY "Anyone can read amenities"
ON "public"."amenities"
FOR SELECT
USING (true);

-- Create public read access policy for property_amenities
CREATE POLICY "Anyone can read property amenities"
ON "public"."property_amenities"
FOR SELECT
USING (true);

-- Verify the policies are created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'amenities' 
    AND policyname = 'Anyone can read amenities'
  ) THEN
    RAISE EXCEPTION 'Amenities policy not created correctly';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'property_amenities' 
    AND policyname = 'Anyone can read property amenities'
  ) THEN
    RAISE EXCEPTION 'Property amenities policy not created correctly';
  END IF;
END $$;