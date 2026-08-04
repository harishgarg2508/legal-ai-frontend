'use client';
import styles from '@/app/dashboard.module.css';

const ADMIN_STATS = [
  { icon: '👤', label: 'Total Users',    value: '—', color: '#ede9fe' },
  { icon: '⚖️', label: 'Active Lawyers', value: '—', color: '#dbeafe' },
  { icon: '📁', label: 'Total Cases',    value: '—', color: '#dcfce7' },
  { icon: '💬', label: 'Messages Today', value: '—', color: '#fef9c3' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Admin Overview 📊</h2>
          <p className={styles.pageSubheading}>Platform-wide metrics and health</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {ADMIN_STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon} style={{ background: s.color }}>{s.icon}</div>
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>📊</div>
          <div className={styles.comingSoonTitle}>Admin Analytics</div>
          <p className={styles.comingSoonSub}>
            Platform-wide usage stats, user activity, and system health will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
