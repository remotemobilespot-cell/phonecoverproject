import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const phoneModels = [
  // Apple iPhone Series
  { brand: 'Apple', model: 'iPhone 11', image: '/assets/phones/iphone-11.jpg' },
  { brand: 'Apple', model: 'iPhone 11 Pro', image: '/assets/phones/iphone-11-pro.jpg' },
  { brand: 'Apple', model: 'iPhone 11 Pro Max', image: '/assets/phones/iphone-11-pro-max.jpg' },
  { brand: 'Apple', model: 'iPhone 12 mini', image: '/assets/phones/iphone-12-mini.jpg' },
  { brand: 'Apple', model: 'iPhone 12', image: '/assets/phones/iphone-12.jpg' },
  { brand: 'Apple', model: 'iPhone 12 Pro Max', image: '/assets/phones/iphone-12-pro-max.jpg' },
  { brand: 'Apple', model: 'iPhone 13 mini', image: '/assets/phones/iphone-13-mini.jpg' },
  { brand: 'Apple', model: 'iPhone 13', image: '/assets/phones/iphone-13.jpg' },
  { brand: 'Apple', model: 'iPhone 13 Pro', image: '/assets/phones/iphone-13-pro.jpg' },
  { brand: 'Apple', model: 'iPhone 13 Pro Max', image: '/assets/phones/iphone-13-pro-max.jpg' },
  { brand: 'Apple', model: 'iPhone 14', image: '/assets/phones/iphone-14.jpg' },
  { brand: 'Apple', model: 'iPhone 14 Plus', image: '/assets/phones/iphone-14-plus.jpg' },
  { brand: 'Apple', model: 'iPhone 14 Pro', image: '/assets/phones/iphone-14-pro.jpg' },
  { brand: 'Apple', model: 'iPhone 14 Pro Max', image: '/assets/phones/iphone-14-pro-max.jpg' },
  { brand: 'Apple', model: 'iPhone 15', image: '/assets/phones/iphone-15.jpg' },
  { brand: 'Apple', model: 'iPhone 15 Plus', image: '/assets/phones/iphone-15-plus.jpg' },
  { brand: 'Apple', model: 'iPhone 15 Pro', image: '/assets/phones/iphone-15-pro.jpg' },
  { brand: 'Apple', model: 'iPhone 15 Pro Max', image: '/assets/phones/iphone-15-pro-max.jpg' },
  { brand: 'Apple', model: 'iPhone 16e', image: '/assets/phones/iphone-16e.jpg' },
  { brand: 'Apple', model: 'iPhone 16', image: '/assets/phones/iphone-16.jpg' },
  { brand: 'Apple', model: 'iPhone 16 Plus', image: '/assets/phones/iphone-16-plus.jpg' },
  { brand: 'Apple', model: 'iPhone 16 Pro', image: '/assets/phones/iphone-16-pro.jpg' },
  { brand: 'Apple', model: 'iPhone 16 Pro Max', image: '/assets/phones/iphone-16-pro-max.jpg' },
  { brand: 'Apple', model: 'iPhone 17', image: '/assets/phones/iphone-17.jpg' },
  { brand: 'Apple', model: 'iPhone 17 Air', image: '/assets/phones/iphone-17-air.jpg' },
  { brand: 'Apple', model: 'iPhone 17 Pro', image: '/assets/phones/iphone-17-pro.jpg' },
  { brand: 'Apple', model: 'iPhone 17 Pro Max', image: '/assets/phones/iphone-17-pro-max.jpg' },
  // Samsung S Series
  { brand: 'Samsung', model: 'Galaxy S22', image: '/assets/phones/galaxy-s22.jpg' },
  { brand: 'Samsung', model: 'Galaxy S22 Plus', image: '/assets/phones/galaxy-s22-plus.jpg' },
  { brand: 'Samsung', model: 'Galaxy S22 Ultra', image: '/assets/phones/galaxy-s22-ultra.jpg' },
  { brand: 'Samsung', model: 'Galaxy S23 FE', image: '/assets/phones/galaxy-s23-fe.jpg' },
  { brand: 'Samsung', model: 'Galaxy S23', image: '/assets/phones/galaxy-s23.jpg' },
  { brand: 'Samsung', model: 'Galaxy S23 Plus', image: '/assets/phones/galaxy-s23-plus.jpg' },
  { brand: 'Samsung', model: 'Galaxy S23 Ultra', image: '/assets/phones/galaxy-s23-ultra.jpg' },
  { brand: 'Samsung', model: 'Galaxy S24 FE', image: '/assets/phones/galaxy-s24-fe.jpg' },
  { brand: 'Samsung', model: 'Galaxy S24', image: '/assets/phones/galaxy-s24.jpg' },
  { brand: 'Samsung', model: 'Galaxy S24 Plus', image: '/assets/phones/galaxy-s24-plus.jpg' },
  { brand: 'Samsung', model: 'Galaxy S24 Ultra', image: '/assets/phones/galaxy-s24-ultra.jpg' },
  { brand: 'Samsung', model: 'Galaxy S25 Edge', image: '/assets/phones/galaxy-s25-edge.jpg' },
  { brand: 'Samsung', model: 'Galaxy S25', image: '/assets/phones/galaxy-s25.jpg' },
  { brand: 'Samsung', model: 'Galaxy S25 Plus', image: '/assets/phones/galaxy-s25-plus.jpg' },
  { brand: 'Samsung', model: 'Galaxy S25 Ultra', image: '/assets/phones/galaxy-s25-ultra.jpg' },
  // Samsung A Series
  { brand: 'Samsung', model: 'Galaxy A15 5G', image: '/assets/phones/galaxy-a15-5g.jpg' },
  { brand: 'Samsung', model: 'Galaxy A16 5G', image: '/assets/phones/galaxy-a16-5g.jpg' },
  { brand: 'Samsung', model: 'Galaxy A26 5G', image: '/assets/phones/galaxy-a26-5g.jpg' },
  { brand: 'Samsung', model: 'Galaxy A36 5G', image: '/assets/phones/galaxy-a36-5g.jpg' },
];

