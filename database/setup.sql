  -- Database setup for Custom Phone Case Print App

-- Create phone_models table
CREATE TABLE IF NOT EXISTS phone_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create store_locations table  
CREATE TABLE IF NOT EXISTS store_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(10) NOT NULL,
  zipCode VARCHAR(10) NOT NULL,
  phone VARCHAR(20),
  hours VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_email VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100),
  contact_phone VARCHAR(20),
  phone_model VARCHAR(100) NOT NULL,
  phone_model_id VARCHAR(50),
  design_image VARCHAR(500),
  original_image VARCHAR(500),
  case_type VARCHAR(20) DEFAULT 'regular',
  brightness INTEGER DEFAULT 0,
  contrast INTEGER DEFAULT 0,
  saturation INTEGER DEFAULT 0,
  blur INTEGER DEFAULT 0,
  fulfillment_method VARCHAR(50),
  store_location_id UUID REFERENCES store_locations(id),
  delivery_address TEXT,
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert phone models
INSERT INTO phone_models (brand, model, image) VALUES
-- Apple iPhone Series
('Apple', 'iPhone 11', '/assets/phones/iphone-11.jpg'),
('Apple', 'iPhone 11 Pro', '/assets/phones/iphone-11-pro.jpg'),
('Apple', 'iPhone 11 Pro Max', '/assets/phones/iphone-11-pro-max.jpg'),
('Apple', 'iPhone 12 mini', '/assets/phones/iphone-12-mini.jpg'),
('Apple', 'iPhone 12', '/assets/phones/iphone-12.jpg'),
('Apple', 'iPhone 12 Pro Max', '/assets/phones/iphone-12-pro-max.jpg'),
('Apple', 'iPhone 13 mini', '/assets/phones/iphone-13-mini.jpg'),
('Apple', 'iPhone 13', '/assets/phones/iphone-13.jpg'),
('Apple', 'iPhone 13 Pro', '/assets/phones/iphone-13-pro.jpg'),
('Apple', 'iPhone 13 Pro Max', '/assets/phones/iphone-13-pro-max.jpg'),
('Apple', 'iPhone 14', '/assets/phones/iphone-14.jpg'),
('Apple', 'iPhone 14 Plus', '/assets/phones/iphone-14-plus.jpg'),
('Apple', 'iPhone 14 Pro', '/assets/phones/iphone-14-pro.jpg'),
('Apple', 'iPhone 14 Pro Max', '/assets/phones/iphone-14-pro-max.jpg'),
('Apple', 'iPhone 15', '/assets/phones/iphone-15.jpg'),
('Apple', 'iPhone 15 Plus', '/assets/phones/iphone-15-plus.jpg'),
('Apple', 'iPhone 15 Pro', '/assets/phones/iphone-15-pro.jpg'),
('Apple', 'iPhone 15 Pro Max', '/assets/phones/iphone-15-pro-max.jpg'),
('Apple', 'iPhone 16e', '/assets/phones/iphone-16e.jpg'),
('Apple', 'iPhone 16', '/assets/phones/iphone-16.jpg'),
('Apple', 'iPhone 16 Plus', '/assets/phones/iphone-16-plus.jpg'),
('Apple', 'iPhone 16 Pro', '/assets/phones/iphone-16-pro.jpg'),
('Apple', 'iPhone 16 Pro Max', '/assets/phones/iphone-16-pro-max.jpg'),
('Apple', 'iPhone 17', '/assets/phones/iphone-17.jpg'),
('Apple', 'iPhone 17 Air', '/assets/phones/iphone-17-air.jpg'),
('Apple', 'iPhone 17 Pro', '/assets/phones/iphone-17-pro.jpg'),
('Apple', 'iPhone 17 Pro Max', '/assets/phones/iphone-17-pro-max.jpg'),
-- Samsung S Series
('Samsung', 'Galaxy S22', '/assets/phones/galaxy-s22.jpg'),
('Samsung', 'Galaxy S22 Plus', '/assets/phones/galaxy-s22-plus.jpg'),
('Samsung', 'Galaxy S22 Ultra', '/assets/phones/galaxy-s22-ultra.jpg'),
('Samsung', 'Galaxy S23 FE', '/assets/phones/galaxy-s23-fe.jpg'),
('Samsung', 'Galaxy S23', '/assets/phones/galaxy-s23.jpg'),
('Samsung', 'Galaxy S23 Plus', '/assets/phones/galaxy-s23-plus.jpg'),
('Samsung', 'Galaxy S23 Ultra', '/assets/phones/galaxy-s23-ultra.jpg'),
('Samsung', 'Galaxy S24 FE', '/assets/phones/galaxy-s24-fe.jpg'),
('Samsung', 'Galaxy S24', '/assets/phones/galaxy-s24.jpg'),
('Samsung', 'Galaxy S24 Plus', '/assets/phones/galaxy-s24-plus.jpg'),
('Samsung', 'Galaxy S24 Ultra', '/assets/phones/galaxy-s24-ultra.jpg'),
('Samsung', 'Galaxy S25 Edge', '/assets/phones/galaxy-s25-edge.jpg'),
('Samsung', 'Galaxy S25', '/assets/phones/galaxy-s25.jpg'),
('Samsung', 'Galaxy S25 Plus', '/assets/phones/galaxy-s25-plus.jpg'),
('Samsung', 'Galaxy S25 Ultra', '/assets/phones/galaxy-s25-ultra.jpg'),
-- Samsung A Series
('Samsung', 'Galaxy A15 5G', '/assets/phones/galaxy-a15-5g.jpg'),
('Samsung', 'Galaxy A16 5G', '/assets/phones/galaxy-a16-5g.jpg'),
('Samsung', 'Galaxy A26 5G', '/assets/phones/galaxy-a26-5g.jpg'),
('Samsung', 'Galaxy A36 5G', '/assets/phones/galaxy-a36-5g.jpg');

