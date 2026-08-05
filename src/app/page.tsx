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
  const { dbUser, loading: authLoading, syncCurrentDbUser } = useAuth();
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
    try {
      const user = await signInWithGoogle();
      if (user) {
        const synced = await syncCurrentDbUser(user);
        if (synced) {
          router.replace(synced.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        } else {
          setErrorMsg('Signed in to Google, but backend user sync failed. Check backend logs.');
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setErrorMsg(error.message || 'Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

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

      {/* Error Toast Notification */}
      {errorMsg && (
        <div className={styles.errorToast}>
          <span>⚠️ {errorMsg}</span>
          <button className={styles.errorClose} onClick={() => setErrorMsg(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
