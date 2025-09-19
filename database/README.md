# Database Setup

This directory contains the database setup scripts for the Custom Phone Case Print application.

## Requirements

- Supabase account and project
- Supabase CLI (optional, for local development)

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Settings > API to get your project URL and anon key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env` in the frontend directory
2. Replace the placeholder values with your actual Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Tables

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `setup.sql`
4. Click "Run" to execute the script

This will create:
- `phone_models` table with sample iPhone, Samsung, Google, and OnePlus models
- `store_locations` table with sample locations in Texas
- `orders` table for tracking customer orders
- Proper indexes and Row Level Security policies

### 4. Verify Setup

After running the setup script, you should see:
- 10 phone models in the `phone_models` table
- 5 store locations in the `store_locations` table
- Proper security policies in place

## Sample Data

The setup script includes:

### Phone Models
- Apple iPhone 15 Pro, iPhone 15, iPhone 14 Pro, iPhone 14
- Samsung Galaxy S24 Ultra, Galaxy S24, Galaxy S23 Ultra
- Google Pixel 8 Pro, Pixel 8
- OnePlus 12

### Store Locations
- Multiple locations in Lufkin, Corpus Christi, and College Station, Texas
- Complete with addresses, phone numbers, and coordinates for maps

## Security

The database is configured with Row Level Security (RLS):
- Phone models and store locations are publicly readable
- Orders are private - users can only see their own orders
- Authentication is handled through Supabase Auth

## Troubleshooting

If the frontend shows "Loading..." or "Failed to load data":

1. Check that your environment variables are correct
2. Verify the database tables were created successfully
3. Check the browser console for any error messages
4. Ensure your Supabase project is active and not paused