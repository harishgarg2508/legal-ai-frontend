'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/dashboard.module.css';
import inboxStyles from './inbox.module.css';

interface Conversation {
  clientId?: string | null;
  clientName: string;
  phone: string;
  lastMessage: string;
  lastTimestamp: string;
  direction: 'INBOUND' | 'OUTBOUND';
}

interface MessageItem {
  id: string;
  userId: string;
  clientId?: string | null;
  direction: 'INBOUND' | 'OUTBOUND';
  type: string;
  text?: string | null;
  mediaId?: string | null;
  mediaUrl?: string | null;
  mimeType?: string | null;
  createdAt: string;
}

export default function InboxPage() {
  const { firebaseUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const streamRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── 1. Fetch Conversations List ─────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data: Conversation[] = await res.json();
        setConversations(data);
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to fetch conversations', e);
    } finally {
      setLoadingChats(false);
    }
  }, [firebaseUser, selectedConversation]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // ── 2. Fetch Active Chat Messages History ────────────────────────────────────
  const fetchChatHistory = useCallback(async () => {
    if (!firebaseUser || !selectedConversation) return;
    try {
      const token = await firebaseUser.getIdToken();
      const url = selectedConversation.clientId
        ? `${process.env.NEXT_PUBLIC_API_URL}/messages/chat?clientId=${selectedConversation.clientId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/messages/chat?phone=${encodeURIComponent(selectedConversation.phone)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error('Failed to fetch chat history', e);
    }
  }, [firebaseUser, selectedConversation]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [messages]);

  // ── 3. Send WhatsApp Reply ──────────────────────────────────────────────────
  const handleSendReply = async () => {
    if (!firebaseUser || !selectedConversation || !replyText.trim() || sending) return;

    setSending(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/reply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedConversation.phone,
          body: replyText.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to send reply');

      setReplyText('');
      showToast('Reply sent successfully!', 'success');
      await fetchChatHistory();
      await fetchConversations();
    } catch (e: any) {
      showToast(e.message || 'Error sending reply', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );

  return (
    <div>
      {toast && (
        <div
          className={`${inboxStyles.toast} ${
            toast.type === 'success' ? inboxStyles.toastSuccess : inboxStyles.toastError
          }`}
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageHeading}>WhatsApp Live Inbox</h2>
          <p className={styles.pageSubheading}>
            Real-time client conversations & document activity synced with PostgreSQL
          </p>
        </div>
      </div>

      <div className={inboxStyles.inboxWrapper}>
        <div className={inboxStyles.splitLayout}>
          {/* Left Panel: Conversation Directory */}
          <div className={inboxStyles.sidebar}>
            <div className={inboxStyles.searchBox}>
              <input
                type="text"
                className={inboxStyles.searchInput}
                placeholder="🔍 Search client or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={inboxStyles.conversationList}>
              {loadingChats ? (
                <div className={inboxStyles.emptyState}>Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className={inboxStyles.emptyState}>No WhatsApp messages found yet.</div>
              ) : (
                filteredConversations.map((item, idx) => {
                  const isSelected =
                    selectedConversation?.phone === item.phone ||
                    (selectedConversation?.clientId &&
                      selectedConversation.clientId === item.clientId);

                  return (
                    <div
                      key={item.phone || idx}
                      className={`${inboxStyles.conversationCard} ${
                        isSelected ? inboxStyles.activeCard : ''
                      }`}
                      onClick={() => setSelectedConversation(item)}
                    >
                      <div className={inboxStyles.avatar}>
                        {item.clientName.charAt(0).toUpperCase()}
                      </div>
                      <div className={inboxStyles.cardContent}>
                        <div className={inboxStyles.cardHeader}>
                          <span className={inboxStyles.clientName}>{item.clientName}</span>
                          <span className={inboxStyles.timestamp}>
                            {new Date(item.lastTimestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className={inboxStyles.lastMessage}>
                          {item.direction === 'OUTBOUND' ? 'You: ' : ''}
                          {item.lastMessage}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Center Panel: Active Chat Stream */}
          <div className={inboxStyles.chatMain}>
            {selectedConversation ? (
              <>
                <div className={inboxStyles.chatHeader}>
                  <div className={inboxStyles.activeClientInfo}>
                    <div className={inboxStyles.avatar}>
                      {selectedConversation.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={inboxStyles.activeName}>
                        {selectedConversation.clientName}
                      </div>
                      <div className={inboxStyles.activePhone}>{selectedConversation.phone}</div>
                    </div>
                  </div>
                </div>

                <div className={inboxStyles.chatStream} ref={streamRef}>
                  {messages.length === 0 ? (
                    <div className={inboxStyles.emptyState}>No history with this client.</div>
                  ) : (
                    messages.map((msg) => {
                      const isOutbound = msg.direction === 'OUTBOUND';
                      return (
                        <div
                          key={msg.id}
                          className={`${inboxStyles.bubble} ${
                            isOutbound ? inboxStyles.outbound : inboxStyles.inbound
                          }`}
                        >
                          <div>{msg.text}</div>

                          {/* Render media attachments / downloads */}
                          {msg.mediaId && (
                            <div className={inboxStyles.mediaCard}>
                              <span>📎 [{msg.type.toUpperCase()}] Attachment</span>
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/media/download?mediaId=${msg.mediaId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={inboxStyles.mediaDownloadBtn}
                              >
                                Download
                              </a>
                            </div>
                          )}

                          <div className={inboxStyles.bubbleMeta}>
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isOutbound && <span>✓✓</span>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply Input Bar */}
                <div className={inboxStyles.replyContainer}>
                  <div className={inboxStyles.replyForm}>
                    <textarea
                      className={inboxStyles.replyInput}
                      placeholder={`Type reply to ${selectedConversation.clientName}... (Ctrl + Enter to send)`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      disabled={sending}
                    />
                    <button
                      className={inboxStyles.sendBtn}
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                    >
                      {sending ? 'Sending...' : '➤ Send'}
                    </button>
                  </div>
                  <div className={inboxStyles.keyboardHint}>Press Ctrl + Enter to send reply</div>
                </div>
              </>
            ) : (
              <div className={inboxStyles.emptyState} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                Select a conversation from the sidebar to view chat history.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
