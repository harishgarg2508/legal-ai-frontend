'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle } from '@/lib/auth';
import styles from './login/login.module.css';

// Components from login folder
import Header from './login/components/Header';
import Hero from './login/components/Hero';
import VideoPlayer from './login/components/VideoPlayer';

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

  if (authLoading || dbUser) {
    return (
      <div className={styles.pageLoader}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Decorative Background Glows */}
      <div className={styles.glowTop} />
      <div className={styles.glowCenter} />

      {/* Header containing Logo & Login Trigger (Full Width) */}
      <Header onLogin={handleSignIn} loading={loading} />

      {/* Main Landing/Login Page Content */}
      <div className={styles.content}>
        {/* Hero Section containing Page Headings */}
        <Hero />

        {/* Get Started CTA Button */}
        <div className={styles.ctaWrapper}>
          <button className={styles.ctaBtn} onClick={handleSignIn} disabled={loading}>
            {loading ? (
              <span className={styles.ctaSpinner} />
            ) : (
              <>
                Get Started for Free <span className={styles.ctaArrow}>→</span>
              </>
            )}
          </button>
        </div>

        {/* Video Player Section containing Desktop Monitor Frame & video */}
        <VideoPlayer />

        {/* Footer info & Links */}
        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Legaro Intelligence Platform. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/terms" className={styles.footerLink}>Terms of Service</a>
            <span style={{ color: '#475569' }}>•</span>
            <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
          </div>
        </footer>
      </div>

      {/* Floating Error Notification Toast */}
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
