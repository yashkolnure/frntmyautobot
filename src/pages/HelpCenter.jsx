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
    @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow   {0%,100%{box-shadow:0 0 18px rgba(99,102,241,.25)}50%{box-shadow:0 0 32px rgba(99,102,241,.5)}}

    .cat-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
    .art-list  { display:flex; flex-direction:column; gap:10px; }
    .search-input::placeholder { color:${T.t3}; }
    .search-input:focus { outline:none; border-color:${T.borderH}!important; box-shadow:0 0 0 3px rgba(99,102,241,.14)!important; }
    .article-btn:hover { background:rgba(99,102,241,.08)!important; border-color:${T.borderH}!important; }
    .article-btn:hover .art-arrow { transform:translateX(3px); color:${T.purpleL}!important; }
    .article-btn:hover .art-icon  { color:${T.purpleL}!important; }
    .article-btn:hover .art-label { color:${T.t1}!important; }
    .art-arrow { transition:transform .2s, color .2s; }
    .art-icon  { transition:color .2s; }
    .art-label { transition:color .2s; }

    @media(max-width:1024px){ .cat-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:540px) { .cat-grid { grid-template-columns:1fr; } }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=20, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoSearch  = p => <Ico {...p} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"/>;
const IcoArrow   = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoBot     = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>;
const IcoDb      = p => <Ico {...p} d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z"/>;
const IcoPhone   = p => <Ico {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.7 2a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>;
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoMsg     = p => <Ico {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>;
const IcoZap     = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoLife    = p => <Ico {...p} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01"/>;
const IcoMail    = p => <Ico {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const IcoCheck   = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;

// icon paths for categories
const CAT_ICONS = {
  bot:    'M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z',
  db:     'M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.57 8 3.5S16.42 12 12 12 4 10.43 4 8.5 7.58 5 12 5z',
  phone:  'M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

// ─── CATEGORY CARD ───────────────────────────────────────────────────
const CatCard = ({ name, iconKey, count, desc, accent, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: hov ? `linear-gradient(160deg,${accent}12,${accent}06,${T.bg3})` : T.bg2,
        border:`1px solid ${hov ? accent+'55' : T.border}`,
        borderRadius:20, padding:'26px 22px',
        cursor:'pointer',
        transition:'all .3s cubic-bezier(.34,1.2,.64,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? `0 20px 44px ${accent}1e` : 'none',
        position:'relative', overflow:'hidden',
        animation:`slideUp .45s ${index*.08}s both`,
      }}
    >
      {/* bg glow */}
      <div style={{position:'absolute',top:-16,right:-16,width:88,height:88,
        background:`radial-gradient(circle,${accent}18 0%,transparent 70%)`,
        opacity:hov?1:0,transition:'opacity .3s',pointerEvents:'none'}}/>

      <div style={{position:'relative',zIndex:1}}>
        {/* icon */}
        <div style={{
          width:48,height:48,borderRadius:14,
          background:`${accent}18`,border:`1px solid ${accent}33`,
          display:'flex',alignItems:'center',justifyContent:'center',
          marginBottom:18,
          transition:'transform .3s',
          transform:hov?'scale(1.1) rotate(-4deg)':'scale(1)',
        }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d={CAT_ICONS[iconKey]}/>
          </svg>
        </div>

        <h3 style={{color:T.t1,fontWeight:800,fontSize:16,marginBottom:8,letterSpacing:-.2}}>{name}</h3>
        <p style={{color:T.t2,fontSize:13,lineHeight:1.65,marginBottom:16}}>{desc}</p>

        {/* count pill */}
        <div style={{
          display:'inline-flex',alignItems:'center',gap:6,
          background:`${accent}18`,border:`1px solid ${accent}33`,
          borderRadius:20,padding:'4px 10px',
        }}>
          <span style={{width:5,height:5,borderRadius:'50%',background:accent,display:'inline-block'}}/>
          <span style={{color:accent,fontSize:9,fontWeight:700,letterSpacing:'.5em',textTransform:'uppercase',fontFamily:T.mono}}>
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────
const HelpCenter = () => {
  const [query,      setQuery]      = useState('');
  const [hovSupport, setHovSupport] = useState(false);
  const [focusSearch,setFocusSearch]= useState(false);

  const categories = [
    { name:'Getting Started', iconKey:'bot',    accent:'#a78bfa', count:'12 Articles',
      desc:'Set up your first AI bot in under 10 minutes. No tech skills required.' },
    { name:'Bot Training',    iconKey:'db',     accent:'#06b6d4', count:'8 Articles',
      desc:'Teach your bot using PDFs, URLs, and custom instructions.' },
    { name:'Connect Channels',iconKey:'phone',  accent:'#22c55e', count:'15 Articles',
      desc:'Integrate with WhatsApp, Instagram DMs, and your website.' },
    { name:'Account & Safety',iconKey:'shield', accent:'#3b82f6', count:'6 Articles',
      desc:'Manage billing, team access, tokens, and data security.' },
  ];

  const popularArticles = [
    { q:'How do I connect my WhatsApp Business number?',      tag:'Setup' },
    { q:'Can I train the bot using my website URL?',          tag:'Training' },
    { q:'How do I view and export my captured leads?',        tag:'Leads' },
    { q:'What happens when my tokens run out?',               tag:'Billing' },
    { q:'How do I change the bot\'s tone and personality?',   tag:'Customisation' },
    { q:'Can I connect to multiple Instagram accounts?',      tag:'Channels' },
    { q:'How does the 24-hour Meta messaging window work?',   tag:'WhatsApp' },
    { q:'How do I integrate with n8n or my own CRM?',         tag:'API' },
  ];

  const filtered = query
    ? popularArticles.filter(a => a.q.toLowerCase().includes(query.toLowerCase()))
    : popularArticles;

  const quickStats = [
    { val:'41',   label:'Help articles' },
    { val:'<2h',  label:'Avg response time' },
    { val:'24/7', label:'AI support active' },
  ];

  return (
    <div style={{minHeight:'100vh',background:T.bg1,color:T.t2,fontFamily:T.font,overflowX:'hidden',paddingTop:96}}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'10%',left:'-8%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'8%',right:'-5%',width:'42vw',height:'42vh',background:'radial-gradient(circle,rgba(217,70,239,.06) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── HERO & SEARCH ── */}
        <div style={{textAlign:'center',marginBottom:64,animation:'slideUp .4s both'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'6px 16px',marginBottom:24,
          }}>
            <IcoLife size={13} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>
              Help Center
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(36px,6vw,68px)',fontWeight:900,
            color:T.t1,letterSpacing:-2,lineHeight:1.06,marginBottom:14,
          }}>
            How Can We{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Help?</span>
          </h1>

          <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:440,margin:'0 auto 32px'}}>
            Search our knowledge base, browse by category, or reach out to our support team directly.
          </p>

          {/* quick stats */}
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,marginBottom:32}}>
            {quickStats.map(({val,label})=>(
              <div key={label} style={{
                display:'flex',alignItems:'center',gap:7,
                background:'rgba(255,255,255,.04)',border:`1px solid ${T.border}`,
                borderRadius:30,padding:'7px 14px',
              }}>
                <span style={{
                  fontSize:13,fontWeight:800,
                  backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
                  WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                }}>{val}</span>
                <span style={{fontSize:11,fontWeight:600,color:T.t3}}>{label}</span>
              </div>
            ))}
          </div>

          {/* search bar */}
          <div style={{
            position:'relative',maxWidth:580,margin:'0 auto',
          }}>
            {/* glow ring */}
            <div style={{
              position:'absolute',inset:-1,
              borderRadius:16,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              opacity: focusSearch ? .45 : .18,
              filter:'blur(8px)',
              transition:'opacity .3s',
              pointerEvents:'none',
            }}/>
            <div style={{position:'relative',display:'flex',alignItems:'center'}}>
              <IcoSearch size={17} stroke={focusSearch ? T.purpleL : T.t3} sw={2}
                style={{position:'absolute',left:16,pointerEvents:'none',transition:'color .2s'}}/>
              <input
                type="text"
                className="search-input"
                placeholder="Search for 'WhatsApp setup', 'tokens', 'training'…"
                value={query}
                onChange={e=>setQuery(e.target.value)}
                onFocus={()=>setFocusSearch(true)}
                onBlur={()=>setFocusSearch(false)}
                style={{
                  width:'100%',
                  padding:'16px 16px 16px 48px',
                  background:T.bg2,
                  border:`1px solid ${focusSearch ? T.borderH : T.border}`,
                  borderRadius:14,
                  color:T.t1,fontSize:14,fontFamily:T.font,
                  transition:'border-color .2s, box-shadow .2s',
                }}
              />
              {query && (
                <button onClick={()=>setQuery('')} style={{
                  position:'absolute',right:14,background:'none',border:'none',
                  color:T.t3,cursor:'pointer',fontSize:18,lineHeight:1,
                }}>×</button>
              )}
            </div>
          </div>
        </div>

        {/* ── CATEGORY GRID ── */}
        <div className="cat-grid" style={{marginBottom:64}}>
          {categories.map((c,i)=><CatCard key={i} index={i} {...c}/>)}
        </div>

        {/* ── POPULAR ARTICLES ── */}
        <div style={{maxWidth:760,margin:'0 auto 72px'}}>
          <div style={{
            display:'flex',alignItems:'center',justifyContent:'space-between',
            marginBottom:24,flexWrap:'wrap',gap:12,
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{
                width:34,height:34,borderRadius:10,
                background:'rgba(124,58,237,.15)',border:`1px solid rgba(124,58,237,.3)`,
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                <IcoZap size={16} stroke={T.purpleL} sw={2}/>
              </div>
              <h2 style={{color:T.t1,fontWeight:800,fontSize:18,letterSpacing:-.3}}>
                {query ? `Results for "${query}"` : 'Popular Topics'}
              </h2>
            </div>
            {query && (
              <span style={{
                background:'rgba(99,102,241,.1)',border:`1px solid ${T.border}`,
                borderRadius:20,padding:'4px 12px',
                fontSize:11,fontWeight:700,color:T.purpleL,
              }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
            )}
          </div>

          <div className="art-list">
            {filtered.length === 0 ? (
              <div style={{
                textAlign:'center',padding:'48px 24px',
                background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,
              }}>
                <div style={{fontSize:36,marginBottom:12}}>🔍</div>
                <div style={{color:T.t2,fontSize:14,fontWeight:600,marginBottom:6}}>No results found</div>
                <div style={{color:T.t3,fontSize:13}}>Try a different search term or browse the categories above.</div>
              </div>
            ) : filtered.map((a,i)=>(
              <button key={i} className="article-btn" style={{
                width:'100%',display:'flex',alignItems:'center',
                justifyContent:'space-between',
                padding:'16px 20px',
                background:'rgba(255,255,255,.025)',
                border:`1px solid ${T.border}`,
                borderRadius:13,cursor:'pointer',
                fontFamily:T.font,textAlign:'left',
                transition:'all .2s',
                animation:`slideUp .35s ${i*.04}s both`,
              }}>
                <div style={{display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0}}>
                  <div style={{
                    width:30,height:30,borderRadius:8,flexShrink:0,
                    background:'rgba(99,102,241,.08)',border:`1px solid ${T.border}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                  }}>
                    <IcoMsg size={14} stroke={T.t3} sw={1.9} className="art-icon"/>
                  </div>
                  <span className="art-label" style={{
                    color:T.t2,fontWeight:600,fontSize:14,lineHeight:1.4,
                  }}>{a.q}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0,marginLeft:12}}>
                  <span style={{
                    background:'rgba(99,102,241,.08)',border:`1px solid ${T.border}`,
                    borderRadius:20,padding:'3px 9px',
                    fontSize:9,fontWeight:700,color:T.t3,
                    letterSpacing:'.4px',textTransform:'uppercase',
                    whiteSpace:'nowrap',
                  }}>{a.tag}</span>
                  <IcoArrow size={15} stroke={T.t3} sw={2} className="art-arrow"/>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── SUPPORT CTA ── */}
        <div style={{
          background:`linear-gradient(135deg,rgba(79,70,229,.1),rgba(59,130,246,.06),rgba(124,58,237,.09))`,
          border:`1px solid rgba(99,102,241,.28)`,
          borderRadius:24,padding:'clamp(40px,5vw,64px) 24px',
          position:'relative',overflow:'hidden',textAlign:'center',
        }}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
            width:'50%',height:'60%',
            background:'radial-gradient(circle,rgba(79,70,229,.07) 0%,transparent 70%)',
            pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            {/* icon badge */}
            <div style={{
              width:56,height:56,borderRadius:17,
              background:'rgba(124,58,237,.15)',border:`1px solid rgba(124,58,237,.35)`,
              display:'flex',alignItems:'center',justifyContent:'center',
              margin:'0 auto 20px',
              animation:'glow 3s ease-in-out infinite',
            }}>
              <IcoLife size={26} stroke={T.purpleL} sw={1.9}/>
            </div>

            <h2 style={{fontSize:'clamp(22px,3.5vw,38px)',fontWeight:900,color:T.t1,
              letterSpacing:-.8,lineHeight:1.1,marginBottom:12}}>
              Still Need Help?
            </h2>
            <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:420,margin:'0 auto 28px'}}>
              Can't find what you're looking for? Our support team typically responds within 2 hours, and our AI assistant is available around the clock.
            </p>

            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12,marginBottom:28}}>
              <Link to="/contact"
                onMouseEnter={()=>setHovSupport(true)} onMouseLeave={()=>setHovSupport(false)}
                style={{
                  display:'inline-flex',alignItems:'center',gap:8,
                  padding:'13px 28px',borderRadius:12,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color:'white',fontWeight:700,fontSize:14,textDecoration:'none',
                  boxShadow: hovSupport ? '0 8px 26px rgba(79,70,229,.6)' : '0 4px 16px rgba(79,70,229,.4)',
                  transform: hovSupport ? 'translateY(-2px)' : 'translateY(0)',
                  transition:'all .2s',
                }}>
                <IcoMail size={15} stroke="white" sw={2}/>
                Contact Support
              </Link>
              <a href="mailto:support@myautobot.in" style={{
                display:'inline-flex',alignItems:'center',gap:7,
                padding:'13px 22px',borderRadius:12,
                background:'rgba(255,255,255,.04)',border:`1px solid ${T.border}`,
                color:T.t2,fontWeight:600,fontSize:14,textDecoration:'none',
                transition:'all .2s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH;e.currentTarget.style.color=T.t1;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.t2;}}
              >
                support@myautobot.in
              </a>
            </div>

            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:22}}>
              {['Avg 2h response time','AI support 24/7','Free for all accounts'].map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:6,color:T.t3,fontSize:13}}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                    stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>{t}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;