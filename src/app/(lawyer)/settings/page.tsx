'use client';
import styles from '@/app/dashboard.module.css';
export default function SettingsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Settings</h2>
          <p className={styles.pageSubheading}>Manage your account and preferences</p>
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>⚙️</div>
          <div className={styles.comingSoonTitle}>Account Settings</div>
          <p className={styles.comingSoonSub}>
            Profile, notifications, AI preferences, and billing will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
