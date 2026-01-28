import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Instagram, MessageCircle, User, Bot, ShieldCheck, 
  Layout, Clock, CheckCircle2, Smartphone, MoreVertical, Paperclip, Loader2, RefreshCcw 
} from 'lucide-react';

// --- CONFIGURATION (Add your Meta Details Here) ---
const META_CONFIG = {
  PHONE_NUMBER_ID: "1001284909724845", // From Meta Developer Portal
  ACCESS_TOKEN: "EAAWSUlBr3l4BQuE57BLBSdZCKTQZA4ZCthJBWiRZACNUZAnHDR2k6Gl5aaAaTf20XzNU0QSs9rpI4DiS9yZC1CBx5SQEki6hUut7HnZCUUjiuZAHZBjC6jTZBmwWZCGGpHv8S2ukzNZCWIlO85DCGztuoAxb0EoroIOPDi2n0YZAD3pkxuNbrevSg4eMZBG5TAITWtfgNcm33NjKeme0p2ZAzziTZCXP3uov97EZBo4d3f3FicYzZAqOpiyLQOXR7byHBjM9HN4dhaYmghNgICK3ZACG5GAc7JgTTZA4ZAzWzl1zgjwZDZD", 
  RECIPIENT_NUMBER: "918767640530", // Your verified tester number
};

