'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard.module.css';
import intStyles from './integrations.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────
interface IntegrationStatus {
  connected: boolean;
  phoneNumber?: string | null;
  email?: string | null;
  sheetName?: string | null;
  connectedAt?: string | null;
}

interface AllStatuses {
  whatsapp: IntegrationStatus;
  drive: IntegrationStatus;
  gmail: IntegrationStatus;
  sheets: IntegrationStatus;
  calendar: IntegrationStatus;
}

// ── Config ─────────────────────────────────────────────────────────────────────
const INTEGRATIONS = [
  {
    key: 'whatsapp' as const,
    icon: '💬',
    name: 'WhatsApp Business',
    desc: 'Receive client documents and messages. AI auto-routes files to the right case.',
    color: '#dcfce7',
    iconColor: '#16a34a',
    manualConnect: false,
  },
  {
    key: 'drive' as const,
    icon: '📁',
    name: 'Google Drive',
    desc: 'Your Drive, organized by Legal AI. Client → Case → Document folder structure, auto-created.',
    color: '#dbeafe',
    iconColor: '#2563eb',
    manualConnect: false,
  },
  {
    key: 'gmail' as const,
    icon: '📧',
    name: 'Gmail',
    desc: 'Import client emails and auto-attach them to their cases.',
    color: '#fee2e2',
    iconColor: '#dc2626',
    manualConnect: false,
  },
  {
    key: 'sheets' as const,
    icon: '📊',
    name: 'Google Sheets',
    desc: 'Import your existing client list from a Google Sheet and sync changes.',
    color: '#dcfce7',
    iconColor: '#16a34a',
    manualConnect: false,
  },
  {
    key: 'calendar' as const,
    icon: '📅',
    name: 'Google Calendar',
    desc: 'AI extracts hearing dates from court orders and adds them to your calendar.',
    color: '#fef9c3',
    iconColor: '#ca8a04',
    manualConnect: false,
  },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`${intStyles.toast} ${type === 'success' ? intStyles.toastSuccess : intStyles.toastError}`}>
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  );
}

