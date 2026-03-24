import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  bg0:'#03020a', bg1:'#070512', bg2:'#0d0b1e', bg3:'#13102b',
  border:'rgba(99,102,241,0.18)', borderH:'rgba(99,102,241,0.45)',
  purple:'#7c3aed', purpleL:'#a78bfa', blue:'#3b82f6', blueL:'#93c5fd',
  t1:'#f1f5f9', t2:'#94a3b8', t3:'#475569',
  green:'#22c55e', red:'#ef4444',
  font:"'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────
const GlobalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:${T.font};}
    @keyframes shim  {0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes pl    {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes barFill{from{width:0%}to{width:75%}}
    .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
    .token-grid { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
    .token-mini { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    @media(max-width:1024px){
      .feat-grid  { grid-template-columns:repeat(2,1fr); }
      .token-grid { grid-template-columns:1fr; gap:36px; }
    }
    @media(max-width:640px){
      .feat-grid  { grid-template-columns:1fr; }
      .token-mini { grid-template-columns:1fr 1fr; }
    }
  `}</style>
);

// ─── INLINE ICONS (SVG) ──────────────────────────────────────────────
const Ico = ({ d, size=22, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoArrow    = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoZap      = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoDatabase = p => <Ico {...p} d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z"/>;
const IcoShield   = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoCpu      = p => <Ico {...p} d="M9 3H5a2 2 0 0 0-2 2v4m6-6h6m-6 0v18m6-18h4a2 2 0 0 1 2 2v4M15 3v18m6-14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m18 0h-6m-6 0H3"/>;
const IcoWorkflow = p => <Ico {...p} d="M3 6l3 3-3 3M9 9h12M3 18l3-3-3-3M9 15h12"/>;
const IcoCode     = p => <Ico {...p} d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>;
const IcoBar      = p => <Ico {...p} d="M18 20V10M12 20V4M6 20v-6"/>;
const IcoActivity = p => <Ico {...p} d="M22 12h-4l-3 9L9 3l-3 9H2"/>;
const IcoRocket   = p => <Ico {...p} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>;
const IcoStar     = p => <Ico {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>;

// ─── FEATURE CARD ────────────────────────────────────────────────────
const FeatureCard = ({ icon: IconPath, title, desc, tag, metric, accent, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? `linear-gradient(160deg,${accent}14,${accent}06,${T.bg3})`
          : T.bg2,
        border: `1px solid ${hov ? accent + '55' : T.border}`,
        borderRadius: 20,
        padding: '28px 26px',
        transition: 'all .3s cubic-bezier(.34,1.2,.64,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? `0 22px 48px ${accent}1e` : 'none',
        position: 'relative',
        overflow: 'hidden',
        animation: `slideUp .5s ${index * 0.07}s both`,
        cursor: 'default',
      }}
    >
      {/* large ghost icon bg */}
      <div style={{
        position:'absolute', top:-20, right:-20,
        opacity: hov ? 0.07 : 0.025,
        transition:'opacity .3s',
        color: accent,
        pointerEvents:'none',
      }}>
        <svg width={140} height={140} viewBox="0 0 24 24" fill="none"
          stroke={accent} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
          <path d={IconPath}/>
        </svg>
      </div>

      <div style={{ position:'relative', zIndex:1 }}>
        {/* icon badge */}
        <div style={{
          width:50, height:50, borderRadius:14,
          background:`${accent}18`, border:`1px solid ${accent}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          marginBottom:18,
          transition:'transform .3s',
          transform: hov ? 'scale(1.1) rotate(-4deg)' : 'scale(1)',
        }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d={IconPath}/>
          </svg>
        </div>

        {/* tags */}
        {tag && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{
              background:`${accent}18`, border:`1px solid ${accent}33`,
              color: accent, fontSize:9, fontWeight:700,
              letterSpacing:'0.7px', textTransform:'uppercase',
              padding:'3px 10px', borderRadius:20,
            }}>{tag}</span>
            {metric && (
              <span style={{
                color:T.t3, fontSize:9, fontWeight:700,
                letterSpacing:'0.5px', textTransform:'uppercase',
              }}>{metric}</span>
            )}
          </div>
        )}

        <h3 style={{
          color:T.t1, fontWeight:800, fontSize:18,
          marginBottom:10, lineHeight:1.25, letterSpacing:-.3,
        }}>{title}</h3>

        <p style={{
          color:T.t2, fontSize:13.5, lineHeight:1.72, marginBottom:18,
        }}>{desc}</p>

        {/* hover cta */}
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          color: accent, fontSize:11, fontWeight:700,
          letterSpacing:'.6px', textTransform:'uppercase',
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateX(0)' : 'translateX(-8px)',
          transition:'all .25s',
        }}>
          Protocol Status: Active
          <IcoArrow size={13} stroke={accent} sw={2.2}/>
        </div>
      </div>
    </div>
  );
};

