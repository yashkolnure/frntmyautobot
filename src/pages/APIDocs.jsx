import React, { useState } from 'react';

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
    @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn {from{opacity:0}to{opacity:1}}

    /* scrollbar */
    ::-webkit-scrollbar       {width:4px;height:4px;}
    ::-webkit-scrollbar-track {background:transparent;}
    ::-webkit-scrollbar-thumb {background:rgba(99,102,241,.2);border-radius:4px;}

    .nav-item       { transition:all .18s; cursor:pointer; }
    .nav-item:hover { color:${T.t1}!important; background:rgba(99,102,241,.08)!important; }
    .nav-item.active{ color:${T.purpleL}!important; background:rgba(99,102,241,.12)!important; border-color:${T.borderH}!important; }

    .param-row:hover { background:rgba(99,102,241,.05)!important; }

    .copy-btn:hover { color:${T.t1}!important; }

    .api-layout {
      display:grid;
      grid-template-columns:240px 1fr 420px;
      min-height:calc(100vh - 200px);
    }
    @media(max-width:1100px){
      .api-layout { grid-template-columns:200px 1fr; }
      .code-panel  { display:none; }
    }
    @media(max-width:700px){
      .api-layout  { grid-template-columns:1fr; }
      .doc-sidebar { display:none; }
    }
  `}</style>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=18, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoCode   = p => <Ico {...p} d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>;
const IcoHash   = p => <Ico {...p} d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>;
const IcoTerm   = p => <Ico {...p} d="M4 17l6-6-6-6M12 19h8"/>;
const IcoCopy   = p => <Ico {...p} d="M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1"/>;
const IcoCheck  = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;
const IcoKey    = p => <Ico {...p} d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>;
const IcoZap    = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoMsg    = p => <Ico {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>;
const IcoBot    = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>;
const IcoShield = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoArrow  = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;

// ─── CODE BLOCK ──────────────────────────────────────────────────────
const CodeBlock = ({ title, lang, children }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(children.replace(/<[^>]*>/g,'').trim());
    setCopied(true);
    setTimeout(()=>setCopied(false), 1800);
  };
  return (
    <div style={{
      background:T.bg0, border:`1px solid ${T.border}`,
      borderRadius:14, overflow:'hidden',
      boxShadow:`0 8px 24px rgba(0,0,0,.5)`,
    }}>
      {/* top bar */}
      <div style={{
        background:'rgba(255,255,255,.04)',
        borderBottom:`1px solid ${T.border}`,
        padding:'9px 14px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {/* traffic dots */}
          {['#ef4444','#f59e0b','#22c55e'].map(c=>(
            <div key={c} style={{width:9,height:9,borderRadius:'50%',background:c,opacity:.7}}/>
          ))}
          <div style={{width:1,height:14,background:T.border,margin:'0 4px'}}/>
          <IcoTerm size={12} stroke={T.t3} sw={1.8}/>
          <span style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',fontFamily:T.mono}}>
            {lang || title}
          </span>
        </div>
        <button className="copy-btn" onClick={handleCopy} title="Copy" style={{
          background:'none',border:'none',cursor:'pointer',
          color:copied?T.green:T.t3,
          display:'flex',alignItems:'center',gap:5,transition:'color .2s',
          fontSize:10,fontWeight:700,letterSpacing:'.3em',textTransform:'uppercase',
          fontFamily:T.font,
        }}>
          {copied
            ? <><IcoCheck size={12} stroke={T.green} sw={2.5}/> Copied</>
            : <><IcoCopy  size={12} stroke="currentColor" sw={1.8}/> Copy</>}
        </button>
      </div>
      {/* code */}
      <div style={{padding:'16px',overflowX:'auto'}}>
        <pre style={{
          fontFamily:T.mono,fontSize:12,lineHeight:1.85,
          color:T.t2,whiteSpace:'pre',margin:0,
        }}>{children}</pre>
      </div>
    </div>
  );
};

// ─── METHOD BADGE ────────────────────────────────────────────────────
const MethodBadge = ({ method }) => {
  const colors = {
    GET:    { bg:'rgba(34,197,94,.14)',  border:'rgba(34,197,94,.3)',  color:'#4ade80' },
    POST:   { bg:'rgba(59,130,246,.14)', border:'rgba(59,130,246,.3)', color:'#60a5fa' },
    DELETE: { bg:'rgba(239,68,68,.14)',  border:'rgba(239,68,68,.3)',  color:'#f87171' },
  };
  const c = colors[method] || colors.GET;
  return (
    <span style={{
      padding:'3px 10px',borderRadius:7,
      background:c.bg,border:`1px solid ${c.border}`,
      color:c.color,fontSize:9,fontWeight:800,
      letterSpacing:'.6px',textTransform:'uppercase',fontFamily:T.mono,
      flexShrink:0,
    }}>{method}</span>
  );
};

// ─── ENDPOINT ROW (url display) ───────────────────────────────────────
const EndpointBar = ({ method, url }) => (
  <div style={{
    display:'flex',alignItems:'center',gap:12,
    background:'rgba(0,0,0,.35)',border:`1px solid ${T.border}`,
    borderRadius:11,padding:'12px 16px',marginBottom:28,
  }}>
    <MethodBadge method={method}/>
    <code style={{color:T.purpleL,fontSize:12,fontFamily:T.mono,wordBreak:'break-all'}}>{url}</code>
  </div>
);

// ─── PARAM TABLE ─────────────────────────────────────────────────────
const ParamTable = ({ params }) => (
  <div style={{
    border:`1px solid ${T.border}`,borderRadius:12,overflow:'hidden',marginBottom:28,
  }}>
    {/* header */}
    <div style={{
      display:'grid',gridTemplateColumns:'120px 80px 1fr',
      background:'rgba(99,102,241,.06)',
      borderBottom:`1px solid ${T.border}`,
      padding:'8px 16px',
    }}>
      {['Parameter','Type','Description'].map(h=>(
        <span key={h} style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase'}}>{h}</span>
      ))}
    </div>
    {params.map((p,i)=>(
      <div key={i} className="param-row" style={{
        display:'grid',gridTemplateColumns:'120px 80px 1fr',
        padding:'12px 16px',
        borderBottom:i<params.length-1?`1px solid ${T.border}`:'none',
        transition:'background .15s',alignItems:'center',
      }}>
        <code style={{color:T.purpleL,fontSize:12,fontFamily:T.mono,fontWeight:600}}>{p.name}</code>
        <span style={{color:T.t3,fontSize:11,fontFamily:T.mono,fontStyle:'italic'}}>{p.type}</span>
        <span style={{color:T.t2,fontSize:13,lineHeight:1.55}}>{p.desc}</span>
      </div>
    ))}
  </div>
);

// ─── DOCS CONTENT MAP ────────────────────────────────────────────────
const DOCS = {
  'authentication': {
    label:'Authentication', method:null,
    tag:'Introduction',
    title:'Authentication',
    subtitle:'Secure every request with your API key',
    intro:'All MyAutoBot API requests must include your secret API key in the Authorization header. Generate and manage your keys from the API Keys section of your dashboard.',
    sections:[
      {
        heading:'Bearer Token',
        content:`Every request must include the following header:\n\nAuthorization: Bearer sk_live_xxxxxxxxxxxxxxxx\n\nYou can generate new keys and revoke old ones from your dashboard at any time. Keys are shown only once — copy them immediately.`,
      },
      {
        heading:'Key Security Rules',
        content:'Never expose your API key in client-side code, public repos, or frontend JavaScript. Treat it like a password. If a key is compromised, revoke it immediately from your dashboard and generate a new one.',
      },
    ],
    params:null,
    exampleRequest:`curl https://api.myautobot.in/v1/leads \\
  -H "Authorization: Bearer sk_live_avenirya_77xx..."`,
    exampleResponse:`{
  "authenticated": true,
  "plan": "pro",
  "tokensRemaining": 12450
}`,
  },
  'rate-limits': {
    label:'Rate Limits', method:null,
    tag:'Introduction',
    title:'Rate Limits',
    subtitle:'Fair usage across all plans',
    intro:"To ensure stability for all users, the MyAutoBot API enforces rate limits on all endpoints. Limits are applied per API key, per minute.",
    sections:[
      {
        heading:'Default Limits',
        content:`Starter plan:   60 requests / minute\nPro plan:       300 requests / minute\nEnterprise:     Custom limits available\n\nIf you exceed your limit, the API returns a 429 Too Many Requests response. Retry after the time specified in the Retry-After header.`,
      },
    ],
    params:null,
    exampleRequest:`# Rate limit headers in every response:
