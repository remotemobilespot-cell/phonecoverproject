import React, { createContext, useContext, useEffect, useState } from 'react';

interface Admin {
  username: string;
  role: string;
  loginTime: string;
}

interface AdminContextType {
  admin: Admin | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch('https://phonecoverproject-1.onrender.com/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        setToken(tokenToVerify);
        localStorage.setItem('adminToken', tokenToVerify);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('adminToken');
        setToken(null);
        setAdmin(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('adminToken');
      setToken(null);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('https://phonecoverproject-1.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.admin);
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};