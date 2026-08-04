'use client';
import styles from '@/app/dashboard.module.css';
export default function ClientsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Clients</h2>
          <p className={styles.pageSubheading}>Manage your client roster</p>
        </div>
        <button className={styles.primaryBtn}>+ Add Client</button>
      </div>
      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>👥</div>
          <div className={styles.comingSoonTitle}>Client Management</div>
          <p className={styles.comingSoonSub}>
            Connect your Google Sheet or add clients manually.<br />
            This feature is coming in the next phase.
          </p>
          <button className={styles.primaryBtn}>🔗 Connect Google Sheet</button>
        </div>
      </div>
    </div>
  );
}