// --- SUB-COMPONENT: LIVE CHAT INTERFACE ---
const ChatWindow = ({ isHumanMode, activeTab, onSendMessage, isTyping, messages, setMessages }) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input) return;
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: isHumanMode ? 'human' : 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'outgoing'
    };
    setMessages(prev => [...prev, newMessage]);
    onSendMessage(input, isHumanMode ? 'HUMAN_AGENT' : 'AI_AGENT');
    setInput("");
  };

  return (
    <div className={`flex flex-col h-[550px] transition-all duration-500 rounded-3xl border overflow-hidden shadow-2xl ${isHumanMode ? 'border-amber-500/30 bg-[#120f0a]' : 'border-slate-800 bg-[#0f121d]'}`}>
      <div className={`p-4 border-b transition-colors duration-500 flex justify-between items-center ${isHumanMode ? 'bg-amber-950/20 border-amber-900/30' : 'bg-[#161b2c] border-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isHumanMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight">+{META_CONFIG.RECIPIENT_NUMBER}</h3>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{isHumanMode ? 'Manual Control' : 'AI Monitoring'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold px-2 py-1 rounded bg-slate-800/50 border border-slate-700">
           {isHumanMode ? 'HUMAN_AGENT_ACTIVE' : 'AI_ENGINE_READY'}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'incoming' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] flex flex-col ${msg.type === 'incoming' ? 'items-start' : 'items-end'}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {msg.sender === 'ai' && <Bot size={12} className="text-indigo-400" />}
                {msg.sender === 'human' && <User size={12} className="text-amber-400" />}
                <span className={`text-[9px] font-black uppercase ${msg.sender === 'client' ? 'text-slate-500' : msg.sender === 'ai' ? 'text-indigo-400' : 'text-amber-400'}`}>{msg.sender}</span>
              </div>
              <div className={`p-4 rounded-2xl text-sm border transition-all ${
                msg.type === 'incoming' ? 'bg-[#1c2237] text-slate-200 border-slate-700 rounded-tl-none' 
                : msg.sender === 'ai' ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-indigo-500/10' 
                : 'bg-amber-600 text-white border-amber-500 rounded-tr-none shadow-amber-500/10'
              }`}>{msg.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 text-slate-400 text-[10px] px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
              <Loader2 size={10} className="animate-spin" /> Processing via API...
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t ${isHumanMode ? 'bg-amber-950/10 border-amber-900/20' : 'bg-[#161b2c] border-slate-800'}`}>
        <div className="flex items-center gap-3 bg-[#0b0f1a] border border-slate-700 rounded-2xl p-2 px-4 focus-within:border-indigo-500/50 transition-all">
          <input 
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2"
            placeholder={isHumanMode ? "Reply as Human Agent..." : "AI is active..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className={`p-2 rounded-xl transition-all ${input ? (isHumanMode ? 'bg-amber-600' : 'bg-indigo-600') + ' text-white' : 'bg-slate-800 text-slate-500'}`}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const WhatsAppReviewDashboard = () => {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to MyAutoBot Core. System connected to Meta Graph API.", sender: 'ai', time: '10:00 AM', type: 'outgoing' },
  ]);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', msg: 'Core Systems Online' });

  // 1. REAL SENDER LOGIC (Calls Meta API directly)
  const sendToWhatsAppAPI = async (text) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${META_CONFIG.PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${META_CONFIG.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: META_CONFIG.RECIPIENT_NUMBER,
          type: "text",
          text: { body: text }
        })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Meta API Error:", err);
      return null;
    }
  };

  const handleMessageLogged = async (content, mode) => {
    setStatus({ type: 'loading', msg: `Syncing with Meta Graph API...` });
    
    // Add to Permission Audit Logs
    const newLog = { id: Date.now(), channel: activeTab, mode, content, timestamp: new Date().toLocaleTimeString() };
    setLogs(prev => [newLog, ...prev]);

    // Send the real message if it's Human Mode (or AI Mode for demo)
    const apiResult = await sendToWhatsAppAPI(content);
    
    if (apiResult?.messages) {
      setStatus({ type: 'success', msg: `SUCCESS: Message ID ${apiResult.messages[0].id}` });
    } else {
      setStatus({ type: 'error', msg: `FAILED: Check console for API errors` });
    }

    // AI AUTO-RESPONSE LOGIC
    if (mode === 'AI_AGENT') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiReply = "Thank you! Our AI has processed your request via the Graph API.";
        setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, sender: 'ai', time: new Date().toLocaleTimeString(), type: 'outgoing' }]);
        sendToWhatsAppAPI(aiReply); // Bot replies back to your phone too
      }, 2000);
    }
  };

  // 2. SIMULATE INCOMING (For the Video Demo)
  const simulateIncoming = () => {
    const incomingText = "Hi, I want to test the automation.";
    setMessages(prev => [...prev, { id: Date.now(), text: incomingText, sender: 'client', time: new Date().toLocaleTimeString(), type: 'incoming' }]);
    setLogs(prev => [{ id: Date.now(), channel: activeTab, mode: 'INCOMING_WEBHOOK', content: incomingText, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-300 font-sans p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* APP REVIEW DASHBOARD HEADER */}
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-indigo-500 w-6 h-6" />
            <p className="text-xs font-medium uppercase tracking-wider">
              Review Context: <span className="text-white font-bold tracking-normal">whatsapp_business_messaging</span>
            </p>
          </div>
          <button onClick={simulateIncoming} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
            <RefreshCcw size={14} /> Simulate Incoming Message
          </button>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-center mb-10 pb-8 border-b border-slate-800/50">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">MYAUTOBOT <span className="text-indigo-500 italic">CORE</span></h1>
            <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-[0.3em]">Avenirya Solutions • App Review Console</p>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex bg-[#111625] p-1.5 rounded-2xl border border-slate-800">
              <button onClick={() => setIsHumanMode(false)} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${!isHumanMode ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}><Bot size={14} className="inline mr-2"/>AI MODE</button>
              <button onClick={() => setIsHumanMode(true)} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${isHumanMode ? 'bg-amber-600 text-white' : 'text-slate-500'}`}><User size={14} className="inline mr-2"/>HUMAN MODE</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex gap-4">
              {['whatsapp', 'instagram'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 rounded-2xl border transition-all font-black text-xs uppercase tracking-[0.2em] ${activeTab === tab ? 'border-indigo-500 bg-indigo-500/5 text-white shadow-lg' : 'border-slate-800 text-slate-500'}`}>{tab}</button>
              ))}
            </div>
            <ChatWindow isHumanMode={isHumanMode} activeTab={activeTab} onSendMessage={handleMessageLogged} isTyping={isTyping} messages={messages} setMessages={setMessages} />
          </div>

          <div className="lg:col-span-5 space-y-6">
             <div className="bg-[#111625] p-6 rounded-3xl border border-slate-800">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic underline decoration-indigo-500 underline-offset-4">API Verification Stream</h4>
               <div className={`p-4 rounded-2xl text-[11px] font-mono border transition-all ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-black/40 border-slate-800 text-slate-500'}`}>
                 {`> ${status.msg}`}
               </div>
             </div>
             
             <div className="bg-[#111625] p-6 rounded-3xl border border-slate-800 h-[400px] flex flex-col">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Permission Usage History</h4>
               <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                 {logs.map(log => (
                   <div key={log.id} className="bg-[#080b14] p-4 rounded-2xl border border-slate-800/50 text-[11px] hover:border-indigo-500/30 transition-all">
                     <div className="flex justify-between mb-2 uppercase font-black text-[9px] tracking-tighter">
                       <span className="text-indigo-400">{log.mode}</span>
                       <span className="text-slate-600">{log.timestamp}</span>
                     </div>
                     <p className="text-slate-400 italic leading-relaxed font-medium tracking-tight">"{log.content}"</p>
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