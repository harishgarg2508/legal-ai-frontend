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

      {/* Header containing Logo & Login Trigger */}
      <Header onLogin={handleSignIn} loading={loading} />

      {/* Main Landing/Login Page Content */}
      <div className={styles.content}>
        {/* Hero Section */}
        <Hero />

        {/* Get Started CTA Button */}
        <div className={styles.ctaWrapper} style={{ marginBottom: '40px' }}>
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

        {/* Video Player Section */}
        <VideoPlayer />

        {/* Services & Features Grid */}
        <section style={{
          width: '100%',
          maxWidth: '900px',
          margin: '60px auto 40px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '10px'
          }}>
            Services We Provide
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Legaro AI integrates seamlessly with your legal workflows, organizing documents and tracking litigation details.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            {/* Feature 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>📁</span>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
                Google Drive Automation
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                Auto-creates case-specific folder hierarchies inside your Google Drive. Seamlessly uploads client documents parsed from WhatsApp and keeps your metadata indexed.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>📅</span>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
                Google Calendar Sync
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                Extracts upcoming court hearing dates, locations, and judges from case notices via our custom Gemini AI models and syncs them automatically as Google Calendar events.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>💬</span>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
                WhatsApp Business Hub
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                Connect custom WhatsApp numbers to allow clients to send document scans directly. AI extracts document types, case numbers, and files them to Google Drive automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>📊</span>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
                Google Sheets Client Sync
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                Import client profiles and case details from a Google Sheet and automatically sync updates between your Legaro AI database and the connected spreadsheet.
              </p>
            </div>
          </div>
        </section>

        {/* Data Transparency & Google Integration Section */}
        <section style={{
          width: '100%',
          maxWidth: '900px',
          margin: '40px auto 60px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.15rem',
            fontWeight: '700',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔒 Transparency & Google API Scopes Disclosure
          </h3>
          <p style={{
            color: '#cbd5e1',
            fontSize: '0.88rem',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            Legaro AI integrates directly with your Google Workspace to automate document organization and schedule syncing. We strictly adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', fontWeight: '600' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
          </p>

          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px' }}>
            What Scopes We Request & Why:
          </h4>
          <ul style={{
            color: '#94a3b8',
            fontSize: '0.82rem',
            lineHeight: '1.7',
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <li>
              <strong>Google Drive (`/auth/drive.file`):</strong> Used exclusively to create the `Legal AI` root folder, create client-specific directories, and upload document attachments received from clients.
            </li>
            <li>
              <strong>Google Calendar (`/auth/calendar.events`):</strong> Used to schedule court hearings, case conferences, and reminders directly into the lawyer's primary calendar.
            </li>
            <li>
              <strong>Google Sheets (`/auth/spreadsheets`):</strong> Used to import client spreadsheets or sync metadata rows.
            </li>
            <li>
              <strong>Gmail (`/auth/gmail.readonly`):</strong> Used solely to import incoming court notices or client queries if manually triggered by the user.
            </li>
          </ul>

          <p style={{
            color: '#94a3b8',
            fontSize: '0.82rem',
            lineHeight: '1.6',
            margin: 0
          }}>
            <strong>Data Privacy Commitment:</strong> Legaro AI does not store raw user emails or calendars on our servers permanently. Tokens are securely encrypted using AES-256-GCM. We never share or sell Google user data with any advertising platforms or third parties. For full details, review our <a href="/privacy" style={{ color: '#f59e0b', fontWeight: '600' }}>Privacy Policy</a> and <a href="/terms" style={{ color: '#f59e0b', fontWeight: '600' }}>Terms of Service</a>.
          </p>
        </section>

        {/* Footer info & Links */}
        <footer className={styles.footer} style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          marginTop: '40px'
        }}>
          <p>© {new Date().getFullYear()} Legaro Intelligence Platform. All rights reserved.</p>
          <div className={styles.footerLinks} style={{ marginTop: '8px' }}>
            <a href="/terms" className={styles.footerLink}>Terms of Service</a>
            <span style={{ color: '#475569' }}>•</span>
            <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
            <span style={{ color: '#475569' }}>•</span>
            <a href="mailto:support@legaro.ai" className={styles.footerLink}>support@legaro.ai</a>
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
