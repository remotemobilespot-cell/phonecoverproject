-- Create a database function to execute SQL queries (admin only)
-- This is for the admin database management interface

CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    result json;
    query_type text;
BEGIN
    -- Get the first word of the query to determine type
    query_type := upper(split_part(trim(query), ' ', 1));
    
    -- Security check - only allow certain query types
    IF query_type NOT IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALTER', 'CREATE', 'DROP') THEN
        RAISE EXCEPTION 'Query type not allowed: %', query_type;
    END IF;
    
    -- Execute the query
    IF query_type = 'SELECT' THEN
        -- For SELECT queries, return the data as JSON
        EXECUTE 'SELECT array_to_json(array_agg(row_to_json(t))) FROM (' || query || ') t' INTO result;
        RETURN COALESCE(result, '[]'::json);
    ELSE
        -- For DML/DDL queries, just execute and return success
        EXECUTE query;
        RETURN json_build_object('success', true, 'message', 'Query executed successfully');
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'SQL Error: %', SQLERRM;
END;
$$;

-- Add the case_type column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS case_type text DEFAULT 'regular';

-- Update existing orders to set case_type from admin_notes if available
UPDATE orders 
SET case_type = CASE 
    WHEN admin_notes LIKE '%MagSafe%' THEN 'magsafe'
    WHEN admin_notes LIKE '%Regular%' THEN 'regular'
    ELSE 'regular'
END
WHERE case_type IS NULL OR case_type = 'regular';

-- Add additional useful columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS base_price decimal(10,2) DEFAULT 20.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee decimal(10,2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount decimal(10,2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal decimal(10,2);

-- Update phone_models to include base price
ALTER TABLE phone_models ADD COLUMN IF NOT EXISTS base_price decimal(10,2) DEFAULT 20.00;
ALTER TABLE phone_models ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE phone_models ADD COLUMN IF NOT EXISTS supports_magsafe boolean DEFAULT true;

-- Update store locations to include active status
ALTER TABLE store_locations ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_orders_case_type ON orders(case_type);
CREATE INDEX IF NOT EXISTS idx_orders_phone_model_id ON orders(phone_model_id);
CREATE INDEX IF NOT EXISTS idx_phone_models_active ON phone_models(is_active);
CREATE INDEX IF NOT EXISTS idx_store_locations_active ON store_locations(is_active);