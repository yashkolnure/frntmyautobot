import React, { useState } from 'react';

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
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:${T.font};}
    @keyframes shim    {0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes pl      {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes slideUp {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes countUp {from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}

    .why-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .vals-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }

    @media(max-width:900px){
      .why-grid  { grid-template-columns:1fr; }
      .stats-grid{ grid-template-columns:repeat(2,1fr); }
      .vals-grid { grid-template-columns:repeat(2,1fr); }
    }
    @media(max-width:520px){
      .vals-grid { grid-template-columns:1fr; }
    }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=22, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoSpark  = p => <Ico {...p} d="M12 3l1.88 5.76a1 1 0 0 0 .95.69H21l-5 3.63a1 1 0 0 0-.36 1.12L17.52 20 12 16.37 6.48 20l1.88-5.8a1 1 0 0 0-.36-1.12L3 9.45h6.17a1 1 0 0 0 .95-.69L12 3z"/>;
const IcoShield = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoArrow  = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoHeart  = p => <Ico {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>;

// icon paths
const PATHS = {
  warn:   'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  bot:    'M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z',
  zap:    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  users:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  globe:  'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.66 2.84-2.5 5.84-2.5 9s.84 6.16 2.5 9m0-18c1.66 2.84 2.5 5.84 2.5 9s-.84 6.16-2.5 9M2 12h20',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

// ─── WHY CARD ────────────────────────────────────────────────────────
const WhyCard = ({ title, desc, iconKey, accent, sub, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: hov ? `linear-gradient(160deg,${accent}12,${accent}06,${T.bg3})` : T.bg2,
        border:`1px solid ${hov ? accent+'55' : T.border}`,
        borderRadius:20, padding:'32px 26px',
        transition:'all .3s cubic-bezier(.34,1.2,.64,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? `0 22px 48px ${accent}1e` : 'none',
        position:'relative', overflow:'hidden',
        animation:`slideUp .5s ${index*.1}s both`,
      }}
    >
      <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,
        background:`radial-gradient(circle,${accent}18 0%,transparent 70%)`,
        opacity:hov?1:0,transition:'opacity .3s',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:1}}>
        <div style={{
          width:52,height:52,borderRadius:15,
          background:`${accent}18`,border:`1px solid ${accent}33`,
          display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,
          transition:'transform .3s',transform:hov?'scale(1.1) rotate(-4deg)':'scale(1)',
        }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d={PATHS[iconKey]}/>
          </svg>
        </div>
        <div style={{display:'inline-block',background:`${accent}18`,border:`1px solid ${accent}33`,
          borderRadius:20,padding:'3px 10px',marginBottom:12,
          color:accent,fontSize:9,fontWeight:700,letterSpacing:'.7px',textTransform:'uppercase'}}>
          {sub}
        </div>
        <h3 style={{color:T.t1,fontWeight:800,fontSize:20,marginBottom:12,letterSpacing:-.3,lineHeight:1.2}}>{title}</h3>
        <p style={{color:T.t2,fontSize:14,lineHeight:1.72}}>{desc}</p>
      </div>
    </div>
  );
};

// ─── STAT TILE ───────────────────────────────────────────────────────
const StatTile = ({ val, label, iconKey, accent }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        textAlign:'center', padding:'28px 16px',
        background:'rgba(255,255,255,.025)',
        border:`1px solid ${hov ? accent+'55' : T.border}`,
        borderRadius:18, transition:'all .25s',
        transform:hov?'translateY(-4px)':'translateY(0)',
        animation:'countUp .6s both',
      }}
    >
      <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
        <div style={{width:40,height:40,borderRadius:11,background:`${accent}18`,
          border:`1px solid ${accent}33`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width={19} height={19} viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d={PATHS[iconKey]}/>
          </svg>
        </div>
      </div>
      <div style={{
        fontSize:'clamp(28px,4vw,46px)',fontWeight:900,letterSpacing:-1.5,marginBottom:6,
        backgroundImage:`linear-gradient(135deg,${accent},${accent}bb)`,
        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
      }}>{val}</div>
      <div style={{fontSize:10,fontWeight:700,color:T.t3,letterSpacing:'.45em',textTransform:'uppercase'}}>{label}</div>
    </div>
  );
};

