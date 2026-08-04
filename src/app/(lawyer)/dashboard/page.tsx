'use client';

import Link from 'next/link';
import styles from '@/app/dashboard.module.css';
import { useAuth } from '@/context/AuthContext';

const STATS = [
  { icon: '👥', label: 'Total Clients',     value: '—', delta: null,   color: '#ede9fe', iconBg: '#8b5cf6' },
  { icon: '⚖️', label: 'Active Cases',      value: '—', delta: null,   color: '#dbeafe', iconBg: '#3b82f6' },
  { icon: '💬', label: 'Unread Messages',   value: '—', delta: null,   color: '#dcfce7', iconBg: '#22c55e' },
  { icon: '📅', label: 'Upcoming Hearings', value: '—', delta: null,   color: '#fef9c3', iconBg: '#eab308' },
];

const RECENT_MESSAGES = [
  { name: 'Harish Garg',   text: 'Hello',       time: '2m ago',  icon: '👤' },
  { name: 'Rajesh Kumar',  text: 'Sale deed PDF', time: '1h ago', icon: '👤' },
  { name: 'Amit Sharma',   text: 'Court notice', time: '3h ago',  icon: '👤' },
];

const UPCOMING_HEARINGS = [
  { title: 'Property Dispute', court: 'Delhi HC',   date: 'Aug 8', status: 'Scheduled' },
  { title: 'Criminal Case',    court: 'Sessions',   date: 'Aug 12', status: 'Scheduled' },
];

export default function DashboardPage() {
  const { dbUser } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Welcome */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>{greeting}, {dbUser?.name?.split(' ')[0] ?? 'Counselor'} 👋</h2>
          <p className={styles.pageSubheading}>Here's what's happening with your practice today.</p>
        </div>
        <Link href="/clients">
          <button className={styles.primaryBtn}>+ Add Client</button>
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon} style={{ background: s.color }}>
                {s.icon}
              </div>
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Panels */}
      <div className={styles.panelsGrid}>
        {/* Recent Messages */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>💬 Recent WhatsApp Messages</span>
            <Link href="/inbox" className={styles.panelAction}>View all →</Link>
          </div>
          <div className={styles.panelBody}>
            {RECENT_MESSAGES.map((m) => (
              <div key={m.name} className={styles.listRow}>
                <div className={styles.rowIcon} style={{ background: '#ede9fe' }}>{m.icon}</div>
                <div className={styles.rowContent}>
                  <div className={styles.rowTitle}>{m.name}</div>
                  <div className={styles.rowSub}>{m.text}</div>
                </div>
                <div className={styles.rowMeta}>{m.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Hearings */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>📅 Upcoming Hearings</span>
            <Link href="/hearings" className={styles.panelAction}>View all →</Link>
          </div>
          <div className={styles.panelBody}>
            {UPCOMING_HEARINGS.map((h) => (
              <div key={h.title} className={styles.listRow}>
                <div className={styles.rowIcon} style={{ background: '#dbeafe' }}>⚖️</div>
                <div className={styles.rowContent}>
                  <div className={styles.rowTitle}>{h.title}</div>
                  <div className={styles.rowSub}>{h.court}</div>
                </div>
                <div className={styles.rowMeta}>
                  <div>{h.date}</div>
                  <span className={`${styles.badge} ${styles.badgeScheduled}`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
