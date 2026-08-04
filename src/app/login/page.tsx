'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle } from '@/lib/auth';
import styles from './login.module.css';

export default function LoginPage() {
  const { dbUser, loading: authLoading, syncCurrentDbUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Automatically redirect away from /login if user is already authenticated
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
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0f1e',
      }}>
        <div className={styles.spinner} style={{ width: 36, height: 36, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>⚖️</div>
        </div>

        {/* Heading */}
        <div className={styles.heading}>
          <h1 className={styles.title}>Legal AI</h1>
          <p className={styles.subtitle}>
            Your intelligent legal practice assistant.<br />
            Manage clients, cases, and documents — all in one place.
          </p>
        </div>

        {/* Feature pills */}
        <div className={styles.pills}>
          {['WhatsApp Inbox', 'Google Drive', 'AI Extraction', 'Calendar Sync'].map((f) => (
            <span key={f} className={styles.pill}>{f}</span>
          ))}
        </div>

        {/* Divider */}
        <div className={styles.divider}><span>Sign in to continue</span></div>

        {/* Error message */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            textAlign: 'center',
            width: '100%',
          }}>
            ❌ {errorMsg}
          </div>
        )}

        {/* Google Button */}
        <button
          id="btn-google-signin"
          className={styles.googleBtn}
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span>{loading ? 'Signing in with Google...' : 'Continue with Google'}</span>
        </button>

        <p className={styles.terms}>
          By signing in you agree to our{' '}
          <a href="#" className={styles.link}>Terms of Service</a> and{' '}
          <a href="#" className={styles.link}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
