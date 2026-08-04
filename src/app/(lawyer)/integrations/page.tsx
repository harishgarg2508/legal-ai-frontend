'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard.module.css';
import intStyles from './integrations.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────
interface IntegrationStatus {
  connected: boolean;
  phoneNumber?: string | null;
  email?: string | null;
  sheetId?: string | null;
  sheetName?: string | null;
  mapping?: Record<string, string> | null;
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
  const { firebaseUser } = useAuth();
  const FIXED_ASSISTANT_NUMBER = '+91 62837 66476';
  const [tokenCode, setTokenCode] = useState<string>('');
  const [fetchingToken, setFetchingToken] = useState<boolean>(false);
  const [isLinked, setIsLinked] = useState<boolean>(false);
  const [linkedPhone, setLinkedPhone] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !firebaseUser) return;
    setIsLinked(false);
    setLinkedPhone('');

    const fetchToken = async () => {
      setFetchingToken(true);
      console.log('STEP 1: Requesting token generation from backend...');
      try {
        const token = await firebaseUser.getIdToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/whatsapp/generate-token`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          console.log('STEP 2: Token generated successfully:', data.code);
          setTokenCode(data.code);
        }
      } catch (e) {
        console.error('Failed to generate WhatsApp linking token', e);
      } finally {
        setFetchingToken(false);
      }
    };

    fetchToken();
  }, [isOpen, firebaseUser]);

  const onConfirmRef = useRef(onConfirm);
  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  // Real-Time Listener for WhatsApp Account Linking
  useEffect(() => {
    if (!isOpen || !tokenCode || isLinked) return;
    let isActive = true;

    const checkStatus = async () => {
      if (!isActive) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/whatsapp/token-status?code=${tokenCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'LINKED' && isActive) {
            console.log('REAL-TIME LINK EVENT DETECTED! Phone:', data.phoneNumber);
            setIsLinked(true);
            setLinkedPhone(data.phoneNumber || '');
            onConfirmRef.current(data.phoneNumber || FIXED_ASSISTANT_NUMBER);
          }
        }
      } catch (e) {
        console.error('Status check error:', e);
      }
    };

    // Immediate initial check
    checkStatus();

    // Check status every 3 seconds while modal is open
    const intervalId = setInterval(checkStatus, 3000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [isOpen, tokenCode, isLinked, FIXED_ASSISTANT_NUMBER]);

  if (!isOpen) return null;

  const cleanPhone = FIXED_ASSISTANT_NUMBER.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(tokenCode || 'LINK-VERIFY');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(waUrl)}`;

  return (
    <div className={intStyles.modalOverlay} onClick={onClose}>
      <div className={intStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={intStyles.modalHeader}>
          <div className={intStyles.modalTitle}>
            <span>💬</span> Secure WhatsApp Account Linking
          </div>
          <button className={intStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Success Live Event Banner */}
        {isLinked && (
          <div
            style={{
              padding: '14px 16px',
              background: '#dcfce7',
              border: '2px solid #16a34a',
              borderRadius: '10px',
              color: '#15803d',
              fontWeight: '700',
              textAlign: 'center',
              fontSize: '1rem',
              marginBottom: '16px',
              animation: 'bounce 0.5s ease',
            }}
          >
            🎉 Live Event Detected! WhatsApp Linked to +{linkedPhone || 'your mobile'}! Updating dashboard...
          </div>
        )}

        {/* Assistant Number */}
        <div className={intStyles.inputGroup}>
          <label className={intStyles.inputLabel}>
            Official Fixed Assistant Number 🔒 <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(System Number)</span>
          </label>
          <input
            type="text"
            className={intStyles.inputField}
            value={FIXED_ASSISTANT_NUMBER}
            readOnly
            style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#334155', fontWeight: '600' }}
          />
        </div>

        {/* Unique Verification Token Badge */}
        <div className={intStyles.inputGroup}>
          <label className={intStyles.inputLabel}>
            Your Secure One-Time Verification Code
          </label>
          <div
            style={{
              padding: '10px 14px',
              background: isLinked ? '#dcfce7' : '#eff6ff',
              border: isLinked ? '2px solid #16a34a' : '2px dashed #2563eb',
              borderRadius: '8px',
              fontWeight: '700',
              color: isLinked ? '#15803d' : '#1e40af',
              fontSize: '1.1rem',
              letterSpacing: '1px',
              textAlign: 'center',
            }}
          >
            {fetchingToken ? 'Generating Code...' : isLinked ? '✅ LINKED & VERIFIED' : tokenCode || 'LINK-******'}
          </div>
        </div>

        {/* QR Code & Security Notice */}
        <div className={intStyles.qrWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCodeUrl} alt="WhatsApp QR Code" className={intStyles.qrImage} />
          <p className={intStyles.qrHelp}>
            1. Scan QR code or click <strong>Open WhatsApp</strong>.<br />
            2. Send the code <code>{tokenCode}</code> to <strong>+91 62837 66476</strong>.<br />
            3. ⚡ The page will automatically detect when you send the code and update!
          </p>
        </div>

        {/* Actions */}
        <div className={intStyles.modalActions}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={intStyles.whatsappWebBtn}
            style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
          >
            🔗 Open WhatsApp Chat
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Google Sheets Config Modal ────────────────────────────────────────────────
function SheetsConfigModal({
  isOpen,
  onClose,
  initialSheetId,
  initialSheetName,
  initialMapping,
  onSave,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialSheetId?: string | null;
  initialSheetName?: string | null;
  initialMapping?: Record<string, string> | null;
  onSave: (data: { sheetId: string; sheetName: string; mapping: Record<string, string> }) => void;
  loading: boolean;
}) {
  const { firebaseUser } = useAuth();
  const [sheetUrl, setSheetUrl] = useState(initialSheetId || '');
  const [sheetName, setSheetName] = useState(initialSheetName || 'Sheet1');
  const [tabs, setTabs] = useState<string[]>([]);
  const [headers, setHeaders] = useState<Array<{ col: string; label: string }>>([]);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);

  const [mapping, setMapping] = useState({
    case_number: initialMapping?.case_number || 'A',
    client_name: initialMapping?.client_name || 'B',
    client_email: initialMapping?.client_email || 'E',
    court: initialMapping?.court || 'C',
    hearing_date: initialMapping?.hearing_date || 'D',
    status: initialMapping?.status || 'F',
  });

  const fetchSheetDetails = useCallback(async (targetUrl?: string, targetTab?: string) => {
    const urlOrId = targetUrl || sheetUrl;
    if (!urlOrId.trim() || !firebaseUser) return;
    setFetchingMeta(true);
    setMetaError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/sheets/preview`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetId: urlOrId.trim(),
          sheetName: targetTab || sheetName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.tabs && data.tabs.length > 0) {
          setTabs(data.tabs);
          if (!targetTab && data.activeTab) {
            setSheetName(data.activeTab);
          }
        }
        if (data.headers) {
          setHeaders(data.headers);
        }
      } else {
        const errData = await res.json();
        const msg = errData.message || '';
        if (msg.includes('Google Sheets API has not been used') || msg.includes('disabled')) {
          setMetaError('Google Sheets API is disabled in your Google Cloud Console. Click "Enable Sheets API" below.');
        } else {
          setMetaError(msg || 'Failed to load sheet metadata.');
        }
      }
    } catch (e: any) {
      setMetaError('Error fetching sheet details. Check your Google connection.');
    } finally {
      setFetchingMeta(false);
    }
  }, [sheetUrl, sheetName, firebaseUser]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isOpen) {
      if (!hasInitialized.current) {
        const initId = initialSheetId || '';
        const initTab = initialSheetName && initialSheetName !== 'Pending setup' ? initialSheetName : 'Sheet1';
        setSheetUrl(initId);
        setSheetName(initTab);
        setMetaError(null);
        if (initialMapping) {
          setMapping({
            case_number: initialMapping.case_number || 'A',
            client_name: initialMapping.client_name || 'B',
            client_email: initialMapping.client_email || 'E',
            court: initialMapping.court || 'C',
            hearing_date: initialMapping.hearing_date || 'D',
            status: initialMapping.status || 'F',
          });
        }
        if (initId) {
          fetchSheetDetails(initId, initTab);
        }
        hasInitialized.current = true;
      }
    } else {
      hasInitialized.current = false;
    }
  }, [isOpen, initialSheetId, initialSheetName, initialMapping, fetchSheetDetails]);

  if (!isOpen) return null;

  const defaultCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  const columnOptions = headers.length > 0
    ? headers
    : defaultCols.map((col) => ({ col, label: `Column ${col}` }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl.trim()) return;
    onSave({ sheetId: sheetUrl.trim(), sheetName: sheetName.trim(), mapping });
  };

  return (
    <div className={intStyles.modalOverlay} onClick={onClose}>
      <div className={intStyles.modal} style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className={intStyles.modalHeader}>
          <div className={intStyles.modalTitle}>
            <span>📊</span> Google Sheets Mapping & Sync
          </div>
          <button className={intStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sheet URL or ID */}
          <div className={intStyles.inputGroup}>
            <label className={intStyles.inputLabel}>
              Google Sheet URL or ID <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className={intStyles.inputField}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5n..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                required
              />
              <button
                type="button"
                className={intStyles.saveConnBtn}
                style={{ flexShrink: 0, padding: '0 14px', fontSize: '0.8rem', background: '#475569' }}
                onClick={() => fetchSheetDetails()}
                disabled={fetchingMeta || !sheetUrl.trim()}
              >
                {fetchingMeta ? <span className={intStyles.btnSpinner} /> : '🔍 Fetch'}
              </button>
            </div>
            {metaError && (
              <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '6px', background: '#fef2f2', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                ⚠️ {metaError}
                {metaError.includes('disabled') && (
                  <div style={{ marginTop: '4px' }}>
                    <a
                      href="https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=410804415822"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'underline' }}
                    >
                      👉 Click here to Enable Google Sheets API in Google Cloud Console
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sheet Tab Dropdown */}
          <div className={intStyles.inputGroup}>
            <label className={intStyles.inputLabel}>Sheet Tab Name</label>
            {tabs.length > 0 ? (
              <select
                className={intStyles.inputField}
                value={sheetName}
                onChange={(e) => {
                  setSheetName(e.target.value);
                  fetchSheetDetails(sheetUrl, e.target.value);
                }}
              >
                {tabs.map((tab) => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className={intStyles.inputField}
                placeholder="Sheet1 or Cases"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
              />
            )}
          </div>

          {/* Column Mappings */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              🎯 Column Mapping
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 12px' }}>
              Select which column in your spreadsheet corresponds to each field:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className={intStyles.inputLabel}>Case Number Column</label>
                <select
                  className={intStyles.inputField}
                  value={mapping.case_number}
                  onChange={(e) => setMapping({ ...mapping, case_number: e.target.value })}
                >
                  {columnOptions.map((opt) => (
                    <option key={`cn-${opt.col}`} value={opt.col}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={intStyles.inputLabel}>Hearing Date Column</label>
                <select
                  className={intStyles.inputField}
                  value={mapping.hearing_date}
                  onChange={(e) => setMapping({ ...mapping, hearing_date: e.target.value })}
                >
                  {columnOptions.map((opt) => (
                    <option key={`hd-${opt.col}`} value={opt.col}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={intStyles.inputLabel}>Client Name Column</label>
                <select
                  className={intStyles.inputField}
                  value={mapping.client_name}
                  onChange={(e) => setMapping({ ...mapping, client_name: e.target.value })}
                >
                  {columnOptions.map((opt) => (
                    <option key={`cl-${opt.col}`} value={opt.col}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={intStyles.inputLabel}>Client Email Column</label>
                <select
                  className={intStyles.inputField}
                  value={mapping.client_email}
                  onChange={(e) => setMapping({ ...mapping, client_email: e.target.value })}
                >
                  {columnOptions.map((opt) => (
                    <option key={`ce-${opt.col}`} value={opt.col}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={intStyles.inputLabel}>Court Column</label>
                <select
                  className={intStyles.inputField}
                  value={mapping.court}
                  onChange={(e) => setMapping({ ...mapping, court: e.target.value })}
                >
                  {columnOptions.map((opt) => (
                    <option key={`ct-${opt.col}`} value={opt.col}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={intStyles.modalActions}>
            <button type="submit" className={intStyles.saveConnBtn} disabled={loading} style={{ width: '100%' }}>
              {loading ? <span className={intStyles.btnSpinner} /> : '💾 Save Sheet Mapping'}
            </button>
          </div>
        </form>
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
  onConfigure,
  loading,
}: {
  item: (typeof INTEGRATIONS)[0];
  status: IntegrationStatus | undefined;
  onConnect: (key: string) => void;
  onDisconnect: (key: string) => void;
  onConfigure?: (key: string) => void;
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
      <div className={intStyles.cardFooter} style={{ display: 'flex', gap: '8px' }}>
        {connected ? (
          <>
            {item.key === 'sheets' && onConfigure && (
              <button
                className={intStyles.saveConnBtn}
                style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                onClick={() => onConfigure(item.key)}
              >
                ⚙️ Configure
              </button>
            )}
            <button
              className={intStyles.disconnectBtn}
              onClick={() => onDisconnect(item.key)}
              disabled={loading}
            >
              Disconnect
            </button>
          </>
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
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [emailActionMode, setEmailActionMode] = useState<'draft' | 'send'>('draft');
  const [prefLoading, setPrefLoading] = useState(false);
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

  // ── Fetch integration status & preferences ──────────────────────────────────
  const fetchStatus = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const [resStatus, resPref] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (resStatus.ok) setStatuses(await resStatus.json());
      if (resPref.ok) {
        const prefData = await resPref.json();
        if (prefData.emailActionMode) setEmailActionMode(prefData.emailActionMode);
      }
    } catch (e) {
      console.error('Failed to fetch integration status/preferences', e);
    } finally {
      setFetchLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // ── Save Email Preference ──────────────────────────────────────────────────
  const handleUpdateEmailMode = async (mode: 'draft' | 'send') => {
    if (!firebaseUser) return;
    setEmailActionMode(mode);
    setPrefLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailActionMode: mode }),
      });
      if (!res.ok) throw new Error();
      showToast(`Email action mode set to: ${mode === 'draft' ? 'Save as Draft' : 'Send Directly'}`, 'success');
    } catch {
      showToast('Failed to update email preference', 'error');
    } finally {
      setPrefLoading(false);
    }
  };

  // ── Save Sheets Configuration ──────────────────────────────────────────────
  const handleSaveSheetsConfig = async (data: {
    sheetId: string;
    sheetName: string;
    mapping: Record<string, string>;
  }) => {
    if (!firebaseUser) return;
    setActionLoading('sheets');
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/sheets/configure`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      showToast('Google Sheets configuration saved successfully!', 'success');
      setIsSheetsModalOpen(false);
      await fetchStatus();
    } catch {
      showToast('Failed to save Google Sheets configuration', 'error');
    } finally {
      setActionLoading(null);
    }
  };

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
  const handleSaveWhatsApp = useCallback(async (phoneNumber: string) => {
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
  }, [firebaseUser, fetchStatus]);

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

      {/* Google Sheets Config Modal */}
      <SheetsConfigModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        initialSheetId={statuses?.sheets?.sheetId}
        initialSheetName={statuses?.sheets?.sheetName}
        initialMapping={statuses?.sheets?.mapping}
        onSave={handleSaveSheetsConfig}
        loading={actionLoading === 'sheets'}
      />

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Integrations & Automation</h2>
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

      {/* Email Action Preference Panel */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚙️</span> WhatsApp Hearing Date Email Action
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
              When a WhatsApp message updates a hearing date, decide how client notification emails should be handled.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => handleUpdateEmailMode('draft')}
              disabled={prefLoading}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: emailActionMode === 'draft' ? '#6366f1' : 'transparent',
                color: emailActionMode === 'draft' ? '#ffffff' : '#64748b',
                fontWeight: '600',
                fontSize: '0.83rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              📝 Save as Draft (Gmail)
            </button>
            <button
              onClick={() => handleUpdateEmailMode('send')}
              disabled={prefLoading}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: emailActionMode === 'send' ? '#16a34a' : 'transparent',
                color: emailActionMode === 'send' ? '#ffffff' : '#64748b',
                fontWeight: '600',
                fontSize: '0.83rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              🚀 Send Email Directly
            </button>
          </div>
        </div>
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
            onConfigure={() => setIsSheetsModalOpen(true)}
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
