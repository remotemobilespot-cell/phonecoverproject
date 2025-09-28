import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Lock, Phone, Package, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AuthDashboard() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
        fetchOrders(data.user.email);
      }
    };
    fetchSession();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
        console.error('Error fetching profile:', error);
      }
      
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrders = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('contact_email', email)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }
      
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
        fetchOrders(data.user.email);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
            phone: registerData.phone,
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success('Account created! Please check your email to verify.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth`,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOrders([]);
    toast.success('Logged out successfully');
  };

  // Show login/register form if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Welcome to PrintPhoneCover</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-email"
                            type="email"
                            className="pl-10"
                            placeholder="your@email.com"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type="password"
                            className="pl-10"
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                    <Separator className="my-4" />
                    <Button type="button" className="w-full" variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                      {isLoading ? 'Redirecting...' : 'Sign in with Google'}
                    </Button>
                    <Button type="button" className="w-full mt-2" variant="secondary" onClick={() => navigate('/')}> 
                      Continue as Guest
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-name"
                            type="text"
                            className="pl-10"
                            placeholder="John Doe"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            className="pl-10"
                            placeholder="your@email.com"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="register-phone">Phone (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-phone"
                            type="tel"
                            className="pl-10"
                            placeholder="(555) 123-4567"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type="password"
                            className="pl-10"
                            placeholder="••••••••"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirm-password"
                            type="password"
                            className="pl-10"
                            placeholder="••••••••"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                    <Separator className="my-4" />
                    <Button type="button" className="w-full" variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                      {isLoading ? 'Redirecting...' : 'Sign up with Google'}
                    </Button>
                    <Button type="button" className="w-full mt-2" variant="secondary" onClick={() => navigate('/')}> 
                      Continue as Guest
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Dashboard view for logged-in users
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="designs">My Designs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome to PrintPhoneCover</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h2 className="text-2xl font-bold mb-4">
                      Hello, {profile?.full_name || profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0]}!
                    </h2>
                    <p className="text-gray-600 mb-6">Ready to create your next amazing phone case design?</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Button 
                        className="h-20 flex-col"
                        onClick={() => navigate('/print-now')}
                      >
                        <Package className="h-6 w-6 mb-2" />
                        Start New Design
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col"
                        onClick={() => setActiveTab('designs')}
                      >
                        <User className="h-6 w-6 mb-2" />
                        View My Designs
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col"
                        onClick={() => setActiveTab('orders')}
                      >
                        <Mail className="h-6 w-6 mb-2" />
                        Track Orders
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Recent Activity</h3>
                      {orders.length > 0 ? (
                        <div className="space-y-3">
                          {orders.slice(0, 2).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-gray-600" />
                                <div>
                                  <p className="font-medium">Order #{order.id.slice(0,8)}</p>
                                  <p className="text-sm text-gray-600">${order.total_amount} • {order.status}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                          No orders yet. Start designing your first phone case!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">
                        {profile?.full_name || profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{profile?.email || user?.email}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-1" />
                      Log Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="designs">
            <Card>
              <CardHeader>
                <CardTitle>My Designs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No designs yet</h3>
                  <p className="text-gray-500 mb-6">Start creating your first phone case design!</p>
                  <Button onClick={() => navigate('/print-now')}>
                    Create New Design
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Order #{order.id.slice(0,8)}</h4>
                            <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total_amount}</p>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Phone: {order.phone_model_name || order.phone_model_id}</p>
                          <p>Fulfillment: {order.delivery_method || order.fulfillment_method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Your order history will appear here</p>
                    <Button onClick={() => navigate('/print-now')}>
                      Start Your First Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
