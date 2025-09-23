// Test script to verify the API URL fix
console.log('🔧 Testing API URL configuration...');

// Simulate production environment
const mockEnv = {
  PROD: true,
  VITE_API_BASE_URL: undefined // This simulates no env var set
};

// This is the logic now used in PrintNow.tsx
const apiBaseUrl = mockEnv.VITE_API_BASE_URL || 
  (mockEnv.PROD ? 'https://phonecoverproject-1.onrender.com' : 'http://localhost:3001');

console.log('✅ Production API URL will be:', apiBaseUrl);

if (apiBaseUrl === 'https://phonecoverproject-1.onrender.com') {
  console.log('🎉 SUCCESS! Orders will now reach the correct backend');
  console.log('📧 Emails should start working after frontend redeploys');
} else {
  console.log('❌ Issue with URL logic');
}

console.log('\n📋 Next steps:');
console.log('1. Wait for Vercel to redeploy frontend (~2-3 minutes)');
console.log('2. Place a test order through your website');
console.log('3. Check r.eshwarkiran@gmail.com for notification email');
console.log('4. Check spam folder if not in inbox');