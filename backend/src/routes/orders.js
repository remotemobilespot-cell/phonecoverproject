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
    // Simulate order creation (replace with actual DB logic)
    const order = req.body;
    // ...save order to database...

    // Send notification email
    const msg = {
      to: 'eshwarkiran.ai@gmail.com',
      from: 'no-reply@printphonecover.com',
      subject: 'New Order Received',
      text: `A new order has been placed.\nOrder details: ${JSON.stringify(order, null, 2)}`,
      html: `<h2>New Order Received</h2><pre>${JSON.stringify(order, null, 2)}</pre>`
    };
    await sgMail.send(msg);

    res.status(201).json({ success: true, message: 'Order created and notification sent.' });
  } catch (error) {
    console.error('Error creating order or sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// TODO: Add PUT, DELETE for orders

export default router;
