-- BACKUP EXISTING DATA BEFORE MIGRATION
-- Run this first to save any existing orders

-- Create backup tables
CREATE TABLE orders_backup AS SELECT * FROM orders;
CREATE TABLE store_locations_backup AS SELECT * FROM store_locations;

-- Show what we're backing up
SELECT 
    'orders' as table_name,
    COUNT(*) as record_count
FROM orders
UNION ALL
SELECT 
    'store_locations' as table_name,
    COUNT(*) as record_count  
FROM store_locations;

-- Export important data to check
SELECT 
    id,
    email,
    phone_model,
    fulfillment_method,
    store_location_id,
    delivery_address,
    created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;