import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Bot, Database, CheckCircle, Loader2, 
  Terminal, Zap, ChevronRight, Layers, X, FileText, 
  Sparkles, ShieldCheck, Activity, MessageSquare, Target, 
  Globe, Rocket
} from 'lucide-react';

const BotCreationDashboard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  // --- CONFIGURATION ---
  const BACKEND_URL = "/api/deploy-bot";

  // --- PROFESSIONAL PROMPT TEMPLATES ---
  const templates = {
    support: {
      label: "Support Bot",
      icon: <MessageSquare size={16} />,
      prompt: `Role: Elite Customer Support Specialist.\nTone: Professional, empathetic, and concise.\n\nInstructions:\n1. You are an expert assistant for [Business Name]. Your primary goal is to provide accurate information based EXCLUSIVELY on the provided Knowledge Base.\n2. If the answer is not in the knowledge base, politely state that you don't have that information.\n3. NEVER make up facts. Use bullet points for clarity.`
    },
    sales: {
      label: "Sales Agent",
      icon: <Target size={16} />,
      prompt: `Role: High-Conversion Sales Executive.\nTone: Enthusiastic, persuasive, and professional.\n\nInstructions:\n1. You represent [Business Name]. Qualify leads and drive them toward a booking.\n2. Highlight key benefits found in the documents.\n3. Prioritize asking for contact information or suggesting a demo.`
    }
  };

  const [botSetup, setBotSetup] = useState({
    botName: '',
    systemPrompt: templates.support.prompt,
    files: [],
  });

  useEffect(() => { 
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    if (step === 4) {
      const timer = setTimeout(() => navigate('/dashboard'), 3500);
      return () => clearTimeout(timer);
    }
  }, [logs, step, navigate]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  const applyTemplate = (type) => {
    const finalPrompt = templates[type].prompt.replace('[Business Name]', botSetup.botName || 'our company');
    setBotSetup(prev => ({ ...prev, systemPrompt: finalPrompt }));
    addLog(`✨ Template: ${templates[type].label} architecture applied.`, "info");
  };

  // --- ACTUAL DEPLOYMENT ENGINE ---
  const handleDeployment = async () => {
    if (botSetup.files.length === 0) {
      addLog("⚠️ Deployment Aborted: Knowledge base is empty.", "error");
      return;
    }

    setLoading(true);
    setLogs([]);
    addLog("🚀 INITIALIZING NEURAL PIPELINE...", "command");

    try {
      const payload = new FormData();
      
      // Real file appending
      botSetup.files.forEach((file) => {
        payload.append('files', file); 
      });

      payload.append('botName', botSetup.botName);
      payload.append('systemPrompt', botSetup.systemPrompt);
      payload.append('userId', localStorage.getItem('userId') || 'guest_user');

      addLog(`📤 Uploading ${botSetup.files.length} knowledge clusters...`, "info");

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: payload, 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || "Backend synchronization failed");
      }

      addLog(`✨ Success: ${botSetup.files.length} sources indexed.`, "success");
      addLog("🎉 AGENT SYNTHESIS COMPLETE. REDIRECTING...", "success");
      
      setStep(4);
    } catch (error) {
      addLog(`❌ PIPELINE CRASH: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 font-sans selection:bg-purple-500/30 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Rocket className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              AutoBot<span className="text-purple-500">.in</span>
            </h1>
          </div>

          <div className="hidden md:flex gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`px-5 py-1.5 rounded-xl text-[10px] font-black transition-all ${step === i ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-slate-600'}`}>
                STEP 0{i}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div 
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative"
              >
                <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-white italic">AGENT DNA</h2>
                      <p className="text-slate-500 text-sm">Configure your bot's name and its primary logic core.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="group">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 block ml-1">Business Identity</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-purple-500/50 outline-none text-white transition-all placeholder:text-slate-700"
                          placeholder="Enter Bot or Business Name..."
                          value={botSetup.botName}
                          onChange={(e) => setBotSetup({...botSetup, botName: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Operational Logic</label>
                          <div className="flex gap-2">
                            {Object.keys(templates).map((t) => (
                              <button 
                                key={t}
                                onClick={() => applyTemplate(t)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold transition-all text-slate-400 hover:text-white"
                              >
                                {templates[t].label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 h-48 focus:border-purple-500/50 outline-none text-white transition-all resize-none text-sm font-mono leading-relaxed"
                          value={botSetup.systemPrompt}
                          onChange={(e) => setBotSetup({...botSetup, systemPrompt: e.target.value})}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      disabled={!botSetup.botName}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-5 rounded-2xl font-black text-white shadow-xl shadow-purple-900/20 disabled:opacity-20 transition-all"
                    >
                      SYNC PERSONA & CONTINUE
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-black text-white italic uppercase">Intelligence Ingress</h2>
                    
                    <div 
                      className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/50 transition-all cursor-pointer"
                      onClick={() => document.getElementById('fileIn').click()}
                    >
                      <input id="fileIn" type="file" multiple className="hidden" 
                        onChange={(e) => {
                          const newFiles = Array.from(e.target.files);
                          setBotSetup(prev => ({...prev, files: [...prev.files, ...newFiles]}));
                          addLog(`📁 Queued ${newFiles.length} new source(s).`, "info");
                        }} 
                      />
                      <Upload className="mx-auto mb-4 text-blue-500" size={40} />
                      <p className="text-lg font-bold text-white">Drop Training Data</p>
                      <p className="text-slate-500 text-xs mt-1">PDF, DOCX, or TXT formats accepted</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {botSetup.files.map((file, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-xs font-bold truncate text-slate-300">{file.name}</span>
                            <X className="text-slate-600 cursor-pointer hover:text-red-400" size={14} onClick={() => setBotSetup(prev => ({...prev, files: prev.files.filter((_, idx) => idx !== i)}))} />
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 bg-white/5 py-5 rounded-2xl font-black">BACK</button>
                      <button onClick={() => setStep(3)} className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 py-5 rounded-2xl font-black text-white shadow-xl">PRE-FLIGHT CHECK</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 text-center py-6">
                    <div className="w-24 h-24 bg-purple-500/10 text-purple-500 rounded-3xl flex items-center justify-center mx-auto border border-purple-500/20 animate-pulse">
                      <ShieldCheck size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Ready for Deployment</h2>
                    
                    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 text-left space-y-3 font-mono text-xs">
                        <p><span className="text-purple-500">▶ AGENT:</span> {botSetup.botName}</p>
                        <p><span className="text-blue-500">▶ KNOWLEDGE:</span> {botSetup.files.length} sources</p>
                    </div>

                    <button 
                      onClick={handleDeployment}
                      disabled={loading || botSetup.files.length === 0}
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <Layers size={24} />}
                      {loading ? "SYNTHESIZING..." : "LAUNCH AGENT"}
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center py-20 animate-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.4)] mb-8">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <h2 className="text-5xl font-black text-white italic tracking-tighter">MISSION LIVE</h2>
                    <p className="text-slate-500 mt-4">Agent DNA successfully synthesized. Redirecting...</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Terminal Logs */}
          <div className="lg:col-span-5 flex flex-col h-[650px]">
            <div className="bg-[#0b031a]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex-1 flex flex-col overflow-hidden shadow-2xl relative">
              <div className="bg-white/5 px-8 py-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity size={14} className="text-purple-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">System_Core_v4</span>
                </div>
              </div>
              
              <div className="p-8 font-mono text-[11px] overflow-y-auto flex-1 custom-scrollbar space-y-3">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4 border-l border-purple-500/20 pl-4 py-0.5">
                    <span className="text-slate-800 shrink-0">{log.timestamp}</span>
                    <span className={`${log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-red-500' : 'text-slate-500'}`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                {logs.length === 0 && <div className="text-slate-800 italic uppercase">Waiting for input...</div>}
                <div ref={logEndRef} />
              </div>

              <div className="p-6 bg-white/5 border-t border-white/10 flex justify-between">
                  <span className="text-[9px] font-black text-slate-600 uppercase">Status: Online</span>
                  <span className="text-[9px] font-black text-purple-600 uppercase animate-pulse">Ready</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BotCreationDashboard;