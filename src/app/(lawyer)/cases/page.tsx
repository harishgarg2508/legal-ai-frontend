'use client';
import styles from '@/app/dashboard.module.css';
export default function CasesPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Cases</h2>
          <p className={styles.pageSubheading}>Track and manage all your legal cases</p>
        </div>
        <button className={styles.primaryBtn}>+ New Case</button>
      </div>
      <div className={styles.panel}>
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>⚖️</div>
          <div className={styles.comingSoonTitle}>Case Management</div>
          <p className={styles.comingSoonSub}>
            Create cases, link clients, track court dates, and manage documents — all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
