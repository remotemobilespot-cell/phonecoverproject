-- Clean Orders Table Migration
-- This script will reorganize the orders table with proper data types for pickup and delivery

-- First, let's check what data types these columns currently have
-- and fix them to work properly

-- Fix pickup location columns
ALTER TABLE orders 
ALTER COLUMN pickup_location TYPE TEXT,
ALTER COLUMN store_location_id TYPE INTEGER;

-- Fix delivery address columns  
ALTER TABLE orders
ALTER COLUMN delivery_address TYPE TEXT,
ALTER COLUMN delivery_city TYPE TEXT,
ALTER COLUMN delivery_state TYPE TEXT,
ALTER COLUMN delivery_zip TYPE TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_store_location_id ON orders(store_location_id);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_method ON orders(fulfillment_method);

-- Add foreign key constraint for store_location_id
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_store_location 
FOREIGN KEY (store_location_id) REFERENCES store_locations(id);