-- Insert store locations
INSERT INTO store_locations (name, address, city, state, zipCode, phone, hours, latitude, longitude) VALUES
('Lufkin HEB', '111 North Timberland Dr.', 'Lufkin', 'TX', '75901', '936-707-2593', 'Mon-Sun: 9am-9pm', 31.3382, -94.7291),
('Lufkin 2', '507 South Timberland Dr.', 'Lufkin', 'TX', '75901', '936-229-6824', 'Mon-Sun: 9am-9pm', 31.3333, -94.7305),
('Corpus Leopard', '11100 Leopard St.', 'Corpus Christi', 'TX', '78410', '361-317-5155', 'Mon-Sun: 9am-9pm', 27.8465, -97.6366),
('Corpus Alameda', '3133 S Alameda St.', 'Corpus Christi', 'TX', '78412', '361-419-3290', 'Mon-Sun: 9am-9pm', 27.7333, -97.3855),
('Corpus Alameda 2', '4320 S Alameda St.', 'Corpus Christi', 'TX', '78404', '361-419-0170', 'Mon-Sun: 9am-9pm', 27.7337, -97.3858),
('Bay City', '2700 7th Street', 'Bay City', 'TX', '77414', '979-557-3994', 'Mon-Sun: 9am-9pm', 28.9828, -95.9694),
('San Antonio', '1015 S WW White Rd', 'San Antonio', 'TX', '78220', '210-309-7852', 'Mon-Sun: 9am-9pm', 29.4146, -98.3915),
('Houston - Rosslyn', '9436 N Houston Rosslyn Rd', 'Houston', 'TX', '77088', '713-849-5400', 'Mon-Sun: 9am-9pm', 29.8758, -95.4603),
('Cuero', '909 E Broadway St.', 'Cuero', 'TX', '77954', '361-541-3079', 'Mon-Sun: 9am-9pm', 29.0936, -97.2897),
('Harwin', '6855 Harwin Dr. Suite M1', 'Houston', 'TX', '77036', '346-701-8408', 'Mon-Sun: 9am-9pm', 29.7186, -95.5222);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_phone_models_brand ON phone_models(brand);
CREATE INDEX IF NOT EXISTS idx_store_locations_city_state ON store_locations(city, state);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(contact_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Enable Row Level Security (RLS)
ALTER TABLE phone_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to phone models and store locations
CREATE POLICY IF NOT EXISTS "Phone models are publicly readable" ON phone_models FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Store locations are publicly readable" ON store_locations FOR SELECT USING (true);

-- Create policies for orders - users can only see their own orders
CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON orders FOR SELECT USING (auth.uid()::text = contact_email OR contact_email = current_user);
CREATE POLICY IF NOT EXISTS "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid()::text = contact_email OR contact_email = current_user);