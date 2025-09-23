import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, ArrowRight, Search, Filter, Clock, Eye, Heart, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getBlogPosts, getBlogCategories, likeBlogPost, type BlogPost, type BlogCategory } from '@/lib/blogApi-mock';
import { SEOHead } from '@/components/SEOHead';

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  // Load blog data
  useEffect(() => {
    const loadBlogData = async () => {
      setLoading(true);
      try {
        const [postsResponse, categoriesData] = await Promise.all([
          getBlogPosts({ 
            page: currentPage, 
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            search: searchTerm || undefined 
          }),
          getBlogCategories()
        ]);

        if (postsResponse.success) {
          setBlogPosts(postsResponse.data.posts);
          setTotalPages(postsResponse.data.pagination.totalPages);
          
          // Set featured posts from first page
          if (currentPage === 1) {
            setFeaturedPosts(postsResponse.data.posts.filter(post => post.featured));
          }
        }
        
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading blog data:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, [currentPage, selectedCategory, searchTerm]);

  const handleLike = async (post: BlogPost) => {
    try {
      const result = await likeBlogPost(post.slug);
      if (result.success) {
        setLikedPosts(prev => 
          prev.includes(post.id) 
            ? prev.filter(id => id !== post.id)
            : [...prev, post.id]
        );
        
        // Update post likes in state
        setBlogPosts(prev => prev.map(p => 
          p.id === post.id 
            ? { ...p, likes: result.likes } 
            : p
        ));
        
        toast.success(likedPosts.includes(post.id) ? 'Removed from favorites' : 'Added to favorites!');
      }
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handleShare = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="PrintPhoneCover Blog - Custom Phone Case Design Inspiration"
        description="Explore creative ideas, professional tips, and the latest trends in custom phone case design. Learn about our innovative printing technology."
        keywords="custom phone cases, design blog, phone case ideas, mobile accessories, personalization"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PrintPhoneCover Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Tips, tricks, and inspiration for creating the perfect custom phone case. 
            Stay updated with the latest trends and technology.
          </p>
        </div>

        {/* Featured Posts Carousel */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="mr-2">🌟</span>
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gradient-to-r from-blue-500 to-purple-500">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30">
                        Featured
                      </Badge>
                      <h3 className="font-bold text-lg mb-1 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center text-sm opacity-90">
                        <User className="h-3 w-3 mr-1" />
                        <span className="mr-3">{post.author}</span>
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles, authors, or topics..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || selectedCategory !== 'All') && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {blogPosts.length} articles
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center text-gray-500 group-hover:scale-110 transition-transform">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                    📱
                  </div>
                  <p className="text-sm font-medium">Blog Image</p>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="hover:bg-blue-100 transition-colors">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{post.read_time}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{post.views}</span>
                    </div>
                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center transition-colors ${
                        likedPosts.includes(post.id) ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-3 w-3 mr-1 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                      <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                </div>
                
                <Button asChild variant="ghost" className="w-full group border hover:bg-blue-50 hover:border-blue-200">
                  <Link to={`/blog/${post.slug}`}>
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && blogPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse all categories
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setCurrentPage(1);
            }}>
              Show All Articles
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl shadow-xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Our Latest Content</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Get the latest design trends, tips, exclusive offers, and new articles delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/70"
              />
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Subscribe Now
              </Button>
            </div>
            <p className="text-xs text-blue-200 mt-3">
              Join 10,000+ subscribers. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}