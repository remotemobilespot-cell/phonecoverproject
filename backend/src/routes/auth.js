import express from 'express';
import { supabase } from '../supabaseClient.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Create a function to get the Supabase service client
const getSupabaseService = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
  }
  return createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
  const supabaseService = getSupabaseService();
  const { data, error } = await supabaseService.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password required.' });
  const supabaseService = getSupabaseService();
  // Register user in Supabase Auth
  const { data, error } = await supabaseService.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  // Insert profile data
  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabaseService.from('profiles').insert([{ id: userId, name, email, phone }]);
    if (profileError) return res.status(500).json({ error: profileError.message });
  }
  res.json({ user: data.user });
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  // Get the origin from the request or use localhost as fallback
  const origin = req.get('origin') || req.get('referer') || 'http://localhost:5174';
  const redirectTo = `${origin}/auth/callback`;
  
  console.log('Google OAuth redirect URL:', redirectTo);
  
  const supabaseService = getSupabaseService();
  const { data, error } = await supabaseService.auth.signInWithOAuth({ 
    provider: 'google', 
    options: { 
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    } 
  });
  
  if (error) {
    console.error('Google OAuth error:', error);
    return res.status(400).json({ error: error.message });
  }
  
  res.json({ url: data.url });
});

// POST /api/auth/sync-profile
router.post('/sync-profile', async (req, res) => {
  const { id, email, name, phone } = req.body;
  if (!id || !email) return res.status(400).json({ error: 'id and email required.' });
  const supabaseService = getSupabaseService();
  // Upsert profile info using service role key
  const { error } = await supabaseService.from('profiles').upsert([{ id, email, name, phone }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// GET /api/auth/profile/:id
router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;
  const supabaseService = getSupabaseService();
  const { data, error } = await supabaseService.from('profiles').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

export default router;
