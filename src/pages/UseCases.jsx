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
    @keyframes ticker {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes countPl{0%,100%{opacity:1}40%{opacity:.5}}

    .cases-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .perf-grid   { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
    .perf-stats  { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .channel-list{ display:flex; flex-direction:column; gap:12px; }

    @media(max-width:1100px){ .cases-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:1024px){ .perf-grid  { grid-template-columns:1fr; gap:36px; } }
    @media(max-width:640px) {
      .cases-grid { grid-template-columns:1fr; }
      .perf-stats { grid-template-columns:1fr 1fr; }
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
const IcoSpark   = p => <Ico {...p} d="M12 3l1.88 5.76a1 1 0 0 0 .95.69H21l-5 3.63a1 1 0 0 0-.36 1.12L17.52 20 12 16.37 6.48 20l1.88-5.8a1 1 0 0 0-.36-1.12L3 9.45h6.17a1 1 0 0 0 .95-.69L12 3z"/>;
const IcoBot     = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>;

// industry icon paths
const ICONS = {
  utensils:   "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7",
  home:       "M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z M9 21V12h6v9",
  bag:        "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  briefcase:  "M20 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  stethoscope:"M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3M14 12a6 6 0 0 0 6 6h0a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h0a10 10 0 0 1-10-10",
  graduation: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  car:        "M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v7a2 2 0 0 1-2 2h-3M8 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0",
  plane:      "M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
};

// ─── CASE CARD ───────────────────────────────────────────────────────
const CaseCard = ({ iconKey, industry, title, scenarios, accent, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? `linear-gradient(160deg,${accent}12,${accent}06,${T.bg3})`
          : T.bg2,
        border: `1px solid ${hov ? accent+'55' : T.border}`,
        borderRadius: 20,
        padding: '28px 26px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all .3s cubic-bezier(.34,1.2,.64,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? `0 22px 48px ${accent}1e` : 'none',
        animation: `slideUp .5s ${index * 0.06}s both`,
        cursor: 'default',
      }}
    >
      {/* ghost bg icon */}
      <div style={{
        position:'absolute', top:-8, right:-8,
        opacity: hov ? 0.07 : 0.025,
        transition:'opacity .3s', pointerEvents:'none',
      }}>
        <svg width={130} height={130} viewBox="0 0 24 24" fill="none"
          stroke={accent} strokeWidth={.9} strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONS[iconKey]}/>
        </svg>
      </div>

      <div style={{position:'relative',zIndex:1}}>
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
            <path d={ICONS[iconKey]}/>
          </svg>
        </div>

        {/* industry label */}
        <div style={{
          display:'inline-block',
          background:`${accent}18`, border:`1px solid ${accent}33`,
          borderRadius:20, padding:'3px 10px',
          color:accent, fontSize:9, fontWeight:700,
          letterSpacing:'.7px', textTransform:'uppercase',
          marginBottom:10,
        }}>{industry}</div>

        <h3 style={{
          color:T.t1, fontWeight:800, fontSize:19,
          marginBottom:14, lineHeight:1.2, letterSpacing:-.3,
        }}>{title}</h3>

        {/* scenarios */}
        <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom:20}}>
          {scenarios.map((s, i) => (
            <div key={i} style={{display:'flex', alignItems:'flex-start', gap:10}}>
              <div style={{
                width:17, height:17, borderRadius:'50%',
                background:`${accent}20`, border:`1px solid ${accent}44`,
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, marginTop:1,
              }}>
                <IcoCheck size={9} stroke={accent} sw={3}/>
              </div>
              <p style={{color:T.t2, fontSize:13, lineHeight:1.65}}>{s}</p>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{
          paddingTop:16,
          borderTop:`1px solid ${T.border}`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          opacity: hov ? 1 : 0.45,
          transition:'opacity .25s',
        }}>
          <span style={{fontSize:10,fontWeight:700,color:T.t3,letterSpacing:'.5em',textTransform:'uppercase'}}>Deploy Template</span>
          <IcoArrow size={15} stroke={accent} sw={2.2}/>
        </div>
      </div>
    </div>
  );
};

// ─── CHANNEL STATUS MOCKUP ────────────────────────────────────────────
const ChannelMockup = () => {
  const channels = [
    { name:'WhatsApp',  val:'54 New Leads',   accent:'#22c55e',  icon:'💬', pct:82 },
    { name:'Instagram', val:'12 Inquiries',   accent:'#ec4899',  icon:'📸', pct:45 },
    { name:'Website',   val:'847 Visitors',   accent:'#3b82f6',  icon:'🌐', pct:68 },
  ];
  return (
    <div style={{
      background:`linear-gradient(160deg,${T.bg3},#0c0820)`,
      border:`1px solid ${T.borderH}`,
      borderRadius:20,
      padding:'28px 26px',
      boxShadow:`0 28px 56px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.12)`,
    }}>
      {/* header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <IcoBot size={16} stroke={T.purpleL} sw={2}/>
          <span style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase'}}>Omni-Channel Status</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:T.green,boxShadow:`0 0 8px ${T.green}`,display:'inline-block',animation:'pl 2s infinite'}}/>
          <span style={{fontSize:10,fontWeight:600,color:T.green}}>Live</span>
        </div>
      </div>

      <div className="channel-list">
        {channels.map(({name, val, accent, icon, pct}) => (
          <div key={name} style={{
            background:'rgba(255,255,255,.03)',
            border:`1px solid ${T.border}`,
            borderRadius:14, padding:'14px 16px',
            transition:'border-color .2s',
          }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=accent+'55'}
            onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
          >
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <div style={{display:'flex',alignItems:'center',gap:9}}>
                <span style={{fontSize:16}}>{icon}</span>
                <span style={{color:T.t1,fontWeight:700,fontSize:14}}>{name}</span>
              </div>
              <span style={{color:accent,fontFamily:T.mono,fontSize:12,fontWeight:600}}>{val}</span>
            </div>
            {/* mini progress */}
            <div style={{height:4,background:'rgba(255,255,255,.05)',borderRadius:4,overflow:'hidden'}}>
              <div style={{
                height:'100%', width:`${pct}%`,
                background:`linear-gradient(90deg,${accent}99,${accent})`,
                borderRadius:4,
                boxShadow:`0 0 8px ${accent}55`,
                transition:'width 1.2s ease',
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* total */}
      <div style={{
        marginTop:18,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        background:'rgba(99,102,241,.07)',
        border:`1px solid ${T.border}`,
        borderRadius:12, padding:'12px 16px',
      }}>
        <span style={{fontSize:11,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase'}}>Total Today</span>
        <span style={{color:T.t1,fontWeight:800,fontSize:18,fontFamily:T.mono}}>66 Leads</span>
      </div>
    </div>
  );
};

// ─── INDUSTRY TICKER ─────────────────────────────────────────────────
const IndustryTicker = ({ industries }) => {
  const doubled = [...industries, ...industries];
  return (
    <div style={{
      overflow:'hidden', position:'relative',
      marginBottom:60, padding:'4px 0',
    }}>
      {/* fade edges */}
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:80,background:`linear-gradient(90deg,${T.bg1},transparent)`,zIndex:2,pointerEvents:'none'}}/>
      <div style={{position:'absolute',right:0,top:0,bottom:0,width:80,background:`linear-gradient(270deg,${T.bg1},transparent)`,zIndex:2,pointerEvents:'none'}}/>
      <div style={{display:'flex',gap:12,animation:'ticker 28s linear infinite',width:'max-content'}}>
        {doubled.map(({industry, accent, iconKey}, i) => (
          <div key={i} style={{
            display:'flex',alignItems:'center',gap:8,
            background:`${accent}10`, border:`1px solid ${accent}28`,
            borderRadius:30, padding:'8px 16px',
            flexShrink:0,
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[iconKey]}/>
            </svg>
            <span style={{color:accent,fontSize:11,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',whiteSpace:'nowrap'}}>{industry}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────
const UseCases = () => {
  const [hovCta, setHovCta] = useState(false);

  const industries = [
    {
      iconKey:'utensils', industry:'Hospitality', accent:'#f97316',
      title:'Restaurants & Cafes',
      scenarios:[
        'Automated table reservations and waitlist management via WhatsApp — no phone calls needed.',
        'Instant PDF menu sharing, daily specials announcements, and allergen query handling.',
        'Post-dining feedback collection and loyalty reward follow-ups sent automatically.',
      ],
    },
    {
      iconKey:'home', industry:'Real Estate', accent:'#3b82f6',
      title:'Property & Leasing',
      scenarios:[
        'Pre-qualifying buyers by collecting budget, location preferences, and timeline before a human ever gets involved.',
        'Automated booking for property walkthroughs, virtual tours, and document handoffs.',
        'Brochures, floor plans, and payment schedules sent instantly upon first enquiry.',
      ],
    },
    {
      iconKey:'bag', industry:'E-Commerce', accent:'#d946ef',
      title:'Online Retailers',
      scenarios:[
        '24/7 product availability checks, sizing guides, and shipping estimates answered instantly.',
        'Cart abandonment recovery via personalised Instagram DMs and WhatsApp follow-ups.',
        'Automated order confirmation, payment link delivery, and live shipping tracking updates.',
      ],
    },
    {
      iconKey:'briefcase', industry:'B2B Agencies', accent:'#a78bfa',
      title:'Marketing & SaaS',
      scenarios:[
        'White-label bot deployment for agency clients built on the Avenirya infrastructure.',
        'Inbound lead qualification — budget, scope, timeline — before they ever reach your sales team.',
        '24/7 technical support and FAQ handling for software users, reducing tier-1 ticket volume.',
      ],
    },
    {
      iconKey:'stethoscope', industry:'Healthcare', accent:'#22c55e',
      title:'Clinics & Wellness',
      scenarios:[
        'Booking medical appointments, sending automated reminders, and managing cancellations.',
        'Answering FAQs about services, insurance panels, doctor availability, and pricing.',
        'Pre-consultation intake forms completed via chat — zero paper, zero admin delay.',
      ],
    },
    {
      iconKey:'graduation', industry:'Education', accent:'#06b6d4',
      title:'Schools & EdTech',
      scenarios:[
        'Handling admission enquiries, sharing course brochures, and guiding through application steps.',
        'Automated fee payment reminders, receipt generation, and scholarship info delivery.',
        '24/7 student support for common portal questions, timetables, and course access issues.',
      ],
    },
    {
      iconKey:'car', industry:'Automotive', accent:'#ef4444',
      title:'Dealerships',
      scenarios:[
        'Scheduling test drives and service appointments via WhatsApp without any staff involvement.',
        'Sending vehicle specifications, on-road pricing breakdowns, and finance scheme comparisons.',
        'Instant trade-in value estimations collected and structured from user-provided details.',
      ],
    },
    {
      iconKey:'plane', industry:'Travel', accent:'#6366f1',
      title:'Tours & Travels',
      scenarios:[
        'Sharing customised holiday itineraries based on destination, budget, and group size preferences.',
        'Collecting full traveller details for visa processing, hotel bookings, and insurance automatically.',
        'Instant customer support for flight changes, hotel check-ins, and on-trip emergencies.',
      ],
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
        <div style={{position:'absolute',top:'-5%',right:'-5%',width:'55vw',height:'55vh',background:'radial-gradient(circle,rgba(124,58,237,.1) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-5%',left:'-5%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'40%',left:'30%',width:'38vw',height:'38vh',background:'radial-gradient(circle,rgba(79,70,229,.06) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1200,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── HERO ── */}
        <div style={{textAlign:'center',marginBottom:52}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'6px 16px',marginBottom:28,
          }}>
            <IcoSpark size={13} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>
              Diverse Industry Solutions
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(36px,6vw,72px)',
            fontWeight:900, lineHeight:1.06,
            color:T.t1, letterSpacing:-2, marginBottom:22,
          }}>
            Built for{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundSize:'200%', animation:'shim 5s linear infinite',
            }}>Every Workflow.</span>
          </h1>

          <p style={{
            fontSize:'clamp(15px,2vw,19px)',
            color:T.t2, lineHeight:1.8,
            maxWidth:580, margin:'0 auto 40px',
          }}>
            From neighbourhood restaurants to global SaaS agencies — MyAutoBot delivers the exact automation needed to capture, qualify, and convert leads 24/7 across every industry.
          </p>

          {/* stat pills */}
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,marginBottom:0}}>
            {[
              {emoji:'🏭', label:'8 industries covered'},
              {emoji:'🤖', label:'One AI brain, all channels'},
              {emoji:'⚡', label:'Deploy in under 24 hours'},
              {emoji:'📊', label:'Real-time lead dashboard'},
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

        {/* ── INDUSTRY TICKER ── */}
        <IndustryTicker industries={industries}/>

        {/* ── CASE CARDS GRID ── */}
        <div className="cases-grid" style={{marginBottom:72}}>
          {industries.map((item, idx) => (
            <CaseCard key={idx} index={idx} {...item}/>
          ))}
        </div>

        {/* ── PERFORMANCE SECTION ── */}
        <section style={{
          background:`linear-gradient(135deg,rgba(79,70,229,.1),rgba(124,58,237,.06),rgba(15,12,30,.96))`,
          border:`1px solid ${T.border}`,
          borderRadius:24,
          padding:'clamp(32px,5vw,64px)',
          marginBottom:72,
          position:'relative', overflow:'hidden',
        }}>
          <div style={{position:'absolute',top:0,right:0,width:'40%',height:'100%',background:'radial-gradient(ellipse at top right,rgba(124,58,237,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>

          <div className="perf-grid" style={{position:'relative',zIndex:1}}>
            {/* left: copy */}
            <div>
              <div style={{
                display:'inline-flex',alignItems:'center',gap:7,
                background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
                borderRadius:30,padding:'5px 14px',marginBottom:20,
              }}>
                <span style={{color:T.purpleL,fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>Performance</span>
              </div>

              <h2 style={{
                fontSize:'clamp(26px,4vw,44px)',
                fontWeight:900, color:T.t1,
                lineHeight:1.1, letterSpacing:-1, marginBottom:18,
              }}>
                Optimised for{' '}
                <span style={{
                  backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                }}>Conversion.</span>
              </h2>

              <p style={{color:T.t2,fontSize:14.5,lineHeight:1.75,marginBottom:28,maxWidth:420}}>
                Every bot deployment is engineered for maximum conversion — answering at sub-second speed, capturing leads with zero friction, and routing hot prospects to your team before they bounce.
              </p>

              {/* stat grid */}
              <div className="perf-stats" style={{marginBottom:28}}>
                {[
                  { val:'99.9%', label:'Uptime Guarantee',    accent:'#22c55e' },
                  { val:'<1s',   label:'Response Latency',    accent:'#3b82f6' },
                  { val:'3×',    label:'More Leads Captured', accent:'#a78bfa' },
                  { val:'0%',    label:'Messages Missed',     accent:'#f97316' },
                ].map(({val,label,accent}) => (
                  <div key={label} style={{
                    background:'rgba(255,255,255,.03)',
                    border:`1px solid ${T.border}`,
                    borderRadius:14,padding:'18px 16px',
                    transition:'border-color .2s',
                  }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=accent+'55'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
                  >
                    <div style={{
                      fontSize:'clamp(22px,3vw,30px)',
                      fontWeight:900, letterSpacing:-1,
                      marginBottom:5,
                      backgroundImage:`linear-gradient(135deg,${accent},${accent}bb)`,
                      WebkitBackgroundClip:'text',
                      WebkitTextFillColor:'transparent',
                    }}>{val}</div>
                    <div style={{fontSize:10,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase'}}>{label}</div>
                  </div>
                ))}
              </div>

              {/* bullet points */}
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {[
                  'Every interaction costs exactly 5 tokens — flat, predictable billing',
                  'GPU-powered responses served from India-hosted nodes',
                  'Official Meta API — no grey-area tools, no ban risk',
                ].map(t => (
                  <div key={t} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                      stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                      style={{marginTop:2,flexShrink:0}}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span style={{color:T.t2,fontSize:13,lineHeight:1.65}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right: live mockup */}
            <ChannelMockup/>
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
              background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
              borderRadius:30,padding:'6px 14px',marginBottom:22,
            }}>
              <IcoRocket size={12} stroke={T.purpleL} sw={2.2}/>
              <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}>Start your deployment</span>
            </div>

            <h2 style={{
              fontSize:'clamp(28px,4.5vw,52px)',
              fontWeight:900,color:T.t1,
              letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,
            }}>
              Your Industry.{' '}
              <span style={{
                backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                backgroundSize:'200%',animation:'shim 5s linear infinite',
              }}>Automated.</span>
            </h2>

            <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:460,margin:'0 auto 36px'}}>
              No matter what business you run, MyAutoBot slots in within 24 hours — trained on your data, speaking your language, capturing your leads around the clock.
            </p>

            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12,marginBottom:26}}>
              <Link
                to="/login?id=register"
                onMouseEnter={()=>setHovCta(true)}
                onMouseLeave={()=>setHovCta(false)}
                style={{
                  display:'flex',alignItems:'center',gap:9,
                  padding:'15px 34px',borderRadius:12,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color:'white',fontWeight:700,fontSize:15,
                  fontFamily:T.font,textDecoration:'none',
                  boxShadow: hovCta ? '0 8px 28px rgba(79,70,229,.6)' : '0 4px 18px rgba(79,70,229,.42)',
                  transform: hovCta ? 'translateY(-2px)' : 'translateY(0)',
                  transition:'all .2s',
                }}
              >
                Start Your Deployment
                <IcoRocket size={16} stroke="white" sw={2}/>
              </Link>
            </div>

            <p style={{color:T.t3,fontSize:11,fontWeight:700,letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono}}>
              Powered by Avenirya Solutions · Official Meta Tech Provider
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UseCases;