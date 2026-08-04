'use client';
import styles from '@/app/dashboard.module.css';
export default function HearingsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Hearings</h2>
          <p className={styles.pageSubheading}>AI-extracted court dates synced to your calendar</p>
        </div>
        <button className={styles.primaryBtn}>+ Schedule Hearing</button>
      </div>
      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>📅</div>
          <div className={styles.comingSoonTitle}>Hearing Tracker</div>
          <p className={styles.comingSoonSub}>
            AI automatically extracts hearing dates from court orders and syncs them to Google Calendar.
          </p>
          <button className={styles.primaryBtn}>🔗 Connect Google Calendar</button>
        </div>
      </div>
    </div>
  );
}
