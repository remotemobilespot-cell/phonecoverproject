// Test your actual live website's API connectivity
console.log('🌐 Testing your live website: https://www.printphonecover.com/');

const testLiveWebsiteAPI = async () => {
  console.log('📡 Testing if your live website can reach the backend...');
  
  // Test backend connectivity first
  try {
    const healthCheck = await fetch('https://phonecoverproject-1.onrender.com/api/payments/health');
    console.log('✅ Backend health check:', healthCheck.ok ? 'WORKING' : 'FAILED');
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
  }

  // Test actual order creation (same as your website would do)
  const testOrder = {
    phone_model: 'iPhone 15 Pro',
    phone_model_id: null,
    case_type: 'regular',
    design_image: 'https://example.com/design.jpg',
    original_image: 'https://example.com/original.jpg',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    fulfillment_method: 'pickup',
    delivery_address: '',
    contact_name: 'Live Website Test',
    contact_email: 'live-test@example.com',
    contact_phone: '555-123-4567',
    store_location_id: null,
    amount: 29.99,
    status: 'pending',
    payment_method: 'test',
    payment_transaction_id: 'live_test_' + Date.now(),
    payment_status: 'pending'
  };

  try {
    console.log('📤 Creating test order...');
    
    const response = await fetch('https://phonecoverproject-1.onrender.com/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Order created successfully!');
      console.log('📧 Email sent:', result.emailSent ? 'YES' : 'NO');
      console.log('🆔 Order ID:', result.order?.id);
      
      if (result.emailSent) {
        console.log('🎉 SUCCESS! Your live website should now send email notifications!');
        console.log('📬 Check r.eshwarkiran@gmail.com for the test email');
      } else {
        console.log('⚠️  Order created but email failed');
      }
    } else {
      console.log('❌ Order creation failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Go to https://www.printphonecover.com/');
  console.log('2. Place a real test order');  
  console.log('3. Check r.eshwarkiran@gmail.com for email notification');
  console.log('4. Orders should now trigger emails automatically! 🎉');
};

testLiveWebsiteAPI();