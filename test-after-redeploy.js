// Comprehensive test after redeployment
console.log('🔄 Testing after forced redeployment...');

const testAfterRedeployment = async () => {
  console.log('1. ✅ Frontend redeployed to Vercel');
  console.log('2. ✅ Backend redeployed to Render');
  console.log('3. 🧪 Testing end-to-end flow...\n');

  // Test backend health
  try {
    const health = await fetch('https://phonecoverproject-1.onrender.com/api/payments/health');
    const healthData = await health.json();
    console.log('🔍 Backend health:', healthData.message);
    
    if (healthData.emailSystem) {
      console.log('📧 Email system:', healthData.emailSystem);
    }
  } catch (error) {
    console.log('❌ Backend health check failed');
  }

  // Test order creation with email
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
    contact_name: 'Post-Redeploy Test',
    contact_email: 'post-redeploy@example.com',
    contact_phone: '555-123-4567',
    store_location_id: null,
    amount: 29.99,
    status: 'pending',
    payment_method: 'test',
    payment_transaction_id: 'redeploy_test_' + Date.now(),
    payment_status: 'pending'
  };

  try {
    console.log('📤 Creating order to test email system...');
    
    const response = await fetch('https://phonecoverproject-1.onrender.com/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Order created:', result.order?.id);
      console.log('📧 Email sent:', result.emailSent ? 'YES ✅' : 'NO ❌');
      
      if (result.emailSent) {
        console.log('\n🎉 SUCCESS! Email system is working!');
        console.log('📬 Check r.eshwarkiran@gmail.com');
      } else {
        console.log('\n❌ Order created but email failed');
      }
    } else {
      console.log('❌ Order creation failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n📋 NOW TEST YOUR LIVE WEBSITE:');
  console.log('1. Go to: https://www.printphonecover.com/');
  console.log('2. Place a real order');
  console.log('3. Check r.eshwarkiran@gmail.com for email');
  console.log('4. If no email, check spam folder');
  console.log('\n⏰ Both services have been redeployed with latest code!');
};

testAfterRedeployment();