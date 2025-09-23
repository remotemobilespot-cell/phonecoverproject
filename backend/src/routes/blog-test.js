// Ultra-simple blog routes for testing
import express from 'express';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Blog test endpoint called');
  res.json({
    success: true,
    message: 'Blog routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Mock posts endpoint
router.get('/posts', (req, res) => {
  console.log('Blog posts endpoint called');
  res.json({
    success: true,
    data: {
      posts: [
        {
          id: 1,
          title: 'Sample Blog Post',
          slug: 'sample-blog-post',
          excerpt: 'This is a sample blog post to test the system.',
          author: 'Test Author',
          category: 'Test',
          featured: true,
          image_url: '/images/sample.jpg',
          read_time: '5 min read',
          created_at: new Date().toISOString()
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        hasNext: false,
        hasPrev: false
      }
    }
  });
});

// Mock categories
router.get('/categories', (req, res) => {
  console.log('Blog categories endpoint called');
  res.json([
    { id: 1, name: 'Design Tips', slug: 'design-tips', color: '#8B5CF6' },
    { id: 2, name: 'Photography', slug: 'photography', color: '#10B981' },
    { id: 3, name: 'Technology', slug: 'technology', color: '#3B82F6' }
  ]);
});

export default router;