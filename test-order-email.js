// Test script to verify order email functionality
const fetch = require('node-fetch');

async function testOrderEmail() {
  const testOrder = {
    phoneModel: 'iPhone 15 Pro',
    caseType: 'Clear',
    quantity: 1,
    amount: 29.99,
    customerEmail: 'test@example.com'
  };

  try {
    const response = await fetch('https://YOUR_RENDER_BACKEND_URL/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });

    const result = await response.json();
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Test order sent successfully! Check your email.');
    } else {
      console.log('❌ Test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOrderEmail();