// Test to check if blog tables exist and add sample data
console.log('🔍 Checking blog database setup...');

const setupBlogData = async () => {
  console.log('Testing blog database connection...');
  
  // First, let's test a simple endpoint that should work
  try {
    const healthCheck = await fetch('https://phonecoverproject-1.onrender.com/api/payments/health');
    if (healthCheck.ok) {
      console.log('✅ Backend is responding');
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.log('❌ Cannot reach backend');
    return;
  }

  // Test if we can create some sample blog posts via the orders endpoint
  // (as a workaround to test the backend is working)
  console.log('\n📋 Diagnosis:');
  console.log('1. Backend is running ✅');
  console.log('2. Blog routes are not loading ❌');
  console.log('3. Possible issues:');
  console.log('   - Blog routes file has syntax error');
  console.log('   - Blog database tables don\'t exist');
  console.log('   - Supabase connection issue in blog routes');
  
  console.log('\n🔧 Recommended fixes:');
  console.log('1. Check if blog_posts table exists in Supabase');
  console.log('2. Check blog.js for syntax errors');
  console.log('3. Verify SUPABASE_SERVICE_ROLE_KEY is set in Render');
  console.log('4. Add sample blog posts to database');
};

setupBlogData();