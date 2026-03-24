import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Instagram, MessageCircle, User, Bot, ShieldCheck, 
  Smartphone, MoreVertical, Paperclip, Loader2, RefreshCcw,
  Layout, Settings, BarChart3, CheckCircle2, FileText, X
} from 'lucide-react';

// --- CONFIGURATION ---
const META_CONFIG = {
  PHONE_NUMBER_ID: "1001284909724845",
  ACCESS_TOKEN: "EAAWSUlBr3l4BQuE57BLBSdZCKTQZA4ZCthJBWiRZACNUZAnHDR2k6Gl5aaAaTf20XzNU0QSs9rpI4DiS9yZC1CBx5SQEki6hUut7HnZCUUjiuZAHZBjC6jTZBmwWZCGGpHv8S2ukzNZCWIlO85DCGztuoAxb0EoroIOPDi2n0YZAD3pkxuNbrevSg4eMZBG5TAITWtfgNcm33NjKeme0p2ZAzziTZCXP3uov97EZBo4d3f3FicYzZAqOpiyLQOXR7byHBjM9HN4dhaYmghNgICK3ZACG5GAc7JgTTZA4ZAzWzl1zgjwZDZD", 
  RECIPIENT_NUMBER: "918767640530",
};

const ACTUAL_TEMPLATES = [
  { id: 'welcome', name: 'hello_world', category: 'UTILITY', content: 'Welcome to MyAutoBot! How can we assist you today?', status: 'APPROVED' },
  { id: 'order', name: 'order_update', category: 'TRANSACTIONAL', content: 'Your order #12345 has been shipped and is on its way!', status: 'APPROVED' },
  { id: 'auth', name: 'verification_code', category: 'AUTHENTICATION', content: 'Your MyAutoBot login code is: 552190.', status: 'APPROVED' }
];

