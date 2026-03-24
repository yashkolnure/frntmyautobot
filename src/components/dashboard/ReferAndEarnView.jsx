import React, { useState, useEffect, useCallback } from 'react';
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
const Ico = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoZap      = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoCopy     = p => <Ico {...p} d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />;
const IcoCheck    = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoAlert    = p => <Ico {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
const IcoShare    = p => <Ico {...p} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />;
const IcoUsers    = p => <Ico {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcoRefresh  = p => <Ico {...p} d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-5.02" />;
const IcoMsg      = p => <Ico {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
const IcoSend     = p => <Ico {...p} d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />;
const IcoLink     = p => <Ico {...p} d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />;
const IcoTrophy   = p => <Ico {...p} d="M8 21h8M12 17v4M17 3H7L5 7c0 3.87 3.13 7 7 7s7-3.13 7-7l-2-4zM5 7H2M19 7h3" />;
const IcoArrow    = p => <Ico {...p} d="M7 17L17 7M7 7h10v10" />;
const IcoNetwork  = p => <Ico {...p} d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM22 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 4v6M5.5 17.5l4-4M18.5 17.5l-4-4M4 18h4M16 18h4" />;

// ─── TOAST ───────────────────────────────────────────────────────────
let _setToast = null;
const triggerToast = (msg, type = 'success') => _setToast?.({ msg, type, id: Date.now() });

// ─── MAIN ────────────────────────────────────────────────────────────
const ReferAndEarnView = ({ user }) => {
  const [copyStatus, setCopyStatus] = useState({ link: false, code: false });
  const [activeCode, setActiveCode] = useState('');
  const [liveStats,  setLiveStats]  = useState({ tokens: 0, count: 0 });
  const [isSyncing,  setIsSyncing]  = useState(true);
  const [toast,      setToast]      = useState(null);
  const [hovWA,      setHovWA]      = useState(false);
  const [hovTG,      setHovTG]      = useState(false);
  const [hovSync,    setHovSync]    = useState(false);

  _setToast = setToast;

  const currentUserId = user?._id || user?.user || localStorage.getItem('userId');
  const API_BASE = '';

  const fetchLiveStats = useCallback(async () => {
    if (!currentUserId) return;
    setIsSyncing(true);
    try {
      const res = await axios.get(`${API_BASE}/api/auth/user-profile/${currentUserId}`);
      if (res.data) {
        setLiveStats({ tokens: res.data.tokens || 0, count: res.data.referralCount || 0 });
        if (res.data.referralCode) setActiveCode(res.data.referralCode);
      }
    } catch (err) { console.error('Live Sync Error:', err); }
    finally { setIsSyncing(false); }
  }, [currentUserId]);

  useEffect(() => { fetchLiveStats(); }, [fetchLiveStats]);

  useEffect(() => {
    const generateAndSync = async () => {
      if (currentUserId && !activeCode && !isSyncing) {
        const code = currentUserId.toString().slice(-6).toUpperCase();
        setActiveCode(code);
        try {
          await axios.patch(`${API_BASE}/api/auth/update-referral`, { userId: currentUserId, referralCode: code });
        } catch (err) { console.error('DB Update failed'); }
      }
    };
    generateAndSync();
  }, [currentUserId, activeCode, isSyncing]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const referralLink = `https://myautobot.in/login?ref=${activeCode || 'SYNCING'}`;

  const copyToClipboard = (text, type) => {
    if (!activeCode) return;
    navigator.clipboard.writeText(text);
    setCopyStatus(s => ({ ...s, [type]: true }));
    triggerToast(type === 'link' ? 'Referral link copied!' : 'Code copied!');
    setTimeout(() => setCopyStatus(s => ({ ...s, [type]: false })), 2000);
  };

  const progress = Math.min(liveStats.count * 10, 100);
  const nextBonus = (Math.floor(liveStats.count / 10) + 1) * 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem', fontFamily: T.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes progBar { from{width:0} to{width:${progress}%} }
        .ref-grid { display: grid; grid-template-columns: 1fr 300px; gap: 1.25rem; }
        @media(max-width:900px){ .ref-grid { grid-template-columns: 1fr; } }
        .copy-input { transition: border-color 0.2s; }
        .copy-input:hover { border-color: rgba(99,102,241,0.38) !important; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.92)' : 'rgba(22,163,74,0.92)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
          borderRadius: 12, padding: '0.65rem 1.1rem',
          fontSize: 13, fontWeight: 600, color: 'white',
          animation: 'slideIn 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          {toast.type === 'error' ? <IcoAlert size={14} stroke="white" /> : <IcoCheck size={14} stroke="white" sw={2.5} />}
          {toast.msg}
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(59,130,246,0.05), rgba(124,58,237,0.08))',
        border: `1px solid ${T.border}`, borderRadius: 22, padding: '2rem',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.5s ease both',
      }}>
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', width: 200, height: 200, background: 'radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            {/* section label */}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: T.purpleL, textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 12 }}>
              Propagation Protocol
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: T.t1, letterSpacing: -0.8, margin: 0 }}>
                Refer &{' '}
                <span style={{ backgroundImage: 'linear-gradient(135deg,#818cf8,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shim 5s linear infinite' }}>
                  Earn
                </span>
              </h2>
              {/* syncing badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: isSyncing ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                border: `1px solid ${isSyncing ? 'rgba(245,158,11,0.28)' : 'rgba(34,197,94,0.28)'}`,
                borderRadius: 30, padding: '4px 12px',
              }}>
                {isSyncing
                  ? <span style={{ width: 12, height: 12, border: '2px solid rgba(245,158,11,0.3)', borderTopColor: T.amber, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  : <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block', animation: 'pl 2s infinite' }} />
                }
                <span style={{ color: isSyncing ? T.amber : '#4ade80', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', fontFamily: T.mono }}>
                  {isSyncing ? 'Syncing…' : 'Live'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.75, maxWidth: 480, margin: '0 0 1.25rem' }}>
              For every operator who joins via your invitation,{' '}
              <strong style={{ color: T.t1 }}>50 Bonus Tokens</strong> are granted to both nodes instantly.
            </p>

            {/* refresh button */}
            <button onClick={fetchLiveStats} disabled={isSyncing} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.5rem 0.875rem', borderRadius: 10,
              background: hovSync ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hovSync ? T.borderH : T.border}`,
              color: hovSync ? T.indigoL : T.t3,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: isSyncing ? 'not-allowed' : 'pointer', fontFamily: T.font,
              opacity: isSyncing ? 0.6 : 1, transition: 'all 0.2s',
            }}
              onMouseEnter={() => setHovSync(true)}
              onMouseLeave={() => setHovSync(false)}
            >
              <IcoRefresh size={13} style={isSyncing ? { animation: 'spin 0.8s linear infinite' } : {}} />
              Refresh Stats
            </button>
          </div>

          {/* Trophy badge */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{
              width: 88, height: 88, borderRadius: 20,
              background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
              border: `1px solid rgba(124,58,237,0.3)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
              position: 'relative', zIndex: 1,
            }}>
              <IcoTrophy size={28} stroke={T.purpleL} />
              <span style={{ fontSize: 9, fontWeight: 700, color: T.purpleL, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.mono }}>Legacy</span>
            </div>
          </div>
        </div>

        {/* decorative network icon */}
        <div style={{ position: 'absolute', right: '-1.5rem', bottom: '-1.5rem', opacity: 0.05, transform: 'rotate(-8deg)' }}>
          <IcoNetwork size={130} stroke={T.purpleL} sw={1} />
        </div>
      </div>

      {/* ── MAIN GRID ────────────────────────────────────────────── */}
      <div className="ref-grid">

        {/* ── LEFT: INVITATION MANAGEMENT ── */}
        <div style={{
          background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
          border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden',
          animation: 'fadeUp 0.55s ease both',
        }}>
          {/* toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.5rem', borderBottom: `1px solid ${T.border}`,
            background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
          }}>
            <h4 style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 10, fontWeight: 700, color: T.indigoL,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: T.mono, margin: 0,
            }}>
              <IcoShare size={14} stroke={T.indigoL} /> Invitation Management
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '4px 10px' }}>
              <IcoZap size={11} stroke={T.amber} />
              <span style={{ fontSize: 10, fontWeight: 700, color: T.amber, fontFamily: T.mono }}>+50 Tokens / Invite</span>
            </div>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* REFERRAL LINK */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <label style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>
                  Your Neural Link
                </label>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.indigoL, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Global Protocol
                </span>
              </div>
              <div className="copy-input" style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: T.bg0, border: `1px solid ${T.border}`, borderRadius: 12,
                padding: '0.75rem 0.75rem 0.75rem 1rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ flex: 1, fontFamily: T.mono, fontSize: 12, color: T.indigoL, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                  {referralLink}
                </span>
                <button onClick={() => copyToClipboard(referralLink, 'link')} style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  padding: '0.5rem 1rem', borderRadius: 9,
                  background: copyStatus.link ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  border: copyStatus.link ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
                  color: copyStatus.link ? '#4ade80' : 'white',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: T.font,
                  boxShadow: copyStatus.link ? 'none' : '0 4px 14px rgba(79,70,229,.3)',
                  transition: 'all 0.2s',
                }}>
                  {copyStatus.link ? <IcoCheck size={13} stroke="#4ade80" sw={2.5} /> : <IcoCopy size={13} />}
                  {copyStatus.link ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* REFERRAL CODE */}
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: '0.625rem' }}>
                Manual Access Code
              </label>
              <div className="copy-input" style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: T.bg0, border: `1px solid ${T.border}`, borderRadius: 12,
                padding: '0.75rem 0.75rem 0.75rem 1rem',
              }}>
                <span style={{ flex: 1, fontFamily: T.mono, fontSize: 22, fontWeight: 900, color: T.t1, letterSpacing: '0.4em' }}>
                  {activeCode || '——————'}
                </span>
                <button onClick={() => copyToClipboard(activeCode, 'code')} style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  padding: '0.5rem 0.875rem', borderRadius: 9,
                  background: copyStatus.code ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${copyStatus.code ? 'rgba(34,197,94,0.3)' : T.border}`,
                  color: copyStatus.code ? '#4ade80' : T.t3,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: T.font, transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!copyStatus.code) { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.color = T.t1; } }}
                  onMouseLeave={e => { if (!copyStatus.code) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; } }}
                >
                  {copyStatus.code ? <IcoCheck size={13} stroke="#4ade80" sw={2.5} /> : <IcoCopy size={13} />}
                  {copyStatus.code ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* SHARE BUTTONS */}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '1.25rem' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: '0.75rem' }}>
                Share Via
              </p>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {/* WhatsApp */}
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Deploy your AI Agent on MyAutoBot! Use my code ' + activeCode + ' for 50 bonus tokens: ' + referralLink)}`)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '0.75rem', borderRadius: 11,
                    background: hovWA ? 'rgba(34,197,94,0.18)' : 'rgba(34,197,94,0.08)',
                    border: `1px solid ${hovWA ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.22)'}`,
                    color: '#4ade80', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: T.font, transition: 'all 0.2s',
                  }}
                  onMouseEnter={() => setHovWA(true)} onMouseLeave={() => setHovWA(false)}
                >
                  <IcoMsg size={14} stroke="#4ade80" /> WhatsApp
                </button>
                {/* Telegram */}
                <button onClick={() => window.open(`https://t.me/share/url?url=${referralLink}`)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '0.75rem', borderRadius: 11,
                    background: hovTG ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.08)',
                    border: `1px solid ${hovTG ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.22)'}`,
                    color: '#93c5fd', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: T.font, transition: 'all 0.2s',
                  }}
                  onMouseEnter={() => setHovTG(true)} onMouseLeave={() => setHovTG(false)}
                >
                  <IcoSend size={14} stroke="#93c5fd" /> Telegram
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: STATUS HUB ── */}
        <div style={{
          background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
          border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden',
          animation: 'fadeUp 0.6s ease both',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.5rem', borderBottom: `1px solid ${T.border}`,
            background: 'rgba(0,0,0,0.2)',
          }}>
            <h4 style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 10, fontWeight: 700, color: T.indigoL,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: T.mono, margin: 0,
            }}>
              <IcoUsers size={14} stroke={T.indigoL} /> Status Hub
            </h4>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>

            {/* Tokens Accrued */}
            <div style={{
              background: 'rgba(0,0,0,0.3)', border: `1px solid ${T.border}`,
              borderRadius: 14, padding: '1.25rem', textAlign: 'center',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.875rem' }}>
                <IcoZap size={20} stroke={T.purpleL} />
              </div>
              <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, margin: '0 0 6px' }}>
                Tokens Accrued
              </p>
              <p style={{ fontSize: 40, fontWeight: 900, color: T.purpleL, fontFamily: T.mono, margin: 0, letterSpacing: -2, lineHeight: 1 }}>
                {liveStats.count * 50}
              </p>
            </div>

            {/* Stat rows */}
            {[
              { label: 'Total Invites',   value: liveStats.count, color: T.indigoL },
              { label: 'Yield Rate',      value: '+50 / Node',    color: T.amber   },
              { label: 'Current Balance', value: `${liveStats.tokens?.toLocaleString()} tkns`, color: '#4ade80' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`,
              }}>
                <span style={{ fontSize: 10, color: T.t3, fontFamily: T.mono, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: s.color, fontFamily: T.mono }}>{s.value}</span>
              </div>
            ))}

            {/* Progress bar */}
            <div style={{ padding: '0.875rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.t3, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Progress</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.indigoL, fontFamily: T.mono }}>Next bonus @ {nextBonus}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #818cf8)',
                  transition: 'width 1s ease',
                  boxShadow: '0 0 8px rgba(124,58,237,0.5)',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                <span style={{ fontSize: 8, color: T.t3, fontFamily: T.mono }}>Rank: Initiate</span>
                <span style={{ fontSize: 8, color: T.t3, fontFamily: T.mono }}>{progress}%</span>
              </div>
            </div>

            {/* Level badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.625rem', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <IcoArrow size={13} stroke={T.purpleL} />
              <span style={{ fontSize: 10, fontWeight: 700, color: T.purpleL, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Propagation Level 1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarnView;