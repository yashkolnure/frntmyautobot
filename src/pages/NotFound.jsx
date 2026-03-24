import React, { useState, useEffect } from 'react';

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

    @keyframes shim    {0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes pl      {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes floatY  {0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes slideUp {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glitch1 {
      0%,100%{clip-path:inset(0 0 98% 0);transform:translate(-3px,0)}
      20%    {clip-path:inset(30% 0 50% 0);transform:translate(3px,0)}
      40%    {clip-path:inset(60% 0 20% 0);transform:translate(-2px,0)}
      60%    {clip-path:inset(80% 0 5%  0);transform:translate(2px,0)}
      80%    {clip-path:inset(10% 0 80% 0);transform:translate(-1px,0)}
    }
    @keyframes glitch2 {
      0%,100%{clip-path:inset(50% 0 30% 0);transform:translate(3px,0)}
      25%    {clip-path:inset(20% 0 60% 0);transform:translate(-3px,0)}
      50%    {clip-path:inset(70% 0 10% 0);transform:translate(2px,0)}
      75%    {clip-path:inset(5%  0 85% 0);transform:translate(-2px,0)}
    }
    @keyframes scan {
      0%  {transform:translateY(-100%)}
      100%{transform:translateY(200vh)}
    }
    @keyframes blink  {0%,100%{opacity:1}50%{opacity:0}}
    @keyframes glow   {0%,100%{box-shadow:0 0 20px rgba(124,58,237,.4)}50%{box-shadow:0 0 40px rgba(124,58,237,.7)}}
    @keyframes fadeIn {from{opacity:0}to{opacity:1}}

    .btn-ghost:hover { background:rgba(255,255,255,.08)!important; color:${T.t1}!important; }
    ::selection { background:rgba(124,58,237,.4); }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=18, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoArrowL  = p => <Ico {...p} d="M19 12H5M12 5l-7 7 7 7"/>;
const IcoHome    = p => <Ico {...p} d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z M9 21V12h6v9"/>;
const IcoBot     = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>;
const IcoWarn    = p => <Ico {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>;
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoSearch  = p => <Ico {...p} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"/>;
const IcoRocket  = p => <Ico {...p} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>;

// ─── GLITCH 404 ──────────────────────────────────────────────────────
const Glitch404 = () => (
  <div style={{ position:'relative', display:'inline-block', userSelect:'none' }}>
    {/* ghost base */}
    <div style={{
      fontSize:'clamp(96px,18vw,200px)',
      fontWeight:900, letterSpacing:-8,
      color:'rgba(99,102,241,0.06)',
      lineHeight:1, fontFamily:T.mono,
    }}>404</div>

    {/* glitch layer 1 */}
    <div style={{
      position:'absolute', inset:0,
      fontSize:'clamp(96px,18vw,200px)',
      fontWeight:900, letterSpacing:-8,
      color:'rgba(124,58,237,.55)',
      lineHeight:1, fontFamily:T.mono,
      animation:'glitch1 3.5s steps(1) infinite',
    }}>404</div>

    {/* glitch layer 2 */}
    <div style={{
      position:'absolute', inset:0,
      fontSize:'clamp(96px,18vw,200px)',
      fontWeight:900, letterSpacing:-8,
      color:'rgba(59,130,246,.45)',
      lineHeight:1, fontFamily:T.mono,
      animation:'glitch2 2.8s steps(1) infinite',
    }}>404</div>
  </div>
);

// ─── TERMINAL BLOCK ──────────────────────────────────────────────────
const Terminal = () => {
  const lines = [
    { delay:0,    color:'#4ade80', text:'> Initiating path resolution…' },
    { delay:800,  color:T.t2,     text:'> Scanning neural index…' },
    { delay:1600, color:'#f87171',text:'> ERROR: Route not found in registry' },
    { delay:2400, color:T.t2,     text:'> Fallback: Returning to base node' },
  ];
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    lines.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), lines[i].delay);
    });
  }, []);

  return (
    <div style={{
      background:'rgba(0,0,0,.45)',
      border:`1px solid ${T.border}`,
      borderRadius:14,
      padding:'16px 20px',
      maxWidth:420, width:'100%',
      textAlign:'left',
      animation:'slideUp .5s .4s both',
    }}>
      {/* top bar */}
      <div style={{
        display:'flex', alignItems:'center', gap:6,
        marginBottom:14, paddingBottom:12,
        borderBottom:`1px solid ${T.border}`,
      }}>
        {['#ef4444','#f59e0b','#22c55e'].map(c => (
          <div key={c} style={{width:9,height:9,borderRadius:'50%',background:c,opacity:.7}}/>
        ))}
        <span style={{
          marginLeft:6,fontSize:9,fontWeight:700,color:T.t3,
          letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono,
        }}>path_resolver.exe</span>
      </div>

      {/* log lines */}
      <div style={{display:'flex',flexDirection:'column',gap:7}}>
        {lines.map((l, i) => (
          <div key={i} style={{
            opacity: visible > i ? 1 : 0,
            transition:'opacity .3s',
            fontSize:11, fontFamily:T.mono, color:l.color,
            display:'flex',alignItems:'center',gap:7,
          }}>
            {l.text}
          </div>
        ))}
        {/* blinking cursor */}
        <div style={{
          width:7,height:13,background:T.purpleL,
          borderRadius:2,marginTop:2,
          animation:'blink 1.1s step-end infinite',
        }}/>
      </div>
    </div>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────
const NotFoundPage = () => {
  const [hovBack, setHovBack] = useState(false);
  const [hovHome, setHovHome] = useState(false);

  return (
    <div style={{
      minHeight:'100vh',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:T.bg1, fontFamily:T.font,
      padding:'24px', position:'relative', overflow:'hidden',
      textAlign:'center',
    }}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-15%',left:'-8%',width:'60vw',height:'60vh',background:'radial-gradient(circle,rgba(79,70,229,.14) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-12%',right:'-8%',width:'55vw',height:'55vh',background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'35%',left:'30%',width:'38vw',height:'38vh',background:'radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      {/* scanline sweep */}
      <div style={{
        position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:'linear-gradient(to bottom,transparent,rgba(99,102,241,.03),transparent)',
        height:120, width:'100%',
        animation:'scan 5s linear infinite',
      }}/>

      <div style={{position:'relative',zIndex:1,maxWidth:680,width:'100%'}}>

        {/* ── GLITCH 404 + ICON ── */}
        <div style={{
          position:'relative', display:'inline-block',
          marginBottom:8,
          marginTop:28,
          animation:'slideUp .4s both',
        }}>
          <Glitch404/>

          {/* floating icon overlay */}
          <div style={{
            position:'absolute', inset:0,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            gap:12,
          }}>
            {/* bot badge */}
            <div style={{
              width:68, height:68, borderRadius:20,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 40px rgba(124,58,237,.55)',
              animation:'floatY 3s ease-in-out infinite, glow 3s ease-in-out infinite',
            }}>
              <IcoBot size={30} stroke="white" sw={1.7}/>
            </div>

            {/* error badge */}
            <div style={{
              display:'inline-flex',alignItems:'center',gap:6,
              background:'rgba(239,68,68,.1)',
              border:'1px solid rgba(239,68,68,.35)',
              borderRadius:30,padding:'5px 14px',
              animation:'slideUp .5s .2s both',
            }}>
              <IcoWarn size={11} stroke="#f87171" sw={2.2}/>
              <span style={{
                color:'#fca5a5',fontSize:9,fontWeight:700,
                letterSpacing:'.6px',textTransform:'uppercase',fontFamily:T.mono,
              }}>Neural Path Broken</span>
            </div>
          </div>
        </div>

        {/* ── HEADING ── */}
        <div style={{marginBottom:16,animation:'slideUp .45s .1s both'}}>
          <h2 style={{
            fontSize:'clamp(26px,4.5vw,48px)',
            fontWeight:900,color:T.t1,
            letterSpacing:-1.5,lineHeight:1.1,marginBottom:14,
          }}>
            Lost in the{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Datastream.</span>
          </h2>
          <p style={{
            color:T.t2,fontSize:'clamp(14px,2vw,16px)',lineHeight:1.75,
            maxWidth:460,margin:'0 auto',
          }}>
            The page you're looking for has been de-indexed or moved to a restricted node. Our AI agents couldn't find a valid response for this URL.
          </p>
        </div>

        {/* ── TERMINAL ── */}
        <div style={{
          display:'flex',justifyContent:'center',
          marginBottom:36,
        }}>
          <Terminal/>
        </div>

        {/* ── BUTTONS ── */}
        <div style={{
          display:'flex',flexWrap:'wrap',
          alignItems:'center',justifyContent:'center',
          gap:12,marginBottom:52,
          animation:'slideUp .5s .3s both',
        }}>
          <button
            onClick={() => window.history.back()}
            onMouseEnter={() => setHovBack(true)}
            onMouseLeave={() => setHovBack(false)}
            className="btn-ghost"
            style={{
              display:'flex',alignItems:'center',gap:8,
              padding:'13px 24px',borderRadius:11,border:`1px solid ${T.border}`,
              background:'rgba(255,255,255,.04)',
              color:T.t2,fontSize:13,fontWeight:700,cursor:'pointer',
              fontFamily:T.font,
              transition:'all .2s',
            }}
          >
            <IcoArrowL
              size={15} stroke="currentColor" sw={2.2}
              style={{
                transition:'transform .2s',
                transform: hovBack ? 'translateX(-3px)' : 'translateX(0)',
              }}
            />
            Go Back
          </button>

          <a
            href="/"
            onMouseEnter={() => setHovHome(true)}
            onMouseLeave={() => setHovHome(false)}
            style={{
              display:'flex',alignItems:'center',gap:8,
              padding:'13px 28px',borderRadius:11,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              color:'white',fontSize:13,fontWeight:700,
              fontFamily:T.font,textDecoration:'none',
              boxShadow: hovHome
                ? '0 8px 26px rgba(79,70,229,.65)'
                : '0 4px 18px rgba(79,70,229,.42)',
              transform: hovHome ? 'translateY(-2px)' : 'translateY(0)',
              transition:'all .2s',
            }}
          >
            <IcoHome size={15} stroke="white" sw={2.2}/>
            Return to Base
          </a>
        </div>

        {/* ── QUICK LINKS ── */}
        <div style={{
          display:'flex',flexWrap:'wrap',
          alignItems:'center',justifyContent:'center',gap:10,
          marginBottom:48,
          animation:'slideUp .5s .35s both',
        }}>
          {[
            {href:'/features',  label:'Features'},
            {href:'/how-it-works', label:'How it Works'},
            {href:'/pricing',   label:'Pricing'},
            {href:'/faq',       label:'FAQ'},
          ].map(({href,label}) => (
            <a key={label} href={href} style={{
              display:'inline-block',
              padding:'6px 14px',
              background:'rgba(255,255,255,.03)',
              border:`1px solid ${T.border}`,
              borderRadius:30,
              color:T.t3,fontSize:12,fontWeight:600,
              textDecoration:'none',
              transition:'all .2s',
            }}
              onMouseEnter={e=>{
                e.currentTarget.style.borderColor=T.borderH;
                e.currentTarget.style.color=T.purpleL;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.borderColor=T.border;
                e.currentTarget.style.color=T.t3;
              }}
            >{label}</a>
          ))}
        </div>

        {/* ── FOOTER NOTE ── */}
        <div style={{
          opacity:.4,
          display:'flex',flexDirection:'column',alignItems:'center',gap:10,
          animation:'fadeIn 1s .6s both',
        }}>
          <div style={{
            display:'flex',alignItems:'center',gap:7,
            fontSize:10,fontWeight:700,color:T.t3,
            letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono,
          }}>
            <IcoShield size={12} stroke={T.purpleL} sw={2}/>
            Official Meta Tech Provider
          </div>
          <p style={{
            fontSize:9,fontWeight:600,color:T.t3,
            letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono,
          }}>
            Avenirya Solutions OPC Pvt Ltd · 2026
          </p>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;