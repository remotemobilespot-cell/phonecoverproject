import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Package, 
  CreditCard, 
  MapPin, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Eye, 
  Truck,
  Bell,
  Palette,
  History,
  Mail,
  Phone,
  Edit
} from 'lucide-react';

interface Order {
  id: string;
  phone_model_id: string;
  design_image: string;
  amount: number;
  status: string;
  created_at: string;
  fulfillment_method: string;
  store_location_id?: string;
}

interface UserProfile {
  email: string;
  name: string;
  phone?: string;
  default_address?: string;
  payment_methods?: any[];
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user data from backend
      const res = await fetch('/api/user', {
        credentials: 'include',
      });
      if (!res.ok) {
        navigate('/auth');
        return;
      }
      const userData = await res.json();
      setUser(userData);
      setUserProfile({
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        default_address: userData.default_address,
        payment_methods: userData.payment_methods,
      });

      // Fetch orders from backend
      const ordersRes = await fetch('/api/orders', {
        credentials: 'include',
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData || []);
      }

      // Fetch saved designs from backend
      const designsRes = await fetch('/api/saved-designs', {
        credentials: 'include',
      });
      if (designsRes.ok) {
        const designsData = await designsRes.json();
        setSavedDesigns(designsData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    // Call backend logout endpoint if available
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User, active: true },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'designs', label: 'Saved Designs', icon: Palette },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'support', label: 'Support Tickets', icon: HelpCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold text-blue-600">
                PrintPhoneCover
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Hello, {userProfile?.name || user?.email}!
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/help">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                        {item.id === 'notifications' && (
                          <Badge variant="secondary" className="ml-auto">3</Badge>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Message */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome back, {userProfile?.name || 'User'}!
                    </h2>
                    <p className="text-gray-600">
                      Ready to create your next amazing phone case design?
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button asChild className="h-20 flex-col">
                        <Link to="/print-now">
                          <Plus className="h-6 w-6 mb-2" />
                          Start a New Design
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('designs')}>
                        <Eye className="h-6 w-6 mb-2" />
                        View My Saved Designs
                      </Button>
                      <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('orders')}>
                        <Truck className="h-6 w-6 mb-2" />
                        Track a Package
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                      View All Orders
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                ${order.amount}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No orders yet. Start designing your first phone case!
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Account Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span>Email:</span>
                        </div>
                        <span className="font-medium">{userProfile?.email}</span>
                      </div>
                      
                      {userProfile?.phone && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-600" />
                            <span>Phone:</span>
                          </div>
                          <span className="font-medium">{userProfile.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span>Default Address:</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('addresses')}>
                          <Edit className="h-4 w-4 mr-1" />
                          {userProfile?.default_address ? 'Edit' : 'Add Address'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-gray-600" />
                          <span>Payment Methods:</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('payments')}>
                          <Edit className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">Order #{order.id}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Amount:</span>
                              <p className="font-medium">${order.amount}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Method:</span>
                              <p className="font-medium capitalize">{order.fulfillment_method}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Phone Model:</span>
                              <p className="font-medium">{order.phone_model_id}</p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 py-8">No orders found.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'designs' && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Designs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 py-8">
                    Your saved designs will appear here. Start creating to build your collection!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Add other tab content as needed */}
            {activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'designs' && (
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{activeTab.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 py-8">
                    This section is coming soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}