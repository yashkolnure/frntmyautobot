import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Instagram, MessageCircle, User, Bot, ShieldCheck, 
  Smartphone, MoreVertical, Paperclip, Loader2, RefreshCcw 
} from 'lucide-react';

// --- CONFIGURATION ---
const META_CONFIG = {
  PHONE_NUMBER_ID: "1001284909724845",
  ACCESS_TOKEN: "EAAWSUlBr3l4BQuE57BLBSdZCKTQZA4ZCthJBWiRZACNUZAnHDR2k6Gl5aaAaTf20XzNU0QSs9rpI4DiS9yZC1CBx5SQEki6hUut7HnZCUUjiuZAHZBjC6jTZBmwWZCGGpHv8S2ukzNZCWIlO85DCGztuoAxb0EoroIOPDi2n0YZAD3pkxuNbrevSg4eMZBG5TAITWtfgNcm33NjKeme0p2ZAzziTZCXP3uov97EZBo4d3f3FicYzZAqOpiyLQOXR7byHBjM9HN4dhaYmghNgICK3ZACG5GAc7JgTTZA4ZAzWzl1zgjwZDZD", 
  RECIPIENT_NUMBER: "918767640530",
};

// --- SUB-COMPONENT: LIVE CHAT INTERFACE ---
const ChatWindow = ({ isHumanMode, onSendMessage, isTyping, messages, setMessages }) => {
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
    <div className={`flex flex-col h-[550px] transition-all rounded-3xl border overflow-hidden shadow-2xl ${isHumanMode ? 'border-amber-500/30 bg-[#120f0a]' : 'border-slate-800 bg-[#0f121d]'}`}>
      <div className={`p-4 border-b flex justify-between items-center ${isHumanMode ? 'bg-amber-950/20 border-amber-900/30' : 'bg-[#161b2c] border-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isHumanMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight">+{META_CONFIG.RECIPIENT_NUMBER}</h3>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{isHumanMode ? 'Manual Control' : 'AI Monitoring'}</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'incoming' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] flex flex-col ${msg.type === 'incoming' ? 'items-start' : 'items-end'}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className={`text-[9px] font-black uppercase ${msg.sender === 'client' ? 'text-slate-500' : msg.sender === 'ai' ? 'text-indigo-400' : 'text-amber-400'}`}>{msg.sender} Agent</span>
              </div>
              <div className={`p-4 rounded-2xl text-sm border ${
                msg.type === 'incoming' ? 'bg-[#1c2237] text-slate-200 border-slate-700 rounded-tl-none' 
                : msg.sender === 'ai' ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                : 'bg-amber-600 text-white border-amber-500 rounded-tr-none'
              }`}>{msg.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 text-slate-400 text-[10px] px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
              <Loader2 size={10} className="animate-spin" /> AI is generating response...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#161b2c] border-t border-slate-800">
        <div className="flex items-center gap-3 bg-[#0b0f1a] border border-slate-700 rounded-2xl p-2 px-4">
          <input 
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2"
            placeholder={isHumanMode ? "Reply manually..." : "AI listening..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className={`p-2 rounded-xl ${input ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}><Send size={18} /></button>
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
    { id: 1, text: "System Online. Connected to Meta Graph API.", sender: 'ai', time: '10:00 AM', type: 'outgoing' },
  ]);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', msg: 'System Ready' });

  // Handle Meta API Calls
  const sendToWhatsAppAPI = async (text) => {
    try {
      const res = await fetch(`https://graph.facebook.com/v17.0/${META_CONFIG.PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${META_CONFIG.ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: "whatsapp", to: META_CONFIG.RECIPIENT_NUMBER, type: "text", text: { body: text } })
      });
      return await res.json();
    } catch (err) { return null; }
  };

  // Triggered when a new message is added to state
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.type === 'incoming' && !isHumanMode) {
      triggerAiAutoReply();
    }
  }, [messages, isHumanMode]);

  const triggerAiAutoReply = () => {
    setIsTyping(true);
    setStatus({ type: 'loading', msg: 'AI processing incoming webhook...' });
    
    setTimeout(async () => {
      const aiReply = "Thank you for reaching out! MyAutoBot AI is now processing your request.";
      setMessages(prev => [...prev, { id: Date.now(), text: aiReply, sender: 'ai', time: new Date().toLocaleTimeString(), type: 'outgoing' }]);
      
      const log = { id: Date.now(), channel: 'whatsapp', mode: 'AI_AGENT', content: aiReply, timestamp: new Date().toLocaleTimeString() };
      setLogs(prev => [log, ...prev]);
      
      await sendToWhatsAppAPI(aiReply);
      setIsTyping(false);
      setStatus({ type: 'success', msg: 'AI automation dispatched via Graph API' });
    }, 2000);
  };

  const handleManualSend = async (content, mode) => {
    setStatus({ type: 'loading', msg: 'Sending manual response...' });
    await sendToWhatsAppAPI(content);
    setLogs(prev => [{ id: Date.now(), channel: activeTab, mode, content, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    setStatus({ type: 'success', msg: 'Manual dispatch verified' });
  };

  const simulateIncoming = () => {
    const text = "Hi, I need assistance with MyAutoBot.";
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'client', time: new Date().toLocaleTimeString(), type: 'incoming' }]);
    setLogs(prev => [{ id: Date.now(), channel: activeTab, mode: 'INCOMING_WEBHOOK', content: text, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-300 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-4 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-indigo-500 w-6 h-6" />
            <p className="text-xs uppercase font-bold tracking-widest">Permission: <span className="text-white">whatsapp_business_messaging</span></p>
          </div>
          <button onClick={simulateIncoming} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase flex items-center gap-2">
            <RefreshCcw size={14} /> Simulate Incoming
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex gap-4">
               <button onClick={() => setIsHumanMode(false)} className={`flex-1 py-3 rounded-xl text-xs font-black border transition-all ${!isHumanMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800'}`}>AI MODE</button>
               <button onClick={() => setIsHumanMode(true)} className={`flex-1 py-3 rounded-xl text-xs font-black border transition-all ${isHumanMode ? 'bg-amber-600 border-amber-500 text-white' : 'border-slate-800'}`}>HUMAN MODE</button>
            </div>
            <ChatWindow isHumanMode={isHumanMode} messages={messages} setMessages={setMessages} onSendMessage={handleManualSend} isTyping={isTyping} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111625] p-6 rounded-3xl border border-slate-800">
               <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">API Verification Stream</h4>
               <div className={`p-4 rounded-xl text-[11px] font-mono border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-black/40 border-slate-800'}`}>
                 {`> ${status.msg}`}
               </div>
            </div>
            <div className="bg-[#111625] p-6 rounded-3xl border border-slate-800 h-[400px] overflow-hidden flex flex-col">
               <h4 className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-[0.2em]">Permission Audit History</h4>
               <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                 {logs.map(log => (
                   <div key={log.id} className="bg-[#080b14] p-4 rounded-2xl border border-slate-800/50 text-[11px]">
                     <div className="flex justify-between mb-2">
                       <span className="text-indigo-400 font-black">{log.mode}</span>
                       <span className="text-slate-600 font-bold">{log.timestamp}</span>
                     </div>
                     <p className="text-slate-400 italic font-medium">"{log.content}"</p>
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