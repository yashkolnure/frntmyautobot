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
    @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow   {0%,100%{box-shadow:0 0 20px rgba(99,102,241,.25)}50%{box-shadow:0 0 36px rgba(99,102,241,.5)}}

    .contact-grid {
      display:grid; grid-template-columns:1fr 1.1fr; gap:64px; align-items:start;
    }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

    .form-input {
      width:100%; padding:12px 14px;
      background:rgba(0,0,0,.35); border:1px solid ${T.border};
      border-radius:11px; color:${T.t1}; font-size:14px;
      font-family:${T.font}; transition:border-color .2s, box-shadow .2s;
    }
    .form-input:focus {
      outline:none; border-color:${T.borderH};
      box-shadow:0 0 0 3px rgba(99,102,241,.13);
    }
    .form-input::placeholder { color:${T.t3}; }

    .form-select {
      width:100%; padding:12px 14px;
      background:rgba(0,0,0,.35); border:1px solid ${T.border};
      border-radius:11px; color:${T.t1}; font-size:14px;
      font-family:${T.font}; cursor:pointer; appearance:none;
      transition:border-color .2s;
    }
    .form-select:focus { outline:none; border-color:${T.borderH}; }
    .form-select option { background:${T.bg3}; }

    .contact-info-item:hover .info-icon { background:linear-gradient(135deg,#4f46e5,#7c3aed)!important; border-color:transparent!important; }
    .contact-info-item:hover .info-icon svg { stroke:white!important; }

    @media(max-width:900px){
      .contact-grid { grid-template-columns:1fr; gap:40px; }
      .form-row     { grid-template-columns:1fr; }
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
const IcoMail   = p => <Ico {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const IcoPhone  = p => <Ico {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.7 2a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>;
const IcoPin    = p => <Ico {...p} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>;
const IcoClock  = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2"/>;
const IcoSend   = p => <Ico {...p} d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>;
const IcoArrow  = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoCheck  = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;
const IcoSpark  = p => <Ico {...p} d="M12 3l1.88 5.76a1 1 0 0 0 .95.69H21l-5 3.63a1 1 0 0 0-.36 1.12L17.52 20 12 16.37 6.48 20l1.88-5.8a1 1 0 0 0-.36-1.12L3 9.45h6.17a1 1 0 0 0 .95-.69L12 3z"/>;
const IcoChevD  = p => <Ico {...p} d="M6 9l6 6 6-6"/>;

// ─── FIELD LABEL ─────────────────────────────────────────────────────
const Label = ({ children }) => (
  <div style={{
    fontSize:9,fontWeight:700,color:T.t3,
    letterSpacing:'.45em',textTransform:'uppercase',
    marginBottom:7,marginLeft:2,fontFamily:T.font,
  }}>{children}</div>
);

// ─── CONTACT INFO ITEM ───────────────────────────────────────────────
const InfoItem = ({ iconPath, label, value, accent, href }) => (
  <div className="contact-info-item" style={{
    display:'flex',alignItems:'center',gap:16,
    padding:'16px 18px',
    background:T.bg2,border:`1px solid ${T.border}`,
    borderRadius:14,transition:'border-color .2s',
    cursor: href ? 'pointer' : 'default',
  }}
    onMouseEnter={e=>e.currentTarget.style.borderColor=accent+'55'}
    onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
    onClick={()=>href&&window.open(href)}
  >
    <div className="info-icon" style={{
      width:44,height:44,borderRadius:12,flexShrink:0,
      background:`${accent}18`,border:`1px solid ${accent}33`,
      display:'flex',alignItems:'center',justifyContent:'center',
      transition:'all .25s',
    }}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
        stroke={accent} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPath}/>
      </svg>
    </div>
    <div>
      <div style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.45em',textTransform:'uppercase',marginBottom:4,fontFamily:T.mono}}>{label}</div>
      <div style={{color:T.t1,fontWeight:700,fontSize:14}}>{value}</div>
    </div>
  </div>
);

// ─── PAGE ────────────────────────────────────────────────────────────
const Contact = () => {
  const [form,       setForm]       = useState({ name:'',email:'',subject:'General Inquiry',message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [hovSend,    setHovSend]    = useState(false);
  const [focusField, setFocusField] = useState(null);

  const handleChange = e => setForm(v=>({...v,[e.target.name]:e.target.value}));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    await new Promise(r=>setTimeout(r,1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  const infoItems = [
    {
      iconPath:'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
      label:'Email Support', value:'hello@myautobot.in', accent:'#a78bfa',
      href:'mailto:hello@myautobot.in',
    },
    {
      iconPath:'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.7 2a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
      label:'Call Our Office', value:'+91 98765 43210', accent:'#3b82f6',
      href:'tel:+919876543210',
    },
    {
      iconPath:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      label:'Headquarters', value:'Avenirya Solutions, Pune 411021', accent:'#22c55e',
    },
  ];

  return (
    <div style={{minHeight:'100vh',background:T.bg1,color:T.t2,fontFamily:T.font,overflowX:'hidden',paddingTop:96}}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'8%',right:'-6%',width:'54vw',height:'54vh',background:'radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',left:'-5%',width:'48vw',height:'48vh',background:'radial-gradient(circle,rgba(217,70,239,.07) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:1120,margin:'0 auto',padding:'48px 24px 96px'}}>

        {/* ── EYEBROW ── */}
        <div style={{textAlign:'center',marginBottom:52,animation:'slideUp .4s both'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(79,70,229,.1)',border:`1px solid rgba(99,102,241,.28)`,
            borderRadius:30,padding:'6px 16px',marginBottom:0,
          }}>
            <IcoSpark size={13} stroke={T.purpleL} sw={2}/>
            <span style={{color:T.purpleL,fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase'}}>Get in Touch</span>
          </div>
        </div>

        <div className="contact-grid">

          {/* ── LEFT: INFO ── */}
          <div style={{animation:'slideUp .45s both'}}>
            <h1 style={{
              fontSize:'clamp(36px,5.5vw,62px)',fontWeight:900,
              color:T.t1,letterSpacing:-2,lineHeight:1.06,marginBottom:18,
            }}>
              Talk to a{' '}
              <span style={{
                backgroundImage:'linear-gradient(135deg,#818cf8,#60a5fa,#a78bfa)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                backgroundSize:'200%',animation:'shim 5s linear infinite',
              }}>Human.</span>
            </h1>

            <p style={{fontSize:'clamp(14px,1.8vw,17px)',color:T.t2,lineHeight:1.8,maxWidth:400,marginBottom:36}}>
              Have a question about a custom plan or need technical help? Our team usually replies in{' '}
              <strong style={{color:T.t1,fontWeight:700}}>less than 2 hours.</strong>
            </p>

            {/* info items */}
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:28}}>
              {infoItems.map((item,i)=>(
                <InfoItem key={i} {...item}/>
              ))}
            </div>

            {/* status bar */}
            <div style={{
              background:T.bg2,border:`1px solid ${T.border}`,
              borderRadius:14,padding:'14px 18px',
              display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:T.green,
                  boxShadow:`0 0 8px ${T.green}`,display:'inline-block',animation:'pl 2s infinite'}}/>
                <span style={{fontSize:10,fontWeight:700,color:T.green,letterSpacing:'.4em',textTransform:'uppercase'}}>Support Online</span>
              </div>
              <div style={{width:1,height:16,background:T.border}}/>
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                  stroke={T.purpleL} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2"/>
                </svg>
                <span style={{fontSize:10,fontWeight:700,color:T.t3,letterSpacing:'.35em',textTransform:'uppercase',fontFamily:T.mono}}>
                  Avg Response: 1h 42m
                </span>
              </div>
            </div>

            {/* social links */}
            <div style={{marginTop:24}}>
              <div style={{fontSize:9,fontWeight:700,color:T.t3,letterSpacing:'.4em',textTransform:'uppercase',marginBottom:14}}>
                Also find us on
              </div>
              <div style={{display:'flex',gap:10}}>
                {[
                  {label:'WhatsApp',  color:'#22c55e', path:'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.126.549 4.123 1.514 5.86L.055 23.945l6.24-1.63A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z' },
                  {label:'Instagram', color:'#d946ef', path:'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z' },
                  {label:'LinkedIn',  color:'#3b82f6', path:'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
                ].map(({label,color,path})=>(
                  <a key={label} href="#" aria-label={label} style={{
                    width:36,height:36,borderRadius:10,
                    background:`${color}12`,border:`1px solid ${color}33`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    textDecoration:'none',transition:'all .2s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background=`${color}22`;e.currentTarget.style.borderColor=`${color}66`;e.currentTarget.style.transform='translateY(-2px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${color}12`;e.currentTarget.style.borderColor=`${color}33`;e.currentTarget.style.transform='translateY(0)';}}
                  >
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d={path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: FORM ── */}
          <div style={{position:'relative',animation:'slideUp .5s .1s both'}}>
            {/* form card glow */}
            <div style={{
              position:'absolute',inset:-2,borderRadius:24,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              opacity:.15,filter:'blur(16px)',
              pointerEvents:'none',zIndex:0,
              animation:'glow 4s ease-in-out infinite',
            }}/>

            <div style={{
              position:'relative',zIndex:1,
              background:`linear-gradient(160deg,rgba(13,11,30,.97),rgba(19,16,43,.95))`,
              border:`1px solid ${T.borderH}`,
              borderRadius:22,padding:'clamp(24px,4vw,40px)',
              boxShadow:`0 32px 72px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.1)`,
              overflow:'hidden',
            }}>
              {/* shimmer top line */}
              <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                background:'linear-gradient(90deg,transparent,rgba(99,102,241,.55),transparent)'}}/>

              {submitted ? (
                /* ── SUCCESS STATE ── */
                <div style={{textAlign:'center',padding:'40px 20px'}}>
                  <div style={{
                    width:64,height:64,borderRadius:20,
                    background:'rgba(34,197,94,.15)',border:'1px solid rgba(34,197,94,.4)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    margin:'0 auto 20px',
                  }}>
                    <IcoCheck size={28} stroke={T.green} sw={2.5}/>
                  </div>
                  <h3 style={{color:T.t1,fontWeight:800,fontSize:20,marginBottom:10,letterSpacing:-.3}}>
                    Message Sent!
                  </h3>
                  <p style={{color:T.t2,fontSize:14,lineHeight:1.7,marginBottom:24}}>
                    Thanks, {form.name.split(' ')[0]}! We've received your message and will reply to{' '}
                    <strong style={{color:T.t1}}>{form.email}</strong> within 2 hours.
                  </p>
                  <button onClick={()=>{setSubmitted(false);setForm({name:'',email:'',subject:'General Inquiry',message:''}); }} style={{
                    padding:'10px 22px',borderRadius:10,background:'rgba(255,255,255,.05)',
                    border:`1px solid ${T.border}`,color:T.t2,fontWeight:600,fontSize:13,
                    cursor:'pointer',fontFamily:T.font,transition:'all .2s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH;e.currentTarget.style.color=T.t1;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.t2;}}
                  >Send Another Message</button>
                </div>
              ) : (
                <>
                  <div style={{marginBottom:28}}>
                    <h3 style={{color:T.t1,fontWeight:800,fontSize:20,letterSpacing:-.3,marginBottom:6}}>
                      Send a Message
                    </h3>
                    <p style={{fontSize:12,fontWeight:700,color:T.t3,letterSpacing:'.3em',textTransform:'uppercase'}}>
                      We'll get back to you within 2 hours
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* name + email row */}
                    <div className="form-row" style={{marginBottom:16}}>
                      <div>
                        <Label>Your Name</Label>
                        <input name="name" type="text" className="form-input"
                          placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required/>
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <input name="email" type="email" className="form-input"
                          placeholder="rahul@company.com" value={form.email} onChange={handleChange} required/>
                      </div>
                    </div>

                    {/* subject */}
                    <div style={{marginBottom:16,position:'relative'}}>
                      <Label>Subject</Label>
                      <div style={{position:'relative'}}>
                        <select name="subject" className="form-select" value={form.subject} onChange={handleChange}>
                          <option>General Inquiry</option>
                          <option>Technical Support</option>
                          <option>Partnership / Sales</option>
                          <option>Billing & Tokens</option>
                          <option>API / Integration Help</option>
                          <option>Report an Issue</option>
                        </select>
                        <IcoChevD size={16} stroke={T.t3} sw={2}
                          style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                      </div>
                    </div>

                    {/* message */}
                    <div style={{marginBottom:22}}>
                      <Label>Message</Label>
                      <textarea name="message" rows={4} className="form-input"
                        placeholder="How can MyAutoBot help your business? Tell us about your use case, questions, or issues."
                        value={form.message} onChange={handleChange} required
                        style={{resize:'vertical',minHeight:110}}/>
                    </div>

                    {/* submit */}
                    <button type="submit" disabled={submitting}
                      onMouseEnter={()=>setHovSend(true)} onMouseLeave={()=>setHovSend(false)}
                      style={{
                        width:'100%',padding:'14px',borderRadius:12,border:'none',
                        background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                        color:'white',fontWeight:700,fontSize:15,
                        fontFamily:T.font,cursor:submitting?'not-allowed':'pointer',
                        display:'flex',alignItems:'center',justifyContent:'center',gap:9,
                        boxShadow: hovSend && !submitting
                          ? '0 8px 26px rgba(79,70,229,.65)'
                          : '0 4px 18px rgba(79,70,229,.42)',
                        transform: hovSend && !submitting ? 'translateY(-1px)' : 'translateY(0)',
                        transition:'all .2s',
                        opacity:submitting?.7:1,
                      }}>
                      {submitting ? (
                        <>
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth={2} strokeLinecap="round"
                            style={{animation:'spin .8s linear infinite'}}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <IcoSend size={15} stroke="rgba(255,255,255,.85)" sw={2}
                            style={{transition:'transform .2s',transform:hovSend?'translate(2px,-2px)':'translate(0,0)'}}/>
                        </>
                      )}
                    </button>

                    {/* trust note */}
                    <p style={{textAlign:'center',marginTop:14,fontSize:11,color:T.t3,lineHeight:1.6}}>
                      By submitting, you agree to our{' '}
                      <a href="/privacy" style={{color:T.purpleL,textDecoration:'none',fontWeight:600}}>Privacy Policy</a>.
                      {' '}We never share your info.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;