// Minimal blog routes for testing
import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Blog routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Simple posts endpoint
router.get('/posts', async (req, res) => {
  try {
    console.log('Fetching blog posts...');
    
    // Try to get posts from database
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .limit(10);
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database error: ' + error.message,
        hint: 'Blog tables might not exist'
      });
    }

    res.json({
      success: true,
      data: {
        posts: posts || [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: posts?.length || 0,
          hasNext: false,
          hasPrev: false
        }
      }
    });

  } catch (error) {
    console.error('Blog posts error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simple categories endpoint
router.get('/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*');

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Categories error: ' + error.message
      });
    }

    res.json(categories || []);

  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;