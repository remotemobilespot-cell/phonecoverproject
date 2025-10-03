import express from 'express';
import sgMail from '@sendgrid/mail';
import { sendOrderEmails, sendOrderSMS, sendOrderNotifications } from '../utils/emailService.js';
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

    // Send comprehensive notifications (email + SMS) to both admin and customer
    const notificationResults = await sendOrderNotifications(order);

    res.status(201).json({ 
      success: true, 
      message: 'Order created and notifications sent.',
      notifications: notificationResults
    });
  } catch (error) {
    console.error('❌ Error creating order or sending emails:', error);
    console.error('Error details:', error.response?.body || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test SMS functionality endpoint
router.post('/test-sms', async (req, res) => {
  try {
    console.log('🧪 Testing SMS functionality...');
    
    const testOrder = {
      id: 'test-' + Date.now(),
      order_number: 'PC-TEST-' + Date.now(),
      contact_name: 'Test Customer',
      contact_email: 'test@example.com',
      contact_phone: req.body.phone || '+13612283522', // Use provided phone or default
      phone_model: 'iPhone 15 Pro',
      case_type: 'regular',
      amount: 29.99,
      created_at: new Date().toISOString()
    };

    console.log('🔍 Test order data:', testOrder);
    console.log('🔍 Environment check:', {
      TWILIO_ACCOUNT_SID: !!process.env.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: !!process.env.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: !!process.env.TWILIO_PHONE_NUMBER,
      OWNER_PHONE_NUMBER: !!process.env.OWNER_PHONE_NUMBER
    });

    // Test the comprehensive notification system
    const notificationResults = await sendOrderNotifications(testOrder);

    res.json({
      success: true,
      message: 'SMS test completed',
      testOrder: testOrder,
      notifications: notificationResults,
      environment: {
        twilioConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
        phoneNumberConfigured: !!process.env.TWILIO_PHONE_NUMBER,
        ownerPhoneConfigured: !!process.env.OWNER_PHONE_NUMBER
      }
    });

  } catch (error) {
    console.error('❌ SMS test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

// TODO: Add PUT, DELETE for orders

export default router;
