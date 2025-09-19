import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Get all blog posts with pagination and filtering
router.get('/posts', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      featured, 
      search,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories!blog_posts_category_id_fkey(id, name, slug, color)
      `)
      .eq('published', true);

    // Apply filters
    if (category && category !== 'All') {
      // First try to filter by category_id using a join, fallback to category name
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('name', category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      } else {
        // Fallback to category name if exists
        query = query.eq('category', category);
      }
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: posts, error, count } = await query
      .range(from, to)
      .limit(limit);

    if (error) throw error;

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    res.json({
      success: true,
      data: {
        posts: posts || [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: (page * limit) < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts'
    });
  }
});

// Get single blog post by slug with SEO data
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const visitorIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referrer');

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories!blog_posts_category_id_fkey(id, name, slug, color)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ views: post.views + 1 })
      .eq('id', post.id);

    // Track analytics (non-blocking)
    supabase
      .from('blog_analytics')
      .insert({
        blog_post_id: post.id,
        visitor_ip: visitorIP,
        user_agent: userAgent,
        referrer: referrer
      })
      .then(() => {}) // Fire and forget
      .catch(err => console.log('Analytics tracking failed:', err));

    // Get related posts
    const { data: relatedPosts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, image_url, created_at, read_time')
      .eq('category', post.category)
      .eq('published', true)
      .neq('id', post.id)
      .order('created_at', { ascending: false })
      .limit(3);

    // Generate SEO structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.meta_title || post.title,
      "description": post.meta_description || post.excerpt,
      "image": post.og_image || post.image_url,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "PrintPhoneCover",
        "logo": {
          "@type": "ImageObject",
          "url": "/logo.png"
        }
      },
      "datePublished": post.created_at,
      "dateModified": post.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${process.env.FRONTEND_URL}/blog/${post.slug}`
      }
    };

    res.json({
      success: true,
      data: {
        post: {
          ...post,
          views: post.views + 1,
          structured_data: structuredData
        },
        relatedPosts: relatedPosts || [],
        seo: {
          title: post.meta_title || post.title,
          description: post.meta_description || post.excerpt,
          keywords: post.meta_keywords,
          canonical: post.canonical_url || `${process.env.FRONTEND_URL}/blog/${post.slug}`,
          ogTitle: post.og_title || post.title,
          ogDescription: post.og_description || post.excerpt,
          ogImage: post.og_image || post.image_url,
          ogType: post.og_type,
          twitterTitle: post.twitter_title || post.title,
          twitterDescription: post.twitter_description || post.excerpt,
          twitterImage: post.twitter_image || post.image_url,
          twitterCard: post.twitter_card,
          structuredData
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post'
    });
  }
});

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      data: categories || []
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get blog tags
router.get('/tags', async (req, res) => {
  try {
    const { data: tags, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      data: tags || []
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tags'
    });
  }
});

// Like/unlike a blog post
router.post('/posts/:slug/like', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, likes')
      .eq('slug', slug)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ likes: post.likes + 1 })
      .eq('id', post.id)
      .select('likes')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: {
        likes: data.likes
      }
    });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update likes'
    });
  }
});

// Get popular/trending posts
router.get('/trending', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id, title, slug, excerpt, category, image_url, 
        created_at, read_time, views, likes,
        blog_categories!blog_posts_category_id_fkey(id, name, slug, color)
      `)
      .eq('published', true)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({
      success: true,
      data: posts || []
    });
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending posts'
    });
  }
});

// Get sitemap data for SEO
router.get('/sitemap', async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const sitemap = posts?.map(post => ({
      url: `/blog/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: 'weekly',
      priority: 0.8
    })) || [];

    res.json({
      success: true,
      data: sitemap
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate sitemap'
    });
  }
});

export default router;