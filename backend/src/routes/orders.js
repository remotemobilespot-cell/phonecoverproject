import express from 'express';
import sgMail from '@sendgrid/mail';
import { sendOrderEmails } from '../utils/emailService.js';
const router = express.Router();

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET /api/orders
router.get('/', async (req, res) => {
  // ...existing code...
});

// POST /api/orders - Create a new order and send notification
router.post('/', async (req, res) => {
  try {
    console.log('📧 Processing new order and sending notifications...');
    console.log('SendGrid API Key set:', !!process.env.SENDGRID_API_KEY);
    
    // Simulate order creation (replace with actual DB logic)
    const order = req.body;
    console.log('Order details:', order);
    // ...save order to database...

    // Send both admin and customer notification emails
    const emailResults = await sendOrderEmails(order);

    res.status(201).json({ 
      success: true, 
      message: 'Order created and notifications sent.',
      emailSent: emailResults
    });
  } catch (error) {
    console.error('❌ Error creating order or sending emails:', error);
    console.error('Error details:', error.response?.body || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// TODO: Add PUT, DELETE for orders

export default router;
