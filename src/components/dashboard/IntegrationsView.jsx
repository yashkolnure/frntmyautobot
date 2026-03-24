import React, { useState, useEffect } from "react";
import API from "../../api";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  bg0: '#03020a', bg1: '#070512', bg2: '#0d0b1e', bg3: '#13102b',
  border:  'rgba(99,102,241,0.18)',
  borderH: 'rgba(99,102,241,0.45)',
  indigo: '#4f46e5', indigoL: '#818cf8',
  purple: '#7c3aed', purpleL: '#a78bfa',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  green: '#22c55e', red: '#ef4444',
  font: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono: "'DM Mono',monospace",
};

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoIG       = p => <Ico {...p} d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />;
const IcoWA       = p => <Ico {...p} d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />;
const IcoTG       = p => <Ico {...p} d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />;
const IcoCopy     = p => <Ico {...p} d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />;
const IcoCheck    = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoShield   = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoKey      = p => <Ico {...p} d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />;
const IcoFinger   = p => <Ico {...p} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2v3M8 11c0-2.761 2.239-5 5-5s5 2.239 5 5v1M5 20a7 7 0 1 1 14 0" />;
const IcoPhone    = p => <Ico {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1H6.6a2 2 0 0 1 2 1.72c.13.96.34 1.9.66 2.8a2 2 0 0 1-.45 2.11L7.6 8.84A16 16 0 0 0 13.16 14.4l1.21-1.21a2 2 0 0 1 2.11-.45c.9.32 1.84.53 2.8.66A2 2 0 0 1 21.07 15.16z" />;
const IcoX        = p => <Ico {...p} d="M18 6L6 18M6 6l12 12" />;
const IcoSparkle  = p => <Ico {...p} d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />;

// ─── PLATFORM CONFIG ─────────────────────────────────────────────────
// accent is used for icon badge bg/border & save button
const PLATFORMS_META = {
  instagram: { accent: '#ec4899', accentBg: 'rgba(236,72,153,0.1)', accentBorder: 'rgba(236,72,153,0.28)' },
  whatsapp:  { accent: '#10b981', accentBg: 'rgba(16,185,129,0.1)',  accentBorder: 'rgba(16,185,129,0.28)' },
  telegram:  { accent: '#38bdf8', accentBg: 'rgba(56,189,248,0.1)',  accentBorder: 'rgba(56,189,248,0.28)' },
};

// ─── WEBHOOK FIELD ───────────────────────────────────────────────────
function WebhookField({ label, value, valueColor = T.indigoL, onCopy, copied }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: T.mono }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: T.bg0, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: '0.25rem 0.25rem 0.25rem 0.875rem',
      }}>
        <input
          readOnly value={value}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: T.mono, fontSize: 11, color: valueColor,
            minWidth: 0,
          }}
        />
        <button
          onClick={onCopy}
          style={{
            flexShrink: 0,
            background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.1)',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : T.border}`,
            borderRadius: 9, padding: '0.5rem',
            color: copied ? '#4ade80' : T.t2,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            transition: 'all 0.15s',
          }}
        >
          {copied ? <IcoCheck size={14} stroke="#4ade80" sw={2.5} /> : <IcoCopy size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── INPUT FIELD ─────────────────────────────────────────────────────
function InputField({ label, icon, placeholder, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: T.mono }}>
        {label}
      </label>
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        background: T.bg0,
        border: `1px solid ${focused ? T.borderH : T.border}`,
        borderRadius: 12, transition: 'border-color 0.2s',
      }}>
        <span style={{ position: 'absolute', left: '0.875rem', color: T.t3, display: 'flex' }}>
          {icon}
        </span>
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
            color: T.t1, fontSize: 13, fontFamily: T.font,
          }}
        />
      </div>
    </div>
  );
}

