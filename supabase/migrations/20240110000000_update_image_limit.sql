-- Update the check_image_limit function to allow 20 images
CREATE OR REPLACE FUNCTION check_image_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM property_images WHERE property_id = NEW.property_id) >= 20 THEN
    RAISE EXCEPTION 'Maximum of 20 images allowed per property';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- No need to recreate the trigger as it's already using the function