import React, { useState, useEffect, useMemo } from "react";

/**
 * PETOBA NEURAL ENGINE - V2.5 PRODUCTION
 * A standalone, zero-dependency configuration suite with Glassmorphism UI.
 * Handles: Auto-Compiling RAG, Manual Overrides, Persona Selection, and VPS Sync.
 */
export default function BotEngine() {
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tokens, setTokens] = useState(0);

  // Set this to your VPS production domain or local development IP
  const API_BASE_URL = "/api/bot"; 

  /* -------------------------------------------------------------------------- */
  /* 1. NEURAL LINK: DATA HYDRATION                                            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchNeuralLink = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await response.json();

        if (response.ok && res.botConfig) {
          setData(res.botConfig);
          // Sync tokens from user object returned in the same call
          setTokens(res.userTokens || 0);
        } else {
          // Default Template for New Neural Nodes
          setData({
            status: "draft",
            isManualPromptEnabled: false,
            isCustomRagEnabled: false,
            model: { primary: "llama3", fallback: "llama3.2" },
            customSystemPrompt: "",
            ragFile: "",
            rawData: { 
              businessName: "", 
              businessDescription: "", 
              pricing: "",
              faq: "",
              policies: "",
              agentType: "support",
              tone: "professional",
              language: "English"
            }
          });
        }
      } catch (err) {
        console.error("Critical: Neural Link Synchronization Failed.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchNeuralLink();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 2. AI COMPILER: DYNAMIC LOGIC                                             */
  /* -------------------------------------------------------------------------- */
  const rawData = data?.rawData || {};

  // RAG COMPILER: Merges separate nodes into a structured knowledge file
  const autoRagContent = useMemo(() => {
    return `
# KNOWLEDGE BASE: ${rawData.businessName || "UNNAMED_ENTITY"}

## DESCRIPTION
${rawData.businessDescription || "Information not provided."}

## OFFERINGS & PRICING
${rawData.pricing || "Information not provided."}

## FREQUENTLY ASKED QUESTIONS
${rawData.faq || "Information not provided."}

## POLICIES & COMPLIANCE
${rawData.policies || "Information not provided."}
    `.trim();
  }, [rawData]);

  // PROMPT COMPILER: Adjusts instructions based on Agent Role and Tone
  const autoSystemPrompt = useMemo(() => {
    const roles = {
      support: `You are a Customer Support Expert for ${rawData.businessName}. Focus on accuracy and solving user issues.`,
      sales: `You are a Sales Specialist for ${rawData.businessName}. Be persuasive and highlight value propositions.`,
      lead: `You are a Lead Generation Agent for ${rawData.businessName}. Your primary goal is to collect Name and Email from users.`,
      general: `You are a General Knowledge Assistant for ${rawData.businessName}.`
    };

    const tones = {
      professional: "Use a professional, polished, and formal tone.",
      friendly: "Use a warm, enthusiastic tone with helpful emojis.",
      technical: "Be precise, objective, and use technical language."
    };

    return `
${roles[rawData.agentType] || roles.support}
TONE: ${tones[rawData.tone] || tones.professional}

OPERATING CONSTRAINTS:
1. ONLY answer questions using the provided Knowledge Base (RAG).
2. If the answer is not present, politely state you don't know and ask for an email to follow up.
3. Stay strictly on-topic regarding ${rawData.businessName}.
    `.trim();
  }, [rawData.businessName, rawData.agentType, rawData.tone]);

  /* -------------------------------------------------------------------------- */
  /* 3. VPS SYNCHRONIZATION (SAVE)                                             */
  /* -------------------------------------------------------------------------- */
  const handlePublish = async (statusOverride) => {
    if (!rawData.businessName?.trim()) {
      alert("❌ Business Name is required to initialize the engine.");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("token");
    const finalStatus = statusOverride || data.status || "draft";
    
    // Determine source: Manual Overrides vs Auto-Generated
    const finalRag = data.isCustomRagEnabled ? data.ragFile : autoRagContent;
    const finalPrompt = data.isManualPromptEnabled ? data.customSystemPrompt : autoSystemPrompt;

    const payload = {
      ...data,
      status: finalStatus,
      systemPrompt: finalPrompt,
      generatedPrompt: autoSystemPrompt, // Reference field
      ragFile: finalRag,
      rawData: rawData // Keeps UI fields separated
    };

    try {
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (response.ok && res.botConfig) {
        setData(res.botConfig);
        alert(`Uplink Successful: Configuration saved as ${finalStatus.toUpperCase()}`);
      } else {
        throw new Error(res.message || "Save cycle failed.");
      }
    } catch (err) {
      alert("Neural Sync Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 4. RENDER LOGIC                                                           */
  /* -------------------------------------------------------------------------- */
  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-opacity-50 mb-4 mx-auto"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Syncing_Nodes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100 p-4  selection:bg-indigo-500/30 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ARCHITECTURE */}
        <div className="lg:col-span-2 space-y-6">
          
          <header className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl">Bot Engine</h1>
              <p className="text-zinc-500 text-sm mt-3 font-medium tracking-wide">Autonomous Training Suite for <span className="text-indigo-400">MyAutoBot.in</span></p>
            </div>
            <div className="text-right backdrop-blur-md bg-white/[0.05] p-5 rounded-3xl border border-white/10">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Neural Credits</p>
              <p className="text-3xl font-mono text-center font-black text-indigo-400">{tokens}</p>
            </div>
          </header>

          {/* DEPLOYMENT STATUS */}
          <section className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`h-3 w-3 rounded-full ${data.status === 'active' ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-zinc-700'}`} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">System Status</h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase italic">{data.status === 'active' ? 'Production_Live' : 'Development_Draft'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handlePublish("inactive")} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest hover:bg-white/10 transition uppercase">Deactivate</button>
              <button onClick={() => handlePublish("active")} className="px-6 py-2 bg-indigo-600/90 rounded-xl text-[10px] font-black tracking-widest hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 uppercase">Publish</button>
            </div>
          </section>

          {/* CORE ARCHITECTURE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <Select 
                label="Intelligence Model" 
                value={data.model?.primary || "llama3"} 
                options={[
                  { value: "llama3", label: "Llama 3 (Meta)" },
                  { value: "llama3.2", label: "Llama 3.2 (Speed)" },
                  { value: "mistral", label: "Mistral 7B" },
                  { value: "deepseek", label: "DeepSeek R1" }
                ]}
                onChange={(v) => setData({...data, model: {...data.model, primary: v}})}
              />
            </GlassCard>
            <GlassCard>
              <Select 
                label="Agent Persona" 
                value={rawData.agentType || "support"} 
                options={[
                  { value: "support", label: "Customer Support" },
                  { value: "sales", label: "Sales Optimizer" },
                  { value: "lead", label: "Lead Capture" },
                  { value: "general", label: "Assistant" }
                ]}
                onChange={(v) => setData({...data, rawData: {...rawData, agentType: v}})}
              />
            </GlassCard>
          </div>

          {/* KNOWLEDGE FOUNDATION */}
          <section className="backdrop-blur-md bg-white/[0.05] border border-white/5 rounded-[3rem] p-8 space-y-4 shadow-inner">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Knowledge Foundation</h2>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase font-black">Manual RAG Override</span>
                <Toggle value={data.isCustomRagEnabled} onChange={(v) => setData({...data, isCustomRagEnabled: v})} />
              </div>
            </div>

            {data.isCustomRagEnabled ? (
              <Textarea 
                label="Custom Knowledge Feed" 
                placeholder="Paste raw knowledge data here..."
                value={data.ragFile || ""} 
                onChange={(v) => setData({...data, ragFile: v})} 
              />
            ) : (
              <div className="space-y-8">
                <Input label="Business Entity Name" value={rawData.businessName} onChange={(v) => setData({...data, rawData: {...rawData, businessName: v}})} />
                <Textarea label="Base Context / Description" value={rawData.businessDescription} onChange={(v) => setData({...data, rawData: {...rawData, businessDescription: v}})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Textarea label="Offerings & Pricing" value={rawData.pricing} onChange={(v) => setData({...data, rawData: {...rawData, pricing: v}})} />
                  <Textarea label="Core FAQs" value={rawData.faq} onChange={(v) => setData({...data, rawData: {...rawData, faq: v}})} />
                </div>
                <Textarea label="Operating Policies" value={rawData.policies} onChange={(v) => setData({...data, rawData: {...rawData, policies: v}})} />
              </div>
            )}
          </section>

          {/* PROMPT CONTROL */}
          <section className="backdrop-blur-md bg-white/[0.05] border border-white/5 rounded-[3rem] p-10 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Intelligence Control</h2>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase font-black">Manual Prompt Override</span>
                <Toggle value={data.isManualPromptEnabled} onChange={(v) => setData({...data, isManualPromptEnabled: v})} />
              </div>
            </div>

            {data.isManualPromptEnabled ? (
              <Textarea 
                label="Manual System Prompt" 
                value={data.customSystemPrompt || ""} 
                onChange={(v) => setData({...data, customSystemPrompt: v})} 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Select 
                  label="Interaction Tone" 
                  value={rawData.tone || "professional"} 
                  options={[
                    {value: "professional", label: "Professional"},
                    {value: "friendly", label: "Friendly"},
                    {value: "technical", label: "Technical"}
                  ]}
                  onChange={(v) => setData({...data, rawData: {...rawData, tone: v}})}
                />
                <Select 
                  label="Primary Language" 
                  value={rawData.language || "English"} 
                  options={[{value: "English", label: "English"}, {value: "Hindi", label: "Hindi"}]}
                  onChange={(v) => setData({...data, rawData: {...rawData, language: v}})}
                />
              </div>
            )}
          </section>

          <button 
            disabled={isSaving}
            onClick={() => handlePublish(data.status)}
            className="w-full bg-white/90 text-black py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] hover:bg-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl"
          >
            {isSaving ? "Synchronizing_Engine..." : "Commit Node Changes"}
          </button>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="lg:col-span-1">
          <aside className="sticky top-0 ">
            <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] text-center pb-6 border-b border-white/5">Neural Architecture Preview</h3>
               
               <div className="space-y-8">
                  <div>
                    <label className="text-[9px] font-black text-indigo-400 uppercase block mb-3 tracking-widest">Model / Environment</label>
                    <div className="flex gap-2">
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/20 font-mono font-bold uppercase">{data.model?.primary}</span>
                      <span className="text-[9px] bg-white/5 text-zinc-400 px-3 py-1 rounded-lg border border-white/5 font-mono font-bold uppercase">{rawData.agentType}</span>
                    </div>
                  </div>

                  <PreviewBlock label="System Prompt" content={data.isManualPromptEnabled ? data.customSystemPrompt : autoSystemPrompt} />
                  <PreviewBlock label="RAG Knowledge" content={data.isCustomRagEnabled ? data.ragFile : autoRagContent} />
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* --- STANDALONE UI COMPONENTS --- */

const GlassCard = ({ children }) => (
  <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.05] transition-all">
    {children}
  </div>
);

const PreviewBlock = ({ label, content }) => (
  <div>
    <label className="text-[9px] font-black text-indigo-400 uppercase block mb-3 tracking-widest">{label}</label>
    <div className="text-[11px] font-mono leading-relaxed text-zinc-400 bg-black/40 p-5 rounded-[1.5rem] border border-white/5 h-48 overflow-y-auto">
      {content || "Initializing Intelligence..."}
    </div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
    <input className="bg-transparent border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.02] transition-all" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea rows={4} placeholder={placeholder} className="bg-transparent border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.02] transition-all resize-none leading-relaxed" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <select className="w-full bg-transparent border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500/50 transition cursor-pointer appearance-none" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value} className="bg-zinc-950 text-white">{o.label}</option>)}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-all duration-300 ${value ? "bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]" : "bg-white/10"}`}>
    <div className={`h-3 w-3 bg-white rounded-full mx-1 transition-transform duration-300 ${value ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);