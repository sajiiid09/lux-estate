'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refresh: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally fetch user profile here if not stored
      // api.get('/api/users/me/').then(res => setUser(res.data)).catch(() => logout());
    }
    setIsLoading(false);
  }, []);

  const login = (accessToken: string, refreshToken: string, userData?: User) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setToken(accessToken);
    if (userData) {
      setUser(userData);
    }
    // If we don't have user data, we might want to fetch it
    // api.get('/api/users/me/').then(res => setUser(res.data));
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
