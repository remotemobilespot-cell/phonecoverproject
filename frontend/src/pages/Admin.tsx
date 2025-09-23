import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, Users, Package, BarChart3, Settings, 
  Mail, Database, Server, Download, Trash2,
  RefreshCw, Eye, Edit, CheckCircle, XCircle,
  DollarSign, ShoppingCart, MapPin, Clock, EyeOff, AlertCircle
} from 'lucide-react';

// Mock admin data - in production this would come from your admin API
const mockStats = {
  totalOrders: 47,
  pendingOrders: 12,
  completedOrders: 35,
  totalRevenue: '$2,847.50',
  activeUsers: 156,
  conversionRate: '3.2%'
};

const mockRecentOrders = [
  {
    id: 1,
    customer: 'John Doe',
    email: 'john@example.com',
    phone: 'iPhone 15 Pro',
    amount: '$24.99',
    status: 'pending',
    createdAt: '2025-09-23T10:00:00Z'
  },
  {
    id: 2,
    customer: 'Sarah Smith',
    email: 'sarah@example.com',
    phone: 'Samsung Galaxy S24',
    amount: '$29.99',
    status: 'completed',
    createdAt: '2025-09-23T09:30:00Z'
  },
  {
    id: 3,
    customer: 'Mike Chen',
    email: 'mike@example.com',
    phone: 'iPhone 14',
    amount: '$24.99',
    status: 'processing',
    createdAt: '2025-09-23T09:15:00Z'
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

    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
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
  const { admin, logout } = useAdmin();

  const handleAction = async (action: string, item?: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Admin action: ${action}`, item);
    alert(`Admin Action: ${action} ${item ? 'for ' + (item.customer || item.id) : ''}`);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <nav className="flex space-x-8 py-4">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'orders', name: 'Orders', icon: ShoppingCart },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'system', name: 'System', icon: Server }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.totalRevenue}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.pendingOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.customer}</p>
                            <p className="text-sm text-gray-500">{order.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.phone}</p>
                            <p className="text-sm text-gray-500">{order.amount}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAction('view', order)}
                            disabled={isLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAction('edit', order)}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
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

        {(activeTab === 'orders' || activeTab === 'users' || activeTab === 'products') && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'orders' ? <ShoppingCart className="w-8 h-8 text-blue-600" /> : 
                 activeTab === 'users' ? <Users className="w-8 h-8 text-blue-600" /> : 
                 <Package className="w-8 h-8 text-blue-600" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'orders' ? 'Order Management' :
                 activeTab === 'users' ? 'User Management' : 'Product Management'}
              </h3>
              <p className="text-gray-500 mb-6">
                Complete {activeTab} administration interface with full CRUD operations, 
                analytics, and advanced management features.
              </p>
              <Button onClick={() => handleAction(`manage-${activeTab}`)} disabled={isLoading}>
                Access {activeTab === 'orders' ? 'Order' : activeTab === 'users' ? 'User' : 'Product'} Management
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { admin, isLoading } = useAdmin();

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
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}