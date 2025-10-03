import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import DatabaseDebugger from '../components/admin/DatabaseDebugger';
import DatabaseManager from '../components/admin/DatabaseManager';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  Store, 
  FileText, 
  Database, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Smartphone,
  MapPin,
  Check,
  X,
  Truck,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Interface definitions
interface Order {
  id: string;
  order_number?: string;
  phone_model_id: string;
  case_type?: string;
  design_image_url?: string;
  original_image_url?: string;  // ADD: Original image URL
  edited_image_url?: string;
  thumbnail_url?: string;
  quantity?: number;
  amount: number; // Your actual column name
  total_amount?: number; // Backup for compatibility
  subtotal?: number;
  tax_amount?: number;
  shipping_amount?: number;
  payment_status?: string;
  payment_method?: string;
  payment_reference?: string;
  status: string;
  delivery_method?: string;
  pickup_location?: string;
  pickup_location_name?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_zip?: string;
  customer_notes?: string;
  admin_notes?: string;
  contact_email: string;
  contact_name: string;
  contact_phone?: string;
  created_at: string;
  updated_at?: string;
  user: {
    email: string;
    full_name?: string;
    phone?: string;
  };
  phone_model_details?: {
    brand: string;
    name: string;
    base_price?: number;
  };
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  category: {
    name: string;
  };
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface PhoneModel {
  id: string;
  name: string;
  brand: string;
  base_price: number;
  is_active: boolean;
  created_at: string;
}

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  is_active: boolean;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
}

