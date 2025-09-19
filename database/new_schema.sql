-- NEW OPTIMIZED DATABASE SCHEMA
-- Drop existing tables and create clean, simple structure

-- Drop existing tables
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS store_locations CASCADE;

-- Recreate store_locations table (keep the working structure)
CREATE TABLE store_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    hours TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create new simplified orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer Info
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Product Info
    phone_model VARCHAR(100) NOT NULL,
    phone_model_id INTEGER,
    case_type VARCHAR(20) NOT NULL DEFAULT 'regular', -- 'regular' or 'magsafe'
    
    -- Images
    design_image_url TEXT,
    original_image_url TEXT,
    
    -- Fulfillment Method - CLEAR SEPARATION
    fulfillment_method VARCHAR(10) NOT NULL CHECK (fulfillment_method IN ('pickup', 'delivery')),
    
    -- PICKUP FIELDS (only used when fulfillment_method = 'pickup')
    pickup_store_id INTEGER REFERENCES store_locations(id),
    
    -- DELIVERY FIELDS (only used when fulfillment_method = 'delivery')
    delivery_street_address TEXT,
    delivery_city VARCHAR(100),
    delivery_state VARCHAR(50),
    delivery_zip VARCHAR(10),
    delivery_instructions TEXT,
    
    -- Payment Info
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending',
    
    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    order_status VARCHAR(20) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_fulfillment ON orders(fulfillment_method);
CREATE INDEX idx_orders_pickup_store ON orders(pickup_store_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Insert sample store locations
INSERT INTO store_locations (name, address, city, state, zip_code, latitude, longitude, phone) VALUES
('Lufkin HEB', '111 North Timberland Dr.', 'Lufkin', 'Texas', '75901', 31.3382, -94.7291, '(936) 632-6100'),
('Lufkin 2', '507 South Timberland Dr.', 'Lufkin', 'Texas', '75901', 31.3333, -94.7305, '(936) 632-6101'),
('Corpus Leopard', '11100 Leopard St', 'Corpus Christi', 'TX', '78441', 27.8465, -97.6366, '(361) 992-8000'),
('Corpus Alameda', '3133 S Alameda St', 'Corpus Christi', 'Texas', '78412', 27.7333, -97.3855, '(361) 992-8001'),
('Corpus Alameda 2', '4320 S Alameda St', 'Corpus Christi', 'TX', '78404', 27.7337, -97.3858, '(361) 992-8002'),
('Bay City', '2900 7th St', 'Bay City', 'TX', '77414', 28.9828, -95.9694, '(979) 245-1000'),
('San Antonio', '1015 S WW White Rd', 'San Antonio', 'TX', '78220', 29.4146, -98.3915, '(210) 333-4000'),
('Houston - Rosslyn', '9436 N Houston Rosslyn Rd', 'Houston', 'Texas', '77088', 29.8758, -95.4603, '(713) 999-1000'),
('Cuero', '909 E Broadway St', 'Cuero', 'TX', '77954', 29.0936, -97.2897, '(361) 275-3000'),
('Harwin', '6855 Harwin Dr', 'Houston', 'TX', '77036', 29.7186, -95.5222, '(713) 777-2000');

-- Add helpful comments
COMMENT ON TABLE orders IS 'Clean orders table with separate pickup and delivery fields';
COMMENT ON COLUMN orders.fulfillment_method IS 'Either pickup or delivery - determines which fields are used';
COMMENT ON COLUMN orders.pickup_store_id IS 'Foreign key to store_locations - only used for pickup orders';
COMMENT ON COLUMN orders.delivery_street_address IS 'Full street address - only used for delivery orders';

COMMENT ON TABLE store_locations IS 'Master list of pickup locations';