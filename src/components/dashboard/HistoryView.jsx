import React, { useEffect, useState } from 'react';
import { getHistory } from '../../api';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  bg0: '#03020a', bg1: '#070512', bg2: '#0d0b1e', bg3: '#13102b',
  border:  'rgba(99,102,241,0.18)',
  borderH: 'rgba(99,102,241,0.45)',
  indigo: '#4f46e5', indigoL: '#818cf8',
  purple: '#7c3aed', purpleL: '#a78bfa',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  green: '#22c55e',
  font: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono: "'DM Mono',monospace",
};

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoMsg      = p => <Ico {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
const IcoClock    = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2" />;
const IcoUser     = p => <Ico {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IcoX        = p => <Ico {...p} d="M18 6L6 18M6 6l12 12" />;
const IcoTerminal = p => <Ico {...p} d="M4 17l6-6-6-6M12 19h8" />;
const IcoChevron  = p => <Ico {...p} d="M9 18l6-6-6-6" />;
const IcoSparkle  = p => <Ico {...p} d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />;

export default function HistoryView() {
  const [conversations, setConversations] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getHistory();
        setConversations(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // ── LOADING ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '5rem 2rem', gap: '1.25rem',
      fontFamily: T.font,
    }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(99,102,241,0.15)`, borderTopColor: T.indigoL, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.28)',
        borderRadius: 30, padding: '5px 14px',
      }}>
        <span style={{ color: T.purpleL }}>✦</span>
        <span style={{ color: T.purpleL, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>
          Retrieving Encrypted Logs…
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: T.font }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        .hist-row:hover td { background: rgba(99,102,241,0.04) !important; }
        .hist-row:hover .hist-action { opacity: 1 !important; transform: translateX(0) !important; }
        .hist-row:hover .hist-avatar { transform: scale(1.08); }
        .hist-scroll::-webkit-scrollbar { width: 4px; }
        .hist-scroll::-webkit-scrollbar-track { background: transparent; }
        .hist-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 99px; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', animation: 'fadeUp 0.45s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(79,70,229,0.1)', border: `1px solid rgba(99,102,241,0.28)`,
            borderRadius: 10, padding: '0.45rem', display: 'flex', color: T.indigoL,
          }}>
            <IcoTerminal size={17} stroke={T.indigoL} />
          </div>
          <div>
            {/* section label — same style as landing */}
            <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: T.mono, margin: 0 }}>
              Chat Logs
            </p>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: T.t1, letterSpacing: -0.3, margin: 0 }}>
              Interaction Stream
            </h2>
          </div>
        </div>

        {/* count badge — same pill as landing */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.28)`,
          borderRadius: 30, padding: '5px 14px',
        }}>
          <span style={{ color: T.purpleL, fontSize: 12 }}>✦</span>
          <span style={{ color: T.purpleL, fontSize: 12, fontWeight: 700, fontFamily: T.mono }}>
            {conversations.length}
          </span>
          <span style={{ color: T.t3, fontSize: 11, fontWeight: 600 }}>neural sessions</span>
        </div>
      </div>

      {/* ── TABLE CARD ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        border: `1px solid ${T.border}`,
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'fadeUp 0.5s ease both',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.015)' }}>
                {['Source Identity', 'Last Transmission', 'Timestamp', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: 9, color: T.t3,
                    letterSpacing: '0.16em', fontWeight: 700,
                    textTransform: 'uppercase', textAlign: 'left',
                    fontFamily: T.mono, whiteSpace: 'nowrap',
                    borderBottom: `1px solid ${T.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {conversations.map((convo) => (
                <tr
                  key={convo._id}
                  className="hist-row"
                  onClick={() => setSelectedConvo(convo)}
                  style={{ borderTop: `1px solid ${T.border}`, cursor: 'pointer', transition: 'background 0.15s' }}
                >
                  {/* Identity */}
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        className="hist-avatar"
                        style={{
                          width: 38, height: 38,
                          background: 'rgba(79,70,229,0.1)',
                          border: `1px solid rgba(99,102,241,0.28)`,
                          borderRadius: 10, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: T.indigoL, transition: 'transform 0.2s',
                        }}
                      >
                        <IcoUser size={17} stroke={T.indigoL} />
                      </div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.t1, display: 'block' }}>
                          {convo.customerIdentifier}
                        </span>
                        <span style={{ fontSize: 9, color: T.t3, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: T.mono }}>
                          Verified Lead
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Last message */}
                  <td style={{ padding: '0.875rem 1.25rem', maxWidth: 280 }}>
                    <p style={{
                      fontSize: 13, color: T.t2, fontStyle: 'italic',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      margin: 0,
                    }}>
                      "{convo.messages[convo.messages.length - 1]?.text}"
                    </p>
                  </td>

                  {/* Timestamp */}
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(99,102,241,0.07)', border: `1px solid ${T.border}`,
                      borderRadius: 8, padding: '0.25rem 0.625rem',
                    }}>
                      <IcoClock size={11} stroke={T.indigoL} />
                      <span style={{ fontSize: 11, color: T.indigoL, fontFamily: T.mono }}>
                        {new Date(convo.lastInteraction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                    <div
                      className="hist-action"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        color: T.indigoL, fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        opacity: 0, transform: 'translateX(-6px)',
                        transition: 'all 0.2s',
                        fontFamily: T.mono,
                      }}
                    >
                      Access Logs <IcoChevron size={13} stroke={T.indigoL} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div style={{
          padding: '0.75rem 1.5rem',
          borderTop: `1px solid ${T.border}`,
          fontSize: 10, color: T.t3,
          fontFamily: T.mono, letterSpacing: '0.1em',
        }}>
          {conversations.length} SESSIONS TOTAL
        </div>
      </div>

      {/* ── TRANSCRIPT MODAL ───────────────────────────────────── */}
      {selectedConvo && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.25s ease',
        }}>
          {/* backdrop */}
          <div
            onClick={() => setSelectedConvo(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(3,2,10,0.85)', backdropFilter: 'blur(16px)' }}
          />

          {/* modal */}
          <div style={{
            position: 'relative', zIndex: 1,
            background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
            border: `1px solid ${T.borderH}`,
            borderRadius: 22, width: '100%', maxWidth: 620,
            maxHeight: '88vh', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px ${T.border}`,
            animation: 'slideUp 0.3s cubic-bezier(.34,1.2,.64,1)',
          }}>

            {/* modal header */}
            <header style={{
              padding: '1.25rem 1.5rem',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(3,2,10,0.4)',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  borderRadius: 10, padding: '0.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                }}>
                  <IcoMsg size={18} stroke="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: T.t1, margin: 0, letterSpacing: -0.3 }}>
                    {selectedConvo.customerIdentifier}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, boxShadow: `0 0 6px ${T.green}`, display: 'inline-block', animation: 'pl 2s infinite' }} />
                    <span style={{ fontSize: 9, color: T.green, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: T.mono }}>
                      Live Decryption History
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedConvo(null)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
                  borderRadius: 10, padding: '0.45rem', cursor: 'pointer',
                  color: T.t3, display: 'flex', alignItems: 'center', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.color = T.t1; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; }}
              >
                <IcoX size={16} />
              </button>
            </header>

            {/* messages */}
            <div className="hist-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', background: 'rgba(3,2,10,0.25)' }}>
              {selectedConvo.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
                    animation: `slideUp 0.3s ${idx * 0.04}s ease both`,
                  }}
                >
                  <div style={{
                    maxWidth: '82%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.role === 'user' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(79,70,229,0.22), rgba(124,58,237,0.14))'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${msg.role === 'user' ? T.borderH : T.border}`,
                    fontSize: 13, color: msg.role === 'user' ? T.t1 : T.t2,
                    lineHeight: 1.65,
                  }}>
                    {msg.text}
                    <div style={{
                      fontSize: 9, marginTop: 6, fontFamily: T.mono, opacity: 0.45,
                      textAlign: msg.role === 'user' ? 'left' : 'right',
                      color: T.t3, letterSpacing: '0.08em',
                    }}>
                      [{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* modal footer */}
            <footer style={{
              padding: '0.75rem',
              borderTop: `1px solid ${T.border}`,
              background: 'rgba(3,2,10,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <IcoSparkle size={11} stroke={T.t3} />
              <span style={{ fontSize: 9, color: T.t3, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: T.mono }}>
                End of Secure Transcript
              </span>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}