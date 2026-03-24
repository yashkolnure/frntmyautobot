import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
const IcoCpu      = p => <Ico {...p} d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />;
const IcoTerminal = p => <Ico {...p} d="M4 17l6-6-6-6M12 19h8" />;
const IcoHDD      = p => <Ico {...p} d="M22 12H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zM6 16h.01M10 16h.01" />;
const IcoShield   = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoRefresh  = p => <Ico {...p} d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-5.02" />;
const IcoFile     = p => <Ico {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />;
const IcoPlus     = p => <Ico {...p} d="M12 5v14M5 12h14" />;
const IcoX        = p => <Ico {...p} d="M18 6L6 18M6 6l12 12" />;
const IcoGlobe    = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />;
const IcoCheck    = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoAlert    = p => <Ico {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;

// ─── TOAST ───────────────────────────────────────────────────────────
let _setToast = null;
const triggerToast = (msg, type = 'success') => _setToast?.({ msg, type, id: Date.now() });

// ─── FIELD INPUT ─────────────────────────────────────────────────────
function FieldInput({ label, value, onChange, placeholder, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: T.bg0, border: `1px solid ${hov && !disabled ? T.borderH : T.border}`,
        borderRadius: 12, padding: '0.75rem 1rem',
        opacity: disabled ? 0.55 : 1, transition: 'border-color 0.2s',
      }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <input value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.t1, fontSize: 13, fontFamily: T.font, cursor: disabled ? 'not-allowed' : 'text' }}/>
      </div>
    </div>
  );
}

