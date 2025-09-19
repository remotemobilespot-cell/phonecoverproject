
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

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Custom Phone Case Print Backend is running.');
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
