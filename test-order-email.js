// Test script to verify order email functionality
const fetch = require('node-fetch');

async function testOrderEmail() {
  const testOrder = {
    phoneModel: 'iPhone 15 Pro',
    caseType: 'Clear',
    quantity: 1,
    amount: 29.99,
    customerEmail: 'test@example.com',
    customerName: 'Test Customer'
  };

  try {
    // Replace with your actual Render backend URL
    const BACKEND_URL = 'https://printphonecase-backend.onrender.com'; // Update this with your actual URL
    
    console.log('Testing order email endpoint...');
    console.log('Backend URL:', BACKEND_URL);
    console.log('Test order data:', testOrder);
    
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    const result = await response.json();
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Test order sent successfully! Check your email (r.eshwarkiran@gmail.com).');
    } else {
      console.log('❌ Test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOrderEmail();