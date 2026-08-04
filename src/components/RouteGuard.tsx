'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'LAWYER' | 'ADMIN';
}

/**
 * RouteGuard — redirects unauthenticated users to /login.
 * Optionally enforces a required role, redirecting to /dashboard if role doesn't match.
 */
export default function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { dbUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!dbUser) { router.replace('/login'); return; }
    if (requiredRole && dbUser.role !== requiredRole) {
      router.replace(dbUser.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    }
  }, [dbUser, loading, requiredRole, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f8fafc',
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e2e8f0',
          borderTopColor: '#6366f1', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!dbUser) return null;
  if (requiredRole && dbUser.role !== requiredRole) return null;
  return <>{children}</>;
}
