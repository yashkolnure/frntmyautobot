import React, { useState, useMemo, useEffect } from 'react';

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

const DOMAIN      = window.location.origin;
const WIDGET_PATH = '/bot-widget.js';

const THEMES = [
  { id: 'executive', name: 'Executive White',  dot: '#3b82f6' },
  { id: 'luxe',      name: 'Luxe Ivory',        dot: '#c5a059' },
  { id: 'minimal',   name: 'Essential Light',   dot: '#f1f5f9' },
  { id: 'slate',     name: 'Slate Midnight',    dot: '#10b981' },
  { id: 'oceanic',   name: 'Oceanic Blue',      dot: '#38bdf8' },
];

const PLATFORMS = [
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4 12c0-1.476.33-2.875.916-4.13L8.99 18.837A8.002 8.002 0 0 1 4 12zm8 8a8.01 8.01 0 0 1-2.29-.335l2.432-7.07 2.492 6.825A8.01 8.01 0 0 1 12 20zm1.047-10.518l2.076 6.033-5.804-1.77 3.728-4.263zM12 6c1.094 0 2.1.208 3.02.582L12.867 12.4 10.5 5.87A8.015 8.015 0 0 1 12 6zm3.896 1.204A8.001 8.001 0 0 1 19.98 12a8.01 8.01 0 0 1-3.245 6.445l-2.792-7.64 2.953-3.6z',
    steps: ["Install 'Insert Headers & Footers' plugin.", "Paste code into the 'Footer' section.", "Save Changes."],
  },
  {
    id: 'shopify',
    name: 'Shopify / Wix',
    icon: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
    steps: ["Go to Online Store > Themes > Edit Code.", "Open 'theme.liquid'.", "Paste before the </body> tag."],
  },
  {
    id: 'react',
    name: 'React / Next.js',
    icon: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
    steps: ["Add snippet to index.html.", "Or use the 'next/script' component.", "Ensure botId is a string."],
  },
  {
    id: 'legacy',
    name: 'Custom HTML',
    icon: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
    steps: ["Open your HTML file.", "Scroll to the bottom.", "Paste code right before </body>."],
  },
];

// ─── INLINE ICONS ────────────────────────────────────────────────────
const Ico = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoGlobe    = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />;
const IcoTerminal = p => <Ico {...p} d="M4 17l6-6-6-6M12 19h8" />;
const IcoPalette  = p => <Ico {...p} d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10a2 2 0 0 1-2-2c0-.53.21-1.01.55-1.37.34-.34.54-.81.54-1.3 0-1.1-.9-2-2-2H7a5 5 0 0 1-5-5C2 6.48 6.48 2 12 2z" />;
const IcoShield   = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoCheck    = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoCopy     = p => <Ico {...p} d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />;
const IcoExtLink  = p => <Ico {...p} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />;
const IcoZap      = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoHelp     = p => <Ico {...p} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />;