const storeLocations = [
  {
    name: 'Lufkin HEB',
    address: '111 North Timberland Dr.',
    city: 'Lufkin',
    state: 'TX',
    zipCode: '75901',
    phone: '936-707-2593',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 31.3382,
    longitude: -94.7291
  },
  {
    name: 'Lufkin 2',
    address: '507 South Timberland Dr.',
    city: 'Lufkin',
    state: 'TX',
    zipCode: '75901',
    phone: '936-229-6824',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 31.3333,
    longitude: -94.7305
  },
  {
    name: 'Corpus Leopard',
    address: '11100 Leopard St.',
    city: 'Corpus Christi',
    state: 'TX',
    zipCode: '78410',
    phone: '361-317-5155',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 27.8465,
    longitude: -97.6366
  },
  {
    name: 'Corpus Alameda',
    address: '3133 S Alameda St.',
    city: 'Corpus Christi',
    state: 'TX',
    zipCode: '78412',
    phone: '361-419-3290',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 27.7333,
    longitude: -97.3855
  },
  {
    name: 'Corpus Alameda 2',
    address: '4320 S Alameda St.',
    city: 'Corpus Christi',
    state: 'TX',
    zipCode: '78404',
    phone: '361-419-0170',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 27.7337,
    longitude: -97.3858
  },
  {
    name: 'Bay City',
    address: '2700 7th Street',
    city: 'Bay City',
    state: 'TX',
    zipCode: '77414',
    phone: '979-557-3994',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 28.9828,
    longitude: -95.9694
  },
  {
    name: 'San Antonio',
    address: '1015 S WW White Rd',
    city: 'San Antonio',
    state: 'TX',
    zipCode: '78220',
    phone: '210-309-7852',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 29.4146,
    longitude: -98.3915
  },
  {
    name: 'Houston - Rosslyn',
    address: '9436 N Houston Rosslyn Rd',
    city: 'Houston',
    state: 'TX',
    zipCode: '77088',
    phone: '713-849-5400',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 29.8758,
    longitude: -95.4603
  },
  {
    name: 'Cuero',
    address: '909 E Broadway St.',
    city: 'Cuero',
    state: 'TX',
    zipCode: '77954',
    phone: '361-541-3079',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 29.0936,
    longitude: -97.2897
  },
  {
    name: 'Harwin',
    address: '6855 Harwin Dr. Suite M1',
    city: 'Houston',
    state: 'TX',
    zipCode: '77036',
    phone: '346-701-8408',
    hours: 'Mon-Sun: 9am-9pm',
    latitude: 29.7186,
    longitude: -95.5222
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await supabase.from('phone_models').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('store_locations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert phone models
    console.log('Inserting phone models...');
    const { data: phoneData, error: phoneError } = await supabase
      .from('phone_models')
      .insert(phoneModels)
      .select();

    if (phoneError) {
      throw phoneError;
    }

    console.log(`✓ Inserted ${phoneData.length} phone models`);

    // Insert store locations
    console.log('Inserting store locations...');
    const { data: locationData, error: locationError } = await supabase
      .from('store_locations')
      .insert(storeLocations)
      .select();

    if (locationError) {
      throw locationError;
    }

    console.log(`✓ Inserted ${locationData.length} store locations`);
    console.log('✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();