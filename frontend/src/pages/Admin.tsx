import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Users, Package, BarChart3, Settings, 
  Mail, Database, Server, Download, Trash2,
  RefreshCw, Eye, Edit, CheckCircle, XCircle,
  DollarSign, ShoppingCart, MapPin, Clock, EyeOff, AlertCircle,
  FileText, Image, Upload, Globe, Search, Filter,
  Plus, Minus, Save, Copy, ExternalLink, Bell,
  Activity, Zap, HardDrive, Cpu, MemoryStick,
  Wifi, Lock, Unlock, Key, UserPlus, UserMinus,
  Calendar, TrendingUp, TrendingDown, PieChart,
  BarChart, LineChart, Target, Award, Star,
  MessageSquare, Phone, AtSign, CreditCard,
  Truck, Home, Building, Factory, Wrench
} from 'lucide-react';

// Enhanced mock admin data with more comprehensive information
const mockStats = {
  totalOrders: 247,
  pendingOrders: 18,
  processingOrders: 23,
  completedOrders: 198,
  cancelledOrders: 8,
  totalRevenue: '$12,847.50',
  monthlyRevenue: '$3,247.89',
  dailyRevenue: '$142.33',
  activeUsers: 1156,
  totalUsers: 2341,
  newUsersToday: 12,
  conversionRate: '4.7%',
  averageOrderValue: '$31.24',
  totalProducts: 45,
  lowStockProducts: 7,
  totalCategories: 8,
  totalLocations: 23,
  activeLocations: 21,
  systemUptime: '99.8%',
  apiResponseTime: '142ms',
  databaseConnections: 15,
  storageUsed: '2.3GB',
  bandwidthUsed: '45.2GB',
  emailsSent: 1234,
  emailsDelivered: 1198,
  bounceRate: '2.9%',
  supportTickets: 5,
  pendingTickets: 2
};

const mockRecentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: 'iPhone 15 Pro',
    design: 'Custom Photo',
    amount: '$34.99',
    status: 'pending',
    priority: 'high',
    location: 'New York Mall',
    createdAt: '2025-09-23T10:00:00Z',
    estimatedDelivery: '2025-09-25T16:00:00Z'
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Smith',
    email: 'sarah@example.com',
    phone: 'Samsung Galaxy S24',
    design: 'Gradient Blue',
    amount: '$29.99',
    status: 'completed',
    priority: 'normal',
    location: 'Los Angeles Center',
    createdAt: '2025-09-23T09:30:00Z',
    completedAt: '2025-09-23T14:15:00Z'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Chen',
    email: 'mike@example.com',
    phone: 'iPhone 14',
    design: 'Marble White',
    amount: '$27.99',
    status: 'processing',
    priority: 'urgent',
    location: 'Chicago Downtown',
    createdAt: '2025-09-23T09:15:00Z',
    estimatedDelivery: '2025-09-24T12:00:00Z'
  },
  {
    id: 'ORD-004',
    customer: 'Emily Johnson',
    email: 'emily@example.com',
    phone: 'iPhone 15',
    design: 'Sunset Orange',
    amount: '$32.99',
    status: 'pending',
    priority: 'normal',
    location: 'Miami Beach',
    createdAt: '2025-09-23T08:45:00Z',
    estimatedDelivery: '2025-09-25T10:00:00Z'
  },
  {
    id: 'ORD-005',
    customer: 'David Wilson',
    email: 'david@example.com',
    phone: 'Samsung Galaxy S23',
    design: 'Abstract Art',
    amount: '$28.99',
    status: 'cancelled',
    priority: 'low',
    location: 'Seattle Center',
    createdAt: '2025-09-22T16:20:00Z',
    cancelledAt: '2025-09-23T09:00:00Z'
  }
];

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    lastLogin: '2025-09-23T08:30:00Z',
    ordersCount: 5,
    totalSpent: '$149.95',
    joinDate: '2025-08-15T10:00:00Z',
    location: 'New York, NY'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    role: 'customer',
    status: 'active',
    lastLogin: '2025-09-23T07:45:00Z',
    ordersCount: 8,
    totalSpent: '$239.92',
    joinDate: '2025-07-22T14:30:00Z',
    location: 'Los Angeles, CA'
  }
];

