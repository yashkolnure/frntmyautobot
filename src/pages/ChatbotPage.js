import React, { useState, useEffect, useMemo } from "react";

export default function BotEngine() {
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tokens, setTokens] = useState(0);

  const API_BASE_URL = "http://localhost:5000/api/bot"; // Update this for production

  // --- 1. INITIAL DATA FETCH ---
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
          setTokens(res.botConfig.userTokens || 0);
        } else {
          // Default template for brand new users
          setData({
            status: "draft",
            model: { primary: "llama3", fallback: "llama3.2" },
            rawData: { businessName: "", businessDescription: "", pricing: "", faq: "", policies: "" }
          });
        }
      } catch (err) {
        console.error("Connection to VPS failed.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchNeuralLink();
  }, []);

  // --- 2. DYNAMIC AI LOGIC ---
  const rawData = data?.rawData || {};

  const autoRagContent = useMemo(() => {
    return `
BUSINESS NAME: ${rawData.businessName || "Not provided"}
DESCRIPTION: ${rawData.businessDescription || "Not provided"}
PRICING: ${rawData.pricing || "Not provided"}
FAQ: ${rawData.faq || "Not provided"}
POLICIES: ${rawData.policies || "Not provided"}
    `.trim();
  }, [rawData]);

  const autoSystemPrompt = useMemo(() => {
    return `
You are an AI for ${rawData.businessName || "this business"}.
Answer ONLY using the provided Knowledge Base.
If info is missing, politely ask for customer contact details.
    `.trim();
  }, [rawData.businessName]);

  // --- 3. INLINE SAVE HANDLER ---
  const handlePublish = async (statusOverride) => {
    if (!rawData.businessName?.trim()) return alert("❌ Business Name is required.");

    setIsSaving(true);
    const token = localStorage.getItem("token");
    const finalStatus = statusOverride || data.status || "draft";
    
    // Determine which content to send (Auto vs Manual)
    const finalRag = data.isCustomRagEnabled ? data.ragFile : autoRagContent;
    const finalPrompt = data.isManualPromptEnabled ? data.customSystemPrompt : autoSystemPrompt;

    const payload = {
      ...data,
      status: finalStatus,
      systemPrompt: finalPrompt,
      generatedPrompt: autoSystemPrompt,
      ragFile: finalRag,
      rawData: rawData 
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
        setData(res.botConfig); // Refreshes UI with DB state
        alert(`Successfully synced as ${finalStatus.toUpperCase()}`);
      } else {
        throw new Error(res.message || "Save failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- 4. LOADING GUARD ---
  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 mr-3"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Synchronizing Brain Nodes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT SECTION: CONFIGURATION */}
        <div className="lg:col-span-2 space-y-10">
          <header className="flex justify-between items-end border-b border-white/5 pb-8">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Bot Engine</h1>
              <p className="text-zinc-500 text-sm mt-1">Configure RAG knowledge nodes and system prompts.</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Neural Credits</p>
              <p className="text-2xl font-mono text-indigo-400">{tokens}</p>
            </div>
          </header>

          {/* SYSTEM STATUS */}
          <section className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-3 w-3 rounded-full ${data.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Live Status</h3>
                <p className="text-xs text-zinc-500 font-mono italic">{data.status}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handlePublish("inactive")} className="px-6 py-2 bg-zinc-800 rounded-xl text-xs font-bold hover:bg-zinc-700 transition">DEACTIVATE</button>
              <button onClick={() => handlePublish("active")} className="px-6 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">GO LIVE</button>
            </div>
          </section>

          {/* DATA FORMS */}
          <section className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 space-y-8">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-l-2 border-indigo-500 pl-4">Knowledge Base</h2>
            <div className="grid grid-cols-1 gap-6">
              <Input 
                label="Bot / Business Name" 
                value={rawData.businessName || ""} 
                onChange={(v) => setData({...data, rawData: {...rawData, businessName: v}})} 
              />
              <Textarea 
                label="Description" 
                value={rawData.businessDescription || ""} 
                onChange={(v) => setData({...data, rawData: {...rawData, businessDescription: v}})} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Textarea label="Pricing" value={rawData.pricing || ""} onChange={(v) => setData({...data, rawData: {...rawData, pricing: v}})} />
                <Textarea label="FAQs" value={rawData.faq || ""} onChange={(v) => setData({...data, rawData: {...rawData, faq: v}})} />
              </div>
              <Textarea label="Policies" value={rawData.policies || ""} onChange={(v) => setData({...data, rawData: {...rawData, policies: v}})} />
            </div>
          </section>

          <button 
            disabled={isSaving}
            onClick={() => handlePublish(data.status)}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {isSaving ? "Syncing..." : "Synchronize with VPS"}
          </button>
        </div>

        {/* RIGHT SECTION: PREVIEW */}
        <div className="lg:col-span-1">
          <aside className="sticky top-12">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Preview</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-bold text-indigo-400 uppercase mb-2 block">System Instructions</label>
                  <div className="text-[11px] font-mono text-zinc-400 bg-black/50 p-4 rounded-xl border border-white/5 h-40 overflow-y-auto leading-relaxed">
                    {data.isManualPromptEnabled ? data.customSystemPrompt : autoSystemPrompt}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-indigo-400 uppercase mb-2 block">Compiled Knowledge (RAG)</label>
                  <div className="text-[11px] font-mono text-zinc-400 bg-black/50 p-4 rounded-xl border border-white/5 h-40 overflow-y-auto leading-relaxed">
                    {data.isCustomRagEnabled ? data.ragFile : autoRagContent}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* --- STANDALONE UI COMPONENTS --- */

const Input = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</label>
    <input 
      className="bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-indigo-500 transition shadow-inner" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</label>
    <textarea 
      rows={4} 
      className="bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-indigo-500 transition resize-none leading-relaxed" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  </div>
);