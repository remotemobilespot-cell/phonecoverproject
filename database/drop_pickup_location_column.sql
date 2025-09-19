-- Remove the problematic pickup_location column
-- We only need store_location_id to reference store_locations table

-- Drop the pickup_location column since it's causing UUID errors
-- and we don't need it (admin dashboard resolves store names from store_location_id)
ALTER TABLE orders DROP COLUMN IF EXISTS pickup_location;

-- Verify the delivery columns are working properly
-- (They seem to be working based on our test, but let's make sure they're the right type)
-- These should already be TEXT but let's ensure it
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('store_location_id', 'delivery_address', 'delivery_city', 'delivery_state', 'delivery_zip')
ORDER BY column_name;