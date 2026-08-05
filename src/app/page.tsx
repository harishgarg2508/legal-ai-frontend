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

  // Do not block initial HTML render with a loader, so search engines and OAuth reviewers see full branding.
  // We handle redirection silently client-side in the useEffect above.

  return (
    <div className={styles.page} style={{
      background: 'linear-gradient(180deg, #f7f5f0 0%, #ede8de 100%)',
      color: '#2c1e15'
    }}>
      {/* Decorative Background Glows */}
      <div className={styles.glowTop} style={{
        background: 'radial-gradient(circle, rgba(217, 119, 6, 0.06) 0%, transparent 70%)'
      }} />
      <div className={styles.glowCenter} style={{
        background: 'radial-gradient(circle, rgba(98, 62, 35, 0.03) 0%, transparent 60%)'
      }} />

      {/* Header containing Logo & Login Trigger */}
      <Header onLogin={handleSignIn} loading={loading} />

      {/* Main Landing/Login Page Content */}
      <div className={styles.content} style={{ maxWidth: '1320px', width: '100%', padding: '40px 4vw 80px' }}>
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

        {/* What We Do & Services Grid */}
        <section style={{
          width: '100%',
          margin: '80px auto 40px',
          textAlign: 'center'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#d97706',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '12px'
          }}>
            INTELLIGENT WORKFLOWS
          </span>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#2c1e15',
            marginBottom: '14px',
            fontFamily: 'inherit'
          }}>
            What Legaro AI Does
          </h2>
          <p style={{
            color: '#625043',
            fontSize: '0.92rem',
            lineHeight: '1.6',
            marginBottom: '50px',
            maxWidth: '700px',
            margin: '0 auto 50px'
          }}>
            Legaro AI is a secure legal operating platform designed for law firms to automate document filing, client communications, and court schedules. Here are the core services we provide:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '20px',
            textAlign: 'left'
          }}>
            {/* Service 1: Google Drive */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2dcd0',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '1.4rem',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(217, 119, 6, 0.06)',
                  border: '1px solid rgba(217, 119, 6, 0.15)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>📁</div>
                <h4 style={{ color: '#2c1e15', fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>
                  Google Drive Folder Organizer
                </h4>
                <p style={{ color: '#625043', fontSize: '0.8rem', lineHeight: '1.6' }}>
                  Automates case-specific folder creation under a structured `Legaro AI` root. Automatically files documents by Client and Case name, ensuring your files are organized without manual dragging and dropping.
                </p>
              </div>
            </div>

            {/* Service 2: Google Calendar */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2dcd0',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '1.4rem',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(217, 119, 6, 0.06)',
                  border: '1px solid rgba(217, 119, 6, 0.15)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>📅</div>
                <h4 style={{ color: '#2c1e15', fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>
                  Google Calendar Sync
                </h4>
                <p style={{ color: '#625043', fontSize: '0.8rem', lineHeight: '1.6' }}>
                  AI analyzes uploaded court notices, extracts hearing dates, locations, and judge names, and adds them directly as events in your Google Calendar with custom reminders.
                </p>
              </div>
            </div>

            {/* Service 3: WhatsApp Intake */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2dcd0',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '1.4rem',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(217, 119, 6, 0.06)',
                  border: '1px solid rgba(217, 119, 6, 0.15)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>💬</div>
                <h4 style={{ color: '#2c1e15', fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>
                  WhatsApp Document Intake
                </h4>
                <p style={{ color: '#625043', fontSize: '0.8rem', lineHeight: '1.6' }}>
                  Connect your custom WhatsApp number. Clients can send case documents, photos, or text messages. The platform automatically files the attachments under the correct case in Google Drive.
                </p>
              </div>
            </div>

            {/* Service 4: Gmail Automation */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2dcd0',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '1.4rem',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(217, 119, 6, 0.06)',
                  border: '1px solid rgba(217, 119, 6, 0.15)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>📧</div>
                <h4 style={{ color: '#2c1e15', fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>
                  Gmail Intake Automation
                </h4>
                <p style={{ color: '#625043', fontSize: '0.8rem', lineHeight: '1.6' }}>
                  Monitors incoming emails from clients or courts. Automatically extracts attachments, matches them to existing client files, and uploads them to Drive case folders.
                </p>
              </div>
            </div>

            {/* Service 5: Google Sheets */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2dcd0',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '1.4rem',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(217, 119, 6, 0.06)',
                  border: '1px solid rgba(217, 119, 6, 0.15)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>📊</div>
                <h4 style={{ color: '#2c1e15', fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>
                  Google Sheets Sync
                </h4>
                <p style={{ color: '#625043', fontSize: '0.8rem', lineHeight: '1.6' }}>
                  Import client rosters and case details from Google Sheets. Keep records synced dynamically between your Legaro dashboard and the spreadsheet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparent Google API Use Card */}
        <section style={{
          width: '100%',
          background: '#ffffff',
          border: '1px solid #e2dcd0',
          padding: '30px',
          borderRadius: '12px',
          margin: '30px 0 20px',
          textAlign: 'left',
          boxShadow: '0 10px 30px rgba(98, 62, 35, 0.04)'
        }}>
          <h3 style={{
            color: '#2c1e15',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔒 Transparency & Google API Usage
          </h3>
          <p style={{
            color: '#625043',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            margin: 0
          }}>
            Legaro AI integrates directly with your Google Workspace credentials to organize files and schedule dates. 
            We comply fully with the <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706', fontWeight: '600' }}>Google API Services User Data Policy</a>. 
            We access <strong>Google Drive</strong> exclusively to build case directories and upload client documents. 
            We access <strong>Google Calendar</strong> to programmatically save hearing schedules. 
            Your tokens are encrypted with AES-256-GCM. We never share or sell Google user data to third parties.
          </p>
        </section>
      </div>

      {/* Full-width dark footer component below */}
      <Footer />

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
