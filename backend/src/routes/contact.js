import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const supabaseService = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    console.log('Contact form submission received:', req.body);
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'Name, email, subject, and message are required.',
        success: false
      });
    }

    console.log('Attempting to insert into contact_submissions table...');
    
    // Insert contact form data into Supabase
    const { data, error } = await supabaseService
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          subject,
          message,
          status: 'new',
          submitted_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insertion error:', error);
      return res.status(500).json({ 
        error: 'Failed to submit contact form. Database error.',
        details: error.message,
        success: false
      });
    }

    console.log('Contact form submitted successfully:', data);
    
    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully!',
      id: data.id 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Internal server error.',
      details: error.message,
      success: false
    });
  }
});

// GET /api/contact - Get all contact submissions (for admin)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseService
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch contact submissions.' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PATCH /api/contact/:id - Update contact submission status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response_note } = req.body;

    const { data, error } = await supabaseService
      .from('contact_submissions')
      .update({ 
        status, 
        response_note,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update contact submission.' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
