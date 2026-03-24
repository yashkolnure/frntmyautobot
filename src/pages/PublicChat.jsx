import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Bot, Send, Loader2, User, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { getPublicBotInfo, sendPublicMessage } from '../api';

/**
 * PRODUCTION-GRADE PROFESSIONAL THEMES
 * 3 Lite (Executive, Luxe, Minimal)
 * 2 Dark (Slate, Oceanic)
 */
const THEME_MAP = {
  executive: { // Professional Light (Stripe/SaaS style)
    name: 'Executive White',
    chatBg: 'bg-slate-50', 
    cardBg: 'bg-white', 
    textMain: 'text-slate-900',
    textMuted: 'text-slate-500',
    header: 'bg-white border-b border-slate-200',
    headerIcon: 'bg-blue-600 text-white shadow-sm',
    input: 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-50',
    button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md font-semibold',
    bubbleUser: 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-sm',
    bubbleBot: 'bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl rounded-tl-none',
    loader: 'bg-blue-600',
    radius: 'rounded-xl'
  },
  luxe: { // Sophisticated Light (Hospitality/Premium)
    name: 'Luxe Ivory',
    chatBg: 'bg-[#fdfcfb]',
    cardBg: 'bg-white',
    textMain: 'text-[#2d2a26]',
    textMuted: 'text-[#a6a095]',
    header: 'bg-white border-b border-[#eeeae5]',
    headerIcon: 'bg-[#c5a059] text-white shadow-sm',
    input: 'bg-[#faf9f8] border-[#eeeae5] text-[#2d2a26] focus:border-[#c5a059]',
    button: 'bg-[#2d2a26] hover:bg-black text-white uppercase tracking-widest font-medium',
    bubbleUser: 'bg-[#c5a059] text-white rounded-lg rounded-tr-none',
    bubbleBot: 'bg-[#f5f1ed] text-[#2d2a26] border border-[#eeeae5] rounded-lg rounded-tl-none',
    loader: 'bg-[#c5a059]',
    radius: 'rounded-none'
  },
  minimal: { // Sharp Minimalist (Retail/Modern)
    name: 'Essential Light',
    chatBg: 'bg-white',
    cardBg: 'bg-white border-x border-slate-50',
    textMain: 'text-black',
    textMuted: 'text-slate-400',
    header: 'bg-white border-b border-slate-100',
    headerIcon: 'bg-black text-white',
    input: 'bg-slate-50 border-slate-100 text-black focus:border-black',
    button: 'bg-black hover:bg-zinc-800 text-white font-bold',
    bubbleUser: 'bg-black text-white rounded-none',
    bubbleBot: 'bg-slate-100 text-black rounded-none',
    loader: 'bg-black',
    radius: 'rounded-none'
  },
  slate: { // Modern Dark (Linear/GitHub style)
    name: 'Slate Midnight',
    chatBg: 'bg-[#09090b]',
    cardBg: 'bg-[#09090b]',
    textMain: 'text-zinc-100',
    textMuted: 'text-zinc-500',
    header: 'bg-[#09090b] border-b border-zinc-800',
    headerIcon: 'bg-zinc-100 text-black',
    input: 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600 focus:border-emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold',
    bubbleUser: 'bg-zinc-100 text-black rounded-xl rounded-tr-none',
    bubbleBot: 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl rounded-tl-none',
    loader: 'bg-emerald-500',
    radius: 'rounded-xl'
  },
  oceanic: { // Trust Dark (Enterprise style)
    name: 'Oceanic Blue',
    chatBg: 'bg-[#0f172a]',
    cardBg: 'bg-[#1e293b]',
    textMain: 'text-white',
    textMuted: 'text-slate-400',
    header: 'bg-[#1e293b] border-b border-slate-700',
    headerIcon: 'bg-sky-500 text-white shadow-sky-500/20',
    input: 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-sky-500',
    button: 'bg-sky-500 hover:bg-sky-400 text-white font-semibold',
    bubbleUser: 'bg-sky-500 text-white rounded-2xl rounded-tr-none shadow-lg',
    bubbleBot: 'bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl rounded-tl-none',
    loader: 'bg-sky-500',
    radius: 'rounded-2xl'
  }
};

