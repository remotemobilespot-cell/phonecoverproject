import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin credentials - In production, these should be environment variables
  const ADMIN_EMAIL = 'admin@printphonecover.com';
  const ADMIN_PASSWORD = 'Admin@2024!PrintCover';

  useEffect(() => {
    // Check if already logged in as admin
    const checkAdminSession = async () => {
      const adminToken = localStorage.getItem('admin_session');
      if (adminToken) {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email === ADMIN_EMAIL) {
          navigate('/admin-dashboard');
        }
      }
    };
    checkAdminSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First check credentials against our admin credentials
      if (credentials.email !== ADMIN_EMAIL || credentials.password !== ADMIN_PASSWORD) {
        setError('Invalid admin credentials. Access denied.');
        setIsLoading(false);
        return;
      }

      // Try to sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        // If admin user doesn't exist in Supabase, create it
        if (authError.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              data: {
                role: 'admin',
                name: 'Administrator'
              }
            }
          });

          if (signUpError) {
            setError('Failed to create admin account: ' + signUpError.message);
            setIsLoading(false);
            return;
          }

          // Sign in after signup
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (signInError) {
            setError('Failed to sign in: ' + signInError.message);
            setIsLoading(false);
            return;
          }
        } else {
          setError('Authentication failed: ' + authError.message);
          setIsLoading(false);
          return;
        }
      }

      // Set admin session
      localStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_login_time', new Date().toISOString());
      
      toast.success('Admin login successful');
      navigate('/admin-dashboard');
      
    } catch (error) {
      console.error('Admin login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-blue-200/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Access</CardTitle>
            <p className="text-gray-600 mt-2">Secure administrator portal</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Admin Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@printphonecover.com"
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter admin password"
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Demo Credentials</p>
                <p className="text-yellow-700 mt-1">
                  <strong>Email:</strong> admin@printphonecover.com<br/>
                  <strong>Password:</strong> Admin@2024!PrintCover
                </p>
                <p className="text-yellow-600 text-xs mt-2">
                  In production, use environment variables for security.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
