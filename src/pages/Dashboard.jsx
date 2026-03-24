import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveConfig, getConfig } from '../api';

// COMPONENT IMPORTS
import Sidebar from '../components/dashboard/Sidebar';
import TrainingView from '../components/dashboard/TrainingView';
import ReferAndEarnView from '../components/dashboard/ReferAndEarnView';
import HistoryView from '../components/dashboard/HistoryView';
import DeploymentView from '../components/dashboard/DeploymentView';
import LeadsView from '../components/dashboard/LeadsView';
import IntegrationsView from '../components/dashboard/IntegrationsView';
import APIKeysView from '../components/dashboard/APIKeysView';
import TokenPurchaseView from '../components/dashboard/TokenPurchaseView';
import ProfilePage from '../components/dashboard/ProfilePage';
import ChatTest from '../components/ChatTest';

// ─── DESIGN TOKENS — exact match from landing page ───────────────────
const T = {
  bg0: '#03020a', bg1: '#070512', bg2: '#0d0b1e', bg3: '#13102b',
  border:  'rgba(99,102,241,0.18)',
  borderH: 'rgba(99,102,241,0.45)',
  purple: '#7c3aed', purpleL: '#a78bfa',
  indigo: '#4f46e5', indigoL: '#818cf8',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  green: '#22c55e',
  font: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono: "'DM Mono',monospace",
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────
const GlobalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${T.font}; background: ${T.bg1}; }
    @keyframes spin   { to { transform: rotate(360deg); } }
    @keyframes pl     { 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse  { 0%,100%{opacity:.6} 50%{opacity:1} }
    .dash-scroll::-webkit-scrollbar { width: 4px; }
    .dash-scroll::-webkit-scrollbar-track { background: transparent; }
    .dash-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 99px; }
  `}</style>
);

// ─── INLINE ICONS ────────────────────────────────────────────────────
const Ico = ({ d, size = 20, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoMenu = p => <Ico {...p} d="M4 6h16M4 12h16M4 18h16" />;
const IcoX    = p => <Ico {...p} d="M18 6L6 18M6 6l12 12" />;

// ─── AMBIENT GLOW — matches landing page exactly ─────────────────────
const AmbientGlow = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: '-10%', left: '-5%',
      width: '48vw', height: '52vh', borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(79,70,229,.13) 0%,transparent 70%)',
    }} />
    <div style={{
      position: 'absolute', top: '35%', right: '-8%',
      width: '40vw', height: '44vh', borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',
    }} />
    <div style={{
      position: 'absolute', bottom: '-5%', left: '10%',
      width: '42vw', height: '40vh', borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(124,58,237,.09) 0%,transparent 70%)',
    }} />
  </div>
);

// ─── LOADING SCREEN ──────────────────────────────────────────────────
const LoadingScreen = () => (
  <div style={{
    height: '100vh', width: '100vw',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: T.bg1, fontFamily: T.font,
    gap: '1.25rem',
  }}>
    <GlobalCSS />
    <AmbientGlow />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      {/* spinner */}
      <div style={{
        width: 52, height: 52,
        border: `3px solid rgba(99,102,241,0.15)`,
        borderTopColor: T.indigoL,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {/* pill badge — same style as landing */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.28)',
        borderRadius: 30, padding: '6px 16px',
      }}>
        <span style={{ color: T.purpleL, fontSize: 13 }}>✦</span>
        <span style={{
          color: T.purpleL, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          fontFamily: T.mono,
        }}>Synchronizing Neural Nodes…</span>
      </div>
    </div>
  </div>
);

// ─── TAB LABEL MAP ───────────────────────────────────────────────────
const tabLabel = {
  training:     'Neural Control',
  history:      'History',
  leads:        'Leads',
  referral:     'Refer & Earn',
  deployment:   'Deployment',
  profile:      'Profile',
  apikeys:      'API Keys',
  integrations: 'Integrations',
  purchase:     'Buy Tokens',
};

// ─── DASHBOARD ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab,      setActiveTab]      = useState('training');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [userId,         setUserId]         = useState(null);
  const [isFetching,     setIsFetching]     = useState(true);
  const [tokens,         setTokens]         = useState(0);

  const [data, setData] = useState({
    status: 'draft',
    model: { primary: 'llama3.2', fallback: 'llama3' },
    rawData: {
      businessName: '',
      businessDescription: '',
      pricing: '',
      faq: '',
      policies: '',
    },
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data: res } = await getConfig();
        const botObj = res.bot || res.botConfig;
        if (botObj) {
          setData(botObj);
          setUserId(botObj.user || botObj._id);
        }
        if (res.userTokens !== undefined) setTokens(res.userTokens);
      } catch (err) {
        console.error('Neural Sync failed.', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchConfig();
  }, []);

  const onSave = async (finalPayload) => {
    setLoading(true);
    try {
      const response = await saveConfig(finalPayload);
      if (response.data.success) {
        setData(response.data.bot);
        setUserId(response.data.bot._id);
        alert('🚀 Configuration Synced Successfully!');
      }
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.message || 'Sync Failed'}`);
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <LoadingScreen />;

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: T.bg1, color: T.t2,
      overflow: 'hidden', position: 'relative',
      fontFamily: T.font,
    }}>
      <GlobalCSS />
      <AmbientGlow />

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 45,
            background: 'rgba(3,2,10,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'none', // shown via media query class below
          }}
          className="mobile-overlay"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`sidebar-wrapper ${mobileMenuOpen ? 'sidebar-open' : ''}`}
        style={{ flexShrink: 0, position: 'relative', zIndex: 50 }}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }}
          userTokens={tokens}
          onLogout={() => { localStorage.removeItem('token'); navigate('/login'); }}
        />
      </div>

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        minWidth: 0, overflow: 'hidden', position: 'relative', zIndex: 10,
      }}>

        {/* HEADER */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(7,5,18,0.82)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${T.border}`,
          padding: '0 1.5rem',
          height: 62,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="mobile-menu-btn"
              style={{
                display: 'none', // shown via media query
                padding: '0.5rem',
                background: mobileMenuOpen ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${mobileMenuOpen ? T.borderH : T.border}`,
                borderRadius: 10,
                color: mobileMenuOpen ? T.purpleL : T.t2,
                cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {mobileMenuOpen ? <IcoX size={18} stroke="currentColor" /> : <IcoMenu size={18} stroke="currentColor" />}
            </button>

            {/* Title area */}
            <div>
              {/* Section label — same style as landing */}
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                color: T.t3, textTransform: 'uppercase',
                fontFamily: T.mono, marginBottom: 2,
              }}>
                Node: Synchronized · v2.0.4
              </div>
              <h1 style={{
                fontSize: '1.05rem', fontWeight: 900, color: T.t1,
                letterSpacing: -0.3, lineHeight: 1,
              }}>
                {tabLabel[activeTab] || activeTab}
              </h1>
            </div>
          </div>

          {/* Token badge — indigo pill matching landing badge style */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.28)',
            borderRadius: 30, padding: '5px 14px',
          }}>
            <span style={{ color: T.indigoL, fontSize: 11 }}>◈</span>
            <span style={{
              color: T.indigoL, fontSize: 13, fontWeight: 700,
              fontFamily: T.mono,
            }}>
              {tokens.toLocaleString()}
            </span>
            <span style={{ color: T.t3, fontSize: 11, fontWeight: 600 }}>tokens</span>
          </div>
        </header>

        {/* VIEW RENDERER */}
        <div
          className="dash-scroll"
          style={{
            flex: 1, overflowY: 'auto',
            padding: '1.75rem',
            animation: 'fadeUp 0.5s ease both',
          }}
        >
          <div style={{ maxWidth: 1700, margin: '0 auto' }}>
            {activeTab === 'training' && (
              <TrainingView data={data} setData={setData} onSave={onSave} loading={loading} />
            )}
            {activeTab === 'history'      && <HistoryView />}
            {activeTab === 'leads'        && <LeadsView />}
            {activeTab === 'referral'     && <ReferAndEarnView userId={userId} />}
            {activeTab === 'deployment'   && <DeploymentView userId={userId} />}
            {activeTab === 'profile'      && <ProfilePage userId={userId} />}
            {activeTab === 'apikeys'      && <APIKeysView userId={userId} />}
            {activeTab === 'integrations' && <IntegrationsView userId={userId} />}
            {activeTab === 'purchase'     && (
              <TokenPurchaseView
                userTokens={tokens}
                onPurchase={(planId) => console.log(`Checkout: ${planId}`)}
              />
            )}
          </div>
        </div>
      </main>

      {/* CHAT TEST LAB */}
      <ChatTest
        botName={data.rawData?.businessName || 'My AI Agent'}
        botId={userId}
      />

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 1024px) {
          .sidebar-wrapper {
            position: fixed !important;
            inset-block: 0;
            left: 0;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(.4,0,.2,1);
            width: 256px;
          }
          .sidebar-wrapper.sidebar-open {
            transform: translateX(0);
          }
          .mobile-menu-btn  { display: flex !important; }
          .mobile-overlay   { display: block !important; }
        }
      `}</style>
    </div>
  );
}