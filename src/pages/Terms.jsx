import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  bg0:'#03020a', bg1:'#070512', bg2:'#0d0b1e', bg3:'#13102b',
  border:'rgba(99,102,241,0.18)', borderH:'rgba(99,102,241,0.45)',
  purple:'#7c3aed', purpleL:'#a78bfa', blue:'#3b82f6',
  t1:'#f1f5f9', t2:'#94a3b8', t3:'#475569',
  green:'#22c55e', red:'#ef4444',
  font:"'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono:"'DM Mono',monospace",
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────
const GlobalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:${T.font};}
    @keyframes shim   {0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pl     {0%,100%{opacity:1}50%{opacity:.35}}
    .back-link:hover  { color:${T.purpleL} !important; }
    .back-link:hover .back-arrow { transform:translateX(-3px); }
    .back-arrow { transition:transform .2s; }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=22, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoBack    = p => <Ico {...p} d="M19 12H5M12 5l-7 7 7 7"/>;
const IcoScale   = p => <Ico {...p} d="M12 3l1.5 4.5h4.5l-3.5 2.5 1.5 4.5-4-3-4 3 1.5-4.5L6 7.5h4.5L12 3zM3 20h18"/>;
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoArrow   = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoMail    = p => <Ico {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;

const PATHS = {
  scale:   'M12 3l1.5 4.5h4.5l-3.5 2.5 1.5 4.5-4-3-4 3 1.5-4.5L6 7.5h4.5L12 3zM3 20h18',
  ban:     'M18.364 5.636a9 9 0 1 0-12.728 12.728A9 9 0 0 0 18.364 5.636zM4.93 4.93l14.14 14.14',
  card:    'M1 4h22v16H1zM1 10h22M5 14h4M13 14h6',
  zap:     'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  warn:    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  alert:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v4M12 16h.01',
};

// ─── SECTION ROW ─────────────────────────────────────────────────────
const SectionRow = ({ title, text, iconKey, accent, isLast, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:'flex', gap:20, alignItems:'flex-start',
        padding:'26px 22px',
        background: hov ? `linear-gradient(135deg,${accent}0c,${accent}04,${T.bg3})` : 'transparent',
        border:`1px solid ${hov ? accent+'44' : 'transparent'}`,
        borderRadius:16, transition:'all .25s',
        marginBottom: isLast ? 0 : 4,
        animation:`slideUp .4s ${index*.09}s both`,
      }}
    >
      {/* icon + connector */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
        <div style={{
          width:46, height:46, borderRadius:13,
          background:`${accent}18`, border:`1px solid ${accent}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'transform .25s',
          transform: hov ? 'scale(1.08) rotate(-3deg)' : 'scale(1)',
        }}>
          <svg width={21} height={21} viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d={PATHS[iconKey]}/>
          </svg>
        </div>
        {!isLast && (
          <div style={{
            width:1, flexGrow:1, minHeight:32,
            background:`linear-gradient(180deg,${accent}33,transparent)`,
            marginTop:6,
          }}/>
        )}
      </div>

      {/* content */}
      <div style={{flex:1, paddingTop:4}}>
        <div style={{
          display:'inline-block',
          background:`${accent}18`, border:`1px solid ${accent}33`,
          borderRadius:20, padding:'3px 10px', marginBottom:10,
          color:accent, fontSize:9, fontWeight:700,
          letterSpacing:'.6px', textTransform:'uppercase',
        }}>Clause {String(index+1).padStart(2,'0')}</div>

        <h2 style={{
          color:T.t1, fontWeight:800, fontSize:18,
          letterSpacing:-.3, marginBottom:12, lineHeight:1.25,
        }}>{title}</h2>

        <p style={{color:T.t2, fontSize:14.5, lineHeight:1.78}}>{text}</p>
      </div>
    </div>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────
const Terms = () => {
  const lastUpdated  = 'December 25, 2025';
  const [hovContact, setHovContact] = useState(false);

  const sections = [
    {
      iconKey:'scale', accent:'#a78bfa', title:'Acceptance of Terms',
      text:"By creating an account on MyAutoBot, you agree to be bound by these Terms of Service. If you do not agree, please do not use our software. We may update these terms as our AI technology and compliance requirements evolve — continued use constitutes acceptance of any revised version.",
    },
    {
      iconKey:'ban', accent:'#ef4444', title:'Rules of Acceptable Use',
      text:"You must use MyAutoBot bots exclusively for lawful business purposes. Prohibited uses include: sending unsolicited bulk messages (spam), distributing harmful or deceptive content, impersonating another person or brand, or circumventing Meta's platform policies. Violation of these rules will result in immediate account suspension.",
    },
    {
      iconKey:'card', accent:'#f59e0b', title:'Payments & Billing',
      text:"All token purchases are one-time transactions — there are no recurring subscription charges. New accounts receive 500 free welcome tokens upon registration. Tokens do not expire and carry over indefinitely. We do not offer refunds on consumed tokens, but unused token balances are fully refundable within 7 days of purchase.",
    },
    {
      iconKey:'zap', accent:'#22c55e', title:'Account Security',
      text:"You are solely responsible for maintaining the confidentiality of your login credentials, API keys, and Meta tokens. You must notify us immediately at security@myautobot.in if you suspect any unauthorised access or compromise. We will never ask for your password via email or chat.",
    },
    {
      iconKey:'warn', accent:'#f97316', title:'Limitation of Liability',
      text:"While our AI is continuously improving, it is not infallible. MyAutoBot and Avenirya Solutions OPC Pvt Ltd shall not be held liable for any business loss, missed leads, or inaccurate responses generated by the AI. You are responsible for reviewing your chat logs and ensuring AI responses align with your business policies.",
    },
    {
      iconKey:'refresh', accent:'#06b6d4', title:'Service Changes & Uptime',
      text:"We commit to a 99.9% uptime SLA for all paid accounts. Planned maintenance windows will be communicated at least 24 hours in advance. We reserve the right to modify, discontinue, or upgrade features with reasonable notice. Critical updates that affect your bot's behaviour will always be communicated via dashboard notification and email.",
    },
  ];

  const highlights = [
    { emoji:'🆓', label:'500 free tokens on signup — no card needed' },
    { emoji:'❌', label:'Zero spam or misuse tolerated' },
    { emoji:'🔐', label:'You own your data and can delete it anytime' },
    { emoji:'⚖️', label:'Governed by Indian law, Pune jurisdiction' },
  ];

  return (
    <div style={{minHeight:'100vh',background:T.bg1,color:T.t2,fontFamily:T.font,overflowX:'hidden',paddingTop:96}}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',right:'-8%',width:'55vw',height:'55vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',left:'-6%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(59,130,246,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:820,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── BACK LINK ── */}
        <Link to="/" className="back-link" style={{
          display:'inline-flex',alignItems:'center',gap:7,
          color:T.t3,fontSize:11,fontWeight:700,
          letterSpacing:'.4em',textTransform:'uppercase',
          textDecoration:'none',marginBottom:36,transition:'color .2s',
        }}>
          <IcoBack size={14} stroke="currentColor" sw={2.2} className="back-arrow"/>
          Back to Home
        </Link>

        {/* ── HERO ── */}
        <div style={{marginBottom:48,animation:'slideUp .4s both'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:7,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'5px 14px',marginBottom:20,
          }}>
            <IcoScale size={12} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>Legal</span>
          </div>

          <h1 style={{
            fontSize:'clamp(36px,6vw,64px)',fontWeight:900,
            color:T.t1,letterSpacing:-2,lineHeight:1.06,marginBottom:12,
          }}>
            Terms of{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Service.</span>
          </h1>

          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <span style={{
              fontSize:10,fontWeight:700,color:T.t3,
              letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono,
            }}>
              Agreement v2.4 · Updated: {lastUpdated}
            </span>
            <div style={{width:4,height:4,borderRadius:'50%',background:T.t3}}/>
            <span style={{
              display:'inline-flex',alignItems:'center',gap:5,
              background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.25)',
              borderRadius:20,padding:'3px 10px',
              fontSize:9,fontWeight:700,color:T.green,
              letterSpacing:'.5px',textTransform:'uppercase',
            }}>
              <span style={{width:5,height:5,borderRadius:'50%',background:T.green,
                display:'inline-block',animation:'pl 2s infinite'}}/>
              Current & Active
            </span>
          </div>
        </div>

        {/* ── HIGHLIGHTS STRIP ── */}
        <div style={{
          background:`linear-gradient(135deg,rgba(99,102,241,.06),rgba(79,70,229,.04))`,
          border:`1px solid ${T.border}`,borderRadius:16,
          padding:'20px 22px',marginBottom:36,
        }}>
          <div style={{fontSize:10,fontWeight:700,color:T.purpleL,letterSpacing:'.4em',
            textTransform:'uppercase',marginBottom:14}}>Key Points at a Glance</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10}}>
            {highlights.map(({emoji,label})=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:16,flexShrink:0}}>{emoji}</span>
                <span style={{color:T.t2,fontSize:12.5,fontWeight:500,lineHeight:1.5}}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CARD ── */}
        <div style={{
          background:`linear-gradient(160deg,rgba(13,11,30,.97),rgba(19,16,43,.95))`,
          border:`1px solid ${T.borderH}`,
          borderRadius:22,overflow:'hidden',
          boxShadow:`0 32px 72px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.1)`,
          marginBottom:24,position:'relative',
        }}>
          {/* shimmer top line */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)'}}/>

          <div style={{padding:'clamp(24px,5vw,48px)'}}>
            {sections.map((s,i)=>(
              <SectionRow key={i} index={i} isLast={i===sections.length-1} {...s}/>
            ))}
          </div>
        </div>

        {/* ── TERMINATION NOTICE ── */}
        <div style={{
          background:'rgba(239,68,68,.05)',
          border:'1px solid rgba(239,68,68,.22)',
          borderRadius:18,padding:'28px 24px',
          display:'flex',gap:16,alignItems:'flex-start',
          marginBottom:24,
        }}>
          <div style={{
            width:44,height:44,borderRadius:12,flexShrink:0,
            background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.3)',
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
              stroke="#f87171" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={PATHS.alert}/>
            </svg>
          </div>
          <div>
            <div style={{
              fontSize:10,fontWeight:700,color:'#f87171',
              letterSpacing:'.4em',textTransform:'uppercase',marginBottom:8,
            }}>Account Termination Policy</div>
            <p style={{color:'#fca5a5',fontSize:13.5,lineHeight:1.72}}>
              We reserve the right to suspend or permanently terminate any account that violates our
              anti-spam policies, abuses the Meta API, or engages in deceptive or harmful automation.
              Terminated accounts forfeit any remaining token balance without refund. Be smart. Be kind.
            </p>
          </div>
        </div>

        {/* ── CONTACT BOX ── */}
        <div style={{
          background:T.bg2, border:`1px solid ${T.border}`,
          borderRadius:18, padding:'32px 28px', textAlign:'center',
          transition:'border-color .2s',
        }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderH}
          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
        >
          <div style={{
            width:52,height:52,borderRadius:16,
            background:'rgba(124,58,237,.15)',border:`1px solid rgba(124,58,237,.35)`,
            display:'flex',alignItems:'center',justifyContent:'center',
            margin:'0 auto 16px',
          }}>
            <IcoShield size={24} stroke={T.purpleL} sw={1.9}/>
          </div>
          <h3 style={{color:T.t1,fontWeight:700,fontSize:16,marginBottom:8}}>
            Questions about these terms?
          </h3>
          <p style={{color:T.t3,fontSize:13,lineHeight:1.65,marginBottom:20}}>
            Our legal team typically responds within 48 hours.
            Email us at{' '}
            <a href="mailto:legal@myautobot.in" style={{
              color:T.purpleL,textDecoration:'none',fontWeight:600,transition:'color .2s',
            }}
              onMouseEnter={e=>e.target.style.color=T.t1}
              onMouseLeave={e=>e.target.style.color=T.purpleL}
            >legal@myautobot.in</a>
          </p>

          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12}}>
            <Link to="/contact"
              onMouseEnter={()=>setHovContact(true)} onMouseLeave={()=>setHovContact(false)}
              style={{
                display:'inline-flex',alignItems:'center',gap:8,
                padding:'11px 22px',borderRadius:10,
                background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                color:'white',fontWeight:700,fontSize:13,textDecoration:'none',
                boxShadow: hovContact ? '0 6px 20px rgba(79,70,229,.55)' : '0 3px 12px rgba(79,70,229,.35)',
                transform: hovContact ? 'translateY(-1px)' : 'translateY(0)',
                transition:'all .2s',
              }}
            >
              <IcoMail size={14} stroke="white" sw={2}/>
              Contact Legal Team
            </Link>
            <Link to="/" style={{
              display:'inline-flex',alignItems:'center',gap:7,
              padding:'11px 20px',borderRadius:10,
              background:'rgba(255,255,255,.04)',border:`1px solid ${T.border}`,
              color:T.t2,fontWeight:600,fontSize:13,textDecoration:'none',
              transition:'all .2s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH;e.currentTarget.style.color=T.t1;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.t2;}}
            >
              <IcoBack size={14} stroke="currentColor" sw={2}/>
              Back to Home
            </Link>
          </div>
        </div>

        {/* ── FOOTER NOTE ── */}
        <div style={{marginTop:24,textAlign:'center'}}>
          <p style={{fontSize:11,color:T.t3,fontFamily:T.mono,letterSpacing:'.3em',textTransform:'uppercase'}}>
            © {new Date().getFullYear()} MyAutoBot AI Systems · Avenirya Solutions OPC Pvt Ltd
          </p>
        </div>

      </div>
    </div>
  );
};

export default Terms;