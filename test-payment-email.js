// Test script for order creation with email notifications
// This tests the actual endpoint your frontend uses

// IMPORTANT: Replace with your actual Render backend URL
const BACKEND_URL = 'https://phonecoverproject-1.onrender.com';

const testOrderCreation = async () => {
  console.log('🧪 Testing order creation with email notifications...');
  console.log('Backend URL:', BACKEND_URL);

  try {
    // Test data - same format your frontend sends
    const orderData = {
      phone_model: 'iPhone 15 Pro',
      phone_model_id: null, // Set to null to avoid UUID issues
      case_type: 'regular',
      design_image: 'https://example.com/design.jpg',
      original_image: 'https://example.com/original.jpg',
      brightness: 0,
      contrast: 0, 
      saturation: 0,
      blur: 0,
      fulfillment_method: 'pickup',
      delivery_address: '',
      contact_name: 'Test Customer',
      contact_email: 'test@example.com',
      contact_phone: '555-123-4567',
      store_location_id: null,
      amount: 29.99,
      status: 'pending',
      payment_method: 'test',
      payment_transaction_id: 'test_' + Date.now(),
      payment_status: 'pending'
    };

    console.log('📤 Sending order data:', {
      contact_name: orderData.contact_name,
      contact_email: orderData.contact_email,
      phone_model: orderData.phone_model,
      amount: orderData.amount,
      fulfillment_method: orderData.fulfillment_method
    });

    const response = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Request failed:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Order created successfully!');
    console.log('📧 Email sent:', result.emailSent ? 'YES' : 'NO');
    console.log('🆔 Order ID:', result.order?.id);
    console.log('📋 Full response:', result);

    if (result.emailSent) {
      console.log('🎉 SUCCESS! Email notification should be sent to r.eshwarkiran@gmail.com');
    } else {
      console.log('⚠️  Order created but email failed - check backend logs');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('🔍 Full error:', error);
  }
};

// Run the test
testOrderCreation();