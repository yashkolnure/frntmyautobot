import React, { useState, useEffect } from 'react';
import { 
  Loader2, Sparkles, Save, Terminal, ShieldCheck, Coins,
  Settings, Menu, X, Zap, Database 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveConfig, getConfig } from '../api';

// COMPONENT IMPORTS
import Sidebar from '../components/dashboard/Sidebar';
import TrainingView from '../components/dashboard/TrainingView';
import ReferAndEarnView from '../components/dashboard/ReferAndEarnView';
import HistoryView from '../components/dashboard/HistoryView';
import DeploymentView from '../components/dashboard/DeploymentView';
import LeadsView from '../components/dashboard/LeadsView';
import IntegrationsView from '../components/dashboard/IntegrationsView';
import APIKeysView from '../components/dashboard/APIKeysView';
import TokenPurchaseView from '../components/dashboard/TokenPurchaseView';
import ProfilePage from '../components/dashboard/ProfilePage';

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
  const [userId, setUserId] = useState(null); // This is the botId/userId for deployment
  const [isFetching, setIsFetching] = useState(true);
  const [tokens, setTokens] = useState(0);

  // --- UNIFIED DATA STATE ---
  const [data, setData] = useState({
    status: 'draft',
    model: { primary: 'llama3.2', fallback: 'llama3' },
    rawData: {
      businessName: '',
      businessDescription: '',
      pricing: '',
      faq: '',
      policies: ''
    }
  });

  // 1. FETCH CONFIGURATION ON MOUNT
// 1. Updated Hydration Logic
useEffect(() => {
  const fetchConfig = async () => {
    try {
      const { data: res } = await getConfig();
      
      // Check both bot and botConfig keys
      const botObj = res.bot || res.botConfig;

      if (botObj) {
        setData(botObj);
        
        // --- CRITICAL FIX ---
        // If the Deployment ID is the Owner/User ID, use botObj.user
        // If it is the Bot's own ID, use botObj._id
        const deploymentId = botObj.user || botObj._id; 
        
        setUserId(deploymentId); 
      }
      
      if (res.userTokens !== undefined) setTokens(res.userTokens);
    } catch (err) {
      console.error("Neural Sync failed.");
    } finally {
      setIsFetching(false);
    }
  };
  fetchConfig();
}, []);
  // 2. SAVE HANDLER
  const onSave = async (finalPayload) => {
    setLoading(true);
    try {
      const response = await saveConfig(finalPayload);
      if (response.data.success) {
        setData(response.data.bot); 
        setUserId(response.data.bot._id);
        alert("🚀 Configuration Synced Successfully!");
      }
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.message || "Sync Failed"}`);
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#05010d]">
      <Loader2 className="animate-spin text-purple-500" size={60} />
      <p className="mt-6 text-sm font-black uppercase tracking-[0.4em] text-purple-400">Synchronizing Brain Nodes...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#05010d] text-slate-200 overflow-hidden relative font-sans">
      <FullPageAmbientGlow />

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#05010d]/80 backdrop-blur-md z-[45] lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-[50] w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userTokens={tokens}
          onLogout={() => { localStorage.removeItem('token'); navigate('/login'); }} 
        />
      </div>
      
      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* HEADER */}
        <header className="sticky top-0 bg-[#05010d]/60 backdrop-blur-2xl border-b border-white/5 p-4 md:p-6 lg:p-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-purple-400">
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-xl font-black tracking-tighter text-white uppercase italic leading-none">
                {activeTab === 'training' ? 'Neural Control' : activeTab.toUpperCase()}
              </h1>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5">Node: Synchronized • V 2.0.4</p>
            </div>
          </div>
        
        </header>

        {/* VIEW RENDERER */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-6 custom-scrollbar">
          <div className="max-w-[1700px] mx-auto animate-in fade-in duration-700">
            {activeTab === 'training' && (
              <TrainingView 
                data={data} 
                setData={setData} 
                onSave={onSave} 
                loading={loading}
              />
            )}
            
            {activeTab === 'history' && <HistoryView />}
            {activeTab === 'leads' && <LeadsView />}
            {activeTab === 'referral' && <ReferAndEarnView userId={userId} />}
            {activeTab === 'deployment' && ( <DeploymentView userId={userId} />
              )}
            {activeTab === 'profile' && ( <ProfilePage userId={userId} />
              )}
              {activeTab === 'apikeys' && (
       <APIKeysView userId={userId} />
    )}
            {activeTab === 'integrations' && <IntegrationsView userId={userId} />}
            {activeTab === 'purchase' && (
              <TokenPurchaseView 
                userTokens={tokens} 
                onPurchase={(planId) => console.log(`Checkout: ${planId}`)} 
              />
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}