const mockProducts = [
  {
    id: 'PROD-001',
    name: 'iPhone 15 Pro Case',
    category: 'Phone Cases',
    price: '$34.99',
    stock: 150,
    minStock: 20,
    sold: 89,
    status: 'active',
    rating: 4.8,
    reviews: 23
  },
  {
    id: 'PROD-002',
    name: 'Samsung Galaxy S24 Case',
    category: 'Phone Cases',
    price: '$29.99',
    stock: 8,
    minStock: 15,
    sold: 67,
    status: 'low_stock',
    rating: 4.6,
    reviews: 18
  }
];

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    console.log('Login attempt:', { username, password });
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      console.log('Login result:', success);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      } else {
        console.log('Login successful, should redirect to dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access PrintPhoneCase admin dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
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
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 PrintPhoneCase. All rights reserved.</p>
          <p className="mt-1">Secure admin access protected by JWT authentication</p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { admin, logout } = useAdmin();

  const handleAction = async (action: string, item?: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Admin action: ${action}`, item);
    alert(`Admin Action: ${action} ${item ? 'for ' + (item.customer || item.id || item.name) : ''}`);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'low_stock': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = mockRecentOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) {
      alert('Please select orders first');
      return;
    }
    handleAction(`bulk-${action}`, { orderIds: selectedOrders });
    setSelectedOrders([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">PrintPhoneCase Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Admin Access Active
              </Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                <Settings className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 py-4 overflow-x-auto">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'orders', name: 'Orders', icon: ShoppingCart },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'locations', name: 'Locations', icon: MapPin },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'marketing', name: 'Marketing', icon: Bell },
              { id: 'content', name: 'Content', icon: FileText },
              { id: 'settings', name: 'Settings', icon: Settings },
              { id: 'system', name: 'System', icon: Server }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders}</p>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalRevenue}</p>
                      <p className="text-xs text-green-600">+8.5% from last month</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.pendingOrders}</p>
                      <p className="text-xs text-yellow-600">Needs attention</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.activeUsers}</p>
                      <p className="text-xs text-blue-600">+{mockStats.newUsersToday} today</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Conversion</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.conversionRate}</p>
                      <p className="text-xs text-green-600">+0.3% this week</p>
                    </div>
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Avg Order</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.averageOrderValue}</p>
                      <p className="text-xs text-gray-600">Per transaction</p>
                    </div>
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-pink-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleAction('new-order')}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAction('add-user')}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAction('add-product')}>
                    <Package className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAction('send-newsletter')}>
                    <Mail className="w-4 h-4 mr-2" />
                    Newsletter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAction('system-backup')}>
                    <Download className="w-4 h-4 mr-2" />
                    Backup
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAction('view-analytics')}>
                    <BarChart className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders with detailed information</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleAction('export-orders')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-500">{order.email}</p>
                          <p className="text-xs text-gray-400">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.phone}</p>
                          <p className="text-sm text-gray-500">{order.design}</p>
                          <p className="text-xs text-gray-400">{order.location}</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{order.amount}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getPriorityColor(order.priority)} variant="outline">
                            {order.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction('view-order', order)}
                          disabled={isLoading}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction('edit-order', order)}
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction('print-order', order)}
                          disabled={isLoading}
                        >
                          <Truck className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Uptime</span>
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800 mr-2">
                        {mockStats.systemUptime}
                      </Badge>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response Time</span>
                    <div className="flex items-center">
                      <Badge className="bg-blue-100 text-blue-800 mr-2">
                        {mockStats.apiResponseTime}
                      </Badge>
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Connections</span>
                    <div className="flex items-center">
                      <Badge className="bg-purple-100 text-purple-800 mr-2">
                        {mockStats.databaseConnections}
                      </Badge>
                      <Database className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Used</span>
                    <div className="flex items-center">
                      <Badge className="bg-orange-100 text-orange-800 mr-2">
                        {mockStats.storageUsed}
                      </Badge>
                      <HardDrive className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Communication Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emails Sent Today</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {mockStats.emailsSent}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Delivery Rate</span>
                    <Badge className="bg-green-100 text-green-800">
                      {((mockStats.emailsDelivered / mockStats.emailsSent) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bounce Rate</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {mockStats.bounceRate}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Support Tickets</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-100 text-red-800">
                        {mockStats.pendingTickets} pending
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800">
                        {mockStats.supportTickets} total
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Header with Search and Filters */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>Manage all customer orders and their status</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleAction('new-order')}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Order
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        {selectedOrders.length} orders selected
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('update-status')}>
                          <Edit className="w-4 h-4 mr-1" />
                          Update Status
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('send-notification')}>
                          <Bell className="w-4 h-4 mr-1" />
                          Notify
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Table */}
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrders([...selectedOrders, order.id]);
                              } else {
                                setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                              <p className="font-semibold text-gray-900">{order.customer}</p>
                              <p className="text-sm text-gray-500">{order.email}</p>
                              <p className="text-xs text-blue-600">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{order.phone}</p>
                              <p className="text-sm text-gray-500">{order.design}</p>
                              <p className="text-xs text-gray-400">{order.location}</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-green-600">{order.amount}</p>
                              <p className="text-xs text-gray-500">
                                Ordered: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              {order.estimatedDelivery && (
                                <p className="text-xs text-blue-500">
                                  Est: {new Date(order.estimatedDelivery).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <Badge className={getPriorityColor(order.priority)} variant="outline">
                                {order.priority}
                              </Badge>
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" onClick={() => handleAction('view-order', order)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAction('edit-order', order)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAction('print-receipt', order)}>
                                <FileText className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAction('track-order', order)}>
                                <Truck className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAction('contact-customer', order)}>
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  System Administration
                </CardTitle>
                <CardDescription>Complete system control and management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Database Management */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Database Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction('backup-database')}
                      disabled={isLoading}
                    >
                      Backup Database
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction('view-tables')}
                      disabled={isLoading}
                    >
                      View Tables
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction('database-stats')}
                      disabled={isLoading}
                    >
                      Database Stats
                    </Button>
                  </div>
                </div>

                {/* Email Management */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email System
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction('test-email')}
                      disabled={isLoading}
                    >
                      Test Email
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction('email-logs')}
                      disabled={isLoading}
                    >
                      Email Logs
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction('email-templates')}
                      disabled={isLoading}
                    >
                      Email Templates
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-medium mb-3 text-red-800 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Danger Zone
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleAction('clear-all-orders')}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Orders
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleAction('reset-database')}
                      disabled={isLoading}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Database
                    </Button>
                  </div>
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ These actions are irreversible. Use with extreme caution.
                  </p>
                </div>

                {/* System Status */}
                <div className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-medium mb-3 text-green-800">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Backend API</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Email Service</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Limited
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Management */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage customer accounts and user data</CardDescription>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => handleAction('export-users')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Users
                    </Button>
                    <Button onClick={() => handleAction('add-user')}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">ID: {user.id}</p>
                        </div>
                        <div>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          <p className="text-sm text-gray-500 mt-1">{user.role}</p>
                          <p className="text-xs text-gray-400">{user.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.ordersCount} orders</p>
                          <p className="text-sm text-green-600">{user.totalSpent} spent</p>
                          <p className="text-xs text-gray-400">
                            Joined: {new Date(user.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleAction('view-user', user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction('edit-user', user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction('user-orders', user)}>
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction('contact-user', user)}>
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Products Management */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage phone cases and inventory</CardDescription>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => handleAction('bulk-update-inventory')}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Update Stock
                    </Button>
                    <Button onClick={() => handleAction('add-product')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <p className="text-xs text-gray-400">{product.id}</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">{product.price}</p>
                          <p className="text-sm text-gray-500">{product.sold} sold</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Stock: {product.stock}</p>
                          <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm">{product.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{product.reviews} reviews</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleAction('view-product', product)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction('edit-product', product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction('product-analytics', product)}>
                            <BarChart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location Management
                </CardTitle>
                <CardDescription>Manage printing locations and machines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24" onClick={() => handleAction('view-all-locations')}>
                    <div className="text-center">
                      <Building className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">View All Locations</p>
                      <p className="text-xs text-gray-500">{mockStats.totalLocations} total</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-24" onClick={() => handleAction('add-location')}>
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">Add New Location</p>
                      <p className="text-xs text-gray-500">Expand network</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-24" onClick={() => handleAction('location-analytics')}>
                    <div className="text-center">
                      <BarChart className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">Location Analytics</p>
                      <p className="text-xs text-gray-500">Performance data</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Advanced Analytics
                </CardTitle>
                <CardDescription>Detailed business intelligence and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20" onClick={() => handleAction('revenue-analytics')}>
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Revenue Analysis</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20" onClick={() => handleAction('customer-analytics')}>
                    <div className="text-center">
                      <Users className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Customer Insights</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20" onClick={() => handleAction('product-analytics')}>
                    <div className="text-center">
                      <Package className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Product Performance</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20" onClick={() => handleAction('location-performance')}>
                    <div className="text-center">
                      <MapPin className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Location Metrics</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Marketing & Communications
                </CardTitle>
                <CardDescription>Manage campaigns, newsletters, and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24" onClick={() => handleAction('send-newsletter')}>
                    <div className="text-center">
                      <Mail className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">Send Newsletter</p>
                      <p className="text-xs text-gray-500">Email campaigns</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-24" onClick={() => handleAction('push-notifications')}>
                    <div className="text-center">
                      <Bell className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">Push Notifications</p>
                      <p className="text-xs text-gray-500">Mobile alerts</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-24" onClick={() => handleAction('sms-campaigns')}>
                    <div className="text-center">
                      <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">SMS Campaigns</p>
                      <p className="text-xs text-gray-500">Text messaging</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Content Management
                </CardTitle>
                <CardDescription>Manage website content, blog posts, and media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20" onClick={() => handleAction('manage-blog')}>
                    <div className="text-center">
                      <FileText className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Blog Posts</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20" onClick={() => handleAction('manage-media')}>
                    <div className="text-center">
                      <Image className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Media Library</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20" onClick={() => handleAction('manage-pages')}>
                    <div className="text-center">
                      <Globe className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Website Pages</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20" onClick={() => handleAction('design-templates')}>
                    <div className="text-center">
                      <Package className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Design Templates</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure application settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">General Settings</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('site-settings')}>
                        <Globe className="w-4 h-4 mr-2" />
                        Site Configuration
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('payment-settings')}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payment Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('email-settings')}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Configuration
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Security Settings</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('admin-users')}>
                        <Users className="w-4 h-4 mr-2" />
                        Admin Users
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('api-keys')}>
                        <Key className="w-4 h-4 mr-2" />
                        API Keys
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('security-logs')}>
                        <Shield className="w-4 h-4 mr-2" />
                        Security Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  System Administration
                </CardTitle>
                <CardDescription>Complete system control and management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Database Management */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Database Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" onClick={() => handleAction('backup-database')} disabled={isLoading}>
                      Backup Database
                    </Button>
                    <Button variant="outline" onClick={() => handleAction('view-tables')} disabled={isLoading}>
                      View Tables
                    </Button>
                    <Button variant="outline" onClick={() => handleAction('database-stats')} disabled={isLoading}>
                      Database Stats
                    </Button>
                  </div>
                </div>

                {/* Email Management */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email System
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" onClick={() => handleAction('test-email')} disabled={isLoading}>
                      Test Email
                    </Button>
                    <Button variant="outline" onClick={() => handleAction('email-logs')} disabled={isLoading}>
                      Email Logs
                    </Button>
                    <Button variant="outline" onClick={() => handleAction('email-templates')} disabled={isLoading}>
                      Email Templates
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-medium mb-3 text-red-800 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Danger Zone
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="destructive" onClick={() => handleAction('clear-all-orders')} disabled={isLoading}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Orders
                    </Button>
                    <Button variant="destructive" onClick={() => handleAction('reset-database')} disabled={isLoading}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Database
                    </Button>
                  </div>
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ These actions are irreversible. Use with extreme caution.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { admin, isLoading } = useAdmin();

  console.log('AdminPage render:', { admin, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    console.log('No admin found, showing login page');
    return <AdminLogin />;
  }

  console.log('Admin found, showing dashboard:', admin);
  return <AdminDashboard />;
}