'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './topbar.module.css';

const ROUTE_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  '/dashboard':    { title: 'Dashboard',       breadcrumb: 'Home / Dashboard' },
  '/clients':      { title: 'Clients',          breadcrumb: 'Home / Clients' },
  '/cases':        { title: 'Cases',            breadcrumb: 'Home / Cases' },
  '/inbox':        { title: 'WhatsApp Inbox',   breadcrumb: 'Home / Inbox' },
  '/documents':    { title: 'Documents',        breadcrumb: 'Home / Documents' },
  '/hearings':     { title: 'Hearings',         breadcrumb: 'Home / Hearings' },
  '/integrations': { title: 'Integrations',     breadcrumb: 'Home / Integrations' },
  '/settings':     { title: 'Settings',         breadcrumb: 'Home / Settings' },
  '/admin/dashboard':  { title: 'Admin Overview',  breadcrumb: 'Admin / Dashboard' },
  '/admin/users':      { title: 'Users',            breadcrumb: 'Admin / Users' },
  '/admin/audit-logs': { title: 'Audit Logs',       breadcrumb: 'Admin / Audit Logs' },
};

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const meta = ROUTE_TITLES[pathname] ?? { title: 'Legal AI', breadcrumb: '' };
  const { signOut } = useAuth();

  return (
    <header className={styles.topbar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className={styles.menuBtn}
          >
            ☰
          </button>
        )}
        <div className={styles.left}>
          <h1 className={styles.pageTitle}>{meta.title}</h1>
          {meta.breadcrumb && (
            <p className={styles.pageBreadcrumb}>{meta.breadcrumb}</p>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <button className={styles.iconBtn} title="Notifications">
          🔔
          <span className={styles.notifDot} />
        </button>
        <button className={styles.iconBtn} title="Help">
          ❓
        </button>
        <button className={`${styles.iconBtn} ${styles.signOutBtn}`} onClick={signOut} title="Sign Out">
          ↩
        </button>
      </div>
    </header>
  );
}
