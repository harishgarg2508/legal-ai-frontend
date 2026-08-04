'use client';

import styles from './hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Small top tagline */}
      <span className={styles.tagline}>AI-POWERED. LAWYER-TRUSTED.</span>

      {/* Main heading */}
      <h1 className={styles.title}>
        The AI Operating System for <span className={styles.highlight}>Modern</span> Law Firms
      </h1>

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
      <p className={styles.subtitle}>
        Manage clients, cases, documents, and every legal workflow <br />
        from one intelligent platform.
      </p>
    </section>
  );
}
