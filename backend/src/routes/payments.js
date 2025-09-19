import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { supabase } from '../supabaseClient.js';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Health check endpoint for payments API
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Payments API is working!',
    timestamp: new Date().toISOString()
  });
});

// GET version of test endpoint (easier to test in browser)
router.get('/test-order', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint is working! Use POST to actually create an order.',
    availableEndpoints: [
      'GET /api/payments/health - Health check',
      'GET /api/payments/test-order - This endpoint',
      'POST /api/payments/test-order - Create test order',
      'POST /api/payments/create-order - Create real order',
      'POST /api/payments/create-payment-intent - Stripe payment',
      'POST /api/payments/create-checkout-session - Stripe checkout redirect',
      'POST /api/payments/mock-payment - Mock payment'
    ]
  });
});

// Function to get Stripe client
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
};

// Function to get Supabase client
const getSupabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment variables');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
};

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    console.log('Creating payment intent for amount:', amount);

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Valid amount is required'
      });
    }

    // Create payment intent
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payment intent'
    });
  }
});

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  console.log('Creating Stripe checkout session...');
  console.log('Request body:', req.body);

  const { amount, currency = 'usd', orderData, successUrl, cancelUrl } = req.body;

  if (!amount || !orderData || !successUrl || !cancelUrl) {
    return res.status(400).json({
      error: 'Missing required fields: amount, orderData, successUrl, cancelUrl'
    });
  }

  const stripe = getStripe();

  // Create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: `${orderData.caseType === 'magsafe' ? 'MagSafe' : 'Regular'} Phone Case`,
            description: `Custom phone case with ${orderData.fulfillmentMethod} fulfillment`,
            images: [], // You could add the design image URL here
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: orderData.email,
    metadata: {
      customerName: orderData.name,
      customerPhone: orderData.phone,
      fulfillmentMethod: orderData.fulfillmentMethod,
      caseType: orderData.caseType,
    },
    billing_address_collection: 'auto',
    shipping_address_collection: orderData.fulfillmentMethod === 'delivery' ? {
      allowed_countries: ['US', 'CA'],
    } : undefined,
  });

  console.log('Checkout session created:', session.id);

  res.json({
    success: true,
    sessionId: session.id,
    url: session.url,
  });
});

// Confirm payment and create order
router.post('/confirm-payment', async (req, res) => {
  try {
    const { 
      payment_intent_id,
      order_data
    } = req.body;

    console.log('Confirming payment for:', payment_intent_id);

    // Validate required fields
    if (!payment_intent_id || !order_data) {
      return res.status(400).json({
        error: 'Payment intent ID and order data are required'
      });
    }

    // For now, we'll skip the Stripe verification and just create the order
    // In production, you'd verify the payment with Stripe first
    
    // Create order in database with payment information
    const orderObj = {
      ...order_data,
      payment_transaction_id: payment_intent_id,
      payment_status: 'completed',
      payment_method: 'card',
      created_at: new Date().toISOString(),
    };

    console.log('Creating order with data:', orderObj);

    // Get Supabase client
    const supabase = getSupabase();
    const { data: order, error } = await supabase
      .from('orders')
      .insert([orderObj])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Failed to create order: ' + error.message
      });
    }

    console.log('Order created successfully:', order.id);

    res.json({
      success: true,
      order,
      payment_intent: {
        id: payment_intent_id,
        status: 'succeeded', // Mock status for testing
        amount: order_data.amount,
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      error: error.message || 'Failed to confirm payment'
    });
  }
});

// Simple test endpoint to check if API is working
router.post('/test-order', async (req, res) => {
  try {
    console.log('Test order endpoint called with data:', req.body);
    
    // Try a very simple insert with minimal data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        phone_model: 'Test Phone',
        contact_name: 'Test User',
        contact_email: 'test@example.com',
        amount: 25.00,
        status: 'pending',
        payment_status: 'pending',
        design_image: 'https://example.com/test.jpg'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Database error in test:', orderError);
      return res.status(500).json({
        error: 'Database error',
        details: orderError.message,
        code: orderError.code,
        hint: orderError.hint
      });
    }

    console.log('Test order created successfully:', order.id);

    res.json({
      success: true,
      message: 'Test order created successfully',
      order_id: order.id
    });

  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
});