// ── WhatsApp Modal ────────────────────────────────────────────────────────────
function WhatsAppModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phoneNumber: string) => void;
  loading: boolean;
}) {
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');

  if (!isOpen) return null;

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=Hi%20Legal%20AI%20Assistant`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(waUrl)}`;

  return (
    <div className={intStyles.modalOverlay} onClick={onClose}>
      <div className={intStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={intStyles.modalHeader}>
          <div className={intStyles.modalTitle}>
            <span>💬</span> Connect Custom WhatsApp
          </div>
          <button className={intStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Input */}
        <div className={intStyles.inputGroup}>
          <label className={intStyles.inputLabel}>WhatsApp Phone Number</label>
          <input
            type="text"
            className={intStyles.inputField}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>

        {/* QR Code */}
        <div className={intStyles.qrWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCodeUrl} alt="WhatsApp QR Code" className={intStyles.qrImage} />
          <p className={intStyles.qrHelp}>
            Scan this QR code with WhatsApp on your phone to open a direct chat and test sending documents.
          </p>
        </div>

        {/* Actions */}
        <div className={intStyles.modalActions}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={intStyles.whatsappWebBtn}
          >
            🔗 Open WhatsApp
          </a>

          <button
            className={intStyles.saveConnBtn}
            onClick={() => onConfirm(phoneNumber)}
            disabled={loading}
          >
            {loading ? 'Saving...' : '✓ Confirm Connection'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function IntegrationCard({
  item,
  status,
  onConnect,
  onDisconnect,
  loading,
}: {
  item: (typeof INTEGRATIONS)[0];
  status: IntegrationStatus | undefined;
  onConnect: (key: string) => void;
  onDisconnect: (key: string) => void;
  loading: boolean;
}) {
  const connected = status?.connected ?? false;

  return (
    <div className={`${intStyles.card} ${connected ? intStyles.cardConnected : ''}`}>
      <div className={intStyles.cardInner}>
        {/* Icon + status dot */}
        <div className={intStyles.cardIconWrap}>
          <div className={intStyles.cardIcon} style={{ background: item.color }}>
            {item.icon}
          </div>
          <span className={`${intStyles.statusDot} ${connected ? intStyles.dotGreen : intStyles.dotGrey}`} />
        </div>

        {/* Info */}
        <div className={intStyles.cardBody}>
          <div className={intStyles.cardHeader}>
            <span className={intStyles.cardName}>{item.name}</span>
            <span className={`${styles.badge} ${connected ? styles.badgeOpen : styles.badgeClosed}`}>
              {connected ? 'Connected' : 'Not connected'}
            </span>
          </div>
          <p className={intStyles.cardDesc}>{item.desc}</p>
          {connected && status?.connectedAt && (
            <p className={intStyles.cardMeta}>
              Connected {new Date(status.connectedAt).toLocaleDateString()}
              {status.phoneNumber && ` · ${status.phoneNumber}`}
              {status.email && ` · ${status.email}`}
              {status.sheetName && status.sheetName !== 'Pending setup' && ` · ${status.sheetName}`}
            </p>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className={intStyles.cardFooter}>
        {connected ? (
          <button
            className={intStyles.disconnectBtn}
            onClick={() => onDisconnect(item.key)}
            disabled={loading}
          >
            Disconnect
          </button>
        ) : (
          <button
            className={intStyles.connectBtn}
            onClick={() => onConnect(item.key)}
            disabled={loading}
          >
            {loading ? <span className={intStyles.btnSpinner} /> : null}
            Connect {item.name.split(' ')[0]}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component (inner — uses useSearchParams) ─────────────────────────────
function IntegrationsInner() {
  const { firebaseUser } = useAuth();
  const searchParams = useSearchParams();
  const [statuses, setStatuses] = useState<AllStatuses | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Handle redirect back from Google OAuth ──────────────────────────────────
  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    if (connected) showToast(`${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully!`, 'success');
    if (error === 'denied') showToast('Connection cancelled.', 'error');
    if (error && error !== 'denied') showToast(`Connection failed: ${error}`, 'error');
  }, [searchParams]);

  // ── Fetch integration status ────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStatuses(await res.json());
    } catch (e) {
      console.error('Failed to fetch integration status', e);
    } finally {
      setFetchLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // ── Connect — handle WhatsApp modal or Google OAuth redirect ─────────────────
  const handleConnect = async (key: string) => {
    if (!firebaseUser) return;

    if (key === 'whatsapp') {
      setIsWaModalOpen(true);
      return;
    }

    setActionLoading(key);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/integrations/google/auth?type=${key}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error('Failed to get auth URL');
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      showToast('Failed to start connection. Is the backend running?', 'error');
      setActionLoading(null);
    }
  };

  // ── Save WhatsApp custom number ─────────────────────────────────────────────
  const handleSaveWhatsApp = async (phoneNumber: string) => {
    if (!firebaseUser) return;
    setActionLoading('whatsapp');
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/whatsapp/connect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!res.ok) throw new Error('Failed to connect WhatsApp');
      showToast(`WhatsApp Business (${phoneNumber}) connected successfully!`, 'success');
      setIsWaModalOpen(false);
      await fetchStatus();
    } catch (e) {
      showToast('Failed to connect WhatsApp. Try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Disconnect ─────────────────────────────────────────────────────────────
  const handleDisconnect = async (key: string) => {
    if (!firebaseUser || !confirm(`Disconnect ${key}? This cannot be undone.`)) return;
    setActionLoading(key);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/integrations/${key}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error();
      showToast(`${key} disconnected`, 'success');
      await fetchStatus();
    } catch {
      showToast(`Failed to disconnect ${key}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const connected = INTEGRATIONS.filter((i) => statuses?.[i.key]?.connected).length;

  return (
    <div>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        onConfirm={handleSaveWhatsApp}
        loading={actionLoading === 'whatsapp'}
      />

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Integrations</h2>
          <p className={styles.pageSubheading}>
            {fetchLoading ? 'Loading...' : `${connected} of ${INTEGRATIONS.length} connected`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className={intStyles.progressWrap}>
        <div className={intStyles.progressBar}>
          <div
            className={intStyles.progressFill}
            style={{ width: `${(connected / INTEGRATIONS.length) * 100}%` }}
          />
        </div>
        <span className={intStyles.progressLabel}>{connected}/{INTEGRATIONS.length} connected</span>
      </div>

      {/* Cards */}
      <div className={intStyles.grid}>
        {INTEGRATIONS.map((item) => (
          <IntegrationCard
            key={item.key}
            item={item}
            status={statuses?.[item.key]}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            loading={actionLoading === item.key}
          />
        ))}
      </div>
    </div>
  );
}

// ── Wrapper with Suspense (required by useSearchParams in Next.js) ─────────────
export default function IntegrationsPage() {
  return (
    <Suspense>
      <IntegrationsInner />
    </Suspense>
  );
}
