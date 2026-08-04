import { useState, useRef } from 'react';

interface ReplyState {
  sending: boolean;
  feedback: { type: 'success' | 'error'; text: string } | null;
}

interface Props {
  to: string; // phone number to reply to
}

export default function ReplyPanel({ to }: Props) {
  const [body, setBody] = useState('');
  const [state, setState] = useState<ReplyState>({ sending: false, feedback: null });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendReply = async () => {
    const trimmed = body.trim();
    if (!trimmed || state.sending) return;

    setState({ sending: true, feedback: null });

    try {
      const res = await fetch('http://localhost:3000/api/v1/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, body: trimmed }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Unknown error');
      }

      setBody('');
      setState({ sending: false, feedback: { type: 'success', text: '✅ Message sent successfully!' } });
    } catch (err: any) {
      setState({ sending: false, feedback: { type: 'error', text: `❌ ${err.message}` } });
    } finally {
      // Clear feedback after 4 seconds
      setTimeout(() => setState((s) => ({ ...s, feedback: null })), 4000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendReply();
    }
  };

  return (
    <div className="reply-panel">
      <div className="reply-panel-header">
        💬 Reply to +{to}
      </div>
      <div className="reply-panel-body">
        <textarea
          ref={textareaRef}
          className="reply-input"
          placeholder="Type your reply... (Ctrl+Enter to send)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={state.sending}
          rows={1}
        />
        <button
          className="reply-send-btn"
          onClick={sendReply}
          disabled={!body.trim() || state.sending}
        >
          {state.sending ? '⏳ Sending...' : '➤ Send'}
        </button>
      </div>
      {state.feedback && (
        <div className={`reply-feedback ${state.feedback.type}`}>
          {state.feedback.text}
        </div>
      )}
    </div>
  );
}
