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

// ─── INLINE ICONS ────────────────────────────────────────────────────
const Ico = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoKey      = p => <Ico {...p} d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />;
const IcoCopy     = p => <Ico {...p} d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />;
const IcoRefresh  = p => <Ico {...p} d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-5.02" />;
const IcoShield   = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoEye      = p => <Ico {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IcoEyeOff   = p => <Ico {...p} d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />;
const IcoCode     = p => <Ico {...p} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />;
const IcoBook     = p => <Ico {...p} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />;
const IcoCheck    = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoAlert    = p => <Ico {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
const IcoZap      = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;

// ─── COPY TOAST STATE (module-level) ─────────────────────────────────
let _setToast = null;
const triggerToast = (msg, type = 'success') => _setToast?.({ msg, type, id: Date.now() });

const DeveloperPortal = () => {
  const [apiKey,      setApiKey]      = useState('');
  const [tokens,      setTokens]      = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [rotating,    setRotating]    = useState(false);
  const [testStatus,  setTestStatus]  = useState('idle');
  const [showKey,     setShowKey]     = useState(false);
  const [toast,       setToast]       = useState(null);
  const [hovGen,      setHovGen]      = useState(false);
  const [hovTest,     setHovTest]     = useState(false);
  const [codeHov,     setCodeHov]     = useState(false);

  _setToast = setToast;

  const userId   = localStorage.getItem('userId');
  const API_BASE = process.env.Backend_BASE || '';

  const fetchUserData = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/api/user-profile/${userId}`);
      if (res.data) {
        setApiKey(res.data.apiKey || '');
        setTokens(res.data.tokens || 0);
      }
    } catch (err) {
      console.error('Profile fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, API_BASE]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const handleGenerateKey = async () => {
    if (!window.confirm('Generating a new key will instantly invalidate your old one. Continue?')) return;
    setRotating(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/generate-api-key/${userId}`);
      setApiKey(res.data.apiKey);
      setShowKey(true);
      triggerToast('New API key generated');
      await fetchUserData();
    } catch {
      triggerToast('Failed to rotate key', 'error');
    } finally {
      setRotating(false);
    }
  };

  const testConnection = async () => {
    if (!apiKey) return triggerToast('Generate a key first', 'error');
    setTestStatus('testing');
    try {
      await axios.get(`${API_BASE}/api/v1/auth/verify`, { headers: { 'x-api-key': apiKey } });
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  const copyText = (text, label = 'Copied!') => {
    navigator.clipboard.writeText(text);
    triggerToast(label);
  };

  const samplePayload = `{
  "model": "llama3",
  "messages": [
    {
      "role": "user",
      "content": "Hello MyAutoBot! How can I integrate your API?"
    }
  ]
}`;

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
          Synchronizing Neural Identity…
        </span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── MAIN ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem', fontFamily: T.font }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
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
          {toast.type === 'error'
            ? <IcoAlert size={14} stroke="white" />
            : <IcoCheck size={14} stroke="white" sw={2.5} />}
          {toast.msg}
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(59,130,246,0.05), rgba(124,58,237,0.08))',
        border: `1px solid ${T.border}`,
        borderRadius: 22, padding: '2rem',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.5s ease both',
      }}>
        {/* ambient glow */}
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', width: 200, height: 200, background: 'radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* section label */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: T.purpleL, textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 12 }}>
            Developer Portal
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: T.t1, letterSpacing: -0.8, margin: 0 }}>
              API Access &amp;{' '}
              <span style={{ backgroundImage: 'linear-gradient(135deg,#818cf8,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shim 5s linear infinite' }}>
                Integration
              </span>
            </h2>
            {/* version badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.28)`,
              borderRadius: 30, padding: '4px 12px',
            }}>
              <span style={{ color: T.purpleL, fontSize: 12 }}>✦</span>
              <span style={{ color: T.purpleL, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>v1.0 API</span>
            </div>
          </div>

          <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.75, maxWidth: 540, margin: 0 }}>
            Connect <strong style={{ color: T.t1 }}>MyAutoBot</strong> to your custom workflows. Each API request deducts{' '}
            <strong style={{ color: T.t1, textDecoration: 'underline', textDecorationColor: T.indigoL }}>5 Tokens</strong> from your balance.
          </p>
        </div>

        {/* decorative large key */}
        <div style={{ position: 'absolute', right: '-1.5rem', bottom: '-1.5rem', opacity: 0.06, transform: 'rotate(12deg)', color: T.purpleL }}>
          <IcoKey size={130} stroke={T.purpleL} sw={1} />
        </div>
      </div>

      {/* ── KEY MANAGEMENT ───────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
        border: `1px solid ${T.border}`,
        borderRadius: 20, padding: '1.5rem',
        position: 'relative',
        animation: 'fadeUp 0.55s ease both',
      }}>
        {/* cost badge — amber */}
        <div style={{
          position: 'absolute', top: '1rem', right: '1.25rem',
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 30, padding: '4px 12px',
        }}>
          <IcoZap size={11} stroke={T.amber} />
          <span style={{ fontSize: 10, fontWeight: 700, color: T.amber, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: T.mono }}>
            5 Tokens / req
          </span>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          {/* label */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 10, fontWeight: 700, color: T.t3,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: T.mono, marginBottom: '0.75rem',
          }}>
            <IcoShield size={13} stroke={T.green} /> Private API Key
          </label>

          {/* key input row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            flexWrap: 'wrap',
          }}>
            <div style={{
              flex: 1, minWidth: 220,
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: T.bg0, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: '0.75rem 1rem',
              transition: 'border-color 0.2s',
            }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey || '••••••••••••••••••••••••••••••••'}
                readOnly
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: T.indigoL, fontFamily: T.mono, fontSize: 13, letterSpacing: '0.05em',
                }}
              />
              <button onClick={() => setShowKey(v => !v)} style={{ background: 'none', border: 'none', color: T.t3, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = T.t1}
                onMouseLeave={e => e.currentTarget.style.color = T.t3}
              >
                {showKey ? <IcoEyeOff size={16} /> : <IcoEye size={16} />}
              </button>
              <button onClick={() => copyText(apiKey, 'API key copied!')} disabled={!apiKey} style={{ background: 'none', border: 'none', color: T.t3, cursor: apiKey ? 'pointer' : 'not-allowed', padding: 0, display: 'flex', alignItems: 'center', opacity: apiKey ? 1 : 0.3, transition: 'color 0.2s' }}
                onMouseEnter={e => { if (apiKey) e.currentTarget.style.color = T.indigoL; }}
                onMouseLeave={e => e.currentTarget.style.color = T.t3}
              >
                <IcoCopy size={16} />
              </button>
            </div>

            {/* action buttons */}
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {/* test */}
              <button
                onClick={testConnection}
                onMouseEnter={() => setHovTest(true)}
                onMouseLeave={() => setHovTest(false)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 12, cursor: 'pointer',
                  fontFamily: T.font, fontWeight: 700,
                  fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                  border: `1px solid ${
                    testStatus === 'success' ? 'rgba(34,197,94,0.4)' :
                    testStatus === 'error'   ? 'rgba(239,68,68,0.4)' :
                    hovTest ? T.borderH : T.border
                  }`,
                  background:
                    testStatus === 'success' ? 'rgba(34,197,94,0.1)' :
                    testStatus === 'error'   ? 'rgba(239,68,68,0.1)' :
                    hovTest ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                  color:
                    testStatus === 'success' ? '#4ade80' :
                    testStatus === 'error'   ? '#fca5a5' :
                    hovTest ? T.indigoL : T.t2,
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  transition: 'all 0.2s',
                }}
              >
                {testStatus === 'testing' ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> :
                 testStatus === 'success' ? <IcoCheck size={14} stroke="#4ade80" sw={2.5} /> :
                 testStatus === 'error'   ? <IcoAlert size={14} stroke="#fca5a5" /> :
                 <IcoZap size={14} />}
                {testStatus === 'testing' ? 'Testing…' :
                 testStatus === 'success' ? 'Verified' :
                 testStatus === 'error'   ? 'Failed' : 'Test Link'}
              </button>

              {/* generate */}
              <button
                onClick={handleGenerateKey}
                disabled={rotating}
                onMouseEnter={() => setHovGen(true)}
                onMouseLeave={() => setHovGen(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 12, cursor: rotating ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  border: '1px solid transparent',
                  color: 'white', fontFamily: T.font, fontWeight: 700,
                  fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                  boxShadow: hovGen && !rotating ? '0 6px 22px rgba(79,70,229,0.45)' : '0 4px 14px rgba(79,70,229,0.28)',
                  transform: hovGen && !rotating ? 'translateY(-1px)' : 'translateY(0)',
                  opacity: rotating ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  transition: 'all 0.2s',
                }}
              >
                {rotating
                  ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  : <IcoRefresh size={14} />}
                {apiKey ? 'Rotate Key' : 'Generate Key'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── DOCS GRID ────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
        animation: 'fadeUp 0.6s ease both',
      }}>

        {/* Request Format */}
        <div style={{
          gridColumn: 'span 2',
          background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
          border: `1px solid ${T.border}`,
          borderRadius: 20, padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h4 style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 10, fontWeight: 700, color: T.indigoL,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: T.mono, margin: 0,
            }}>
              <IcoCode size={15} stroke={T.indigoL} /> Request Structure
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.28)', color: '#93c5fd', padding: '3px 10px', borderRadius: 20, fontFamily: T.mono, letterSpacing: '0.1em' }}>POST</span>
              <span style={{ fontSize: 9, fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, color: T.t3, padding: '3px 10px', borderRadius: 20, fontFamily: T.mono }}>application/json</span>
            </div>
          </div>

          {/* code block */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setCodeHov(true)}
            onMouseLeave={() => setCodeHov(false)}
          >
            <pre style={{
              background: T.bg0, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: '1.25rem',
              fontFamily: T.mono, fontSize: 12,
              color: T.purpleL, lineHeight: 1.7,
              overflowX: 'auto', margin: 0,
            }}>
              {samplePayload}
            </pre>
            <button
              onClick={() => copyText(samplePayload, 'Code copied!')}
              style={{
                position: 'absolute', top: '0.875rem', right: '0.875rem',
                background: 'rgba(99,102,241,0.15)', border: `1px solid ${T.border}`,
                borderRadius: 8, padding: '0.375rem 0.5rem',
                color: T.t2, cursor: 'pointer', display: 'flex', alignItems: 'center',
                opacity: codeHov ? 1 : 0, transition: 'opacity 0.2s',
              }}
            >
              <IcoCopy size={13} />
            </button>
          </div>

          {/* stat pills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { label: 'Cost per Request', value: '5 Tokens', color: T.amber },
              { label: 'Remaining Balance', value: `${tokens.toLocaleString()} Tokens`, color: '#4ade80' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
                border: `1px solid ${T.border}`,
                borderRadius: 12, padding: '0.875rem 1rem',
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color, fontFamily: T.mono, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Manual */}
        <div style={{
          background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
          border: `1px solid ${T.border}`,
          borderRadius: 20, padding: '1.5rem',
        }}>
          <h4 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 10, fontWeight: 700, color: '#4ade80',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: T.mono, margin: '0 0 1.25rem',
          }}>
            <IcoBook size={15} stroke="#4ade80" /> Integration Manual
          </h4>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: '0 0 1.5rem' }}>
            {[
              { num: '01', title: 'Auth Header', body: <>Add <code style={{ color: T.purpleL, fontFamily: T.mono, fontSize: 11 }}>x-api-key</code> to every request header.</> },
              { num: '02', title: 'Endpoint',    body: <><code style={{ color: T.purpleL, fontFamily: T.mono, fontSize: 11 }}>{API_BASE}/api/v1/chat/completions</code></> },
              { num: '03', title: 'History',     body: <>Maintain context by sending the full <code style={{ color: T.purpleL, fontFamily: T.mono, fontSize: 11 }}>messages</code> array.</> },
            ].map(({ num, title, body }) => (
              <li key={num} style={{ display: 'flex', gap: '0.75rem' }}>
                {/* numbered badge */}
                <div style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#4ade80', fontFamily: T.mono,
                }}>{num}</div>
                <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: T.t1 }}>{title}: </strong>{body}
                </p>
              </li>
            ))}
          </ul>

          {/* n8n config */}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '1.25rem' }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.28em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: '0.625rem' }}>n8n Config</p>
            <div style={{
              background: T.bg0, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: '0.875rem 1rem',
              fontFamily: T.mono, fontSize: 11, color: T.t2, lineHeight: 1.8,
            }}>
              Auth: Header Auth<br/>
              Name: x-api-key<br/>
              Value: [Your Key]
            </div>
          </div>
        </div>
      </div>

      {/* responsive: code block spans full width on mobile */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridColumn: 'span 2'"] { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  );
};

export default DeveloperPortal;