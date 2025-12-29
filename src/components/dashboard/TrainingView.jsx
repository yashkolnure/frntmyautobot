import React, { useMemo, useState } from 'react';
import { 
  Bot, ShieldCheck, Loader2, Cpu, Database, Terminal, 
  MessageSquare, Send, Sparkles, Zap, Coins, Wallet,
  Activity, Globe, Lock, BarChart3, Edit3, Wand2, AlertTriangle, XCircle,ArrowRight
} from 'lucide-react';

export default function TrainingView({ 
  data = {}, setData, handleSave, loading, chatHistory = [], 
  chatInput = "", setChatInput, handleChat, isChatting = false, 
  compiledPrompt = "", userTokens = 0 ,setActiveTab
}) {
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [showWarning, setShowWarning] = useState(true); // Control the low balance popup

  const syncLevel = useMemo(() => {
    if (!data) return 0;
    const fields = [
        data.businessName, data.role, data.catalog, 
        data.policies, data.contact, data.constraints, data.examples
    ];
    const filled = fields.filter(f => f && String(f).trim().length > 0).length;
    return Math.floor((filled / fields.length) * 100);
  }, [data]);

  const canChat = userTokens >= 5;
  const isLowBalance = userTokens < 25; // Define low balance threshold

  return (
    <div className="w-full mx-auto space-y-8 pb-32 px-4 animate-in fade-in duration-1000">
      
      {/* --- SYSTEM HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border ${isLowBalance ? 'border-amber-500/50 animate-pulse' : 'border-white/10'} flex items-center justify-between group`}>
    <div className="flex items-center gap-4">
      <div className={`${isLowBalance ? 'bg-amber-500/20 text-amber-500' : 'bg-purple-600/20 text-purple-400'} p-4 rounded-2xl border ${isLowBalance ? 'border-amber-500/30' : 'border-purple-500/30'}`}>
        <Zap size={24} className="fill-current opacity-20" />
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Neural Energy</p>
        <h3 className={`text-3xl font-black italic tabular-nums ${isLowBalance ? 'text-amber-500' : 'text-white'}`}>{userTokens}</h3>
      </div>
    </div>

    {/* --- UPDATED BUTTON --- */}
    <button 
      onClick={() => setActiveTab('purchase')} // <--- CLICK TO GO TO PURCHASE
      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition-all active:scale-90 flex items-center gap-2 group shadow-lg shadow-purple-900/20"
    >
      <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-widest">Refill</span>
    </button>
  </div>

        {/* Sync Progress Card */}
        <div className="bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-white/10 flex flex-col justify-center gap-3">
          <div className="flex justify-between items-end">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Brain Sync status</p>
            <span className="text-sm font-black text-purple-400 italic">{syncLevel}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-1000" style={{ width: `${syncLevel}%` }} />
          </div>
        </div>

        {/* Global Node Card */}
        <div className="hidden md:flex bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-white/10 items-center gap-4">
          <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-emerald-500">
            <Globe size={24} className="animate-[spin_8s_linear_infinite]" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Network Status</p>
            <h3 className="text-lg font-black text-emerald-400 uppercase italic">Edge Node Active</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT: CONFIGURATION PANEL --- */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <Section title="Identity Core" icon={<Cpu size={20}/>} badge="Level 1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Organization Alias" value={data.businessName} onChange={(val) => setData({...data, businessName: val})} placeholder="e.g. Petoba SaaS" />
              <Input label="Agent Designation" value={data.role} onChange={(val) => setData({...data, role: val})} placeholder="e.g. Lead Support" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
               <Input label="Escalation Route" value={data.contact} onChange={(val) => setData({...data, contact: val})} placeholder="Email or Phone" />
               <Input label="Primary Language" value={data.language || 'English'} onChange={(val) => setData({...data, language: val})} placeholder="e.g. English, Hinglish" />
            </div>
          </Section>

          <Section title="Intelligence Matrix" icon={<Database size={20}/>} badge="Level 2">
            <Textarea label="Knowledge Base" value={data.catalog} onChange={(val) => setData({...data, catalog: val})} placeholder="Paste data here..." rows={10} />
          </Section>

          <Section title="Neural Constraints" icon={<ShieldCheck size={20}/>} badge="Safety">
            <div className="space-y-3">
              <Textarea label="Strict Guardrails" value={data.constraints} onChange={(val) => setData({...data, constraints: val})} placeholder="What NOT to say..." rows={4} />
              <Textarea label="Perfect Examples" value={data.examples} onChange={(val) => setData({...data, examples: val})} placeholder="User: Hi! AI: Hello..." rows={5} />
            </div>
          </Section>

          <div className="pt-6">
            <button onClick={handleSave} disabled={loading} className="w-full relative group bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-[2.5rem] transition-all overflow-hidden shadow-[0_20px_50px_-15px_rgba(168,85,247,0.5)] active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              <div className="flex items-center gap-3 justify-center relative z-10">
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Activity size={24} />}
                <span className="text-2xl font-black uppercase italic tracking-tighter">Deploy Neural Brain</span>
              </div>
            </button>
          </div>
        </div>

        {/* --- RIGHT: ARCHITECT & TESTER --- */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-8 sticky top -20 self-start">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <Wand2 size={16} className="text-purple-500" />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Neural Architect</h3>
               </div>
               <button onClick={() => setIsManualOverride(!isManualOverride)} className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-[9px] font-black uppercase ${isManualOverride ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/10 text-zinc-500'}`}>
                 <Edit3 size={10} /> {isManualOverride ? 'Manual' : 'Auto'}
               </button>
            </div>
            <div className="relative">
               {isManualOverride ? (
                  <textarea value={data.customInstructions || compiledPrompt} onChange={(e) => setData({...data, customInstructions: e.target.value})} className="w-full bg-black/60 rounded-2xl p-6 border border-purple-500/40 h-48 overflow-y-auto font-mono text-[10px] text-purple-100 outline-none custom-scrollbar leading-relaxed" />
               ) : (
                  <div className="bg-black/60 rounded-2xl p-6 border border-white/5 h-48 overflow-y-auto custom-scrollbar italic">
                    <p className="text-purple-100/40 font-mono text-[10px] leading-relaxed whitespace-pre-wrap">{compiledPrompt || "// WAITING..."}</p>
                  </div>
               )}
            </div>
          </div>

          {/* TESTER TERMINAL WITH LOW BALANCE POPUP */}
          <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl h-[550px] flex flex-col overflow-hidden relative">
             
             {/* POPUP ALERT FOR LOW TOKENS */}
{/* POPUP ALERT FOR LOW TOKENS */}
{isLowBalance && showWarning && (
  <div className="absolute inset-x-4 top-40 z-50 animate-in fade-in zoom-in duration-300">
    <div className="bg-[#1a1307] border border-amber-500/50 p-5 rounded-[1.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2">
        <button onClick={() => setShowWarning(false)} className="text-zinc-500 hover:text-white transition-colors">
          <XCircle size={16} />
        </button>
      </div>
      <div className="flex items-start gap-4">
        <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-500">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h5 className="text-xs font-black text-white uppercase italic tracking-wider">Critical Energy Levels</h5>
          <p className="text-[10px] text-amber-200/60 font-medium leading-relaxed mt-1">
            Neural Credits are below 25. Debugging will be restricted soon.
          </p>
          
          {/* CORRECTED BUTTON: onClick is now on the button, not the icon */}
          <button 
            onClick={() => typeof setActiveTab === 'function' && setActiveTab('purchase')}
            className="mt-3 text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
          >
            Initialize Refill <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  </div>
)}

             <div className="p-6 border-b border-white/5 flex items-center justify-between bg-purple-600/5">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-2.5 rounded-xl"><MessageSquare size={18} className="text-white"/></div>
                  <h4 className="text-white font-black text-xs uppercase italic">Neural Tester</h4>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black italic transition-all ${isLowBalance ? 'bg-amber-500/20 text-amber-500 animate-pulse' : 'bg-black/40 text-white'}`}>
                   {userTokens} <span className={isLowBalance ? 'text-amber-500' : 'text-purple-500'}>Credits</span>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                   <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-4 rounded-2xl max-w-[90%] text-xs font-bold shadow-xl ${
                        msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/10 text-zinc-100 rounded-tl-none border border-white/10'
                      }`}>
                        {msg.text}
                      </div>
                   </div>
                ))}
                {isChatting && <div className="text-[8px] text-purple-400 animate-pulse uppercase px-4 italic tracking-widest">Processing...</div>}
             </div>

             <div className="p-5 bg-black/40 border-t border-white/5 backdrop-blur-3xl">
                <div className="relative flex items-center gap-3">
                  <input 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && canChat && handleChat()}
                    className="flex-1 bg-black/60 border border-white/10 px-5 py-4 rounded-2xl outline-none text-white text-xs font-bold uppercase tracking-widest disabled:opacity-30 placeholder:text-zinc-700"
                    placeholder={canChat ? "Simulate query..." : "Credits Depleted"}
                    disabled={!canChat}
                  />
                  <button onClick={handleChat} disabled={!canChat || isChatting} className="bg-purple-600 text-white p-4 rounded-2xl hover:bg-purple-500 transition-all shadow-lg">
                    <Send size={18}/>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const Section = ({ title, icon, badge, children }) => (
  <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-purple-500/20 transition-all duration-500">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="bg-purple-600/10 border border-purple-500/30 p-3 rounded-2xl text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{title}</h3>
      </div>
      {badge && <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">{badge}</span>}
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="w-full space-y-3">
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">{label}</label>
    <div className="relative group">
      <input type="text" value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-purple-500/50 transition-all text-xs text-white font-bold uppercase tracking-widest placeholder:text-zinc-700" />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity"><Terminal size={14} className="text-purple-500" /></div>
    </div>
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows }) => (
  <div className="w-full space-y-2">
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">{label}</label>
    <div className="relative group">
      <textarea rows={rows} value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full p-6 bg-black/40 border border-white/10 rounded-[2rem] outline-none focus:border-purple-500/50 transition-all text-xs text-white font-medium leading-relaxed custom-scrollbar placeholder:text-zinc-700" />
      <Database size={24} className="absolute right-6 bottom-6 text-purple-500 opacity-5 group-focus-within:opacity-20 transition-opacity" />
    </div>
  </div>
);