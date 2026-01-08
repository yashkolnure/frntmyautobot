import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Mail, Lock, User, ArrowRight, Key, 
  X, ChevronLeft, Loader2, Phone, Eye, EyeOff, ShieldCheck 
} from 'lucide-react';
import { login, register, verifyOtp, requestPasswordReset } from '../api'; 

// --- Reusable Input Sub-component ---
const AuthInput = ({ icon: Icon, label, togglePassword, showPassword, ...props }) => (
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
    </div>
  </div>
);

export default function Auth() {
  const [authMode, setAuthMode] = useState('login'); 
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', contact: '' 
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard');
  }, [navigate]);

  // Reset errors/OTP state when switching modes
  useEffect(() => {
    setError("");
    setMessage("");
    setIsOtpSent(false);
    setOtp("");
  }, [authMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase().trim() : value
    }));
  };

  // --- Neural Identity Validation ---
  const validateEmailProvider = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const authorizedProviders = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'live.com', 'msn.com'];
    const tempKeywords = ['mailinator', 'temp', 'disposable', '10minutemail', 'guerrilla', 'sharklasers', 'proton.me'];

    const isAuthorized = authorizedProviders.includes(domain);
    const isTemp = tempKeywords.some(kw => domain?.includes(kw));

    if (isTemp) return { valid: false, msg: "Temporary neural links prohibited." };
    
    // allow authorized providers OR custom professional domains (if not containing temp keywords)
    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // 1. Handling OTP Verification Stage
    if (isOtpSent) {
      if (otp.length < 6) return setError("Incomplete verification code.");
      setLoading(true);
      try {
        const response = await verifyOtp({ email: formData.email, otp });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          setMessage("Identity verified. Welcome to the network.");
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired code.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Handling Registration Start
    if (authMode === 'register') {
      const emailValidation = validateEmailProvider(formData.email);
      if (!emailValidation.valid) return setError(emailValidation.msg);
      if (formData.password !== formData.confirmPassword) return setError("Security keys do not match.");
      if (formData.password.length < 6) return setError("Key must be 6+ characters.");

      setLoading(true);
      try {
        await register(formData);
        setIsOtpSent(true);
        setMessage("Verification code dispatched to your inbox.");
      } catch (err) {
        setError(err.response?.data?.message || "Initialization failed.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. Handling Login
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
      } finally {
        setLoading(false);
      }
    }

    // 4. Password Reset
    if (authMode === 'forgot') {
      setLoading(true);
      try {
        await requestPasswordReset(formData.email);
        setMessage("Recovery sequence initiated. Check your inbox.");
      } catch (err) {
        setError(err.response?.data?.message || "Recovery failure.");
      } finally {
        setLoading(false);
      }
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
                
                <AuthInput 
                  icon={Mail} label="Neural Identity" name="email" type="email" 
                  placeholder="name@gmail.com" required value={formData.email} onChange={handleInputChange} 
                />

                {authMode !== 'forgot' && (
                  <>
                    <AuthInput 
                      icon={Lock} label="Security Key" name="password" 
                      type={showPassword ? "text" : "password"} placeholder="••••••••" required 
                      onChange={handleInputChange} togglePassword={() => setShowPassword(!showPassword)} showPassword={showPassword}
                    />
                    
                    {authMode === 'register' && (
                      <AuthInput icon={Lock} label="Confirm Key" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" required onChange={handleInputChange} />
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
            ) : authMode === 'forgot' ? (
              <button type="button" onClick={() => setAuthMode('login')} className="flex items-center gap-2 mx-auto text-xs font-black text-purple-400 hover:text-white uppercase tracking-widest transition-colors">
                <ChevronLeft size={14} /> Back to Terminal
              </button>
            ) : (
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                {authMode === 'login' ? "New Operator?" : "Existing Node?"}
                <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-purple-400 hover:text-white transition-colors ml-2 underline decoration-purple-500/30 underline-offset-4">
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