const WhatsAppReviewDashboard = () => {
  const [currentTab, setCurrentTab] = useState('messaging'); // messaging | management
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "MyAutoBot Core Online. Asset Sync Complete.", sender: 'ai', time: '10:00 AM', type: 'outgoing' }
  ]);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', msg: 'System Ready' });
  const scrollRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // --- CORE LOGIC: META API CALL ---
  const callMetaAPI = async (text, templateName = null) => {
    setStatus({ type: 'loading', msg: 'Invoking Meta Graph API...' });
    
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: META_CONFIG.RECIPIENT_NUMBER,
      type: templateName ? "template" : "text",
    };

    if (templateName) {
      payload.template = { name: templateName, language: { code: "en_US" } };
    } else {
      payload.text = { body: text };
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${META_CONFIG.PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${META_CONFIG.ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.messages) {
        setStatus({ type: 'success', msg: `API SUCCESS: ID ${data.messages[0].id}` });
        return true;
      }
      setStatus({ type: 'error', msg: `API ERROR: ${data.error?.message || 'Unknown'}` });
      return false;
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network Error' });
      return false;
    }
  };

  // --- LOGIC: AI AUTO-REPLY TRIGGER ---
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    // Only trigger if last message is from client AND we are in AI Mode
    if (lastMsg?.sender === 'client' && !isHumanMode) {
      setIsTyping(true);
      setTimeout(async () => {
        const aiResponse = "I have received your request. Our system is verifying your WhatsApp Business Assets now.";
        
        // 1. Update UI
        setMessages(prev => [...prev, { id: Date.now(), text: aiResponse, sender: 'ai', time: new Date().toLocaleTimeString(), type: 'outgoing' }]);
        setLogs(prev => [{ id: Date.now(), mode: 'AI_AGENT_AUTO', content: aiResponse, timestamp: new Date().toLocaleTimeString() }, ...prev]);
        
        // 2. Call Real API
        await callMetaAPI(aiResponse);
        setIsTyping(false);
      }, 2000);
    }
  }, [messages, isHumanMode]);

  const handleManualSend = async (textOverride = null) => {
    const content = textOverride || input;
    if (!content) return;

    const modeLabel = textOverride ? 'MANAGED_TEMPLATE' : (isHumanMode ? 'HUMAN_AGENT' : 'AI_AGENT');
    
    // Add to UI
    setMessages(prev => [...prev, { id: Date.now(), text: content, sender: isHumanMode ? 'human' : 'ai', time: new Date().toLocaleTimeString(), type: 'outgoing' }]);
    setLogs(prev => [{ id: Date.now(), mode: modeLabel, content, timestamp: new Date().toLocaleTimeString() }, ...prev]);

    // Call API (If template, find the name)
    const templateObj = textOverride ? ACTUAL_TEMPLATES.find(t => t.content === textOverride) : null;
    await callMetaAPI(content, templateObj?.name);
    
    setInput("");
    setShowTemplates(false);
  };

  const simulateIncoming = () => {
    const text = "Hi, I want to test the MyAutoBot integration.";
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'client', time: new Date().toLocaleTimeString(), type: 'incoming' }]);
    setLogs(prev => [{ id: Date.now(), mode: 'INCOMING_WEBHOOK', content: text, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-300 p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP STATUS BANNER */}
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-4 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="text-indigo-500 w-6 h-6" />
            <span>App Review Protocol: <span className="text-white tracking-normal">whatsapp_business_management</span></span>
          </div>
          <button onClick={simulateIncoming} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
            <RefreshCcw size={14} /> Simulate Incoming Webhook
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8 border-b border-slate-800/50 pb-6">
          <button onClick={() => setCurrentTab('messaging')} className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${currentTab === 'messaging' ? 'bg-white/5 text-white border border-slate-700' : 'text-slate-500'}`}>1. MESSAGING CONSOLE</button>
          <button onClick={() => setCurrentTab('management')} className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${currentTab === 'management' ? 'bg-white/5 text-white border border-slate-700' : 'text-slate-500'}`}>2. ASSET MANAGEMENT</button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: MAIN ACTION AREA */}
          <div className="lg:col-span-7 space-y-6">
            {currentTab === 'messaging' ? (
              <div className="animate-in fade-in duration-500">
                <div className="flex bg-[#111625] p-1.5 rounded-2xl border border-slate-800 mb-6 max-w-sm">
                  <button onClick={() => setIsHumanMode(false)} className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${!isHumanMode ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>AI MODE</button>
                  <button onClick={() => setIsHumanMode(true)} className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${isHumanMode ? 'bg-amber-600 text-white' : 'text-slate-500'}`}>HUMAN AGENT</button>
                </div>

                <div className={`flex flex-col h-[550px] rounded-3xl border overflow-hidden shadow-2xl relative transition-all duration-500 ${isHumanMode ? 'bg-[#120f0a] border-amber-900/30' : 'bg-[#0f121d] border-slate-800'}`}>
                  {/* Chat Header */}
                  <div className="p-4 bg-black/20 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-tight">+{META_CONFIG.RECIPIENT_NUMBER}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Verified Tester Number</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] ${msg.sender === 'client' ? 'items-start' : 'items-end'} flex flex-col`}>
                          <span className="text-[9px] font-black text-slate-500 uppercase mb-1 px-1">{msg.sender} Agent</span>
                          <div className={`p-4 rounded-2xl text-sm border shadow-sm ${
                            msg.sender === 'client' ? 'bg-[#1c2237] text-slate-200 border-slate-700 rounded-tl-none' 
                            : msg.sender === 'human' ? 'bg-amber-600 text-white border-amber-500 rounded-tr-none' : 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                          }`}>{msg.text}</div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start animate-pulse"><div className="bg-slate-800 text-[10px] px-3 py-1.5 rounded-full text-slate-400 border border-slate-700 flex items-center gap-2"><Loader2 size={10} className="animate-spin" /> AI Processing...</div></div>
                    )}
                  </div>

                  {/* Template Overlay */}
                  {showTemplates && (
                    <div className="absolute bottom-24 left-6 right-6 bg-[#161b2c] border border-indigo-500/30 rounded-2xl p-4 shadow-2xl z-10 animate-in slide-in-from-bottom-4">
                       <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Managed Assets</span>
                         <X size={14} className="cursor-pointer" onClick={() => setShowTemplates(false)} />
                       </div>
                       <div className="space-y-2">
                         {ACTUAL_TEMPLATES.map(t => (
                           <button key={t.id} onClick={() => handleManualSend(t.content)} className="w-full text-left p-3 rounded-xl bg-black/40 border border-white/5 hover:border-indigo-500 transition-all group">
                             <div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-indigo-400">{t.name}</span><span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1 rounded uppercase">Approved</span></div>
                             <p className="text-[11px] text-slate-500 group-hover:text-slate-200 truncate font-medium tracking-tight italic">"{t.content}"</p>
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {/* Chat Input */}
                  <div className="p-4 bg-[#161b2c] border-t border-slate-800/50 flex items-center gap-3">
                    <button onClick={() => setShowTemplates(!showTemplates)} className={`p-2 rounded-xl border transition-all ${showTemplates ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 text-slate-500 hover:text-indigo-400'}`}>
                      <FileText size={20} />
                    </button>
                    <div className="flex-1 flex bg-black/40 border border-slate-800 rounded-2xl px-4 items-center focus-within:border-indigo-500/50 transition-all">
                      <input type="text" className="flex-1 bg-transparent border-none outline-none py-3 text-sm text-white" placeholder={isHumanMode ? "Human message..." : "AI listening..."} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleManualSend()} />
                      <button onClick={() => handleManualSend()} className={`p-1.5 rounded-lg transition-all ${input ? 'text-indigo-500 scale-110' : 'text-slate-700'}`}><Send size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111625] p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-2xl"><CheckCircle2 className="text-emerald-500 w-6 h-6" /></div>
                    <div><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">WABA Status</p><p className="text-white font-bold text-sm">Healthy / Verified</p></div>
                  </div>
                  <div className="bg-[#111625] p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
                    <div className="bg-indigo-500/10 p-3 rounded-2xl"><BarChart3 className="text-indigo-500 w-6 h-6" /></div>
                    <div><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">API Limit</p><p className="text-white font-bold text-sm">1k Msgs / 24h</p></div>
                  </div>
                </div>
                <div className="bg-[#111625] p-8 rounded-[40px] border border-slate-800">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 border-b border-white/5 pb-4">WABA Asset Manager</h4>
                  <div className="space-y-4">
                    {ACTUAL_TEMPLATES.map(t => (
                      <div key={t.id} className="p-5 bg-black/20 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                         <div className="flex items-center gap-4">
                           <div className="bg-slate-800 p-2.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Layout size={18} /></div>
                           <div><p className="text-sm font-bold text-white uppercase">{t.name}</p><p className="text-[10px] text-slate-500">{t.category}</p></div>
                         </div>
                         <div className="text-right"><span className="text-[9px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded uppercase border border-emerald-500/20">Approved</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: AUDIT & LOGS */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-[#111625] p-6 rounded-3xl border border-slate-800">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Meta Graph API Stream</h4>
               <div className={`p-4 rounded-2xl text-[11px] font-mono border transition-all ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-black/40 border-slate-800 text-slate-500'}`}>
                 {`> [${new Date().toLocaleTimeString()}] ${status.msg}`}
               </div>
             </div>
             
             <div className="bg-[#111625] p-6 rounded-3xl border border-slate-800 h-[450px] flex flex-col">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Permission Audit History</h4>
               <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                 {logs.length === 0 && <div className="text-center py-20 text-slate-700 italic text-xs uppercase tracking-widest">Awaiting API Transaction...</div>}
                 {logs.map(log => (
                   <div key={log.id} className="bg-[#080b14] p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded uppercase">{log.mode}</span>
                       <span className="text-[9px] font-mono text-slate-600">{log.timestamp}</span>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed italic font-medium">"{log.content}"</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhatsAppReviewDashboard;