'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard.module.css';
import Link from 'next/link';

export default function ClientsPage() {
  const { firebaseUser } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetConnected, setSheetConnected] = useState(false);
  const [sheetName, setSheetName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchClientsAndStatus = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const [resClients, resIntegrations] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (resClients.ok) {
        setClients(await resClients.json());
      }
      if (resIntegrations.ok) {
        const data = await resIntegrations.json();
        setSheetConnected(data.sheets?.connected || false);
        setSheetName(data.sheets?.sheetName || '');
      }
    } catch (e) {
      console.error('Failed to load clients/integrations status', e);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchClientsAndStatus();
  }, [fetchClientsAndStatus]);

  const handleSync = async () => {
    if (!firebaseUser) return;
    setSyncing(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const result = await res.json();
        showToast(result.message || 'Clients synced successfully!', 'success');
        await fetchClientsAndStatus();
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

  const handleDelete = async (id: string, name: string) => {
    if (!firebaseUser || !confirm(`Delete client "${name}"?`)) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast('Client deleted successfully', 'success');
        await fetchClientsAndStatus();
      } else {
        showToast('Failed to delete client', 'error');
      }
    } catch {
      showToast('Error deleting client', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('Client created successfully!', 'success');
        setIsModalOpen(false);
        setForm({ name: '', phone: '', email: '', address: '', notes: '' });
        await fetchClientsAndStatus();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to create client', 'error');
      }
    } catch {
      showToast('Error creating client', 'error');
    }
  };

  const filteredClients = clients.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      c.phone.includes(q)
    );
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#64748b' }}>
        <span>Loading client roster...</span>
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
          <h2 className={styles.pageHeading}>Clients</h2>
          <p className={styles.pageSubheading}>Manage your client roster and case linkages</p>
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
            ➕ Add Client
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
            <strong>💡 Sync client database from Google Sheets automatically:</strong> Link your sheet and columns to import everyone instantly.
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

      {/* Main client management workspace */}
      <div className={styles.panel} style={{ padding: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Search clients by name, phone or email..."
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

        {filteredClients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👥</div>
            <h4 style={{ margin: '0 0 6px', fontWeight: '700', color: '#1e293b' }}>No Clients Found</h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.8rem' }}>
              {search ? 'Adjust your search term or filter' : 'Add clients manually or sync from your Google Sheet'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className={styles.desktopTable} style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', fontWeight: '700' }}>
                    <th style={{ padding: '12px 16px' }}>CLIENT DETAILS</th>
                    <th style={{ padding: '12px 16px' }}>CONTACT</th>
                    <th style={{ padding: '12px 16px' }}>CASE COUNT</th>
                    <th style={{ padding: '12px 16px' }}>CREATED ON</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.83rem', color: '#334155' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{client.name}</div>
                        {client.notes && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{client.notes}</div>}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>📱 {client.phone || 'No phone'}</div>
                        {client.email && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>✉️ {client.email}</div>}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.75rem',
                          }}
                        >
                          💼 {client.cases?.length || 0} Case(s)
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#64748b' }}>
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(client.id, client.name)}
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
              {filteredClients.map((client) => (
                <div key={client.id} className={styles.mobileCard}>
                  <div className={styles.mobileCardHeader}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem' }}>
                      {client.name}
                    </div>
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
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
                  <div className={styles.mobileCardBody}>
                    {client.notes && (
                      <div className={styles.mobileCardRow}>
                        <span className={styles.mobileCardLabel}>Notes:</span>
                        <span className={styles.mobileCardValue}>{client.notes}</span>
                      </div>
                    )}
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Phone:</span>
                      <span className={styles.mobileCardValue}>{client.phone || 'N/A'}</span>
                    </div>
                    {client.email && (
                      <div className={styles.mobileCardRow}>
                        <span className={styles.mobileCardLabel}>Email:</span>
                        <span className={styles.mobileCardValue}>{client.email}</span>
                      </div>
                    )}
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Cases:</span>
                      <span
                        style={{
                          padding: '2px 6px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '0.7rem',
                        }}
                      >
                        💼 {client.cases?.length || 0} Open
                      </span>
                    </div>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileCardLabel}>Created:</span>
                      <span className={styles.mobileCardValue}>{new Date(client.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Manual Client Creation Modal */}
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
              width: '420px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Add Client Profile</h3>
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="client@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.83rem', height: '60px', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                className={styles.primaryBtn}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                Create Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
