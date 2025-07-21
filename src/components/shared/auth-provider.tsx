'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Role } from '@/lib/types';
import { users } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<User | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('uic-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('uic-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, pass: string): Promise<User | null> => {
    const foundUser = users.find(u => u.username === username && u.password === pass);
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password;
      setUser(userToStore);
      localStorage.setItem('uic-user', JSON.stringify(userToStore));
      return userToStore;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('uic-user');
    router.push('/login');
  }, [router]);

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
