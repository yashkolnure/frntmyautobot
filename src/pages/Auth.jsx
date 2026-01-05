import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Mail, Lock, User, ArrowRight, Key, 
  X, ChevronLeft, Loader2, Phone, ShieldCheck
} from 'lucide-react';
import { login, register, requestPasswordReset } from '../api'; 

export default function Auth() {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    contact: '' 
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
    setMessage("");
  }, [authMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase().trim() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // --- NEURAL VALIDATION PROTOCOL ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.email) return setError("Email identity required.");
    if (!emailRegex.test(formData.email)) return setError("Invalid email protocol format.");

    if (authMode !== 'forgot') {
      if (!formData.password || formData.password.length < 6) {
        return setError("Security key must be at least 6 characters.");
      }
    }

    if (authMode === 'register') {
      if (!formData.name.trim()) return setError("Node name is mandatory.");
      if (!formData.contact.trim()) return setError("Contact route (WhatsApp) is required.");
      if (!phoneRegex.test(formData.contact.trim())) return setError("Invalid contact sequence.");
    }

    setLoading(true);

    try {
      if (authMode === 'forgot') {
        await requestPasswordReset(formData.email);
        setMessage("Recovery sequence initiated. Check your inbox.");
      } else {
        const { data } = authMode === 'login' 
  ? await login({ email: submissionData.email, password: submissionData.password }) 
  : await register(submissionData);

// Check what the data actually contains
console.log("Login Response Data:", data); 

if (data.token) {
  localStorage.setItem('token', data.token);
}

// Ensure you are drilling into the 'user' object
if (data.user && data.user.id) {
  localStorage.setItem('userId', data.user.id);
  localStorage.setItem('userName', data.user.name);
} else {
  console.error("User ID not found in response. Check Backend response structure.");
}
        // Strategic Redirection
        if (authMode === 'register') {
          navigate('/pricing');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Neural link failure. Connection timed out.");
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
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-[#05010d] w-14 h-14 rounded-2xl border border-purple-500/30 flex items-center justify-center shadow-lg">
                {authMode === 'forgot' ? (
                  <Key className="w-7 h-7 text-purple-400" />
                ) : authMode === 'register' ? (
                  <ShieldCheck className="w-7 h-7 text-purple-400" />
                ) : (
                  <Bot className="w-7 h-7 text-purple-400" />
                )}
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2 italic">
              {authMode === 'login' && 'System Access'}
              {authMode === 'register' && 'New Instance'}
              {authMode === 'forgot' && 'Access Recovery'}
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {authMode === 'login' && 'Decrypting your MyAutoBot workspace'}
              {authMode === 'register' && 'Configuring new node credentials'}
              {authMode === 'forgot' && 'Verifying identity for link restoration'}
            </p>
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <X size={12} /> {error}
              </div>
            )}
            {message && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                {message}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input 
                    name="name" type="text" placeholder="IDENTITY NAME" required
                    value={formData.name} onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-xs font-black tracking-widest placeholder:text-slate-700"
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input 
                    name="contact" type="tel" placeholder="UPLINK NUMBER (WHATSAPP)" required
                    value={formData.contact} onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-xs font-black tracking-widest placeholder:text-slate-700"
                  />
                </div>
              </>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
              <input 
                name="email" type="email" placeholder="EMAIL PROTOCOL" required
                value={formData.email} onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-xs font-black tracking-widest placeholder:text-slate-700"
              />
            </div>

            {authMode !== 'forgot' && (
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input 
                    name="password" type="password" placeholder="SECURITY KEY" required
                    value={formData.password} onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-xs font-black tracking-widest placeholder:text-slate-700"
                  />
                </div>
                {authMode === 'login' && (
                  <div className="flex justify-end">
                    <button 
                      type="button" onClick={() => setAuthMode('forgot')}
                      className="text-[9px] font-black text-slate-600 hover:text-purple-400 uppercase tracking-widest transition-colors"
                    >
                      Reset Key?
                    </button>
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full group relative overflow-hidden bg-purple-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all hover:bg-purple-500 active:scale-95 flex items-center justify-center gap-3 mt-6 italic">
              <span className="relative z-10">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  authMode === 'login' ? 'Establish Connection' : authMode === 'register' ? 'Initialize Instance' : 'Transmit Recovery'
                )}
              </span>
              {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            {authMode === 'forgot' ? (
              <button 
                type="button" onClick={() => setAuthMode('login')} 
                className="flex items-center gap-2 mx-auto text-[10px] font-black text-purple-400 hover:text-white uppercase tracking-widest transition-colors"
              >
                <ChevronLeft size={14} /> Back to Terminal
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                  {authMode === 'login' ? "New Operator?" : "Existing Node?"}
                  <button 
                    type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
                    className="text-purple-400 hover:text-white transition-colors ml-2 underline decoration-purple-500/20 underline-offset-4"
                  >
                    {authMode === 'login' ? 'Register Account' : 'Login Instead'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-center mt-8 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] opacity-40">
          Avenirya Solutions OPC Pvt Ltd • Secure Auth Protocol v2.0
        </p>
      </div>
    </div>
  );
}