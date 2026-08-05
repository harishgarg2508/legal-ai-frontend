'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle } from '@/lib/auth';
import styles from './login/login.module.css';

// Component Imports
import Header from './login/components/Header';
import Hero from './login/components/Hero';
import VideoPlayer from './login/components/VideoPlayer';
import ServicesSection from './login/components/ServicesSection';
import ReviewsSection from './login/components/ReviewsSection';
import SecuritySection from './login/components/SecuritySection';
import Footer from './login/components/Footer';

export default function LoginPage() {
  const { dbUser, loading: authLoading, authError, clearAuthError, syncCurrentDbUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Automatically redirect away from root (/) if user is already authenticated
  useEffect(() => {
    if (!authLoading && dbUser) {
      router.replace(dbUser.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    }
  }, [dbUser, authLoading, router]);

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    clearAuthError();
    try {
      const user = await signInWithGoogle();
      if (user) {
        try {
          const synced = await syncCurrentDbUser(user);
          if (synced) {
            router.replace(synced.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
          } else {
            setErrorMsg(`Signed in to Google, but backend user sync returned null.\nTarget API: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}`);
            setLoading(false);
          }
        } catch (syncErr: any) {
          console.error('Backend sync error:', syncErr);
          const fullErr = `Backend Sync Exception:\nName: ${syncErr?.name || 'Error'}\nMessage: ${syncErr?.message || String(syncErr)}\nCode: ${syncErr?.code || 'N/A'}\nAPI URL: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}`;
          setErrorMsg(fullErr);
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      const fullErr = `Google Sign-in Exception:\nName: ${error?.name || 'Error'}\nMessage: ${error?.message || String(error)}\nCode: ${error?.code || 'N/A'}`;
      setErrorMsg(fullErr);
      setLoading(false);
    }
  };

  const activeError = errorMsg || authError;

  return (
    <div className={styles.page} style={{
      background: 'linear-gradient(180deg, #f7f5f0 0%, #ede8de 100%)',
      color: '#2c1e15',
      minHeight: '100vh',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      {/* Background Decorative Glows */}
      <div className={styles.glowTop} style={{
        background: 'radial-gradient(circle, rgba(217, 119, 6, 0.06) 0%, transparent 70%)'
      }} />
      <div className={styles.glowCenter} style={{
        background: 'radial-gradient(circle, rgba(98, 62, 35, 0.03) 0%, transparent 60%)'
      }} />

      {/* 1. Header Navigation */}
      <Header onLogin={handleSignIn} loading={loading} />

      {/* Main Page Layout Container */}
      <div className={styles.content} style={{ maxWidth: '1320px', width: '100%', padding: '40px 4vw 80px', margin: '0 auto' }}>
        
        {/* 2. Hero Section */}
        <Hero />

        {/* Primary Call to Action */}
        <div className={styles.ctaWrapper} style={{ marginBottom: '50px' }}>
          <button className={styles.ctaBtn} onClick={handleSignIn} disabled={loading}>
            {loading ? (
              <span className={styles.ctaSpinner} />
            ) : (
              <>
                Get Started for Free <span className={styles.ctaArrow}>→</span>
              </>
            )}
          </button>
          <p style={{ color: '#8c786a', fontSize: '0.8rem', marginTop: '10px' }}>
            No credit card required • Instant setup with Google Workspace
          </p>
        </div>

        {/* Product Video & Interactive Showcase */}
        <VideoPlayer />

        {/* 3. Core Services & Google Integrations Section */}
        <ServicesSection />

        {/* 4. Verified Reviews & Testimonials Section */}
        <ReviewsSection />

        {/* 5. Security & Data Policy Compliance Section */}
        <SecuritySection />

      </div>

      {/* 6. Footer Component */}
      <Footer />

      {/* Full On-Screen Debug Error Overlay for Mobile Debugging */}
      {activeError && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          maxWidth: '720px',
          backgroundColor: '#0f172a',
          border: '2px solid #ef4444',
          borderRadius: '14px',
          padding: '18px 20px',
          color: '#fca5a5',
          zIndex: 9999999,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          fontSize: '0.85rem',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
            <span style={{ fontWeight: '800', color: '#f87171', fontSize: '0.95rem' }}>🚨 AUTH DEBUG LOG (MOBILE DETAILS)</span>
            <button
              onClick={() => { setErrorMsg(null); clearAuthError(); }}
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.78rem'
              }}
            >
              DISMISS
            </button>
          </div>
          <div style={{ lineHeight: '1.6' }}>{activeError}</div>
        </div>
      )}
    </div>
  );
}
