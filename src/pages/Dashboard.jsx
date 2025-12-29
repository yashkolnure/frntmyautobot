import React, { useState, useEffect } from 'react';
import { 
  Loader2, Sparkles, Save, Terminal, ShieldCheck, Coins,
  Settings, Menu, X, Zap, Database 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveConfig, getConfig, sendDebugMessage } from '../api';

// COMPONENT IMPORTS
import Sidebar from '../components/dashboard/Sidebar';
import TrainingView from '../components/dashboard/TrainingView';
import HistoryView from '../components/dashboard/HistoryView';
import DeploymentView from '../components/dashboard/DeploymentView';
import LeadsView from '../components/dashboard/LeadsView';
import IntegrationsView from '../components/dashboard/IntegrationsView';
import TokenPurchaseView from '../components/dashboard/TokenPurchaseView'; // <-- NEW IMPORT

// --- THE AMBIENT BACKGROUND ---
const FullPageAmbientGlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-purple-800/20 blur-[150px] mix-blend-screen animate-[pulse_10s_infinite]"></div>
    <div className="absolute top-[30%] right-[-20%] w-[60vw] h-[60vh] rounded-full bg-fuchsia-800/10 blur-[180px] mix-blend-screen animate-[pulse_15s_infinite]"></div>
    <div className="absolute bottom-[10%] left-[-15%] w-[50vw] h-[50vh] rounded-full bg-indigo-900/20 blur-[160px] mix-blend-screen"></div>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('training');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Token State
  const [tokens, setTokens] = useState(0);

  const [data, setData] = useState({
    businessName: '',
    role: 'Customer Support Assistant',
    tone: 'Professional and Friendly',
    catalog: '',
    policies: '',
    faq: '',
    contact: ''
  });

  const [chat, setChat] = useState({ input: '', history: [], isChatting: false });

  // 1. FETCH CONFIG & TOKENS
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data: res } = await getConfig();
        if (res) {
          if (res.rawData) setData(res.rawData);
          setUserId(res._id || res.user);
          setTokens(res.userTokens || 0); 
        }
      } catch (err) {
        console.log("New user onboarding.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

 const compilePrompt = () => {
  return `
# SYSTEM IDENTITY
You are the ${data.role} for ${data.businessName || 'the business'}. 
Your personality is ${data.tone}.

# KNOWLEDGE BASE
${data.catalog}

# OPERATIONAL POLICIES
${data.policies}

# RESPONSE GUIDELINES
1. Format: Use *bold text* for emphasis and bullet points for lists.
2. Accuracy: ONLY use the provided Knowledge Base. If information is missing, say: "I'm sorry, I don't have specific information on that. Please contact us at ${data.contact}."
3. Brevity: Keep responses under 3 sentences unless explaining a process.
4. Language: Answer in the same language the customer uses.

# EXAMPLE CONVERSATION PATTERNS
${data.examples || 'Follow the established tone and be helpful.'}

# MANDATE
You are a helpful assistant. You do not mention that you are an AI. You represent ${data.businessName} perfectly.
`.trim();
};

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveConfig({
        businessName: data.businessName,
        instructions: compilePrompt(),
        rawData: data
      });
      alert("🚀 AI Brain Deployed Successfully!");
    } catch (err) {
      alert("❌ Deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chat.input.trim()) return;

    if (tokens < 5) {
      alert("⚠️ Insufficient Credits! Please top up your Neural Tokens.");
      setActiveTab('purchase'); // Automatically switch them to the purchase screen
      return;
    }

    const currentInput = chat.input;
    setChat(prev => ({ 
      ...prev, 
      isChatting: true, 
      input: '', 
      history: [...prev.history, { role: 'user', text: currentInput }] 
    }));

    try {
      const { data: res } = await sendDebugMessage(currentInput);
      if (res.success) {
        setChat(prev => ({ 
          ...prev, 
          history: [...prev.history, { role: 'bot', text: res.reply }] 
        }));
        setTokens(res.tokensRemaining);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Insufficient Credits: " + err.response.data.message);
        setActiveTab('purchase');
      } else {
        alert("VPS Offline or Connection Error");
      }
    } finally {
      setChat(prev => ({ ...prev, isChatting: false }));
    }
  };

  if (isFetching) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#05010d]">
      <Loader2 className="animate-spin text-purple-500" size={60} />
      <p className="mt-6 text-sm font-black uppercase tracking-[0.4em] text-purple-400">Syncing Nodes...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#05010d] text-slate-200 overflow-hidden relative selection:bg-purple-500/90 font-sans">
      
      <FullPageAmbientGlow />

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#05010d]/80 backdrop-blur-md z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-[50] w-60 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-full w-full">
           <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userTokens={tokens}
            onLogout={() => { localStorage.removeItem('token'); navigate('/login'); }} 
          />
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 lg:hidden p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 backdrop-blur-md transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        <header className="sticky top-0 bg-[#05010d]/60 backdrop-blur-2xl border-b border-white/5 p-4 md:p-6 lg:p-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-purple-400 active:scale-95 transition-all ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            >
              <Menu size={24} />
            </button>

            <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 bg-purple-600/10 border border-purple-500/20 rounded-xl items-center justify-center text-purple-400">
                {activeTab === 'training' && <Terminal size={22}/>}
                {activeTab === 'history' && <ShieldCheck size={22}/>}
                {activeTab === 'leads' && <Database size={22}/>}
                {activeTab === 'deployment' && <Zap size={22}/>}
                {activeTab === 'integrations' && <Sparkles size={22}/>}
                {activeTab === 'purchase' && <Coins size={22}/>} {/* Added Icon */}
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-xl font-black tracking-tighter text-white uppercase italic leading-none">
                {activeTab === 'training' ? 'Control Room' : activeTab === 'purchase' ? 'Neural Funding' : activeTab.replace(/^\w/, (c) => c.toUpperCase())}             </h1>
              <p className="hidden md:block text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5">
                Neural System Online • Node 3.2-L
              </p>
            </div>
          </div>
          
          {activeTab === 'training' && (
            <button 
              onClick={handleSave} 
              disabled={loading}
              
              className="bg-purple-600 text-white px-4 py-2 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-s uppercase tracking-widest flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] hover:bg-purple-500 active:scale-95 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
              <span className="hidden sm:inline">Push to Production</span>
              <span className="sm:hidden">Publish</span>
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-6 custom-scrollbar">
          
          <div className="max-w-[1700px] mx-auto animate-in fade-in duration-700">
           {activeTab === 'training' && (
    <TrainingView 
      data={data} 
      setData={setData} 
      handleSave={handleSave} 
      loading={loading} 
      chatHistory={chat.history} 
      chatInput={chat.input} 
      setChatInput={(val) => setChat({ ...chat, input: val })} 
      handleChat={handleChat} 
      isChatting={chat.isChatting}
      compiledPrompt={compilePrompt()} 
      userTokens={tokens} 
      
      // ADD THIS LINE HERE:
      setActiveTab={setActiveTab} 
    />
  )}
            
            {activeTab === 'history' && <HistoryView />}
            {activeTab === 'leads' && <LeadsView />}
            {activeTab === 'deployment' && <DeploymentView userId={userId} />}
            {activeTab === 'integrations' && <IntegrationsView userId={userId} />}
            
            {/* --- NEW: TOKEN PURCHASE VIEW --- */}
            {activeTab === 'purchase' && (
              <TokenPurchaseView 
                userTokens={tokens} 
                onPurchase={(planId) => {
                  alert(`Redirecting to secure gateway for ${planId} plan...`);
                }} 
              />
            )}
          </div>

          {activeTab === 'settings' && (
            <div className="py-20 text-center relative border-2 border-dashed border-white/5 rounded-[3rem] bg-white/5 backdrop-blur-xl">
              <Settings className="w-12 h-12 text-slate-700 mx-auto mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-sm">Module Offline</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}