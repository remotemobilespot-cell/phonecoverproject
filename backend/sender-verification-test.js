// Test script to verify SendGrid sender authentication
import sgMail from '@sendgrid/mail';

const testSender = async () => {
  // This would be run on the production server where the API key is available
  const apiKey = 'YOUR_ACTUAL_SENDGRID_API_KEY'; // Replace with real key for testing
  
  if (!apiKey || apiKey === 'YOUR_ACTUAL_SENDGRID_API_KEY') {
    console.log('⚠️  No API key configured for this test');
    return;
  }
  
  sgMail.setApiKey(apiKey);
  
  // Test with different sender configurations
  const testConfigs = [
    {
      name: 'Plain email string',
      from: 'r.eshwarkiran@gmail.com'
    },
    {
      name: 'Email object with name',
      from: {
        email: 'r.eshwarkiran@gmail.com',
        name: 'PrintPhoneCase'
      }
    },
    {
      name: 'Generic noreply (if configured)',
      from: 'noreply@your-verified-domain.com' // Replace with actual verified domain
    }
  ];
  
  for (const config of testConfigs) {
    try {
      console.log(`\n📧 Testing: ${config.name}`);
      
      const msg = {
        to: 'r.eshwarkiran@gmail.com',
        from: config.from,
        subject: `SendGrid Test - ${config.name}`,
        html: `
          <h2>Sender Test: ${config.name}</h2>
          <p>This is a test email to verify sender configuration.</p>
          <p>If you receive this, the sender "${JSON.stringify(config.from)}" works.</p>
          <p>Time: ${new Date().toISOString()}</p>
        `
      };
      
      const result = await sgMail.send(msg);
      console.log(`✅ Success! Status: ${result[0].statusCode}`);
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response && error.response.body) {
        console.log('Error details:', JSON.stringify(error.response.body, null, 2));
      }
    }
    
    // Wait 2 seconds between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};

console.log('SendGrid Sender Verification Test');
console.log('==================================');
console.log('This script tests different sender configurations to identify');
console.log('which sender email/format works with your SendGrid setup.');
console.log('');
console.log('To run this test:');
console.log('1. Replace YOUR_ACTUAL_SENDGRID_API_KEY with your real API key');
console.log('2. Update the verified domain if you have one');
console.log('3. Run: node sender-verification-test.js');
console.log('');

testSender().catch(console.error);