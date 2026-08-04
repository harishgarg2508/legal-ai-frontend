'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/** Root page — redirects to the correct dashboard based on role */
export default function RootPage() {
  const { dbUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!dbUser) { router.replace('/login'); return; }
    if (dbUser.role === 'ADMIN') { router.replace('/admin/dashboard'); return; }
    router.replace('/dashboard');
  }, [dbUser, loading, router]);

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
