// Blog API service with MOCK DATA (temporary fix)
// This provides mock blog data while backend is being fixed

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
  seo?: any;
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

// Mock blog posts
const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 Custom Phone Case Design Ideas for 2025',
    slug: 'top-10-custom-phone-case-design-ideas-2025',
    excerpt: 'Discover the most creative phone case designs that will make your device stand out in 2025.',
    content: `# Top 10 Custom Phone Case Design Ideas for 2025

Creating a custom phone case is an art form that allows you to express your personality while protecting your valuable device. Here are our top design ideas:

## 1. Minimalist Geometric Patterns
Simple shapes and clean lines create sophisticated designs that never go out of style.

## 2. Personal Photography
Transform your favorite photos into wearable memories with high-quality printing.

## 3. Typography Art
Express yourself with meaningful quotes and beautiful typography.`,
    author: 'Design Team',
    category: 'Design Tips',
    featured: true,
    image_url: '/images/blog/design-ideas.jpg',
    read_time: '5 min read',
    views: 1250,
    likes: 89,
    created_at: '2025-09-20T10:00:00Z',
    updated_at: '2025-09-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Photography Tips for Perfect Custom Case Images',
    slug: 'photography-tips-perfect-custom-case-images',
    excerpt: 'Learn professional photography techniques to capture stunning photos for your custom phone case designs.',
    content: `# Photography Tips for Perfect Custom Case Images

Professional photography can make or break your custom design. Here's how to capture the perfect image:

## Lighting is Everything
Natural light works best for most photos. Avoid harsh shadows and overexposure.

## Composition Rules
Follow the rule of thirds and consider negative space in your designs.`,
    author: 'Photo Team',
    category: 'Photography',
    featured: true,
    image_url: '/images/blog/photography-tips.jpg',
    read_time: '7 min read',
    views: 892,
    likes: 67,
    created_at: '2025-09-18T14:30:00Z',
    updated_at: '2025-09-18T14:30:00Z'
  },
  {
    id: 3,
    title: 'The Latest Technology Behind Phone Case Printing',
    slug: 'latest-technology-phone-case-printing',
    excerpt: 'Explore the cutting-edge printing technology that brings your custom designs to life.',
    content: `# The Latest Technology Behind Phone Case Printing

Modern printing technology has revolutionized how we create custom phone cases:

## UV Printing Technology
Our state-of-the-art UV printers ensure vibrant colors and lasting durability.

## Material Innovation
New materials provide better protection while maintaining print quality.`,
    author: 'Tech Team',
    category: 'Technology',
    featured: false,
    image_url: '/images/blog/printing-tech.jpg',
    read_time: '6 min read',
    views: 645,
    likes: 43,
    created_at: '2025-09-15T09:15:00Z',
    updated_at: '2025-09-15T09:15:00Z'
  },
  {
    id: 4,
    title: 'How to Protect Your Phone with Style',
    slug: 'protect-phone-with-style',
    excerpt: 'Learn how custom cases provide superior protection without compromising on style.',
    content: `# How to Protect Your Phone with Style

Protection doesn't mean sacrificing aesthetics. Here's how to get both:

## Drop Protection
Our cases are tested to military standards for maximum impact protection.

## Style Options
Choose from hundreds of design templates or create your own unique look.`,
    author: 'Protection Team',
    category: 'Protection',
    featured: false,
    image_url: '/images/blog/protection.jpg',
    read_time: '4 min read',
    views: 423,
    likes: 31,
    created_at: '2025-09-12T11:20:00Z',
    updated_at: '2025-09-12T11:20:00Z'
  }
];

// Mock categories
const mockCategories: BlogCategory[] = [
  { id: 1, name: 'Design Tips', slug: 'design-tips', description: 'Creative ideas and inspiration', color: '#8B5CF6' },
  { id: 2, name: 'Photography', slug: 'photography', description: 'Photo tips and techniques', color: '#10B981' },
  { id: 3, name: 'Technology', slug: 'technology', description: 'Tech insights and innovation', color: '#3B82F6' },
  { id: 4, name: 'Protection', slug: 'protection', description: 'Device protection guides', color: '#F59E0B' }
];

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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredPosts = [...mockPosts];

  // Filter by category
  if (category && category !== 'All') {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }
  
  // Filter by featured
  if (featured) {
    filteredPosts = filteredPosts.filter(post => post.featured);
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }

  // Sort posts
  filteredPosts.sort((a, b) => {
    const aValue = sort === 'created_at' ? new Date(a.created_at).getTime() : a.views;
    const bValue = sort === 'created_at' ? new Date(b.created_at).getTime() : b.views;
    return order === 'desc' ? bValue - aValue : aValue - bValue;
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalCount: filteredPosts.length,
        hasNext: endIndex < filteredPosts.length,
        hasPrev: page > 1
      }
    }
  };
};

// Get single blog post
export const getBlogPost = async (slug: string): Promise<BlogPostResponse> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const post = mockPosts.find(p => p.slug === slug);
  if (!post) {
    throw new Error('Post not found');
  }

  const relatedPosts = mockPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return {
    success: true,
    data: {
      post,
      relatedPosts,
      seo: {
        title: post.title,
        description: post.excerpt
      }
    }
  };
};

// Get blog categories
export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCategories;
};

// Get trending posts
export const getTrendingPosts = async (limit = 5): Promise<BlogPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockPosts
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

// Like a post (mock)
export const likeBlogPost = async (slug: string): Promise<{ success: boolean; likes: number }> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const post = mockPosts.find(p => p.slug === slug);
  if (post) {
    post.likes++;
    return { success: true, likes: post.likes };
  }
  return { success: false, likes: 0 };
};

// Get sitemap (mock)
export const getBlogSitemap = async () => {
  return mockPosts.map(post => ({
    slug: post.slug,
    lastModified: post.updated_at,
    priority: post.featured ? 0.8 : 0.6
  }));
};