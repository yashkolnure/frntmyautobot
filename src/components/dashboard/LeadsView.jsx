import React, { useEffect, useState } from 'react';
import API from '../../api';

// ─── DESIGN TOKENS (identical to DeveloperPortal) ────────────────────
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

// ─── INLINE ICONS (SVG paths, no external deps) ──────────────────────
const Ico = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoCheck = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoAlert = p => <Ico {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;

const IcoMail = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcoPhone = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.93-1.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IcoCopy = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IcoMsg = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IcoDB = ({ size = 15, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const IcoSearch = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoCal = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoDown = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoTrend = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.4 }}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const IcoUsers = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoZap = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

// ─── TOAST ───────────────────────────────────────────────────────────
let _setToast = null;
const triggerToast = (msg, type = 'success') => _setToast?.({ msg, type, id: Date.now() });

export default function LeadsView() {
  const [leads,      setLeads]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [toast,      setToast]      = useState(null);
  const [searchHov,  setSearchHov]  = useState(false);

  _setToast = setToast;

  const DEFAULT_COUNTRY_CODE = '91';

  useEffect(() => {
    API.get('/leads')
      .then(res => { setLeads(res.data); setLoading(false); })
      .catch(err => { console.error('Fetch error:', err); setLoading(false); triggerToast('Failed to load leads', 'error'); });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const isEmail = c => c?.includes('@');
  const isPhone = c => !isEmail(c) && c?.replace(/\D/g, '').length >= 10;

  const getWhatsAppLink = phone => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) cleaned = DEFAULT_COUNTRY_CODE + cleaned;
    return `https://wa.me/${cleaned}`;
  };

  const copyText = (text, label = 'Copied!') => {
    navigator.clipboard.writeText(text);
    triggerToast(label);
  };

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch =
      l.customerIdentifier?.toLowerCase().includes(q) ||
      l.contact?.toLowerCase().includes(q) ||
      l.lastMessage?.toLowerCase().includes(q);
    const matchFilter =
      filter === 'all' ||
      (filter === 'email' && isEmail(l.contact)) ||
      (filter === 'phone' && isPhone(l.contact));
    return matchSearch && matchFilter;
  });

  const totalLeads = leads.length;
  const emailLeads = leads.filter(l => isEmail(l.contact)).length;
  const phoneLeads = leads.filter(l => isPhone(l.contact)).length;
  const todayLeads = leads.filter(l =>
    new Date(l.createdAt).toDateString() === new Date().toDateString()
  ).length;

  // ── LOADING ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: 360,
      background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
      border: `1px solid ${T.border}`, borderRadius: 22,
      gap: '1.25rem', fontFamily: T.font,
    }}>
      <div style={{ width: 40, height: 40, border: `3px solid rgba(99,102,241,0.15)`, borderTopColor: T.indigoL, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.28)',
        borderRadius: 30, padding: '5px 14px',
      }}>
        <span style={{ color: T.purpleL }}>✦</span>
        <span style={{ color: T.purpleL, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>
          Syncing Lead Intelligence…
        </span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── MAIN ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem', fontFamily: T.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes rowIn   { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }

        .leads-row { transition: background 0.2s ease; }
        .leads-row:hover { background: rgba(99,102,241,0.05) !important; }
        .leads-row:hover .lead-avatar {
          background: linear-gradient(135deg,#4f46e5,#7c3aed) !important;
          color: white !important;
        }
        .leads-row:hover .lead-name { color: ${T.indigoL} !important; }
        .icon-btn:hover { opacity: 1 !important; color: ${T.t1} !important; }
        .action-link { transition: all 0.2s ease; }
        .action-link:hover { transform: translateY(-1px); }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.92)' : 'rgba(22,163,74,0.92)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
          borderRadius: 12, padding: '0.65rem 1.1rem',
          fontSize: 13, fontWeight: 600, color: 'white',
          animation: 'slideIn 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          {toast.type === 'error' ? <IcoAlert size={14} stroke="white" /> : <IcoCheck size={14} stroke="white" sw={2.5} />}
          {toast.msg}
        </div>
      )}

      {/* ── HERO HEADER ──────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(59,130,246,0.05), rgba(124,58,237,0.08))',
        border: `1px solid ${T.border}`,
        borderRadius: 22, padding: '2rem',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.5s ease both',
      }}>
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', width: 200, height: 200, background: 'radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: T.purpleL, textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 12 }}>
            Intelligence Dashboard
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: T.t1, letterSpacing: -0.8, margin: 0 }}>
              Lead{' '}
              <span style={{ backgroundImage: 'linear-gradient(135deg,#818cf8,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shim 5s linear infinite' }}>
                Intelligence
              </span>
            </h2>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.28)',
              borderRadius: 30, padding: '4px 12px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, boxShadow: `0 0 6px ${T.green}`, display: 'inline-block', animation: 'pl 2s infinite' }} />
              <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', fontFamily: T.mono }}>Live</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.75, maxWidth: 520, margin: 0 }}>
            Verified contact extractions from neural sessions. Every conversation captured and structured automatically — name, contact, intent.
          </p>
        </div>

        {/* decorative DB icon */}
        <div style={{ position: 'absolute', right: '-1.5rem', bottom: '-1.5rem', opacity: 0.06, transform: 'rotate(-12deg)' }}>
          <IcoDB size={130} stroke={T.purpleL} />
        </div>
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        animation: 'fadeUp 0.55s ease both',
      }}>
        {[
          { label: 'Total Leads',    value: totalLeads,  color: T.indigoL, icon: <IcoUsers size={14} color={T.indigoL} /> },
          { label: 'Today',          value: todayLeads,  color: T.amber,   icon: <IcoZap   size={14} color={T.amber} /> },
          { label: 'Email Contacts', value: emailLeads,  color: '#60a5fa',  icon: <IcoMail  size={14} /> },
          { label: 'Phone Contacts', value: phoneLeads,  color: '#4ade80',  icon: <IcoPhone size={14} /> },
        ].map(({ label, value, color, icon }, i) => (
          <div key={label} style={{
            background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
            border: `1px solid ${T.border}`,
            borderRadius: 16, padding: '1.1rem 1.25rem',
            animationDelay: `${i * 0.06}s`,
            transition: 'border-color .25s, transform .25s, box-shadow .25s',
            cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(79,70,229,.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: `${color}18`, border: `1px solid ${color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color,
              }}>{icon}</div>
              <IcoTrend size={12} />
            </div>
            <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 6, margin: '0 0 6px' }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color, fontFamily: T.mono, margin: 0, letterSpacing: -0.5 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── LEADS TABLE CARD ─────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
        border: `1px solid ${T.border}`,
        borderRadius: 20, overflow: 'hidden',
        animation: 'fadeUp 0.6s ease both',
      }}>

        {/* TOOLBAR */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', gap: '0.75rem', flexWrap: 'wrap',
          borderBottom: `1px solid ${T.border}`,
          background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
        }}>
          <h4 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 10, fontWeight: 700, color: T.indigoL,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: T.mono, margin: 0,
          }}>
            <IcoDB size={15} stroke={T.indigoL} /> Extracted Contacts
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            {/* search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: T.bg0,
              border: `1px solid ${searchHov ? T.borderH : T.border}`,
              borderRadius: 10, padding: '0.5rem 0.875rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={() => setSearchHov(true)}
              onMouseLeave={() => setSearchHov(false)}
            >
              <IcoSearch size={12} />
              <input
                placeholder="Search leads…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: T.t1, fontSize: 12, fontFamily: T.font, width: 140,
                }}
              />
            </div>

            {/* filter pills */}
            {[
              { id: 'all',   label: 'All',   count: totalLeads },
              { id: 'email', label: 'Email', count: emailLeads },
              { id: 'phone', label: 'Phone', count: phoneLeads },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.5rem 0.875rem', borderRadius: 10,
                fontFamily: T.font, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: filter === f.id ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.03)',
                border: filter === f.id ? '1px solid transparent' : `1px solid ${T.border}`,
                color: filter === f.id ? 'white' : T.t3,
                boxShadow: filter === f.id ? '0 4px 14px rgba(79,70,229,.35)' : 'none',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { if (filter !== f.id) { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.color = T.t1; } }}
                onMouseLeave={e => { if (filter !== f.id) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; } }}
              >
                {f.label}
                <span style={{
                  fontSize: 9, fontWeight: 800, fontFamily: T.mono,
                  background: filter === f.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  borderRadius: 6, padding: '1px 5px',
                }}>{f.count}</span>
              </button>
            ))}

            {/* export
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.5rem 0.875rem', borderRadius: 10,
              fontFamily: T.font, fontSize: 11, fontWeight: 700,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
              color: T.t3, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.color = T.t1; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; }}
            >
              <IcoDown size={12} /> Export
            </button> */}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 ? (
          <div style={{
            padding: '4rem 2rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(99,102,241,0.07)', border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>
              {search ? '🔍' : '📭'}
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.t1, margin: '0 0 6px' }}>
                {search ? 'No results found' : 'Intelligence Repository Empty'}
              </p>
              <p style={{ fontSize: 13, color: T.t3, maxWidth: 300, margin: '0 auto' }}>
                {search ? `No leads match "${search}"` : 'Awaiting first successful data extraction.'}
              </p>
            </div>
            {search && (
              <button onClick={() => setSearch('')} style={{
                padding: '0.5rem 1.25rem', borderRadius: 10,
                background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.25)`,
                color: T.purpleL, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.font,
              }}>Clear Search</button>
            )}
          </div>
        ) : (
          /* TABLE */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {[
                    { label: 'Identity',     pl: '1.5rem' },
                    { label: 'Contact Node', pl: '1rem'   },
                    { label: 'Last Message', pl: '1rem'   },
                    { label: 'Captured',     pl: '1rem'   },
                    { label: 'Actions',      pl: '1rem', center: true },
                  ].map(h => (
                    <th key={h.label} style={{
                      paddingTop: '0.875rem', paddingBottom: '0.875rem',
                      paddingLeft: h.pl, paddingRight: '1rem',
                      textAlign: h.center ? 'center' : 'left',
                      fontSize: 9, fontWeight: 700, color: T.t3,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      fontFamily: T.mono, whiteSpace: 'nowrap',
                    }}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, idx) => {
                  const email = isEmail(lead.contact);
                  const phone = !email && isPhone(lead.contact);

                  return (
                    <tr key={lead._id} className="leads-row" style={{
                      borderBottom: `1px solid rgba(99,102,241,0.07)`,
                      animation: `rowIn .3s ease both`,
                      animationDelay: `${idx * 0.04}s`,
                    }}>

                      {/* IDENTITY */}
                      <td style={{ padding: '0.875rem 1rem 0.875rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="lead-avatar" style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: 'rgba(124,58,237,0.12)',
                            border: '1px solid rgba(124,58,237,0.25)',
                            color: T.purpleL,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 800, fontFamily: T.mono,
                            transition: 'all 0.25s ease',
                          }}>
                            {lead.customerIdentifier?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="lead-name" style={{ fontSize: 13, fontWeight: 700, color: T.t1, margin: '0 0 2px', letterSpacing: -0.2, transition: 'color 0.2s' }}>
                              {lead.customerIdentifier || 'Guest User'}
                            </p>
                            <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: T.mono }}>
                              Verified Lead
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '4px 10px', borderRadius: 8,
                          background: email ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
                          border: `1px solid ${email ? 'rgba(59,130,246,0.28)' : 'rgba(34,197,94,0.28)'}`,
                          color: email ? '#93c5fd' : '#4ade80',
                          fontSize: 11, fontWeight: 600, fontFamily: T.mono,
                          maxWidth: 210,
                        }}>
                          {email ? <IcoMail size={11} /> : <IcoPhone size={11} />}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lead.contact}
                          </span>
                          <button
                            onClick={() => copyText(lead.contact, 'Contact copied!')}
                            className="icon-btn"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', opacity: 0.4, display: 'flex', alignItems: 'center', transition: 'opacity 0.2s' }}
                          >
                            <IcoCopy size={10} />
                          </button>
                        </div>
                      </td>

                      {/* LAST MESSAGE */}
                      <td style={{ padding: '0.875rem 1rem', maxWidth: 260 }}>
                        <p style={{
                          fontSize: 12.5, color: T.t3, fontStyle: 'italic',
                          margin: 0, lineHeight: 1.5,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          "{lead.lastMessage}"
                        </p>
                      </td>

                      {/* DATE */}
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <IcoCal size={11} />
                          <span style={{ fontSize: 11, fontFamily: T.mono, fontWeight: 500, color: T.t3 }}>
                            {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                          {email ? (
                            <a href={`mailto:${lead.contact}`} className="action-link" style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '0.5rem 1rem', borderRadius: 10,
                              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                              color: 'white', fontSize: 11, fontWeight: 700,
                              letterSpacing: '0.06em', textDecoration: 'none',
                              boxShadow: '0 4px 14px rgba(79,70,229,.3)',
                              fontFamily: T.font,
                            }}>
                              <IcoMail size={12} /> Send Email
                            </a>
                          ) : phone ? (
                            <>
                              <a href={`tel:${lead.contact}`} className="action-link" title="Call" style={{
                                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                                background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: T.t3, textDecoration: 'none',
                              }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.color = T.t1; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; }}
                              >
                                <IcoPhone size={14} />
                              </a>
                              <a href={getWhatsAppLink(lead.contact)} target="_blank" rel="noreferrer" className="action-link" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '0.5rem 1rem', borderRadius: 10,
                                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.28)',
                                color: '#4ade80', fontSize: 11, fontWeight: 700,
                                letterSpacing: '0.06em', textDecoration: 'none', fontFamily: T.font,
                              }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.18)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
                              >
                                <IcoMsg size={12} /> WhatsApp
                              </a>
                            </>
                          ) : (
                            <span style={{
                              fontSize: 9, fontWeight: 700, color: 'rgba(239,68,68,0.5)',
                              border: '1px solid rgba(239,68,68,0.2)', padding: '3px 9px',
                              borderRadius: 6, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: T.mono,
                            }}>Format Error</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLE FOOTER */}
        {filtered.length > 0 && (
          <div style={{
            padding: '0.875rem 1.5rem',
            borderTop: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <p style={{ fontSize: 11, color: T.t3, fontFamily: T.mono, margin: 0 }}>
              Showing{' '}
              <span style={{ color: T.indigoL, fontWeight: 700 }}>{filtered.length}</span>
              {' '}of{' '}
              <span style={{ color: T.t2, fontWeight: 600 }}>{totalLeads}</span>
              {' '}leads
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.t3, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', fontFamily: T.mono }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block', animation: 'pl 2s infinite' }} />
              LIVE EXTRACTION ACTIVE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}