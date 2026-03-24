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
    @keyframes pl     {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes blink  {0%,100%{opacity:1}50%{opacity:0}}
    @keyframes floatY {0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}

    .steps-grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; }
    .api-grid   { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
    .badge-row  { display:flex; gap:12px; flex-wrap:wrap; }

    @media(max-width:1024px){
      .steps-grid { grid-template-columns:1fr; gap:20px; }
      .api-grid   { grid-template-columns:1fr; gap:32px; }
    }
    @media(max-width:640px){
      .badge-row { gap:8px; }
    }
  `}</style>
);

// ─── INLINE ICONS ────────────────────────────────────────────────────
const Ico = ({ d, d2, size=22, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>{d2 && <path d={d2}/>}
  </svg>
);
const IcoArrow   = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoZap     = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoCheck   = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;
const IcoRocket  = p => <Ico {...p} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>;
const IcoDB      = p => <Ico {...p} d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z"/>;
const IcoGlobe   = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.66 2.84-2.5 5.84-2.5 9s.84 6.16 2.5 9m0-18c1.66 2.84 2.5 5.84 2.5 9s-.84 6.16-2.5 9M2 12h20"/>;
const IcoShare   = p => <Ico {...p} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>;
const IcoCode    = p => <Ico {...p} d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>;
const IcoBraces  = p => <Ico {...p} d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>;
const IcoTerminal= p => <Ico {...p} d="M4 17l6-6-6-6M12 19h8"/>;

// ─── STEP CARD ───────────────────────────────────────────────────────
const StepCard = ({ number, iconPath, title, desc, details, accent, index, connectorDown }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? `linear-gradient(160deg,${accent}12,${accent}06,${T.bg3})`
          : T.bg2,
        border: `1px solid ${hov ? accent + '55' : T.border}`,
        borderRadius: 20,
        padding: '52px 28px 28px',
        position: 'relative',
        transition: 'all .3s cubic-bezier(.34,1.2,.64,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? `0 22px 48px ${accent}1e` : 'none',
        animation: `slideUp .5s ${index * 0.1}s both`,
      }}
    >
      {/* step number badge */}
      <div style={{
        position: 'absolute', top: -18, left: 24,
        width: 52, height: 52, borderRadius: 14,
        background: `linear-gradient(135deg,${accent},${accent}aa)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 900, color: 'white',
        boxShadow: `0 6px 22px ${accent}55`,
        transition: 'transform .3s',
        transform: hov ? 'scale(1.1) rotate(6deg)' : 'scale(1) rotate(0)',
        fontFamily: `'DM Mono',monospace`,
      }}>{number}</div>

      {/* icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${accent}18`, border: `1px solid ${accent}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        transition: 'transform .3s',
        transform: hov ? 'scale(1.08) rotate(-3deg)' : 'scale(1)',
      }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
          stroke={accent} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
          <path d={iconPath}/>
        </svg>
      </div>

      <h3 style={{
        color: T.t1, fontWeight: 800, fontSize: 20,
        marginBottom: 12, letterSpacing: -.4, lineHeight: 1.2,
      }}>{title}</h3>

      <p style={{
        color: T.t2, fontSize: 13.5, lineHeight: 1.75, marginBottom: 22,
      }}>{desc}</p>

      {/* detail bullets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {details.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: `${accent}22`, border: `1px solid ${accent}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width={8} height={8} viewBox="0 0 24 24" fill="none"
                stroke={accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <span style={{
              color: T.t3, fontSize: 11, fontWeight: 700,
              letterSpacing: '.5px', textTransform: 'uppercase',
            }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── API MOCKUP ──────────────────────────────────────────────────────
const ApiMockup = () => {
  const [copied, setCopied] = useState(null);
  const copy = (key) => { setCopied(key); setTimeout(() => setCopied(null), 1800); };

  const lines = [
    { label:'Access Key',      val:'sk_live_avenirya_77xx...', accent:'#06b6d4' },
    { label:'Webhook Endpoint', val:'https://n8n.myautobot.in/hook/...', accent:'#a78bfa' },
    { label:'Model Version',   val:'myautobot-v2.1-gpu',  accent:'#22c55e' },
  ];

  return (
    <div style={{
      background: `linear-gradient(160deg,${T.bg3},#0c0820)`,
      border: `1px solid ${T.borderH}`,
      borderRadius: 20,
      padding: '28px 26px',
      boxShadow: `0 28px 56px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.12)`,
    }}>
      {/* terminal top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 22, paddingBottom: 16,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {['#ef4444','#f59e0b','#22c55e'].map(c => (
            <div key={c} style={{ width:11, height:11, borderRadius:'50%', background:c, opacity:.8 }}/>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <IcoTerminal size={13} stroke={T.t3} sw={2}/>
          <span style={{ fontSize:10, fontWeight:700, color:T.t3, letterSpacing:'.4em', textTransform:'uppercase' }}>
            API Configuration
          </span>
        </div>
        <div style={{
          width:7, height:7, borderRadius:'50%', background:T.green,
          boxShadow:`0 0 8px ${T.green}`, animation:'pl 2s infinite',
        }}/>
      </div>

      {/* config rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:22 }}>
        {lines.map(({ label, val, accent }) => (
          <div key={label}>
            <div style={{ fontSize:9, fontWeight:700, color:T.t3, letterSpacing:'.4em', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
            <div
              onClick={() => copy(label)}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
                background:'rgba(0,0,0,.4)', border:`1px solid ${copied===label ? accent+'66' : 'rgba(255,255,255,.06)'}`,
                borderRadius:10, padding:'11px 14px',
                cursor:'pointer', transition:'all .2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=accent+'44'}
              onMouseLeave={e=>e.currentTarget.style.borderColor=copied===label?accent+'66':'rgba(255,255,255,.06)'}
            >
              <code style={{ color:accent, fontSize:12, fontFamily:T.mono, letterSpacing:.2 }}>{val}</code>
              <span style={{ fontSize:9, fontWeight:700, color:copied===label ? T.green : T.t3, transition:'color .2s', letterSpacing:'.3em', textTransform:'uppercase', flexShrink:0 }}>
                {copied===label ? 'Copied!' : 'Copy'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* cursor line */}
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background:'rgba(0,0,0,.3)', borderRadius:10,
        padding:'10px 14px', border:`1px solid rgba(255,255,255,.04)`,
      }}>
        <span style={{ color:'#4f46e5', fontFamily:T.mono, fontSize:12, fontWeight:600 }}>$</span>
        <span style={{ color:T.t3, fontFamily:T.mono, fontSize:12 }}>curl -X POST /v1/chat --key sk_live...</span>
        <span style={{ width:8, height:14, background:T.purpleL, display:'inline-block', borderRadius:2, animation:'blink 1.1s step-end infinite' }}/>
      </div>
    </div>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const [hovCta, setHovCta] = useState(false);

  const steps = [
    {
      number:'01', accent:'#3b82f6',
      iconPath:'M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z',
      title:'Train Your AI',
      desc:'Feed your bot the knowledge it needs. Upload PDFs, paste your FAQs, or sync directly from a website URL. Add specific instructions to define its personality, tone, escalation rules, and business goals — all in plain language.',
      details:['Knowledge Ingestion from PDFs & URLs','Custom Personality & Tone Instructions','Business Goal & Escalation Mapping'],
    },
    {
      number:'02', accent:'#22c55e',
      iconPath:'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.66 2.84-2.5 5.84-2.5 9s.84 6.16 2.5 9m0-18c1.66 2.84 2.5 5.84 2.5 9s-.84 6.16-2.5 9M2 12h20',
      title:'Web Integration',
      desc:"Deploy instantly to your website. We generate a custom shareable chat link you can share anywhere, plus a lightweight embed script you paste once into your site's HTML. No developer required — live in under five minutes.",
      details:['Custom Branded Chat Link','One-Line Embed Script','Live Preview Before Publishing'],
    },
    {
      number:'03', accent:'#d946ef',
      iconPath:'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
      title:'Social Omni-Channel',
      desc:'Connect your verified business handles in a few clicks. Your AI agent goes live across Instagram DMs, Facebook Messenger, and WhatsApp — all running from the same trained brain, with the same knowledge and personality.',
      details:['Official Meta Business API Sync','Unified AI Across All Channels','24/7 Social Presence with Zero Staffing'],
    },
    {
      number:'04', accent:'#06b6d4',
      iconPath:'M16 18l6-6-6-6M8 6l-6 6 6 6',
      title:'API & Workflows',
      desc:'Generate secure API keys to use your AI agent inside your own web apps, mobile apps, or internal tools. Or connect to n8n to build complex automations — CRM updates, invoice generation, Slack alerts — all triggered live during a chat.',
      details:['Secure REST API Key Generation','n8n Workflow Dashboard Sync','Custom Webhook Triggers per Event'],
    },
  ];

  return (
    <div style={{
      minHeight:'100vh', background:T.bg1, color:T.t2,
      fontFamily:T.font, overflowX:'hidden', paddingTop:96,
    }}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-8%',left:'15%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',right:'10%',width:'46vw',height:'46vh',background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'45%',left:'-5%',width:'36vw',height:'40vh',background:'radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1200,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── HERO ── */}
        <div style={{textAlign:'center',marginBottom:80}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(79,70,229,.1)', border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30, padding:'6px 16px', marginBottom:28,
          }}>
            <IcoZap size={13} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>
              The Deployment Matrix
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(36px,6vw,72px)',
            fontWeight:900, lineHeight:1.06,
            color:T.t1, letterSpacing:-2, marginBottom:22,
          }}>
            Build. Train.{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundSize:'200%', animation:'shim 5s linear infinite',
            }}>Deploy Everywhere.</span>
          </h1>

          <p style={{
            fontSize:'clamp(15px,2vw,19px)',
            color:T.t2, lineHeight:1.8,
            maxWidth:600, margin:'0 auto 36px',
          }}>
            Avenirya Solutions provides the framework — you provide the knowledge. Turn your business data into a high-converting AI agent in four steps, in under 24 hours.
          </p>

          {/* stat pills */}
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10}}>
            {[
              {emoji:'📄', label:'No code required'},
              {emoji:'⚡', label:'Live in under 24 hours'},
              {emoji:'🔗', label:'4 channels, 1 AI brain'},
              {emoji:'🔒', label:'Official Meta Partner'},
            ].map(({emoji,label}) => (
              <div key={label} style={{
                display:'flex', alignItems:'center', gap:7,
                background:'rgba(255,255,255,.04)', border:`1px solid ${T.border}`,
                borderRadius:30, padding:'7px 14px',
                fontSize:12, fontWeight:600, color:T.t2,
              }}><span>{emoji}</span>{label}</div>
            ))}
          </div>
        </div>

        {/* ── STEP CARDS ── */}
        <div style={{marginBottom:72}}>
          {/* connector line — desktop only */}
          <div style={{
            position:'relative',
            marginBottom:0,
          }}>
            <div className="steps-grid">
              {steps.map((step, idx) => (
                <StepCard key={idx} index={idx} {...step}/>
              ))}
            </div>
          </div>
        </div>

        {/* ── PROGRESS STRIP ── */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'center',
          gap:0, marginBottom:72, flexWrap:'wrap',
        }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:8,
              }}>
                <div style={{
                  width:40, height:40, borderRadius:'50%',
                  background:`linear-gradient(135deg,${s.accent},${s.accent}99)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, fontWeight:900, color:'white',
                  boxShadow:`0 4px 16px ${s.accent}44`,
                  fontFamily:T.mono,
                }}>{s.number}</div>
                <span style={{fontSize:10,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase'}}>{s.title.split(' ')[0]}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex:1, minWidth:32, maxWidth:80,
                  height:2, marginBottom:24,
                  background:`linear-gradient(90deg,${steps[i].accent}66,${steps[i+1].accent}66)`,
                  borderRadius:2,
                }}/>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── API & DEVELOPER SECTION ── */}
        <section style={{
          background:`linear-gradient(135deg,rgba(79,70,229,.09),rgba(6,182,212,.05),rgba(15,12,30,.96))`,
          border:`1px solid ${T.border}`,
          borderRadius:24,
          padding:'clamp(32px,5vw,64px)',
          marginBottom:72,
          position:'relative', overflow:'hidden',
        }}>
          <div style={{position:'absolute',top:0,right:0,width:'40%',height:'100%',background:'radial-gradient(ellipse at top right,rgba(6,182,212,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

          <div className="api-grid" style={{position:'relative',zIndex:1}}>
            {/* copy side */}
            <div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(6,182,212,.1)', border:`1px solid rgba(6,182,212,.28)`,
                borderRadius:30, padding:'5px 14px', marginBottom:20,
              }}>
                <IcoBraces size={12} stroke='#06b6d4' sw={2}/>
                <span style={{color:'#06b6d4',fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>Developer Protocol</span>
              </div>

              <h2 style={{
                fontSize:'clamp(26px,4vw,42px)',
                fontWeight:900, color:T.t1,
                lineHeight:1.1, letterSpacing:-1,
                marginBottom:20,
              }}>
                Custom API &{' '}
                <span style={{
                  backgroundImage:'linear-gradient(135deg,#06b6d4,#a78bfa)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                }}>Workflow Sync.</span>
              </h2>

              <p style={{color:T.t2,fontSize:14.5,lineHeight:1.75,marginBottom:32,maxWidth:440}}>
                Generate secure API keys to embed MyAutoBot's intelligence directly into your custom applications. Or automate your entire business logic — CRM updates, invoice generation, Slack notifications — via connected n8n workflows, all triggered in real time during live conversations.
              </p>

              {/* feature badges */}
              <div className="badge-row" style={{marginBottom:28}}>
                {[
                  { icon:T.green,  label:'REST API Ready',   accent:'#22c55e' },
                  { icon:'#f97316',label:'n8n Integrated',   accent:'#f97316' },
                  { icon:'#a78bfa',label:'Webhook Events',   accent:'#a78bfa' },
                  { icon:'#06b6d4',label:'White-Label Ready',accent:'#06b6d4' },
                ].map(({ label, accent }) => (
                  <div key={label} style={{
                    display:'flex', alignItems:'center', gap:8,
                    background:`${accent}10`, border:`1px solid ${accent}33`,
                    borderRadius:10, padding:'9px 14px',
                  }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:accent, boxShadow:`0 0 7px ${accent}`, display:'inline-block' }}/>
                    <span style={{ fontSize:11, fontWeight:700, color:accent, letterSpacing:'.5px', textTransform:'uppercase' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* extra detail bullets */}
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {[
                  'One API key per bot instance — isolated and revokable',
                  'Supports GET, POST, and streaming response modes',
                  'n8n node library available for no-code workflow builders',
                ].map(t => (
                  <div key={t} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{marginTop:2,flexShrink:0}}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span style={{color:T.t2,fontSize:13,lineHeight:1.6}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* mockup side */}
            <ApiMockup/>
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
              <IcoRocket size={12} stroke={T.purpleL} sw={2.2}/>
              <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}>Ready to launch</span>
            </div>

            <h2 style={{
              fontSize:'clamp(28px,4.5vw,52px)',
              fontWeight:900, color:T.t1,
              letterSpacing:-1.5, lineHeight:1.1, marginBottom:16,
            }}>
              Launch Your{' '}
              <span style={{
                backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundSize:'200%', animation:'shim 5s linear infinite',
              }}>Instance.</span>
            </h2>

            <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:460,margin:'0 auto 36px'}}>
              Free setup. Your AI agent is ready to train. Go live across WhatsApp, Instagram, and your website — all in under 24 hours.
            </p>

            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12,marginBottom:26}}>
              <Link
                to="/login?id=register"
                onMouseEnter={()=>setHovCta(true)}
                onMouseLeave={()=>setHovCta(false)}
                style={{
                  display:'flex', alignItems:'center', gap:9,
                  padding:'15px 34px', borderRadius:12,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color:'white', fontWeight:700, fontSize:15,
                  fontFamily:T.font, textDecoration:'none',
                  boxShadow: hovCta
                    ? '0 8px 28px rgba(79,70,229,.6)'
                    : '0 4px 18px rgba(79,70,229,.42)',
                  transform: hovCta ? 'translateY(-2px)' : 'translateY(0)',
                  transition:'all .2s',
                }}
              >
                Launch Your Instance
                <IcoRocket size={16} stroke="white" sw={2}/>
              </Link>
            </div>

            <p style={{color:T.t3,fontSize:11,fontWeight:700,letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono}}>
              Free Setup · No Credit Card Required · Official Meta Partner
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;