// Create order endpoint (direct database insertion)
router.post('/create-order', async (req, res) => {
  try {
    const orderData = req.body;
    
    console.log('Creating order with data:', orderData);

    // Validate required fields
    const requiredFields = ['phone_model', 'design_image', 'contact_name', 'contact_email', 'amount'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Prepare the order object with proper data type handling
    const orderRecord = {
      phone_model: orderData.phone_model,
      phone_model_id: orderData.phone_model_id || null, // Keep as string (UUID)
      case_type: orderData.case_type || 'regular', // ADD: Store case type
      design_image: orderData.design_image,
      original_image: orderData.original_image || null, // ADD: Store original image URL
      brightness: parseInt(orderData.brightness) || 0,
      contrast: parseInt(orderData.contrast) || 0,
      saturation: parseInt(orderData.saturation) || 0,
      blur: parseInt(orderData.blur) || 0,
      fulfillment_method: orderData.fulfillment_method,
      delivery_address: orderData.delivery_address || '',
      contact_name: orderData.contact_name,
      contact_email: orderData.contact_email,
      contact_phone: orderData.contact_phone || '',
      store_location_id: orderData.store_location_id || null, // This is BIGINT for store_locations
      amount: parseFloat(orderData.amount),
      status: orderData.status || 'pending',
      payment_method: orderData.payment_method,
      payment_transaction_id: orderData.payment_transaction_id || null,
      payment_status: 'pending' // Use 'pending' instead of potentially invalid values
    };

    console.log('Processed order record:', orderRecord);

    // Insert order into database using centralized supabase client
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderRecord])
      .select()
      .single();

    if (orderError) {
      console.error('Database error creating order:', orderError);
      return res.status(500).json({
        error: 'Failed to create order in database',
        details: orderError.message,
        hint: orderError.hint,
        code: orderError.code
      });
    }

    console.log('Order created successfully:', order.id);

    res.json({
      success: true,
      order: order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  }
});

// Mock payment processing (for testing without real Stripe)
router.post('/mock-payment', async (req, res) => {
  try {
    const { order_data, card_data } = req.body;

    console.log('Processing mock payment for order:', order_data);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock payment ID
    const mockPaymentId = 'pi_mock_' + Math.random().toString(36).substr(2, 9);

    // Create order in database
    const orderObj = {
      ...order_data,
      payment_transaction_id: mockPaymentId,
      payment_status: 'completed',
      payment_method: 'card',
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    const { data: order, error } = await supabase
      .from('orders')
      .insert([orderObj])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Failed to create order: ' + error.message
      });
    }

    res.json({
      success: true,
      order,
      payment: {
        id: mockPaymentId,
        status: 'succeeded',
        amount: order_data.amount,
        card_last4: card_data?.cardNumber?.slice(-4) || '1234',
      }
    });

  } catch (error) {
    console.error('Error processing mock payment:', error);
    res.status(500).json({
      error: error.message || 'Failed to process payment'
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update order status if needed
      if (paymentIntent.metadata.order_id) {
        const supabase = getSupabase();
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'completed',
            status: 'confirmed'
          })
          .eq('id', paymentIntent.metadata.order_id);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update order status
      if (failedPayment.metadata.order_id) {
        const supabase = getSupabase();
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'failed',
            status: 'failed'
          })
          .eq('id', failedPayment.metadata.order_id);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment status
router.get('/payment-status/:payment_intent_id', async (req, res) => {
  try {
    const { payment_intent_id } = req.params;

    if (payment_intent_id.startsWith('pi_mock_')) {
      // Mock payment status
      return res.json({
        success: true,
        status: 'succeeded',
        amount: 24.99,
        currency: 'usd',
      });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    
    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });

  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({
      error: error.message || 'Failed to retrieve payment status'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Payment service is running',
    stripe_configured: !!process.env.STRIPE_SECRET_KEY,
    timestamp: new Date().toISOString()
  });
});

export default router;