'use client';

import styles from './hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Small top tagline */}
      <span className={styles.tagline}>AI-POWERED. LAWYER-TRUSTED.</span>

      {/* Main heading representing the App Name */}
      <h1 className={styles.title} style={{ fontSize: 'clamp(2rem, 5vh, 3.8rem)', fontWeight: '900', color: '#2c1e15' }}>
        Legaro AI
      </h1>
      <p style={{
        fontSize: 'clamp(0.9rem, 1.8vh, 1.25rem)',
        fontWeight: '600',
        color: '#d97706',
        marginTop: '8px',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        The AI Operating System for Modern Law Firms
      </p>

      {/* Golden shield divider decoration */}
      <div className={styles.divider}>
        <div className={styles.line} />
        <div className={styles.dividerIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z"
              fill="none"
              stroke="#d97706"
              strokeWidth="2"
            />
            <path d="M12 7l-2 5h4z" fill="#d97706" />
          </svg>
        </div>
        <div className={styles.line} />
      </div>

      {/* Subheading */}
      <p className={styles.subtitle} style={{ maxWidth: '780px', margin: '0 auto', lineHeight: '1.6' }}>
        Legaro AI is an intelligent legal practice platform built for law firms and legal professionals to automate case management, secure document storage in Google Drive, and sync court schedules with Google Calendar.
      </p>
    </section>
  );
}
