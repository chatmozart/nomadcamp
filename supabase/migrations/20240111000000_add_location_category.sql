-- Create locations table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add location_id to properties
ALTER TABLE properties ADD COLUMN location_id INTEGER REFERENCES locations(id);

-- Insert predefined locations
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