import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  bg0:'#03020a', bg1:'#070512', bg2:'#0d0b1e', bg3:'#13102b',
  border:'rgba(99,102,241,0.18)', borderH:'rgba(99,102,241,0.45)',
  purple:'#7c3aed', purpleL:'#a78bfa', blue:'#3b82f6',
  t1:'#f1f5f9', t2:'#94a3b8', t3:'#475569',
  green:'#22c55e',
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
    .back-arrow       { transition:transform .2s; }
    .contact-link:hover { color:${T.t1} !important; }
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
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoEye     = p => <Ico {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>;
const IcoLock    = p => <Ico {...p} d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"/>;
const IcoDb      = p => <Ico {...p} d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z"/>;
const IcoGlobe   = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.66 2.84-2.5 5.84-2.5 9s.84 6.16 2.5 9m0-18c1.66 2.84 2.5 5.84 2.5 9s-.84 6.16-2.5 9M2 12h20"/>;
const IcoMail    = p => <Ico {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const IcoArrow   = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoCheck   = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;

// ─── SECTION ROW ─────────────────────────────────────────────────────
const SectionRow = ({ title, text, iconPath, accent, isLast, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:'flex', gap:20, alignItems:'flex-start',
        padding:'28px 24px',
        background: hov ? `linear-gradient(135deg,${accent}0c,${accent}04,${T.bg3})` : 'transparent',
        border:`1px solid ${hov ? accent+'44' : 'transparent'}`,
        borderRadius:16,
        transition:'all .25s',
        marginBottom: isLast ? 0 : 4,
        animation:`slideUp .4s ${index*.1}s both`,
      }}
    >
      {/* icon + connector */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0,flexShrink:0}}>
        <div style={{
          width:46, height:46, borderRadius:13,
          background:`${accent}18`, border:`1px solid ${accent}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0,
          transition:'transform .25s',
          transform: hov ? 'scale(1.08) rotate(-3deg)' : 'scale(1)',
        }}>
          <svg width={21} height={21} viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d={iconPath}/>
          </svg>
        </div>
        {/* vertical connector line */}
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
        }}>Section {String(index+1).padStart(2,'0')}</div>
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
const Privacy = () => {
  const lastUpdated = 'December 25, 2025';
  const [hovContact, setHovContact] = useState(false);

  const sections = [
    {
      title:'Data Ownership', accent:'#a78bfa',
      iconPath:'M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z',
      text:"Your data belongs to you — full stop. We do not sell your customer information, chat logs, or captured lead details to any third party, ever. We store only the minimum data required for your bot to function correctly, and nothing more.",
    },
    {
      title:'How We Use AI', accent:'#d946ef',
      iconPath:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
      text:"Our AI reads your uploaded documents — PDFs, website URLs, FAQs — to answer customer questions on your behalf. This knowledge base is private to your account and completely isolated. We never use your proprietary business data to train shared models or improve bots for other clients.",
    },
    {
      title:'Encryption & Safety', accent:'#22c55e',
      iconPath:'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
      text:"Every conversation and lead record is protected with AES-256 encryption at rest and TLS 1.3 in transit — the same standard used by banks and financial institutions. Your API keys, tokens, and passwords are salted and hashed using bcrypt. We also conduct regular security audits.",
    },
    {
      title:'Global Privacy Standards', accent:'#3b82f6',
      iconPath:'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.66 2.84-2.5 5.84-2.5 9s.84 6.16 2.5 9m0-18c1.66 2.84 2.5 5.84 2.5 9s-.84 6.16-2.5 9M2 12h20',
      text:"We comply with global privacy frameworks including GDPR and applicable Indian data protection regulations. You have the right to access, correct, export, or permanently delete your account and all associated data at any time — with a single click from your dashboard settings.",
    },
    {
      title:'Cookies & Tracking', accent:'#f59e0b',
      iconPath:'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v4M12 16h.01',
      text:"We use only essential cookies required for authentication and session management. We do not run advertising trackers, third-party analytics pixels, or any form of behavioural profiling. You can clear all session cookies at any time without affecting your account data.",
    },
    {
      title:'Data Retention', accent:'#f97316',
      iconPath:'M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
      text:"Conversation logs and lead records are retained for 90 days by default. You can configure a shorter retention window in your dashboard or manually purge records at any time. When you close your account, all data is permanently deleted within 30 days from our servers and backups.",
    },
  ];

  const commitments = [
    'No data sold to advertisers or third parties',
    'AES-256 encryption at rest, TLS 1.3 in transit',
    'GDPR-compliant data access and deletion',
    'India-hosted servers — data stays local',
    'Zero cross-account data leakage',
    'Regular independent security audits',
  ];

  return (
    <div style={{minHeight:'100vh',background:T.bg1,color:T.t2,fontFamily:T.font,overflowX:'hidden',paddingTop:96}}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'-8%',width:'55vw',height:'55vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',right:'-6%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(217,70,239,.06) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:820,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── BACK LINK ── */}
        <Link to="/" className="back-link" style={{
          display:'inline-flex',alignItems:'center',gap:7,
          color:T.t3,fontSize:11,fontWeight:700,
          letterSpacing:'.4em',textTransform:'uppercase',
          textDecoration:'none',marginBottom:36,
          transition:'color .2s',
        }}>
          <IcoBack size={14} stroke="currentColor" sw={2.2} className="back-arrow"/>
          Back to Home
        </Link>

        {/* ── HERO ── */}
        <div style={{marginBottom:52,animation:'slideUp .4s both'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:7,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'5px 14px',marginBottom:20,
          }}>
            <IcoShield size={12} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>Legal</span>
          </div>

          <h1 style={{
            fontSize:'clamp(36px,6vw,64px)',fontWeight:900,
            color:T.t1,letterSpacing:-2,lineHeight:1.06,marginBottom:12,
          }}>
            Privacy{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Policy.</span>
          </h1>

          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <span style={{
              fontSize:10,fontWeight:700,color:T.t3,
              letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono,
            }}>Last updated: {lastUpdated}</span>
            <div style={{width:4,height:4,borderRadius:'50%',background:T.t3}}/>
            <span style={{
              display:'inline-flex',alignItems:'center',gap:5,
              background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.25)',
              borderRadius:20,padding:'3px 10px',
              fontSize:9,fontWeight:700,color:T.green,
              letterSpacing:'.5px',textTransform:'uppercase',
            }}>
              <span style={{width:5,height:5,borderRadius:'50%',background:T.green,display:'inline-block',animation:'pl 2s infinite'}}/>
              Current & Active
            </span>
          </div>
        </div>

        {/* ── COMMITMENTS STRIP ── */}
        <div style={{
          background:`linear-gradient(135deg,rgba(34,197,94,.06),rgba(79,70,229,.05))`,
          border:'1px solid rgba(34,197,94,.2)',
          borderRadius:16,padding:'20px 22px',marginBottom:40,
        }}>
          <div style={{fontSize:10,fontWeight:700,color:T.green,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:14}}>
            Our Core Commitments
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:8}}>
            {commitments.map(c=>(
              <div key={c} style={{display:'flex',alignItems:'center',gap:8}}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                  stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span style={{color:T.t2,fontSize:12,fontWeight:500}}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CARD ── */}
        <div style={{
          background:`linear-gradient(160deg,rgba(13,11,30,.97),rgba(19,16,43,.95))`,
          border:`1px solid ${T.borderH}`,
          borderRadius:22,
          overflow:'hidden',
          boxShadow:`0 32px 72px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.1)`,
          marginBottom:28,
          position:'relative',
        }}>
          {/* shimmer top line */}
          <div style={{
            position:'absolute',top:0,left:0,right:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)',
          }}/>

          <div style={{padding:'clamp(24px,5vw,48px)'}}>
            {sections.map((s,i)=>(
              <SectionRow key={i} index={i} isLast={i===sections.length-1} {...s}/>
            ))}
          </div>
        </div>

        {/* ── SUPPORT BOX ── */}
        <div style={{
          background:T.bg2,border:`1px solid ${T.border}`,
          borderRadius:18,padding:'32px 28px',
          textAlign:'center',
          transition:'border-color .2s',
        }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderH}
          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
        >
          {/* icon */}
          <div style={{
            width:52,height:52,borderRadius:16,
            background:'rgba(124,58,237,.15)',border:`1px solid rgba(124,58,237,.35)`,
            display:'flex',alignItems:'center',justifyContent:'center',
            margin:'0 auto 16px',
          }}>
            <IcoShield size={24} stroke={T.purpleL} sw={1.9}/>
          </div>

          <h3 style={{color:T.t1,fontWeight:700,fontSize:16,marginBottom:8}}>
            Have a question about your data?
          </h3>
          <p style={{color:T.t3,fontSize:13,lineHeight:1.65,marginBottom:20}}>
            Our privacy team typically responds within 24 hours.
            Contact us at{' '}
            <a href="mailto:privacy@myautobot.in" style={{
              color:T.purpleL,textDecoration:'none',fontWeight:600,
              transition:'color .2s',
            }}
              onMouseEnter={e=>e.target.style.color=T.t1}
              onMouseLeave={e=>e.target.style.color=T.purpleL}
            >privacy@myautobot.in</a>
          </p>

          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12}}>
            <Link
              to="/contact"
              onMouseEnter={()=>setHovContact(true)} onMouseLeave={()=>setHovContact(false)}
              style={{
                display:'inline-flex',alignItems:'center',gap:8,
                padding:'11px 22px',borderRadius:10,
                background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                color:'white',fontWeight:700,fontSize:13,
                textDecoration:'none',
                boxShadow: hovContact ? '0 6px 20px rgba(79,70,229,.55)' : '0 3px 12px rgba(79,70,229,.35)',
                transform: hovContact ? 'translateY(-1px)' : 'translateY(0)',
                transition:'all .2s',
              }}
            >
              <IcoMail size={14} stroke="white" sw={2}/>
              Contact Privacy Team
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
            Avenirya Solutions OPC Pvt Ltd · All rights reserved · {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Privacy;