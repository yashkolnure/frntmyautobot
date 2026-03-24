import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  // Portal system
  bg0: '#03020a', bg1: '#070512', bg2: '#0d0b1e', bg3: '#13102b',
  border:  'rgba(99,102,241,0.18)',
  borderH: 'rgba(99,102,241,0.45)',
  indigo: '#4f46e5', indigoL: '#818cf8',
  purple: '#7c3aed', purpleL: '#a78bfa',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  green: '#22c55e', red: '#ef4444', amber: '#f59e0b',
  font: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono: "'DM Mono',monospace",
  // WhatsApp chat area (kept authentic)
  waGreen:  '#00a884',
  waBg:     '#111b21',
  waPanel:  '#1f2c34',
  waChatBg: '#0b141a',
  waInMsg:  '#202c33',
  waOutMsg: '#005c4b',
  waText:   '#e9edef',
  waSub:    '#8696a0',
  waDivider:'rgba(134,150,160,0.12)',
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────
const GlobalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{height:100%;}
    body{font-family:${T.font};background:${T.bg0};}

    @keyframes pl      {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes slideUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes msgIn   {from{opacity:0;transform:translateY(5px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes spin    {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
    @keyframes shim    {0%{background-position:-200% center}100%{background-position:200% center}}

    ::-webkit-scrollbar       {width:4px;}
    ::-webkit-scrollbar-track {background:transparent;}
    ::-webkit-scrollbar-thumb {background:rgba(99,102,241,.2);border-radius:4px;}

    .conv-item { transition:background .15s; cursor:pointer; border-bottom:1px solid ${T.waDivider}; }
    .conv-item:hover  { background:rgba(255,255,255,.04)!important; }
    .conv-item.active { background:rgba(99,102,241,0.1)!important; border-left:2px solid ${T.indigo}!important; }
    .icon-btn:hover   { background:rgba(255,255,255,.07)!important; }
    .send-active      { background:${T.waGreen}!important; border-color:${T.waGreen}!important; }
    .msg-bubble       { animation:msgIn .22s ease; }
    .attach-opt:hover { background:rgba(255,255,255,.06)!important; }

    textarea::placeholder { color:${T.waSub}; }
    textarea:focus { outline:none; }
    input::placeholder { color:${T.t3}; }
    input:focus { outline:none; }

    .toggle-track {
      position:relative; width:44px; height:24px; border-radius:12px;
      cursor:pointer; transition:background .25s; border:none; padding:0; flex-shrink:0;
    }
    .toggle-thumb {
      position:absolute; top:3px; left:3px; width:18px; height:18px;
      border-radius:50%; background:white;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1);
      box-shadow:0 1px 4px rgba(0,0,0,.35);
    }
    .toggle-track.on .toggle-thumb { transform:translateX(20px); }

    .mobile-back { display:none; }
    @media(max-width:768px){
      .sidebar { position:absolute!important; inset:0; z-index:50; width:100%!important; }
      .sidebar.hidden { display:none!important; }
      .chat-area.hidden { display:none!important; }
      .mobile-back { display:flex!important; }
      .nav-label { display:none!important; }
    }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=20, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoBot      = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>;
const IcoSearch   = p => <Ico {...p} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"/>;
const IcoMenu     = p => <Ico {...p} d="M4 6h16M4 12h16M4 18h16"/>;
const IcoBack     = p => <Ico {...p} d="M19 12H5M12 5l-7 7 7 7"/>;
const IcoSend     = p => <Ico {...p} fill="currentColor" stroke="none" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>;
const IcoPlus     = p => <Ico {...p} d="M12 5v14M5 12h14"/>;
const IcoGrid     = p => <Ico {...p} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>;
const IcoLogout   = p => <Ico {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;
const IcoAlert    = p => <Ico {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>;
const IcoTick2    = p => <Ico {...p} d="M1 12l4 4L15 6M6 12l4 4 8-10" sw={2.2}/>;
const IcoPhone    = p => <Ico {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.7 2a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>;
const IcoVideo    = p => <Ico {...p} d="M23 7l-7 5 7 5V7zM1 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1"/>;
const IcoImage    = p => <Ico {...p} d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>;
const IcoPin      = p => <Ico {...p} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>;
const IcoFile     = p => <Ico {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/>;
const IcoDownArrow= p => <Ico {...p} d="M12 5v14M5 12l7 7 7-7"/>;
const IcoZap      = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoMsg      = p => <Ico {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>;

// ─── HELPERS ─────────────────────────────────────────────────────────
const fmtTime = ts => new Date(ts).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
const fmtDate = ts => {
  const d = new Date(ts), now = new Date();
  const diff = (now - d) / 86400000;
  if (diff < 1) return fmtTime(ts);
  if (diff < 2) return 'Yesterday';
  return d.toLocaleDateString([], { day:'2-digit', month:'short' });
};
const COLORS = ['#4f46e5','#7c3aed','#0ea5e9','#d946ef','#f97316','#06b6d4','#16a34a','#00a884'];
const avatarColor = s => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
};
const fmtBytes = b => b < 1024 ? b+'B' : b < 1048576 ? (b/1024).toFixed(1)+'KB' : (b/1048576).toFixed(1)+'MB';

// ─── AVATAR ──────────────────────────────────────────────────────────
const Avatar = ({ id = '', size = 42 }) => {
  const bg = avatarColor(String(id));
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, flexShrink: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <svg width={size * 0.72} height={size * 0.78} viewBox="0 0 36 40" fill="none">
        <circle cx="18" cy="13" r="8" fill="rgba(255,255,255,0.85)"/>
        <path d="M2 38c0-8.84 7.16-16 16-16s16 7.16 16 16" fill="rgba(255,255,255,0.7)"/>
      </svg>
    </div>
  );
};

// ─── AI TOGGLE ───────────────────────────────────────────────────────
const AIToggle = ({ isEnabled, loading, onToggle }) => (
  <div style={{
    margin: '10px 12px 8px',
    background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
    border: `1px solid ${isEnabled ? 'rgba(34,197,94,0.3)' : T.border}`,
    borderRadius: 12, padding: '10px 12px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'all .3s',
  }}>
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: isEnabled ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.1)',
        border: `1px solid ${isEnabled ? 'rgba(34,197,94,0.3)' : T.border}`,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:15,
        transition:'all .25s',
      }}>🤖</div>
      <div>
        <div style={{ fontSize:9, fontWeight:700, color:T.t3, letterSpacing:'.14em', textTransform:'uppercase', fontFamily:T.mono, marginBottom:3 }}>
          AI Automation
        </div>
        <div style={{ fontSize:12, fontWeight:700, color: isEnabled ? '#4ade80' : T.t2, transition:'color .25s' }}>
          {loading ? 'Updating…' : isEnabled ? 'Auto-Reply Active' : 'Manual Mode'}
        </div>
      </div>
    </div>
    <button onClick={onToggle} disabled={loading}
      className={`toggle-track${isEnabled ? ' on' : ''}`}
      style={{ background: isEnabled ? T.green : 'rgba(255,255,255,.15)' }}>
      <div className="toggle-thumb"/>
    </button>
  </div>
);

// ─── CONV ITEM ───────────────────────────────────────────────────────
const ConvItem = ({ conv, active, onClick }) => {
  const last = conv.messages[conv.messages.length - 1];
  return (
    <div onClick={onClick} className={`conv-item${active ? ' active' : ''}`}
      style={{ display:'flex', alignItems:'center', padding:'10px 14px', gap:12, borderLeft: active ? `2px solid ${T.indigo}` : '2px solid transparent' }}>
      <Avatar id={conv.customerIdentifier} size={44}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
          <span style={{ fontWeight:700, fontSize:13, color: active ? T.t1 : T.waText }}>+{conv.customerIdentifier}</span>
          <span style={{ fontSize:10, color:T.t3, fontFamily:T.mono }}>{fmtDate(conv.lastInteraction)}</span>
        </div>
        <p style={{ fontSize:12, color:T.t3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {last?.type === 'image' ? '📷 Photo'
           : last?.type === 'document' ? '📄 Document'
           : last?.type === 'location' ? '📍 Location'
           : last?.text || 'New conversation'}
        </p>
      </div>
    </div>
  );
};

// ─── MESSAGE BUBBLE ──────────────────────────────────────────────────
const MsgBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  const bg     = isUser ? T.waInMsg : T.waOutMsg;

  const renderContent = () => {
    if (msg.type === 'image') {
      return (
        <div>
          <img src={msg.mediaUrl || msg.text} alt="sent"
            style={{ width:'100%', maxWidth:280, borderRadius:8, display:'block', marginBottom:4, maxHeight:220, objectFit:'cover' }}
            onError={e=>{ e.target.style.display='none'; }}/>
          {msg.caption && <p style={{ color:T.waText, fontSize:13, lineHeight:1.5, marginTop:4 }}>{msg.caption}</p>}
        </div>
      );
    }
    if (msg.type === 'document') {
      return (
        <div style={{ display:'flex', alignItems:'center', gap:10,
          background:'rgba(255,255,255,.07)', borderRadius:8, padding:'10px 12px', minWidth:180 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:'rgba(79,70,229,.2)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IcoFile size={18} stroke={T.indigoL} sw={1.9}/>
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.waText, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>
              {msg.fileName || 'Document'}
            </div>
            <div style={{ fontSize:10, color:T.waSub, marginTop:2 }}>{msg.fileSize ? fmtBytes(msg.fileSize) : 'File'}</div>
          </div>
        </div>
      );
    }
    if (msg.type === 'location') {
      return (
        <div>
          <div style={{ width:'100%', height:80, borderRadius:8, marginBottom:5,
            background:'rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <IcoPin size={20} stroke={T.waGreen} sw={2}/>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.waText }}>{msg.locationName || 'Current Location'}</div>
              {msg.lat && <div style={{ fontSize:10, color:T.waSub, fontFamily:T.mono }}>{Number(msg.lat).toFixed(5)}, {Number(msg.lng).toFixed(5)}</div>}
            </div>
          </div>
          <a href={`https://www.google.com/maps?q=${msg.lat},${msg.lng}`} target="_blank" rel="noreferrer"
            style={{ color:T.waGreen, fontSize:12, fontWeight:700, textDecoration:'underline' }}>
            Open in Google Maps ↗
          </a>
        </div>
      );
    }
    return (
      <p style={{ color:T.waText, fontSize:14, lineHeight:1.5, wordBreak:'break-word', whiteSpace:'pre-wrap' }}>{msg.text}</p>
    );
  };

  return (
    <div className="msg-bubble" style={{ display:'flex', justifyContent: isUser ? 'flex-start' : 'flex-end', padding:'2px 16px' }}>
      <div style={{
        maxWidth:'70%', minWidth:80, background:bg,
        borderRadius: isUser ? '0 10px 10px 10px' : '10px 0 10px 10px',
        padding:'7px 10px 5px', position:'relative',
        boxShadow:'0 1px 2px rgba(0,0,0,.25)',
      }}>
        <div style={{ position:'absolute', top:0,
          [isUser ? 'left' : 'right']: -8, width:0, height:0,
          borderTop: `8px solid ${bg}`,
          [isUser ? 'borderRight' : 'borderLeft']: '8px solid transparent',
        }}/>
        {renderContent()}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:4, marginTop:4 }}>
          {msg.source === 'whatsapp-test' && (
            <span style={{ fontSize:8, color:'#f87171', background:'rgba(239,68,68,.15)',
              border:'1px solid rgba(239,68,68,.25)', borderRadius:4, padding:'1px 5px', fontWeight:700, textTransform:'uppercase' }}>Test</span>
          )}
          <span style={{ fontSize:10, color:'rgba(134,150,160,.8)', whiteSpace:'nowrap', fontFamily:T.mono }}>{fmtTime(msg.timestamp)}</span>
          {!isUser && <IcoTick2 size={14} stroke={T.waGreen} sw={2}/>}
        </div>
      </div>
    </div>
  );
};

// ─── DATE SEPARATOR ──────────────────────────────────────────────────
const DateSep = ({ label }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', margin:'10px 0' }}>
    <span style={{ background:`${T.bg2}ee`, border:`1px solid ${T.border}`,
      borderRadius:8, padding:'4px 12px', fontSize:10, fontWeight:600, color:T.t3, fontFamily:T.mono }}>
      {label}
    </span>
  </div>
);

// ─── SCROLL-TO-BOTTOM BUTTON ─────────────────────────────────────────
const ScrollBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    position:'absolute', bottom:76, right:16, zIndex:20,
    width:36, height:36, borderRadius:'50%',
    background:T.bg2, border:`1px solid ${T.border}`,
    display:'flex', alignItems:'center', justifyContent:'center',
    cursor:'pointer', boxShadow:'0 4px 14px rgba(0,0,0,.5)',
    animation:'fadeIn .2s ease',
  }}>
    <IcoDownArrow size={17} stroke={T.t3} sw={2}/>
  </button>
);

// ─── IMAGE PREVIEW ───────────────────────────────────────────────────
const ImagePreview = ({ file, caption, onCaptionChange, onSend, onCancel, sending }) => (
  <div style={{ position:'absolute', inset:0, zIndex:100, background:'rgba(3,2,10,.97)',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
    <div style={{ marginBottom:14, color:T.t1, fontWeight:800, fontSize:15, letterSpacing:-.2 }}>Send Photo</div>
    <img src={URL.createObjectURL(file)} alt="preview"
      style={{ maxWidth:320, maxHeight:300, borderRadius:14, objectFit:'contain', border:`1px solid ${T.border}`, marginBottom:16 }}/>
    <div style={{ width:'100%', maxWidth:320, marginBottom:16, display:'flex', alignItems:'center', gap:8,
      background:T.bg0, border:`1px solid ${T.border}`, borderRadius:12, padding:'0.75rem 1rem' }}>
      <input type="text" placeholder="Add a caption…" value={caption} onChange={e=>onCaptionChange(e.target.value)}
        style={{ flex:1, background:'transparent', border:'none', outline:'none', color:T.t1, fontSize:13, fontFamily:T.font }}/>
    </div>
    <div style={{ display:'flex', gap:10 }}>
      <button onClick={onCancel} style={{ padding:'10px 24px', borderRadius:10,
        background:'rgba(255,255,255,.04)', border:`1px solid ${T.border}`,
        color:T.t2, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:T.font }}>Cancel</button>
      <button onClick={onSend} disabled={sending} style={{ padding:'10px 28px', borderRadius:10,
        background:'linear-gradient(135deg,#4f46e5,#7c3aed)', border:'none',
        color:'white', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:T.font,
        display:'flex', alignItems:'center', gap:7, opacity:sending?.7:1,
        boxShadow:'0 4px 14px rgba(79,70,229,.35)' }}>
        {sending ? <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} style={{animation:'spin .8s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          : <IcoSend size={14} fill="white"/>}
        Send
      </button>
    </div>
  </div>
);

// ─── DOCUMENT PREVIEW ────────────────────────────────────────────────
const DocPreview = ({ file, onSend, onCancel, sending }) => (
  <div style={{ position:'absolute', inset:0, zIndex:100, background:'rgba(3,2,10,.97)',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
    <div style={{ marginBottom:14, color:T.t1, fontWeight:800, fontSize:15, letterSpacing:-.2 }}>Send Document</div>
    <div style={{ width:200, padding:'24px 20px', borderRadius:16,
      background:`linear-gradient(145deg,${T.bg2},${T.bg3})`, border:`1px solid ${T.border}`,
      display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:20 }}>
      <IcoFile size={40} stroke={T.indigoL} sw={1.5}/>
      <div style={{ textAlign:'center' }}>
        <div style={{ color:T.t1, fontWeight:700, fontSize:13, wordBreak:'break-all' }}>{file.name}</div>
        <div style={{ color:T.t3, fontSize:11, marginTop:4, fontFamily:T.mono }}>{fmtBytes(file.size)}</div>
      </div>
    </div>
    <div style={{ display:'flex', gap:10 }}>
      <button onClick={onCancel} style={{ padding:'10px 24px', borderRadius:10,
        background:'rgba(255,255,255,.04)', border:`1px solid ${T.border}`,
        color:T.t2, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:T.font }}>Cancel</button>
      <button onClick={onSend} disabled={sending} style={{ padding:'10px 28px', borderRadius:10,
        background:'linear-gradient(135deg,#4f46e5,#7c3aed)', border:'none',
        color:'white', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:T.font,
        display:'flex', alignItems:'center', gap:7, opacity:sending?.7:1,
        boxShadow:'0 4px 14px rgba(79,70,229,.35)' }}>
        {sending ? <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} style={{animation:'spin .8s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          : <IcoSend size={14} fill="white"/>}
        Send
      </button>
    </div>
  </div>
);

// ─── EMPTY STATE ─────────────────────────────────────────────────────
const EmptyState = ({ bizId }) => (
  <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
    justifyContent:'center', background:T.waChatBg, padding:40, textAlign:'center' }}>
    {/* Portal-style hero card */}
    <div style={{
      background:'linear-gradient(135deg,rgba(79,70,229,0.1),rgba(59,130,246,0.05),rgba(124,58,237,0.08))',
      border:`1px solid ${T.border}`, borderRadius:22, padding:'2.5rem 2rem',
      maxWidth:380, width:'100%', position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:'50%', right:'5%', transform:'translateY(-50%)',
        width:140, height:140, background:'radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)', pointerEvents:'none' }}/>

      {/* icon */}
      <div style={{ width:56, height:56, borderRadius:16,
        background:'rgba(0,168,132,0.1)', border:'1px solid rgba(0,168,132,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
        <IcoMsg size={26} stroke={T.waGreen} sw={1.8}/>
      </div>

      <div style={{ fontSize:9, fontWeight:700, color:T.purpleL, letterSpacing:'.14em',
        textTransform:'uppercase', fontFamily:T.mono, marginBottom:10 }}>WhatsApp Terminal</div>

      <h2 style={{ fontSize:20, fontWeight:900, color:T.t1, letterSpacing:-.4, margin:'0 0 10px',
        backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        backgroundSize:'200%', animation:'shim 5s linear infinite' }}>
        Select a Conversation
      </h2>
      <p style={{ color:T.t2, fontSize:13, lineHeight:1.7, marginBottom:'1.25rem' }}>
        Managing messages for <strong style={{ color:T.t1 }}>{bizId}</strong>. Choose a thread from the sidebar to begin.
      </p>

      {/* feature pills */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
        {['AI Auto-Reply','24/7 Active','Lead Capture','Meta Verified'].map(f=>(
          <div key={f} style={{ padding:'4px 11px', borderRadius:20, fontFamily:T.mono,
            background:`${T.indigo}18`, border:`1px solid rgba(99,102,241,0.28)`,
            fontSize:9, fontWeight:700, color:T.indigoL, letterSpacing:'.08em', textTransform:'uppercase' }}>{f}</div>
        ))}
      </div>
    </div>
  </div>
);

// ─── ATTACH MENU ─────────────────────────────────────────────────────
const AttachMenu = ({ onPhoto, onDocument, onLocation }) => (
  <div onClick={e=>e.stopPropagation()} style={{
    position:'absolute', bottom:52, left:0,
    background:T.bg2, border:`1px solid ${T.border}`,
    borderRadius:14, overflow:'hidden',
    boxShadow:'0 12px 32px rgba(0,0,0,.65)',
    zIndex:50, minWidth:200, animation:'slideUp .18s ease',
  }}>
    {[
      { icon:<IcoImage size={16} stroke="#e879f9" sw={1.8}/>, label:'Photo / Image',    bg:'rgba(232,121,249,.12)', action:onPhoto    },
      { icon:<IcoFile  size={16} stroke={T.indigoL} sw={1.8}/>, label:'Document / File', bg:`${T.indigo}18`,        action:onDocument },
      { icon:<IcoPin   size={16} stroke={T.waGreen} sw={1.8}/>, label:'Current Location',bg:'rgba(0,168,132,.12)',   action:onLocation  },
    ].map(({icon,label,bg,action})=>(
      <button key={label} onClick={action} className="attach-opt" style={{
        width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 14px',
        background:'none', border:'none', cursor:'pointer', fontFamily:T.font,
        color:T.t1, fontSize:13, fontWeight:600, transition:'background .15s',
        borderBottom:`1px solid ${T.border}`,
      }}>
        <div style={{ width:32, height:32, borderRadius:9, background:bg,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {icon}
        </div>
        {label}
      </button>
    ))}
  </div>
);

// ─── MAIN ────────────────────────────────────────────────────────────
const WhatsAppDashboard = () => {
  const [conversations,   setConversations]   = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText,       setReplyText]       = useState('');
  const [sidebarOpen,     setSidebarOpen]     = useState(true);
  const [attachOpen,      setAttachOpen]      = useState(false);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [isAutoReply,     setIsAutoReply]     = useState(false);
  const [bizId,           setBizId]           = useState('MyAutoBot User');
  const [loadingToggle,   setLoadingToggle]   = useState(false);
  const [credentials,     setCredentials]     = useState({ phoneNumberId:'', metaToken:'' });
  const [imageFile,       setImageFile]       = useState(null);
  const [imageCaption,    setImageCaption]    = useState('');
  const [docFile,         setDocFile]         = useState(null);
  const [sending,         setSending]         = useState(false);
  const [atBottom,        setAtBottom]        = useState(true);
  const [newMsgDot,       setNewMsgDot]       = useState(false);
  const [searchHov,       setSearchHov]       = useState(false);

  const chatScrollRef = useRef(null);
  const chatEndRef    = useRef(null);
  const inputRef      = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef   = useRef(null);
  const prevMsgCount  = useRef(0);

  const API_BASE     = (process.env.Backend_BASE||'')+'/api/auth/webhook';
  const API_BASE_URL = (process.env.Backend_BASE||'')+'/api';
  const { phoneNumberId:PID, metaToken:TOKEN } = credentials;
  const allowedSrc = ['whatsapp','whatsapp-test'];

  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const [histRes, profRes] = await Promise.all([
          axios.get(`${API_BASE}/whatsapp-conversations?userId=${userId}`),
          axios.get(`${API_BASE_URL}/user-profile/${userId}`),
        ]);
        setConversations(histRes.data);
        const u = profRes.data;
        setIsAutoReply(u.botConfig?.isManualPromptEnabled||false);
        setBizId(u.name||'MyAutoBot User');
        setCredentials({ phoneNumberId:u.whatsappBusinessId||'959176433945485', metaToken:u.whatsappToken||'' });
      } catch(err){ console.error(err); }
    };
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  const activeChat = conversations
    .filter(c => c.messages.some(m => allowedSrc.includes(m.source)))
    .find(c => c.customerIdentifier === selectedContact);
  const messages = activeChat
    ? activeChat.messages.filter(m => allowedSrc.includes(m.source))
    : [];

  useEffect(() => {
    if (messages.length !== prevMsgCount.current) {
      if (atBottom) { chatEndRef.current?.scrollIntoView({ behavior:'smooth' }); setNewMsgDot(false); }
      else setNewMsgDot(true);
      prevMsgCount.current = messages.length;
    }
  }, [messages.length, atBottom]);

  useEffect(() => {
    if (selectedContact) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior:'instant' });
        setAtBottom(true); setNewMsgDot(false); prevMsgCount.current = 0;
      }, 60);
    }
  }, [selectedContact]);

  const handleScroll = useCallback(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(dist < 80);
    if (dist < 80) setNewMsgDot(false);
  }, []);

  useEffect(() => {
    const h = () => setAttachOpen(false);
    if (attachOpen) document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [attachOpen]);

  const toggleAutoReply = async () => {
    const userId = localStorage.getItem('userId');
    setLoadingToggle(true);
    try {
      const res = await axios.post(`${API_BASE}/toggle-auto-reply`, { userId, enabled:!isAutoReply });
      setIsAutoReply(res.data.isAutoReplyEnabled);
    } catch { alert('Failed to update AI settings.'); }
    finally { setLoadingToggle(false); }
  };

  const sendText = async () => {
    if (!replyText.trim() || !isWithin24Hours) return;
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`https://graph.facebook.com/v21.0/${PID}/messages`,
        { messaging_product:'whatsapp', to:selectedContact, type:'text', text:{ body:replyText } },
        { headers:{ Authorization:`Bearer ${TOKEN}` } });
      await axios.post(`${API_BASE}/log-outgoing`, { userId, customerNumber:selectedContact, text:replyText, source:'whatsapp', type:'text' });
      setReplyText('');
      if (inputRef.current) inputRef.current.style.height = 'auto';
    } catch(err){ console.error(err); }
  };

  const compressImage = (file, maxPx=800, quality=0.75) =>
    new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxPx) { height = Math.round((height*maxPx)/width); width = maxPx; }
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        c.getContext('2d').drawImage(img, 0, 0, width, height);
        c.toBlob(blob => { URL.revokeObjectURL(url); blob ? resolve(new File([blob], file.name, { type:'image/jpeg' })) : reject(); }, 'image/jpeg', quality);
      };
      img.onerror = reject; img.src = url;
    });

  const uploadToMeta = async (file, mimeType) => {
    const form = new FormData();
    form.append('file', file, file.name); form.append('type', mimeType); form.append('messaging_product', 'whatsapp');
    const res = await axios.post(`https://graph.facebook.com/v21.0/${PID}/media`, form, { headers:{ Authorization:`Bearer ${TOKEN}`, 'Content-Type':'multipart/form-data' } });
    return res.data.id;
  };

  const sendImage = async () => {
    if (!imageFile) return;
    setSending(true);
    const userId = localStorage.getItem('userId');
    try {
      const compressed = await compressImage(imageFile);
      const mediaId = await uploadToMeta(compressed, 'image/jpeg');
      await axios.post(`https://graph.facebook.com/v21.0/${PID}/messages`,
        { messaging_product:'whatsapp', to:selectedContact, type:'image', image:{ id:mediaId, ...(imageCaption?{caption:imageCaption}:{}) } },
        { headers:{ Authorization:`Bearer ${TOKEN}` } });
      await axios.post(`${API_BASE}/log-outgoing`, { userId, customerNumber:selectedContact, text:imageCaption||'[Photo]', mediaId, source:'whatsapp', type:'image' });
      setImageFile(null); setImageCaption('');
    } catch(err){ console.error(err); alert('Failed to send image.'); }
    finally { setSending(false); }
  };

  const sendDocument = async () => {
    if (!docFile) return;
    setSending(true);
    const userId = localStorage.getItem('userId');
    try {
      const mediaId = await uploadToMeta(docFile, docFile.type||'application/octet-stream');
      await axios.post(`https://graph.facebook.com/v21.0/${PID}/messages`,
        { messaging_product:'whatsapp', to:selectedContact, type:'document', document:{ id:mediaId, filename:docFile.name } },
        { headers:{ Authorization:`Bearer ${TOKEN}` } });
      await axios.post(`${API_BASE}/log-outgoing`, { userId, customerNumber:selectedContact, text:`[Document: ${docFile.name}]`, mediaId, fileName:docFile.name, fileSize:docFile.size, source:'whatsapp', type:'document' });
      setDocFile(null);
    } catch(err){ console.error(err); alert('Failed to send document.'); }
    finally { setSending(false); }
  };

  const sendLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude:lat, longitude:lng } = pos.coords;
      const userId = localStorage.getItem('userId');
      try {
        await axios.post(`https://graph.facebook.com/v21.0/${PID}/messages`, { messaging_product:'whatsapp', to:selectedContact, type:'location', location:{ latitude:lat, longitude:lng, name:'Current Location', address:`${lat.toFixed(5)}, ${lng.toFixed(5)}` } }, { headers:{ Authorization:`Bearer ${TOKEN}` } });
        await axios.post(`${API_BASE}/log-outgoing`, { userId, customerNumber:selectedContact, text:'[Location]', source:'whatsapp', type:'location', lat, lng, locationName:'Current Location' });
      } catch(err){ console.error(err); }
      setAttachOpen(false);
    }, err => alert('Could not get location: '+err.message));
  };

  const waChats = conversations
    .filter(c => c.messages.some(m => allowedSrc.includes(m.source)))
    .filter(c => !searchQuery || c.customerIdentifier.includes(searchQuery));

  const lastUserMsg = [...messages].reverse().find(m => m.role==='user');
  const isWithin24Hours = lastUserMsg ? (Date.now()-new Date(lastUserMsg.timestamp).getTime())/3600000 <= 24 : false;

  const grouped = messages.reduce((acc, msg) => {
    const day = new Date(msg.timestamp).toDateString();
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  const dayLabel = day => {
    if (new Date(day).toDateString() === new Date().toDateString()) return 'Today';
    if (new Date(day).toDateString() === new Date(Date.now()-86400000).toDateString()) return 'Yesterday';
    return new Date(day).toLocaleDateString([],{ weekday:'long', day:'numeric', month:'short' });
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:T.bg0, fontFamily:T.font, overflow:'hidden' }}>
      <GlobalCSS/>

      <input ref={imageInputRef} type="file" accept="image/*" style={{display:'none'}}
        onChange={e=>{ if(e.target.files[0]){ setImageFile(e.target.files[0]); setAttachOpen(false); } e.target.value=''; }}/>
      <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" style={{display:'none'}}
        onChange={e=>{ if(e.target.files[0]){ setDocFile(e.target.files[0]); setAttachOpen(false); } e.target.value=''; }}/>

      {/* ── TOP NAV (Portal-styled) ── */}
      <nav style={{
        height:52, flexShrink:0,
        background:'rgba(3,2,10,0.96)', backdropFilter:'blur(16px)',
        borderBottom:`1px solid ${T.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 16px', zIndex:100,
      }}>
        {/* Brand */}
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ 
            background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 14px rgba(124,58,237,.4)' }}>
            
          </div>
          {/* image icon — replaces the old gradient badge */}
            <img
              src="https://avenirya.com/wp-content/uploads/2026/03/image-removebg-preview-1.png"
              alt=""
              style={{
                height: 34 ,
                width: 'auto',
                objectFit: 'contain',
                transition: 'height .4s ease',
                display: 'block',
                flexShrink: 0,
              }}
            />
          <span style={{ fontWeight:900, fontSize:16, letterSpacing:-.4, color:T.t1 }}>
            MyAuto<span style={{ backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Bot</span>
          </span>
          {/* channel badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:5,
            background:'rgba(0,168,132,0.1)', border:'1px solid rgba(0,168,132,0.28)',
            borderRadius:20, padding:'3px 10px',
          }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:T.waGreen, display:'inline-block', animation:'pl 2s infinite' }}/>
            <span style={{ fontSize:9, fontWeight:700, color:T.waGreen, fontFamily:T.mono, letterSpacing:'.1em', textTransform:'uppercase' }}>WhatsApp</span>
          </div>
        </div>

        {/* Nav actions */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={()=>window.location.href='/dashboard'} style={{
            display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:9,
            background:'rgba(255,255,255,.04)', border:`1px solid ${T.border}`,
            color:T.t2, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:T.font, transition:'all .2s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(99,102,241,.1)'; e.currentTarget.style.borderColor=T.borderH; e.currentTarget.style.color=T.indigoL; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,.04)'; e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.t2; }}
          >
            <IcoGrid size={14} stroke="currentColor" sw={2}/>
            <span className="nav-label">Dashboard</span>
          </button>
          <div style={{ width:1, height:20, background:T.border }}/>
          <button onClick={()=>window.location.href='/dashboard'} title="Logout" style={{
            width:34, height:34, borderRadius:9, background:'none', border:'none',
            cursor:'pointer', color:T.t3, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(239,68,68,.08)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.color=T.t3; e.currentTarget.style.background='none'; }}
          ><IcoLogout size={17} stroke="currentColor" sw={2}/></button>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>

        {/* ── SIDEBAR ── */}
        <div className={`sidebar${sidebarOpen ? '' : ' hidden'}`} style={{
          width:320, flexShrink:0,
          background:T.bg1,
          borderRight:`1px solid ${T.border}`,
          display:'flex', flexDirection:'column', overflow:'hidden',
        }}>
          {/* sidebar header */}
          <div style={{
            background:`linear-gradient(145deg,${T.bg2},${T.bg3})`,
            borderBottom:`1px solid ${T.border}`,
            padding:'12px 14px 10px', flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <Avatar id={bizId} size={34}/>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:T.t1 }}>{bizId}</div>
                  <div style={{ fontSize:9, fontWeight:700, color:'#4ade80', fontFamily:T.mono, letterSpacing:'.1em', textTransform:'uppercase',
                    display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:T.green, display:'inline-block', animation:'pl 2s infinite' }}/>
                    Online
                  </div>
                </div>
              </div>
              <button className="icon-btn" style={{ width:30, height:30, borderRadius:8, background:'none',
                border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                color:T.t3, transition:'background .15s' }}>
                <IcoMenu size={16} stroke="currentColor" sw={1.8}/>
              </button>
            </div>

            {/* search */}
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              background:T.bg0, border:`1px solid ${searchHov ? T.borderH : T.border}`,
              borderRadius:10, padding:'7px 10px', transition:'border-color .2s',
            }}
              onMouseEnter={()=>setSearchHov(true)}
              onMouseLeave={()=>setSearchHov(false)}
            >
              <IcoSearch size={12} stroke={T.t3} sw={2} style={{ pointerEvents:'none', flexShrink:0 }}/>
              <input type="text" placeholder="Search conversations" value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                style={{ flex:1, background:'transparent', border:'none', color:T.t1, fontSize:12, fontFamily:T.font }}/>
            </div>
          </div>

          {/* AI Toggle */}
          <AIToggle isEnabled={isAutoReply} loading={loadingToggle} onToggle={toggleAutoReply}/>

          {/* conversations list */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {waChats.length === 0 ? (
              <div style={{ padding:32, textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:10 }}>💬</div>
                <p style={{ color:T.t3, fontSize:12, fontFamily:T.mono }}>No conversations yet.</p>
              </div>
            ) : waChats.map(conv=>(
              <ConvItem key={conv._id} conv={conv}
                active={selectedContact===conv.customerIdentifier}
                onClick={()=>{ setSelectedContact(conv.customerIdentifier); setSidebarOpen(false); }}/>
            ))}
          </div>

          {/* sidebar footer */}
          <div style={{ padding:'8px 14px', background:`linear-gradient(145deg,${T.bg2},${T.bg3})`,
            borderTop:`1px solid ${T.border}`, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:T.green, display:'inline-block', animation:'pl 2s infinite' }}/>
              <span style={{ fontSize:9, fontWeight:600, color:T.t3, fontFamily:T.mono, letterSpacing:'.2em', textTransform:'uppercase' }}>
                {waChats.length} thread{waChats.length!==1?'s':''}
              </span>
            </div>
            <span style={{ fontSize:9, color:T.indigoL, fontFamily:T.mono, letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700 }}>Meta ✓</span>
          </div>
        </div>

        {/* ── CHAT AREA (WhatsApp-authentic) ── */}
        <div className={`chat-area${sidebarOpen ? ' hidden' : ''}`} style={{
          flex:1, display:'flex', flexDirection:'column',
          background:T.waChatBg, overflow:'hidden', position:'relative',
        }}>
          {selectedContact ? (
            <>
              {/* chat header */}
              <div style={{ height:56, flexShrink:0, background:T.waPanel,
                borderBottom:`1px solid ${T.waDivider}`,
                display:'flex', alignItems:'center', padding:'0 12px', gap:10, zIndex:10 }}>
                <button className="mobile-back" onClick={()=>setSidebarOpen(true)} style={{
                  background:'none', border:'none', cursor:'pointer', color:T.indigoL, padding:4, flexShrink:0 }}>
                  <IcoBack size={20} stroke={T.indigoL} sw={2.2}/>
                </button>
                <Avatar id={selectedContact} size={38}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:T.waText }}>+{selectedContact}</div>
                  <div style={{ fontSize:10, display:'flex', alignItems:'center', gap:4, color: isAutoReply ? '#4ade80' : T.t3, fontFamily:T.mono, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em' }}>
                    <span style={{ width:4, height:4, borderRadius:'50%', background: isAutoReply ? T.green : T.t3, display:'inline-block' }}/>
                    {isAutoReply ? 'AI Auto-Reply Active' : 'Manual Mode'}
                  </div>
                </div>
                <div style={{ display:'flex', gap:2 }}>
                  {[<IcoPhone size={16} stroke={T.waSub} sw={1.8}/>,<IcoVideo size={16} stroke={T.waSub} sw={1.8}/>,<IcoMenu size={16} stroke={T.waSub} sw={1.8}/>].map((ic,i)=>(
                    <button key={i} className="icon-btn" style={{ width:32, height:32, borderRadius:8, background:'none',
                      border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .15s' }}>{ic}</button>
                  ))}
                </div>
              </div>

              {/* messages */}
              <div ref={chatScrollRef} onScroll={handleScroll} style={{
                flex:1, overflowY:'auto', padding:'6px 0',
                backgroundImage:`url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                backgroundSize:'412px', backgroundBlendMode:'overlay',
              }}>
                {Object.entries(grouped).map(([day, msgs]) => (
                  <div key={day}>
                    <DateSep label={dayLabel(day)}/>
                    {msgs.map((msg, i) => <MsgBubble key={i} msg={msg}/>)}
                  </div>
                ))}
                <div ref={chatEndRef} style={{ height:6 }}/>
              </div>

              {!atBottom && <ScrollBtn onClick={()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); setAtBottom(true); setNewMsgDot(false); }}/>}

              {newMsgDot && !atBottom && (
                <div onClick={()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); setAtBottom(true); setNewMsgDot(false); }} style={{
                  position:'absolute', bottom:80, right:16, zIndex:21,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white',
                  fontSize:10, fontWeight:700, borderRadius:20, padding:'3px 10px',
                  cursor:'pointer', animation:'fadeIn .2s ease', fontFamily:T.mono,
                  boxShadow:'0 4px 12px rgba(79,70,229,.4)',
                }}>New message ↓</div>
              )}

              {imageFile && (
                <ImagePreview file={imageFile} caption={imageCaption}
                  onCaptionChange={setImageCaption} onSend={sendImage}
                  onCancel={()=>{ setImageFile(null); setImageCaption(''); }} sending={sending}/>
              )}
              {docFile && (
                <DocPreview file={docFile} onSend={sendDocument} onCancel={()=>setDocFile(null)} sending={sending}/>
              )}

              {/* input area */}
              <div style={{ background:T.waPanel, flexShrink:0 }}>
                {!isWithin24Hours && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    padding:'9px 16px', background:'rgba(245,158,11,.06)',
                    borderTop:'1px solid rgba(245,158,11,.2)', borderBottom:'1px solid rgba(245,158,11,.2)' }}>
                    <IcoAlert size={13} stroke={T.amber} sw={2}/>
                    <span style={{ fontSize:11, fontWeight:600, color:T.amber, lineHeight:1.5 }}>
                      24-hour window closed. Wait for the customer to message first.
                    </span>
                  </div>
                )}
                <div style={{ display:'flex', alignItems:'flex-end', gap:8, padding:'8px 10px',
                  opacity:isWithin24Hours?1:.5, pointerEvents:isWithin24Hours?'auto':'none' }}>

                  <div style={{ position:'relative', flexShrink:0 }}>
                    <button onClick={e=>{ e.stopPropagation(); setAttachOpen(v=>!v); }} disabled={!isWithin24Hours}
                      style={{ width:38, height:38, borderRadius:9,
                        background:attachOpen?'rgba(99,102,241,.15)':'rgba(255,255,255,.06)',
                        border:`1px solid ${attachOpen ? T.borderH : T.waDivider}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        cursor:'pointer', transition:'all .2s' }}>
                      <IcoPlus size={17} stroke={attachOpen ? T.indigoL : T.waSub} sw={2.2}
                        style={{ transition:'transform .2s', transform:attachOpen?'rotate(45deg)':'rotate(0)' }}/>
                    </button>
                    {attachOpen && (
                      <AttachMenu
                        onPhoto={()=>{ imageInputRef.current?.click(); setAttachOpen(false); }}
                        onDocument={()=>{ docInputRef.current?.click(); setAttachOpen(false); }}
                        onLocation={sendLocation}/>
                    )}
                  </div>

                  <div style={{ flex:1, background:'rgba(255,255,255,.07)',
                    border:`1px solid ${T.waDivider}`, borderRadius:12,
                    padding:'9px 12px', display:'flex', alignItems:'flex-end' }}>
                    <textarea ref={inputRef} rows={1} value={replyText}
                      placeholder={isWithin24Hours ? 'Type a message' : 'Wait for customer to reply…'}
                      disabled={!isWithin24Hours}
                      onChange={e=>{ setReplyText(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,120)+'px'; }}
                      onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey&&isWithin24Hours){ e.preventDefault(); sendText(); }}}
                      style={{ flex:1, background:'none', border:'none', color:T.waText,
                        fontSize:14, fontFamily:T.font, resize:'none', lineHeight:1.5, maxHeight:120, overflowY:'auto' }}/>
                  </div>

                  <button onClick={sendText} disabled={!replyText.trim()||!isWithin24Hours}
                    className={replyText.trim()&&isWithin24Hours?'send-active':''}
                    style={{ width:38, height:38, borderRadius:9, flexShrink:0,
                      background:'rgba(255,255,255,.06)', border:`1px solid ${T.waDivider}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor:replyText.trim()?'pointer':'default', transition:'all .2s' }}>
                    <IcoSend size={15} fill={replyText.trim()&&isWithin24Hours?'white':T.waSub}/>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState bizId={bizId}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;