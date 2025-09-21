import express from 'express';
import sgMail from '@sendgrid/mail';
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
    console.log('📧 Attempting to send order notification email...');
    console.log('SendGrid API Key set:', !!process.env.SENDGRID_API_KEY);
    
    // Simulate order creation (replace with actual DB logic)
    const order = req.body;
    console.log('Order details:', order);
    // ...save order to database...

    // Send notification email
    const msg = {
      to: 'r.eshwarkiran@gmail.com',
      from: 'r.eshwarkiran@gmail.com', // Use verified sender email
      subject: 'New Order Received',
      text: `A new order has been placed.\nOrder details: ${JSON.stringify(order, null, 2)}`,
      html: `<h2>New Order Received</h2><pre>${JSON.stringify(order, null, 2)}</pre>`
    };
    
    console.log('Sending email to:', msg.to);
    const result = await sgMail.send(msg);
    console.log('✅ Email sent successfully:', result[0].statusCode);

    res.status(201).json({ success: true, message: 'Order created and notification sent.' });
  } catch (error) {
    console.error('❌ Error creating order or sending email:', error);
    console.error('Error details:', error.response?.body || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// TODO: Add PUT, DELETE for orders

export default router;
