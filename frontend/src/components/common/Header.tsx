import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MapPin, Printer, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Find a Machine', href: '/find-machine' },
    { name: 'Print Now', href: '/print-now' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ];

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Printer className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">PrintPhoneCover</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/find-machine">
              <MapPin className="h-4 w-4 mr-2" />
              Find Machine
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/print-now">Print Now</Link>
          </Button>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {user.email?.split('@')[0]}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/find-machine" onClick={() => setIsOpen(false)}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Machine
                  </Link>
                </Button>
                <Button 
                  className="w-full" 
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/print-now">Print Now</Link>
                </Button>
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground text-center">
                      {user.email?.split('@')[0]}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Login / Register
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}