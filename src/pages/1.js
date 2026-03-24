import React, { useState } from 'react';
import axios from 'axios';

const WhatsAppTester1 = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isHumanMode, setIsHumanMode] = useState(false); // New state for Human Agent tag

  const sendTestMessage = async () => {
    if (!phone || !message) {
      setStatus('Please enter both phone and message.');
      return;
    }
    
    setStatus('Processing...');
    
    try {
      const payload = {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message }
      };

      // CRITICAL: Add the human_agent tag if mode is toggled on
      if (isHumanMode) {
        payload.tag = "human_agent";
      }

      const res = await axios.post(
        `https://graph.facebook.com/v24.0/1001284909724845/messages`,
        payload,
        {
          headers: { 
            Authorization: `Bearer EAAMzS47eOugBQSj77BxJl8Ll5fe0QLck8RVboNN7M7LtBHTcrmiLC4omEQrndBA2DQF0r8ROFSLXSdA3spsbyqUofLHe6NKhS91ZANCv9qtkck19fYKPkZADNaaidgROGpZC0UFw7ZC4ujKDuc7S5ike8tlNtC2gXC2aroI3sZB7OFQ0W8W5PjQbLJdbN75dM5TkzLwJl4gJKyLYGcOXvieb9rPG0t1kiDeYOC2GcFYQlqlZCFZC7WcycYD2twDQbD0zdZCYKEoeqcQzGsr9av3StLcfYmXonKZChAwZDZD`,
            'Content-Type': 'application/json'
          }
        }
      );
      setStatus(`✅ Success! [${isHumanMode ? 'HUMAN_TAG' : 'BOT'}] ID: ${res.data.messages[0].id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Connection failed';
      setStatus(`❌ Error: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-8">
      <div className="max-w-5xl mx-auto mt-20">
        
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              MyAutoBot <span className="text-indigo-500">DevTools</span>
            </h1>
            <p className="text-slate-400 mt-2">App Review Workspace v2.0</p>
          </div>

          {/* Human Mode Toggle Switch */}
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-500 uppercase mb-2">Support Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isHumanMode}
                onChange={() => setIsHumanMode(!isHumanMode)}
              />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-3 text-sm font-medium text-slate-300">
                {isHumanMode ? '👨‍💼 Human Agent' : '🤖 AI Agent'}
              </span>
            </label>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Messaging Card */}
          <div className={`p-8 rounded-2xl shadow-2xl border transition-all duration-500 ${
            isHumanMode ? 'bg-[#1e293b] border-amber-500/50' : 'bg-[#1e293b] border-slate-700/50'
          }`}>
            
            {/* Visual Badge for the Video Reviewer */}
            {isHumanMode && (
              <div className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block border border-amber-500/20">
                HUMAN_AGENT TAG ENABLED
              </div>
            )}

            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              {isHumanMode ? 'Human Intervention Chat' : 'Automated Message Test'}
            </h2>
            
            <div className="space-y-4">
              <input 
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" 
                placeholder="Recipient Phone" 
                value={phone} onChange={(e) => setPhone(e.target.value)}
              />

              <textarea 
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white min-h-[120px]" 
                placeholder={isHumanMode ? "Type as a human agent..." : "Type bot response..."}
                value={message} onChange={(e) => setMessage(e.target.value)}
              />

              <button 
                onClick={sendTestMessage} 
                className={`w-full font-bold py-3 rounded-lg transition-all shadow-lg ${
                  isHumanMode 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                }`}
              >
                {isHumanMode ? 'Send as Human Agent' : 'Send as AI Agent'}
              </button>
              
              {status && (
                <div className="mt-4 p-3 rounded-lg text-xs font-mono bg-black/30 border border-slate-700 text-slate-400">
                  {status}
                </div>
              )}
            </div>
          </div>

          {/* Template Mock Card */}
          <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700/50 opacity-50">
             <h2 className="text-xl font-semibold text-white mb-6">Template Archive</h2>
             <p className="text-sm text-slate-400 mb-4 italic">Used for creating non-human messages outside the 24h window.</p>
             <div className="h-32 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-slate-600">Template Manager UI Under Dev</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTester1;