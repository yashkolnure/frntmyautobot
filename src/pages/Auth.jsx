import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, User, ArrowRight, Key, X, ChevronLeft, Loader2 } from 'lucide-react';
import { login, register, requestPasswordReset } from '../api'; 

export default function Auth() {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset errors and messages when switching modes
  useEffect(() => {
    setError("");
    setMessage("");
  }, [authMode]);

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value.toLowerCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const submissionData = {
      ...formData,
      email: formData.email.toLowerCase().trim()
    };

    try {
      if (authMode === 'forgot') {
        await requestPasswordReset(submissionData.email);
        setMessage("A password reset link has been sent to your email inbox.");
      } else {
        // 1. Perform API Authentication
        const { data } = authMode === 'login' 
          ? await login(submissionData) 
          : await register(submissionData);
        
        // 2. Securely store the token
        localStorage.setItem('token', data.token); 

        // 3. Strategic Redirection Flow
        if (authMode === 'register') {
          // New users must select an AI Plan first
          navigate('/pricing');
        } else {
          // Returning users go straight to their bots
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Handle server-side errors
      setError(err.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05010d] pt-10 px-6 py-12 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vh] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vh] bg-indigo-900/10 blur-[130px] rounded-full" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-[#0b031a]/60 mt-10 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Progress Indicator Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

          <div className="text-center mb-10">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-[#05010d] w-14 h-14 rounded-2xl border border-purple-500/50 flex items-center justify-center shadow-lg">
                {authMode === 'forgot' ? <Key className="w-7 h-7 text-purple-400" /> : <Bot className="w-7 h-7 text-purple-400" />}
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2 italic">
              {authMode === 'login' && 'Welcome Back'}
              {authMode === 'register' && 'Create Account'}
              {authMode === 'forgot' && 'Reset Access'}
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {authMode === 'login' && 'Login to access your MyAutoBot dashboard'}
              {authMode === 'register' && 'Step 1: Setup your credentials'}
              {authMode === 'forgot' && 'Identify your account to recover access'}
            </p>
            
            {/* Notifications */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <X size={14} /> {error}
              </div>
            )}
            {message && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                {message}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input 
                  type="text" placeholder="FULL NAME" required
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-xs font-black tracking-widest"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
              <input 
                type="email" placeholder="EMAIL ADDRESS" required
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-xs font-black tracking-widest"
                value={formData.email}
                onChange={handleEmailChange}
              />
            </div>

            {authMode !== 'forgot' && (
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input 
                    type="password" placeholder="PASSWORD" required
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-xs font-black tracking-widest"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                {authMode === 'login' && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[9px] font-black text-slate-500 hover:text-purple-400 uppercase tracking-widest transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full group relative overflow-hidden bg-purple-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:bg-purple-500 active:scale-95 flex items-center justify-center gap-3 mt-6 italic">
              <span className="relative z-10">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  authMode === 'login' ? 'Sign In to Dashboard' : authMode === 'register' ? 'Next: Choose Your Plan' : 'Send Recovery Link'
                )}
              </span>
              {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
              
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            {authMode === 'forgot' ? (
              <button 
                type="button"
                onClick={() => setAuthMode('login')} 
                className="flex items-center gap-2 mx-auto text-[10px] font-black text-purple-400 hover:text-white uppercase tracking-widest transition-colors"
              >
                <ChevronLeft size={14} /> Return to Login
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  {authMode === 'login' ? "New to MyAutoBot?" : "Already joined us?"}
                  <button 
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
                    className="text-purple-400 hover:text-white transition-colors ml-2 underline decoration-purple-500/30 underline-offset-4"
                  >
                    {authMode === 'login' ? 'Register Account' : 'Login Instead'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center mt-8 text-[9px] font-black text-slate-600 uppercase tracking-widest opacity-50">
          Avenirya Solutions OPC Pvt Ltd • Secure Auth Protocol v2.0
        </p>
      </div>
    </div>
  );
}