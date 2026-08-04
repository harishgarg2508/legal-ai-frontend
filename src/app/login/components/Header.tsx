'use client';

import styles from './header.module.css';

interface HeaderProps {
  onLogin: () => void;
  loading: boolean;
}

export default function Header({ onLogin, loading }: HeaderProps) {
  return (
    <header className={styles.header}>
      {/* Brand Logo */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" width="24" height="24" className={styles.shieldSvg}>
            <path
              d="M12 2L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-3z"
              fill="none"
              stroke="#d97706"
              strokeWidth="2"
            />
            {/* Pillar lines inside shield */}
            <path
              d="M8 8h8M9 8v8M12 8v8M15 8v8M8 16h8"
              stroke="#d97706"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>LEGARO</span>
          <span className={styles.brandSubtitle}>LEGAL INTELLIGENCE PLATFORM</span>
        </div>
      </div>

      {/* Navigation & Action Button */}
      <div className={styles.actions}>
        <button className={styles.loginBtn} onClick={onLogin} disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <>
              Get Started <span className={styles.arrow}>→</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
