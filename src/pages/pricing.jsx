import React, { useState, useEffect } from 'react';
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
    @keyframes floatY {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes spin   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes countUp{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}

    .bonus-grid   { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .refill-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; align-items:stretch; }
    .economy-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .compare-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }

    @media(max-width:960px){
      .refill-grid  { grid-template-columns:1fr 1fr; }
    }
    @media(max-width:700px){
      .bonus-grid   { grid-template-columns:1fr; }
      .refill-grid  { grid-template-columns:1fr; }
      .economy-grid { grid-template-columns:1fr 1fr; }
      .compare-grid { grid-template-columns:1fr; }
    }
    @media(max-width:420px){
      .economy-grid { grid-template-columns:1fr; }
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
const IcoArrow   = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoCheck   = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;
const IcoRocket  = p => <Ico {...p} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>;
const IcoGift    = p => <Ico {...p} d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>;
const IcoUsers   = p => <Ico {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>;
const IcoCoins   = p => <Ico {...p} d="M12 2C6.48 2 2 4.24 2 7v3c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zM2 10v4c0 2.76 4.48 5 10 5s10-2.24 10-5v-4"/>;
const IcoDb      = p => <Ico {...p} d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z"/>;
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoZap     = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoGlobe   = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.66 2.84-2.5 5.84-2.5 9s.84 6.16 2.5 9m0-18c1.66 2.84 2.5 5.84 2.5 9s-.84 6.16-2.5 9M2 12h20"/>;
const IcoStar    = p => <Ico {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>;
const IcoRefresh = p => <Ico {...p} d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>;

// ─── TOKEN REFILL CARD ────────────────────────────────────────────────
const RefillCard = ({ amount, price, bonus, highlight, ctaText, interactions, index }) => {
  const [hov, setHov] = useState(false);
  const active = highlight || hov;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: highlight
          ? `linear-gradient(160deg,rgba(124,58,237,.22),rgba(79,70,229,.12),${T.bg3})`
          : hov
            ? `linear-gradient(160deg,rgba(99,102,241,.1),rgba(79,70,229,.06),${T.bg3})`
            : T.bg2,
        border: `1px solid ${active ? T.borderH : T.border}`,
        borderRadius: 20,
        padding: '32px 26px',
        display: 'flex', flexDirection: 'column',
        transition: 'all .3s cubic-bezier(.34,1.2,.64,1)',
        transform: highlight
          ? 'scale(1.03)'
          : hov ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: highlight
          ? `0 24px 56px rgba(124,58,237,.28), 0 0 0 1px ${T.borderH}`
          : hov ? `0 18px 40px rgba(79,70,229,.18)` : 'none',
        animation: `slideUp .45s ${index * 0.1}s both`,
        zIndex: highlight ? 2 : 1,
      }}
    >
      {/* recommended badge */}
      {highlight && (
        <div style={{
          position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)',
          background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
          color:'white', fontSize:9, fontWeight:700,
          letterSpacing:'.7px', textTransform:'uppercase',
          padding:'4px 14px', borderRadius:20,
          boxShadow:'0 4px 14px rgba(79,70,229,.5)',
          whiteSpace:'nowrap',
        }}>✦ Recommended Refill</div>
      )}

      {/* top: amount */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:8}}>
          Refill Protocol
        </div>
        <div style={{display:'flex',alignItems:'baseline',gap:8}}>
          <span style={{
            fontSize:'clamp(38px,4vw,52px)', fontWeight:900,
            letterSpacing:-2, color:T.t1,
            fontFamily:T.mono,
          }}>{amount.toLocaleString()}</span>
          <span style={{fontSize:13,fontWeight:700,color:T.t3,textTransform:'uppercase',letterSpacing:'.3em'}}>Tokens</span>
        </div>
        <div style={{fontSize:12,color:T.t3,marginTop:4,fontFamily:T.mono}}>
          = {interactions} AI interactions
        </div>
      </div>

      {/* price box */}
      <div style={{
        background:'rgba(99,102,241,.08)', border:`1px solid ${T.border}`,
        borderRadius:12, padding:'14px 16px', marginBottom:22,
      }}>
        <div style={{fontSize:9,fontWeight:700,color:T.purpleL,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:5}}>
          Acquisition Cost
        </div>
        <div style={{color:T.t1,fontWeight:900,fontSize:22,letterSpacing:-.5,fontFamily:T.mono}}>{price}</div>
      </div>

      {/* features */}
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:10,marginBottom:22}}>
        {[
          'One-time payment, no subscription',
          bonus ? `Includes ${bonus.toLocaleString()} Bonus Tokens` : 'Instant balance synchronisation',
          'Official Meta Partner API access',
          'Tokens never expire, roll over always',
        ].map((f,i) => (
          <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10}}>
            <div style={{
              width:16,height:16,borderRadius:'50%',
              background: highlight ? 'rgba(124,58,237,.25)' : 'rgba(99,102,241,.15)',
              border:`1px solid ${highlight ? T.borderH : T.border}`,
              display:'flex',alignItems:'center',justifyContent:'center',
              flexShrink:0,marginTop:1,
            }}>
              <IcoCheck size={8} stroke={highlight ? T.purpleL : T.t3} sw={3}/>
            </div>
            <span style={{
              color: i===1 && bonus ? T.purpleL : T.t2,
              fontSize:13, lineHeight:1.5,
              fontWeight: i===1 && bonus ? 600 : 400,
            }}>{f}</span>
          </div>
        ))}
      </div>

      {/* cta */}
      <button style={{
        width:'100%', padding:'13px',
        borderRadius:11, border:'none', cursor:'pointer',
        fontFamily:T.font, fontWeight:700, fontSize:13,
        letterSpacing:'.3px', textTransform:'uppercase',
        transition:'all .2s',
        background: highlight
          ? 'linear-gradient(135deg,#4f46e5,#7c3aed)'
          : 'rgba(255,255,255,.06)',
        color: 'white',
        boxShadow: highlight ? '0 4px 16px rgba(79,70,229,.45)' : 'none',
      }}
        onMouseEnter={e=>{ if(!highlight){ e.currentTarget.style.background='rgba(99,102,241,.15)'; }}}
        onMouseLeave={e=>{ if(!highlight){ e.currentTarget.style.background='rgba(255,255,255,.06)'; }}}
      >{ctaText}</button>
    </div>
  );
};

