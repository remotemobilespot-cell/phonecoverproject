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
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PrintPhoneCover Blog
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Tips, tricks, and inspiration for creating the perfect custom phone case. 
            Stay updated with the latest trends and technology.
          </p>
        </div>

        {/* Featured Posts Carousel */}
        {featuredPosts.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
              <span className="mr-2">🌟</span>
              Featured Articles
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-500/30">
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center text-4xl sm:text-6xl hidden">
                      📱
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 text-white">
                      <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30 text-xs">
                        Featured
                      </Badge>
                      <h3 className="font-bold text-sm sm:text-lg mb-1 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center text-xs sm:text-sm opacity-90">
                        <User className="h-3 w-3 mr-1" />
                        <span className="mr-2 sm:mr-3">{post.author}</span>
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="sm:hidden">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles, authors, or topics..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-48">
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
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing {blogPosts.length} article{blogPosts.length !== 1 ? 's' : ''}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setCurrentPage(1);
                }}
                className="self-start sm:self-auto text-xs sm:text-sm"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-3 sm:mb-4 text-blue-600" />
            <p className="text-gray-600 text-sm sm:text-base">Loading blog posts...</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-gray-500 hidden">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                      📱
                    </div>
                    <p className="text-xs sm:text-sm font-medium">Blog Image</p>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="hover:bg-blue-100 transition-colors text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{post.read_time}</span>
                  </div>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
                <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-3 text-xs sm:text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span className="font-medium truncate">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">{new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="sm:hidden">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
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
                    className="flex items-center hover:text-blue-500 transition-colors p-1"
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                </div>
                
                <Button asChild variant="ghost" className="w-full group border hover:bg-blue-50 hover:border-blue-200 text-xs sm:text-sm py-1 sm:py-2">
                  <Link to={`/blog/${post.slug}`}>
                    Read Full Article
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-2 mt-8 sm:mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Previous
            </Button>
            
            <div className="flex gap-1 sm:gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNumber > totalPages) return null;
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNumber)}
                    size="sm"
                    className="text-xs sm:text-sm min-w-8 sm:min-w-10"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && blogPosts.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
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