export default function DeploymentView() {
  const [userId,        setUserId]        = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('executive');
  const [copiedType,    setCopiedType]    = useState(null);
  const [toast,         setToast]         = useState(null);
  const [hovLive,       setHovLive]       = useState(false);

  useEffect(() => {
    const keys = ['user', 'auth', 'userData', 'userId'];
    for (const key of keys) {
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      try {
        const parsed = JSON.parse(stored);
        const id = parsed.userId || parsed._id || parsed.id;
        if (id) { setUserId(id); return; }
      } catch {
        if (stored.length >= 24) { setUserId(stored); return; }
      }
    }
  }, []);

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const chatLink  = useMemo(() => `${DOMAIN}/chat/${userId}?theme=${selectedTheme}`, [userId, selectedTheme]);
  const embedCode = useMemo(() => `<script>
  window.myAutoBotId     = "${userId}";
  window.myAutoBotOrigin = "${DOMAIN}";
  window.myAutoBotTheme  = "${selectedTheme}";
</script>
<script src="${DOMAIN}${WIDGET_PATH}" async></script>`, [userId, selectedTheme]);

  const copy = async (text, type, label = 'Copied!') => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setToast({ msg: label, type: 'success' });
    setTimeout(() => setCopiedType(null), 2000);
  };

  // ── CARD STYLE ─────────────────────────────────────────────────
  const card = (extra = {}) => ({
    background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: '1.5rem',
    ...extra,
  });

  // ── EMPTY STATE ────────────────────────────────────────────────
  if (!userId) return (
    <div style={{ ...card(), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center', fontFamily: T.font }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ color: T.t3, animation: 'bounce 2s ease-in-out infinite', marginBottom: '1rem' }}>
        <IcoHelp size={44} stroke={T.t3} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 900, color: T.t1, letterSpacing: -0.3, marginBottom: 8 }}>Session Expired</h3>
      <p style={{ fontSize: 12, color: T.t3, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.mono }}>
        Please log in to retrieve your Deployment ID
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '4rem', fontFamily: T.font }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        .dep-scroll::-webkit-scrollbar { height: 4px; }
        .dep-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 99px; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200,
          background: 'rgba(22,163,74,0.92)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(34,197,94,0.4)', borderRadius: 12,
          padding: '0.65rem 1.1rem', fontSize: 13, fontWeight: 600, color: 'white',
          animation: 'slideIn 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <IcoCheck size={14} stroke="white" sw={2.5} /> {toast.msg}
        </div>
      )}

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', animation: 'fadeUp 0.45s ease both' }}>
        <div>
          {/* section label */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: T.purpleL, textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 8 }}>
            Production Deployment
          </div>
          <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, color: T.t1, letterSpacing: -0.6, lineHeight: 1.1, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            Deploy Your Bot
            <span style={{ color: T.indigoL }}><IcoZap size={22} stroke={T.indigoL} /></span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* active node badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.28)`,
              borderRadius: 30, padding: '4px 12px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, boxShadow: `0 0 6px ${T.green}`, animation: 'pl 2s infinite', display: 'inline-block' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: T.indigoL, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.mono }}>Active Node</span>
            </div>
            <code style={{ fontSize: 10, color: T.t3, fontFamily: T.mono }}>{userId}</code>
          </div>
        </div>

        {/* Test Live Bot button */}
        <button
          onClick={() => window.open(chatLink)}
          onMouseEnter={() => setHovLive(true)}
          onMouseLeave={() => setHovLive(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: hovLive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${hovLive ? T.borderH : T.border}`,
            borderRadius: 12, cursor: 'pointer',
            color: hovLive ? T.indigoL : T.t2,
            fontSize: 13, fontWeight: 700,
            transition: 'all 0.2s',
            transform: hovLive ? 'translateY(-1px)' : 'translateY(0)',
          }}
        >
          <span>Test Live Bot</span>
          <IcoExtLink size={14} stroke="currentColor" />
        </button>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '1.25rem' }} className="dep-main-grid">

        {/* LEFT — snippets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Standalone Link */}
          <div style={{ ...card(), position: 'relative', overflow: 'hidden', animation: 'fadeUp 0.5s ease both' }}>
            {/* bg watermark */}
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem', opacity: 0.04, color: T.indigoL }}>
              <IcoGlobe size={88} stroke={T.indigoL} sw={1} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(79,70,229,0.1)', border: `1px solid rgba(99,102,241,0.28)`, borderRadius: 10, padding: '0.5rem', display: 'flex', color: T.indigoL }}>
                <IcoGlobe size={17} stroke={T.indigoL} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: T.t1, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Standalone Interface</p>
                <p style={{ fontSize: 9, fontWeight: 600, color: T.t3, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontFamily: T.mono }}>For social bios and direct emails</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                flex: 1, minWidth: 180,
                background: T.bg0, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', overflow: 'hidden',
              }}>
                <code style={{ fontSize: 11, fontFamily: T.mono, color: T.indigoL, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chatLink}</code>
              </div>
              <button
                onClick={() => copy(chatLink, 'link', 'Link copied!')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  background: copiedType === 'link' ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  border: `1px solid ${copiedType === 'link' ? 'rgba(34,197,94,0.4)' : 'transparent'}`,
                  borderRadius: 10, padding: '0.75rem 1.25rem',
                  color: copiedType === 'link' ? '#4ade80' : 'white',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: copiedType === 'link' ? 'none' : '0 4px 14px rgba(79,70,229,0.3)',
                }}
              >
                {copiedType === 'link' ? <IcoCheck size={14} stroke="#4ade80" sw={2.5} /> : <IcoCopy size={14} />}
                {copiedType === 'link' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div style={{ ...card(), animation: 'fadeUp 0.55s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, borderRadius: 10, padding: '0.5rem', display: 'flex', color: T.t2 }}>
                <IcoTerminal size={17} stroke={T.t2} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: T.t1, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Website Widget Protocol</p>
                <p style={{ fontSize: 9, fontWeight: 600, color: T.t3, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontFamily: T.mono }}>Universal snippet for all modern websites</p>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <pre className="dep-scroll" style={{
                background: T.bg0, border: `1px solid ${T.border}`,
                borderRadius: 14, padding: '1.25rem',
                fontFamily: T.mono, fontSize: 12,
                color: T.indigoL, lineHeight: 1.75,
                overflowX: 'auto', margin: 0,
              }}>
                {embedCode}
              </pre>
              <button
                onClick={() => copy(embedCode, 'code', 'Snippet copied!')}
                style={{
                  position: 'absolute', top: '0.875rem', right: '0.875rem',
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  background: copiedType === 'code' ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.12)',
                  border: `1px solid ${copiedType === 'code' ? 'rgba(34,197,94,0.4)' : T.border}`,
                  borderRadius: 8, padding: '0.375rem 0.75rem',
                  color: copiedType === 'code' ? '#4ade80' : T.t2,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: T.font,
                }}
              >
                {copiedType === 'code' ? <IcoCheck size={12} stroke="#4ade80" sw={2.5} /> : <IcoCopy size={12} />}
                {copiedType === 'code' ? 'Copied' : 'Copy Snippet'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — theme + checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Branding Preset */}
          <div style={{ ...card(), animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', paddingBottom: '0.875rem', borderBottom: `1px solid ${T.border}` }}>
              <IcoPalette size={15} stroke={T.indigoL} />
              <span style={{ fontSize: 10, fontWeight: 700, color: T.t1, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>Branding Preset</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {THEMES.map(t => {
                const active = selectedTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem', borderRadius: 10, cursor: 'pointer',
                      background: active ? 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(124,58,237,0.12))' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${active ? T.borderH : T.border}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: t.dot, boxShadow: active ? `0 0 8px ${t.dot}` : 'none', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: active ? T.t1 : T.t2, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: T.mono }}>{t.name}</span>
                    </div>
                    {active && <IcoCheck size={12} stroke={T.indigoL} sw={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Go-Live Checklist — indigo gradient card matching landing CTA block */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(124,58,237,0.1), rgba(99,102,241,0.12))',
            border: `1px solid ${T.borderH}`,
            borderRadius: 20, padding: '1.25rem',
            boxShadow: '0 8px 32px rgba(79,70,229,0.15)',
            animation: 'fadeUp 0.55s ease both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <IcoShield size={16} stroke={T.indigoL} />
              <span style={{ fontSize: 10, fontWeight: 700, color: T.indigoL, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>Go-Live Checklist</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: 0, margin: 0 }}>
              {['Script Added to Site', 'Token Balance > 0', 'Lead Capture Enabled', 'Knowledge Base Sync'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(99,102,241,0.2)', border: `1px solid rgba(99,102,241,0.4)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IcoCheck size={9} stroke={T.indigoL} sw={3} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.t1, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: T.mono }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── PLATFORM GUIDES ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', animation: 'fadeUp 0.6s ease both' }}>
        {PLATFORMS.map((p, i) => (
          <div key={p.id} style={{
            ...card(),
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'linear-gradient(145deg,rgba(99,102,241,0.06),rgba(255,255,255,0.01))'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
              <div style={{ background: 'rgba(79,70,229,0.1)', border: `1px solid rgba(99,102,241,0.22)`, borderRadius: 8, padding: '0.4rem', display: 'flex', color: T.indigoL }}>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={T.indigoL} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d={p.icon} />
                </svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.t1, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.mono }}>{p.name}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {p.steps.map((step, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: T.indigoL, fontSize: 10, marginTop: 1, fontFamily: T.mono, fontWeight: 700, flexShrink: 0 }}>{idx + 1}.</span>
                  <span style={{ fontSize: 11, color: T.t3, lineHeight: 1.55, fontFamily: T.mono }}>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* responsive: stack grid on mobile */}
      <style>{`
        @media (max-width: 900px) {
          .dep-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}