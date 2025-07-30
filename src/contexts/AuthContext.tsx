'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getUserById } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await loginUser(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('userId', result.user.id);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const result = await registerUser(email, password, name);
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('userId', result.user.id);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 