interface Testimonial {
  id: string;
  name: string;
  email: string;
  content: string;
  rating: number;
  location?: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Simple Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { login, isLoading } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result) {
        onLogin();
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the admin dashboard</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Use admin@printphonecover.com to access the admin panel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="admin@printphonecover.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={loading || isLoading}
              >
                {loading || isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign in to Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for dashboard stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalBlogPosts: 0,
    activePhoneModels: 0,
    activeStores: 0,
    pendingOrders: 0,
    processingOrders: 0,
    readyOrders: 0,
    completedOrders: 0
  });

  // State for data
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>([]);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // State for modals and forms
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [editingPhoneModel, setEditingPhoneModel] = useState<PhoneModel | null>(null);
  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [editingContact, setEditingContact] = useState<ContactMessage | null>(null);
  const [editingContactMessage, setEditingContactMessage] = useState<ContactMessage | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedExportLocation, setSelectedExportLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const adminSession = localStorage.getItem('admin_session');
    const adminToken = localStorage.getItem('adminToken');
    
    if (!adminSession && !adminToken) {
      setLoading(false);
      return;
    }

    // Load all dashboard data
    await Promise.all([
      fetchStats(),
      fetchOrders(),
      fetchUsers(),
      fetchBlogPosts(),
      fetchPhoneModels(),
      fetchStoreLocations(),
      fetchContactMessages(),
      fetchFaqs(),
      fetchNewsletterSubscribers(),
      fetchTestimonials()
    ]);

    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Fetch order stats with correct field names
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status, contact_email, created_at');
      
      if (ordersError) {
        console.error('Error fetching orders for stats:', ordersError);
      }
      
      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;
      const processingOrders = ordersData?.filter(order => order.status === 'processing').length || 0;
      const readyOrders = ordersData?.filter(order => order.status === 'ready').length || 0;
      const completedOrders = ordersData?.filter(order => order.status === 'completed').length || 0;

      // Count unique users from orders (as backup to profiles)
      const uniqueUserEmails = ordersData ? [...new Set(ordersData.map(order => order.contact_email).filter(Boolean))] : [];
      let totalUsers = uniqueUserEmails.length;

      // Try to get users from profiles table (if available and populated)
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id');
        
        if (!usersError && usersData && usersData.length > 0) {
          totalUsers = usersData.length;
        }
      } catch (error) {
        console.log('Using unique emails from orders for user count');
      }

      // Fetch blog stats
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('id');
      
      if (blogError) {
        console.error('Error fetching blog stats:', blogError);
      }
      
      const totalBlogPosts = blogData?.length || 0;

      // Fetch phone model stats
      const { data: phoneData, error: phoneError } = await supabase
        .from('phone_models')
        .select('id, is_active')
        .eq('is_active', true);
      
      if (phoneError) {
        console.error('Error fetching phone model stats:', phoneError);
      }
      
      const activePhoneModels = phoneData?.length || 0;

      // Fetch store stats
      const { data: storeData } = await supabase
        .from('store_locations')
        .select('id, is_active')
        .eq('is_active', true);
      
      const activeStores = storeData?.length || 0;

      setStats({
        totalOrders,
        totalRevenue,
        totalUsers,
        totalBlogPosts,
        activePhoneModels,
        activeStores,
        pendingOrders,
        processingOrders,
        readyOrders,
        completedOrders
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      // Fetch orders with phone model details - images are stored directly in orders table
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          phone_models:phone_model_id (
            brand,
            name,
            base_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format orders - images are directly in the orders table columns
      const formattedOrders = ordersData?.map(order => {
        return {
          ...order,
          user: {
            email: order.contact_email || 'N/A',
            full_name: order.contact_name || 'N/A', 
            phone: order.contact_phone || 'N/A'
          },
          phone_model_details: {
            brand: order.phone_models?.brand || 'Unknown',
            name: order.phone_models?.name || 'N/A',
            base_price: order.phone_models?.base_price || 20.00
          },
          // Map comprehensive payment and delivery info
          payment_status: order.payment_status || 'pending',
          payment_method: order.payment_method || 'N/A',
          payment_reference: order.payment_reference || null,
          delivery_method: order.fulfillment_method || 'pickup', // Fix: Use fulfillment_method from database
          pickup_location: order.pickup_location || null,
          pickup_location_name: null, // Will be resolved after fetching store locations
          delivery_address: order.delivery_address || null,
          delivery_city: order.delivery_city || null,
          delivery_state: order.delivery_state || null,
          delivery_zip: order.delivery_zip || null,
          // Image URLs from direct columns in orders table
          design_image_url: order.design_image || null,        // Edited/final image
          original_image_url: order.original_image || null,    // Original uploaded image (now stored!)
          edited_image_url: order.design_image || null,        // Same as design_image (for compatibility)
          thumbnail_url: null, // Not implemented yet
          // Case type information
          case_type: order.case_type || 'regular', // MagSafe vs Regular case
          // Pricing information
          subtotal: order.subtotal || 0,
          tax_amount: order.tax_amount || 0,
          shipping_amount: order.shipping_amount || 0,
          total_amount: order.total_amount || order.amount || 0,
          // Order status
          status: order.status || 'pending',
          customer_notes: order.customer_notes || null
        };
      }) || [];
      
      console.log('✅ Fetched orders from orders table:', formattedOrders.length);
      console.log('🖼️ First order image data:', formattedOrders[0] ? {
        id: formattedOrders[0].id,
        design_image: formattedOrders[0].design_image,
        original_image: formattedOrders[0].original_image,
        design_image_url: formattedOrders[0].design_image_url,
        original_image_url: formattedOrders[0].original_image_url
      } : 'No orders');
      
      // Debug: Check image URLs for all orders
      console.log('🔍 Image URL Debug - All Orders:');
      formattedOrders.slice(0, 5).forEach(order => {
        console.log(`Order ${order.id}:`, {
          original_db: order.design_image,
          design_db: order.original_image,
          original_mapped: order.original_image_url,
          design_mapped: order.design_image_url
        });
      });
      
      // Resolve pickup location names
      if (formattedOrders.length > 0) {
        // Fetch store locations if not already loaded
        const { data: storeLocationsData } = await supabase
          .from('store_locations')
          .select('id, name, address');
        
        // Map pickup location IDs to names
        const resolvedOrders = formattedOrders.map(order => {
          if (order.store_location_id && storeLocationsData) {
            const matchingStore = storeLocationsData.find(store => 
              store.id === order.store_location_id
            );
            if (matchingStore) {
              // Extract city/state from address
              if (matchingStore.address) {
                const addressParts = matchingStore.address.split(',');
                if (addressParts.length >= 2) {
                  const cityState = addressParts.slice(-2).join(',').trim();
                  order.pickup_location_name = `${matchingStore.name} - ${cityState}`;
                } else {
                  order.pickup_location_name = matchingStore.name;
                }
              } else {
                order.pickup_location_name = matchingStore.name;
              }
            }
          }
          return order;
        });
        setOrders(resolvedOrders);
      } else {
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      // Fallback to direct orders table if view fails
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('orders')
          .select(`
            *,
            phone_models:phone_model_id (
              brand,
              name,
              base_price
            )
          `)
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        
        const fallbackOrders = fallbackData?.map(order => ({
          ...order,
          pickup_location_name: null, // Will be resolved after fetching store locations
          user: {
            email: order.contact_email || 'N/A',
            full_name: order.contact_name || 'N/A', 
            phone: order.contact_phone || 'N/A'
          },
          phone_model_details: order.phone_models || { 
            brand: 'Unknown', 
            name: order.phone_model_name || 'N/A', 
            base_price: order.base_price || 20.00 
          }
        })) || [];
        
        console.log('⚠️ Using fallback orders data:', fallbackOrders.length);
        
        // Resolve  names for fallback orders too
        if (fallbackOrders.length > 0) {
          const { data: storeLocationsData } = await supabase
            .from('store_locations')
            .select('id, name, address');
          
          const resolvedFallbackOrders = fallbackOrders.map(order => {
            if (order.store_location_id && storeLocationsData) {
              const matchingStore = storeLocationsData.find(store => 
                store.id === order.store_location_id
              );
              if (matchingStore) {
                if (matchingStore.address) {
                  const addressParts = matchingStore.address.split(',');
                  if (addressParts.length >= 2) {
                    const cityState = addressParts.slice(-2).join(',').trim();
                    order.pickup_location_name = `${matchingStore.name} - ${cityState}`;
                  } else {
                    order.pickup_location_name = matchingStore.name;
                  }
                } else {
                  order.pickup_location_name = matchingStore.name;
                }
              }
            }
            return order;
          });
          setOrders(resolvedFallbackOrders);
        } else {
          setOrders(fallbackOrders);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback fetch also failed:', fallbackError);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories:category_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedPosts = data?.map(post => ({
        ...post,
        category: post.blog_categories || { name: 'Uncategorized' }
      })) || [];
      
      setBlogPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const fetchPhoneModels = async () => {
    try {
      const { data, error } = await supabase
        .from('phone_models')
        .select('*')
        .order('brand, name');

      if (error) throw error;
      setPhoneModels(data || []);
    } catch (error) {
      console.error('Error fetching phone models:', error);
    }
  };

  const fetchStoreLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .order('name');

      if (error) throw error;
      setStoreLocations(data || []);
    } catch (error) {
      console.error('Error fetching store locations:', error);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactMessages(data || []);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchNewsletterSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setNewsletterSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  // Contact Messages CRUD Functions
  const deleteContactMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContactMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Error deleting contact message:', error);
    }
  };

  const updateContactMessage = async (id: string, updates: Partial<ContactMessage>) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setContactMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
    } catch (error) {
      console.error('Error updating contact message:', error);
    }
  };

  // FAQ CRUD Functions
  const createFaq = async (faqData: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faqData])
        .select()
        .single();

      if (error) throw error;
      setFaqs(prev => [data, ...prev]);
      setEditingFaq(null);
    } catch (error) {
      console.error('Error creating FAQ:', error);
    }
  };

  const updateFaq = async (id: string, updates: Partial<FAQ>) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setFaqs(prev => prev.map(faq => faq.id === id ? { ...faq, ...updates } : faq));
      setEditingFaq(null);
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  // Newsletter Subscribers CRUD Functions
  const updateNewsletterSubscriber = async (id: string, updates: Partial<NewsletterSubscriber>) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setNewsletterSubscribers(prev => prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub));
    } catch (error) {
      console.error('Error updating newsletter subscriber:', error);
    }
  };

  const deleteNewsletterSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNewsletterSubscribers(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting newsletter subscriber:', error);
    }
  };

  // Testimonials CRUD Functions
  const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select()
        .single();

      if (error) throw error;
      setTestimonials(prev => [data, ...prev]);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error creating testimonial:', error);
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setTestimonials(prev => prev.map(testimonial => testimonial.id === id ? { ...testimonial, ...updates } : testimonial));
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_login_time');
    localStorage.removeItem('adminToken');
    setLoading(true);
    // Trigger re-authentication check
    setTimeout(() => {
      checkAdminAuth();
    }, 100);
  };

  // Enhanced order management functions
  const bulkUpdateOrderStatus = async (orderIds: string[], newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .in('id', orderIds);

      if (error) throw error;
      
      await fetchOrders();
      await fetchStats();
      toast.success(`Updated ${orderIds.length} orders to ${newStatus}`);
    } catch (error: any) {
      console.error('Error bulk updating orders:', error);
      toast.error(`Failed to update orders: ${error.message}`);
    }
  };

  const updateOrderDetails = async (orderId: string, updates: Partial<Order>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders();
      toast.success('Order updated successfully');
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  // Admin CRUD Operations
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders();
      await fetchStats();
      toast.success('Order status updated successfully');
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  // Handle status change for the quick action dropdown
  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders();
      await fetchStats();
      toast.success('Order deleted successfully');
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast.error(`Failed to delete order: ${error.message}`);
    }
  };

  const createBlogPost = async (postData: Partial<BlogPost>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([{
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt,
          featured_image_url: postData.featured_image_url,
          published: postData.published || false,
          category_id: '550e8400-e29b-41d4-a716-446655440000' // Default category
        }]);

      if (error) throw error;
      
      await fetchBlogPosts();
      await fetchStats();
      toast.success('Blog post created successfully');
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      toast.error(`Failed to create blog post: ${error.message}`);
    }
  };

  const updateBlogPost = async (postId: string, postData: Partial<BlogPost>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt,
          featured_image_url: postData.featured_image_url,
          published: postData.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;
      
      await fetchBlogPosts();
      toast.success('Blog post updated successfully');
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      toast.error(`Failed to update blog post: ${error.message}`);
    }
  };

  const deleteBlogPost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      await fetchBlogPosts();
      await fetchStats();
      toast.success('Blog post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast.error(`Failed to delete blog post: ${error.message}`);
    }
  };

  const createPhoneModel = async (phoneData: Partial<PhoneModel>) => {
    try {
      const { error } = await supabase
        .from('phone_models')
        .insert([{
          name: phoneData.name,
          brand: phoneData.brand,
          base_price: phoneData.base_price,
          is_active: phoneData.is_active || true
        }]);

      if (error) throw error;
      
      await fetchPhoneModels();
      await fetchStats();
      toast.success('Phone model created successfully');
    } catch (error: any) {
      console.error('Error creating phone model:', error);
      toast.error(`Failed to create phone model: ${error.message}`);
    }
  };

  const updatePhoneModel = async (phoneId: string, phoneData: Partial<PhoneModel>) => {
    try {
      const { error } = await supabase
        .from('phone_models')
        .update({
          name: phoneData.name,
          brand: phoneData.brand,
          base_price: phoneData.base_price,
          is_active: phoneData.is_active
        })
        .eq('id', phoneId);

      if (error) throw error;
      
      await fetchPhoneModels();
      toast.success('Phone model updated successfully');
    } catch (error: any) {
      console.error('Error updating phone model:', error);
      toast.error(`Failed to update phone model: ${error.message}`);
    }
  };

  const deletePhoneModel = async (phoneId: string) => {
    if (!confirm('Are you sure you want to delete this phone model? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('phone_models')
        .delete()
        .eq('id', phoneId);

      if (error) throw error;
      
      await fetchPhoneModels();
      await fetchStats();
      toast.success('Phone model deleted successfully');
    } catch (error: any) {
      console.error('Error deleting phone model:', error);
      toast.error(`Failed to delete phone model: ${error.message}`);
    }
  };

  const updateStoreLocation = async (storeId: string, storeData: Partial<StoreLocation>) => {
    try {
      const { error } = await supabase
        .from('store_locations')
        .update({
          name: storeData.name,
          address: storeData.address,
          phone: storeData.phone,
          email: storeData.email,
          hours: storeData.hours,
          is_active: storeData.is_active
        })
        .eq('id', storeId);

      if (error) throw error;
      
      await fetchStoreLocations();
      toast.success('Store location updated successfully');
    } catch (error: any) {
      console.error('Error updating store location:', error);
      toast.error(`Failed to update store location: ${error.message}`);
    }
  };

  const createStoreLocation = async (storeData: Omit<StoreLocation, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('store_locations')
        .insert([{
          name: storeData.name,
          address: storeData.address,
          phone: storeData.phone,
          email: storeData.email,
          hours: storeData.hours,
          is_active: storeData.is_active
        }]);

      if (error) throw error;
      
      await fetchStoreLocations();
      toast.success('Store location created successfully');
    } catch (error: any) {
      console.error('Error creating store location:', error);
      toast.error(`Failed to create store location: ${error.message}`);
    }
  };

  const deleteStoreLocation = async (storeId: string) => {
    try {
      const { error } = await supabase
        .from('store_locations')
        .delete()
        .eq('id', storeId);

      if (error) throw error;
      
      await fetchStoreLocations();
      toast.success('Store location deleted successfully');
    } catch (error: any) {
      console.error('Error deleting store location:', error);
      toast.error(`Failed to delete store location: ${error.message}`);
    }
  };

  // CSV Export Functions
  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const executeExport = () => {
    console.log('Export initiated:', { selectedExportLocation, storeLocations: storeLocations.length, orders: orders.length });
    
    if (selectedExportLocation === 'all') {
      exportAllLocationsCSV();
    } else {
      const location = storeLocations.find(loc => loc.id === selectedExportLocation);
      if (location) {
        const locationOrders = orders.filter(order => 
          order.pickup_location_name === location.name || 
          order.pickup_location === location.id
        );
        console.log('Location export:', { location: location.name, orders: locationOrders.length });
        exportLocationOrdersCSV(location, locationOrders);
      } else {
        toast.error('Selected location not found');
      }
    }
    setExportDialogOpen(false);
    setSelectedExportLocation('all');
  };

  const exportLocationOrdersCSV = (location: StoreLocation, locationOrders: Order[]) => {
    console.log('Exporting location orders:', { location: location.name, orderCount: locationOrders.length });
    
    if (locationOrders.length === 0) {
      toast.error('No orders found for this location');
      return;
    }

    const csvHeaders = [
      'Order ID',
      'Customer Name', 
      'Contact Phone',
      'Email',
      'Phone Model',
      'Phone Brand',
      'Order Status',
      'Payment Status',
      'Total Amount',
      'Order Date',
      'Pickup Location',
      'Images'
    ];

    const csvData = locationOrders.map(order => [
      order.id.slice(-8).toUpperCase(),
      order.contact_name || order.user?.full_name || 'N/A',
      order.contact_phone || 'N/A',
      order.contact_email || order.user?.email || 'N/A',
      order.phone_model_details?.name || 'N/A',
      order.phone_model_details?.brand || 'N/A',
      order.status || 'pending',
      order.payment_status || 'pending',
      `$${(order.total_amount || order.amount || 0).toFixed(2)}`,
      new Date(order.created_at).toLocaleDateString(),
      location.name,
      (order.original_image_url ? 1 : 0) + (order.design_image_url ? 1 : 0) + (order.thumbnail_url ? 1 : 0)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${location.name.replace(/[^a-z0-9]/gi, '_')}_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${locationOrders.length} orders for ${location.name}`);
  };

  const exportAllLocationsCSV = () => {
    if (storeLocations.length === 0) {
      toast.error('No store locations found');
      return;
    }

    const csvHeaders = [
      'Location Name',
      'Location Address',
      'Status',
      'Total Orders',
      'Processing Orders',
      'Ready Orders', 
      'Completed Orders',
      'Pending Orders',
      'Total Revenue',
      'Order Percentage',
      'Revenue Percentage'
    ];

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || order.amount || 0), 0);

    const csvData = storeLocations.map(location => {
      const locationOrders = orders.filter(order => 
        order.pickup_location_name === location.name || 
        order.pickup_location === location.id
      );
      const locationRevenue = locationOrders.reduce((sum, order) => 
        sum + (order.total_amount || order.amount || 0), 0
      );
      const orderPercentage = totalOrders > 0 ? (locationOrders.length / totalOrders * 100).toFixed(1) : '0';
      const revenuePercentage = totalRevenue > 0 ? (locationRevenue / totalRevenue * 100).toFixed(1) : '0';

      return [
        location.name,
        location.address,
        location.is_active ? 'Active' : 'Inactive',
        locationOrders.length,
        locationOrders.filter(o => o.status === 'processing').length,
        locationOrders.filter(o => o.status === 'ready').length,
        locationOrders.filter(o => o.status === 'completed').length,
        locationOrders.filter(o => ['pending', 'confirmed'].includes(o.status || 'pending')).length,
        `$${locationRevenue.toFixed(2)}`,
        `${orderPercentage}%`,
        `${revenuePercentage}%`
      ];
    });

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `all_locations_summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported summary for ${storeLocations.length} locations`);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their orders and data.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      await fetchUsers();
      await fetchStats();
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Make the search more lenient
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || // Empty search shows all
                         (order.user?.email || '').toLowerCase().includes(searchLower) ||
                         (order.user?.full_name || '').toLowerCase().includes(searchLower) ||
                         (order.contact_email || '').toLowerCase().includes(searchLower) ||
                         (order.contact_name || '').toLowerCase().includes(searchLower) ||
                         (order.phone_model_details?.name || '').toLowerCase().includes(searchLower) ||
                         (order.phone_model_details?.brand || '').toLowerCase().includes(searchLower) ||
                         (order.order_number || '').toLowerCase().includes(searchLower) ||
                         order.id.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Debug: Let's see what's happening with filtering
  console.log('🔍 Debug Info:', {
    totalOrders: orders.length,
    filteredOrdersCount: filteredOrders.length,
    searchTerm,
    statusFilter,
    firstOrder: orders[0],
    firstFilteredOrder: filteredOrders[0]
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="h-4 w-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="phones">
              <Smartphone className="h-4 w-4 mr-2" />
              Phones
            </TabsTrigger>
            <TabsTrigger value="stores">
              <Store className="h-4 w-4 mr-2" />
              Stores
            </TabsTrigger>
            <TabsTrigger value="contact">
              <FileText className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="faq">
              <FileText className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="newsletter">
              <Users className="h-4 w-4 mr-2" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <Users className="h-4 w-4 mr-2" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="reports">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Debug
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">All time orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
                  <p className="text-xs text-muted-foreground">Published articles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Phone Models</CardTitle>
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activePhoneModels}</div>
                  <p className="text-xs text-muted-foreground">Active models</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Store Locations</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeStores}</div>
                  <p className="text-xs text-muted-foreground">Active stores</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{stats.processingOrders}</div>
                  <p className="text-xs text-muted-foreground">Currently in production</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
                  <Package className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{stats.readyOrders}</div>
                  <p className="text-xs text-muted-foreground">Ready for customer pickup</p>
                </CardContent>
              </Card>
            </div>

            {/* Location-based Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>📍 Store Location Analytics</CardTitle>
                <CardDescription>
                  Order distribution and performance by pickup location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storeLocations.map(location => {
                    const locationOrders = orders.filter(order => 
                      order.pickup_location_name === location.name || 
                      order.pickup_location === location.id
                    );
                    const locationRevenue = locationOrders.reduce((sum, order) => 
                      sum + (order.total_amount || order.amount || 0), 0
                    );
                    
                    return (
                      <div key={location.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{location.name}</h4>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant={location.is_active ? "default" : "secondary"}>
                                {location.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{locationOrders.length}</div>
                            <p className="text-xs text-muted-foreground">Orders</p>
                            <div className="text-lg font-semibold text-green-600">
                              ${locationRevenue.toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                        
                        {/* Order Status Breakdown */}
                        {locationOrders.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div>
                                <div className="text-sm font-medium text-blue-600">
                                  {locationOrders.filter(o => o.status === 'processing').length}
                                </div>
                                <div className="text-xs text-muted-foreground">Processing</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-green-600">
                                  {locationOrders.filter(o => o.status === 'ready').length}
                                </div>
                                <div className="text-xs text-muted-foreground">Ready</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-purple-600">
                                  {locationOrders.filter(o => o.status === 'completed').length}
                                </div>
                                <div className="text-xs text-muted-foreground">Completed</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-yellow-600">
                                  {locationOrders.filter(o => ['pending', 'confirmed'].includes(o.status || 'pending')).length}
                                </div>
                                <div className="text-xs text-muted-foreground">Pending</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {storeLocations.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No store locations found. Add store locations in the Stores tab.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Overview */}
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Comprehensive dashboard for managing your phone case printing business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Order Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Track and manage all customer orders, view order details, uploaded designs, and update order status.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">User Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage customer accounts, view user profiles, registration data, and authentication details.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Content Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Create and manage blog posts, articles, and website content to engage your customers.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Database Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Direct access to all database tables, system configuration, and administrative controls.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by customer name, email, phone model, brand, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-lg"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="ready">Ready for Pickup</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>📋 Order Management - Print Shop</CardTitle>
                <CardDescription>
                  Quick view for printing and fulfillment ({filteredOrders.length} orders)
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        
                        {/* Order Number & Status */}
                        <div className="lg:col-span-2">
                          <div className="font-semibold text-sm text-blue-600">
                            {order.order_number ? order.order_number : `#${order.id.slice(-6).toUpperCase()}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {order.id.slice(-6)}
                          </div>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="lg:col-span-2">
                          <div className="font-medium text-sm text-gray-900">
                            {order.contact_name || order.user?.full_name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {order.contact_phone || 'No phone'}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${order.total_amount || order.amount || 0}
                            {order.payment_status && (
                              <span className={`ml-2 px-1 rounded text-xs ${
                                order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {order.payment_status}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Phone Model */}
                        <div className="lg:col-span-2">
                          <div className="font-medium text-sm text-gray-900">
                            {order.phone_model_details?.brand || 'Unknown'} {order.phone_model_details?.name || 'Model'}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {(() => {
                              // Try to extract case type from admin_notes or use case_type column if available
                              const caseType = order.case_type || 
                                (order.admin_notes && order.admin_notes.includes('magsafe') ? 'magsafe' : 'regular');
                              
                              if (caseType === 'magsafe') {
                                return (
                                  <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                    <span className="text-blue-600">⭕</span>
                                    <span className="font-medium">MagSafe Case</span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                    <span className="font-medium">Regular Case</span>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>

                        {/* Design Image */}
                        <div className="lg:col-span-1">
                          <div className="flex gap-1">
                            {/* Original Image */}
                            {order.original_image_url ? (
                              <img 
                                src={order.original_image_url} 
                                alt="Original" 
                                className="w-6 h-6 object-cover rounded border cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => window.open(order.original_image_url, '_blank')}
                                title="Original Uploaded Image"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-100 rounded border flex items-center justify-center">
                                <span className="text-xs text-gray-400">📷</span>
                              </div>
                            )}
                            
                            {/* Design Image */}
                            {order.design_image_url ? (
                              <img 
                                src={order.design_image_url} 
                                alt="Case Design" 
                                className="w-8 h-8 object-cover rounded border border-blue-300 cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => window.open(order.design_image_url, '_blank')}
                                title="Case Design Image"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                                <span className="text-xs text-gray-400">�</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Image count indicator */}
                          <div className="text-xs text-gray-500 mt-1">
                            {order.original_image_url && order.design_image_url 
                              ? '2 imgs' 
                              : (order.original_image_url || order.design_image_url) 
                                ? '1 img' 
                                : 'No imgs'
                            }
                          </div>
                        </div>

                        {/* Fulfillment Type */}
                        <div className="lg:col-span-2">
                          <div className="text-sm">
                            {order.delivery_method ? (
                              <div>
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                  order.delivery_method === 'pickup' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                                }`}>
                                  {order.delivery_method === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}
                                </span>
                                <div className="text-xs text-gray-600 mt-1">
                                  {order.delivery_method === 'pickup' 
                                    ? order.pickup_location_name || order.pickup_location || 'Store pickup'
                                    : order.delivery_address?.split(',')[0] || 'Address on file'
                                  }
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No fulfillment info</span>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="lg:col-span-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const printUrl = `/print-now?orderId=${order.id}&image=${encodeURIComponent(order.design_image_url || '')}&model=${encodeURIComponent((order.phone_model_details?.brand || '') + ' ' + (order.phone_model_details?.name || ''))}`;
                                window.open(printUrl, '_blank');
                              }}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                              title="Open print page"
                            >
                              🖨️ Print
                            </button>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              title="View full details"
                            >
                              📋 Details
                            </button>
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                              title="Update status"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Done</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                  
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {orders.length === 0 
                          ? "No orders to display" 
                          : `No orders match your filters (${orders.length} total orders)`
                        }
                      </p>
                      {orders.length > 0 && (
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                          }}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Show all orders
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location-Based Reports */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Location & Reports Dashboard</CardTitle>
                <CardDescription>
                  Order distribution by pickup location and delivery analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Pickup Locations Stats */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Pickup Location Stats
                    </h4>
                    <div className="space-y-2">
                      {storeLocations.map((location) => {
                        const locationOrders = orders.filter(order => 
                          order.pickup_location === location.name || 
                          order.pickup_location === location.address
                        );
                        const locationRevenue = locationOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
                        
                        return (
                          <div key={location.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{location.name}</div>
                              <div className="text-xs text-gray-600">{location.address}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sm">{locationOrders.length} orders</div>
                              <div className="text-xs text-green-600">${locationRevenue.toFixed(2)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Method Stats */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-600" />
                      Fulfillment Method Stats
                    </h4>
                    <div className="space-y-2">
                      {(() => {
                        const pickupOrders = orders.filter(order => order.delivery_method === 'pickup');
                        const deliveryOrders = orders.filter(order => order.delivery_method === 'delivery');
                        const pickupRevenue = pickupOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
                        const deliveryRevenue = deliveryOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
                        
                        return (
                          <>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600">🏪</span>
                                <span className="font-medium text-sm">Store Pickup</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-sm">{pickupOrders.length} orders</div>
                                <div className="text-xs text-green-600">${pickupRevenue.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600">🚚</span>
                                <span className="font-medium text-sm">Delivery</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-sm">{deliveryOrders.length} orders</div>
                                <div className="text-xs text-green-600">${deliveryRevenue.toFixed(2)}</div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Quick Report Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const reportData = orders.map(order => ({
                          orderId: order.id.slice(-8),
                          customer: order.contact_name || order.user?.full_name || 'N/A',
                          phone: order.contact_phone || order.user?.phone || 'N/A',
                          amount: order.amount || 0,
                          status: order.status || 'pending',
                          fulfillment: order.delivery_method || 'N/A',
                          location: order.pickup_location_name || order.pickup_location || order.delivery_address || 'N/A',
                          date: new Date(order.created_at).toLocaleDateString()
                        }));
                        
                        const csv = [
                          'Order ID,Customer,Phone,Amount,Status,Fulfillment,Location,Date',
                          ...reportData.map(row => 
                            `${row.orderId},${row.customer},${row.phone},$${row.amount},${row.status},${row.fulfillment},"${row.location}",${row.date}`
                          )
                        ].join('\n');
                        
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      📊 Export All Orders CSV
                    </button>
                    
                    <button
                      onClick={() => {
                        const locationReport = storeLocations.map(location => {
                          const locationOrders = orders.filter(order => 
                            order.pickup_location === location.name || 
                            order.pickup_location === location.address
                          );
                          return {
                            location: location.name,
                            address: location.address,
                            orders: locationOrders.length,
                            revenue: locationOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
                          };
                        });
                        
                        const csv = [
                          'Location,Address,Orders,Revenue',
                          ...locationReport.map(row => 
                            `"${row.location}","${row.address}",${row.orders},$${row.revenue.toFixed(2)}`
                          )
                        ].join('\n');
                        
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `location-report-${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      📍 Export Location Report
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Order Detail Modal */}
            {selectedOrder && (
              <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">📋 Complete Order Details</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col space-y-1">
                        <div className="text-lg font-semibold text-blue-600">
                          Order: {selectedOrder.order_number ? selectedOrder.order_number : `#${selectedOrder.id.slice(-6).toUpperCase()}`}
                        </div>
                        <div className="text-sm">
                          ID: {selectedOrder.id} • Created: {new Date(selectedOrder.created_at).toLocaleString()}
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          Customer Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Full Name</Label>
                            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedOrder.user.full_name || 'Not provided'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Email Address</Label>
                            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedOrder.user.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Phone Number</Label>
                            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedOrder.user.phone || 'Not provided'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">User ID</Label>
                            <p className="text-xs font-mono bg-gray-50 p-2 rounded">{selectedOrder.contact_email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Product Information */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-green-600" />
                          Product Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Phone Brand</Label>
                            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedOrder.phone_model_details?.brand}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Phone Model</Label>
                            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedOrder.phone_model_details?.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Case Type</Label>
                            <div className="mt-1">
                              {selectedOrder.case_type === 'magsafe' ? (
                                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
                                  <span className="text-blue-600">⭕</span>
                                  <span className="font-semibold">MagSafe Case</span>
                                  <span className="text-xs text-blue-600">$30.00</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                                  <span className="font-semibold">Regular Case</span>
                                  <span className="text-xs text-green-600">$20.00</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Quantity</Label>
                            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedOrder.quantity} case(s)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment & Status */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-purple-600" />
                          Payment & Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Total Amount</Label>
                            <p className="text-lg font-bold text-green-600 bg-green-50 p-2 rounded">${selectedOrder.total_amount}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Payment Status</Label>
                            <Badge 
                              variant={selectedOrder.payment_status === 'completed' ? 'default' : 'secondary'}
                              className="text-sm p-2"
                            >
                              {selectedOrder.payment_status || 'pending'}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Payment Method</Label>
                            <div className="text-sm p-2 bg-gray-50 rounded capitalize">
                              {selectedOrder.payment_method || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Order Status</Label>
                            <Badge
                              variant={
                                selectedOrder.status === 'completed' ? 'default' :
                                selectedOrder.status === 'ready' ? 'default' :
                                selectedOrder.status === 'pending' ? 'secondary' : 'outline'
                              }
                              className="text-sm p-2"
                            >
                              {selectedOrder.status}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Last Updated</Label>
                            <p className="text-xs font-mono bg-gray-50 p-2 rounded">
                              {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString() : 'Not updated'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Delivery Information */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-orange-600" />
                          Delivery Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Delivery Method</Label>
                          <Badge variant="outline" className="text-sm p-2 block w-fit mt-1">
                            {selectedOrder.delivery_method === 'pickup' ? '📍 Store Pickup' : '🚚 Home Delivery'}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Pickup Location</Label>
                          <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                            📍 {selectedOrder.pickup_location_name || selectedOrder.pickup_location || 'N/A'}
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            <strong>Debug:</strong> pickup_location = {String(selectedOrder.pickup_location)}, pickup_location_name = {String(selectedOrder.pickup_location_name)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Delivery Address</Label>
                          <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
                            🏠 {selectedOrder.delivery_address || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">City</Label>
                          <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
                            {selectedOrder.delivery_city || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">State</Label>
                          <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
                            {selectedOrder.delivery_state || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Zip</Label>
                          <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
                            {selectedOrder.delivery_zip || 'N/A'}
                          </p>
                        </div>
                        {selectedOrder.customer_notes && (
                          <div>
                            <Label className="text-sm font-medium">Customer Notes</Label>
                            <p className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                              📝 {selectedOrder.customer_notes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Design Image Section */}
                  <Card className="mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-red-600" />
                        🖨️ Design Image for Printing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedOrder.design_image_url ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                            <img
                              src={selectedOrder.design_image_url}
                              alt="Customer design for printing"
                              className="max-w-full max-h-96 mx-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => window.open(selectedOrder.design_image_url, '_blank')}
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => window.open(selectedOrder.design_image_url, '_blank')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              🖨️ Open Full Size for Printing
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = selectedOrder.design_image_url!;
                                link.download = `order-${selectedOrder.id}-design.jpg`;
                                link.click();
                              }}
                            >
                              💾 Download Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg">
                          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No design image uploaded for this order</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <DialogFooter className="mt-6">
                    <div className="flex gap-2 w-full">
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(newStatus) => {
                          updateOrderStatus(selectedOrder.id, newStatus);
                          setSelectedOrder({...selectedOrder, status: newStatus});
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">⏳ Pending</SelectItem>
                          <SelectItem value="processing">⚙️ Processing</SelectItem>
                          <SelectItem value="ready">✅ Ready for Pickup</SelectItem>
                          <SelectItem value="shipped">🚚 Shipped</SelectItem>
                          <SelectItem value="delivered">📦 Delivered</SelectItem>
                          <SelectItem value="completed">✅ Completed</SelectItem>
                          <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                        Close
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Real customers from orders ({users.length} registered users + {Array.from(new Set(orders.map(o => o.contact_email))).length} order customers)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show registered users first */}
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">📧 {user.email}</p>
                          {user.full_name && (
                            <p className="text-sm text-muted-foreground">👤 {user.full_name}</p>
                          )}
                          {user.phone && (
                            <p className="text-sm text-muted-foreground">📱 {user.phone}</p>
                          )}
                          <Badge variant="outline" className="text-xs">Registered User</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Registered: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                            {user.last_sign_in_at && (
                              <p className="text-xs text-muted-foreground">
                                Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show customers from orders */}
                  {Array.from(new Set(orders.map(o => o.contact_email).filter(Boolean))).map((email, index) => {
                    const customerOrders = orders.filter(o => o.contact_email === email);
                    const latestOrder = customerOrders[0]; // Most recent order
                    
                    return (
                      <div key={`order-customer-${index}`} className="border rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <p className="font-medium">📧 {email}</p>
                            {latestOrder.contact_name && (
                              <p className="text-sm text-muted-foreground">👤 {latestOrder.contact_name}</p>
                            )}
                            {latestOrder.contact_phone && (
                              <p className="text-sm text-muted-foreground">📱 {latestOrder.contact_phone}</p>
                            )}
                            <Badge variant="outline" className="text-xs bg-green-100">Order Customer ({customerOrders.length} order{customerOrders.length > 1 ? 's' : ''})</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right space-y-1">
                              <p className="text-sm text-muted-foreground">
                                First Order: {new Date(customerOrders[customerOrders.length - 1].created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Latest Order: {new Date(latestOrder.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs font-medium text-green-600">
                                Total Spent: ${customerOrders.reduce((sum, o) => sum + (o.amount || 0), 0).toFixed(2)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Filter orders by this customer
                                setSearchTerm(email);
                                setActiveTab('orders');
                              }}
                            >
                              View Orders ({customerOrders.length})
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {users.length === 0 && orders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No users or customers found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Blog Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage blog posts and content ({blogPosts.length} posts)
                </p>
              </div>
              <Button onClick={() => {
                const newPost = {
                  id: '', // Will be set by database
                  title: '',
                  slug: '',
                  content: '',
                  excerpt: '',
                  featured_image_url: '',
                  published: false,
                  category: { id: '', name: '' }, // Will be handled by backend
                  created_at: '',
                  updated_at: ''
                };
                setEditingBlogPost(newPost);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{post.category.name}</Badge>
                            <Badge variant={post.published ? 'default' : 'secondary'}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBlogPost(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={post.published ? 'secondary' : 'default'}
                            onClick={() => updateBlogPost(post.id, { ...post, published: !post.published })}
                          >
                            {post.published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBlogPost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {blogPosts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No blog posts found. Create your first post!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phones Tab */}
          <TabsContent value="phones" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Phone Model Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage supported phone models and pricing ({phoneModels.length} models)
                </p>
              </div>
              <Button onClick={() => {
                const newPhone = {
                  name: 'New Model',
                  brand: 'New Brand',
                  base_price: 20.00,
                  is_active: true
                };
                createPhoneModel(newPhone);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Model
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {phoneModels.map((phone) => (
                    <div key={phone.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{phone.brand} {phone.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Base Price: ${phone.base_price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={phone.is_active ? 'default' : 'secondary'}>
                            {phone.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPhoneModel(phone)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={phone.is_active ? 'secondary' : 'default'}
                            onClick={() => updatePhoneModel(phone.id, { ...phone, is_active: !phone.is_active })}
                          >
                            {phone.is_active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePhoneModel(phone.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {phoneModels.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No phone models found. Add your first model!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Store Location Management</CardTitle>
                    <CardDescription>
                      Manage physical store locations ({storeLocations.length} stores)
                    </CardDescription>
                  </div>
                  <Button onClick={() => setEditingStore({ 
                    id: '', 
                    name: '', 
                    address: '', 
                    phone: '', 
                    email: '', 
                    hours: '', 
                    is_active: true, 
                    created_at: '' 
                  })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Store
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storeLocations.map((store) => (
                    <div key={store.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-muted-foreground">{store.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {store.hours}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {store.phone} • {store.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={store.is_active ? 'default' : 'secondary'}>
                            {store.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingStore(store)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={store.is_active ? 'secondary' : 'default'}
                            onClick={() => updateStoreLocation(store.id, { ...store, is_active: !store.is_active })}
                          >
                            {store.is_active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteStoreLocation(store.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {storeLocations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No store locations found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab - Location Analytics & CSV Export */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">📍 Location & Reports Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Order distribution by pickup location and delivery analytics with CSV export
                </p>
              </div>
              <Button onClick={handleExportClick} className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
            </div>

            {/* Location Selector */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Location Analytics</CardTitle>
                <CardDescription>
                  Select a location to view detailed order analytics and export data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storeLocations.map((location) => {
                    const locationOrders = orders.filter(order => 
                      order.pickup_location_name === location.name || 
                      order.pickup_location === location.id
                    );
                    const locationRevenue = locationOrders.reduce((sum, order) => 
                      sum + (order.total_amount || order.amount || 0), 0
                    );

                    return (
                      <div key={location.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">{location.name}</h4>
                            <Badge variant={location.is_active ? "default" : "secondary"}>
                              {location.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            📍 {location.address}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {locationOrders.length}
                              </div>
                              <div className="text-xs text-muted-foreground">Total Orders</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                ${locationRevenue.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">Revenue</div>
                            </div>
                          </div>

                          {/* Order Status Distribution */}
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Order Status</div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div className="flex justify-between">
                                <span>🔄 Processing:</span>
                                <span className="font-medium text-blue-600">
                                  {locationOrders.filter(o => o.status === 'processing').length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>✅ Ready:</span>
                                <span className="font-medium text-green-600">
                                  {locationOrders.filter(o => o.status === 'ready').length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>📦 Completed:</span>
                                <span className="font-medium text-purple-600">
                                  {locationOrders.filter(o => o.status === 'completed').length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>⏳ Pending:</span>
                                <span className="font-medium text-yellow-600">
                                  {locationOrders.filter(o => ['pending', 'confirmed'].includes(o.status || 'pending')).length}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Export Button */}
                          <div className="pt-2 border-t">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                if (locationOrders.length === 0) {
                                  toast.error('No orders found for this location');
                                  return;
                                }
                                exportLocationOrdersCSV(location, locationOrders);
                              }}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Export {locationOrders.length} Orders
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {storeLocations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No store locations found. Add store locations in the Stores tab to view analytics.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Overall Distribution Summary</CardTitle>
                <CardDescription>
                  Order and revenue distribution across all pickup locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storeLocations.length > 0 && (
                    <div className="space-y-3">
                      {storeLocations.map((location) => {
                        const locationOrders = orders.filter(order => 
                          order.pickup_location_name === location.name || 
                          order.pickup_location === location.id
                        );
                        const locationRevenue = locationOrders.reduce((sum, order) => 
                          sum + (order.total_amount || order.amount || 0), 0
                        );
                        const orderPercentage = orders.length > 0 ? (locationOrders.length / orders.length * 100).toFixed(1) : 0;
                        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || order.amount || 0), 0);
                        const revenuePercentage = totalRevenue > 0 ? (locationRevenue / totalRevenue * 100).toFixed(1) : 0;

                        return (
                          <div key={location.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <div>
                                <div className="font-medium">{location.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {locationOrders.length} orders • ${locationRevenue.toFixed(2)} revenue
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="text-sm font-medium">{orderPercentage}% of orders</div>
                                <div className="text-xs text-muted-foreground">{revenuePercentage}% of revenue</div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  if (locationOrders.length === 0) {
                                    toast.error('No orders found for this location');
                                    return;
                                  }
                                  exportLocationOrdersCSV(location, locationOrders);
                                }}
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab - Order-Focused */}
          <TabsContent value="database" className="space-y-6">
            <DatabaseManager />
            <DatabaseDebugger />
          </TabsContent>

          {/* Contact Messages Section */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>
                  Manage customer contact messages and inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactMessages.map((message) => (
                          <tr key={message.id}>
                            <td className="border border-gray-300 px-4 py-2">{message.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{message.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{message.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{message.phone || 'N/A'}</td>
                            <td className="border border-gray-300 px-4 py-2">{message.subject}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              {new Date(message.created_at).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                message.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                message.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {message.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingContactMessage(message)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteContactMessage(message.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Section */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>FAQ Management</CardTitle>
                    <CardDescription>
                      Manage frequently asked questions
                    </CardDescription>
                  </div>
                  <Button onClick={() => setEditingFaq({ id: '', question: '', answer: '', category: '', is_active: true, display_order: 0, created_at: '', updated_at: '' })}>
                    Add New FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Question</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Order</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faqs.map((faq) => (
                          <tr key={faq.id}>
                            <td className="border border-gray-300 px-4 py-2">{faq.id}</td>
                            <td className="border border-gray-300 px-4 py-2 max-w-xs truncate">{faq.question}</td>
                            <td className="border border-gray-300 px-4 py-2">{faq.category}</td>
                            <td className="border border-gray-300 px-4 py-2">{faq.display_order}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                faq.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {faq.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingFaq(faq)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteFaq(faq.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Section */}
          <TabsContent value="newsletter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>
                  Manage newsletter subscriptions and email list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Subscribed</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterSubscribers.map((subscriber) => (
                          <tr key={subscriber.id}>
                            <td className="border border-gray-300 px-4 py-2">{subscriber.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{subscriber.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{subscriber.name || 'N/A'}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              {new Date(subscriber.subscribed_at).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                subscriber.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {subscriber.is_active ? 'Active' : 'Unsubscribed'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateNewsletterSubscriber(subscriber.id, { is_active: !subscriber.is_active })}
                                >
                                  {subscriber.is_active ? 'Unsubscribe' : 'Reactivate'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteNewsletterSubscriber(subscriber.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Testimonials Management</CardTitle>
                    <CardDescription>
                      Manage customer testimonials and reviews
                    </CardDescription>
                  </div>
                  <Button onClick={() => setEditingTestimonial({ id: '', name: '', email: '', content: '', rating: 5, is_featured: false, is_approved: false, location: '', created_at: '', updated_at: '' })}>
                    Add New Testimonial
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Content</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map((testimonial) => (
                          <tr key={testimonial.id}>
                            <td className="border border-gray-300 px-4 py-2">{testimonial.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{testimonial.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{testimonial.email}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 max-w-xs truncate">{testimonial.content}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex flex-col gap-1">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  testimonial.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {testimonial.is_approved ? 'Approved' : 'Pending'}
                                </span>
                                {testimonial.is_featured && (
                                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingTestimonial(testimonial)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteTestimonial(testimonial.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Blog Post Edit/Create Dialog */}
      <Dialog open={editingBlogPost !== null} onOpenChange={(open) => !open && setEditingBlogPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBlogPost?.id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {editingBlogPost?.id ? 'Update blog post content and settings' : 'Create a new blog post for your website'}
            </DialogDescription>
          </DialogHeader>
          
          {editingBlogPost && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="blog-title">Post Title</Label>
                <Input
                  id="blog-title"
                  value={editingBlogPost.title}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
                  placeholder="Enter blog post title"
                />
              </div>
              
              <div>
                <Label htmlFor="blog-slug">URL Slug</Label>
                <Input
                  id="blog-slug"
                  value={editingBlogPost.slug}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                />
              </div>
              
              <div>
                <Label htmlFor="blog-excerpt">Excerpt</Label>
                <Textarea
                  id="blog-excerpt"
                  value={editingBlogPost.excerpt}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })}
                  placeholder="Brief description of the blog post"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="blog-content">Content</Label>
                <Textarea
                  id="blog-content"
                  value={editingBlogPost.content}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  rows={8}
                />
              </div>
              
              <div>
                <Label htmlFor="blog-image">Featured Image URL</Label>
                <Input
                  id="blog-image"
                  value={editingBlogPost.featured_image_url || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, featured_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="blog-published"
                  checked={editingBlogPost.published}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, published: e.target.checked })}
                />
                <Label htmlFor="blog-published">Publish immediately</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBlogPost(null)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (editingBlogPost) {
                if (editingBlogPost.id) {
                  await updateBlogPost(editingBlogPost.id, editingBlogPost);
                } else {
                  await createBlogPost(editingBlogPost);
                }
                setEditingBlogPost(null);
              }
            }}>
              {editingBlogPost?.id ? 'Update' : 'Create'} Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Store Location Edit/Create Dialog */}
      <Dialog open={editingStore !== null} onOpenChange={(open) => !open && setEditingStore(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingStore?.id ? 'Edit Store Location' : 'Add New Store Location'}
            </DialogTitle>
            <DialogDescription>
              {editingStore?.id ? 'Update store location details' : 'Create a new store location for customer pickup'}
            </DialogDescription>
          </DialogHeader>
          
          {editingStore && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={editingStore.name}
                  onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                  placeholder="e.g., Downtown HEB"
                />
              </div>
              
              <div>
                <Label htmlFor="store-address">Full Address</Label>
                <Textarea
                  id="store-address"
                  value={editingStore.address}
                  onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                  placeholder="123 Main St., City, State 12345"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="store-phone">Phone Number</Label>
                <Input
                  id="store-phone"
                  value={editingStore.phone}
                  onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="store-email">Email</Label>
                <Input
                  id="store-email"
                  type="email"
                  value={editingStore.email}
                  onChange={(e) => setEditingStore({ ...editingStore, email: e.target.value })}
                  placeholder="store@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="store-hours">Business Hours</Label>
                <Input
                  id="store-hours"
                  value={editingStore.hours}
                  onChange={(e) => setEditingStore({ ...editingStore, hours: e.target.value })}
                  placeholder="Mon-Sun: 9am-9pm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="store-active"
                  checked={editingStore.is_active}
                  onChange={(e) => setEditingStore({ ...editingStore, is_active: e.target.checked })}
                />
                <Label htmlFor="store-active">Active (available for customer pickup)</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStore(null)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (editingStore) {
                if (editingStore.id) {
                  await updateStoreLocation(editingStore.id, editingStore);
                } else {
                  await createStoreLocation(editingStore);
                }
                setEditingStore(null);
              }
            }}>
              {editingStore?.id ? 'Update' : 'Create'} Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Message View Dialog */}
      <Dialog open={editingContactMessage !== null} onOpenChange={(open) => !open && setEditingContactMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>View and manage contact message</DialogDescription>
          </DialogHeader>
          
          {editingContactMessage && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editingContactMessage.name}
                    onChange={(e) => setEditingContactMessage({ ...editingContactMessage, name: e.target.value })}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={editingContactMessage.email}
                    onChange={(e) => setEditingContactMessage({ ...editingContactMessage, email: e.target.value })}
                    disabled
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={editingContactMessage.phone || ''}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={editingContactMessage.subject}
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md min-h-32"
                  value={editingContactMessage.message}
                  disabled
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={editingContactMessage.status}
                  onChange={(e) => setEditingContactMessage({ 
                    ...editingContactMessage, 
                    status: e.target.value as 'pending' | 'in_progress' | 'resolved'
                  })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingContactMessage(null)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (editingContactMessage) {
                await updateContactMessage(editingContactMessage.id, {
                  status: editingContactMessage.status
                });
                setEditingContactMessage(null);
              }
            }}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Edit/Create Dialog */}
      <Dialog open={editingFaq !== null} onOpenChange={(open) => !open && setEditingFaq(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFaq?.id ? 'Edit FAQ' : 'Create New FAQ'}
            </DialogTitle>
            <DialogDescription>
              {editingFaq?.id ? 'Update FAQ content and settings' : 'Create a new frequently asked question'}
            </DialogDescription>
          </DialogHeader>
          
          {editingFaq && (
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="Enter the question"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Answer</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md min-h-32"
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Enter the answer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    placeholder="e.g., General, Technical, Billing"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Display Order</label>
                  <Input
                    type="number"
                    value={editingFaq.display_order}
                    onChange={(e) => setEditingFaq({ ...editingFaq, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="faq-active"
                  checked={editingFaq.is_active}
                  onChange={(e) => setEditingFaq({ ...editingFaq, is_active: e.target.checked })}
                />
                <label htmlFor="faq-active" className="text-sm font-medium">Active</label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFaq(null)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (editingFaq) {
                if (editingFaq.id) {
                  await updateFaq(editingFaq.id, editingFaq);
                } else {
                  await createFaq(editingFaq);
                }
              }
            }}>
              {editingFaq?.id ? 'Update' : 'Create'} FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Edit/Create Dialog */}
      <Dialog open={editingTestimonial !== null} onOpenChange={(open) => !open && setEditingTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial?.id ? 'Edit Testimonial' : 'Create New Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial?.id ? 'Update testimonial content and settings' : 'Create a new customer testimonial'}
            </DialogDescription>
          </DialogHeader>
          
          {editingTestimonial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={editingTestimonial.email}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, email: e.target.value })}
                    placeholder="Customer email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Location (Optional)</label>
                  <Input
                    value={editingTestimonial.location || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={editingTestimonial.rating}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Testimonial Content</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md min-h-32"
                  value={editingTestimonial.content}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  placeholder="Enter testimonial content"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="testimonial-approved"
                    checked={editingTestimonial.is_approved}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, is_approved: e.target.checked })}
                  />
                  <label htmlFor="testimonial-approved" className="text-sm font-medium">Approved</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="testimonial-featured"
                    checked={editingTestimonial.is_featured}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, is_featured: e.target.checked })}
                  />
                  <label htmlFor="testimonial-featured" className="text-sm font-medium">Featured</label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTestimonial(null)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (editingTestimonial) {
                if (editingTestimonial.id) {
                  await updateTestimonial(editingTestimonial.id, editingTestimonial);
                } else {
                  await createTestimonial(editingTestimonial);
                }
              }
            }}>
              {editingTestimonial?.id ? 'Update' : 'Create'} Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Location Selection Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={(open) => setExportDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Orders Report</DialogTitle>
            <DialogDescription>
              Select which location's orders you want to export to CSV
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Location:</label>
              <Select 
                value={selectedExportLocation} 
                onValueChange={setSelectedExportLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose location to export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    📊 All Locations Summary (Location Analytics)
                  </SelectItem>
                  {storeLocations.map((location) => {
                    const locationOrders = orders.filter(order => 
                      order.pickup_location_name === location.name || 
                      order.pickup_location === location.id
                    );
                    return (
                      <SelectItem key={location.id} value={location.id}>
                        🏪 {location.name} ({locationOrders.length} orders)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              {selectedExportLocation === 'all' ? (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>All Locations Summary:</strong> Exports analytics data showing order distribution, revenue breakdown, and performance metrics for all store locations.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>Individual Location:</strong> Exports detailed order data including customer information, phone models, payment status, and order details for the selected location.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setExportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={executeExport}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Admin Component that handles authentication
export default function Admin() {
  const { isAuthenticated } = useAdmin();
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setRefreshDashboard(prev => prev + 1)} />;
  }

  return <AdminDashboard key={refreshDashboard} />;
}
