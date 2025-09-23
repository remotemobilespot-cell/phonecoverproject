import { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import AdminPage from './Admin';

const ADMIN_ACCESS_KEY = 'ppc_admin_2024_secure';

const SecureAdminWrapper = () => {
  const [searchParams] = useSearchParams();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const accessKey = searchParams.get('key');
    console.log('SecureAdminWrapper - Access key from URL:', accessKey);
    console.log('SecureAdminWrapper - Required key:', ADMIN_ACCESS_KEY);
    
    if (accessKey === ADMIN_ACCESS_KEY) {
      console.log('SecureAdminWrapper - Key matches, granting access');
      setHasAccess(true);
      // Optionally store in session for convenience
      sessionStorage.setItem('admin_access_granted', 'true');
    } else {
      // Check if already granted access in this session
      const sessionAccess = sessionStorage.getItem('admin_access_granted');
      console.log('SecureAdminWrapper - Session access:', sessionAccess);
      if (sessionAccess === 'true') {
        console.log('SecureAdminWrapper - Session access granted');
        setHasAccess(true);
      } else {
        console.log('SecureAdminWrapper - Access denied');
      }
    }
    setIsLoading(false);
  }, [searchParams]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!hasAccess) {
    console.log('SecureAdminWrapper - Redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  console.log('SecureAdminWrapper - Rendering AdminPage');
  return <AdminPage />;
};

export default SecureAdminWrapper;