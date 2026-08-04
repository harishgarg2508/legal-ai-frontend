'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard.module.css';
import Link from 'next/link';

export default function DocumentsPage() {
  const { firebaseUser } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'IMAGES' | 'VIDEOS' | 'DOCS'>('ALL');
  const [search, setSearch] = useState('');
  const [driveConnected, setDriveConnected] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const fetchDocsAndSetup = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const [resDocs, resIntegrations] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/document-router`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (resDocs.ok) {
        setDocuments(await resDocs.json());
      }
      if (resIntegrations.ok) {
        const data = await resIntegrations.json();
        setDriveConnected(data.drive?.connected || false);
      }
    } catch (e) {
      console.error('Failed to load documents directory', e);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchDocsAndSetup();
  }, [fetchDocsAndSetup]);

  // Determine category group
  const getDocCategory = (mime: string) => {
    if (mime.startsWith('image/')) return 'IMAGES';
    if (mime.startsWith('video/')) return 'VIDEOS';
    return 'DOCS';
  };

  const filteredDocs = documents.filter((d) => {
    // Tab Filter
    const cat = getDocCategory(d.mimeType);
    if (activeTab !== 'ALL' && cat !== activeTab) return false;

    // Search Filter
    const q = search.toLowerCase();
    const caseTitle = d.case?.title || '';
    const clientName = d.case?.client?.name || '';
    return (
      d.fileName.toLowerCase().includes(q) ||
      d.originalFileName.toLowerCase().includes(q) ||
      caseTitle.toLowerCase().includes(q) ||
      clientName.toLowerCase().includes(q) ||
      (d.summary && d.summary.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#64748b' }}>
        <span>Loading documents directory...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>Documents</h2>
          <p className={styles.pageSubheading}>Case media and files processed via AI Document Router</p>
        </div>
      </div>

      {/* Drive Status Notice */}
      {!driveConnected && (
        <div
          style={{
            padding: '14px 20px',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            color: '#b45309',
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
            <strong>⚠️ Google Drive is not connected:</strong> Documents sent via WhatsApp cannot be organized until you enable Google Drive integrations.
          </div>
          <Link
            href="/integrations"
            style={{
              fontWeight: '700',
              textDecoration: 'underline',
              color: '#d97706',
            }}
          >
            Connect Drive Now →
          </Link>
        </div>
      )}

      {/* Documents Toolbar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search files by name, client, case, or summary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '260px',
            padding: '10px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />

        {/* Tab Filters */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
          {(['ALL', 'IMAGES', 'VIDEOS', 'DOCS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? '#0f172a' : '#64748b',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {tab === 'ALL' && '📁 All'}
              {tab === 'IMAGES' && '🖼️ Images'}
              {tab === 'VIDEOS' && '🎥 Videos'}
              {tab === 'DOCS' && '📄 Documents'}
            </button>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className={styles.panel} style={{ padding: '20px' }}>
        {filteredDocs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📁</div>
            <h4 style={{ margin: '0 0 6px', fontWeight: '700', color: '#1e293b' }}>No Files Found</h4>
            <p style={{ margin: '0', fontSize: '0.8rem' }}>
              Files sent via WhatsApp from registered clients will automatically appear here grouped by case.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className={styles.desktopTable} style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', fontWeight: '700' }}>
                    <th style={{ padding: '12px 16px', width: '25%' }}>FILE NAME & TYPE</th>
                    <th style={{ padding: '12px 16px', width: '20%' }}>CASE FILE & CLIENT</th>
                    <th style={{ padding: '12px 16px', width: '35%' }}>AI SUMMARY</th>
                    <th style={{ padding: '12px 16px', width: '10%' }}>PROCESSED DATE</th>
                    <th style={{ padding: '12px 16px', width: '10%', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => {
                    const cat = getDocCategory(doc.mimeType);
                    return (
                      <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.83rem', color: '#334155' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>
                              {cat === 'IMAGES' && '🖼️'}
                              {cat === 'VIDEOS' && '🎥'}
                              {cat === 'DOCS' && '📄'}
                            </span>
                            <div>
                              <div style={{ fontWeight: '700', color: '#0f172a' }}>{doc.fileName}</div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                                Original: {doc.originalFileName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: '600' }}>{doc.case?.title || 'Unassigned Case'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                            👤 {doc.case?.client?.name || 'Unknown'}
                          </div>
                        </td>
                        <td style={{ padding: '16px', maxWidth: '300px' }}>
                          {doc.summary ? (
                            <div
                              onClick={() => setSelectedDoc(doc)}
                              style={{
                                color: '#2563eb',
                                cursor: 'pointer',
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textDecoration: 'underline',
                              }}
                            >
                              {doc.summary}
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>No OCR text found</span>
                          )}
                        </td>
                        <td style={{ padding: '16px', color: '#64748b' }}>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {doc.driveUrl ? (
                            <a
                              href={doc.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.primaryBtn}
                              style={{
                                padding: '6px 12px',
                                fontSize: '0.75rem',
                                background: '#2563eb',
                                boxShadow: 'none',
                                borderRadius: '6px',
                                display: 'inline-block',
                              }}
                            >
                              👁️ View in Drive
                            </a>
                          ) : doc.message?.mediaId ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/media/download?mediaId=${doc.message.mediaId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.primaryBtn}
                              style={{
                                padding: '6px 12px',
                                fontSize: '0.75rem',
                                background: '#16a34a',
                                boxShadow: 'none',
                                borderRadius: '6px',
                                display: 'inline-block',
                              }}
                            >
                              ⬇️ Download File
                            </a>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600' }}>Offline</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className={styles.mobileCards}>
              {filteredDocs.map((doc) => {
                const cat = getDocCategory(doc.mimeType);
                return (
                  <div key={doc.id} className={styles.mobileCard}>
                    <div className={styles.mobileCardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1, marginRight: '8px' }}>
                        <span style={{ fontSize: '1rem', flexShrink: 0 }}>
                          {cat === 'IMAGES' && '🖼️'}
                          {cat === 'VIDEOS' && '🎥'}
                          {cat === 'DOCS' && '📄'}
                        </span>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.fileName}
                        </div>
                      </div>
                      <div>
                        {doc.driveUrl ? (
                          <a
                            href={doc.driveUrl}
                            target="_blank; noreferrer"
                            style={{
                              background: '#eff6ff',
                              color: '#2563eb',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.68rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                            }}
                          >
                            Drive
                          </a>
                        ) : doc.message?.mediaId ? (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/media/download?mediaId=${doc.message.mediaId}`}
                            target="_blank"
                            style={{
                              background: '#f0fdf4',
                              color: '#16a34a',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.68rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                            }}
                          >
                            ⬇️ Download
                          </a>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Offline</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.mobileCardBody}>
                      <div className={styles.mobileCardRow}>
                        <span className={styles.mobileCardLabel}>Case:</span>
                        <span className={styles.mobileCardValue} style={{ fontWeight: '700' }}>
                          {doc.case?.title || 'Unassigned Case'}
                        </span>
                      </div>
                      <div className={styles.mobileCardRow}>
                        <span className={styles.mobileCardLabel}>Client:</span>
                        <span className={styles.mobileCardValue}>{doc.case?.client?.name || 'Unknown'}</span>
                      </div>
                      {doc.summary && (
                        <div className={styles.mobileCardRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                          <span className={styles.mobileCardLabel}>AI Summary:</span>
                          <span
                            onClick={() => setSelectedDoc(doc)}
                            style={{
                              color: '#2563eb',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.78rem',
                              textDecoration: 'underline',
                            }}
                          >
                            {doc.summary}
                          </span>
                        </div>
                      )}
                      <div className={styles.mobileCardRow}>
                        <span className={styles.mobileCardLabel}>Processed:</span>
                        <span className={styles.mobileCardValue}>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* OCR & AI Summary Details Modal */}
      {selectedDoc && (
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
          onClick={() => setSelectedDoc(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '500px',
              padding: '24px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>AI Document Analysis</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              <div>
                <strong>File Name:</strong> {selectedDoc.fileName}
              </div>
              <div>
                <strong>Original Name:</strong> {selectedDoc.originalFileName}
              </div>
              <div>
                <strong>Mime Type:</strong> {selectedDoc.mimeType}
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <strong style={{ display: 'block', marginBottom: '6px', color: '#1e293b' }}>AI Summary:</strong>
                <p style={{ margin: 0, color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  {selectedDoc.summary}
                </p>
              </div>
              {selectedDoc.ocrText && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <strong style={{ display: 'block', marginBottom: '6px', color: '#1e293b' }}>Extracted OCR Text:</strong>
                  <div
                    style={{
                      maxHeight: '180px',
                      overflowY: 'auto',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      background: '#0f172a',
                      color: '#38bdf8',
                      padding: '12px',
                      borderRadius: '8px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {selectedDoc.ocrText}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
