import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting OAuth callback handling...');
        console.log('Current URL:', window.location.href);
        
        // Check if we have session from URL fragments
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('Session data:', sessionData);
        console.log('Session error:', sessionError);

        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error(`Session error: ${sessionError.message}`);
          navigate('/auth');
          return;
        }

        if (!sessionData.session?.user) {
          console.log('No session found, trying to get user...');
          const { data: userData, error: userError } = await supabase.auth.getUser();
          console.log('User data:', userData);
          console.log('User error:', userError);
          
          if (userError || !userData?.user) {
            console.error('No user found after OAuth:', userError);
            toast.error('Google login failed - no user session found.');
            navigate('/auth');
            return;
          }
        }

        const user = sessionData.session?.user || await supabase.auth.getUser().then(r => r.data.user);
        console.log('Final user:', user);

        if (!user) {
          toast.error('Google login failed - user not found.');
          navigate('/auth');
          return;
        }

        // Sync profile with backend
        console.log('Syncing profile with backend...');
        try {
          const syncResponse = await fetch('/api/auth/sync-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              phone: user.user_metadata?.phone || ''
            })
          });
          
          console.log('Sync response status:', syncResponse.status);
          if (!syncResponse.ok) {
            const syncError = await syncResponse.text();
            console.error('Profile sync failed:', syncError);
            // Don't fail the login for sync errors
          } else {
            console.log('Profile synced successfully');
          }
        } catch (syncErr) {
          console.error('Profile sync error:', syncErr);
          // Don't fail the login for sync errors
        }

        toast.success('Google login successful!');
        navigate('/auth');
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error(`Login failed: ${error.message}`);
        navigate('/auth');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-lg">Completing Google login...</span>
    </div>
  );
}