// ─── TOKEN COUNTER MOCKUP ────────────────────────────────────────────
const TokenMockup = () => {
  const [count, setCount] = useState(12450);
  const [flash, setFlash]  = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c - 5);
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const pct = Math.min(100, Math.max(0, (count / 16000) * 100));

  return (
    <div style={{
      background:`linear-gradient(160deg,${T.bg3},#0d0820)`,
      border:`1px solid ${T.borderH}`,
      borderRadius:22,
      padding:'36px 32px',
      boxShadow:`0 30px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.15)`,
    }}>
      {/* header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <span style={{ fontSize:9, fontWeight:700, color:T.t3, letterSpacing:'0.4em', textTransform:'uppercase' }}>Active Balance</span>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{
            width:7, height:7, borderRadius:'50%', background:T.green,
            boxShadow:`0 0 9px ${T.green}`,
            display:'inline-block', animation:'pl 2s infinite',
          }}/>
          <span style={{ fontSize:10, fontWeight:600, color:T.green }}>Live</span>
        </div>
      </div>

      {/* big number */}
      <div style={{
        display:'flex', alignItems:'baseline', gap:10, marginBottom:6,
        color: flash ? T.purpleL : T.t1,
        transition:'color .3s',
      }}>
        <span style={{
          fontSize:'clamp(44px,5vw,64px)', fontWeight:900,
          letterSpacing:-2, fontVariantNumeric:'tabular-nums',
          fontFamily:"'DM Mono',monospace",
        }}>{count.toLocaleString()}</span>
        <span style={{ fontSize:16, fontWeight:700, color:T.purpleL, textTransform:'uppercase' }}>TKN</span>
      </div>

      {/* deduction flash */}
      <div style={{
        fontSize:11, fontWeight:600, color: flash ? '#f87171' : T.t3,
        marginBottom:18, transition:'color .3s',
        display:'flex', alignItems:'center', gap:6,
        fontFamily:"'DM Mono',monospace",
      }}>
        {flash ? '−5 TKN deducted' : 'Awaiting next interaction…'}
      </div>

      {/* progress bar */}
      <div style={{
        height:6, background:'rgba(255,255,255,.06)',
        borderRadius:10, overflow:'hidden', marginBottom:24,
      }}>
        <div style={{
          height:'100%',
          width:`${pct}%`,
          background:'linear-gradient(90deg,#4f46e5,#7c3aed,#a78bfa)',
          borderRadius:10,
          transition:'width 1s ease',
          boxShadow:'0 0 12px rgba(124,58,237,.5)',
        }}/>
      </div>

      {/* mini stats */}
      <div className="token-mini">
        {[
          { label:'Last Call',  val:'-5 TKN',    mono:true },
          { label:'Daily Cap',  val:'UNLIMITED',  mono:false },
          { label:'Cost/Call',  val:'₹0.002',    mono:true },
          { label:'Uptime',     val:'99.98%',     mono:false },
        ].map(({ label, val, mono }) => (
          <div key={label} style={{
            background:'rgba(255,255,255,.04)', border:`1px solid ${T.border}`,
            borderRadius:12, padding:'12px 14px', textAlign:'center',
          }}>
            <div style={{ fontSize:9, color:T.t3, fontWeight:700, letterSpacing:'.4em', textTransform:'uppercase', marginBottom:5 }}>{label}</div>
            <div style={{
              color:T.t1, fontWeight:700, fontSize:13,
              fontFamily: mono ? "'DM Mono',monospace" : T.font,
            }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────
const FeaturesPage = () => {
  const [hovDeploy, setHovDeploy] = useState(false);

  const specs = [
    {
      icon:"M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z",
      title:"Neural Lead Capture",
      desc:"Automatically identifies and extracts customer names, contact numbers, and buying intent from raw conversations — structuring every lead into your dashboard in real time, with zero manual effort.",
      tag:"Conversion Engine", metric:"Real-time Sync", accent:"#22c55e",
    },
    {
      icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
      title:"Meta Tech Provider",
      desc:"Fully integrated with the official WhatsApp and Instagram Business APIs. Enjoy secure, ban-free automation backed by our verified Meta Tech Provider status — no grey-area tools, ever.",
      tag:"Official Status", metric:"Verified Node", accent:"#3b82f6",
    },
    {
      icon:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
      title:"Token-Based Billing",
      desc:"Predictable, transparent scaling for your business. Every API interaction consumes exactly 5 tokens, giving you complete ROI visibility and cost control — no hidden charges, no monthly surprises.",
      tag:"Economy System", metric:"5 Tokens / Call", accent:"#f59e0b",
    },
    {
      icon:"M3 6l3 3-3 3M9 9h12M3 18l3-3-3-3M9 15h12",
      title:"n8n Automation",
      desc:"Connect custom n8n dashboards to build hyper-complex workflows — from real-time CRM updates to automated invoice generation, all triggered directly within a chat conversation.",
      tag:"Infrastructure", metric:"n8n Integrated", accent:"#f97316",
    },
    {
      icon:"M9 3H5a2 2 0 0 0-2 2v4m6-6h6m-6 0v18m6-18h4a2 2 0 0 1 2 2v4M15 3v18m6-14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m18 0h-6m-6 0H3",
      title:"Self-Hosted LLMs",
      desc:"We run proprietary chat models on GPU-enabled VPS nodes in India, ensuring human-like responses with ultra-low latency for your local customers — your data never leaves the country.",
      tag:"Compute Node", metric:"GPU Powered", accent:"#d946ef",
    },
    {
      icon:"M16 18l6-6-6-6M8 6l-6 6 6 6",
      title:"Custom API & Webhooks",
      desc:"Deploy custom bots or connect existing software via our robust REST API. Designed for developers and agencies seeking fully white-label, multi-tenant solutions at any scale.",
      tag:"Developer Ready", metric:"REST API", accent:"#06b6d4",
    },
  ];

  return (
    <div style={{
      minHeight:'100vh',
      background:T.bg1,
      color:T.t2,
      fontFamily:T.font,
      overflowX:'hidden',
      paddingTop:100,
    }}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'-5%',width:'50vw',height:'55vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'40%',right:'-8%',width:'40vw',height:'45vh',background:'radial-gradient(circle,rgba(59,130,246,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-5%',left:'15%',width:'42vw',height:'40vh',background:'radial-gradient(circle,rgba(124,58,237,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1200,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── HERO ── */}
        <div style={{textAlign:'center',marginBottom:88}}>
          {/* eyebrow badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(79,70,229,.1)', border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30, padding:'6px 16px', marginBottom:28,
          }}>
            <IcoActivity size={13} stroke={T.purpleL} sw={2}/>
            <span style={{ color:T.purpleL, fontSize:12, fontWeight:700, letterSpacing:'.6px', textTransform:'uppercase' }}>
              System Specifications
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(38px,6vw,72px)',
            fontWeight:900, lineHeight:1.06,
            color:T.t1, letterSpacing:-2,
            marginBottom:22,
          }}>
            Automate{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundSize:'200%', animation:'shim 5s linear infinite',
            }}>The Interaction.</span>
          </h1>

          <p style={{
            fontSize:'clamp(15px,2vw,19px)',
            color:T.t2, lineHeight:1.8,
            maxWidth:640, margin:'0 auto 40px',
          }}>
            MyAutoBot is a high-performance AI agent platform built to handle the entire lead lifecycle — from the first "Hello" to a verified, structured CRM entry — across every channel your customers use.
          </p>

          {/* stat pills */}
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12}}>
            {[
              {icon:'⚡', label:'Sub-1s response time'},
              {icon:'🔒', label:'Official Meta Tech Provider'},
              {icon:'🇮🇳', label:'India-hosted GPU nodes'},
              {icon:'📊', label:'Real-time lead dashboard'},
            ].map(({icon,label})=>(
              <div key={label} style={{
                display:'flex', alignItems:'center', gap:7,
                background:'rgba(255,255,255,.04)', border:`1px solid ${T.border}`,
                borderRadius:30, padding:'7px 14px',
                fontSize:12, fontWeight:600, color:T.t2,
              }}>
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURE GRID ── */}
        <div className="feat-grid" style={{marginBottom:80}}>
          {specs.map((spec, idx) => (
            <FeatureCard key={idx} index={idx} {...spec}/>
          ))}
        </div>

        {/* ── TOKENOMICS SECTION ── */}
        <section style={{
          background:`linear-gradient(135deg,rgba(79,70,229,.1),rgba(124,58,237,.06),rgba(15,12,30,.95))`,
          border:`1px solid ${T.border}`,
          borderRadius:24,
          padding:'clamp(32px,5vw,64px)',
          marginBottom:80,
          position:'relative',
          overflow:'hidden',
        }}>
          {/* corner glow */}
          <div style={{position:'absolute',top:0,right:0,width:'40%',height:'100%',background:'radial-gradient(ellipse at top right,rgba(124,58,237,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>

          <div className="token-grid" style={{position:'relative',zIndex:1}}>
            {/* LEFT: copy */}
            <div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:7,
                background:'rgba(79,70,229,.1)', border:`1px solid rgba(99,102,241,.28)`,
                borderRadius:30, padding:'5px 14px', marginBottom:20,
              }}>
                <span style={{color:T.purpleL,fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>Resource Allocation</span>
              </div>

              <h2 style={{
                fontSize:'clamp(28px,4vw,44px)',
                fontWeight:900, color:T.t1,
                lineHeight:1.1, letterSpacing:-1,
                marginBottom:28,
              }}>
                Transparent{' '}
                <span style={{
                  backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                }}>Token Economy.</span>
              </h2>

              <p style={{color:T.t2,fontSize:14.5,lineHeight:1.75,marginBottom:32,maxWidth:440}}>
                No seat-based pricing. No hidden overages. Every single AI interaction — regardless of message length or complexity — costs exactly 5 tokens. Your team can calculate ROI before they even log in.
              </p>

              {/* token detail rows */}
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {[
                  {
                    icon:'⚡', accent:'#7c3aed',
                    title:'5 Tokens Per Request — Flat Rate',
                    desc:'Every chat interaction, whether a one-word reply or a 10-step booking flow, consumes a flat 5 tokens. No complexity surcharge, no peak-hour pricing.',
                  },
                  {
                    icon:'📊', accent:'#22c55e',
                    title:'Real-time Deduction & Live Balance',
                    desc:"Watch your token balance update live in the dashboard after every conversation. No delayed billing, no monthly invoice shocks — you always know exactly where you stand.",
                  },
                  {
                    icon:'🔄', accent:'#3b82f6',
                    title:'Top-Up Anytime, No Expiry',
                    desc:'Tokens never expire. Top up whenever you need to, in any amount. Unused tokens roll over indefinitely — your investment is always protected.',
                  },
                ].map(({icon,accent,title,desc})=>(
                  <div key={title} style={{
                    display:'flex', alignItems:'flex-start', gap:14,
                    background:'rgba(255,255,255,.03)', border:`1px solid ${T.border}`,
                    padding:'16px 18px', borderRadius:14,
                    transition:'border-color .2s',
                  }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderH}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
                  >
                    <div style={{
                      width:42, height:42, borderRadius:12,
                      background:`${accent}18`, border:`1px solid ${accent}33`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:18, flexShrink:0,
                    }}>{icon}</div>
                    <div>
                      <div style={{color:T.t1,fontWeight:700,fontSize:14,marginBottom:5}}>{title}</div>
                      <div style={{color:T.t2,fontSize:13,lineHeight:1.65}}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: live mockup */}
            <TokenMockup/>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <div style={{
          textAlign:'center',
          background:`linear-gradient(135deg,rgba(79,70,229,.1),rgba(59,130,246,.06),rgba(124,58,237,.09))`,
          border:`1px solid rgba(99,102,241,.28)`,
          borderRadius:24, padding:'clamp(44px,6vw,72px) 24px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'50%',height:'60%',background:'radial-gradient(circle,rgba(79,70,229,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:7,
              background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
              borderRadius:30,padding:'6px 14px',marginBottom:22,
            }}>
              <IcoStar size={12} stroke={T.purpleL} sw={2.2}/>
              <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}>Ready to deploy</span>
            </div>

            <h2 style={{
              fontSize:'clamp(28px,4.5vw,50px)',
              fontWeight:900, color:T.t1,
              letterSpacing:-1.5, lineHeight:1.1,
              marginBottom:16,
            }}>
              System Ready for{' '}
              <span style={{
                backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundSize:'200%', animation:'shim 5s linear infinite',
              }}>Deployment.</span>
            </h2>

            <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:460,margin:'0 auto 36px'}}>
              Your AI agent is already trained and waiting. Connect your channels, upload your docs, and go live in under 24 hours.
            </p>

            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12,marginBottom:28}}>
              <Link
                to="/login?id=register"
                onMouseEnter={()=>setHovDeploy(true)}
                onMouseLeave={()=>setHovDeploy(false)}
                style={{
                  display:'flex', alignItems:'center', gap:9,
                  padding:'15px 34px', borderRadius:12,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color:'white', fontWeight:700, fontSize:15,
                  fontFamily:T.font, textDecoration:'none',
                  boxShadow: hovDeploy
                    ? '0 8px 28px rgba(79,70,229,.6)'
                    : '0 4px 18px rgba(79,70,229,.42)',
                  transform: hovDeploy ? 'translateY(-2px)' : 'translateY(0)',
                  transition:'all .2s',
                }}
              >
                Initialize Node
                <IcoRocket size={16} stroke="white" sw={2}/>
              </Link>
              <div style={{
                color:T.t3, fontSize:11, fontWeight:700,
                letterSpacing:'.4em', textTransform:'uppercase',
                fontFamily:"'DM Mono',monospace",
              }}>
                Tech Provider ID: 001-AVENIRYA
              </div>
            </div>

            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:22}}>
              {['Free setup included','Live in 24 hours','No credit card needed','Cancel anytime'].map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:6,color:T.t3,fontSize:13}}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeaturesPage;