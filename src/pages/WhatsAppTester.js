import React, { useState } from 'react';
import axios from 'axios';

const WhatsAppTester = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendTestMessage = async () => {
    if (!phone || !message) {
      setStatus('Please enter both phone and message.');
      return;
    }
    setStatus('Sending payload...');
    try {
      const res = await axios.post(
        `https://graph.facebook.com/v24.0/1001284909724845/messages`,
        {
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: message }
        },
        {
          headers: { 
            Authorization: `Bearer EAAMzS47eOugBQZAj7uOY4N6zBsMy7vnkTXKqyFZCKM2o1y0CgTtDJWFF5qwTBZBIsuPkxTYivQBTnoZBnNEg5AjWBgTUz3jBZASGUwRQTZAIwTKG9IZAadp5XbGvUbCBTZBbel7W2FRgHJYZA7AIaBMiJYiEKZCLwGIECiW7l5P18GYHo4yzlXee1aIaZBpWB3jp144wQG8KcIY52ClNe2OEwUNrzzMNkJvjxAP2JmE1Osadkxf6jKsieTYREDPZCrYLF1zrnZB7GimCRMyE7ZCvjoZCZADn4CJ6Bp3EaPrj42MZD`,
            'Content-Type': 'application/json'
          }
        }
      );
      setStatus(`✅ Success! Message ID: ${res.data.messages[0].id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Connection failed';
      setStatus(`❌ Error: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-8">
      {/* Container with Margin Top 20 */}
      <div className="max-w-5xl mx-auto mt-20">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MyAutoBot <span className="text-indigo-500">DevTools</span>
          </h1>
          <p className="text-slate-400 mt-2">Internal Testing Console for Meta App Review</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Permission 1: Messaging */}
          <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700/50">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-indigo-400 text-xl font-bold">1</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Send Test Message</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Recipient Phone</label>
                <input 
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" 
                  placeholder="e.g. 919876543210" 
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Message Content</label>
                <textarea 
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white min-h-[100px] transition-all" 
                  placeholder="Write your test message here..." 
                  value={message} onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button 
                onClick={sendTestMessage} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Execute API Call
              </button>
              
              {status && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-mono border ${
                  status.includes('❌') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {status}
                </div>
              )}
            </div>
          </div>

          {/* Permission 2: Template Management */}
          <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700/50">
             <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-emerald-400 text-xl font-bold">2</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Template Creator</h2>
            </div>

            <p className="text-sm text-slate-400 mb-6 italic">This module demonstrates automated template submission for the Tech Provider review.</p>
            
            <div className="space-y-4 opacity-60">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block text-left">Template Name</label>
                <input className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-lg cursor-not-allowed" placeholder="e.g. user_onboarding_v1" disabled />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block text-left">Category</label>
                <select className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-lg cursor-not-allowed" disabled>
                  <option>MARKETING</option>
                  <option>UTILITY</option>
                  <option>AUTHENTICATION</option>
                </select>
              </div>

              <button className="w-full bg-slate-700 text-slate-400 font-bold py-3 rounded-lg cursor-not-allowed">
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTester;