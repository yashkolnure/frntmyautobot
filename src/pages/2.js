import React, { useState, useEffect } from 'react';
import { Send, Instagram, MessageCircle, User, Bot, ShieldCheck } from 'lucide-react';

const WhatsAppReviewDashboard = () => {
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' or 'instagram'
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: 'idle', msg: 'System Ready' });
  const [logs, setLogs] = useState([]);

  const handleSend = async () => {
    if (!message) return;
    
    setStatus({ type: 'loading', msg: `Sending via ${activeTab.toUpperCase()}...` });
    
    // Simulate API logic for Video Demo
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        channel: activeTab,
        mode: isHumanMode ? 'HUMAN_AGENT' : 'AI_AGENT',
        content: message,
        timestamp: new Date().toLocaleTimeString()
      };
      setLogs([newLog, ...logs]);
      setStatus({ type: 'success', msg: `Message Delivered Successfully!` });
      setMessage('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center">
              MYAUTOBOT <span className="text-indigo-500 ml-2">CORE</span>
              <ShieldCheck className="ml-3 text-emerald-500 w-6 h-6" />
            </h1>
            <p className="text-slate-500 text-sm mt-1">Multi-Channel AI Automation & CRM Console</p>
          </div>

          {/* HUMAN MODE TOGGLE */}
          <div className="mt-4 md:mt-0 flex items-center bg-[#161b2c] p-3 rounded-2xl border border-slate-700">
            <span className={`mr-3 text-xs font-bold ${isHumanMode ? 'text-amber-500' : 'text-slate-500'}`}>
              {isHumanMode ? 'HUMAN AGENT ENABLED' : 'AI AUTOMATION ACTIVE'}
            </span>
            <button 
              onClick={() => setIsHumanMode(!isHumanMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isHumanMode ? 'bg-amber-600' : 'bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHumanMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: CHANNEL SELECTION & INPUT */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CHANNEL TABS */}
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('whatsapp')}
                className={`flex-1 p-4 rounded-2xl border transition-all flex items-center justify-center font-bold ${activeTab === 'whatsapp' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-[#161b2c] border-slate-800 text-slate-500'}`}
              >
                <MessageCircle className="mr-2 w-5 h-5" /> WhatsApp
              </button>
              <button 
                onClick={() => setActiveTab('instagram')}
                className={`flex-1 p-4 rounded-2xl border transition-all flex items-center justify-center font-bold ${activeTab === 'instagram' ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'bg-[#161b2c] border-slate-800 text-slate-500'}`}
              >
                <Instagram className="mr-2 w-5 h-5" /> Instagram
              </button>
            </div>

            {/* MESSAGE COMPOSER */}
            <div className={`bg-[#161b2c] p-8 rounded-3xl shadow-xl border-2 transition-all ${isHumanMode ? 'border-amber-500/30 shadow-amber-900/10' : 'border-slate-800'}`}>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                  {isHumanMode ? 'Human Intervention' : 'AI Response Agent'}
                </h3>
                {isHumanMode ? <User className="text-amber-500" /> : <Bot className="text-indigo-500" />}
              </div>

              <textarea 
                className="w-full bg-[#0b0f1a] border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[180px] mb-6 resize-none"
                placeholder={`Type your ${isHumanMode ? 'manual' : 'automated'} message for ${activeTab}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button 
                onClick={handleSend}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all active:scale-95 ${
                  activeTab === 'whatsapp' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-pink-600 hover:bg-pink-500'
                } text-white`}
              >
                <Send className="mr-2 w-5 h-5" /> EXECUTE {activeTab.toUpperCase()} DISPATCH
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: LIVE FEED & STATUS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#161b2c] p-6 rounded-3xl border border-slate-800">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">System Status</h4>
              <div className={`p-3 rounded-lg text-xs font-bold border ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                {status.msg}
              </div>
            </div>

            <div className="bg-[#161b2c] p-6 rounded-3xl border border-slate-800 flex-1 h-[450px] flex flex-col">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Activity Feed</h4>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {logs.length === 0 && <p className="text-slate-700 text-sm italic">Waiting for API events...</p>}
                {logs.map(log => (
                  <div key={log.id} className="bg-[#0b0f1a] p-4 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-right-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${log.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-pink-500/20 text-pink-500'}`}>
                        {log.channel.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-600">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-300">{log.content}</p>
                    <div className="mt-2 text-[9px] font-mono text-slate-500">
                      TAG: {log.mode} | STATUS: DELIVERED
                    </div>
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