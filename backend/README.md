# Case Backend

Backend API for the custom phone case print website using Node.js, Express, and Supabase.

## Setup
1. Copy `.env.example` to `.env` and fill in your Supabase credentials.
2. Run `npm install` to install dependencies.
3. Start the server:
   - Development: `npm run dev`
   - Production: `npm start`

## API Endpoints
- `/api/products` - Manage products
- `/api/orders` - Manage orders
- `/api/auth` - User authentication
- `/api/uploads` - Image uploads
- `/api/testimonials` - Manage testimonials
- `/api/newsletter` - Newsletter signup
- `/api/locations` - Store locations

## Supabase
- Make sure your Supabase project has tables for products, orders, users, testimonials, newsletter, and locations.
- Configure storage for image uploads.
