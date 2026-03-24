import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  bg0: '#03020a', bg1: '#070512', bg2: '#0d0b1e', bg3: '#13102b',
  border:  'rgba(99,102,241,0.18)',
  borderH: 'rgba(99,102,241,0.45)',
  indigo: '#4f46e5', indigoL: '#818cf8',
  purple: '#7c3aed', purpleL: '#a78bfa',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  green: '#22c55e', red: '#ef4444', amber: '#f59e0b',
  font: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono: "'DM Mono',monospace",
};

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, stroke = 'currentColor', fill = 'none', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoMsg      = p => <Ico {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
const IcoX        = p => <Ico {...p} d="M18 6L6 18M6 6l12 12" />;
const IcoSend     = p => <Ico {...p} fill="currentColor" stroke="none" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />;
const IcoBot      = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z" />;
const IcoRefresh  = p => <Ico {...p} d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-5.02" />;
const IcoShield   = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoZap      = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoTrash    = p => <Ico {...p} d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />;

// ─── MAIN ────────────────────────────────────────────────────────────
const ChatTest = ({ botId }) => {
  const [isOpen,       setIsOpen]       = useState(false);
  const [input,        setInput]        = useState('');
  const [displayName,  setDisplayName]  = useState('Neural Bot');
  const [isLoading,    setIsLoading]    = useState(false);
  const [isSyncing,    setIsSyncing]    = useState(false);
  const [messages,     setMessages]     = useState([]);
  const [inputHov,     setInputHov]     = useState(false);
  const [btnHov,       setBtnHov]       = useState(false);
  const [clearHov,     setClearHov]     = useState(false);
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  // Sync bot name on open
  useEffect(() => {
    const syncBotMetadata = async () => {
      if (!isOpen || !botId) return;
      setIsSyncing(true);
      try {
        const res = await axios.get(`/api/config/${botId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.data?.botConfig?.name) {
          setDisplayName(res.data.botConfig.name);
          if (messages.length === 0) {
            setMessages([{ role: 'bot', content: `Neural link established with ${res.data.botConfig.name}. Protocol ready.` }]);
          }
        }
      } catch (err) { console.error('Failed to sync bot name:', err); }
      finally { setIsSyncing(false); }
    };
    syncBotMetadata();
  }, [isOpen, botId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userQuery = input.trim();
    const newUserMsg = { role: 'user', content: userQuery };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    try {
      const res = await axios.post('/api/chat', {
        message: userQuery,
        history: updatedMessages,
        userId: localStorage.getItem('userId'),
        botId,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } });
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'bot', content: res.data.reply }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: '⚠️ Neural pathway blocked. Check local LLM status.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fadeOut { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(12px) scale(.97)} }
        @keyframes msgIn   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotPl   { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }

        .chat-widget-panel {
          animation: fadeUp 0.25s cubic-bezier(.34,1.2,.64,1) both;
        }
        .chat-msg { animation: msgIn .22s ease both; }
        .chat-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:${T.purpleL}; }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 3px; }
        .fab-btn { transition: transform 0.2s cubic-bezier(.34,1.4,.64,1), box-shadow 0.2s ease; }
        .fab-btn:hover { transform: scale(1.06) rotate(2deg); box-shadow: 0 20px 50px rgba(79,70,229,0.55) !important; }
        .fab-btn:active { transform: scale(0.95); }
        .send-btn:not(:disabled):hover { box-shadow: 0 6px 20px rgba(79,70,229,.5) !important; transform: translateY(-1px); }
        .send-btn { transition: all 0.2s ease; }
      `}</style>

      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: T.font }}>

        {/* ── CHAT PANEL ── */}
        {isOpen && (
          <div className="chat-widget-panel" style={{
            position: 'absolute', bottom: 76, right: 0,
            width: 'clamp(320px, 90vw, 420px)', height: 580,
            background: `${T.bg1}f7`, backdropFilter: 'blur(24px)',
            border: `1px solid ${T.border}`,
            borderRadius: 22, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)',
          }}>

            {/* HEADER */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
              borderBottom: `1px solid ${T.border}`,
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Bot avatar */}
                <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                  }}>
                    <IcoBot size={18} stroke="white" sw={2} />
                  </div>
                  {isSyncing && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: 11,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IcoRefresh size={12} stroke="white" style={{ animation: 'spin 0.8s linear infinite' }} />
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.purpleL, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 3 }}>
                    Neural Tester
                  </div>
                  <h3 style={{
                    fontSize: 13, fontWeight: 800, color: T.t1, margin: 0, letterSpacing: -0.2,
                    maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    backgroundImage: 'linear-gradient(135deg,#f1f5f9,#a78bfa)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundSize: '200%', animation: 'shim 5s linear infinite',
                  }}>
                    {displayName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: isSyncing ? T.amber : T.green, display: 'inline-block', animation: 'pl 2s infinite' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: T.t3, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {isSyncing ? 'Syncing…' : 'Local Link Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header actions */}
              <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    title="Clear chat"
                    onMouseEnter={() => setClearHov(true)}
                    onMouseLeave={() => setClearHov(false)}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: clearHov ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${clearHov ? 'rgba(239,68,68,0.35)' : T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: clearHov ? T.red : T.t3, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    <IcoTrash size={13} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.t3, cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.color = T.t1; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; }}
                >
                  <IcoX size={14} />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="chat-scroll" style={{
              flex: 1, overflowY: 'auto', padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              background: T.bg0,
            }}>
              {messages.length === 0 && !isLoading && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1rem', gap: '0.875rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 15,
                    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(79,70,229,0.4)' }}>
                    <IcoBot size={24} stroke="white" sw={2} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.t1, margin: '0 0 4px' }}>{displayName}</p>
                    <p style={{ fontSize: 12, color: T.t3, margin: 0 }}>Ask anything to test your bot.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['What can you do?', 'Tell me about yourself', 'Help me get started'].map(q => (
                      <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }} style={{
                        padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                        background: 'rgba(99,102,241,0.08)', border: `1px solid ${T.border}`,
                        color: T.indigoL, fontSize: 11, fontWeight: 600, fontFamily: T.font, transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)'; e.currentTarget.style.borderColor = T.borderH; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = T.border; }}
                      >{q}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="chat-msg" style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animationDelay: `${i * 0.03}s`,
                }}>
                  {msg.role === 'bot' && (
                    <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginRight: 8, marginTop: 2,
                      background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IcoBot size={13} stroke="white" sw={2} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '82%', padding: '0.625rem 0.875rem', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                      : msg.isError
                        ? 'rgba(239,68,68,0.08)'
                        : `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
                    border: msg.role === 'user'
                      ? '1px solid transparent'
                      : msg.isError
                        ? '1px solid rgba(239,68,68,0.28)'
                        : `1px solid ${T.border}`,
                    color: msg.role === 'user' ? 'white' : msg.isError ? '#fca5a5' : T.t2,
                    fontSize: 13, lineHeight: 1.6,
                    boxShadow: msg.role === 'user' ? '0 4px 14px rgba(79,70,229,0.3)' : 'none',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="chat-msg" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IcoBot size={13} stroke="white" sw={2} />
                  </div>
                  <div style={{
                    padding: '0.75rem 1rem', borderRadius: '14px 14px 14px 4px',
                    background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
                    border: `1px solid ${T.border}`,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {[0, 1, 2].map(j => (
                      <span key={j} className="chat-dot" style={{ animation: `dotPl 1.2s ${j * 0.22}s ease-in-out infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* INPUT */}
            <div style={{
              padding: '0.875rem 1rem',
              background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
              borderTop: `1px solid ${T.border}`,
              flexShrink: 0,
            }}>
              <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  background: T.bg0,
                  border: `1px solid ${inputHov ? T.borderH : T.border}`,
                  borderRadius: 12, padding: '0.625rem 0.875rem',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={() => setInputHov(true)}
                  onMouseLeave={() => setInputHov(false)}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a question…"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      color: T.t1, fontSize: 13, fontFamily: T.font,
                    }}
                  />
                </div>
                <button type="submit" disabled={isLoading || !input.trim()} className="send-btn"
                  style={{
                    width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                    background: input.trim() && !isLoading ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)',
                    border: input.trim() && !isLoading ? '1px solid transparent' : `1px solid ${T.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    boxShadow: input.trim() && !isLoading ? '0 4px 14px rgba(79,70,229,.35)' : 'none',
                    opacity: isLoading ? 0.6 : 1,
                  }}>
                  {isLoading
                    ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                    : <IcoSend size={15} fill={input.trim() ? 'white' : T.t3} />}
                </button>
              </form>

              {/* Footer badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem', padding: '0 0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.t3 }}>
                  <IcoShield size={10} stroke="#4ade80" />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>RAG Secure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.t3 }}>
                  <IcoZap size={10} stroke={T.purpleL} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>Neural Link</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FAB TOGGLE ── */}
        <button className="fab-btn" onClick={() => setIsOpen(v => !v)} style={{
          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
          background: isOpen ? `linear-gradient(145deg,${T.bg2},${T.bg3})` : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
          border: `1px solid ${isOpen ? T.borderH : 'transparent'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 8px 24px rgba(0,0,0,0.4)' : '0 12px 36px rgba(79,70,229,0.45)',
          position: 'relative',
        }}>
          {isOpen
            ? <IcoX size={22} stroke={T.indigoL} sw={2} />
            : <IcoMsg size={22} stroke="white" fill="white" sw={1.5} />
          }
          {/* Online dot */}
          {!isOpen && (
            <div style={{
              position: 'absolute', top: -3, right: -3,
              width: 14, height: 14, borderRadius: '50%',
              background: T.green, border: `2px solid ${T.bg0}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pl 1.5s infinite' }} />
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default ChatTest;