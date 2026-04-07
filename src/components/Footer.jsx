import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WaIcon } from "./Icons";

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
    *{box-sizing:border-box;}
    @keyframes pl     {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes shim   {0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes ping   {0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}

    .footer-link { transition:color .2s; }
    .footer-link:hover { color:${T.purpleL} !important; }
    .social-btn  { transition:all .2s; }
    .social-btn:hover {
      background:rgba(99,102,241,.12) !important;
      border-color:${T.borderH} !important;
      color:${T.purpleL} !important;
    }

    .footer-grid {
      display:grid;
      grid-template-columns:2fr 2.2fr 1.6fr;
      gap:48px;
    }
    .links-grid {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:32px;
    }
    .bottom-bar {
      display:flex;
      justify-content:space-between;
      align-items:center;
      flex-wrap:wrap;
      gap:16px;
    }
    .bottom-badges {
      display:flex;
      flex-wrap:wrap;
      gap:20px;
      align-items:center;
    }

    @media(max-width:1024px){
      .footer-grid  { grid-template-columns:1fr 1fr; }
      .status-col   { grid-column:1/-1; }
    }
    @media(max-width:640px){
      .footer-grid  { grid-template-columns:1fr; }
      .links-grid   { grid-template-columns:repeat(2,1fr); }
      .status-col   { grid-column:auto; }
      .bottom-bar   { flex-direction:column; text-align:center; }
      .bottom-badges{ justify-content:center; }
    }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=16, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);

// ─── SOCIAL ICON PATHS ────────────────────────────────────────────────
const socials = [
  { path:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z", href:'#', label:'Instagram' },
  { path:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",                                                                           href:'#', label:'Facebook'  },
  { path:"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z", href:'#', label:'Twitter'   },
  { path:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",            href:'#', label:'LinkedIn'  },
];

// ─── STATUS CARD ─────────────────────────────────────────────────────
const StatusCard = ({ isOnline, lastPing, nodeDetails }) => (
  <div style={{
    background: isOnline
      ? `linear-gradient(160deg,rgba(34,197,94,.06),rgba(99,102,241,.04),${T.bg3})`
      : `linear-gradient(160deg,rgba(239,68,68,.06),${T.bg3})`,
    border: `1px solid ${isOnline ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`,
    borderRadius:18, padding:'22px',
    position:'relative', overflow:'hidden',
    transition:'border-color .7s',
  }}>
    <div style={{
      position:'absolute',top:-24,right:-24,width:100,height:100,
      background:`radial-gradient(circle,${isOnline ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.1)'} 0%,transparent 70%)`,
      pointerEvents:'none',transition:'background .7s',
    }}/>

    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{position:'relative',width:10,height:10}}>
          <div style={{
            position:'absolute',inset:0,borderRadius:'50%',
            background: isOnline ? T.green : T.red,
            animation:'ping 2s cubic-bezier(0,0,.2,1) infinite',
            opacity:.4,
          }}/>
          <div style={{
            position:'relative',width:10,height:10,borderRadius:'50%',
            background: isOnline ? T.green : T.red,
            boxShadow:`0 0 8px ${isOnline ? T.green : T.red}`,
            animation:'pl 2s infinite',
          }}/>
        </div>
        <span style={{
          fontSize:10,fontWeight:700,
          color: isOnline ? '#4ade80' : '#f87171',
          letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono,
        }}>
          {isOnline ? 'Neural Link Active' : 'Uplink Failed'}
        </span>
      </div>
      <div style={{textAlign:'right'}}>
        <div style={{fontSize:7,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:2}}>Last Ping</div>
        <div style={{fontSize:9,fontWeight:600,color:T.purpleL,fontFamily:T.mono}}>{lastPing}</div>
      </div>
    </div>

    <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:16}}>
      {[
        {
          iconPath:"M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01",
          label:'Active Node',
          val: nodeDetails.id,
          sub: nodeDetails.provider,
          accent: isOnline ? T.purpleL : T.t3,
        },
        {
          iconPath:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
          label:'Server Location',
          val: nodeDetails.location,
          sub: null,
          accent: T.purpleL,
        },
      ].map(({ iconPath, label, val, sub, accent }) => (
        <div key={label} style={{display:'flex',alignItems:'flex-start',gap:10}}>
          <div style={{
            width:30,height:30,borderRadius:9,flexShrink:0,
            background:`${accent}18`,border:`1px solid ${accent}33`,
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d={iconPath}/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:3}}>{label}</div>
            <div style={{fontSize:12,fontWeight:700,color:T.t1,fontFamily:T.mono}}>
              {val}
              {sub && <span style={{color:T.t3,fontWeight:400,marginLeft:5,fontSize:10}}>— {sub}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div style={{
      paddingTop:12,borderTop:`1px solid ${T.border}`,
      display:'flex',alignItems:'center',justifyContent:'space-between',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:5}}>
        <svg width={10} height={10} viewBox="0 0 24 24" fill="none"
          stroke={T.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        <span style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono}}>
          Latency: 24ms
        </span>
      </div>
      <span style={{
        fontSize:9,fontWeight:700,color:T.purpleL,
        letterSpacing:'.3em',textTransform:'uppercase',
        cursor:'pointer',textDecoration:'underline',
        textDecorationColor:'rgba(167,139,250,.3)',
        textUnderlineOffset:3,
        transition:'color .2s',
      }}
        onMouseEnter={e=>e.target.style.color=T.t1}
        onMouseLeave={e=>e.target.style.color=T.purpleL}
      >Details</span>
    </div>
  </div>
);

// ─── FOOTER ──────────────────────────────────────────────────────────
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isOnline, setIsOnline] = useState(true);
  const [lastPing, setLastPing] = useState(new Date().toLocaleTimeString());

  const nodeDetails = { id:'SRV-1208', location:'Mumbai, IN', provider:'MyAutoBot Edge' };

  useEffect(() => {
    const id = setInterval(() => {
      setIsOnline(Math.random() > 0.02);
      setLastPing(new Date().toLocaleTimeString());
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const footerLinks = {
    Product: [
      { name:'Features',    href:'/features'    },
      { name:'How it Works',href:'/how-it-works' },
      { name:'Pricing',     href:'/pricing'      },
      { name:'Use Cases',   href:'/use-cases'    },
    ],
    Company: [
      { name:'About Us', href:'/about'   },
      { name:'Privacy',  href:'/privacy' },
      { name:'Terms',    href:'/terms'   },
      { name:'FAQ',      href:'/faq'     },
    ],
    Support: [
      { name:'Help Center', href:'/help'    },
      { name:'Contact',     href:'/contact' },
      { name:'API Docs',    href:'/docs'    },
    ],
  };

  return (
    <footer style={{
      position:'relative', zIndex:10,
      borderTop:`1px solid ${T.border}`,
      background: T.bg1,
      paddingTop:64, paddingBottom:36,
      overflow:'hidden',
      fontFamily:T.font,
    }}>
      <GlobalCSS/>

      {/* ambient bottom glow */}
      <div style={{
        position:'absolute',bottom:-60,left:'50%',transform:'translateX(-50%)',
        width:560,height:280,
        background:'radial-gradient(ellipse,rgba(79,70,229,.1) 0%,transparent 70%)',
        pointerEvents:'none',
      }}/>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',position:'relative',zIndex:1}}>

        {/* ── MAIN GRID ── */}
        <div className="footer-grid" style={{marginBottom:52}}>

          {/* brand col */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            {/* logo — image icon + wordmark */}
            <Link to="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',marginBottom:20}}>
              {/* image replaces the old gradient badge */}
              <img
                src="https://avenirya.com/wp-content/uploads/2026/03/image-removebg-preview-1.png"
                alt=""
                style={{
                  height: 38,
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
              {/* wordmark — unchanged */}
              <div style={{display:'flex',flexDirection:'column',lineHeight:1}}>
                <span style={{fontWeight:900,fontSize:18,letterSpacing:-.5,color:T.t1}}>
                  MyAuto<span style={{
                    backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
                    WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                  }}>Bot</span>
                </span>
                <span style={{fontSize:7.5,fontWeight:700,letterSpacing:'.35em',textTransform:'uppercase',color:T.t3,marginTop:3}}>
                  Systems · AI
                </span>
              </div>
            </Link>

            <p style={{color:T.t2,fontSize:13.5,lineHeight:1.75,marginBottom:24,maxWidth:260}}>
              The smartest AI engine for lead capture. Turn every WhatsApp, Instagram, and website conversation into real, structured business growth — 24/7.
            </p>

            {/* social icons */}
            <div style={{display:'flex',gap:8}}>
              {socials.map(({ path, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="social-btn"
                  style={{
                    width:34,height:34,borderRadius:10,
                    background:'rgba(255,255,255,.04)',
                    border:`1px solid ${T.border}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:T.t3,textDecoration:'none',
                  }}
                >
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d={path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* links col */}
          <div className="links-grid">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 style={{
                  display:'flex',alignItems:'center',gap:7,
                  fontSize:9,fontWeight:700,color:T.t1,
                  letterSpacing:'.4em',textTransform:'uppercase',
                  marginBottom:18,
                }}>
                  <span style={{
                    width:3,height:14,borderRadius:2,
                    background:'linear-gradient(180deg,#6366f1,#7c3aed)',
                    display:'inline-block',
                    boxShadow:'0 0 7px rgba(99,102,241,.6)',
                    flexShrink:0,
                  }}/>
                  {title}
                </h4>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:11}}>
                  {links.map(link => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="footer-link"
                        style={{
                          color:T.t3,fontSize:13,fontWeight:500,
                          textDecoration:'none',display:'block',
                        }}
                      >{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* status card col */}
          <div className="status-col">
            <StatusCard isOnline={isOnline} lastPing={lastPing} nodeDetails={nodeDetails}/>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{
          height:1,
          background:`linear-gradient(90deg,transparent,${T.border},transparent)`,
          marginBottom:24,
        }}/>

        {/* ── BOTTOM BAR ── */}
        <div className="bottom-bar">
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <p style={{
              fontSize:10,fontWeight:700,color:T.t3,
              letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono,
            }}>
              © {currentYear} MyAutoBot Systems
            </p>
            <p style={{
              fontSize:9,fontWeight:600,color:T.t3,opacity:.6,
              letterSpacing:'.3em',textTransform:'uppercase',fontFamily:T.mono,
            }}>
              Avenirya Solutions OPC Pvt Ltd · Yash Kolnure
            </p>
          </div>

          <div className="bottom-badges">
            {[
              { iconPath:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label:'AES-256 Encrypted',    accent:'#22c55e' },
              { iconPath:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label:'Official Meta Partner', accent:T.purpleL },
              { iconPath:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",             label:'Ver: 2.0.45',            accent:T.t3 },
            ].map(({ iconPath, label, accent }) => (
              <div key={label} style={{display:'flex',alignItems:'center',gap:6}}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
                  stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={iconPath}/>
                </svg>
                <span style={{
                  fontSize:10,fontWeight:700,color:T.t3,
                  letterSpacing:'.35em',textTransform:'uppercase',fontFamily:T.mono,
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
{/* ------------------- WHATSAPP FLOATING WIDGET WITH WAVING BOT ------------------- */}
<div style={{ position: "fixed", bottom: "15px", right: "30px", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
    
    {/* Animated Bot & Message Container */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "12px", position: "relative" }}>
        
        {/* The Waving Bot SVG */}
        <svg width="60" height="60" viewBox="0 0 100 100" style={{ marginBottom: "-10px", filter: "drop-shadow(0px 4px 10px rgba(223, 214, 214, 0.1))" }}>
            {/* Bot Body */}
            <rect x="25" y="40" width="50" height="40" rx="15" fill="#fff" />
            <rect x="35" y="50" width="30" height="20" rx="5" fill="#1e293b" />
            {/* Eyes */}
            <circle cx="42" cy="60" r="3" fill="#25d366">
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="58" cy="60" r="3" fill="#25d366">
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Waving Arm */}
            <g className="bot-arm" style={{ transformOrigin: "25px 55px", animation: "wa-wave 2s ease-in-out infinite" }}>
                <path d="M25 55 L10 40" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
                <circle cx="10" cy="40" r="5" fill="#fff" />
            </g>
            {/* Static Arm */}
            <path d="M75 55 L90 70" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
        </svg>

        {/* Popup Message */}
        <div style={{ 
            background: "#fff", 
            padding: "10px 18px", 
            borderRadius: "16px", 
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
            fontSize: "12px",
            fontWeight: 800,
            color: "#0f172a",
            border: "1.2px solid #0f172a",
            textAlign: "center",
            position: "relative",
            whiteSpace: "nowrap"
        }}>
            Chat with Our BOT on WhatsApp
            {/* Bubble Tip */}
            <div style={{ position: "absolute", bottom: "-7px", right: "25px", width: "12px", height: "12px", background: "#fff", transform: "rotate(45deg)", borderRight: "1.2px solid #0f172a", borderBottom: "1.2px solid #0f172a" }} />
        </div>
    </div>
    
    {/* Main WhatsApp Button */}
    <a 
        href="https://wa.me/917498869327?text=Hello!%20I'm%20interested%20in%20WhatsApp%20Automation." 
        target="_blank" 
        rel="noreferrer"
        style={{ 
            width: "65px", 
            height: "65px", 
            borderRadius: "50%", 
            background: "#25d366", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: "0 10px 25px rgba(37, 211, 102, 0.4)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            cursor: "pointer",
            border: "3px solid #fff"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.1) rotate(5deg)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1.0) rotate(0deg)"}
    >
        <WaIcon size={35} color="#ffffff" />
    </a>

    <style>{`
      @keyframes wa-wave {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-30deg); }
      }
      @keyframes wa-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      /* Apply floating animation to the whole bot container */
      .wa-widget-container {
          animation: wa-float 4s ease-in-out infinite;
      }
    `}</style>
</div>

      </div>
    </footer>
  );
};

export default Footer;