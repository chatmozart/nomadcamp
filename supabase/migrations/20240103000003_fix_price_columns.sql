-- First check if columns exist and drop them if they do to ensure clean state
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'price_three_months') THEN
        ALTER TABLE "public"."properties" DROP COLUMN "price_three_months";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'price_six_months') THEN
        ALTER TABLE "public"."properties" DROP COLUMN "price_six_months";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'price_one_year') THEN
        ALTER TABLE "public"."properties" DROP COLUMN "price_one_year";
    END IF;
END $$;

-- Add the columns fresh
ALTER TABLE "public"."properties" 
    ADD COLUMN "price_three_months" numeric,
    ADD COLUMN "price_six_months" numeric,
    ADD COLUMN "price_one_year" numeric;

-- Grant necessary permissions
GRANT ALL ON "public"."properties" TO authenticated;
GRANT ALL ON "public"."properties" TO service_role;

-- Ensure RLS policy is updated
DROP POLICY IF EXISTS "Users can update their own properties" ON "public"."properties";

CREATE POLICY "Users can update their own properties"
    ON "public"."properties"
    FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);