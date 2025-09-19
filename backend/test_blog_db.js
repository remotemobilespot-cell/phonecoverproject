// Test script to check blog database tables and data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBlogDatabase() {
  console.log('🔍 Testing Blog Database Connection...\n');
  
  try {
    // Test 1: Check if blog_posts table exists and has data
    console.log('1. Checking blog_posts table...');
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(5);
    
    if (postsError) {
      console.log('❌ Error querying blog_posts:', postsError.message);
    } else {
      console.log(`✅ Found ${posts.length} blog posts`);
      if (posts.length > 0) {
        console.log('Sample post:', {
          id: posts[0].id,
          title: posts[0].title,
          published: posts[0].published
        });
      }
    }
    
    // Test 2: Check if blog_categories table exists
    console.log('\n2. Checking blog_categories table...');
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*');
    
    if (categoriesError) {
      console.log('❌ Error querying blog_categories:', categoriesError.message);
    } else {
      console.log(`✅ Found ${categories.length} blog categories`);
      if (categories.length > 0) {
        console.log('Categories:', categories.map(c => c.name));
      }
    }
    
    // Test 3: Test the exact query from the API
    console.log('\n3. Testing API query (published posts with categories)...');
    const { data: apiData, error: apiError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories!blog_posts_category_id_fkey(id, name, slug, color)
      `)
      .eq('published', true)
      .limit(5);
    
    if (apiError) {
      console.log('❌ Error with API query:', apiError.message);
    } else {
      console.log(`✅ API query returned ${apiData.length} published posts`);
      if (apiData.length > 0) {
        console.log('Sample API result:', {
          title: apiData[0].title,
          category: apiData[0].blog_categories?.name || 'No category'
        });
      }
    }
    
    // Test 4: Check table structure
    console.log('\n4. Checking blog_posts table structure...');
    const { data: structure, error: structureError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
      
    if (!structureError && structure.length > 0) {
      console.log('Table columns:', Object.keys(structure[0]));
    }
    
  } catch (error) {
    console.log('💥 Unexpected error:', error.message);
  }
}

testBlogDatabase();