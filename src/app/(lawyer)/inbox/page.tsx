'use client';

import styles from '@/app/dashboard.module.css';

export default function InboxPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>WhatsApp Inbox</h2>
          <p className={styles.pageSubheading}>All incoming messages from your clients</p>
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>💬</div>
          <div className={styles.comingSoonTitle}>Live Inbox Coming Soon</div>
          <p className={styles.comingSoonSub}>
            The real-time inbox with reply, media preview, and client linking is being built next.
          </p>
        </div>
      </div>
    </div>
  );
}
