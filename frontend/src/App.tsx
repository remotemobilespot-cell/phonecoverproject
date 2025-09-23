import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HomePageDebug from './pages/HomePageDebug';
import FindMachine from './pages/FindMachine';
import PrintNow from './pages/PrintNow';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// ✅ Import new static pages
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Dashboard from './pages/Dashboard';

// ✅ Import admin pages and context
import AdminPage from './pages/Admin';
import { AdminProvider } from './contexts/AdminContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <Toaster />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-machine" element={<FindMachine />} />
          <Route path="/print-now" element={<PrintNow />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />

          {/* ✅ New routes */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ Admin routes */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
