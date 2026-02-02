import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('blackjack-user-id');
    if (savedUserId) {
      fetchUser(parseInt(savedUserId, 10));
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('blackjack-user-id');
      }
    } catch (err) {
      localStorage.removeItem('blackjack-user-id');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = useCallback(async () => {
    if (user?.id) {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        // Ignore
      }
    }
  }, [user?.id]);

  const login = useCallback(async (username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest('POST', '/api/users/login', { username });
      const userData = await response.json();
      
      if (!response.ok) {
        return { success: false, error: userData.message || 'User not found' };
      }
      
      setUser(userData);
      localStorage.setItem('blackjack-user-id', userData.id.toString());
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to login' };
    }
  }, []);

  const signup = useCallback(async (username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest('POST', '/api/users', { username });
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to create account' };
      }
      
      setUser(data);
      localStorage.setItem('blackjack-user-id', data.id.toString());
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to create account' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('blackjack-user-id');
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
