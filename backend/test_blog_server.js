// Simple test to verify API is working and return blog posts
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3002; // Different port to avoid conflicts

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Blog test server is running!' });
});

// Simple blog posts endpoint
app.get('/api/blog/posts', async (req, res) => {
  try {
    console.log('📝 Blog posts requested...');
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        author,
        featured,
        image_url,
        read_time,
        views,
        likes,
        created_at,
        blog_categories!blog_posts_category_id_fkey(id, name, slug, color)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`✅ Returning ${posts.length} blog posts`);
    
    res.json({
      success: true,
      data: {
        posts: posts || [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: posts.length,
          hasNext: false,
          hasPrev: false
        }
      }
    });

  } catch (error) {
    console.error('💥 Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Test blog server running on http://localhost:${port}`);
  console.log(`📝 Test blog posts at: http://localhost:${port}/api/blog/posts`);
});