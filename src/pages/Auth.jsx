import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { login, register, verifyOtp, requestPasswordReset } from '../api';

// ─── REPLACE WITH YOUR GOOGLE CLIENT ID ──────────────────────────────
const GOOGLE_CLIENT_ID = '49239973229-bn71ef53e5gtsv2eu9etj5fe14l512q5.apps.googleusercontent.com';

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
    @keyframes shim   {0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes pl     {0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes spin   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shake  {0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
    @keyframes glow   {0%,100%{box-shadow:0 0 18px rgba(124,58,237,.35)}50%{box-shadow:0 0 32px rgba(124,58,237,.6)}}

    .auth-input {
      width:100%; padding:13px 14px 13px 44px;
      background:rgba(0,0,0,.35);
      border:1px solid ${T.border};
      border-radius:12px;
      color:${T.t1};
      font-size:14px;
      font-family:${T.font};
      outline:none;
      transition:border-color .2s, box-shadow .2s;
    }
    .auth-input::placeholder { color:${T.t3}; }
    .auth-input:focus {
      border-color:${T.borderH};
      box-shadow:0 0 0 3px rgba(99,102,241,.12);
    }
    .auth-input.has-right { padding-right:44px; }
    .auth-btn-ghost:hover { background:rgba(99,102,241,.1)!important; color:${T.purpleL}!important; }

    .google-btn {
      width:100%;
      padding:13px 16px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.05);
      color:${T.t1};
      font-size:14px;
      font-weight:600;
      font-family:${T.font};
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:10px;
      transition:background .2s, border-color .2s, box-shadow .2s;
      letter-spacing:.1px;
    }
    .google-btn:hover:not(:disabled) {
      background:rgba(255,255,255,0.09);
      border-color:rgba(255,255,255,0.22);
      box-shadow:0 4px 16px rgba(0,0,0,.3);
    }
    .google-btn:disabled {
      opacity:.6;
      cursor:not-allowed;
    }

    .divider-row {
      display:flex;
      align-items:center;
      gap:12px;
      margin:22px 0;
    }
    .divider-line {
      flex:1;
      height:1px;
      background:rgba(255,255,255,.07);
    }
    .divider-label {
      font-size:11px;
      font-weight:600;
      color:${T.t3};
      letter-spacing:.35em;
      text-transform:uppercase;
      white-space:nowrap;
    }
  `}</style>
);

// ─── GOOGLE LOGO SVG ─────────────────────────────────────────────────
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// ─── GOOGLE AUTH HOOK ─────────────────────────────────────────────────
function useGoogleAuth({ onSuccess, onError }) {
  const [gsiReady, setGsiReady] = useState(false);

  useEffect(() => {
    // Load the Google Identity Services script once
    if (document.getElementById('gsi-script')) {
      if (window.google) setGsiReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!gsiReady || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        try {
          // Send the ID token to your backend
          const res = await axios.post('/api/auth/google', { credential });
          onSuccess(res.data);
        } catch (err) {
          onError(err.response?.data?.message || 'Google sign-in failed. Try again.');
        }
      },
    });
  }, [gsiReady, onSuccess, onError]);

  const signInWithGoogle = useCallback(() => {
    if (!gsiReady || !window.google) {
      onError('Google sign-in is not ready yet. Please wait a moment.');
      return;
    }
    window.google.accounts.id.prompt();
  }, [gsiReady, onError]);

  return { signInWithGoogle, gsiReady };
}

// ─── GOOGLE BUTTON ───────────────────────────────────────────────────
const GoogleBtn = ({ onClick, loading, disabled }) => (
  <button
    type="button"
    className="google-btn"
    onClick={onClick}
    disabled={loading || disabled}
  >
    {loading
      ? <IcoSpinner size={17} style={{ color: T.t3 }} />
      : <GoogleLogo />
    }
    {loading ? 'Connecting to Google…' : 'Continue with Google'}
  </button>
);

// ─── DIVIDER ─────────────────────────────────────────────────────────
const Divider = () => (
  <div className="divider-row">
    <div className="divider-line" />
    <span className="divider-label">or</span>
    <div className="divider-line" />
  </div>
);

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size=18, stroke='currentColor', fill='none', sw=1.8, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);
const IcoBot     = p => <Ico {...p} d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>;
const IcoKey     = p => <Ico {...p} d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>;
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoMail    = p => <Ico {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const IcoLock    = p => <Ico {...p} d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"/>;
const IcoUser    = p => <Ico {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>;
const IcoPhone   = p => <Ico {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.7 2a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>;
const IcoGift    = p => <Ico {...p} d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>;
const IcoArrow   = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7"/>;
const IcoX       = p => <Ico {...p} d="M18 6L6 18M6 6l12 12"/>;
const IcoCheck   = p => <Ico {...p} d="M20 6L9 17l-5-5"/>;
const IcoEye     = p => <Ico {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>;
const IcoEyeOff  = p => <Ico {...p} d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>;
const IcoBack    = p => <Ico {...p} d="M15 18l-6-6 6-6"/>;
const IcoSpinner = ({ size=18, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" style={{animation:'spin .8s linear infinite',...style}}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

// ─── FIELD LABEL ─────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <div style={{
    fontSize:9, fontWeight:700, color:T.t3,
    letterSpacing:'.45em', textTransform:'uppercase',
    marginBottom:7, marginLeft:2,
    fontFamily:T.font,
  }}>{children}</div>
);

// ─── AUTH INPUT ──────────────────────────────────────────────────────
const AuthInput = ({
  iconPath, label, togglePassword, showPassword,
  statusType, statusOwner, ...props
}) => {
  const statusEl = statusType === 'checking'
    ? <IcoSpinner size={16} style={{color:T.t3}}/>
    : statusType === 'valid'
      ? <IcoCheck size={16} stroke={T.green} sw={2.5}/>
      : statusType === 'invalid'
        ? <IcoX size={16} stroke={T.red} sw={2.5}/>
        : null;

  return (
    <div style={{marginBottom:18}}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{position:'relative'}}>
        <div style={{
          position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',
          pointerEvents:'none',color:T.t3,
          transition:'color .2s',zIndex:1,
        }}>
          <svg width={17} height={17} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d={iconPath}/>
          </svg>
        </div>
        <input
          {...props}
          className={`auth-input${togglePassword || statusEl ? ' has-right' : ''}`}
        />
        {togglePassword && (
          <button type="button" onClick={togglePassword} style={{
            position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',
            background:'none',border:'none',cursor:'pointer',
            color:T.t3,padding:4,display:'flex',
          }}>
            {showPassword
              ? <IcoEyeOff size={16} stroke={T.t3}/>
              : <IcoEye    size={16} stroke={T.t3}/>}
          </button>
        )}
        {!togglePassword && statusEl && (
          <div style={{
            position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',
          }}>{statusEl}</div>
        )}
      </div>
      {statusType === 'valid' && statusOwner && (
        <div style={{
          marginTop:6,marginLeft:4,
          fontSize:10,fontWeight:700,color:T.green,
          letterSpacing:'.4px',
          display:'flex',alignItems:'center',gap:5,
          animation:'pl 2s infinite',
        }}>
          <span style={{width:5,height:5,borderRadius:'50%',background:T.green,display:'inline-block'}}/>
          Referred by {statusOwner} · +50 Tokens Added
        </div>
      )}
      {statusType === 'invalid' && (
        <div style={{marginTop:6,marginLeft:4,fontSize:10,fontWeight:700,color:T.red,letterSpacing:'.4px'}}>
          Invalid referral code
        </div>
      )}
    </div>
  );
};

// ─── OTP INPUT ───────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => (
  <div style={{textAlign:'center',marginBottom:18}}>
    <input
      name="otp" type="text" maxLength={6}
      placeholder="000000" required autoFocus
      value={value}
      onChange={e => onChange(e.target.value.replace(/\D/g,''))}
      style={{
        width:180,
        padding:'16px 14px',
        background:'rgba(0,0,0,.4)',
        border:`1px solid ${T.borderH}`,
        borderRadius:14,
        color:T.t1,
        fontSize:28, fontWeight:900,
        letterSpacing:'0.35em',
        textAlign:'center',
        outline:'none',
        fontFamily:T.mono,
        boxShadow:'0 0 22px rgba(99,102,241,.18)',
        transition:'box-shadow .2s',
      }}
    />
    <div style={{
      marginTop:10,
      fontSize:10,fontWeight:700,color:T.t3,
      letterSpacing:'.4em',textTransform:'uppercase',
    }}>Enter 6-digit verification code</div>
  </div>
);

// ─── MAIN ────────────────────────────────────────────────────────────
export default function Auth() {
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();

  const [authMode,     setAuthMode]     = useState('login');
  const [isOtpSent,    setIsOtpSent]    = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [gLoading,     setGLoading]     = useState(false); // Google-specific loading
  const [error,        setError]        = useState('');
  const [message,      setMessage]      = useState('');
  const [otp,          setOtp]          = useState('');
  const [shake,        setShake]        = useState(false);
  const [formData, setFormData] = useState({
    name:'', email:'', password:'', confirmPassword:'', contact:'', refCode:'',
  });
  const [refStatus, setRefStatus] = useState('idle');
  const [refOwner,  setRefOwner]  = useState('');

  // ── Google OAuth callbacks
  const handleGoogleSuccess = useCallback((data) => {
    setGLoading(false);
    if (data.token) {
      localStorage.setItem('token',    data.token);
      localStorage.setItem('userId',   data.user?.id);
      localStorage.setItem('userName', data.user?.name);
      setMessage('Google sign-in successful. Redirecting…');
      setTimeout(() => navigate('/dashboard'), 1200);
    }
  }, [navigate]);

  const handleGoogleError = useCallback((msg) => {
    setGLoading(false);
    triggerError(msg);
  }, []);

  const { signInWithGoogle, gsiReady } = useGoogleAuth({
    onSuccess: handleGoogleSuccess,
    onError:   handleGoogleError,
  });

  const handleGoogleClick = () => {
    setError(''); setMessage('');
    setGLoading(true);
    // prompt() is async via callback; reset gLoading after timeout in case prompt is dismissed
    setTimeout(() => setGLoading(false), 8000);
    signInWithGoogle();
  };

  // redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard');
  }, [navigate]);

  // sync mode from URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id === 'register') setAuthMode('register');
    else if (id === 'login') setAuthMode('login');
  }, [searchParams]);

  // capture ref from URL
  useEffect(() => {
    const urlRef = searchParams.get('ref');
    if (urlRef) {
      setFormData(prev => ({ ...prev, refCode: urlRef.toUpperCase() }));
      setAuthMode('register');
    }
  }, [searchParams]);

  // real-time ref check
  useEffect(() => {
    const check = async () => {
      if (!formData.refCode || formData.refCode.length < 6) { setRefStatus('idle'); return; }
      setRefStatus('checking');
      try {
        const res = await axios.get(`/api/auth/validate-ref/${formData.refCode}`);
        if (res.data.valid) { setRefStatus('valid'); setRefOwner(res.data.owner); }
        else setRefStatus('invalid');
      } catch { setRefStatus('invalid'); }
    };
    const t = setTimeout(check, 600);
    return () => clearTimeout(t);
  }, [formData.refCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email'   ? value.toLowerCase().trim()
             : name === 'refCode' ? value.toUpperCase().trim()
             : value,
    }));
  };

  const triggerError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleToggleMode = () => {
    const next = authMode === 'login' ? 'register' : 'login';
    setAuthMode(next); setError(''); setMessage('');
    navigate(`/login?id=${next}`, { replace:true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');

    if (isOtpSent) {
      if (otp.length < 6) return triggerError('Incomplete verification code.');
      setLoading(true);
      try {
        const res = await verifyOtp({ email: formData.email, otp });
        if (res.data.token) {
          localStorage.setItem('token',    res.data.token);
          localStorage.setItem('userId',   res.data.user?.id);
          localStorage.setItem('userName', res.data.user?.name);
          setMessage('Identity verified. Redirecting to dashboard…');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } catch (err) { triggerError(err.response?.data?.message || 'Invalid or expired code.'); }
      finally { setLoading(false); }
      return;
    }

    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) return triggerError('Passwords do not match.');
      if (formData.password.length < 6) return triggerError('Password must be 6+ characters.');
      if (formData.refCode && refStatus === 'invalid') return triggerError('Remove or correct the invalid referral code.');
      setLoading(true);
      try {
        await register(formData);
        setIsOtpSent(true);
        setMessage('Verification code sent to your inbox.');
      } catch (err) { triggerError(err.response?.data?.message || 'Registration failed. Try again.'); }
      finally { setLoading(false); }
      return;
    }

    if (authMode === 'login') {
      setLoading(true);
      try {
        const res = await login({ email: formData.email, password: formData.password });
        if (res.data.token) {
          localStorage.setItem('token',    res.data.token);
          localStorage.setItem('userId',   res.data.user?.id);
          localStorage.setItem('userName', res.data.user?.name);
          navigate('/dashboard');
        }
      } catch (err) { triggerError(err.response?.data?.message || 'Invalid credentials. Please try again.'); }
      finally { setLoading(false); }
      return;
    }

    if (authMode === 'forgot') {
      setLoading(true);
      try {
        await requestPasswordReset(formData.email);
        setMessage('Password reset link sent. Check your inbox.');
      } catch { triggerError('Reset request failed. Try again.'); }
      finally { setLoading(false); }
    }
  };

  // ── dynamic copy
  const titles = {
    login:'Welcome Back', register:'Create Account',
    forgot:'Reset Password', otp:'Verify Email',
  };
  const subtitles = {
    login:'Sign in to your dashboard',
    register:'Set up your AI agent in minutes',
    forgot:'We\'ll send a reset link to your inbox',
    otp:`Code sent to ${formData.email}`,
  };
  const btnLabels = {
    login:'Sign In', register:'Create Account',
    forgot:'Send Reset Link', otp:'Verify & Continue',
  };
  const activeKey = isOtpSent ? 'otp' : authMode;

  const HeaderIcon = () => {
    if (isOtpSent) return <IcoShield size={22} stroke={T.green} sw={1.9}/>;
    if (authMode === 'forgot') return <IcoKey size={22} stroke={T.purpleL} sw={1.9}/>;
    return <IcoBot size={22} stroke={T.purpleL} sw={1.9}/>;
  };

  const PATHS = {
    user:  "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.7 2a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    mail:  "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    lock:  "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
    gift:  "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  };

  // Show Google button only on login/register, not on forgot or OTP screens
  const showGoogleOAuth = !isOtpSent && authMode !== 'forgot';

  return (
    <div style={{
      minHeight:'100vh',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:T.bg1, fontFamily:T.font,
      padding:'96px 20px 48px',
      position:'relative', overflowX:'hidden',
    }}>
      <GlobalCSS/>

      {/* AMBIENT GLOW */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'-8%',width:'55vw',height:'55vh',background:'radial-gradient(circle,rgba(79,70,229,.13) 0%,transparent 70%)',borderRadius:'50%'}}/>
        <div style={{position:'absolute',bottom:'-8%',right:'-6%',width:'50vw',height:'50vh',background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)',borderRadius:'50%'}}/>
      </div>

      <div style={{
        width:'100%', maxWidth:480,
        position:'relative', zIndex:1,
        animation:'slideUp .45s both',
      }}>

        {/* ── CARD ── */}
        <div style={{
          background:`linear-gradient(160deg,rgba(13,11,30,.97),rgba(19,16,43,.95))`,
          border:`1px solid ${T.borderH}`,
          borderRadius:22,
          padding:'clamp(28px,5vw,44px)',
          boxShadow:`0 32px 72px rgba(0,0,0,.7), 0 0 0 1px rgba(99,102,241,.1)`,
          position:'relative', overflow:'hidden',
          animation: shake ? 'shake .4s ease' : 'none',
        }}>

          {/* top shimmer line */}
          <div style={{
            position:'absolute',top:0,left:0,right:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(99,102,241,.6),transparent)',
            pointerEvents:'none',
          }}/>

          {/* corner glow */}
          <div style={{
            position:'absolute',top:-40,right:-40,width:180,height:180,
            background:'radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 70%)',
            pointerEvents:'none',
          }}/>

          {/* ── HEADER ── */}
          <div style={{textAlign:'center',marginBottom:32,position:'relative',zIndex:1}}>
            <div style={{
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              width:54,height:54,borderRadius:16,
              background: isOtpSent
                ? 'rgba(34,197,94,.15)'
                : authMode === 'forgot'
                  ? 'rgba(124,58,237,.15)'
                  : 'rgba(79,70,229,.2)',
              border:`1px solid ${isOtpSent ? 'rgba(34,197,94,.4)' : T.borderH}`,
              marginBottom:16,
              boxShadow: isOtpSent
                ? '0 0 22px rgba(34,197,94,.25)'
                : '0 0 22px rgba(79,70,229,.3)',
              animation:'glow 3s ease-in-out infinite',
            }}>
              <HeaderIcon/>
            </div>

            <h1 style={{
              fontSize:'clamp(22px,3vw,28px)',
              fontWeight:900,color:T.t1,
              letterSpacing:-.6,marginBottom:7,
            }}>{titles[activeKey]}</h1>

            <p style={{
              fontSize:11,fontWeight:600,color:T.t3,
              letterSpacing:'.35em',textTransform:'uppercase',
            }}>{subtitles[activeKey]}</p>
          </div>

          {/* ── ALERTS ── */}
          {error && (
            <div style={{
              marginBottom:20,padding:'12px 16px',
              background:'rgba(239,68,68,.08)',
              border:'1px solid rgba(239,68,68,.28)',
              borderRadius:12,
              display:'flex',alignItems:'center',gap:9,
              color:'#fca5a5',fontSize:12,fontWeight:600,
            }}>
              <IcoX size={14} stroke="#f87171" sw={2.5}/>
              {error}
            </div>
          )}
          {message && (
            <div style={{
              marginBottom:20,padding:'12px 16px',
              background:'rgba(34,197,94,.08)',
              border:'1px solid rgba(34,197,94,.28)',
              borderRadius:12,
              display:'flex',alignItems:'center',gap:9,
              color:'#86efac',fontSize:12,fontWeight:600,
            }}>
              <IcoCheck size={14} stroke={T.green} sw={2.5}/>
              {message}
            </div>
          )}

          {/* ── GOOGLE OAUTH (login + register only) ── */}
          {showGoogleOAuth && (
            <div style={{marginBottom:4,position:'relative',zIndex:1}}>
              <GoogleBtn
                onClick={handleGoogleClick}
                loading={gLoading}
                disabled={!gsiReady || loading}
              />
              <Divider />
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} style={{position:'relative',zIndex:1}}>

            {!isOtpSent ? (
              <>
                {authMode === 'register' && (
                  <>
                    <AuthInput
                      iconPath={PATHS.user} label="Full Name"
                      name="name" type="text" placeholder="Your full name"
                      required onChange={handleInputChange}
                    />
                    <AuthInput
                      iconPath={PATHS.phone} label="WhatsApp Number"
                      name="contact" type="tel" placeholder="+91 00000 00000"
                      required onChange={handleInputChange}
                    />
                  </>
                )}

                <AuthInput
                  iconPath={PATHS.mail} label="Email Address"
                  name="email" type="email" placeholder="you@example.com"
                  required value={formData.email} onChange={handleInputChange}
                />

                {authMode !== 'forgot' && (
                  <>
                    <AuthInput
                      iconPath={PATHS.lock} label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      required onChange={handleInputChange}
                      togglePassword={() => setShowPassword(v => !v)}
                      showPassword={showPassword}
                    />

                    {authMode === 'register' && (
                      <>
                        <AuthInput
                          iconPath={PATHS.lock} label="Confirm Password"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          required onChange={handleInputChange}
                        />
                        <AuthInput
                          iconPath={PATHS.gift} label="Referral Code (optional)"
                          name="refCode" type="text"
                          placeholder="PROMO CODE"
                          value={formData.refCode} onChange={handleInputChange}
                          statusType={refStatus !== 'idle' ? refStatus : undefined}
                          statusOwner={refOwner}
                        />
                      </>
                    )}

                    {authMode === 'login' && (
                      <div style={{textAlign:'right',marginTop:-8,marginBottom:20}}>
                        <button type="button"
                          onClick={() => { setAuthMode('forgot'); setError(''); setMessage(''); }}
                          style={{
                            background:'none',border:'none',cursor:'pointer',
                            fontSize:12,fontWeight:600,color:T.t3,
                            fontFamily:T.font,transition:'color .2s',
                          }}
                          onMouseEnter={e=>e.target.style.color=T.purpleL}
                          onMouseLeave={e=>e.target.style.color=T.t3}
                        >Forgot password?</button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <OtpInput value={otp} onChange={setOtp}/>
            )}

            {/* ── SUBMIT ── */}
            <button type="submit" disabled={loading} style={{
              width:'100%',
              padding:'14px',
              borderRadius:12,
              border:'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              color:'white',
              fontWeight:700, fontSize:14,
              fontFamily:T.font,
              letterSpacing:'.2px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow:'0 4px 18px rgba(79,70,229,.45)',
              transition:'all .2s',
              opacity: loading ? .7 : 1,
              marginTop:4,
            }}
              onMouseEnter={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 6px 24px rgba(79,70,229,.6)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 18px rgba(79,70,229,.45)'; }}
            >
              {loading
                ? <><IcoSpinner size={17}/> Please wait…</>
                : <>{btnLabels[activeKey]}<IcoArrow size={16} stroke="rgba(255,255,255,.85)" sw={2.2}/></>
              }
            </button>
          </form>

          {/* ── FOOTER ── */}
          <div style={{
            marginTop:24,paddingTop:20,
            borderTop:`1px solid rgba(255,255,255,.05)`,
            textAlign:'center',
            position:'relative',zIndex:1,
          }}>
            {isOtpSent ? (
              <button type="button"
                onClick={() => { setIsOtpSent(false); setOtp(''); setError(''); setMessage(''); }}
                style={{
                  background:'none',border:'none',cursor:'pointer',
                  fontSize:12,fontWeight:600,color:T.t3,
                  fontFamily:T.font,display:'inline-flex',alignItems:'center',gap:5,
                  transition:'color .2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.color=T.t1}
                onMouseLeave={e=>e.currentTarget.style.color=T.t3}
              >
                <IcoBack size={14} stroke="currentColor" sw={2}/> Edit email address
              </button>
            ) : authMode === 'forgot' ? (
              <button type="button"
                onClick={() => { setAuthMode('login'); setError(''); setMessage(''); }}
                style={{
                  background:'none',border:'none',cursor:'pointer',
                  fontSize:12,fontWeight:600,color:T.t3,
                  fontFamily:T.font,display:'inline-flex',alignItems:'center',gap:5,
                  transition:'color .2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.color=T.t1}
                onMouseLeave={e=>e.currentTarget.style.color=T.t3}
              >
                <IcoBack size={14} stroke="currentColor" sw={2}/> Back to sign in
              </button>
            ) : (
              <p style={{fontSize:13,color:T.t3,fontWeight:500}}>
                {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <button type="button" onClick={handleToggleMode} style={{
                  background:'none',border:'none',cursor:'pointer',
                  fontFamily:T.font,fontSize:13,fontWeight:700,
                  color:T.purpleL,transition:'color .2s',
                }}
                  onMouseEnter={e=>e.target.style.color=T.t1}
                  onMouseLeave={e=>e.target.style.color=T.purpleL}
                >
                  {authMode === 'login' ? 'Create account' : 'Sign in instead'}
                </button>
              </p>
            )}
          </div>

          {/* trust note */}
          <div style={{
            marginTop:20,
            display:'flex',alignItems:'center',justifyContent:'center',gap:7,
            color:T.t3,fontSize:11,fontWeight:500,
          }}>
            <IcoShield size={12} stroke={T.t3} sw={1.8}/>
            Secured by Avenirya · Official Meta Tech Provider
          </div>

        </div>

        {/* register bonus pill */}
        {authMode === 'register' && !isOtpSent && (
          <div style={{
            marginTop:16,
            display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            background:'rgba(34,197,94,.08)',border:'1px solid rgba(34,197,94,.25)',
            borderRadius:30,padding:'9px 18px',
            animation:'slideUp .5s .1s both',
          }}>
            <span style={{width:6,height:6,borderRadius:'50%',background:T.green,boxShadow:`0 0 7px ${T.green}`,display:'inline-block',animation:'pl 2s infinite'}}/>
            <span style={{color:'#86efac',fontSize:12,fontWeight:700}}>
              🎁 You'll receive 500 free tokens on signup — no credit card needed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}