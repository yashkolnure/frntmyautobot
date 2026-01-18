import React, { useState } from 'react';
import axios from 'axios';

/**
 * MYAUTOBOT APP REVIEW DASHBOARD
 * Features: Dark Mode, Human Agent Toggle, MT-20 Margin, Meta-ready UI
 */

const WhatsAppReviewDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: 'idle', msg: '' });
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  // --- CONFIGURATION (Replace with your IDs for the video) ---
  const PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID"; 
  const ACCESS_TOKEN = "YOUR_PERMANENT_ACCESS_TOKEN";

  const handleSendMessage = async () => {
    if (!phone || !message) {
      setStatus({ type: 'error', msg: 'Please provide both phone number and message.' });
      return;
    }

    setStatus({ type: 'loading', msg: 'Initiating Cloud API Request...' });
    setLastResponse(null);

    const url = `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`;
    
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "text",
      text: { body: message }
    };

    // Apply the Human Agent Tag if the toggle is ON
    if (isHumanMode) {
      payload.tag = "human_agent";
    }

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      setStatus({ type: 'success', msg: `Message sent via ${isHumanMode ? 'Human Agent' : 'AI Agent'} protocol.` });
      setLastResponse(response.data);
    } catch (error) {
      const errorDetail = error.response?.data?.error?.message || "Check console for details";
      setStatus({ type: 'error', msg: `API Error: ${errorDetail}` });
      setLastResponse(error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* 1. Main Container with MT-20 */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        
        {/* 2. Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              MyAutoBot<span className="text-indigo-500">.in</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Enterprise AI Agent & Human Handover Console</p>
          </div>

          {/* Human Mode Toggle */}
          <div className="mt-6 md:mt-0 flex items-center space-x-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Type</p>
              <p className={`text-sm font-bold ${isHumanMode ? 'text-amber-500' : 'text-indigo-400'}`}>
                {isHumanMode ? 'HUMAN AGENT' : 'AI AUTOMATION'}
              </p>
            </div>
            <button 
              onClick={() => setIsHumanMode(!isHumanMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${isHumanMode ? 'bg-amber-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 transform ${isHumanMode ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* 3. Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Input Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`bg-[#161b2c] p-8 rounded-3xl shadow-2xl border-2 transition-all duration-500 ${isHumanMode ? 'border-amber-500/30' : 'border-slate-800'}`}>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Compose {isHumanMode ? 'Human' : 'AI'} Response</h2>
                <p className="text-sm text-slate-500">Testing advanced permissions for 7-day Human Agent window.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Recipient Phone Number</label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full bg-[#0b0f1a] border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Message Body</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isHumanMode ? "Describe the manual resolution..." : "Enter automated AI prompt output..."}
                    className="w-full bg-[#0b0f1a] border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all min-h-[150px] placeholder:text-slate-700"
                  />
                </div>

                <button 
                  onClick={handleSendMessage}
                  disabled={status.type === 'loading'}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-xl ${
                    isHumanMode 
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/20' 
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-900/20'
                  } ${status.type === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {status.type === 'loading' ? 'COMMUNICATING WITH META...' : `SEND AS ${isHumanMode ? 'HUMAN AGENT' : 'AI AGENT'}`}
                </button>
              </div>
            </div>
          </div>

          {/* Right: API Response & Logs (Great for Video Proof) */}
          <div className="space-y-6">
            <div className="bg-[#161b2c] p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Request Status</h3>
              <div className={`p-4 rounded-xl border text-sm font-medium ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                status.type === 'loading' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                'bg-slate-900 border-slate-800 text-slate-600'
              }`}>
                {status.msg || "System Ready for Review..."}
              </div>
            </div>

            <div className="bg-[#161b2c] p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Live API Payload</h3>
              <pre className="text-[10px] font-mono text-slate-400 bg-[#0b0f1a] p-4 rounded-xl overflow-x-auto max-h-[300px]">
                {lastResponse ? JSON.stringify(lastResponse, null, 2) : "// Awaiting first API trigger..."}
              </pre>
            </div>
          </div>

        </div>

        {/* Footer Note for Reviewer */}
        <footer className="mt-12 text-center">
          <p className="text-slate-600 text-xs">
            © 2026 MyAutoBot Systems • Avenirya Solutions • App ID: YOUR_APP_ID
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WhatsAppReviewDashboard;