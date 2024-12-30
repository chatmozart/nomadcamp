-- Create locations table for categories
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add location_category_id to properties (renamed from location_id for clarity)
ALTER TABLE properties 
  DROP COLUMN IF EXISTS location_id,
  ADD COLUMN location_category_id INTEGER REFERENCES locations(id),
  -- Ensure the existing location column remains for Google Maps data
  ALTER COLUMN location SET NOT NULL;

-- Insert predefined location categories
INSERT INTO locations (name) VALUES
  ('Koh Phangan - Thailand'),
  ('Chiang Mai - Thailand'),
  ('Bali - Indonesia'),
  ('Lisbon - Portugal'),
  ('Tenerife - Spain'),
  ('Santa Teresa - Costa Rica'),
  ('Tamarindo - Costa Rica');

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to locations
CREATE POLICY "Allow public read access to locations" ON locations
  FOR SELECT TO public USING (true);