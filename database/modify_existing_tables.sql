-- MODIFY EXISTING TABLES INSTEAD OF DROPPING
-- This approach is much safer and preserves any existing data

-- First, let's see what we have currently
SELECT 'Current orders table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check current store_locations table
SELECT 'Current store_locations table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'store_locations' 
ORDER BY ordinal_position;

-- STEP 1: Add missing columns to orders table if they don't exist
-- Add pickup store ID field (rename from store_location_id if needed)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_store_id INTEGER;

-- Add separate delivery address fields if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_street_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_state VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zip VARCHAR(10);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;

-- Add other missing fields if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS case_type VARCHAR(20) DEFAULT 'regular';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status VARCHAR(20) DEFAULT 'pending';

-- STEP 2: If store_location_id exists, copy it to pickup_store_id
DO $$ 
BEGIN
    -- Check if store_location_id column exists and copy data
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'store_location_id') THEN
        UPDATE orders SET pickup_store_id = store_location_id WHERE store_location_id IS NOT NULL;
        RAISE NOTICE 'Copied store_location_id to pickup_store_id';
    END IF;
END $$;

-- STEP 3: If delivery_address exists, parse it into separate fields
DO $$ 
BEGIN
    -- Check if old delivery_address column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_address') THEN
        -- Copy the address to the new street address field
        UPDATE orders SET delivery_street_address = delivery_address WHERE delivery_address IS NOT NULL AND delivery_address != 'N/A';
        RAISE NOTICE 'Copied delivery_address to delivery_street_address';
    END IF;
END $$;

-- STEP 4: Add foreign key constraint for pickup_store_id if store_locations table exists
DO $$ 
BEGIN
    -- Add foreign key constraint if store_locations exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'store_locations') THEN
        ALTER TABLE orders ADD CONSTRAINT fk_pickup_store_id FOREIGN KEY (pickup_store_id) REFERENCES store_locations(id);
        RAISE NOTICE 'Added foreign key constraint for pickup_store_id';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Foreign key constraint already exists';
END $$;

-- STEP 5: Add check constraint for fulfillment_method if it doesn't exist
DO $$ 
BEGIN
    ALTER TABLE orders ADD CONSTRAINT check_fulfillment_method CHECK (fulfillment_method IN ('pickup', 'delivery'));
    RAISE NOTICE 'Added fulfillment_method check constraint';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Fulfillment method check constraint already exists';
END $$;

-- STEP 6: Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_orders_pickup_store ON orders(pickup_store_id);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment ON orders(fulfillment_method);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- STEP 7: Show final table structure
SELECT 'Final orders table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- STEP 8: Test the relationship - show orders with store names
SELECT 'Testing pickup location relationship:' as info;
SELECT 
    o.id,
    o.email,
    o.fulfillment_method,
    o.pickup_store_id,
    sl.name as pickup_store_name,
    o.delivery_street_address
FROM orders o
LEFT JOIN store_locations sl ON o.pickup_store_id = sl.id
LIMIT 5;

SELECT 'Database modification completed successfully!' as status;