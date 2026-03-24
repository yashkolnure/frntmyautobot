import React, { useState, useEffect, useRef } from 'react';

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
    html{scroll-behavior:smooth;}
    body{font-family:${T.font};}
    @keyframes fd   {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bk   {0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
    @keyframes pl   {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes shim {0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes glow {0%,100%{opacity:.6}50%{opacity:1}}
    @keyframes spin {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    a{color:inherit;text-decoration:none;}
    button{font-family:${T.font};}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:${T.bg1};}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
    
    /* ── RESPONSIVE HELPERS ── */
    .hero-grid    {display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
    .stats-grid   {display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
    .problem-grid {display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;}
    .how-grid     {display:grid;grid-template-columns:repeat(3,1fr);gap:22px;position:relative;}
    .feat-grid    {display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
    .use-grid     {display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
    .roles-grid   {display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
    .nav-links    {display:flex;gap:32px;align-items:center;}
    .nav-cta-bar  {display:flex;gap:10px;align-items:center;}

    @media(max-width:1024px){
      .hero-grid    {grid-template-columns:1fr;}
      .stats-grid   {grid-template-columns:repeat(2,1fr);}
      .problem-grid {grid-template-columns:1fr;}
      .how-grid     {grid-template-columns:1fr;}
      .feat-grid    {grid-template-columns:repeat(2,1fr);}
      .use-grid     {grid-template-columns:repeat(2,1fr);}
      .roles-grid   {grid-template-columns:repeat(2,1fr);}
    }
    @media(max-width:640px){
      .stats-grid  {grid-template-columns:repeat(2,1fr);}
      .feat-grid   {grid-template-columns:1fr;}
      .use-grid    {grid-template-columns:1fr;}
      .roles-grid  {grid-template-columns:1fr;}
      .nav-links   {display:none;}
      .nav-cta-bar {gap:6px;}
      .hero-btns   {flex-direction:column;align-items:stretch;}
      .cta-btns    {flex-direction:column;align-items:stretch;}
      .hero-trust  {flex-direction:column;gap:10px;}
      .cta-trust   {flex-direction:column;gap:10px;}
      .demo-tabs   {gap:5px;}
    }
    @media(max-width:480px){
      .stats-grid  {grid-template-columns:repeat(2,1fr);}
    }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({d,size=20,stroke='currentColor',fill='none',sw=1.8,style={}}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoCheck = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;
const IcoX     = p => <Ico {...p} d="M18 6L6 18M6 6l12 12"/>;
const IcoArrow = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoChevD = p => <Ico {...p} d="M6 9l6 6 6-6"/>;
const IcoChevU = p => <Ico {...p} d="M18 15l-6-6-6 6"/>;
const IcoMenu  = p => <Ico {...p} d="M4 6h16M4 12h16M4 18h16"/>;

// ─── WHATSAPP DEMO ───────────────────────────────────────────────────
const WADemo = ({ active }) => {
  const [step, setStep] = useState(0);
  const msgs = [
    {u:1, t:"Hi! Is your restaurant open tomorrow for dinner?"},
    {u:0, t:"Hey! 👋 Yes, we're open 6PM–11PM tomorrow. Want to make a reservation?"},
    {u:1, t:"Yes please! Table for 4 at 8pm"},
    {u:0, t:"Perfect! Could I get your name and phone number to confirm?"},
    {u:1, t:"Priya Sharma, +91 98765 43210"},
    {u:0, t:"✅ Confirmed! Table for 4, Saturday 8PM under Priya Sharma. See you then! 🍽️"},
  ];
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const id = setInterval(() => setStep(s => Math.min(s+1, msgs.length)), 1300);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:'#0a1520',fontFamily:T.font}}>
      <div style={{background:'#1a2c38',padding:'12px 16px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
        <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#25d366,#128c7e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🍽️</div>
        <div>
          <div style={{color:'#e9edef',fontWeight:600,fontSize:13}}>Bella Vista Restaurant</div>
          <div style={{color:'#25d366',fontSize:11,display:'flex',alignItems:'center',gap:5}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#25d366',display:'inline-block'}}/>Online · Replies instantly
          </div>
        </div>
        <div style={{marginLeft:'auto',color:'#8696a0',display:'flex',gap:14,fontSize:17}}>📞 ⋮</div>
      </div>
      <div style={{flex:1,padding:'14px 12px',display:'flex',flexDirection:'column',gap:8,background:'#0a1520',overflowY:'auto'}}>
        <div style={{textAlign:'center',margin:'4px 0'}}>
          <span style={{background:'rgba(255,255,255,0.06)',color:'#8696a0',fontSize:10,padding:'3px 10px',borderRadius:6,fontWeight:500}}>TODAY</span>
        </div>
        {msgs.slice(0,step).map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.u?'flex-end':'flex-start',animation:'fd .3s ease'}}>
            <div style={{maxWidth:'78%',padding:'8px 12px',borderRadius:m.u?'12px 12px 3px 12px':'12px 12px 12px 3px',background:m.u?'#005c4b':'#1e2d38',color:'#e9edef',fontSize:12.5,lineHeight:1.55}}>
              {m.t}
              <div style={{textAlign:'right',marginTop:3,color:'#8696a0',fontSize:9.5,display:'flex',justifyContent:'flex-end',alignItems:'center',gap:4}}>
                {!m.u&&<span style={{color:'#53bdeb'}}>✓✓</span>}<span>now</span>
              </div>
            </div>
          </div>
        ))}
        {step>0&&step<msgs.length&&(
          <div style={{display:'flex'}}>
            <div style={{background:'#1e2d38',borderRadius:'12px 12px 12px 3px',padding:'10px 14px',display:'flex',gap:4,alignItems:'center'}}>
              {[0,1,2].map(j=><span key={j} style={{width:5,height:5,borderRadius:'50%',background:'#8696a0',display:'inline-block',animation:`bk 1.2s ${j*0.22}s ease-in-out infinite`}}/>)}
            </div>
          </div>
        )}
      </div>
      <div style={{background:'#1a2c38',padding:'10px 12px',display:'flex',gap:8,alignItems:'center',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
        <div style={{flex:1,background:'#2a3d4a',borderRadius:20,padding:'8px 14px',color:'#8696a0',fontSize:12}}>Type a message</div>
        <div style={{width:36,height:36,borderRadius:'50%',background:'#00a884',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>🎤</div>
      </div>
    </div>
  );
};

// ─── INSTAGRAM DEMO ──────────────────────────────────────────────────
const IGDemo = ({ active }) => {
  const [step, setStep] = useState(0);
  const msgs = [
    {u:1, t:"Hi! I saw your post. What's the price for the Jordan 4s?"},
    {u:0, t:"Hey! 👟 Jordan 4 Retro is ₹12,500 with free shipping. Sizes 7–11 in stock!"},
    {u:1, t:"Do you have size 9?"},
    {u:0, t:"Yes! Size 9 available 🙌 Want me to reserve it? Share your name & email."},
    {u:1, t:"Rahul Mehta, rahul@email.com"},
    {u:0, t:"Done! 🎉 Reserved size 9 for Rahul. Payment link sent to your email!"},
  ];
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const id = setInterval(() => setStep(s => Math.min(s+1, msgs.length)), 1300);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:'#000',fontFamily:T.font}}>
      <div style={{padding:'12px 16px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid #1c1c1c'}}>
        <span style={{color:'white',fontSize:20}}>‹</span>
        <div style={{width:34,height:34,borderRadius:'50%',padding:2,background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#bc1888)'}}>
          <div style={{width:'100%',height:'100%',borderRadius:'50%',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>👟</div>
        </div>
        <div>
          <div style={{color:'white',fontWeight:600,fontSize:13}}>kicksstore_official</div>
          <div style={{color:'#a8a8a8',fontSize:11}}>Active now</div>
        </div>
        <div style={{marginLeft:'auto',color:'white',display:'flex',gap:14,fontSize:17}}>📞 📹</div>
      </div>
      <div style={{flex:1,padding:'12px',display:'flex',flexDirection:'column',gap:9,overflowY:'auto',background:'#000'}}>
        <div style={{textAlign:'center',color:'#a8a8a8',fontSize:10,fontWeight:500,marginBottom:4}}>TODAY 2:14 PM</div>
        {msgs.slice(0,step).map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.u?'flex-end':'flex-start',gap:7,alignItems:'flex-end',animation:'fd .3s ease'}}>
            {!m.u&&<div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(45deg,#f09433,#bc1888)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>👟</div>}
            <div style={{maxWidth:'72%',padding:'9px 13px',borderRadius:20,background:m.u?'#3797f0':'#262626',color:'white',fontSize:12.5,lineHeight:1.5}}>{m.t}</div>
          </div>
        ))}
        {step>0&&step<msgs.length&&(
          <div style={{display:'flex',gap:7,alignItems:'flex-end'}}>
            <div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(45deg,#f09433,#bc1888)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>👟</div>
            <div style={{background:'#262626',borderRadius:20,padding:'10px 14px',display:'flex',gap:4}}>
              {[0,1,2].map(j=><span key={j} style={{width:5,height:5,borderRadius:'50%',background:'#a8a8a8',display:'inline-block',animation:`bk 1.2s ${j*0.22}s ease-in-out infinite`}}/>)}
            </div>
          </div>
        )}
      </div>
      <div style={{padding:'10px 12px',borderTop:'1px solid #1c1c1c',background:'#000'}}>
        <div style={{display:'flex',background:'#262626',borderRadius:22,padding:'9px 14px',alignItems:'center',gap:10}}>
          <div style={{width:24,height:24,borderRadius:'50%',background:'#3797f0',flexShrink:0}}/>
          <span style={{color:'#a8a8a8',fontSize:12.5,flex:1}}>Message...</span>
          <span style={{fontSize:15}}>🎤</span><span style={{fontSize:15}}>📷</span>
        </div>
      </div>
    </div>
  );
};

// ─── WEB CHAT DEMO ───────────────────────────────────────────────────
const WebDemo = ({ active }) => {
  const [step, setStep] = useState(0);
  const msgs = [
    {u:1, t:"What's the return policy for enterprise plans?"},
    {u:0, t:"Based on our Enterprise Policy doc: 60-day full refund window. Want me to email you the full terms?"},
    {u:1, t:"Yes please. My email is cto@acme.com"},
    {u:0, t:"Done! ✅ Terms sent to cto@acme.com. I can also schedule a live demo call if you'd like — just say the word!"},
  ];
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const id = setInterval(() => setStep(s => Math.min(s+1, msgs.length)), 1400);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{height:'100%',position:'relative',background:'linear-gradient(160deg,#07051a 0%,#0a0720 60%,#060415 100%)',fontFamily:T.font}}>
      <div style={{padding:'18px 20px',opacity:0.2,pointerEvents:'none',userSelect:'none'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{height:18,width:90,background:'white',borderRadius:4}}/>
          <div style={{display:'flex',gap:12}}>{[55,55,55,70].map((w,i)=><div key={i} style={{height:12,width:w,background:'white',borderRadius:3}}/>)}</div>
        </div>
        <div style={{height:36,width:'60%',background:'white',borderRadius:6,marginBottom:12}}/>
        <div style={{height:15,width:'42%',background:'rgba(255,255,255,.55)',borderRadius:4,marginBottom:28}}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          {[1,2,3].map(i=><div key={i} style={{height:80,background:'rgba(255,255,255,.06)',borderRadius:10,border:'1px solid rgba(255,255,255,.08)'}}/>)}
        </div>
      </div>
      <div style={{position:'absolute',bottom:14,right:14,width:288,background:'#0e0a22',borderRadius:18,boxShadow:'0 20px 60px rgba(0,0,0,.9),0 0 0 1px rgba(99,102,241,.22)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)',padding:'13px 15px',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>🤖</div>
          <div>
            <div style={{color:'white',fontWeight:600,fontSize:13}}>Support AI</div>
            <div style={{color:'rgba(255,255,255,.65)',fontSize:10,display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#4ade80',display:'inline-block',animation:'pl 2s infinite'}}/>
              Replies in seconds
            </div>
          </div>
          <div style={{marginLeft:'auto',color:'rgba(255,255,255,.5)',fontSize:18,cursor:'pointer'}}>×</div>
        </div>
        <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:8,minHeight:205,background:'#08061a',overflowY:'auto'}}>
          {step===0&&(
            <div style={{background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.2)',borderRadius:12,padding:'9px 11px',color:'#a5b4fc',fontSize:12,lineHeight:1.55}}>
              👋 Hi! I'm trained on all your docs. Ask me anything about our products, pricing, or policies!
            </div>
          )}
          {msgs.slice(0,step).map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.u?'flex-end':'flex-start',animation:'fd .3s ease'}}>
              <div style={{maxWidth:'84%',padding:'8px 11px',borderRadius:m.u?'12px 12px 3px 12px':'12px 12px 12px 3px',
                background:m.u?'rgba(255,255,255,.07)':'rgba(79,70,229,.18)',
                border:`1px solid ${m.u?'rgba(255,255,255,.05)':'rgba(99,102,241,.22)'}`,
                color:m.u?'#cbd5e1':'#c4b5fd',fontSize:12,lineHeight:1.55}}>
                {m.t}
              </div>
            </div>
          ))}
          {step>0&&step<msgs.length&&(
            <div style={{display:'flex'}}>
              <div style={{background:'rgba(79,70,229,.18)',border:'1px solid rgba(99,102,241,.22)',borderRadius:'12px 12px 12px 3px',padding:'10px 13px',display:'flex',gap:4}}>
                {[0,1,2].map(j=><span key={j} style={{width:5,height:5,borderRadius:'50%',background:'#a78bfa',display:'inline-block',animation:`bk 1.2s ${j*0.22}s ease-in-out infinite`}}/>)}
              </div>
            </div>
          )}
        </div>
        <div style={{padding:'9px 11px',background:'#0a0820',borderTop:'1px solid rgba(255,255,255,.05)',display:'flex',gap:8}}>
          <div style={{flex:1,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'7px 11px',color:'#475569',fontSize:12}}>Ask anything...</div>
          <div style={{width:30,height:30,borderRadius:9,background:'linear-gradient(135deg,#4f46e5,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:14,cursor:'pointer'}}>↑</div>
        </div>
      </div>
    </div>
  );
};

// ─── LEAD BADGE ───────────────────────────────────────────────────────
const LeadBadge = ({ show, name, email, source, intent }) => (
  <div style={{
    position:'absolute',bottom:14,left:14,
    background:'linear-gradient(135deg,#0a1f12,#061510)',
    border:'1px solid rgba(34,197,94,.3)',borderRadius:14,padding:'11px 13px',
    width:192,boxShadow:'0 8px 28px rgba(0,0,0,.7)',
    opacity:show?1:0,transform:show?'translateY(0) scale(1)':'translateY(14px) scale(.92)',
    transition:'all .5s cubic-bezier(.34,1.56,.64,1)',pointerEvents:'none',
    fontFamily:T.font,
  }}>
    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:T.green,boxShadow:`0 0 7px ${T.green}`,display:'inline-block'}}/>
      <span style={{color:'#4ade80',fontSize:9,fontWeight:700,letterSpacing:.8,textTransform:'uppercase'}}>Lead Captured</span>
    </div>
    <div style={{color:'white',fontWeight:600,fontSize:13,marginBottom:2}}>{name}</div>
    <div style={{color:'#86efac',fontSize:11,marginBottom:7,fontWeight:500}}>{email}</div>
    <div style={{display:'flex',gap:5}}>
      <span style={{background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.2)',color:'#4ade80',fontSize:9,padding:'2px 7px',borderRadius:20,fontWeight:600}}>{source}</span>
      <span style={{background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.2)',color:'#c4b5fd',fontSize:9,padding:'2px 7px',borderRadius:20,fontWeight:600}}>{intent}</span>
    </div>
  </div>
);

// ─── ROLE CARD ────────────────────────────────────────────────────────
const RoleCard = ({ emoji, role, tagline, desc, bullets, accent, index }) => {
  const [hov, setHov] = useState(false);
  const delay = `${index * 0.08}s`;
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: hov
          ? `linear-gradient(160deg,${accent}18,${accent}08,${T.bg3})`
          : T.bg2,
        border:`1px solid ${hov ? accent+'55' : T.border}`,
        borderRadius:20,
        padding:'28px 24px',
        transition:'all .3s cubic-bezier(.34,1.2,.64,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? `0 20px 40px ${accent}22` : 'none',
        position:'relative',
        overflow:'hidden',
        animation:`slideUp .5s ${delay} both`,
      }}
    >
      {/* BG glow */}
      <div style={{
        position:'absolute',top:-30,right:-30,width:120,height:120,
        background:`radial-gradient(circle,${accent}22 0%,transparent 70%)`,
        pointerEvents:'none',transition:'opacity .3s',opacity:hov?1:0,
      }}/>
      <div style={{position:'relative',zIndex:1}}>
        <div style={{
          width:52,height:52,borderRadius:16,
          background:`linear-gradient(135deg,${accent}22,${accent}0a)`,
          border:`1px solid ${accent}33`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:24,marginBottom:18,
          transition:'transform .3s',
          transform:hov?'scale(1.1) rotate(-4deg)':'scale(1) rotate(0deg)',
        }}>{emoji}</div>

        <div style={{
          display:'inline-block',
          background:`${accent}18`,border:`1px solid ${accent}33`,
          borderRadius:20,padding:'3px 10px',
          color:accent,fontSize:10,fontWeight:700,letterSpacing:.8,
          textTransform:'uppercase',marginBottom:12,
        }}>{role}</div>

        <h3 style={{
          color:T.t1,fontWeight:800,fontSize:18,
          marginBottom:10,lineHeight:1.25,letterSpacing:-.3,
        }}>{tagline}</h3>

        <p style={{color:T.t2,fontSize:13.5,lineHeight:1.7,marginBottom:18}}>{desc}</p>

        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {bullets.map((b,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9}}>
              <div style={{
                width:16,height:16,borderRadius:'50%',
                background:`${accent}22`,border:`1px solid ${accent}44`,
                display:'flex',alignItems:'center',justifyContent:'center',
                flexShrink:0,marginTop:1,
              }}>
                <IcoCheck size={9} stroke={accent} sw={3}/>
              </div>
              <span style={{color:T.t2,fontSize:13,lineHeight:1.55}}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [platform, setPlatform] = useState(0);
  const [paused,   setPaused]   = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [faq,      setFaq]      = useState(null);
  const [hov,      setHov]      = useState({});
  const [mobileNav,setMobileNav]= useState(false);
  const [activeRole,setActiveRole]=useState(null);

  const on  = k => () => setHov(v=>({...v,[k]:true}));
  const off = k => () => setHov(v=>({...v,[k]:false}));

  const platforms = [
    {label:'Website',   emoji:'🌐',color:'#4f46e5', lead:{name:'CTO @ Acme',   email:'cto@acme.com',     source:'Website',   intent:'Enterprise'}},
    {label:'WhatsApp',  emoji:'💬',color:'#16a34a', lead:{name:'Priya Sharma', email:'+91 98765 43210',  source:'WhatsApp',  intent:'Reservation'}},
    {label:'Instagram', emoji:'📸',color:'#db2777', lead:{name:'Rahul Mehta',  email:'rahul@email.com',  source:'Instagram', intent:'Purchase'}},
  ];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => { setPlatform(p=>(p+1)%3); setShowLead(false); }, 7500);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    setShowLead(false);
    const id = setTimeout(() => setShowLead(true), 5300);
    return () => clearTimeout(id);
  }, [platform]);

  const cardStyle = (k) => ({
    background: hov[k] ? T.bg3 : T.bg2,
    border: `1px solid ${hov[k] ? T.borderH : T.border}`,
    borderRadius: 18,
    padding: '26px 24px',
    transition: 'all .25s ease',
    transform: hov[k] ? 'translateY(-4px)' : 'translateY(0)',
  });

  const roles = [
    {
      emoji:'💼', role:'Sales Representative', accent:'#6366f1',
      tagline:'Close Deals Around the Clock',
      desc:'MyAutoBot acts as your always-on sales rep — qualifying prospects, answering objections, sharing pricing, and nudging customers toward a decision, all without any human involvement.',
      bullets:[
        'Instantly pitches products based on customer questions',
        'Handles price objections with smart, on-brand responses',
        'Captures deal intent and budget before human handoff',
        'Sends follow-up reminders automatically after conversations',
      ]
    },
    {
      emoji:'🎧', role:'Customer Support Agent', accent:'#3b82f6',
      tagline:'Zero Wait Times, Zero Frustration',
      desc:'Deliver world-class support without hiring a team. MyAutoBot resolves the top 80% of customer queries instantly — returns, shipping, order status, account issues — so your team only handles what truly needs a human.',
      bullets:[
        'Resolves FAQs, returns & refunds in seconds',
        'Tracks order status and shares live shipping updates',
        'Escalates complex issues to humans with full context',
        'Maintains consistent, empathetic tone on every channel',
      ]
    },
    {
      emoji:'🛠️', role:'Technical Assistant', accent:'#8b5cf6',
      tagline:'Expert Help Without the Wait',
      desc:'Trained on your product documentation, changelogs, and troubleshooting guides, the bot becomes a technical expert — walking users through setup, debugging issues, and explaining features with precision.',
      bullets:[
        'Walks users through step-by-step troubleshooting flows',
        'Explains technical concepts in plain, clear language',
        'References your actual docs to give accurate answers',
        'Reduces tier-1 support tickets by up to 70%',
      ]
    },
    {
      emoji:'🚀', role:'Onboarding Assistant', accent:'#06b6d4',
      tagline:'Turn New Users into Power Users',
      desc:"First impressions make or break retention. MyAutoBot guides every new user through your product's core value in a conversational, personalised way — without making them read a single manual.",
      bullets:[
        'Sends personalised welcome flows based on user type',
        'Proactively shares tips when users seem stuck',
        'Answers setup questions at exactly the right moment',
        'Tracks onboarding progress and nudges completion',
      ]
    },
    {
      emoji:'🎯', role:'Lead Generator', accent:'#22c55e',
      tagline:'Every Conversation is a Pipeline',
      desc:'Stop letting warm traffic leave without a trace. MyAutoBot turns every casual enquiry into a structured, qualified lead — capturing name, contact, intent, budget, and timeline automatically, 24/7.',
      bullets:[
        'Qualifies leads by budget, timeline, and intent',
        'Captures contact info naturally mid-conversation',
        'Syncs every lead to your CRM or dashboard instantly',
        'Scores lead quality so your sales team prioritises right',
      ]
    },
    {
      emoji:'📣', role:'Brand Ambassador', accent:'#f59e0b',
      tagline:'Consistent, On-Brand, Always',
      desc:"Your brand voice is hard to maintain at scale. MyAutoBot is trained on your tone, values, and messaging — so every single reply feels like it came from your best employee, not a generic chatbot.",
      bullets:[
        'Stays on-brand with your tone, language, and style',
        'Promotes offers and launches at the perfect moment',
        'Handles negative feedback gracefully and professionally',
        'Creates a memorable experience that drives word-of-mouth',
      ]
    },
  ];

  const faqs = [
    {q:"Is it hard to set up?",              a:"Not at all. Our team handles the entire setup process. You provide your FAQs, menu, pricing, and policies — we do the rest. Most businesses go live within 24 hours of signing up. No technical knowledge required."},
    {q:"Does it work on WhatsApp?",          a:"Yes, fully supported via the official Meta Business API. We handle the verification process, API keys, and compliance requirements on your behalf. All you need is a WhatsApp Business number."},
    {q:"Can I see and export my leads?",     a:"Every lead appears in your real-time dashboard with full conversation context, timestamps, and intent signals. Export to CSV anytime, or sync automatically to popular CRMs like HubSpot, Salesforce, or Zoho."},
    {q:"What if the bot can't answer?",      a:"It gracefully hands off to a human agent — passing along the full conversation history so your team has complete context. No dead ends, no frustrated customers. You can also set custom escalation triggers for specific keywords."},
    {q:"Can I cancel anytime?",              a:"Yes. No long-term contracts, no cancellation fees. Pause or cancel at any time from your dashboard. Your data is always exportable in standard formats whenever you need it."},
    {q:"How does it learn my business?",     a:"You upload your documents — FAQs, menus, product catalogs, pricing sheets, policies — and our AI reads and internalises everything. It then answers based on your actual content, not generic knowledge. Updates take effect within minutes."},
  ];

  return (
    <div style={{minHeight:'100vh',background:T.bg1,color:T.t2,fontFamily:T.font,overflowX:'hidden'}}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'-5%',width:'48vw',height:'52vh',background:'radial-gradient(circle,rgba(79,70,229,.13) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'35%',right:'-8%',width:'40vw',height:'44vh',background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-5%',left:'10%',width:'42vw',height:'40vh',background:'radial-gradient(circle,rgba(124,58,237,.09) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1}}>

        <style>{`@media(max-width:640px){.mobile-menu-btn{display:flex!important;}}`}</style>

        {/* MOBILE NAV DRAWER */}
        {mobileNav && (
          <div style={{position:'fixed',top:64,left:0,right:0,zIndex:99,background:T.bg2,borderBottom:`1px solid ${T.border}`,padding:'16px 24px',display:'flex',flexDirection:'column',gap:14}}>
            {['Features','How It Works','Use Cases','Pricing','FAQ'].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} onClick={()=>setMobileNav(false)} style={{color:T.t1,fontSize:15,fontWeight:600}}>{l}</a>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        <section style={{padding:'126px 24px 64px',maxWidth:1280,margin:'0 auto'}}>
          <div className="hero-grid">
            {/* LEFT */}
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(79,70,229,.1)',border:'1px solid rgba(99,102,241,.28)',borderRadius:30,padding:'6px 14px',marginBottom:26}}>
                <span style={{color:T.purpleL,fontSize:14}}>✦</span>
                <span style={{color:T.purpleL,fontSize:13,fontWeight:600}}>AI-powered lead capture · 24/7</span>
              </div>
              <h1 style={{fontSize:'clamp(36px,5.5vw,58px)',fontWeight:900,lineHeight:1.06,color:T.t1,marginBottom:22,letterSpacing:-2}}>
                Your AI Sales Rep.<br/>
                <span style={{backgroundImage:'linear-gradient(135deg,#a78bfa,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundSize:'200%',animation:'shim 5s linear infinite'}}>Never Misses a Lead.</span>
              </h1>
              <p style={{fontSize:'clamp(15px,2vw,17px)',color:T.t2,lineHeight:1.8,marginBottom:36,maxWidth:480}}>
                Train it once on your FAQs, menus, and policies. It instantly replies to every customer on{' '}
                <strong style={{color:T.t1,fontWeight:600}}>WhatsApp, Instagram, and your Website</strong> — capturing name, email, and intent automatically. No code. No delays. No missed opportunities.
              </p>
              <div className="hero-btns" style={{display:'flex',gap:12,marginBottom:28,flexWrap:'wrap'}}>
                <button
                  style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'white',border:'none',padding:'15px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:9,boxShadow:'0 6px 26px rgba(79,70,229,.42)',transition:'all .2s',transform:hov.h1?'translateY(-2px)':'translateY(0)',fontFamily:T.font}}
                  onMouseEnter={on('h1')} onMouseLeave={off('h1')}>
                  Get Started Free <IcoArrow size={17}/>
                </button>
                <button
                  style={{background:hov.h2?'rgba(255,255,255,.08)':'rgba(255,255,255,.04)',color:T.t1,border:`1px solid ${hov.h2?T.borderH:T.border}`,padding:'15px 32px',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:9,transition:'all .2s',fontFamily:T.font}}
                  onMouseEnter={on('h2')} onMouseLeave={off('h2')}>
                  ▶ See it in action
                </button>
              </div>
              <div className="hero-trust" style={{display:'flex',gap:22,flexWrap:'wrap'}}>
                {['No credit card required','Live in 24 hours','Cancel anytime'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:6,color:T.t3,fontSize:13}}>
                    <IcoCheck size={13} stroke={T.green} sw={2.5}/> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — DEMO */}
            <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
              <div className="demo-tabs" style={{display:'flex',gap:8,marginBottom:14,justifyContent:'center',flexWrap:'wrap'}}>
                {platforms.map((p,i)=>(
                  <button key={i} onClick={()=>{setPlatform(i);setShowLead(false);}} style={{
                    padding:'7px 16px',borderRadius:30,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,
                    display:'flex',alignItems:'center',gap:6,transition:'all .22s',fontFamily:T.font,
                    background:platform===i?p.color:'rgba(255,255,255,.05)',
                    color:platform===i?'white':T.t3,
                    boxShadow:platform===i?`0 4px 18px ${p.color}55`:'none',
                    transform:platform===i?'scale(1.04)':'scale(1)',
                  }}>
                    <span>{p.emoji}</span>{p.label}
                  </button>
                ))}
              </div>
              <div style={{position:'relative',borderRadius:22,overflow:'hidden',boxShadow:`0 40px 80px rgba(0,0,0,.75),0 0 0 1px ${T.border}`,height:510}}>
                <div style={{position:'absolute',inset:0,opacity:platform===0?1:0,transition:'opacity .45s',pointerEvents:platform===0?'auto':'none'}}>
                  <WebDemo active={platform===0}/>
                </div>
                <div style={{position:'absolute',inset:0,opacity:platform===1?1:0,transition:'opacity .45s',pointerEvents:platform===1?'auto':'none'}}>
                  <WADemo active={platform===1}/>
                </div>
                <div style={{position:'absolute',inset:0,opacity:platform===2?1:0,transition:'opacity .45s',pointerEvents:platform===2?'auto':'none'}}>
                  <IGDemo active={platform===2}/>
                </div>
                <LeadBadge show={showLead} {...platforms[platform].lead}/>
              </div>
              <div style={{textAlign:'center',marginTop:12,color:T.green,fontSize:12,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:T.green,display:'inline-block',animation:'pl 2s infinite'}}/>
                Live Demo —  conversations & real lead capture
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div style={{borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:'44px 24px',background:'rgba(255,255,255,.015)'}}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <div className="stats-grid">
              {[
                ['<1s','Average response time','across all channels'],
                ['24/7','Always available','no holidays, no sick days'],
                ['3×','More leads captured','vs. manual replies'],
                ['0%','Messages missed','ever, on any platform'],
              ].map(([n,l,sub],i)=>(
                <div key={i} style={{textAlign:'center',padding:'8px 0'}}>
                  <div style={{fontSize:'clamp(36px,5vw,50px)',fontWeight:900,letterSpacing:-1.5,marginBottom:4,backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{n}</div>
                  <div style={{color:T.t2,fontSize:14,fontWeight:600,marginBottom:3}}>{l}</div>
                  <div style={{color:T.t3,fontSize:12}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROLES SECTION (NEW) ── */}
        <section id="features" style={{padding:'96px 24px',maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(79,70,229,.1)',border:'1px solid rgba(99,102,241,.28)',borderRadius:30,padding:'6px 14px',marginBottom:20}}>
              <span style={{color:T.purpleL,fontSize:13}}>✦</span>
              <span style={{color:T.purpleL,fontSize:13,fontWeight:600}}>One AI. Six roles. Infinite conversations.</span>
            </div>
            <h2 style={{fontSize:'clamp(30px,4.5vw,48px)',fontWeight:900,color:T.t1,letterSpacing:-.8,lineHeight:1.1,marginBottom:18}}>
              What Can MyAutoBot <span style={{backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Actually Do?</span>
            </h2>
            <p style={{color:T.t2,fontSize:'clamp(15px,2vw,17px)',maxWidth:580,margin:'0 auto',lineHeight:1.75}}>
              Most chatbots can only handle FAQs. MyAutoBot is a full business intelligence layer — trained on your data, adapting to every customer's context, and performing six high-value roles simultaneously across every channel you use.
            </p>
          </div>

          <div className="roles-grid">
            {roles.map((r,i)=>(
              <RoleCard key={i} index={i} {...r}/>
            ))}
          </div>

          {/* Role comparison callout */}
          <div style={{
            marginTop:40,
            background:'linear-gradient(135deg,rgba(99,102,241,.08),rgba(59,130,246,.05))',
            border:`1px solid ${T.border}`,borderRadius:20,padding:'28px 32px',
            display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:20,
          }}>
            <div>
              <div style={{color:T.t1,fontWeight:700,fontSize:18,marginBottom:6}}>💡 One bot. The cost of none of these hires.</div>
              <div style={{color:T.t2,fontSize:14,lineHeight:1.65,maxWidth:520}}>
                Hiring a sales rep, support agent, and onboarding specialist would cost ₹12–25 lakh/year in salaries alone — and they still can't work 24/7. MyAutoBot replaces all of it for a fraction of the price, with zero sick days.
              </div>
            </div>
            <button style={{
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'white',border:'none',
              padding:'14px 28px',borderRadius:11,fontSize:14,fontWeight:700,cursor:'pointer',
              boxShadow:'0 4px 18px rgba(79,70,229,.4)',flexShrink:0,fontFamily:T.font,
              display:'flex',alignItems:'center',gap:8,
            }}>
              See Pricing <IcoArrow size={15}/>
            </button>
          </div>
        </section>

        {/* ── PROBLEM / SOLUTION ── */}
        <section style={{padding:'80px 24px',maxWidth:1120,margin:'0 auto'}}>
          <div className="problem-grid">
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:T.red,textTransform:'uppercase',marginBottom:14}}>❌  Without MyAutoBot</div>
              <h2 style={{fontSize:'clamp(26px,3.5vw,34px)',fontWeight:800,color:T.t1,marginBottom:24,lineHeight:1.2,letterSpacing:-.5}}>Leads Slip Through Every Day</h2>
              {[
                ["Customers message, you reply hours later — they've moved on","Studies show 78% of customers buy from the first business that responds. Slow replies are costing you real money."],
                ["Lead details scattered across DMs with no single truth","Your team digs through Instagram, WhatsApp, and email threads to find a phone number. Hours wasted, leads forgotten."],
                ["Staff go offline — enquiries pile up overnight, unread","Every evening brings a backlog of unanswered messages from potential customers who gave up and went elsewhere."],
                ["No data on what customers ask — no way to improve","You can't see patterns, can't train staff on real objections, can't improve what you can't measure."],
              ].map(([t,sub],i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,background:'rgba(239,68,68,.05)',border:'1px solid rgba(239,68,68,.14)',padding:'13px 16px',borderRadius:12,marginBottom:10}}>
                  <IcoX size={16} stroke={T.red} sw={2.2} style={{flexShrink:0,marginTop:2}}/>
                  <div>
                    <div style={{color:'#fca5a5',fontSize:13.5,fontWeight:600,lineHeight:1.5,marginBottom:4}}>{t}</div>
                    <div style={{color:'#f87171',fontSize:12,lineHeight:1.6,opacity:.75}}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:T.green,textTransform:'uppercase',marginBottom:14}}>✅  With MyAutoBot</div>
              <h2 style={{fontSize:'clamp(26px,3.5vw,34px)',fontWeight:800,color:T.t1,marginBottom:24,lineHeight:1.2,letterSpacing:-.5}}>Every Chat Becomes a Lead</h2>
              {[
                ["Instant AI reply under 1 second — every time, day or night","Customers get an intelligent, on-brand response immediately. You're always the first to reply, every single time."],
                ["Name, phone, email auto-captured and synced to your dashboard","Every conversation ends with a structured lead record in your CRM. No manual data entry. No missed contacts."],
                ["Bot works 24/7 — earns while you sleep","Bank holidays, weekends, 3am messages — they all get answered. Your business never goes offline again."],
                ["Analytics show top questions, conversion rates, and drop-offs","See exactly what customers ask, where they drop off, and what drives conversions. Data to improve everything."],
              ].map(([t,sub],i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,background:'rgba(34,197,94,.05)',border:'1px solid rgba(34,197,94,.14)',padding:'13px 16px',borderRadius:12,marginBottom:10}}>
                  <IcoCheck size={16} stroke={T.green} sw={2.2} style={{flexShrink:0,marginTop:2}}/>
                  <div>
                    <div style={{color:'#86efac',fontSize:13.5,fontWeight:600,lineHeight:1.5,marginBottom:4}}>{t}</div>
                    <div style={{color:'#4ade80',fontSize:12,lineHeight:1.6,opacity:.75}}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{padding:'88px 24px',maxWidth:1120,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:T.purpleL,textTransform:'uppercase',marginBottom:12}}>Simple 3-Step Process</div>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,color:T.t1,letterSpacing:-.8,lineHeight:1.1,marginBottom:14}}>Up and Running in 24 Hours</h2>
            <p style={{color:T.t2,fontSize:15,maxWidth:440,margin:'0 auto',lineHeight:1.7}}>No developers, no complex integrations. We handle everything so you can focus on growing your business.</p>
          </div>
          <div className="how-grid">
            <div style={{position:'absolute',display:'none'}}/>
            {[
              {step:'01',emoji:'📄',title:'Upload Your Docs',   col:'#4f46e5',
                desc:'Share your FAQs, product catalog, pricing, and policies. This takes about 10 minutes.',
                sub:'Supports PDFs, Google Docs, Word files, URLs, and even WhatsApp chat exports.'},
              {step:'02',emoji:'🤖',title:'AI Learns Instantly', col:'#7c3aed',
                desc:'Our AI reads everything and becomes a true expert on your business within minutes.',
                sub:'It learns tone, terminology, policies, edge cases — and updates instantly when you change a document.'},
              {step:'03',emoji:'💰',title:'Leads Pour In',       col:'#3b82f6',
                desc:'Deploy to WhatsApp, Instagram & your website. Watch leads get captured automatically.',
                sub:'Your dashboard shows every conversation, every lead, and every conversion in real time.'},
            ].map((s,i)=>(
              <div key={i} style={{...cardStyle(`s${i}`),position:'relative',textAlign:'center'}}
                onMouseEnter={on(`s${i}`)} onMouseLeave={off(`s${i}`)}>
                <div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',background:`linear-gradient(135deg,${s.col},${s.col}bb)`,color:'white',fontSize:11,fontWeight:700,padding:'3px 13px',borderRadius:20}}>{s.step}</div>
                <div style={{fontSize:38,marginBottom:16,marginTop:10,animation:'floatY 4s ease-in-out infinite'}}>{s.emoji}</div>
                <h3 style={{color:T.t1,fontWeight:700,fontSize:18,marginBottom:10,letterSpacing:-.2}}>{s.title}</h3>
                <p style={{color:T.t2,fontSize:14,lineHeight:1.65,marginBottom:10}}>{s.desc}</p>
                <p style={{color:T.t3,fontSize:12.5,lineHeight:1.65}}>{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURE GRID ── */}
        <section style={{padding:'80px 24px',maxWidth:1120,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,color:T.t1,letterSpacing:-.8,marginBottom:12}}>Everything You Need</h2>
            <p style={{color:T.t3,fontSize:16,marginTop:12,lineHeight:1.6}}>Built for businesses that don't have time to babysit a chatbot — or hire a full customer service team.</p>
          </div>
          <div className="feat-grid">
            {[
              {emoji:'⚡',title:'Instant Replies',     desc:'Sub-second AI responses on every platform, 24 hours a day, 365 days a year. Your customers never wait, never bounce.'},
              {emoji:'🎯',title:'Auto Lead Capture',   desc:'Collects name, email, phone, and buying intent naturally during the conversation — no forms, no friction, no drop-off.'},
              {emoji:'📊',title:'Live Dashboard',      desc:'Every lead, conversation, and conversion metric in one clean, real-time view. Know exactly what your customers are asking.'},
              {emoji:'💬',title:'3 Channels, 1 Brain', desc:'WhatsApp, Instagram DMs, and website chat all powered by one AI — so your customers get the same great experience everywhere.'},
              {emoji:'🧠',title:'Knows Your Business', desc:'Trained on your exact documents. Gives accurate, on-brand answers every time. No hallucinations, no guesswork.'},
              {emoji:'🔒',title:'Secure & Private',    desc:'Enterprise-grade encryption at rest and in transit. Your customer data stays yours — never sold, never shared, always compliant.'},
            ].map((f,i)=>(
              <div key={i} style={cardStyle(`f${i}`)} onMouseEnter={on(`f${i}`)} onMouseLeave={off(`f${i}`)}>
                <div style={{fontSize:30,marginBottom:14}}>{f.emoji}</div>
                <h3 style={{color:T.t1,fontWeight:700,fontSize:16,marginBottom:9,letterSpacing:-.1}}>{f.title}</h3>
                <p style={{color:T.t2,fontSize:14,lineHeight:1.68}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section id="use-cases" style={{padding:'80px 24px',maxWidth:1120,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:T.purpleL,textTransform:'uppercase',marginBottom:12}}>Built for Every Business</div>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,color:T.t1,letterSpacing:-.8,marginBottom:14}}>Your Industry, Automated</h2>
            <p style={{color:T.t2,fontSize:15,maxWidth:480,margin:'0 auto',lineHeight:1.7}}>From restaurants to e-commerce brands — MyAutoBot adapts to your business model and speaks your customer's language.</p>
          </div>
          <div className="use-grid">
            {[
              {emoji:'🍽️',type:'Restaurants',   col:'#f59e0b',desc:'Takes bookings, sends menus, answers availability questions, handles dietary queries, and follows up with post-visit reviews — all automatically.',eg:'"Table for 4 at 8?" → Booked & confirmed instantly'},
              {emoji:'🛍️',type:'Online Brands',  col:'#ec4899',desc:'Turns Instagram & WhatsApp enquiries into a complete checkout flow. Stock checks, size availability, order tracking — without any manual effort.',eg:'"Size 9 in stock?" → Reserved + payment link sent'},
              {emoji:'🔧',type:'Service Biz',    col:'#14b8a6',desc:'Qualifies inbound leads, books consultations, and captures job requirements without a single manual call. Works for plumbers, cleaners, designers — any service.',eg:'"Need AC repair" → Slot booked, address captured'},
              {emoji:'💼',type:'Agencies',       col:'#8b5cf6',desc:'Pre-qualifies inbound leads before you spend a minute on a call. Captures budget, timeline, scope, and contact — so only ready-to-buy clients reach your team.',eg:'"Need a website" → Budget, timeline, contact captured'},
            ].map((u,i)=>(
              <div key={i} style={cardStyle(`u${i}`)} onMouseEnter={on(`u${i}`)} onMouseLeave={off(`u${i}`)}>
                <div style={{width:48,height:48,borderRadius:14,background:`${u.col}18`,border:`1px solid ${u.col}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,marginBottom:14}}>{u.emoji}</div>
                <h3 style={{color:T.t1,fontWeight:700,fontSize:16,marginBottom:9,letterSpacing:-.1}}>{u.type}</h3>
                <p style={{color:T.t2,fontSize:13.5,lineHeight:1.68,marginBottom:16}}>{u.desc}</p>
                <div style={{background:'rgba(99,102,241,.07)',border:'1px solid rgba(99,102,241,.14)',borderRadius:10,padding:'9px 11px',fontSize:12,color:T.purpleL,fontStyle:'italic',lineHeight:1.55}}>{u.eg}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{padding:'80px 24px',maxWidth:1120,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 style={{fontSize:'clamp(26px,3.5vw,40px)',fontWeight:900,color:T.t1,letterSpacing:-.6,marginBottom:14}}>Loved by Business Owners</h2>
            <p style={{color:T.t2,fontSize:15,lineHeight:1.7}}>Real results from real businesses that stopped missing leads.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
            {[
              {quote:"MyAutoBot completely changed how we handle WhatsApp enquiries. We now get customer details automatically — without chasing anyone. It paid for itself in the first week.",name:'Sarah Jenkins',role:'Owner, Apex Realty Group',init:'SJ',grad:'#4f46e5,#3b82f6'},
              {quote:"I was sceptical at first, but within 72 hours of going live, we had 14 qualified leads — all captured while I was sleeping. The ROI is absurd.",name:'Arjun Kapoor',role:'Founder, FreshBox Delivery',init:'AK',grad:'#7c3aed,#ec4899'},
              {quote:"Our restaurant gets 200+ WhatsApp messages a week. MyAutoBot handles 90% of them — reservations, menu questions, everything. My staff can actually focus on cooking.",name:'Meera Nair',role:'Owner, Spice Route Kitchen',init:'MN',grad:'#0ea5e9,#6366f1'},
            ].map((t,i)=>(
              <div key={i} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:20,padding:'26px 24px'}}>
                <div style={{display:'flex',gap:3,marginBottom:16}}>
                  {[...Array(5)].map((_,j)=><span key={j} style={{color:'#f59e0b',fontSize:15}}>★</span>)}
                </div>
                <p style={{color:T.t1,fontSize:14,lineHeight:1.75,marginBottom:22,fontStyle:'italic'}}>"{t.quote}"</p>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:`linear-gradient(135deg,${t.grad})`,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:14,flexShrink:0}}>{t.init}</div>
                  <div>
                    <div style={{color:T.t1,fontWeight:600,fontSize:14}}>{t.name}</div>
                    <div style={{color:T.t3,fontSize:12}}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{padding:'80px 24px',maxWidth:740,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,color:T.t1,letterSpacing:-.8,marginBottom:14}}>Common Questions</h2>
            <p style={{color:T.t2,fontSize:15,lineHeight:1.7}}>Everything you need to know before getting started.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {faqs.map((f,i)=>(
              <div key={i} style={{border:`1px solid ${faq===i?T.borderH:T.border}`,borderRadius:15,overflow:'hidden',background:faq===i?T.bg3:T.bg2,transition:'all .25s'}}>
                <button onClick={()=>setFaq(faq===i?null:i)} style={{width:'100%',padding:'18px 22px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',gap:14,textAlign:'left',fontFamily:T.font}}>
                  <span style={{fontWeight:600,fontSize:15,color:faq===i?T.purpleL:T.t1}}>{f.q}</span>
                  {faq===i?<IcoChevU size={17} stroke={T.purpleL}/>:<IcoChevD size={17} stroke={T.t3}/>}
                </button>
                <div style={{maxHeight:faq===i?300:0,overflow:'hidden',transition:'max-height .35s ease'}}>
                  <div style={{padding:'0 22px 20px',paddingTop:14,color:T.t2,fontSize:14.5,lineHeight:1.75,borderTop:`1px solid ${T.border}`}}>{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{padding:'60px 24px 100px',maxWidth:1120,margin:'0 auto'}}>
          <div style={{background:'linear-gradient(135deg,rgba(79,70,229,.12),rgba(59,130,246,.07),rgba(124,58,237,.1))',border:'1px solid rgba(99,102,241,.3)',borderRadius:28,padding:'clamp(40px,6vw,80px) clamp(24px,5vw,70px)',textAlign:'center',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'55%',height:'55%',background:'radial-gradient(circle,rgba(79,70,229,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(79,70,229,.1)',border:'1px solid rgba(99,102,241,.28)',borderRadius:30,padding:'6px 14px',marginBottom:24}}>
                <span style={{color:T.purpleL,fontSize:13}}>✦</span>
                <span style={{color:T.purpleL,fontSize:13,fontWeight:600}}>Start capturing leads today</span>
              </div>
              <h2 style={{fontSize:'clamp(30px,5vw,52px)',fontWeight:900,color:T.t1,lineHeight:1.08,marginBottom:20,letterSpacing:-1.5}}>
                Every Chat is a<br/>
                <span style={{backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundSize:'200%',animation:'shim 5s linear infinite'}}>Sales Opportunity.</span>
              </h2>
              <p style={{color:T.t2,fontSize:'clamp(15px,2vw,17px)',marginBottom:40,maxWidth:500,margin:'0 auto 40px',lineHeight:1.75}}>
                Stop losing leads to slow responses. Let MyAutoBot handle every conversation 24/7 — across WhatsApp, Instagram, and your website — while you focus on closing deals and growing your business.
              </p>
              <div className="cta-btns" style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',marginBottom:32}}>
                <button style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'white',border:'none',padding:'17px 42px',borderRadius:13,fontSize:16,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:9,boxShadow:'0 6px 28px rgba(79,70,229,.45)',fontFamily:T.font,transition:'all .2s',transform:hov.cta1?'translateY(-2px)':'translateY(0)'}}
                  onMouseEnter={on('cta1')} onMouseLeave={off('cta1')}>
                  Start Free Trial <IcoArrow size={18}/>
                </button>
                <button style={{background:hov.cta2?'rgba(255,255,255,.08)':'rgba(255,255,255,.04)',color:T.t1,border:`1px solid ${hov.cta2?T.borderH:T.border}`,padding:'17px 42px',borderRadius:13,fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:T.font,transition:'all .2s'}}
                  onMouseEnter={on('cta2')} onMouseLeave={off('cta2')}>
                  Book a Demo
                </button>
              </div>
              <div className="cta-trust" style={{display:'flex',justifyContent:'center',gap:26,flexWrap:'wrap'}}>
                {['Free setup included','7-day free trial','No credit card needed','Live in 24 hours'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:6,color:T.t3,fontSize:13}}>
                    <IcoCheck size={13} stroke={T.green} sw={2.5}/> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}