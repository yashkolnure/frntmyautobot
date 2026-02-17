import React, { useState, useEffect, useCallback } from 'react';
import { Key, Copy, RefreshCw, ShieldCheck, Eye, EyeOff, Terminal, BookOpen, Activity, Loader2, Code2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const DeveloperPortal = () => {
  const [apiKey, setApiKey] = useState("");
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [testStatus, setTestStatus] = useState("idle"); 
  const [showKey, setShowKey] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const API_BASE = "http://127.0.0.1:5005"; // Adjust as needed

  const fetchUserData = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/api/user-profile/${userId}`);
      if (res.data) {
        setApiKey(res.data.apiKey || "");
        setTokens(res.data.tokens || 0);
      }
    } catch (err) {
      console.error("❌ Persistence Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, API_BASE]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const handleGenerateKey = async () => {
    if (!window.confirm("Generating a new key will instantly invalidate your old one. Continue?")) return;
    setRotating(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/generate-api-key/${userId}`);
      setApiKey(res.data.apiKey);
      setShowKey(true);
      await fetchUserData();
    } catch (err) { alert("Failed to rotate key."); }
    finally { setRotating(false); }
  };

  const testConnection = async () => {
    if (!apiKey) return alert("Please generate a key first.");
    setTestStatus("testing");
    try {
      await axios.get(`${API_BASE}/api/v1/auth/verify`, { headers: { 'x-api-key': apiKey } });
      setTestStatus("success");
      setTimeout(() => setTestStatus("idle"), 3000);
    } catch (err) {
      setTestStatus("error");
      setTimeout(() => setTestStatus("idle"), 3000);
    }
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard! 🚀");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-[#0c041a] rounded-3xl border border-white/10 min-h-[400px]">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Neural Identity...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-br from-purple-900/20 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Developer Portal</h2>
            <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black px-2 py-1 rounded border border-purple-500/30 uppercase tracking-widest">v1.0 API</span>
          </div>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Connect <span className="text-purple-400 font-bold">MyAutoBot</span> to your custom workflows. Each API request deducts <span className="text-white font-bold underline decoration-purple-500">5 Tokens</span> from your balance.
          </p>
        </div>
        <Key size={140} className="absolute -right-6 -bottom-6 text-purple-500/10 rotate-12" />
      </div>

      {/* --- KEY MANAGEMENT CARD --- */}
      <div className="bg-[#0c041a] border border-purple-500/20 rounded-2xl p-6 shadow-2xl relative">
        <div className="absolute top-4 right-6 flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <AlertCircle size={12}/> Neural Cost: 5 Tokens / req
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between mt-4">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-3 block flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" /> Private API Key
            </label>
            <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl px-4 py-3">
              <input 
                type={showKey ? "text" : "password"} 
                value={apiKey || "••••••••••••••••••••••••••••••••"} 
                readOnly 
                className="bg-transparent border-none outline-none text-purple-100 font-mono text-sm flex-1 tracking-widest"
              />
              <button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-white transition-colors">
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button onClick={() => copyCode(apiKey)} disabled={!apiKey} className="text-purple-400 hover:scale-110 disabled:opacity-20">
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={testConnection}
              className={`flex-1 md:flex-none px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                testStatus === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                testStatus === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {testStatus === 'testing' ? <RefreshCw className="animate-spin mx-auto" size={16} /> : 
               testStatus === 'success' ? 'Verified ✓' : 
               testStatus === 'error' ? 'Failed ✗' : 'Test Link'}
            </button>
            <button 
              onClick={handleGenerateKey}
              disabled={rotating}
              className="flex-1 md:flex-none px-6 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
            >
              {rotating ? <RefreshCw className="animate-spin mx-auto" size={16} /> : apiKey ? "Generate Key" : "Generate Key"}
            </button>
          </div>
        </div>
      </div>

      {/* --- API DOCUMENTATION SECTION --- */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* REQUEST FORMAT */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] text-blue-400">
              <Code2 size={16} /> Request Structure
            </h4>
            <div className="flex gap-2">
                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-bold uppercase">POST</span>
                <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/10 font-mono">application/json</span>
            </div>
          </div>

          <div className="relative group">
            <pre className="bg-black/60 p-5 rounded-xl text-xs font-mono text-purple-200 border border-white/5 overflow-x-auto leading-relaxed">
{`{
  "model": "llama3",
  "messages": [
    {
      "role": "user",
      "content": "Hello MyAutoBot! How can I integrate your API?"
    }
  ]
}`}
            </pre>
            <button 
                onClick={() => copyCode(`{"model":"llama3","messages":[{"role":"user","content":"Hello!"}]}`)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 p-2 rounded-lg text-white hover:bg-white/20"
            >
                <Copy size={14}/>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Deduction</p>
                <p className="text-white font-bold text-sm">5 Tokens</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Remaining Balance</p>
                <p className="text-emerald-400 font-bold text-sm">{tokens} Tokens</p>
            </div>
          </div>
        </div>

        {/* INTEGRATION NOTES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h4 className="flex items-center gap-2 text-white font-bold mb-4 uppercase text-[10px] tracking-[0.2em] text-emerald-400">
            <BookOpen size={16} /> Integration Manual
          </h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-xs">
                <div className="h-5 w-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">1</div>
                <p className="text-slate-400"><b className="text-slate-200">Auth Header:</b> Add <code className="text-purple-400">x-api-key</code> to every request header.</p>
            </li>
            <li className="flex gap-3 text-xs">
                <div className="h-5 w-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">2</div>
                <p className="text-slate-400"><b className="text-slate-200">Endpoint:</b> Use <code className="text-purple-400">{API_BASE}/api/v1/chat/completions</code></p>
            </li>
            <li className="flex gap-3 text-xs">
                <div className="h-5 w-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">3</div>
                <p className="text-slate-400"><b className="text-slate-200">History:</b> Maintain context by sending the full <code className="text-purple-400">messages</code> array.</p>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[9px] text-slate-500 uppercase font-black mb-3 tracking-widest">n8n Config</p>
            <div className="bg-black/40 p-3 rounded-lg text-[10px] font-mono text-slate-300 border border-white/5">
                Auth: Header Auth<br/>
                Name: x-api-key<br/>
                Value: [Your Key]
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeveloperPortal;