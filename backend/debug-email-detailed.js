// Detailed email debugging script
import sgMail from '@sendgrid/mail';

const debugEmailDelivery = async () => {
  console.log('🔍 DETAILED EMAIL DEBUGGING');
  console.log('============================');
  
  // Check API key
  const apiKey = process.env.SENDGRID_API_KEY;
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key format correct:', apiKey ? apiKey.startsWith('SG.') : false);
  
  if (!apiKey) {
    console.log('❌ No SendGrid API key found');
    return;
  }
  
  sgMail.setApiKey(apiKey);
  
  // Test 1: Simple email with different configurations
  const testConfigurations = [
    {
      name: 'Basic string sender',
      config: {
        to: 'r.eshwarkiran@gmail.com',
        from: 'r.eshwarkiran@gmail.com',
        subject: 'Test 1: Basic Email',
        text: 'This is a basic test email.',
        html: '<h1>Test 1: Basic Email</h1><p>This is a basic test email.</p>'
      }
    },
    {
      name: 'Object sender with name',
      config: {
        to: 'r.eshwarkiran@gmail.com',
        from: {
          email: 'r.eshwarkiran@gmail.com',
          name: 'PrintPhoneCase'
        },
        subject: 'Test 2: Named Sender Email',
        text: 'This is a test email with named sender.',
        html: '<h1>Test 2: Named Sender</h1><p>This is a test email with named sender.</p>'
      }
    }
  ];
  
  for (let i = 0; i < testConfigurations.length; i++) {
    const test = testConfigurations[i];
    console.log(`\n📧 Running Test ${i + 1}: ${test.name}`);
    
    try {
      const result = await sgMail.send(test.config);
      console.log('✅ Success!');
      console.log('Response status:', result[0].statusCode);
      console.log('Response headers:', JSON.stringify(result[0].headers, null, 2));
      
      // Check for warnings or additional info
      if (result[0].body) {
        console.log('Response body:', result[0].body);
      }
      
    } catch (error) {
      console.log('❌ Failed:', error.message);
      
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error headers:', JSON.stringify(error.response.headers, null, 2));
        
        if (error.response.body) {
          console.log('Error body:', JSON.stringify(error.response.body, null, 2));
        }
      }
    }
    
    // Wait 3 seconds between tests
    if (i < testConfigurations.length - 1) {
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🔍 DEBUGGING COMPLETE');
  console.log('Check your email (including spam folder) for test emails');
  console.log('If you received emails, the system is working');
  console.log('If not, there may be a SendGrid configuration issue');
};

debugEmailDelivery().catch(console.error);