X-RateLimit-Limit:     300
X-RateLimit-Remaining: 297
X-RateLimit-Reset:     1703001234`,
    exampleResponse:`{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Retry after 12s.",
  "retryAfter": 12
}`,
  },
  'get-leads': {
    label:'Get Leads', method:'GET',
    tag:'Endpoints',
    title:'Get All Leads',
    subtitle:'Returns all leads captured across channels',
    intro:'This endpoint returns a paginated list of all leads captured by your bot across WhatsApp, Instagram, and Web. Filter by date, channel, or status.',
    sections:[],
    params:[
      { name:'limit',   type:'integer', desc:'Results per page. Min 1, max 100. Default: 20.' },
      { name:'offset',  type:'integer', desc:'Pagination offset. Default: 0.' },
      { name:'status',  type:'string',  desc:'Filter by "qualified", "interested", or "new".' },
      { name:'source',  type:'string',  desc:'Filter by channel: "whatsapp", "instagram", or "web".' },
      { name:'from',    type:'string',  desc:'ISO date string. Returns leads captured after this date.' },
    ],
    exampleRequest:`curl https://api.myautobot.in/v1/leads \\
  -H "Authorization: Bearer sk_live_avenirya_77xx..." \\
  -G \\
  -d limit=10 \\
  -d status=qualified \\
  -d source=whatsapp`,
    exampleResponse:`{
  "status": "success",
  "total": 284,
  "page": 1,
  "data": [
    {
      "id": "ld_912",
      "name": "Rahul Mehta",
      "email": "rahul@agency.com",
      "phone": "+91 98765 43210",
      "intent": "Enterprise Quote",
      "source": "WhatsApp",
      "status": "qualified",
      "capturedAt": "2025-12-25T14:22:00Z"
    }
  ]
}`,
  },
  'send-message': {
    label:'Send Message', method:'POST',
    tag:'Endpoints',
    title:'Send Message',
    subtitle:'Send a message to any contact via any channel',
    intro:'Send a text, image, or document message to a specific contact on their preferred channel. The message will appear as coming from your connected business account.',
    sections:[],
    params:[
      { name:'to',      type:'string', desc:'Contact identifier — phone number (WhatsApp) or username (Instagram).' },
      { name:'channel', type:'string', desc:'Destination channel: "whatsapp", "instagram", or "web".' },
      { name:'type',    type:'string', desc:'Message type: "text", "image", or "document".' },
      { name:'text',    type:'string', desc:'Message body. Required when type is "text".' },
      { name:'mediaUrl',type:'string', desc:'Publicly accessible URL. Required when type is "image" or "document".' },
    ],
    exampleRequest:`curl -X POST https://api.myautobot.in/v1/send \\
  -H "Authorization: Bearer sk_live_avenirya_77xx..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+919876543210",
    "channel": "whatsapp",
    "type": "text",
    "text": "Hi! Your order has been confirmed."
  }'`,
    exampleResponse:`{
  "status": "sent",
  "messageId": "msg_4f2a8c",
  "to": "+919876543210",
  "channel": "whatsapp",
  "sentAt": "2025-12-25T14:23:45Z"
}`,
  },
  'bot-status': {
    label:'Bot Status', method:'GET',
    tag:'Endpoints',
    title:'Bot Status',
    subtitle:'Check your bot\'s live health and config',
    intro:'Returns the current operational status of your AI bot — including which channels are connected, auto-reply state, token balance, and average response time.',
    sections:[],
    params:[
      { name:'botId', type:'string', desc:'Optional. Your bot instance ID. Defaults to your primary bot.' },
    ],
    exampleRequest:`curl https://api.myautobot.in/v1/bot/status \\
  -H "Authorization: Bearer sk_live_avenirya_77xx..."`,
    exampleResponse:`{
  "status": "online",
  "autoReply": true,
  "tokensRemaining": 12450,
  "avgResponseMs": 342,
  "channels": {
    "whatsapp":  { "connected": true,  "handle": "+919876543210" },
    "instagram": { "connected": true,  "handle": "@kicksstore_official" },
    "web":       { "connected": false, "handle": null }
  },
  "lastActive": "2025-12-25T14:20:00Z"
}`,
  },
};

