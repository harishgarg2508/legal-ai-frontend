'use client';
import styles from '@/app/dashboard.module.css';
export default function DocumentsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Documents</h2>
          <p className={styles.pageSubheading}>All case documents, stored in your Google Drive</p>
        </div>
        <button className={styles.primaryBtn}>+ Upload Document</button>
      </div>
      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>📄</div>
          <div className={styles.comingSoonTitle}>Document Management</div>
          <p className={styles.comingSoonSub}>
            Documents sent via WhatsApp are automatically saved to your Google Drive.<br />
            Connect Drive to get started.
          </p>
          <button className={styles.primaryBtn}>🔗 Connect Google Drive</button>
        </div>
      </div>
    </div>
  );
}
