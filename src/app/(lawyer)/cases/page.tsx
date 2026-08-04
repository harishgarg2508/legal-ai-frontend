'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard.module.css';
import Link from 'next/link';

export default function CasesPage() {
  const { firebaseUser } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetConnected, setSheetConnected] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    clientId: '',
    caseNumber: '',
    title: '',
    court: 'High Court',
    status: 'OPEN',
    description: '',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCasesAndDeps = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const [resCases, resClients, resIntegrations] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (resCases.ok) {
        setCases(await resCases.json());
      }
      if (resClients.ok) {
        setClients(await resClients.json());
      }
      if (resIntegrations.ok) {
        const data = await resIntegrations.json();
        setSheetConnected(data.sheets?.connected || false);
      }
    } catch (e) {
      console.error('Failed to load cases workspace dependencies', e);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchCasesAndDeps();
  }, [fetchCasesAndDeps]);

  const handleSync = async () => {
    if (!firebaseUser) return;
    setSyncing(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const result = await res.json();
        showToast(result.message || 'Cases synced successfully!', 'success');
        await fetchCasesAndDeps();
      } else {
        const err = await res.json();
        showToast(err.message || 'Sync failed.', 'error');
      }
    } catch {
      showToast('Connection error during sync.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!firebaseUser || !confirm(`Delete case "${title}"?`)) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast('Case deleted successfully', 'success');
        await fetchCasesAndDeps();
      } else {
        showToast('Failed to delete case', 'error');
      }
    } catch {
      showToast('Error deleting case', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    if (!form.clientId) {
      showToast('Please select or create a client profile first.', 'error');
      return;
    }
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('Case profile created successfully!', 'success');
        setIsModalOpen(false);
        setForm({ clientId: '', caseNumber: '', title: '', court: 'High Court', status: 'OPEN', description: '' });
        await fetchCasesAndDeps();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to create case', 'error');
      }
    } catch {
      showToast('Error creating case profile', 'error');
    }
  };

  const filteredCases = cases.filter(c => {
    const q = search.toLowerCase();
    const clientName = c.client?.name || '';
    return (
      c.caseNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      (c.court && c.court.toLowerCase().includes(q)) ||
      clientName.toLowerCase().includes(q)
    );
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN': return styles.badgeOpen;
      case 'IN_PROGRESS': return styles.badgeInProgress;
      case 'CLOSED': return styles.badgeClosed;
      default: return styles.badgeOpen;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#64748b' }}>
        <span>Loading case directory...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Cases</h2>
          <p className={styles.pageSubheading}>Track and manage all your active legal filings</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {sheetConnected && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className={styles.primaryBtn}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 2px 12px rgba(16,185,129,0.2)',
              }}
            >
              {syncing ? '🔄 Syncing...' : '🔄 Sync from Google Sheet'}
            </button>
          )}
          <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>
            ➕ Add Case File
          </button>
        </div>
      </div>

      {/* Connection Notice banner */}
      {!sheetConnected && (
        <div
          style={{
            padding: '14px 20px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            color: '#1e40af',
            fontSize: '0.83rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <strong>💡 Sync case records and hearings from Google Sheets:</strong> Link your sheet settings to organize client files automatically.
          </div>
          <Link
            href="/integrations"
            style={{
              fontWeight: '700',
              textDecoration: 'underline',
              color: '#2563eb',
            }}
          >
            Setup Sheet Integration →
          </Link>
        </div>
      )}

      {/* Main Cases Workspace */}
      <div className={styles.panel} style={{ padding: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Search cases by case number, title, court, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {filteredCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚖️</div>
            <h4 style={{ margin: '0 0 6px', fontWeight: '700', color: '#1e293b' }}>No Cases Found</h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.8rem' }}>
              {search ? 'Adjust your search parameters' : 'Register case files manually or sync them from Google Sheets'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className={styles.desktopTable} style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', fontWeight: '700' }}>
                    <th style={{ padding: '12px 16px' }}>CASE NUMBER & TITLE</th>
                    <th style={{ padding: '12px 16px' }}>CLIENT NAME</th>
                    <th style={{ padding: '12px 16px' }}>COURT / VENUE</th>
                    <th style={{ padding: '12px 16px' }}>STATUS</th>
                    <th style={{ padding: '12px 16px' }}>CREATED ON</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.83rem', color: '#334155' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{c.caseNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{c.title}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600' }}>{c.client?.name || 'Unassigned'}</div>
                        {c.client?.phone && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>📱 {c.client.phone}</div>}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>🏛️ {c.court || 'High Court'}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className={`${styles.badge} ${getStatusBadgeClass(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#64748b' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(c.id, c.title)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.78rem',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className={styles.mobileCards}>
              {filteredCases.map((c) => (
                <div key={c.id} className={styles.mobileCard}>
                  <div className={styles.mobileCardHeader}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem' }}>
                      {c.caseNumber}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`${styles.badge} ${getStatusBadgeClass(c.status)}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                        {c.status}
                      </span>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.75rem',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className={styles.mobileCardBody}>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Title:</span>
                      <span className={styles.mobileCardValue} style={{ fontWeight: '700' }}>{c.title}</span>
                    </div>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Client:</span>
                      <span className={styles.mobileCardValue}>{c.client?.name || 'Unassigned'}</span>
                    </div>
                    {c.client?.phone && (
                      <div className={styles.mobileCardRow}>
                        <span className={styles.mobileCardLabel}>Client Phone:</span>
                        <span className={styles.mobileCardValue}>{c.client.phone}</span>
                      </div>
                    )}
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Court:</span>
                      <span className={styles.mobileCardValue}>{c.court || 'High Court'}</span>
                    </div>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Registered:</span>
                      <span className={styles.mobileCardValue}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Manual Case Creation Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15,23,42,0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '440px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Open Case File</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Select Client *
                </label>
                <select
                  required
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem', outline: 'none' }}
                >
                  <option value="">-- Choose a Client --</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name} ({client.phone})</option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p style={{ fontSize: '0.7rem', color: '#ef4444', margin: '4px 0 0' }}>
                    ⚠️ No client profiles exist. Create a client profile first!
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Case Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SC/2024/1234"
                  value={form.caseNumber}
                  onChange={(e) => setForm({ ...form, caseNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Case Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harish vs. State"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Court/Venue
                </label>
                <input
                  type="text"
                  value={form.court}
                  onChange={(e) => setForm({ ...form, court: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem', outline: 'none' }}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem', height: '50px', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                className={styles.primaryBtn}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                Register Case File
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