// ─── SELECT INPUT ────────────────────────────────────────────────────
function FieldSelect({ label, value, onChange, options }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>
        {label}
      </label>
      <div style={{
        background: T.bg0, border: `1px solid ${hov ? T.borderH : T.border}`,
        borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
      }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <select value={value} onChange={onChange} style={{
          width: '100%', background: 'transparent', border: 'none', outline: 'none',
          color: T.t1, fontSize: 13, fontFamily: T.mono, fontWeight: 600,
          padding: '0.75rem 1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {options.map(o => (
            <option key={o.value} value={o.value} style={{ background: T.bg2 }}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────
export default function TrainingView() {
  const navigate = useNavigate();
  const [availableBots, setAvailableBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState(null);
  const [isFetching, setIsFetching]       = useState(true);
  const [isSaving,   setIsSaving]         = useState(false);
  const [toast,      setToast]            = useState(null);
  const [taHov,      setTaHov]            = useState(false);
  const [addHov,     setAddHov]           = useState(false);
  const fileInputRef = useRef(null);

  _setToast = setToast;

  const [botData, setBotData] = useState({
    name: '', systemPrompt: '', baseModel: 'llama3.1:8b', knowledgeFiles: [],
  });

  const API_BASE_URL = '/api';
  const MODEL_OPTIONS = [{ value: 'llama3.1:8b', label: 'Llama 3.1 (8B)' }];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) { navigate('/login'); return; }
        const res = await fetch(`${API_BASE_URL}/user-inventory/${userId}`);
        const data = await res.json();
        if (res.ok && data.bots?.length > 0) {
          setAvailableBots(data.bots);
          loadBotConfig(data.bots[0].id);
        } else {
          navigate('/bot-creation');
        }
      } catch (err) { console.error('Inventory Fetch Error:', err); }
      finally { setIsFetching(false); }
    };
    fetchInventory();
  }, [navigate]);

  const loadBotConfig = async (botId) => {
    setIsFetching(true);
    setSelectedBotId(botId);
    try {
      const res = await fetch(`${API_BASE_URL}/config/${botId}`);
      const data = await res.json();
      if (res.ok && data.botConfig) {
        const bot = data.botConfig;
        setBotData({
          name: bot.name || '',
          systemPrompt: bot.customSystemPrompt || '',
          baseModel: bot.model?.primary || 'llama3.1:8b',
          knowledgeFiles: bot.meta?.knowledge || [],
        });
      }
    } catch (err) { console.error('Config Load Error:', err); }
    finally { setIsFetching(false); }
  };

  const removeFile = (fileId) => setBotData(prev => ({ ...prev, knowledgeFiles: prev.knowledgeFiles.filter(f => f.id !== fileId) }));

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('process', 'true');
    try {
      const res = await fetch(`${API_BASE_URL}/upload-knowledge`, { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) {
        setBotData(prev => ({ ...prev, knowledgeFiles: [...prev.knowledgeFiles, result.fileMetadata] }));
        triggerToast('Knowledge file uploaded');
      } else throw new Error(result.error || 'Upload failed');
    } catch (err) { triggerToast(err.message, 'error'); }
    finally { setIsSaving(false); e.target.value = null; }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId: selectedBotId, botName: botData.name, systemPrompt: botData.systemPrompt, baseModel: botData.baseModel, knowledgeFiles: botData.knowledgeFiles }),
      });
      if (res.ok) { triggerToast('Neural architecture synced!'); }
      else { const err = await res.json(); throw new Error(err.details || 'Update failed'); }
    } catch (err) { triggerToast(err.message, 'error'); }
    finally { setIsSaving(false); }
  };

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  // ── LOADING ──────────────────────────────────────────────────────
  if (isFetching) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 360, background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
      border: `1px solid ${T.border}`, borderRadius: 22, gap: '1.25rem', fontFamily: T.font,
    }}>
      <div style={{ width: 40, height: 40, border: `3px solid rgba(99,102,241,0.15)`, borderTopColor: T.indigoL, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 30, padding: '5px 14px' }}>
        <span style={{ color: T.purpleL }}>✦</span>
        <span style={{ color: T.purpleL, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>Neural Link Establishing…</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── MAIN ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem', fontFamily: T.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes rowIn   { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        .kb-file { transition: border-color .2s, background .2s; }
        .kb-file:hover { border-color: rgba(99,102,241,0.38) !important; background: rgba(99,102,241,0.05) !important; }
        .kb-file:hover .del-btn { opacity: 1 !important; }
        .train-grid { display: grid; grid-template-columns: 1fr 300px; gap: 1.25rem; align-items: start; }
        @media(max-width:900px){ .train-grid { grid-template-columns: 1fr; } }
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
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', width: 180, height: 180, background: 'radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: T.purpleL, textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 12 }}>
            Model Management
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: T.t1, letterSpacing: -0.8, margin: 0 }}>
              Bot{' '}
              <span style={{ backgroundImage: 'linear-gradient(135deg,#818cf8,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shim 5s linear infinite' }}>
                Configuration
              </span>
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 30, padding: '4px 12px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block', animation: 'pl 2s infinite' }} />
              <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', fontFamily: T.mono }}>Live Propagation</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.75, maxWidth: 480, margin: 0 }}>
            Configure model identity, system instructions, and inject knowledge assets into your neural architecture.
          </p>
        </div>
        <div style={{ position: 'absolute', right: '-1.5rem', bottom: '-1.5rem', opacity: 0.06, transform: 'rotate(-12deg)' }}>
          <IcoCpu size={130} stroke={T.purpleL} sw={1} />
        </div>
      </div>

      {/* ── MAIN GRID ────────────────────────────────────────────── */}
      <div className="train-grid">

        {/* ── LEFT: CORE ARCHITECTURE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Identity + Model fields */}
          <div style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
            border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden',
            animation: 'fadeUp 0.55s ease both',
          }}>
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
                <IcoCpu size={14} stroke={T.indigoL} /> Core Architecture
              </h4>
              {/* bot selector pills */}
              {availableBots.length > 1 && (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {availableBots.map(bot => (
                    <button key={bot.id} onClick={() => loadBotConfig(bot.id)} style={{
                      padding: '3px 10px', borderRadius: 8, cursor: 'pointer',
                      background: selectedBotId === bot.id ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)',
                      border: selectedBotId === bot.id ? '1px solid transparent' : `1px solid ${T.border}`,
                      color: selectedBotId === bot.id ? 'white' : T.t3,
                      fontSize: 10, fontWeight: 700, fontFamily: T.mono, transition: 'all 0.2s',
                    }}>{bot.name || bot.id}</button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
              <FieldInput
                label="Identity Label"
                value={botData.name}
                onChange={e => setBotData({ ...botData, name: e.target.value })}
                placeholder="Bot name…"
              />
              <FieldSelect
                label="Base Logic Engine"
                value={botData.baseModel}
                onChange={e => setBotData({ ...botData, baseModel: e.target.value })}
                options={MODEL_OPTIONS}
              />
            </div>
          </div>

          {/* System Prompt */}
          <div style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
            border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden',
            animation: 'fadeUp 0.6s ease both',
          }}>
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
                <IcoTerminal size={14} stroke={T.indigoL} /> Neural System Instructions
              </h4>
              <span style={{ fontSize: 9, fontWeight: 700, color: T.t3, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                v4.2 Logic Node
              </span>
            </div>

            {/* code-style textarea */}
            <div style={{
              background: T.bg0, border: `1px solid ${taHov ? T.borderH : 'transparent'}`,
              margin: '1rem', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
            }}
              onMouseEnter={() => setTaHov(true)}
              onMouseLeave={() => setTaHov(false)}
            >
              <textarea
                rows={12}
                value={botData.systemPrompt}
                onChange={e => setBotData({ ...botData, systemPrompt: e.target.value })}
                placeholder="Initialize system logic…"
                style={{
                  width: '100%', padding: '1rem 1.25rem',
                  background: 'transparent', border: 'none', outline: 'none',
                  color: T.purpleL, fontSize: 12, fontFamily: T.mono,
                  lineHeight: 1.7, resize: 'vertical', minHeight: 220,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: KNOWLEDGE + SYNC ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Knowledge Files */}
          <div style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
            border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden',
            animation: 'fadeUp 0.55s ease both',
          }}>
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
                <IcoHDD size={14} stroke={T.indigoL} /> Knowledge Injected
                <span style={{ fontSize: 9, fontWeight: 800, fontFamily: T.mono, background: 'rgba(99,102,241,0.15)', border: `1px solid ${T.border}`, borderRadius: 6, padding: '1px 6px', color: T.indigoL }}>
                  {botData.knowledgeFiles.length}
                </span>
              </h4>
              <button onClick={() => fileInputRef.current?.click()}
                onMouseEnter={() => setAddHov(true)}
                onMouseLeave={() => setAddHov(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 9,
                  background: addHov ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(99,102,241,0.1)',
                  border: `1px solid ${addHov ? 'transparent' : 'rgba(99,102,241,0.28)'}`,
                  color: addHov ? 'white' : T.indigoL,
                  fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: T.font, transition: 'all 0.2s',
                  boxShadow: addHov ? '0 4px 14px rgba(79,70,229,.3)' : 'none',
                }}>
                <IcoPlus size={12} stroke="currentColor" /> Add File
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 320, overflowY: 'auto' }}>
              {botData.knowledgeFiles.length > 0 ? (
                botData.knowledgeFiles.map((file, idx) => (
                  <div key={file.id} className="kb-file" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', borderRadius: 11,
                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`,
                    animation: `rowIn .3s ${idx * 0.05}s ease both`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: 'rgba(99,102,241,0.1)', border: `1px solid ${T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.indigoL }}>
                        <IcoFile size={14} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: T.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {file.name || 'knowledge_asset.pdf'}
                        </p>
                        <p style={{ fontSize: 9, fontWeight: 700, color: '#4ade80', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: T.mono }}>
                          Vectorized
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="del-btn" style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: T.t3, cursor: 'pointer', opacity: 0, transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = T.red; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; }}
                    >
                      <IcoX size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', border: `1px dashed rgba(99,102,241,0.15)`, borderRadius: 12 }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>🧠</div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: T.t3, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Memory Empty</p>
                  <p style={{ fontSize: 11, color: T.t3, marginTop: 4 }}>Upload files to inject knowledge.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sync card */}
          <div style={{
            background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
            border: `1px solid ${T.border}`, borderRadius: 20,
            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem',
            animation: 'fadeUp 0.6s ease both',
          }}>
            {/* stat pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
              {[
                { label: 'Knowledge Files', value: botData.knowledgeFiles.length, color: T.indigoL },
                { label: 'Model Version',   value: 'v4.2',                        color: T.amber   },
              ].map(s => (
                <div key={s.label} style={{ background: `linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))`, border: `1px solid ${T.border}`, borderRadius: 10, padding: '0.75rem' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, margin: '0 0 4px' }}>{s.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: T.mono, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '0.875rem' }}>
              {/* Sync button */}
              <button onClick={handleUpdate} disabled={isSaving} style={{
                width: '100%', padding: '0.875rem',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: '1px solid transparent', borderRadius: 12,
                color: 'white', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: T.font,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: '0 4px 16px rgba(79,70,229,.35)',
                opacity: isSaving ? 0.7 : 1, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!isSaving) { e.currentTarget.style.boxShadow = '0 6px 24px rgba(79,70,229,.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {isSaving
                  ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                  : <IcoShield size={14} stroke="white" />}
                {isSaving ? 'Syncing…' : 'Sync Architecture'}
              </button>

              {/* Live status */}
              <div style={{
                marginTop: '0.625rem', padding: '0.625rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 10,
              }}>
                <IcoGlobe size={12} stroke="#4ade80" />
                <span style={{ fontSize: 9, fontWeight: 700, color: T.t3, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Live Propagation Active
                </span>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.green, display: 'inline-block', animation: 'pl 2s infinite' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}