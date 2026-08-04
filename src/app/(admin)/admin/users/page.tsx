'use client';
import styles from '@/app/dashboard.module.css';
export default function AdminUsersPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Users</h2>
          <p className={styles.pageSubheading}>Manage all lawyers on the platform</p>
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>👤</div>
          <div className={styles.comingSoonTitle}>User Management</div>
          <p className={styles.comingSoonSub}>
            View all registered lawyers, change roles, and manage access permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
