'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  onAuthChange,
  handleRedirectResult,
  syncUserWithBackend,
  signOut,
} from '@/lib/auth';

interface DbUser {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  role: 'LAWYER' | 'ADMIN';
}

interface AuthContextValue {
  firebaseUser: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signOut: () => Promise<void>;
  syncCurrentDbUser: (user: User) => Promise<DbUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const syncCurrentDbUser = useCallback(async (user: User): Promise<DbUser | null> => {
    try {
      const synced = await syncUserWithBackend(user);
      setDbUser(synced);
      setAuthError(null);
      return synced;
    } catch (e: any) {
      const fullError = `Auth Error: ${e?.name || 'Error'} — ${e?.message || String(e)} (Code: ${e?.code || 'N/A'})\nAPI URL: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}`;
      console.error('Backend sync failed:', fullError, e);
      setAuthError(fullError);
      throw e;
    }
  }, []);

  // Handle Google redirect result on mount (if redirect fallback was used)
  useEffect(() => {
    handleRedirectResult().then(async (user) => {
      if (user) {
        await syncCurrentDbUser(user).catch((err) => console.warn('Redirect sync error:', err));
      }
    });
  }, [syncCurrentDbUser]);

  // Subscribe to Firebase auth state
  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      setFirebaseUser(user);

      if (user) {
        await syncCurrentDbUser(user).catch((err) => console.warn('Auth state sync error:', err));
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });

    return unsub;
  }, [syncCurrentDbUser]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setDbUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        loading,
        authError,
        clearAuthError,
        signOut: handleSignOut,
        syncCurrentDbUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