// ─── ANIMATED COUNTER ────────────────────────────────────────────────
const Counter = ({ target, suffix='' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return <span>{val.toLocaleString()}{suffix}</span>;
};

// ─── PAGE ────────────────────────────────────────────────────────────
const PricingPage = () => {
  const [hovDeploy, setHovDeploy] = useState(false);

  const refills = [
    { amount:1000,  price:'₹99',   bonus:null,  highlight:false, ctaText:'Activate Refill',  interactions:'200' },
    { amount:5000,  price:'₹399',  bonus:500,   highlight:true,  ctaText:'Activate Refill',  interactions:'1,000' },
    { amount:12000, price:'₹799',  bonus:2000,  highlight:false, ctaText:'Activate Refill',  interactions:'2,400' },
  ];

  return (
    <div style={{
      minHeight:'100vh', background:T.bg1, color:T.t2,
      fontFamily:T.font, overflowX:'hidden', paddingTop:96,
    }}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'-8%',width:'60vw',height:'60vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',right:'-6%',width:'52vw',height:'52vh',background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'40%',left:'30%',width:'36vw',height:'36vh',background:'radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── HERO ── */}
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'6px 16px',marginBottom:28,
          }}>
            <IcoZap size={13} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>
              Token Economy v1.0
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(36px,6vw,68px)',
            fontWeight:900,lineHeight:1.06,
            color:T.t1,letterSpacing:-2,marginBottom:20,
          }}>
            Start For{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#22c55e,#4ade80)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
            }}>Free.</span>{' '}
            Refill As You{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Scale.</span>
          </h1>

          <p style={{
            fontSize:'clamp(15px,2vw,18px)',
            color:T.t2,lineHeight:1.8,
            maxWidth:520,margin:'0 auto 36px',
          }}>
            No monthly contracts. No hidden fees. No per-seat pricing. Start with a generous welcome bonus and top up only when you need to — your tokens never expire.
          </p>

          {/* live stats */}
          <div style={{
            display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,
          }}>
            {[
              {emoji:'🎁', label:'500 free welcome tokens'},
              {emoji:'⚡', label:'5 tokens per AI reply'},
              {emoji:'♾️',  label:'Tokens never expire'},
              {emoji:'💸', label:'No monthly subscription'},
            ].map(({emoji,label}) => (
              <div key={label} style={{
                display:'flex',alignItems:'center',gap:7,
                background:'rgba(255,255,255,.04)',border:`1px solid ${T.border}`,
                borderRadius:30,padding:'7px 14px',
                fontSize:12,fontWeight:600,color:T.t2,
              }}><span>{emoji}</span>{label}</div>
            ))}
          </div>
        </div>

        {/* ── WELCOME + REFERRAL BONUS ── */}
        <div className="bonus-grid" style={{marginBottom:52}}>

          {/* Welcome */}
          <div style={{
            background:`linear-gradient(160deg,rgba(124,58,237,.18),rgba(79,70,229,.08),${T.bg3})`,
            border:`1px solid ${T.borderH}`,
            borderRadius:20,padding:'32px 28px',
            position:'relative',overflow:'hidden',
            animation:'slideUp .4s both',
          }}>
            {/* ghost bg icon */}
            <div style={{position:'absolute',bottom:-20,right:-20,opacity:.04,pointerEvents:'none',animation:'floatY 5s ease-in-out infinite'}}>
              <IcoRocket size={180} stroke={T.purpleL} sw={.6}/>
            </div>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{
                width:52,height:52,borderRadius:14,
                background:'rgba(124,58,237,.25)',border:`1px solid rgba(124,58,237,.4)`,
                display:'flex',alignItems:'center',justifyContent:'center',
                marginBottom:18,
              }}>
                <IcoGift size={24} stroke={T.purpleL} sw={1.9}/>
              </div>
              <div style={{fontSize:9,fontWeight:700,color:T.purpleL,letterSpacing:'.5em',textTransform:'uppercase',marginBottom:10}}>
                Registration Reward
              </div>
              <h3 style={{
                color:T.t1,fontWeight:900,
                fontSize:'clamp(22px,3vw,32px)',
                letterSpacing:-.5,marginBottom:12,lineHeight:1.15,
              }}>
                +500 Welcome{' '}
                <span style={{
                  backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
                  WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                }}>Tokens</span>
              </h3>
              <p style={{color:T.t2,fontSize:14,lineHeight:1.7,marginBottom:18}}>
                Power your first <strong style={{color:T.t1,fontWeight:700}}>100 AI interactions</strong> completely free the moment you register. No credit card required to claim them.
              </p>
              <div style={{display:'flex',alignItems:'center',gap:8,color:T.green,fontSize:12,fontWeight:700}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:T.green,boxShadow:`0 0 7px ${T.green}`,display:'inline-block',animation:'pl 2s infinite'}}/>
                Instant — no verification wait
              </div>
            </div>
          </div>

          {/* Referral */}
          <div style={{
            background:`linear-gradient(160deg,rgba(59,130,246,.15),rgba(37,99,235,.07),${T.bg3})`,
            border:'1px solid rgba(59,130,246,.35)',
            borderRadius:20,padding:'32px 28px',
            position:'relative',overflow:'hidden',
            animation:'slideUp .45s .08s both',
          }}>
            <div style={{position:'absolute',bottom:-20,right:-20,opacity:.04,pointerEvents:'none',animation:'floatY 6s ease-in-out infinite'}}>
              <IcoGlobe size={180} stroke={T.blue} sw={.6}/>
            </div>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{
                width:52,height:52,borderRadius:14,
                background:'rgba(59,130,246,.2)',border:'1px solid rgba(59,130,246,.35)',
                display:'flex',alignItems:'center',justifyContent:'center',
                marginBottom:18,
              }}>
                <IcoUsers size={24} stroke={T.blue} sw={1.9}/>
              </div>
              <div style={{fontSize:9,fontWeight:700,color:T.blue,letterSpacing:'.5em',textTransform:'uppercase',marginBottom:10}}>
                Network Expansion
              </div>
              <h3 style={{
                color:T.t1,fontWeight:900,
                fontSize:'clamp(22px,3vw,32px)',
                letterSpacing:-.5,marginBottom:12,lineHeight:1.15,
              }}>
                +50 Referral{' '}
                <span style={{
                  backgroundImage:'linear-gradient(135deg,#60a5fa,#93c5fd)',
                  WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                }}>Yield</span>
              </h3>
              <p style={{color:T.t2,fontSize:14,lineHeight:1.7,marginBottom:18}}>
                Share your unique referral code with other businesses. Earn <strong style={{color:T.t1,fontWeight:700}}>50 tokens</strong> for every verified account that joins — no cap on how much you can earn.
              </p>
              <div style={{display:'flex',alignItems:'center',gap:8,color:T.blue,fontSize:12,fontWeight:700}}>
                <IcoRefresh size={13} stroke={T.blue} sw={2.2}/>
                Unlimited referrals, tokens credited instantly
              </div>
            </div>
          </div>
        </div>

        {/* ── REFILL PACKS ── */}
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:7,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'5px 14px',marginBottom:16,
          }}>
            <IcoCoins size={12} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>Token Refill Packs</span>
          </div>
          <h2 style={{
            fontSize:'clamp(24px,3.5vw,40px)',
            fontWeight:900,color:T.t1,letterSpacing:-.8,marginBottom:10,
          }}>Choose Your Refill Volume</h2>
          <p style={{color:T.t2,fontSize:14,lineHeight:1.7,maxWidth:440,margin:'0 auto'}}>
            All packs are one-time purchases. Tokens never expire and stack with your existing balance.
          </p>
        </div>

        <div className="refill-grid" style={{marginBottom:64}}>
          {refills.map((r,i) => (
            <RefillCard key={i} index={i} {...r}/>
          ))}
        </div>

        {/* ── ECONOMY EXPLAINER ── */}
        <section style={{
          background:`linear-gradient(135deg,rgba(79,70,229,.09),rgba(124,58,237,.06),rgba(15,12,30,.96))`,
          border:`1px solid ${T.border}`,
          borderRadius:24,
          padding:'clamp(32px,5vw,56px)',
          marginBottom:64,
          position:'relative',overflow:'hidden',
        }}>
          <div style={{position:'absolute',top:0,right:0,width:'38%',height:'100%',background:'radial-gradient(ellipse at top right,rgba(124,58,237,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>

            <div style={{textAlign:'center',marginBottom:36}}>
              <h2 style={{
                fontSize:'clamp(22px,3.5vw,36px)',
                fontWeight:900,color:T.t1,letterSpacing:-.6,marginBottom:10,
              }}>How The Economy Operates</h2>
              <p style={{color:T.t2,fontSize:14,lineHeight:1.7,maxWidth:440,margin:'0 auto'}}>
                Simple, transparent, and predictable — so you always know your cost per lead before you spend a single rupee.
              </p>
            </div>

            <div className="economy-grid" style={{marginBottom:36}}>
              {[
                {
                  icon:<IcoCoins size={24} stroke={T.purpleL} sw={1.8}/>,
                  label:'Interaction Cost', val:'5 TOKENS',
                  sub:'Per AI response, flat rate always', accent:T.purpleL,
                },
                {
                  icon:<IcoDb size={24} stroke={T.green} sw={1.8}/>,
                  label:'Lead Storage', val:'FREE',
                  sub:'Unlimited captured leads, forever', accent:T.green,
                },
                {
                  icon:<IcoShield size={24} stroke={T.blue} sw={1.8}/>,
                  label:'Meta Partner', val:'VERIFIED',
                  sub:'Official API sync, zero ban risk', accent:T.blue,
                },
              ].map(({icon,label,val,sub,accent})=>(
                <div key={label} style={{
                  background:'rgba(255,255,255,.03)',
                  border:`1px solid ${T.border}`,
                  borderRadius:14,padding:'22px 18px',textAlign:'center',
                  transition:'border-color .2s, transform .2s',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=accent+'55';e.currentTarget.style.transform='translateY(-3px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform='translateY(0)';}}
                >
                  <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>{icon}</div>
                  <div style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:6}}>{label}</div>
                  <div style={{
                    fontSize:22,fontWeight:900,letterSpacing:-.5,marginBottom:5,
                    fontFamily:T.mono,
                    backgroundImage:`linear-gradient(135deg,${accent},${accent}cc)`,
                    WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                  }}>{val}</div>
                  <div style={{fontSize:11,color:T.t3,lineHeight:1.5}}>{sub}</div>
                </div>
              ))}
            </div>

            {/* ── COMPARE vs HIRING TABLE ── */}
            <div style={{
              background:'rgba(0,0,0,.25)',border:`1px solid ${T.border}`,
              borderRadius:14,overflow:'hidden',
            }}>
              {/* header */}
              <div style={{
                display:'grid',gridTemplateColumns:'1fr 1fr 1fr',
                background:'rgba(99,102,241,.08)',
                borderBottom:`1px solid ${T.border}`,
                padding:'12px 20px',
              }}>
                {['','Without MyAutoBot','With MyAutoBot'].map((h,i)=>(
                  <div key={i} style={{
                    fontSize:10,fontWeight:700,color:i===2?T.purpleL:T.t3,
                    letterSpacing:'.4em',textTransform:'uppercase',
                    textAlign:i===0?'left':'center',
                  }}>{h}</div>
                ))}
              </div>
              {/* rows */}
              {[
                ['Response Speed',       'Hours or days',     'Under 1 second'],
                ['Lead Capture',         'Manual, incomplete','Automatic, structured'],
                ['Working Hours',        'Business hours only','24/7 every day'],
                ['Cost per Lead',        '₹200–500 (staff)',  '₹0.50 avg via tokens'],
                ['Channels Covered',     '1–2 max',           'WhatsApp + IG + Web'],
                ['Scales with Volume',   'Hire more staff',   'Just add tokens'],
              ].map(([label,bad,good],i)=>(
                <div key={i} style={{
                  display:'grid',gridTemplateColumns:'1fr 1fr 1fr',
                  padding:'11px 20px',
                  borderBottom:i<5?`1px solid rgba(255,255,255,.04)`:'none',
                  background:i%2===0?'transparent':'rgba(255,255,255,.01)',
                  alignItems:'center',
                }}>
                  <div style={{fontSize:12,fontWeight:600,color:T.t2}}>{label}</div>
                  <div style={{textAlign:'center',color:'#f87171',fontSize:12}}>{bad}</div>
                  <div style={{textAlign:'center',color:T.green,fontSize:12,fontWeight:600}}>{good}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <div style={{
          textAlign:'center',
          background:`linear-gradient(135deg,rgba(79,70,229,.1),rgba(59,130,246,.06),rgba(124,58,237,.09))`,
          border:`1px solid rgba(99,102,241,.28)`,
          borderRadius:24,padding:'clamp(44px,6vw,72px) 24px',
          position:'relative',overflow:'hidden',
        }}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'50%',height:'60%',background:'radial-gradient(circle,rgba(79,70,229,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>

            <div style={{
              display:'inline-flex',alignItems:'center',gap:7,
              background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.28)',
              borderRadius:30,padding:'6px 14px',marginBottom:22,
            }}>
              <IcoGift size={12} stroke={T.green} sw={2.2}/>
              <span style={{color:T.green,fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}>
                500 free tokens on signup
              </span>
            </div>

            <h2 style={{
              fontSize:'clamp(28px,4.5vw,52px)',
              fontWeight:900,color:T.t1,
              letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,
            }}>
              Deploy Your{' '}
              <span style={{
                backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                backgroundSize:'200%',animation:'shim 5s linear infinite',
              }}>500 Tokens.</span>
            </h2>

            <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:440,margin:'0 auto 36px'}}>
              No credit card. No commitment. Start for free, watch the leads come in, and top up only when you're ready to scale.
            </p>

            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12,marginBottom:26}}>
              <Link
                to="/login?id=register"
                onMouseEnter={()=>setHovDeploy(true)}
                onMouseLeave={()=>setHovDeploy(false)}
                style={{
                  display:'flex',alignItems:'center',gap:9,
                  padding:'15px 34px',borderRadius:12,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color:'white',fontWeight:700,fontSize:15,
                  fontFamily:T.font,textDecoration:'none',
                  boxShadow: hovDeploy ? '0 8px 28px rgba(79,70,229,.6)' : '0 4px 18px rgba(79,70,229,.42)',
                  transform: hovDeploy ? 'translateY(-2px)' : 'translateY(0)',
                  transition:'all .2s',
                }}
              >
                Claim My 500 Free Tokens
                <IcoArrow size={16} stroke="white" sw={2.2}/>
              </Link>
            </div>

            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:22}}>
              {['Free setup included','No credit card needed','Live in 24 hours','Official Meta Partner'].map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:6,color:T.t3,fontSize:13}}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                    stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
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

export default PricingPage;