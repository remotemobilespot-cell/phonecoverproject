// Debug script to test the actual website API calls
console.log('🧪 Testing actual website API configuration...');

const testWebsiteAPI = async () => {
  try {
    // Test what the website is actually doing
    console.log('1. Testing direct order creation...');
    
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
      contact_name: 'Website Test Customer',
      contact_email: 'website-test@example.com',
      contact_phone: '555-123-4567',
      store_location_id: null,
      amount: 29.99,
      status: 'pending',
      payment_method: 'test',
      payment_transaction_id: 'website_test_' + Date.now(),
      payment_status: 'pending'
    };

    // Test all possible API endpoints
    const endpoints = [
      'https://phonecoverproject-1.onrender.com/api/payments/create-order',
      'http://localhost:3001/api/payments/create-order',
      'http://localhost:3002/api/payments/create-order'
    ];

    for (const endpoint of endpoints) {
      console.log(`\n🔍 Testing endpoint: ${endpoint}`);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testOrder),
        });

        console.log(`Status: ${response.status}`);
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ SUCCESS! Email sent: ${result.emailSent}`);
          console.log(`Order ID: ${result.order?.id}`);
          
          if (result.emailSent) {
            console.log('🎉 This endpoint works for emails!');
            break;
          }
        } else {
          console.log(`❌ Failed: ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testWebsiteAPI();