// ─── PLATFORM CARD ───────────────────────────────────────────────────
function PlatformCard({ title, subtitle, icon, accent, accentBg, accentBorder, children, onHover }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
        border: `1px solid ${hov ? accentBorder : T.border}`,
        borderRadius: 20, padding: '1.5rem',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hov ? `0 8px 32px ${accentBg}` : 'none',
      }}
    >
      {/* card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          background: accentBg, border: `1px solid ${accentBorder}`,
          borderRadius: 10, padding: '0.55rem',
          display: 'flex', alignItems: 'center', color: accent,
          transition: 'transform 0.2s',
          transform: hov ? 'scale(1.08)' : 'scale(1)',
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: T.t1, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
            {title}
          </h3>
          <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0, fontFamily: T.mono }}>
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────
export default function IntegrationsView() {
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [copied,   setCopied]   = useState("");
  const [toast,    setToast]    = useState(null);

  const [instaConfig, setInstaConfig] = useState({
    instaId: "", accessToken: "",
    verifyToken: "ma_ig_" + Math.random().toString(36).substring(7),
  });
  const [waConfig, setWaConfig] = useState({
    phoneId: "", accessToken: "",
    verifyToken: "ma_wa_handshake_kyifcljsxujudsjnxavenirya2026",
  });
  const [tgConfig, setTgConfig] = useState({ botToken: "" });

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await API.get(`/integrations/all/${userId}`);
        if (res.data) {
          setInstaConfig(p => ({ ...p, instaId: res.data.instaId, accessToken: res.data.instaAccessToken }));
          setWaConfig(p => ({ ...p, phoneId: res.data.waPhoneId, accessToken: res.data.waAccessToken }));
          setTgConfig({ botToken: res.data.tgBotToken || "" });
        }
      } catch { /* fresh config */ }
      finally { setFetching(false); }
    };
    fetchConfigs();
  }, []);

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const webhookUrl = (platform) => `${window.location.origin}/api/auth/webhook/${platform}`;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSave = async (platform, data) => {
    const userId = localStorage.getItem("userId");
    setLoading(true);
    try {
      await API.post(`/integrations/manual/${platform}`, { userId, ...data });
      setToast({ type: "success", message: `${platform.charAt(0).toUpperCase() + platform.slice(1)} connection established!` });
    } catch {
      setToast({ type: "error", message: `Failed to sync ${platform} configuration.` });
    } finally { setLoading(false); }
  };

  const SaveButton = ({ label, onClick, accent }) => {
    const [hov, setHov] = useState(false);
    return (
      <button
        onClick={onClick}
        disabled={loading}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: '100%', padding: '0.875rem',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          border: '1px solid transparent',
          borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
          color: 'white', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          fontFamily: T.font,
          boxShadow: hov && !loading ? '0 6px 22px rgba(79,70,229,0.45)' : '0 4px 14px rgba(79,70,229,0.28)',
          transform: hov && !loading ? 'translateY(-1px)' : 'translateY(0)',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.2s',
        }}
      >
        {loading
          ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
          : <IcoShield size={15} stroke="white" />}
        {label}
      </button>
    );
  };

  // ── LOADING ──────────────────────────────────────────────────────
  if (fetching) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '1.25rem', fontFamily: T.font }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(99,102,241,0.15)`, borderTopColor: T.indigoL, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 30, padding: '5px 14px' }}>
        <span style={{ color: T.purpleL }}>✦</span>
        <span style={{ color: T.purpleL, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>Syncing Integration Nodes…</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '5rem', fontFamily: T.font }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.92)' : 'rgba(22,163,74,0.92)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
          borderRadius: 14, padding: '0.875rem 1.25rem',
          fontSize: 13, fontWeight: 600, color: 'white',
          animation: 'slideIn 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          {toast.type === 'error' ? <IcoX size={15} stroke="white" sw={2.5} /> : <IcoCheck size={15} stroke="white" sw={2.5} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: '0.25rem' }}>
            <IcoX size={13} stroke="currentColor" />
          </button>
        </div>
      )}

      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <div style={{ animation: 'fadeUp 0.45s ease both' }}>
     
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: 8 }}>
          <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, color: T.t1, letterSpacing: -0.6, margin: 0 }}>
            Neural Connectors
          </h2>
          <span style={{ color: T.purpleL, animation: 'pl 2s infinite' }}>
            <IcoSparkle size={18} stroke={T.purpleL} />
          </span>
        </div>
        <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
          Link your social nodes to the AutoBot brain. Ensure your Webhook settings in Meta / Telegram match the identifiers below.
        </p>
      </div>

      {/* ── INSTAGRAM ───────────────────────────────────────────── */}
      <div style={{ animation: 'fadeUp 0.5s ease both' }}>
        <PlatformCard
          title="Instagram Node" subtitle="Meta API Gateway"
          icon={<IcoIG size={20} stroke="#ec4899" />}
          {...PLATFORMS_META.instagram}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.875rem', marginBottom: '1.25rem' }}>
            <WebhookField label="Callback URL"  value={webhookUrl('instagram')} onCopy={() => copy(webhookUrl('instagram'), 'ig_u')} copied={copied === 'ig_u'} />
            <WebhookField label="Verify Token"  value={instaConfig.verifyToken} valueColor="#4ade80" onCopy={() => copy(instaConfig.verifyToken, 'ig_v')} copied={copied === 'ig_v'} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InputField label="Business Account ID" icon={<IcoFinger size={16} stroke={T.t3} />} placeholder="17841..." value={instaConfig.instaId} onChange={e => setInstaConfig({ ...instaConfig, instaId: e.target.value })} />
            <InputField label="System Access Token" icon={<IcoKey size={16} stroke={T.t3} />} placeholder="EAAG..." type="password" value={instaConfig.accessToken} onChange={e => setInstaConfig({ ...instaConfig, accessToken: e.target.value })} />
            <SaveButton label="Establish Instagram Link" onClick={() => handleSave('instagram', { instaId: instaConfig.instaId, accessToken: instaConfig.accessToken })} />
          </div>
        </PlatformCard>
      </div>

      {/* ── WHATSAPP ─────────────────────────────────────────────── */}
      <div style={{ animation: 'fadeUp 0.55s ease both' }}>
        <PlatformCard
          title="WhatsApp Cloud" subtitle="Business API Node"
          icon={<IcoWA size={20} stroke="#10b981" />}
          {...PLATFORMS_META.whatsapp}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.875rem', marginBottom: '1.25rem' }}>
            <WebhookField label="Webhook URL"      value={webhookUrl('whatsapp')} onCopy={() => copy(webhookUrl('whatsapp'), 'wa_u')} copied={copied === 'wa_u'} />
            <WebhookField label="Handshake Token"  value={waConfig.verifyToken}  valueColor="#4ade80" onCopy={() => copy(waConfig.verifyToken, 'wa_v')} copied={copied === 'wa_v'} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InputField label="Phone Number ID"   icon={<IcoPhone size={16} stroke={T.t3} />} placeholder="1056..." value={waConfig.phoneId} onChange={e => setWaConfig({ ...waConfig, phoneId: e.target.value })} />
            <InputField label="System User Token" icon={<IcoKey size={16} stroke={T.t3} />} placeholder="EAAG..." type="password" value={waConfig.accessToken} onChange={e => setWaConfig({ ...waConfig, accessToken: e.target.value })} />
            <SaveButton label="Establish WhatsApp Link" onClick={() => handleSave('whatsapp', { phoneId: waConfig.phoneId, accessToken: waConfig.accessToken })} />
          </div>
        </PlatformCard>
      </div>

      {/* ── TELEGRAM ─────────────────────────────────────────────── */}
      <div style={{ animation: 'fadeUp 0.6s ease both' }}>
        <PlatformCard
          title="Telegram Bot" subtitle="@BotFather Protocol"
          icon={<IcoTG size={20} stroke="#38bdf8" />}
          {...PLATFORMS_META.telegram}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InputField label="Bot API Token" icon={<IcoFinger size={16} stroke={T.t3} />} placeholder="123456:ABC-DEF..." type="password" value={tgConfig.botToken} onChange={e => setTgConfig({ botToken: e.target.value })} />
            <SaveButton label="Establish Telegram Link" onClick={() => handleSave('telegram', { botToken: tgConfig.botToken })} />
          </div>
        </PlatformCard>
      </div>
    </div>
  );
}