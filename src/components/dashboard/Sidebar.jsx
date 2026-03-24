import React, { useState } from 'react';

// ─── DESIGN TOKENS — exact match from landing page ───────────────────
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

// ─── INLINE SVG ICONS ────────────────────────────────────────────────
const Ico = ({ d, size = 18, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoTerminal   = p => <Ico {...p} d="M4 17l6-6-6-6M12 19h8" />;
const IcoShare      = p => <Ico {...p} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />;
const IcoUsers      = p => <Ico {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcoMsg        = p => <Ico {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
const IcoWA         = p => <Ico {...p} d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />;
const IcoSettings   = p => <Ico {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />;
const IcoKey        = p => <Ico {...p} d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />;
const IcoDollar     = p => <Ico {...p} d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
const IcoCoins      = p => <Ico {...p} d="M9 14c0 1.657 2.686 3 6 3s6-1.343 6-3M9 14c0-1.657 2.686-3 6-3s6 1.343 6 3M9 14v4c0 1.657 2.686 3 6 3s6-1.343 6-3v-4M3 6c0 1.657 2.686 3 6 3s6-1.343 6-3M3 6c0-1.657 2.686-3 6-3s6 1.343 6 3M3 6v10c0 1.657 2.686 3 6 3" />;
const IcoUser       = p => <Ico {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IcoLogout     = p => <Ico {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const IcoZap        = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;

// ─── NAV CONFIG ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'training',     icon: IcoTerminal, label: 'AI Training'     },
  { id: 'deployment',   icon: IcoShare,    label: 'Deployment'      },
  { id: 'leads',        icon: IcoUsers,    label: 'Leads Monitor'   },
  { id: 'history',      icon: IcoMsg,      label: 'Chat History'    },
  { id: 'whatsapp',     icon: IcoWA,       label: 'WhatsApp',  href: '/whatsapp' },
  { id: 'integrations', icon: IcoSettings, label: 'Socials (BETA)'  },
  { id: 'apikeys',      icon: IcoKey,      label: 'API Keys'        },
  { id: 'referral',     icon: IcoDollar,   label: 'Earn Tokens'     },
  { id: 'purchase',     icon: IcoCoins,    label: 'Credits Refill'  },
  { id: 'profile',      icon: IcoUser,     label: 'My Profile'      },
];

// ─── SIDEBAR ITEM ────────────────────────────────────────────────────
function SidebarItem({ icon: Icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.625rem 0.875rem',
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: active
          ? 'linear-gradient(135deg, rgba(79,70,229,0.22), rgba(124,58,237,0.12))'
          : hov ? 'rgba(99,102,241,0.07)' : 'transparent',
        border: `1px solid ${active ? T.borderH : hov ? T.border : 'transparent'}`,
        boxShadow: active ? '0 4px 18px rgba(79,70,229,0.2)' : 'none',
      }}
    >
      {/* active left bar */}
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%',
          width: 3, borderRadius: '0 2px 2px 0',
          background: 'linear-gradient(180deg, #6366f1, #7c3aed)',
          boxShadow: '0 0 8px rgba(99,102,241,0.6)',
        }} />
      )}

      <span style={{ color: active ? T.indigoL : hov ? T.purpleL : T.t3, transition: 'color 0.2s' }}>
        <Icon size={17} stroke="currentColor" />
      </span>

      <span style={{
        fontSize: 12, fontWeight: 700,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: active ? T.t1 : hov ? T.t1 : T.t2,
        transition: 'color 0.2s',
        fontFamily: T.font,
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────
export default function Sidebar({ activeTab, setActiveTab, onLogout, userTokens = 0 }) {
  const tokenPct = Math.min((userTokens / 500) * 100, 100);

  return (
    <aside style={{
      height: '100%', width: '100%',
      background: `linear-gradient(180deg, rgba(13,11,30,0.97) 0%, rgba(7,5,18,0.99) 100%)`,
      backdropFilter: 'blur(24px)',
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      padding: '1rem',
      overflowY: 'auto',
      position: 'relative',
      fontFamily: T.font,
    }}>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 99px; }
        @keyframes pl { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes zap { 0%,100%{opacity:.6} 50%{opacity:1} }
      `}</style>

      {/* ── BRANDING — same pill style as landing nav ── */}
      <div
        onClick={() => setActiveTab('training')}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          marginBottom: '1.75rem', marginTop: '0.5rem',
          padding: '0.5rem 0.625rem',
          cursor: 'pointer',
          borderRadius: 12,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <img
          src="https://avenirya.com/wp-content/uploads/2026/03/image-removebg-preview-1.png"
          alt=""
          style={{ height: 32, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.4, color: T.t1 }}>
            MyAuto
            <span style={{
              backgroundImage: 'linear-gradient(135deg,#818cf8,#a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Bot</span>
          </span>
          <span style={{
            fontSize: 7.5, fontWeight: 700, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: T.t3, marginTop: 3,
            fontFamily: T.mono,
          }}>Systems · AI</span>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {/* section label — same style as landing section labels */}
        <p style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: T.t3,
          marginBottom: '0.5rem', paddingLeft: '0.875rem',
          fontFamily: T.mono,
        }}>Core Control</p>

        {NAV_ITEMS.map(({ id, icon, label, href }) => (
          <SidebarItem
            key={id}
            icon={icon}
            label={label}
            active={activeTab === id}
            onClick={() => href ? (window.location.href = href) : setActiveTab(id)}
          />
        ))}
      </nav>

      {/* ── BOTTOM SECTION ── */}
      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

        {/* Token balance card — indigo theme matching landing */}
        <div
          onClick={() => setActiveTab('purchase')}
          style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.06))',
            border: `1px solid rgba(99,102,241,0.28)`,
            borderRadius: 14, padding: '0.875rem',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.background = 'linear-gradient(135deg,rgba(79,70,229,0.16),rgba(124,58,237,0.1))'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.28)'; e.currentTarget.style.background = 'linear-gradient(135deg,rgba(79,70,229,0.1),rgba(124,58,237,0.06))'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: 9, fontWeight: 700, color: T.indigoL,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              fontFamily: T.mono,
            }}>Neural Balance</span>
            <span style={{ color: T.purpleL, animation: 'zap 2s infinite' }}>
              <IcoZap size={12} stroke="currentColor" />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginBottom: '0.75rem' }}>
            <span style={{
              fontSize: '1.4rem', fontWeight: 900, color: T.t1,
              fontFamily: T.mono, letterSpacing: -0.5,
            }}>{userTokens.toLocaleString()}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credits</span>
          </div>
          {/* progress bar */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${tokenPct}%`,
              background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
              boxShadow: '0 0 8px rgba(79,70,229,0.5)',
              transition: 'width 1s ease',
            }} />
          </div>
        </div>

        {/* Node status — same live dot style as landing footer */}
        <div style={{ padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: T.green, boxShadow: `0 0 7px ${T.green}`,
              display: 'inline-block', animation: 'pl 2s infinite',
            }} />
            <span style={{
              fontSize: 9, fontWeight: 700, color: T.green,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              fontFamily: T.mono,
            }}>Node: SRV-1208</span>
          </div>
          <p style={{
            fontSize: 9, fontWeight: 600, color: T.t3,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: T.mono, paddingLeft: 12,
          }}>AES-256 Protected Session</p>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            width: '100%', padding: '0.625rem 0.875rem',
            background: 'none', border: `1px solid transparent`,
            borderRadius: 12, cursor: 'pointer',
            color: T.t3, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            fontFamily: T.font, transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fca5a5';
            e.currentTarget.style.background = 'rgba(239,68,68,0.07)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = T.t3;
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <IcoLogout size={15} stroke="currentColor" />
          Sign Out
        </button>
      </div>

      {/* bottom ambient glow — same as landing */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to top, rgba(79,70,229,0.06), transparent)',
        pointerEvents: 'none', zIndex: 0,
      }} />
    </aside>
  );
}