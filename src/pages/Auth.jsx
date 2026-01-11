import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Gift, Bot, Mail, Lock, User, ArrowRight, Key, 
  X, ChevronLeft, Loader2, Phone, Eye, EyeOff, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import axios from 'axios';
import { login, register, verifyOtp, requestPasswordReset } from '../api'; 

// --- Reusable Input Sub-component ---
const AuthInput = ({ icon: Icon, label, togglePassword, showPassword, statusIcon: StatusIcon, statusColor, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
      <input 
        {...props}
        className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 text-sm transition-all placeholder:text-slate-700" 
      />
      {togglePassword && (
        <button 
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors px-3"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      {StatusIcon && (
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${statusColor}`}>
          <StatusIcon size={18} className={StatusIcon === Loader2 ? "animate-spin" : ""} />
        </div>
      )}
    </div>
  </div>
);

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // --- AUTH STATES ---
  const [authMode, setAuthMode] = useState('login'); 
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  
  // --- FORM STATES ---
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', contact: '', refCode: '' 
  });

  // --- REFERRAL VALIDATION STATES ---
  const [refStatus, setRefStatus] = useState('idle'); 
  const [refOwner, setRefOwner] = useState("");

  // 1. Redirect if already authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard');
  }, [navigate]);

  // 2. SYNC AUTH MODE WITH URL (?id=register or ?id=login)
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam === 'register') {
      setAuthMode('register');
    } else if (idParam === 'login') {
      setAuthMode('login');
    }
  }, [searchParams]);

  // 3. Capture Referral Code from URL on Mount
  useEffect(() => {
    const urlRef = searchParams.get('ref');
    if (urlRef) {
      setFormData(prev => ({ ...prev, refCode: urlRef.toUpperCase() }));
      setAuthMode('register'); 
    }
  }, [searchParams]);

  // 4. Real-time Referral Check logic
  useEffect(() => {
    const checkCode = async () => {
      if (!formData.refCode || formData.refCode.length < 6) {
        setRefStatus('idle');
        return;
      }
      setRefStatus('checking');
      try {
        const res = await axios.get(`/api/auth/validate-ref/${formData.refCode}`);
        if (res.data.valid) {
          setRefStatus('valid');
          setRefOwner(res.data.owner);
        } else {
          setRefStatus('invalid');
        }
      } catch (err) {
        setRefStatus('invalid');
      }
    };
    const debounceTimer = setTimeout(checkCode, 600);
    return () => clearTimeout(debounceTimer);
  }, [formData.refCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase().trim() : 
               name === 'refCode' ? value.toUpperCase().trim() : value
    }));
  };

  const handleToggleMode = () => {
    const newMode = authMode === 'login' ? 'register' : 'login';
    setAuthMode(newMode);
    setError("");
    setMessage("");
    // Update URL to reflect the state change
    navigate(`/login?id=${newMode}`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (isOtpSent) {
      if (otp.length < 6) return setError("Incomplete verification code.");
      setLoading(true);
      try {
        const response = await verifyOtp({ email: formData.email, otp });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.user?.id);
          localStorage.setItem('userName', response.data.user?.name);
          setMessage("Identity verified. Accessing Neural Network...");
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired code.");
      } finally { setLoading(false); }
      return;
    }

    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) return setError("Security keys do not match.");
      if (formData.password.length < 6) return setError("Security key must be 6+ characters.");
      if (formData.refCode && refStatus === 'invalid') return setError("Please remove or correct the invalid referral code.");

      setLoading(true);
      try {
        await register(formData);
        setIsOtpSent(true);
        setMessage("Verification code dispatched to your inbox.");
      } catch (err) {
        setError(err.response?.data?.message || "Initialization failed.");
      } finally { setLoading(false); }
      return;
    }

    if (authMode === 'login') {
      setLoading(true);
      try {
        const response = await login({ email: formData.email, password: formData.password });
        const { data } = response;
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user?.id);
          localStorage.setItem('userName', data.user?.name);
          navigate('/dashboard');
        }
      } catch (err) {
        setError(err.response?.data?.message || "Access denied. Check credentials.");
      } finally { setLoading(false); }
      return;
    }

    if (authMode === 'forgot') {
      setLoading(true);
      try {
        await requestPasswordReset(formData.email);
        setMessage("Recovery sequence initiated. Check your inbox.");
      } catch (err) {
        setError("Recovery sequence failed.");
      } finally { setLoading(false); }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05010d] pt-20 px-6 py-12 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vh] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vh] bg-indigo-900/10 blur-[130px] rounded-full" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-[#0b031a]/60 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

          <div className="text-center mb-10">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-[#05010d] w-14 h-14 rounded-2xl border border-purple-500/50 flex items-center justify-center">
                {isOtpSent ? <ShieldCheck className="w-7 h-7 text-emerald-400" /> : 
                 authMode === 'forgot' ? <Key className="w-7 h-7 text-purple-400" /> : <Bot className="w-7 h-7 text-purple-400" />}
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2 italic">
              {isOtpSent ? 'Verify Node' : authMode === 'login' ? 'System Access' : authMode === 'register' ? 'New Instance' : 'Reset Access'}
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {isOtpSent ? `Sync code sent to ${formData.email}` : 
               authMode === 'login' ? 'Login to your dashboard' : authMode === 'register' ? 'Setup credentials' : 'Recover your node'}
            </p>

            {error && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse"><X size={14} /> {error}</div>}
            {message && <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold uppercase tracking-widest">{message}</div>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isOtpSent ? (
              <>
                {authMode === 'register' && (
                  <>
                    <AuthInput icon={User} label="Operator Name" name="name" type="text" placeholder="FULL NAME" required onChange={handleInputChange} />
                    <AuthInput icon={Phone} label="Contact (WhatsApp)" name="contact" type="tel" placeholder="+91 00000 00000" required onChange={handleInputChange} />
                  </>
                )}
                
                <AuthInput icon={Mail} label="Neural Identity" name="email" type="email" placeholder="name@gmail.com" required value={formData.email} onChange={handleInputChange} />

                {authMode !== 'forgot' && (
                  <>
                    <AuthInput icon={Lock} label="Security Key" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required onChange={handleInputChange} togglePassword={() => setShowPassword(!showPassword)} showPassword={showPassword} />
                    
                    {authMode === 'register' && (
                      <>
                        <AuthInput icon={Lock} label="Confirm Key" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" required onChange={handleInputChange} />
                        
                        <div className="pt-2">
                           <AuthInput 
                             icon={Gift} label="Referral Code (Optional)" name="refCode" type="text" placeholder="PROMO CODE" value={formData.refCode} onChange={handleInputChange}
                             statusIcon={refStatus === 'checking' ? Loader2 : refStatus === 'valid' ? CheckCircle2 : refStatus === 'invalid' ? X : null}
                             statusColor={refStatus === 'valid' ? 'text-emerald-400' : refStatus === 'invalid' ? 'text-red-400' : 'text-slate-500'}
                           />
                           {refStatus === 'valid' && (
                             <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">
                               Verified Node: Referred by {refOwner || 'Operator'} • +50 Tokens Added
                             </p>
                           )}
                           {refStatus === 'invalid' && (
                             <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest mt-2 ml-1">Invalid Protocol Code</p>
                           )}
                        </div>
                      </>
                    )}

                    {authMode === 'login' && (
                      <div className="flex justify-end">
                        <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-black text-slate-500 hover:text-purple-400 uppercase tracking-widest transition-colors">Forgot Key?</button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center gap-2">
                  <input 
                    name="otp" type="text" maxLength="6" placeholder="000000" required autoFocus
                    className="w-full max-w-[200px] text-center py-5 bg-black/40 border border-purple-500/30 rounded-2xl text-white text-3xl font-black tracking-[0.3em] outline-none focus:border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">Awaiting manual synchronization...</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full relative overflow-hidden bg-purple-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-purple-500 active:scale-95 flex items-center justify-center gap-3 mt-6 italic disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isOtpSent ? 'Confirm Sync' : authMode === 'login' ? 'Establish Link' : authMode === 'register' ? 'Initialize' : 'Transmit')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            {isOtpSent ? (
              <button type="button" onClick={() => setIsOtpSent(false)} className="text-xs font-black text-purple-400 hover:text-white uppercase tracking-widest transition-colors">
                Edit Identity Details
              </button>
            ) : (
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                {authMode === 'login' ? "New Operator?" : "Existing Node?"}
                <button type="button" onClick={handleToggleMode} className="text-purple-400 hover:text-white transition-colors ml-2 underline decoration-purple-500/30 underline-offset-4">
                  {authMode === 'login' ? 'Register Account' : 'Login Instead'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}