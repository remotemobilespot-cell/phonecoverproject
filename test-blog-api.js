// Test blog API endpoints
console.log('🔍 Testing blog functionality...');

const testBlogAPI = async () => {
  const API_BASE_URL = 'https://phonecoverproject-1.onrender.com';

  console.log('1. Testing blog posts endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/posts`);
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Blog posts response:', {
        success: data.success,
        postsCount: data.data?.posts?.length || 0,
        totalPages: data.data?.pagination?.totalPages || 0
      });
      
      if (data.data?.posts?.length > 0) {
        console.log('📄 Sample post:', {
          title: data.data.posts[0].title,
          slug: data.data.posts[0].slug,
          author: data.data.posts[0].author
        });
      } else {
        console.log('❌ No blog posts found in database');
      }
    } else {
      console.log('❌ Blog API not working:', response.statusText);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }

  console.log('\n2. Testing blog categories endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/categories`);
    console.log('Status:', response.status);
    
    if (response.ok) {
      const categories = await response.json();
      console.log('✅ Categories found:', categories.length);
    } else {
      console.log('❌ Categories API failed');
    }
  } catch (error) {
    console.error('❌ Categories error:', error.message);
  }

  console.log('\n📋 Next steps:');
  console.log('1. Deploy backend with blog routes enabled');
  console.log('2. Deploy frontend with correct blog API URL');
  console.log('3. Add sample blog posts if database is empty');
};

testBlogAPI();