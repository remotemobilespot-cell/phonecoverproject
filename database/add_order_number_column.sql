-- Add order_number column to orders table for user-friendly order numbers
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number text;

-- Create unique index on order_number
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Update existing orders with generated order numbers
UPDATE orders 
SET order_number = 'PC-' || to_char(created_at, 'YYYYMMDD') || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 4, '0')
WHERE order_number IS NULL;

-- Add comment to the column
COMMENT ON COLUMN orders.order_number IS 'User-friendly order number in format PC-YYYYMMDD-XXXX';