'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from '@/app/dashboard.module.css';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { firebaseUser, dbUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    clientCount: number;
    caseCount: number;
    unreadMessageCount: number;
    upcomingHearingCount: number;
    recentMessages: any[];
    upcomingHearings: any[];
    recentCases: any[];
  }>({
    clientCount: 0,
    caseCount: 0,
    unreadMessageCount: 0,
    upcomingHearingCount: 0,
    recentMessages: [],
    upcomingHearings: [],
    recentCases: [],
  });

  const fetchDashboardData = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatHearingDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = [
    { icon: '👥', label: 'Total Clients', value: loading ? '—' : dashboardData.clientCount, color: '#ede9fe' },
    { icon: '⚖️', label: 'Active Cases', value: loading ? '—' : dashboardData.caseCount, color: '#dbeafe' },
    { icon: '💬', label: 'Unread Messages', value: loading ? '—' : dashboardData.unreadMessageCount, color: '#dcfce7' },
    { icon: '📅', label: 'Upcoming Hearings', value: loading ? '—' : dashboardData.upcomingHearingCount, color: '#fef9c3' },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>
            {greeting}, {dbUser?.name?.split(' ')[0] ?? 'Counselor'} 👋
          </h2>
          <p className={styles.pageSubheading}>Here's what's happening with your practice today.</p>
        </div>
        <Link href="/clients" className={styles.primaryBtn}>
          + Add Client
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
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
            <Link href="/inbox" className={styles.panelAction}>
              View all →
            </Link>
          </div>
          <div className={styles.panelBody}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.82rem' }}>
                Loading recent messages...
              </div>
            ) : dashboardData.recentMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.82rem' }}>
                No recent messages.
              </div>
            ) : (
              dashboardData.recentMessages.map((m) => (
                <div key={m.id} className={styles.listRow}>
                  <div className={styles.rowIcon} style={{ background: '#ede9fe' }}>
                    👤
                  </div>
                  <div className={styles.rowContent}>
                    <div className={styles.rowTitle}>{m.client?.name ?? 'WhatsApp Client'}</div>
                    <div
                      className={styles.rowSub}
                      style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: '220px',
                      }}
                    >
                      {m.text || (m.type !== 'TEXT' ? `Attachment: [${m.type}]` : '')}
                    </div>
                  </div>
                  <div className={styles.rowMeta}>{formatRelativeTime(m.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Hearings */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>📅 Upcoming Hearings</span>
            <Link href="/hearings" className={styles.panelAction}>
              View all →
            </Link>
          </div>
          <div className={styles.panelBody}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.82rem' }}>
                Loading upcoming hearings...
              </div>
            ) : dashboardData.upcomingHearings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.82rem' }}>
                No upcoming hearings.
              </div>
            ) : (
              dashboardData.upcomingHearings.map((h) => (
                <div key={h.id} className={styles.listRow}>
                  <div className={styles.rowIcon} style={{ background: '#dbeafe' }}>
                    ⚖️
                  </div>
                  <div className={styles.rowContent}>
                    <div className={styles.rowTitle}>{h.case?.title}</div>
                    <div className={styles.rowSub}>{h.court || 'High Court'}</div>
                  </div>
                  <div className={styles.rowMeta}>
                    <div>{formatHearingDate(h.date)}</div>
                    <span className={`${styles.badge} ${styles.badgeScheduled}`}>{h.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Cases Full-Width Widget */}
      <div className={styles.panel} style={{ marginTop: '24px', padding: '20px' }}>
        <div className={styles.panelHeader} style={{ marginBottom: '16px' }}>
          <span className={styles.panelTitle}>⚖️ Recent Case Profiles</span>
          <Link href="/cases" className={styles.panelAction}>
            View all →
          </Link>
        </div>
        <div className={styles.panelBody}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.82rem' }}>
              Loading recent cases...
            </div>
          ) : dashboardData.recentCases?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.82rem' }}>
              No recent cases created.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontWeight: '700' }}>
                    <th style={{ padding: '8px 12px' }}>CASE NUMBER</th>
                    <th style={{ padding: '8px 12px' }}>TITLE</th>
                    <th style={{ padding: '8px 12px' }}>CLIENT</th>
                    <th style={{ padding: '8px 12px' }}>COURT</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentCases?.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>{c.caseNumber}</td>
                      <td style={{ padding: '12px' }}>{c.title}</td>
                      <td style={{ padding: '12px' }}>{c.client?.name || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{c.court || 'High Court'}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <span
                          className={`${styles.badge}`}
                          style={{
                            background: c.status === 'OPEN' ? '#dcfce7' : '#f1f5f9',
                            color: c.status === 'OPEN' ? '#16a34a' : '#475569',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
