'use client';

import styles from '@/app/login/login.module.css';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#0d0e12',
      color: '#94a3b8',
      padding: '60px 4vw 40px',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Left Column */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <span style={{ fontWeight: '800', letterSpacing: '1px', color: '#ffffff' }}>LEGARO AI</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '350px' }}>
            Automating file management, client communications, and court schedules for modern law firms. Secure, transparent, and built to scale.
          </p>
        </div>

        {/* Right Columns (Links) */}
        <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '700', marginBottom: '18px' }}>Legal Pages</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <li>
                <a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }} className={styles.footerLink}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }} className={styles.footerLink}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '700', marginBottom: '18px' }}>Support</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <li>
                <a href="mailto:support@legaro.ai" style={{ color: '#94a3b8', textDecoration: 'none' }} className={styles.footerLink}>
                  support@legaro.ai
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.78rem',
        color: '#64748b'
      }}>
        <span>&copy; {new Date().getFullYear()} Legaro AI. All rights reserved.</span>
        <span>Made for modern legal practices.</span>
      </div>
    </footer>
  );
}
