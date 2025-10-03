
// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
//import { createClient } from '@supabase/supabase-js';

import productsRouter from './src/routes/products.js';
import ordersRouter from './src/routes/orders.js';
import authRouter from './src/routes/auth.js';
import uploadsRouter from './src/routes/uploads.js';
import testimonialsRouter from './src/routes/testimonials.js';
import newsletterRouter from './src/routes/newsletter.js';
import locationsRouter from './src/routes/locations.js';
import contactRouter from './src/routes/contact.js';
import paymentsRouter from './src/routes/payments.js';
import blogRouter from './src/routes/blog-test.js';
import adminRouter from './src/routes/admin.js';

console.log('✅ All routes imported successfully, including admin router');

const app = express();

// Configure CORS - Allow all origins for now (debugging)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Custom Phone Case Print Backend is running.');
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);

console.log('✅ Admin routes configured at /api/admin');

// Direct blog test endpoint
app.get('/api/blog-direct/test', (req, res) => {
  res.json({
    success: true,
    message: 'Direct blog endpoint working!',
    timestamp: new Date().toISOString()
  });
});

// Direct blog posts endpoint with mock data
app.get('/api/blog-direct/posts', (req, res) => {
  res.json({
    success: true,
    data: {
      posts: [
        {
          id: 1,
          title: 'Amazing Custom Phone Case Designs',
          slug: 'amazing-custom-phone-case-designs',
          excerpt: 'Discover the latest trends in custom phone case design.',
          author: 'Design Team',
          category: 'Design Tips',
          featured: true,
          image_url: '/images/blog/design-trends.jpg',
          read_time: '5 min read',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Photography Tips for Perfect Case Images',
          slug: 'photography-tips-perfect-case-images',
          excerpt: 'Learn how to capture stunning photos for your custom designs.',
          author: 'Photo Team',
          category: 'Photography',
          featured: false,
          image_url: '/images/blog/photography-tips.jpg',
          read_time: '7 min read',
          created_at: new Date().toISOString()
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 2,
        hasNext: false,
        hasPrev: false
      }
    }
  });
});

console.log('✅ Blog routes registered at /api/blog');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Deployment force - 20251003-152836
// Environment variables reload - 155524
// Owner env reload 1759528081
