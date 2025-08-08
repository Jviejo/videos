'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { requestLoginCode, verifyLoginCode, getUserById } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Funciones para autenticación simplificada con códigos
  requestLogin: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyLogin: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUserId = localStorage.getItem('userId');
        if (savedUserId) {
          const userData = await getUserById(savedUserId);
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem('userId');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const requestLogin = async (email: string) => {
    try {
      const result = await requestLoginCode(email);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión, ' + error };
    }
  };

  const verifyLogin = async (email: string, code: string) => {
    try {
      setLoading(true);
      const result = await verifyLoginCode(email, code);
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('userId', result.user.id);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión, ' + error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };


  const value: AuthContextType = {
    user,
    loading,
    requestLogin,
    verifyLogin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 