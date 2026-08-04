'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './sidebar.module.css';

const NAV_ITEMS = [
  { href: '/dashboard',    icon: '🏠', label: 'Dashboard' },
  { href: '/clients',      icon: '👥', label: 'Clients' },
  { href: '/cases',        icon: '⚖️',  label: 'Cases' },
  { href: '/inbox',        icon: '💬', label: 'WhatsApp Inbox' },
  { href: '/documents',    icon: '📄', label: 'Documents' },
  { href: '/hearings',     icon: '📅', label: 'Hearings' },
];

const BOTTOM_ITEMS = [
  { href: '/integrations', icon: '🔗', label: 'Integrations' },
  { href: '/settings',     icon: '⚙️',  label: 'Settings' },
];

export default function LawyerSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { dbUser, signOut } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const initials = dbUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Brand */}
      <div className={styles.brand} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={styles.brandIcon}>⚖️</span>
          <span className={styles.brandName}>Legal AI</span>
          <span className={styles.brandBadge}>Pro</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-close-toggle"
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.navSection}>Main</span>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}

        <span className={styles.navSection}>System</span>
        {BOTTOM_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className={styles.userFooter}>
        <div className={styles.userCard}>
          {dbUser?.profilePicture ? (
            <img src={dbUser.profilePicture} alt={dbUser.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatar}>{initials}</div>
          )}
          <div className={styles.userInfo}>
            <div className={styles.userName}>{dbUser?.name ?? 'Lawyer'}</div>
            <div className={styles.userRole}>Lawyer</div>
          </div>
          <button className={styles.signOutBtn} onClick={signOut} title="Sign out">
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}
