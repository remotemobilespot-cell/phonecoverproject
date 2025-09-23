// Blog API service for frontend
// TEMPORARY FIX: Always use production backend for now
const API_BASE_URL = 'https://phonecoverproject-1.onrender.com';

console.log('🔧 Blog API Debug:', {
  API_BASE_URL,
  fullUrl: `${API_BASE_URL}/api/blog/posts`
});

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  featured: boolean;
  image_url?: string;
  read_time: string;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  interactive_elements?: any[];
  related_products?: any[];
  seo?: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogType: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    twitterCard: string;
    structuredData: any;
  };
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogPostsResponse {
  success: boolean;
  data: {
    posts: BlogPost[];
    pagination: PaginationInfo;
  };
}

export interface BlogPostResponse {
  success: boolean;
  data: {
    post: BlogPost;
    relatedPosts: BlogPost[];
    seo: any;
  };
}

// Get all blog posts with filtering and pagination
export const getBlogPosts = async ({
  page = 1,
  limit = 12,
  category,
  featured,
  search,
  sort = 'created_at',
  order = 'desc'
}: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<BlogPostsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order
    });
    
    if (category) params.append('category', category);
    if (featured !== undefined) params.append('featured', featured.toString());
    if (search) params.append('search', search);

    console.log('🔧 Making API request to:', `${API_BASE_URL}/api/blog/posts?${params}`);
    const response = await fetch(`${API_BASE_URL}/api/blog-direct/posts?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Return fallback data on error
    return {
      success: false,
      data: {
        posts: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    };
  }
};

// Get single blog post by slug
export const getBlogPost = async (slug: string): Promise<BlogPostResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Blog post not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

// Get blog categories
export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
};

// Get trending posts
export const getTrendingPosts = async (limit: number = 5): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/trending?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
};

// Like a blog post
export const likeBlogPost = async (slug: string): Promise<{ success: boolean; likes: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      likes: data.data?.likes || 0
    };
  } catch (error) {
    console.error('Error liking blog post:', error);
    return { success: false, likes: 0 };
  }
};

// Generate sitemap data
export const getBlogSitemap = async (): Promise<Array<{
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/sitemap`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching blog sitemap:', error);
    return [];
  }
};

// Preload critical blog data
export const preloadBlogData = async () => {
  try {
    const [postsData, categoriesData, trendingData] = await Promise.all([
      getBlogPosts({ limit: 6, featured: true }),
      getBlogCategories(),
      getTrendingPosts(3)
    ]);

    return {
      featuredPosts: postsData.data.posts,
      categories: categoriesData,
      trending: trendingData
    };
  } catch (error) {
    console.error('Error preloading blog data:', error);
    return {
      featuredPosts: [],
      categories: [],
      trending: []
    };
  }
};

// Local storage helpers for blog preferences
export const saveBlogPreferences = (preferences: {
  favoriteCategories?: string[];
  likedPosts?: number[];
  readingPreferences?: any;
}) => {
  try {
    localStorage.setItem('blog_preferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving blog preferences:', error);
  }
};

export const getBlogPreferences = () => {
  try {
    const stored = localStorage.getItem('blog_preferences');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting blog preferences:', error);
    return {};
  }
};

// Reading progress tracking
export const trackReadingProgress = (postSlug: string, progress: number) => {
  try {
    const key = `reading_progress_${postSlug}`;
    localStorage.setItem(key, progress.toString());
  } catch (error) {
    console.error('Error tracking reading progress:', error);
  }
};

export const getReadingProgress = (postSlug: string): number => {
  try {
    const key = `reading_progress_${postSlug}`;
    const stored = localStorage.getItem(key);
    return stored ? parseFloat(stored) : 0;
  } catch (error) {
    console.error('Error getting reading progress:', error);
    return 0;
  }
};

export default {
  getBlogPosts,
  getBlogPost,
  getBlogCategories,
  getTrendingPosts,
  likeBlogPost,
  getBlogSitemap,
  preloadBlogData,
  saveBlogPreferences,
  getBlogPreferences,
  trackReadingProgress,
  getReadingProgress
};