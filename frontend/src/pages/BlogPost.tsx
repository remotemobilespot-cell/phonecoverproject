import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowLeft, Clock, Eye, Heart, Share2, Tag, Loader2 } from 'lucide-react';
import { getBlogPost, likeBlogPost, type BlogPost as BlogPostType } from '@/lib/blogApi-mock';
import { BlogSEO } from '@/components/SEOHead';
import { InteractiveBlogComponents } from '@/components/InteractiveBlogComponents';
import { toast } from 'sonner';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const response = await getBlogPost(slug);
        if (response.success) {
          setPost(response.data.post);
          setRelatedPosts(response.data.relatedPosts);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error loading blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const result = await likeBlogPost(post.slug);
      if (result.success) {
        setLiked(!liked);
        setPost(prev => prev ? { ...prev, likes: result.likes } : null);
        toast.success(liked ? 'Removed from favorites' : 'Added to favorites!');
      }
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handleShare = () => {
    if (!post) return;
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogSEO post={post} />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="mb-6">
                <Badge variant="secondary" className="mb-4">
                  <Tag className="h-3 w-3 mr-1" />
                  {post.category}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{post.read_time}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{post.views}</span>
                  </div>
                  <button 
                    onClick={handleLike}
                    className={`flex items-center text-sm transition-colors ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                    📱
                  </div>
                  <p className="font-medium">Featured Image</p>
                  <p className="text-sm">{post.title}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
                />
                
                {/* Interactive Elements */}
                {post.interactive_elements && post.interactive_elements.length > 0 && (
                  <div className="mt-12 space-y-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Interactive Features</h2>
                    {post.interactive_elements.map((element, index) => (
                      <div key={index} className="my-8">
                        <InteractiveBlogComponents element={element} />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Extended content based on category */}
                {post.category === 'Design Tips' && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Getting Started with Custom Design</h2>
                    <p className="mb-4">
                      Creating a stunning custom phone case starts with understanding the basics of design. 
                      Here are some key principles to keep in mind when designing your perfect case.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                      <li>Choose high-resolution images for the best print quality</li>
                      <li>Consider your phone's camera placement when positioning elements</li>
                      <li>Use contrasting colors to make your design pop</li>
                      <li>Keep text readable by using appropriate font sizes</li>
                      <li>Test your design on different backgrounds</li>
                    </ul>
                  </div>
                )}

                {post.category === 'Photography' && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Essential Photography Tips</h2>
                    <p className="mb-4">
                      Taking photos specifically for phone case printing requires some special considerations. 
                      Follow these professional tips for best results.
                    </p>
                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">Pro Tip:</h3>
                      <p>Always shoot in the highest resolution possible. You can always scale down, but you can't add detail that wasn't captured originally.</p>
                    </div>
                  </div>
                )}

                {post.category === 'Technology' && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">The Technology Behind the Magic</h2>
                    <p className="mb-4">
                      Our instant printing technology represents years of research and development. 
                      Here's how we make custom phone cases in minutes, not days.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">High-Resolution Printing</h4>
                        <p className="text-sm">Industry-leading 1200 DPI resolution ensures crisp, clear images.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Instant Processing</h4>
                        <p className="text-sm">Advanced image processing algorithms optimize your design in real-time.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-8">
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
              <Button asChild>
                <Link to="/print-now">
                  Start Creating Your Case
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Link>
              </Button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{post.author}</p>
                      <p className="text-sm text-gray-600">Content Creator</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Passionate about technology and design, creating helpful content for the PrintPhoneCover community.
                  </p>
                </CardContent>
              </Card>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link 
                          key={relatedPost.id} 
                          to={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(relatedPost.created_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{relatedPost.read_time}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold mb-2">Ready to Create?</h3>
                  <p className="text-sm text-blue-100 mb-4">
                    Turn your ideas into reality with our instant printing technology.
                  </p>
                  <Button asChild variant="secondary" size="sm" className="w-full">
                    <Link to="/print-now">Start Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