// ─── PAGE ────────────────────────────────────────────────────────────
const APIDocs = () => {
  const [active, setActive] = useState('get-leads');
  const doc = DOCS[active];

  const menu = [
    { group:'Introduction', items:['authentication','rate-limits'] },
    { group:'Endpoints',    items:['get-leads','send-message','bot-status'] },
  ];

  const methodIcons = {
    GET:  { path:'M5 12h14M12 5l7 7-7 7',     color:'#4ade80' },
    POST: { path:'M12 5v14M5 12h14',            color:'#60a5fa' },
  };

  return (
    <div style={{minHeight:'100vh',background:T.bg1,color:T.t2,fontFamily:T.font,overflowX:'hidden',paddingTop:96}}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-8%',left:'-5%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-6%',right:'-4%',width:'44vw',height:'44vh',background:'radial-gradient(circle,rgba(59,130,246,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1360,margin:'0 auto',padding:'32px 24px 80px'}}>

        {/* ── PAGE HEADER ── */}
        <div style={{marginBottom:28,animation:'slideUp .4s both'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <div style={{
              width:34,height:34,borderRadius:9,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              display:'flex',alignItems:'center',justifyContent:'center',
              boxShadow:'0 0 14px rgba(124,58,237,.4)',
            }}>
              <IcoCode size={15} stroke="white" sw={2}/>
            </div>
            <span style={{
              fontSize:10,fontWeight:700,color:T.purpleL,
              letterSpacing:'.5em',textTransform:'uppercase',fontFamily:T.mono,
            }}>API Reference</span>
            <span style={{
              background:'rgba(99,102,241,.12)',border:`1px solid ${T.border}`,
              borderRadius:20,padding:'2px 10px',
              fontSize:9,fontWeight:700,color:T.purpleL,fontFamily:T.mono,
              letterSpacing:'.3em',
            }}>v2.0</span>
          </div>
          <h1 style={{
            fontSize:'clamp(28px,4vw,44px)',fontWeight:900,
            color:T.t1,letterSpacing:-1.5,lineHeight:1.1,marginBottom:8,
          }}>
            Developer{' '}
            <span style={{
              backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundSize:'200%',animation:'shim 5s linear infinite',
            }}>Documentation</span>
          </h1>
          <p style={{color:T.t2,fontSize:14,lineHeight:1.7,maxWidth:520}}>
            Integrate MyAutoBot's AI into your own apps, automate workflows, and build custom solutions using our REST API.
          </p>
        </div>

        {/* ── THREE-COLUMN LAYOUT ── */}
        <div style={{
          background:`linear-gradient(160deg,rgba(13,11,30,.97),rgba(19,16,43,.95))`,
          border:`1px solid ${T.borderH}`,
          borderRadius:20,overflow:'hidden',
          boxShadow:`0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.1)`,
          position:'relative',
        }}>
          {/* shimmer top */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)',zIndex:2}}/>

          <div className="api-layout">

            {/* ── SIDEBAR ── */}
            <aside className="doc-sidebar" style={{
              borderRight:`1px solid ${T.border}`,
              padding:'24px 16px',
              background:'rgba(0,0,0,.2)',
              overflowY:'auto',
            }}>
              {menu.map(grp=>(
                <div key={grp.group} style={{marginBottom:28}}>
                  <div style={{
                    fontSize:9,fontWeight:700,color:T.t3,
                    letterSpacing:'.4em',textTransform:'uppercase',
                    padding:'0 10px',marginBottom:8,fontFamily:T.mono,
                  }}>{grp.group}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:2}}>
                    {grp.items.map(id=>{
                      const d = DOCS[id];
                      const isActive = active===id;
                      return (
                        <button key={id} onClick={()=>setActive(id)}
                          className={`nav-item${isActive?' active':''}`}
                          style={{
                            display:'flex',alignItems:'center',gap:9,
                            padding:'9px 12px',borderRadius:10,
                            background:isActive?'rgba(99,102,241,.12)':'transparent',
                            border:`1px solid ${isActive?T.borderH:'transparent'}`,
                            color:isActive?T.purpleL:T.t3,
                            fontSize:13,fontWeight:600,
                            fontFamily:T.font,textAlign:'left',cursor:'pointer',
                          }}>
                          {/* method dot or icon */}
                          {d.method ? (
                            <span style={{
                              fontSize:8,fontWeight:800,fontFamily:T.mono,
                              color:d.method==='GET'?'#4ade80':'#60a5fa',
                              letterSpacing:'.2em',width:30,flexShrink:0,
                            }}>{d.method}</span>
                          ) : (
                            <span style={{
                              width:6,height:6,borderRadius:'50%',
                              background:isActive?T.purpleL:T.t3,
                              display:'inline-block',flexShrink:0,marginLeft:2,
                            }}/>
                          )}
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* divider + links */}
              <div style={{height:1,background:`linear-gradient(90deg,transparent,${T.border},transparent)`,margin:'8px 0 18px'}}/>
              <div style={{display:'flex',flexDirection:'column',gap:6,padding:'0 10px'}}>
                {[
                  { label:'Dashboard',   path:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
                  { label:'API Keys',    path:'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3' },
                ].map(({label,path})=>(
                  <a key={label} href="#" style={{
                    display:'flex',alignItems:'center',gap:8,
                    color:T.t3,fontSize:12,fontWeight:500,textDecoration:'none',
                    transition:'color .15s',padding:'4px 0',
                  }}
                    onMouseEnter={e=>e.currentTarget.style.color=T.t1}
                    onMouseLeave={e=>e.currentTarget.style.color=T.t3}
                  >
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                      <path d={path}/>
                    </svg>
                    {label}
                  </a>
                ))}
              </div>
            </aside>

            {/* ── MAIN DOC ── */}
            <main style={{
              padding:'clamp(20px,3vw,40px)',
              overflowY:'auto',maxHeight:'calc(100vh - 200px)',
            }}>
              <div style={{maxWidth:640,animation:'slideUp .3s both'}}>

                {/* tag + title */}
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                  <IcoHash size={14} stroke={T.purpleL} sw={2}/>
                  <span style={{fontSize:9,fontWeight:700,color:T.purpleL,letterSpacing:'.5em',textTransform:'uppercase'}}>{doc.tag}</span>
                </div>

                <h1 style={{
                  fontSize:'clamp(24px,3vw,38px)',fontWeight:900,
                  color:T.t1,letterSpacing:-1,marginBottom:8,lineHeight:1.1,
                }}>
                  {doc.title.includes(' ') ? (
                    <>
                      {doc.title.split(' ').slice(0,-1).join(' ')}{' '}
                      <span style={{
                        backgroundImage:'linear-gradient(135deg,#818cf8,#a78bfa)',
                        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                      }}>{doc.title.split(' ').slice(-1)[0]}.</span>
                    </>
                  ) : doc.title}
                </h1>

                <p style={{color:T.t3,fontSize:12,fontWeight:700,letterSpacing:'.35em',
                  textTransform:'uppercase',marginBottom:20,fontFamily:T.mono}}>
                  {doc.subtitle}
                </p>

                {doc.method && <EndpointBar method={doc.method} url={`https://api.myautobot.in/v1/${active==='get-leads'?'leads':active==='send-message'?'send':'bot/status'}`}/>}

                <p style={{color:T.t2,fontSize:14.5,lineHeight:1.78,marginBottom:28}}>{doc.intro}</p>

                {/* extra sections (auth / rate limits) */}
                {doc.sections?.map((s,i)=>(
                  <div key={i} style={{marginBottom:28}}>
                    <h3 style={{
                      color:T.t1,fontWeight:700,fontSize:15,marginBottom:10,
                      paddingLeft:12,
                      borderLeft:`3px solid ${T.purpleL}`,
                      letterSpacing:-.2,
                    }}>{s.heading}</h3>
                    <div style={{
                      background:'rgba(0,0,0,.25)',border:`1px solid ${T.border}`,
                      borderRadius:11,padding:'14px 16px',
                      fontFamily:T.mono,fontSize:12,lineHeight:2,color:T.t2,
                      whiteSpace:'pre-wrap',
                    }}>{s.content}</div>
                  </div>
                ))}

                {/* params */}
                {doc.params && (
                  <>
                    <h3 style={{
                      color:T.t1,fontWeight:700,fontSize:14,
                      marginBottom:16,
                      display:'flex',alignItems:'center',gap:8,
                    }}>
                      <span style={{width:3,height:16,borderRadius:2,
                        background:'linear-gradient(180deg,#6366f1,#7c3aed)',display:'inline-block'}}/>
                      Query Parameters
                    </h3>
                    <ParamTable params={doc.params}/>
                  </>
                )}

                {/* response codes */}
                <h3 style={{
                  color:T.t1,fontWeight:700,fontSize:14,marginBottom:14,
                  display:'flex',alignItems:'center',gap:8,
                }}>
                  <span style={{width:3,height:16,borderRadius:2,
                    background:'linear-gradient(180deg,#22c55e,#16a34a)',display:'inline-block'}}/>
                  Response Codes
                </h3>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:28}}>
                  {[
                    { code:'200', label:'OK', desc:'Request succeeded.',              color:'#4ade80' },
                    { code:'401', label:'Unauthorized', desc:'Invalid or missing API key.', color:'#f87171' },
                    { code:'429', label:'Rate Limited', desc:'Too many requests.',          color:'#fbbf24' },
                    { code:'500', label:'Server Error', desc:'Something went wrong on our end.', color:'#a78bfa' },
                  ].map(r=>(
                    <div key={r.code} style={{
                      display:'flex',alignItems:'center',gap:12,
                      padding:'10px 14px',
                      background:'rgba(255,255,255,.02)',border:`1px solid ${T.border}`,
                      borderRadius:10,
                    }}>
                      <code style={{
                        color:r.color,fontFamily:T.mono,fontSize:12,
                        fontWeight:700,width:34,flexShrink:0,
                      }}>{r.code}</code>
                      <span style={{color:T.t1,fontWeight:600,fontSize:13,width:100,flexShrink:0}}>{r.label}</span>
                      <span style={{color:T.t3,fontSize:12}}>{r.desc}</span>
                    </div>
                  ))}
                </div>

              </div>
            </main>

            {/* ── CODE PANEL ── */}
            <aside className="code-panel" style={{
              borderLeft:`1px solid ${T.border}`,
              background:'rgba(0,0,0,.3)',
              padding:'clamp(20px,2.5vw,32px)',
              overflowY:'auto',maxHeight:'calc(100vh - 200px)',
            }}>
              <div style={{position:'sticky',top:0}}>
                <div style={{
                  fontSize:9,fontWeight:700,color:T.t3,
                  letterSpacing:'.4em',textTransform:'uppercase',
                  marginBottom:14,fontFamily:T.mono,
                }}>Request Example</div>

                <CodeBlock lang="cURL" title="cURL">
                  {doc.exampleRequest}
                </CodeBlock>

                <div style={{
                  fontSize:9,fontWeight:700,color:T.t3,
                  letterSpacing:'.4em',textTransform:'uppercase',
                  margin:'24px 0 14px',fontFamily:T.mono,
                }}>Response Example</div>

                <CodeBlock lang="JSON" title="JSON">
                  {doc.exampleResponse}
                </CodeBlock>

                {/* status pill */}
                <div style={{
                  marginTop:18,
                  display:'flex',alignItems:'center',gap:8,
                  background:'rgba(34,197,94,.06)',border:'1px solid rgba(34,197,94,.2)',
                  borderRadius:10,padding:'9px 12px',
                }}>
                  <IcoCheck size={13} stroke={T.green} sw={2.5}/>
                  <span style={{fontSize:10,fontWeight:700,color:'#86efac',letterSpacing:'.3em',textTransform:'uppercase'}}>
                    200 OK · Live endpoint
                  </span>
                </div>

                {/* sdk links */}
                <div style={{marginTop:20}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',
                    textTransform:'uppercase',marginBottom:10,fontFamily:T.mono}}>SDK Libraries</div>
                  <div style={{display:'flex',flexDirection:'column',gap:7}}>
                    {[
                      { lang:'Node.js', icon:'⬢', color:'#86efac' },
                      { lang:'Python',  icon:'🐍', color:'#60a5fa' },
                      { lang:'PHP',     icon:'🐘', color:'#c084fc' },
                    ].map(({lang,icon,color})=>(
                      <a key={lang} href="#" style={{
                        display:'flex',alignItems:'center',gap:9,
                        padding:'8px 11px',borderRadius:9,
                        background:'rgba(255,255,255,.03)',border:`1px solid ${T.border}`,
                        textDecoration:'none',transition:'all .2s',
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;}}
                      >
                        <span style={{fontSize:14}}>{icon}</span>
                        <span style={{color:T.t2,fontSize:12,fontWeight:600}}>{lang} SDK</span>
                        <IcoArrow size={12} stroke={T.t3} sw={2} style={{marginLeft:'auto'}}/>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>

      </div>
    </div>
  );
};

export default APIDocs;