// ─── VALUE CARD ──────────────────────────────────────────────────────
const ValueCard = ({ emoji, title, desc }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:hov?T.bg3:T.bg2,
        border:`1px solid ${hov?T.borderH:T.border}`,
        borderRadius:16,padding:'22px 20px',
        transition:'all .25s',transform:hov?'translateY(-4px)':'translateY(0)',
      }}
    >
      <div style={{fontSize:28,marginBottom:12}}>{emoji}</div>
      <h4 style={{color:T.t1,fontWeight:700,fontSize:15,marginBottom:8,letterSpacing:-.2}}>{title}</h4>
      <p style={{color:T.t2,fontSize:13,lineHeight:1.65}}>{desc}</p>
    </div>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────
const AboutUs = () => {
  const [hovVisit, setHovVisit] = useState(false);

  const whyCards = [
    { iconKey:'warn',  accent:'#ef4444', sub:'Pain Point',   title:'The Problem',
      desc:"Human teams need sleep, breaks, and weekends. Every hour your business is 'closed', leads slip away to competitors who reply faster. Speed is the new customer service." },
    { iconKey:'bot',   accent:'#a78bfa', sub:'The Fix',      title:'Our Solution',
      desc:'A smart AI agent trained on your exact business — products, tone, policies, FAQs — in minutes. It replies to every customer like your best employee would, 24 hours a day.' },
    { iconKey:'zap',   accent:'#22c55e', sub:'What You Get', title:'The Result',
      desc:'Round-the-clock coverage, sub-second replies, and structured lead capture across WhatsApp, Instagram, and your website — all without hiring extra staff or spending more on ads.' },
  ];

  const stats = [
    { val:'2.4M+', label:'Leads Captured',   iconKey:'users',  accent:'#a78bfa' },
    { val:'12+',   label:'Countries Active',  iconKey:'globe',  accent:'#3b82f6' },
    { val:'99.9%', label:'Uptime Guarantee',  iconKey:'shield', accent:'#22c55e' },
    { val:'<1s',   label:'AI Response Speed', iconKey:'zap',    accent:'#f59e0b' },
  ];

  const values = [
    { emoji:'⚡', title:'Speed First',        desc:'We believe the first reply wins. Every design decision optimises for zero latency — across every channel.' },
    { emoji:'🔒', title:'Privacy by Default', desc:'Your customer data is encrypted, isolated, and never used to train shared models or sold to third parties.' },
    { emoji:'🤝', title:'Partner, Not Vendor',desc:"We don't just sell software — we onboard, support, and grow alongside every business we work with." },
    { emoji:'🇮🇳', title:'Built for India',   desc:'GPU nodes hosted locally, responses tuned for Indian English, regional context, and diverse business culture.' },
    { emoji:'🧠', title:'Always Learning',    desc:'Our models improve continuously. When we get smarter, your bot gets smarter automatically — no updates needed.' },
    { emoji:'🎯', title:'Outcome Obsessed',   desc:'We measure ourselves on your lead conversion rate and revenue impact, not feature counts or NPS scores.' },
  ];

  return (
    <div style={{minHeight:'100vh',background:T.bg1,color:T.t2,fontFamily:T.font,overflowX:'hidden',paddingTop:96}}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'-8%',width:'55vw',height:'55vh',background:'radial-gradient(circle,rgba(79,70,229,.13) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',right:'-6%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(217,70,239,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'40%',left:'30%',width:'38vw',height:'38vh',background:'radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1120,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── HERO ── */}
        <div style={{textAlign:'center',marginBottom:80,animation:'slideUp .5s both'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'6px 16px',marginBottom:28,
          }}>
            <IcoSpark size={13} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>The Mission</span>
          </div>

          <h1 style={{
            fontSize:'clamp(38px,7vw,80px)',fontWeight:900,
            lineHeight:1.04,color:T.t1,letterSpacing:-3,marginBottom:24,
          }}>
            We Kill{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Dead Air.</span>
          </h1>

          <p style={{fontSize:'clamp(15px,2vw,19px)',color:T.t2,lineHeight:1.8,maxWidth:580,margin:'0 auto 40px'}}>
            Every day, thousands of businesses lose customers because they take too long to reply.
            We built <strong style={{color:T.t1,fontWeight:700}}>MyAutoBot</strong> to make sure no customer is ever left waiting — or lost — again.
          </p>

          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10}}>
            {[
              {emoji:'🤖',label:'AI-powered, always on'},
              {emoji:'🌐',label:'12+ countries'},
              {emoji:'⚡',label:'Sub-1s response time'},
              {emoji:'🔒',label:'Official Meta Partner'},
            ].map(({emoji,label})=>(
              <div key={label} style={{
                display:'flex',alignItems:'center',gap:7,
                background:'rgba(255,255,255,.04)',border:`1px solid ${T.border}`,
                borderRadius:30,padding:'7px 14px',fontSize:12,fontWeight:600,color:T.t2,
              }}><span>{emoji}</span>{label}</div>
            ))}
          </div>
        </div>

        {/* ── WHY GRID ── */}
        <div className="why-grid" style={{marginBottom:72}}>
          {whyCards.map((c,i)=><WhyCard key={i} index={i} {...c}/>)}
        </div>

        {/* ── STATS STRIP ── */}
        <div style={{borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,
          padding:'48px 0',background:'rgba(255,255,255,.015)',marginBottom:72}}>
          <div className="stats-grid">
            {stats.map((s,i)=><StatTile key={i} {...s}/>)}
          </div>
        </div>

        {/* ── VALUES ── */}
        <div style={{marginBottom:72}}>
          <div style={{textAlign:'center',marginBottom:44}}>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:7,
              background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
              borderRadius:30,padding:'5px 14px',marginBottom:16,
            }}>
              <IcoHeart size={12} stroke={T.purpleL} sw={2}/>
              <span style={{color:T.purpleL,fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>What We Stand For</span>
            </div>
            <h2 style={{fontSize:'clamp(26px,3.5vw,42px)',fontWeight:900,color:T.t1,letterSpacing:-.8,marginBottom:12}}>
              Our Values
            </h2>
            <p style={{color:T.t2,fontSize:14.5,lineHeight:1.7,maxWidth:440,margin:'0 auto'}}>
              The principles that guide every product decision, every partnership, and every line of code we write.
            </p>
          </div>
          <div className="vals-grid">
            {values.map((v,i)=><ValueCard key={i} {...v}/>)}
          </div>
        </div>

        {/* ── AVENIRYA BLOCK ── */}
        <div style={{
          background:`linear-gradient(135deg,rgba(79,70,229,.12),rgba(217,70,239,.06),rgba(124,58,237,.1))`,
          border:`1px solid rgba(99,102,241,.3)`,
          borderRadius:24,padding:'clamp(40px,6vw,72px) clamp(24px,5vw,64px)',
          position:'relative',overflow:'hidden',textAlign:'center',marginBottom:72,
        }}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
            width:'55%',height:'65%',background:'radial-gradient(circle,rgba(79,70,229,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:7,
              background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.28)',
              borderRadius:30,padding:'6px 14px',marginBottom:24,
            }}>
              <IcoShield size={12} stroke={T.green} sw={2.2}/>
              <span style={{color:T.green,fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}>Professional Grade</span>
            </div>

            <h2 style={{
              fontSize:'clamp(26px,4vw,48px)',fontWeight:900,color:T.t1,
              lineHeight:1.08,letterSpacing:-1.2,marginBottom:20,
            }}>
              Part of{' '}
              <span style={{backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Avenirya Group.</span>
            </h2>

            <blockquote style={{
              color:T.t2,fontSize:'clamp(14px,1.8vw,17px)',
              lineHeight:1.78,fontStyle:'italic',maxWidth:640,margin:'0 auto 32px',
            }}>
              "MyAutoBot is the flagship automation tool developed by Avenirya. Our goal is to take the
              complex power of neural networks and make it as easy to use as a simple chat app for
              business owners worldwide."
            </blockquote>

            {/* founder chip */}
            <div style={{
              display:'inline-flex',alignItems:'center',gap:12,
              background:'rgba(255,255,255,.04)',border:`1px solid ${T.border}`,
              borderRadius:40,padding:'10px 16px',marginBottom:32,
            }}>
              <div style={{width:36,height:36,borderRadius:'50%',
                background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                display:'flex',alignItems:'center',justifyContent:'center',
                color:'white',fontWeight:800,fontSize:13}}>YK</div>
              <div style={{textAlign:'left'}}>
                <div style={{color:T.t1,fontWeight:700,fontSize:13}}>Yash Kolnure</div>
                <div style={{color:T.t3,fontSize:11}}>Founder, Avenirya Solutions OPC Pvt Ltd</div>
              </div>
            </div>

            {/* trust strip */}
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:18,marginBottom:32}}>
              {['Official Meta Tech Provider','India-hosted GPU nodes','AES-256 Encrypted','Est. 2024'].map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:6,color:T.t3,fontSize:13}}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                    stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>{t}
                </div>
              ))}
            </div>

            <button
              onMouseEnter={()=>setHovVisit(true)} onMouseLeave={()=>setHovVisit(false)}
              style={{
                display:'inline-flex',alignItems:'center',gap:8,
                padding:'13px 28px',borderRadius:12,
                background:hovVisit?'rgba(255,255,255,.08)':'rgba(255,255,255,.04)',
                border:`1px solid ${hovVisit?T.borderH:T.border}`,
                color:T.t1,fontWeight:700,fontSize:14,
                cursor:'pointer',fontFamily:T.font,transition:'all .2s',
              }}
            >
              Visit Avenirya.com
              <IcoArrow size={15} stroke="currentColor" sw={2.2}/>
            </button>
          </div>
        </div>

        {/* ── FINAL CTA ── */}
        <div style={{
          textAlign:'center',
          background:`linear-gradient(135deg,rgba(79,70,229,.1),rgba(59,130,246,.06),rgba(124,58,237,.09))`,
          border:`1px solid rgba(99,102,241,.28)`,
          borderRadius:24,padding:'clamp(40px,5vw,64px) 24px',
          position:'relative',overflow:'hidden',
        }}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
            width:'50%',height:'60%',background:'radial-gradient(circle,rgba(79,70,229,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <h2 style={{fontSize:'clamp(24px,4vw,44px)',fontWeight:900,color:T.t1,
              letterSpacing:-1.2,lineHeight:1.1,marginBottom:14}}>
              Ready to{' '}
              <span style={{backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                backgroundSize:'200%',animation:'shim 5s linear infinite'}}>
                Stop Missing Leads?
              </span>
            </h2>
            <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:420,margin:'0 auto 28px'}}>
              Join thousands of businesses already using MyAutoBot to capture every opportunity — day and night.
            </p>
            <a href="/login?id=register" style={{
              display:'inline-flex',alignItems:'center',gap:9,
              padding:'14px 32px',borderRadius:12,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              color:'white',fontWeight:700,fontSize:15,textDecoration:'none',
              boxShadow:'0 4px 18px rgba(79,70,229,.45)',transition:'all .2s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 28px rgba(79,70,229,.6)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 4px 18px rgba(79,70,229,.45)';e.currentTarget.style.transform='translateY(0)';}}
            >
              Get Started Free
              <IcoArrow size={16} stroke="rgba(255,255,255,.85)" sw={2.2}/>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;