export default function PublicChat() {
  const { botId } = useParams();
  const location = useLocation();
  const scrollRef = useRef();

  // URL Theme Detection
  const queryParams = new URLSearchParams(location.search);
  const activeThemeKey = queryParams.get('theme') || 'executive';
  const theme = THEME_MAP[activeThemeKey] || THEME_MAP.executive;

  const [botInfo, setBotInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [customerData, setCustomerData] = useState({ name: '', email: '' });

  useEffect(() => {
    const existingId = localStorage.getItem(`petoba_session_${botId}`);
    if (existingId) setShowLeadForm(false);

    const fetchInfo = async () => {
      try {
        const { data } = await getPublicBotInfo(botId);
        setBotInfo(data);
      } catch (err) { console.error("Identity fetch failed."); }
    };
    fetchInfo();
  }, [botId]);

  useEffect(() => {
    if (botInfo && !showLeadForm) {
      setMessages([{ 
        role: 'bot', 
        text: `Hello ${customerData.name || 'there'}. Welcome to ${botInfo.businessName}. How can I help you today?` 
      }]);
    }
  }, [botInfo, showLeadForm]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`petoba_session_${botId}`, `sid_${Date.now()}`);
    setShowLeadForm(false);
  };

 const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await sendPublicMessage(botId, userMsg, customerData.name, customerData);
      
      // If backend returns success: true
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (err) {
      console.error("Chat Error:", err);

      // --- TOKEN EXHAUSTION HANDLING (403) ---
      if (err.response?.status === 403) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'bot', 
            text: "The assistant has reached its maximum capacity (Tokens Exhausted) and is currently offline. Please try again later or contact the business owner." 
          }
        ]);
      } 
      // General Error Handling
      else {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'bot', 
            text: "I'm having trouble connecting to my neural network. Please check your connection and try again." 
          }
        ]);
      }
    } finally { 
      setLoading(false); 
    }
  };

  if (!botInfo) return (
    <div className={`h-screen flex items-center justify-center ${theme.chatBg}`}>
      <Loader2 className={`animate-spin ${theme.loader.replace('bg-', 'text-')}`} size={32} />
    </div>
  );

  return (
    <div className={`h-screen  ${theme.chatBg} flex flex-col items-center font-sans overflow-hidden transition-all duration-500 antialiased`}>
      <div className={`w-full max-w-2xl ${theme.cardBg} h-full shadow-2xl flex flex-col relative`}>
        
        {/* HEADER */}
        <header className={`px-6 py-4 ${theme.header} flex items-center justify-between sticky top-0 z-10`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${theme.headerIcon} rounded-xl flex items-center justify-center`}>
              <Bot size={20} />
            </div>
            <div>
              <h1 className={`font-bold tracking-tight text-sm md:text-base ${theme.textMain}`}>
                {botInfo.businessName}
              </h1>
              <span className={`text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${theme.textMuted}`}>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online
              </span>
            </div>
          </div>
          <Sparkles className={theme.textMuted} size={18} />
        </header>

        {showLeadForm ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/20">
            <div className={`p-8 md:p-12 ${theme.cardBg} rounded-[2rem] shadow-xl border ${theme.chatBg === 'bg-white' ? 'border-slate-100' : 'border-white/5'} w-full max-w-md animate-in zoom-in duration-500`}>
              <div className="text-center mb-10">
                <h2 className={`text-2xl font-bold mb-2 ${theme.textMain}`}>Welcome</h2>
                <p className={`${theme.textMuted} text-sm`}>Please identify yourself to begin the chat.</p>
              </div>
              
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted} ml-1`}>Your Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="text" className={`w-full ${theme.input} pl-11 pr-4 py-3.5 ${theme.radius} outline-none border transition-all text-sm`}
                      value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted} ml-1`}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="email" className={`w-full ${theme.input} pl-11 pr-4 py-3.5 ${theme.radius} outline-none border transition-all text-sm`}
                      value={customerData.email} onChange={(e) => setCustomerData({...customerData, email: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className={`w-full ${theme.button} py-4 ${theme.radius} mt-4 font-bold text-sm transition-all active:scale-[0.98]`}>
                  Start Conversation
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed font-medium shadow-sm transition-all ${msg.role === 'user' ? theme.bubbleUser : theme.bubbleBot}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`${theme.bubbleBot} px-4 py-3 flex gap-1.5 items-center`}>
                    {[0, 150, 300].map((d) => (
                      <span key={d} style={{ animationDelay: `${d}ms` }} className={`w-1.5 h-1.5 ${theme.loader} rounded-full animate-bounce opacity-40`} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* INPUT AREA */}
            <div className={`p-4 md:p-6 border-t ${theme.header} transition-all`}>
              <form onSubmit={handleSend} className="relative flex items-center gap-3">
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Ask a question..."
                  className={`flex-1 ${theme.input} px-5 py-3.5 ${theme.radius} outline-none border transition-all text-sm font-medium`} 
                />
                <button 
                   type="submit" 
                   disabled={loading || !input.trim()} 
                   className={`${theme.button} p-3.5 ${theme.radius} transition-all disabled:opacity-30 flex items-center justify-center`}
                >
                  <Send size={18} />
                </button>
              </form>
              <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                  <ShieldCheck size={12} className={theme.textMuted} />
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${theme.textMuted}`}>
                    Powered by MyAutoBot.in
                  </span>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}