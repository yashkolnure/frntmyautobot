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
    @keyframes fadeIn {from{opacity:0}to{opacity:1}}

    .stats-strip { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .faq-cols    { display:grid; grid-template-columns:1fr 1fr; gap:0 48px; align-items:start; }

    @media(max-width:860px){
      .faq-cols   { grid-template-columns:1fr; }
      .stats-strip{ grid-template-columns:repeat(3,1fr); }
    }
    @media(max-width:520px){
      .stats-strip{ grid-template-columns:1fr 1fr; }
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
const IcoChevD   = p => <Ico {...p} d="M6 9l6 6 6-6"/>;
const IcoChevU   = p => <Ico {...p} d="M18 15l-6-6-6 6"/>;
const IcoHelp    = p => <Ico {...p} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>;
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoZap     = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoGlobe   = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.66 2.84-2.5 5.84-2.5 9s.84 6.16 2.5 9m0-18c1.66 2.84 2.5 5.84 2.5 9s-.84 6.16-2.5 9M2 12h20"/>;
const IcoRocket  = p => <Ico {...p} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>;
const IcoMail    = p => <Ico {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const IcoLock    = p => <Ico {...p} d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"/>;
const IcoCheck   = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;
const IcoBot     = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>;
const IcoApi     = p => <Ico {...p} d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>;
const IcoUsers   = p => <Ico {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>;
const IcoRefresh = p => <Ico {...p} d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>;

// ─── FAQ ITEM ────────────────────────────────────────────────────────
const FaqItem = ({ question, answer, category, isOpen, toggle, index }) => {
  const catColors = {
    'General':    '#a78bfa',
    'Technical':  '#06b6d4',
    'Billing':    '#f59e0b',
    'Security':   '#22c55e',
    'Integration':'#3b82f6',
  };
  const accent = catColors[category] || T.purpleL;

  return (
    <div
      style={{
        border: `1px solid ${isOpen ? accent + '55' : T.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        background: isOpen
          ? `linear-gradient(160deg,${accent}0e,${accent}06,${T.bg3})`
          : T.bg2,
        marginBottom: 10,
        transition: 'all .25s ease',
        boxShadow: isOpen ? `0 8px 28px ${accent}18` : 'none',
        animation: `slideUp .4s ${index * 0.04}s both`,
      }}
    >
      <button
        onClick={toggle}
        style={{
          width:'100%', padding:'18px 22px',
          background:'none', border:'none', cursor:'pointer',
          display:'flex', justifyContent:'space-between',
          alignItems:'center', gap:14, textAlign:'left',
          fontFamily:T.font,
        }}
      >
        <div style={{display:'flex',alignItems:'center',gap:10,flex:1,minWidth:0}}>
          {/* category dot */}
          <span style={{
            width:6,height:6,borderRadius:'50%',
            background:accent,boxShadow:`0 0 7px ${accent}`,
            flexShrink:0,display:'inline-block',
          }}/>
          <span style={{
            fontWeight:700, fontSize:15,
            color: isOpen ? accent : T.t1,
            lineHeight:1.35,
            transition:'color .2s',
          }}>{question}</span>
        </div>
        <div style={{flexShrink:0,marginLeft:8}}>
          {isOpen
            ? <IcoChevU size={17} stroke={accent} sw={2.2}/>
            : <IcoChevD size={17} stroke={T.t3} sw={2}/>
          }
        </div>
      </button>

      {/* answer panel */}
      <div style={{
        maxHeight: isOpen ? 400 : 0,
        overflow:'hidden',
        transition:'max-height .35s cubic-bezier(.4,0,.2,1)',
      }}>
        <div style={{
          padding:'0 22px 20px',
          paddingTop:14,
          color:T.t2, fontSize:14.5, lineHeight:1.75,
          borderTop:`1px solid ${T.border}`,
        }}>
          {/* category badge */}
          <span style={{
            display:'inline-block',
            background:`${accent}18`,border:`1px solid ${accent}33`,
            color:accent,fontSize:9,fontWeight:700,
            letterSpacing:'.6px',textTransform:'uppercase',
            padding:'2px 9px',borderRadius:20,marginBottom:10,
          }}>{category}</span>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────
const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [hovCta,    setHovCta]    = useState(false);
  const [hovEmail,  setHovEmail]  = useState(false);
  const [filter,    setFilter]    = useState('All');

  const faqs = [
    // General
    {
      category:'General',
      q:'What exactly is MyAutoBot.in?',
      a:"MyAutoBot.in is an AI Agent platform developed by Avenirya Solutions that allows businesses to build, train, and deploy intelligent chatbots across WhatsApp, Instagram, and websites — automating lead capture, customer support, and sales conversations 24/7. We are an Official Meta Tech Provider, meaning your automations run on fully compliant, verified infrastructure.",
    },
    {
      category:'General',
      q:'Who is MyAutoBot built for?',
      a:"Any business that communicates with customers via chat. Restaurants, real estate agencies, e-commerce brands, SaaS companies, clinics, schools, travel agencies, automotive dealerships — if you get messages from customers and want to respond faster, capture more leads, and do it without hiring extra staff, MyAutoBot is built for you.",
    },
    {
      category:'General',
      q:"What is Avenirya Solutions' role?",
      a:"Avenirya Solutions OPC Pvt Ltd is the parent company and official developer of the MyAutoBot ecosystem. We own and maintain the AI infrastructure, GPU compute nodes, Meta Tech Provider certification, and all platform tooling. When you deploy a bot, you're running on Avenirya's verified, India-hosted infrastructure.",
    },
    {
      category:'General',
      q:'How quickly can I go live?',
      a:"Most businesses go live within 24 hours of signing up. You provide your documents (FAQs, menus, pricing, policies), we train the AI, configure your channels, and deploy — all handled by our onboarding team. You don't need any technical knowledge or a developer.",
    },
    // Technical
    {
      category:'Technical',
      q:'How does the training process work?',
      a:"You provide the knowledge — PDFs, website URLs, Google Docs, or custom text instructions. Our system ingests this data into a private, isolated knowledge base and creates an AI agent that understands your specific business logic, terminology, and tone. Updates to your knowledge base take effect within minutes.",
    },
    {
      category:'Technical',
      q:'How do I deploy it to my website?',
      a:"Once your bot is trained, the platform generates a custom branded chat link you can share anywhere, plus a lightweight embed script. Paste the script once into your website's <head> or <body> tag and your AI assistant is live instantly — no developer required, no page reload needed.",
    },
    {
      category:'Technical',
      q:'What happens if the bot cannot answer a question?',
      a:"The bot gracefully escalates to a human agent, passing along the full conversation history so your team has complete context. You can configure custom escalation triggers — specific keywords, sentiment signals, or topic categories — to control exactly when and how handoffs happen. No dead ends, no frustrated customers.",
    },
    {
      category:'Technical',
      q:'What AI models power the responses?',
      a:"We run proprietary fine-tuned language models on GPU-enabled VPS nodes hosted entirely in India. This ensures ultra-low latency for local customers, keeps your data within Indian jurisdiction, and allows us to customise model behaviour to fit Indian English, regional context, and business-specific terminology.",
    },
    // Billing
    {
      category:'Billing',
      q:'How does the Token system work?',
      a:"We operate on a transparent tokenomics model where every AI-generated response consumes exactly 5 tokens from your balance — regardless of message length or complexity. There are no seat fees, no monthly minimums, and no hidden charges. You only pay for the interactions your bot actually handles.",
    },
    {
      category:'Billing',
      q:'Do tokens expire?',
      a:"No. Tokens never expire and roll over indefinitely. Top up whenever you need to, in any amount. Your balance is always visible in real time on your dashboard — so there are no end-of-month surprises and no pressure to use up a quota before a billing cycle resets.",
    },
    {
      category:'Billing',
      q:'Can I cancel or pause my plan anytime?',
      a:"Yes. There are no long-term contracts or cancellation fees. You can pause or cancel from your dashboard at any time. Your data — leads, conversations, knowledge base, and settings — is always exportable in standard formats whenever you need it.",
    },
    // Security
    {
      category:'Security',
      q:'Is my customer data secure?',
      a:"Absolutely. We utilise self-hosted LLM nodes on secure, GPU-enabled VPS servers with AES-256 encryption at rest and TLS 1.3 in transit. Your knowledge base and customer conversations are isolated per-instance — your data is never used to train shared models, never sold, and never accessible by other clients.",
    },
    {
      category:'Security',
      q:'Will using this get my WhatsApp or Instagram account banned?',
      a:"No. As an Official Meta Tech Provider, every integration uses the official WhatsApp Business API and Instagram Graph API. There are no grey-area automation tools, no browser injection scripts, and no terms-of-service violations. Your business accounts are fully protected.",
    },
    // Integration
    {
      category:'Integration',
      q:'Can I connect it to Instagram and WhatsApp?',
      a:"Yes. As a Meta Tech Provider, we offer direct integration with the official WhatsApp Business API and Instagram Business Messaging. Connection takes a few minutes via your Meta Business Manager. Once connected, your AI agent handles DMs across both platforms from a single, unified knowledge base.",
    },
    {
      category:'Integration',
      q:'Can I use it with my own apps or n8n workflows?',
      a:"Yes. You can generate secure REST API keys from your dashboard to embed your AI agent into custom web apps, mobile apps, or internal tools. For no-code automation builders, we offer native n8n integration — trigger CRM updates, invoice creation, Slack notifications, and more from live chat events.",
    },
    {
      category:'Integration',
      q:'Does it sync with CRMs like HubSpot or Salesforce?',
      a:"Yes. Every lead captured by your bot can be synced automatically to popular CRMs including HubSpot, Salesforce, and Zoho via native integrations or n8n webhooks. You can also export leads manually from the dashboard to CSV at any time.",
    },
  ];

  const categories = ['All', 'General', 'Technical', 'Billing', 'Security', 'Integration'];
  const catColors  = { General:'#a78bfa', Technical:'#06b6d4', Billing:'#f59e0b', Security:'#22c55e', Integration:'#3b82f6' };

  const filtered = filter === 'All' ? faqs : faqs.filter(f => f.category === filter);

  // split into two columns
  const mid   = Math.ceil(filtered.length / 2);
  const col1  = filtered.slice(0, mid);
  const col2  = filtered.slice(mid);

  return (
    <div style={{
      minHeight:'100vh', background:T.bg1, color:T.t2,
      fontFamily:T.font, overflowX:'hidden', paddingTop:96,
    }}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',right:'-8%',width:'55vw',height:'55vh',background:'radial-gradient(circle,rgba(124,58,237,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',left:'-6%',width:'50vw',height:'48vh',background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',top:'42%',left:'25%',width:'36vw',height:'36vh',background:'radial-gradient(circle,rgba(79,70,229,.06) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── HERO ── */}
        <div style={{textAlign:'center',marginBottom:56}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'6px 16px',marginBottom:28,
          }}>
            <IcoHelp size={13} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>
              Information Terminal
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(38px,6vw,72px)',
            fontWeight:900,lineHeight:1.06,
            color:T.t1,letterSpacing:-2,marginBottom:20,
          }}>
            Intel{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Briefing.</span>
          </h1>

          <p style={{
            fontSize:'clamp(15px,2vw,18px)',
            color:T.t2,lineHeight:1.8,
            maxWidth:540,margin:'0 auto 40px',
          }}>
            Everything you need to know about deploying your AI agents with Avenirya's official infrastructure — from setup to billing to security.
          </p>

          {/* ── STATS STRIP ── */}
          <div className="stats-strip" style={{maxWidth:560,margin:'0 auto 48px'}}>
            {[
              { icon:<IcoShield size={22} stroke="#22c55e" sw={1.9}/>, label:'Meta Partner', val:'Official Provider', accent:'#22c55e' },
              { icon:<IcoZap    size={22} stroke="#f59e0b" sw={1.9}/>, label:'Billing Logic',  val:'5 TKN / Reply',   accent:'#f59e0b' },
              { icon:<IcoGlobe  size={22} stroke="#3b82f6" sw={1.9}/>, label:'Uptime',         val:'99.98% Active',   accent:'#3b82f6' },
            ].map(({icon,label,val,accent})=>(
              <div key={label} style={{
                background:T.bg2, border:`1px solid ${T.border}`,
                borderRadius:16, padding:'20px 16px', textAlign:'center',
                transition:'border-color .2s, transform .2s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=accent+'55';e.currentTarget.style.transform='translateY(-3px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform='translateY(0)';}}
              >
                <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>{icon}</div>
                <div style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:5}}>{label}</div>
                <div style={{color:T.t1,fontWeight:800,fontSize:14,fontFamily:T.mono}}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div style={{
          display:'flex',flexWrap:'wrap',justifyContent:'center',gap:8,marginBottom:40,
        }}>
          {categories.map(cat => {
            const active = filter === cat;
            const accent = catColors[cat] || T.purpleL;
            return (
              <button key={cat} onClick={() => setOpenIndex(null) || setFilter(cat)} style={{
                padding:'8px 18px', borderRadius:30,
                border:`1px solid ${active ? accent+'66' : T.border}`,
                background: active ? `${accent}18` : 'rgba(255,255,255,.03)',
                color: active ? accent : T.t3,
                fontSize:12, fontWeight:700,
                letterSpacing:'.4px', textTransform:'uppercase',
                cursor:'pointer', fontFamily:T.font,
                transition:'all .2s',
              }}
                onMouseEnter={e=>{ if(!active){ e.currentTarget.style.borderColor=accent+'44'; e.currentTarget.style.color=T.t2; }}}
                onMouseLeave={e=>{ if(!active){ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.t3; }}}
              >
                {cat}
                <span style={{
                  marginLeft:6, fontSize:9, fontWeight:700,
                  color: active ? accent : T.t3,
                  fontFamily:T.mono,
                }}>
                  {cat === 'All' ? faqs.length : faqs.filter(f=>f.category===cat).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── FAQ TWO-COLUMN ACCORDION ── */}
        <div className="faq-cols" style={{marginBottom:64}}>
          {/* col 1 */}
          <div>
            {col1.map((faq, i) => {
              const globalIdx = filtered.indexOf(faq);
              return (
                <FaqItem
                  key={globalIdx}
                  index={i}
                  question={faq.q}
                  answer={faq.a}
                  category={faq.category}
                  isOpen={openIndex === globalIdx}
                  toggle={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                />
              );
            })}
          </div>
          {/* col 2 */}
          <div>
            {col2.map((faq, i) => {
              const globalIdx = filtered.indexOf(faq);
              return (
                <FaqItem
                  key={globalIdx}
                  index={mid + i}
                  question={faq.q}
                  answer={faq.a}
                  category={faq.category}
                  isOpen={openIndex === globalIdx}
                  toggle={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                />
              );
            })}
          </div>
        </div>

        {/* ── STILL HAVE QUESTIONS ── */}
        <section style={{
          background:`linear-gradient(135deg,rgba(79,70,229,.1),rgba(59,130,246,.06),rgba(124,58,237,.09))`,
          border:`1px solid rgba(99,102,241,.28)`,
          borderRadius:24, padding:'clamp(36px,5vw,60px)',
          position:'relative', overflow:'hidden', textAlign:'center',
        }}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'55%',height:'65%',background:'radial-gradient(circle,rgba(79,70,229,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

          <div style={{position:'relative',zIndex:1}}>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:7,
              background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
              borderRadius:30,padding:'6px 14px',marginBottom:20,
            }}>
              <IcoBot size={12} stroke={T.purpleL} sw={2.2}/>
              <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}>Still have questions?</span>
            </div>

            <h2 style={{
              fontSize:'clamp(24px,4vw,44px)',
              fontWeight:900,color:T.t1,
              lineHeight:1.1,letterSpacing:-1,marginBottom:14,
            }}>
              We're Here to{' '}
              <span style={{
                backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                backgroundSize:'200%',animation:'shim 5s linear infinite',
              }}>Help.</span>
            </h2>

            <p style={{color:T.t2,fontSize:15,lineHeight:1.75,maxWidth:420,margin:'0 auto 32px'}}>
              Can't find the answer you're looking for? Our team typically responds within a few hours. Or just go ahead and deploy — setup is free and we'll walk you through everything.
            </p>

            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:12,marginBottom:28}}>
              <Link
                to="/login?id=register"
                onMouseEnter={()=>setHovCta(true)}
                onMouseLeave={()=>setHovCta(false)}
                style={{
                  display:'flex',alignItems:'center',gap:9,
                  padding:'14px 30px',borderRadius:12,
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color:'white',fontWeight:700,fontSize:15,
                  fontFamily:T.font,textDecoration:'none',
                  boxShadow: hovCta ? '0 8px 28px rgba(79,70,229,.6)' : '0 4px 18px rgba(79,70,229,.42)',
                  transform: hovCta ? 'translateY(-2px)' : 'translateY(0)',
                  transition:'all .2s',
                }}
              >
                Deploy Now — It's Free
                <IcoRocket size={15} stroke="white" sw={2}/>
              </Link>

              <a
                href="mailto:support@myautobot.in"
                onMouseEnter={()=>setHovEmail(true)}
                onMouseLeave={()=>setHovEmail(false)}
                style={{
                  display:'flex',alignItems:'center',gap:9,
                  padding:'14px 30px',borderRadius:12,
                  background: hovEmail ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.04)',
                  color:T.t1,fontWeight:600,fontSize:15,
                  fontFamily:T.font,textDecoration:'none',
                  border:`1px solid ${hovEmail ? T.borderH : T.border}`,
                  transition:'all .2s',
                }}
              >
                <IcoMail size={15} stroke={T.purpleL} sw={2}/>
                support@myautobot.in
              </a>
            </div>

            {/* trust strip */}
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:22}}>
              {[
                'Free setup included',
                'No credit card needed',
                'Live in 24 hours',
                'Official Meta Partner',
              ].map(t=>(
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
        </section>

      </div>
    </div>
  );
};

export default FAQPage;