'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard.module.css';

export default function HearingsPage() {
  const { firebaseUser } = useAuth();
  const [hearings, setHearings] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    caseId: '',
    date: '',
    court: '',
    judge: '',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSyncToCalendar = async (hearingId: string) => {
    if (!firebaseUser) return;
    setSyncingId(hearingId);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hearings/${hearingId}/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast('Hearing synchronized to Google Calendar successfully!', 'success');
        await fetchHearingsData();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to sync hearing.', 'error');
      }
    } catch {
      showToast('Error syncing hearing to Calendar.', 'error');
    } finally {
      setSyncingId(null);
    }
  };

  const fetchHearingsData = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const [resHearings, resCases, resIntegrations] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/hearings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (resHearings.ok) {
        const hearingsData = await resHearings.json();
        setHearings(hearingsData);
      }
      if (resCases.ok) {
        const casesData = await resCases.json();
        setCases(casesData);
      }
      if (resIntegrations.ok) {
        const intData = await resIntegrations.json();
        setCalendarConnected(intData.calendar?.connected || false);
      }
    } catch (e) {
      console.error('Failed to load hearings space dependencies', e);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchHearingsData();
  }, [fetchHearingsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    if (!form.caseId) {
      showToast('Please select a case.', 'error');
      return;
    }
    if (!form.date) {
      showToast('Please specify the hearing date & time.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hearings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('Court hearing scheduled and synchronized successfully!', 'success');
        setIsModalOpen(false);
        setForm({ caseId: '', date: '', court: '', judge: '' });
        await fetchHearingsData();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to schedule hearing.', 'error');
      }
    } catch {
      showToast('Error connecting to the server.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredHearings = hearings.filter((h) => {
    const q = searchQuery.toLowerCase();
    const caseTitle = h.case?.title || '';
    const caseNo = h.case?.caseNumber || '';
    const clientName = h.case?.client?.name || '';
    const court = h.court || '';
    return (
      caseTitle.toLowerCase().includes(q) ||
      caseNo.toLowerCase().includes(q) ||
      clientName.toLowerCase().includes(q) ||
      court.toLowerCase().includes(q)
    );
  });

  const formatHearingDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '80vh' }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontWeight: '600',
            fontSize: '0.9rem',
          }}
        >
          {toast.type === 'success' ? '✅ ' : '❌ '}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Hearings</h2>
          <p className={styles.pageSubheading}>Track active court dates and synchronize calendar events</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
          + Schedule Hearing
        </button>
      </div>

      {/* Calendar Connection Banner */}
      {!loading && !calendarConnected && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 4px', color: '#b45309', fontWeight: '700', fontSize: '0.9rem' }}>
              ⚠️ Google Calendar Offline
            </h4>
            <p style={{ margin: '0', fontSize: '0.8rem', color: '#d97706' }}>
              Your Google Calendar is not connected. Connect it in Integrations to auto-sync hearings.
            </p>
          </div>
          <a
            href="/integrations"
            className={styles.primaryBtn}
            style={{
              background: '#d97706',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              padding: '8px 14px',
            }}
          >
            Connect Google Calendar
          </a>
        </div>
      )}

      {/* Toolbar / Search */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer} style={{ flex: '1', maxWidth: '400px' }}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by case title, case number, or client..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Hearings Table / List Panel */}
      <div className={styles.panel} style={{ padding: '20px', marginTop: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Fetching court hearings list...</span>
          </div>
        ) : filteredHearings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📅</div>
            <h4 style={{ margin: '0 0 6px', fontWeight: '700', color: '#1e293b' }}>No Hearings Scheduled</h4>
            <p style={{ margin: '0', fontSize: '0.8rem' }}>
              No hearings found matching your criteria. Use "+ Schedule Hearing" above to register one.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className={styles.desktopTable} style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', fontWeight: '700' }}>
                    <th style={{ padding: '12px 16px', width: '25%' }}>DATE & TIME</th>
                    <th style={{ padding: '12px 16px', width: '30%' }}>CASE & CLIENT</th>
                    <th style={{ padding: '12px 16px', width: '25%' }}>COURT & JUDGE</th>
                    <th style={{ padding: '12px 16px', width: '20%', textAlign: 'right' }}>CALENDAR STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHearings.map((hearing) => (
                    <tr key={hearing.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.83rem', color: '#334155' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>
                        {formatHearingDate(hearing.date)}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{hearing.case?.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          No: {hearing.case?.caseNumber} • Client: {hearing.case?.client?.name}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600' }}>{hearing.court || 'Not specified'}</div>
                        {hearing.judge && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                            Judge: {hearing.judge}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          {hearing.calendarEventId ? (
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#16a34a',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                display: 'inline-block',
                              }}
                            >
                              Synced ✅
                            </span>
                          ) : (
                            <>
                              <span
                                style={{
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.72rem',
                                  fontWeight: '700',
                                  display: 'inline-block',
                                }}
                              >
                                Not Synced ⚠️
                              </span>
                              <button
                                disabled={syncingId === hearing.id}
                                onClick={() => handleSyncToCalendar(hearing.id)}
                                style={{
                                  border: 'none',
                                  background: '#2563eb',
                                  color: '#fff',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {syncingId === hearing.id ? 'Syncing...' : '🔄 Sync'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className={styles.mobileCards}>
              {filteredHearings.map((hearing) => (
                <div key={hearing.id} className={styles.mobileCard}>
                  <div className={styles.mobileCardHeader}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem' }}>
                      {formatHearingDate(hearing.date)}
                    </div>
                    <div>
                      {hearing.calendarEventId ? (
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: '700' }}>
                          Synced ✅
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ background: '#fee2e2', color: '#dc2626', padding: '3px 8px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: '700' }}>
                            Not Synced ⚠️
                          </span>
                          <button
                            disabled={syncingId === hearing.id}
                            onClick={() => handleSyncToCalendar(hearing.id)}
                            style={{ border: 'none', background: '#2563eb', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            {syncingId === hearing.id ? '...' : '🔄'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.mobileCardBody}>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Case:</span>
                      <span className={styles.mobileCardValue} style={{ fontWeight: '700' }}>{hearing.case?.title}</span>
                    </div>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Number:</span>
                      <span className={styles.mobileCardValue}>{hearing.case?.caseNumber}</span>
                    </div>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Client:</span>
                      <span className={styles.mobileCardValue}>{hearing.case?.client?.name}</span>
                    </div>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Court:</span>
                      <span className={styles.mobileCardValue}>{hearing.court || 'Not specified'}</span>
                    </div>
                    {hearing.judge && (
                      <div className={styles.mobileCardRow}>
                        <span className={styles.mobileCardLabel}>Judge:</span>
                        <span className={styles.mobileCardValue}>{hearing.judge}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Schedule Hearing Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                Schedule Court Hearing
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '6px',
                  }}
                >
                  SELECT CASE *
                </label>
                <select
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#fff',
                    color: '#0f172a',
                  }}
                  value={form.caseId}
                  onChange={(e) => setForm({ ...form, caseId: e.target.value })}
                >
                  <option value="">-- Choose a Case File --</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title} ({c.client?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '6px',
                  }}
                >
                  HEARING DATE & TIME *
                </label>
                <input
                  type="datetime-local"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                  }}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '6px',
                  }}
                >
                  COURT ROOM / BENCH
                </label>
                <input
                  type="text"
                  placeholder="e.g. High Court Room 4, Bench B"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                  }}
                  value={form.court}
                  onChange={(e) => setForm({ ...form, court: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '6px',
                  }}
                >
                  PRESIDING JUDGE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hon. Justice Sharma"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                  }}
                  value={form.judge}
                  onChange={(e) => setForm({ ...form, judge: e.target.value })}
                />
              </div>

              {/* Modal Footer / Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '20px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'none',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.primaryBtn}
                  style={{
                    boxShadow: 'none',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Scheduling...' : 'Save & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
