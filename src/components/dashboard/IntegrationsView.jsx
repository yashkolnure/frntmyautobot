import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageCircle, Instagram, Link, Copy, Check, Settings, 
  Loader2, ShieldCheck, RefreshCw, Sparkles, Key, Info, 
  ChevronUp, Facebook 
} from 'lucide-react';
import API from '../../api';

// --- Sub-Component: Configuration Input ---
const ConfigInput = ({ label, value, onChange, placeholder, isSensitive = false, disabled = false }) => {
  const [showValue, setShowValue] = useState(false);
  
  return (
    <div className={`relative group transition-opacity duration-300 ${disabled ? 'opacity-30' : 'opacity-100'}`}>
      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className="relative">
        <input 
          type={isSensitive && !showValue ? "password" : "text"}
          placeholder={disabled ? "Channel Disabled" : placeholder} 
          disabled={disabled}
          className={`w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-sm text-purple-100 outline-none transition-all placeholder:text-slate-800 font-mono shadow-inner ${disabled ? 'cursor-not-allowed select-none' : 'focus:border-purple-500/50 focus:bg-black/60'}`} 
          value={disabled ? "" : value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

// --- Sub-Component: Channel Status Card ---
const ChannelCard = ({ title, icon, status, desc, onRetry, disabled, isActive, onToggle }) => {
  const statusStyles = {
    idle: "text-slate-500 bg-white/5 border-white/10",
    checking: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    connected: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    failed: "text-red-400 bg-red-500/10 border-red-500/30",
    disabled: "text-slate-600 bg-black/20 border-white/5"
  };

  return (
    <div className={`bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:-translate-y-1'} ${!isActive ? 'border-white/5' : (status === 'failed' ? 'border-red-500/30' : 'border-white/10')}`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl transition-colors ${isActive ? 'bg-black/20' : 'bg-white/5'}`}>{icon}</div>
          {!disabled && (
            <button 
              onClick={onToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          )}
        </div>
        <h4 className="font-black text-white mb-2 text-md uppercase tracking-tighter">{title}</h4>
        <p className="text-[10px] text-slate-500 leading-relaxed font-bold mb-4 tracking-tight">{desc}</p>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border mb-4 ${statusStyles[isActive ? status : 'disabled']}`}>
           {status === 'checking' && isActive ? <Loader2 size={10} className="animate-spin" /> : <div className={`w-1 h-1 rounded-full ${status === 'connected' && isActive ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />}
           {isActive ? (status === 'connected' ? 'Uplink Active' : status === 'failed' ? 'Link Error' : 'Syncing...') : 'Hibernating'}
        </div>
        {status === 'failed' && isActive && !disabled && (
          <button onClick={onRetry} className="flex items-center gap-2 text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 transition-colors">
            <RefreshCw size={10} /> Re-verify Node
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function IntegrationsView({ userId }) {
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null); 

  const [config, setConfig] = useState({
    whatsappToken: '',
    phoneNumberId: '',
    whatsappEnabled: false,
    instagramToken: '',
    instagramBusinessId: '',
    instagramEnabled: false,
    verifyToken: 'myautobot_webhook_token_2025fdcs', 
  });

  const [connectionStatus, setConnectionStatus] = useState({
    whatsapp: 'idle',
    instagram: 'idle'
  });

  const REDIRECT_URI = 'https://myautobot.in/api/auth/callback/';

  // --- Initialize Meta SDK ---
  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : '900824542624488',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v24.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  // --- Launch One-Click Signup (WhatsApp) ---
  const launchWhatsAppSignup = () => {
    if (!window.FB) return alert("Meta SDK not loaded yet.");
    window.FB.login((response) => {
      if (response.authResponse) {
        window.location.href = `${REDIRECT_URI}?platform=whatsapp&code=${response.authResponse.code}`;
      }
    }, {
      config_id: '1510513603582692', // Unified WhatsApp/Business Config
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      override_default_response_type: true
    });
  };

  // --- Launch One-Click Signup (Instagram Dedicated) ---
  const launchInstagramSignup = () => {
    if (!window.FB) return alert("Meta SDK not loaded.");
    window.FB.login((response) => {
      if (response.authResponse) {
        window.location.href = `${REDIRECT_URI}?platform=instagram&code=${response.authResponse.code}`;
      }
    }, {
      config_id: '1418243342982885', // NEW Dedicated Instagram Config
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      override_default_response_type: true
    });
  };

  const fetchConfig = useCallback(async () => {
    try {
      setInitialLoading(true);
      const { data } = await API.get(`/bot/config`); 
      if (data) {
        setConfig(prev => ({ ...prev, ...data }));
        if (data.whatsappToken && data.whatsappEnabled) verifyChannel('whatsapp', data);
        if (data.instagramToken && data.instagramEnabled) verifyChannel('instagram', data);
      }
    } catch (err) {
      console.error("Neural Link Fetch Error:", err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const verifyChannel = async (platform, customConfig = config) => {
    setConnectionStatus(prev => ({ ...prev, [platform]: 'checking' }));
    try {
      const targetId = platform === 'whatsapp' ? customConfig.phoneNumberId : customConfig.instagramBusinessId;
      const rawToken = platform === 'whatsapp' ? customConfig.whatsappToken : customConfig.instagramToken;
      
      const response = await API.post(`/bot/settings/verify`, {
        platform,
        id: targetId,
        token: rawToken.includes('***') ? null : rawToken
      });

      setConnectionStatus(prev => ({ 
        ...prev, 
        [platform]: response.data.valid ? 'connected' : 'failed' 
      }));
    } catch (err) {
      setConnectionStatus(prev => ({ ...prev, [platform]: 'failed' }));
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveStatus(null);
    try {
      await API.post(`/bot/settings/update`, config);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const webhookUrl = `${window.location.origin}/api/webhooks/meta?botId=${userId}`;
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-purple-400">
        <Loader2 className="animate-spin mb-4 text-purple-500" size={40} />
        <p className="text-xs font-black uppercase tracking-[0.4em] animate-pulse">Scanning Neural Network...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            Integrations <Sparkles className="text-purple-500 w-6 h-6 animate-pulse" />
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Multi-Channel Bot Control Center</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">
            {showGuide ? <ChevronUp size={14}/> : <Info size={14}/>}
            {showGuide ? "Minimize Docs" : "Integration Docs"}
          </button>
        </div>
      </div>

      {/* WEBHOOK SECTION */}
      <section className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Link size={20} /></div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Step 1: Webhook Handshake</h3>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Meta Callback URL</label>
            <div className="flex gap-2">
              <input readOnly value={webhookUrl} className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl text-[10px] font-mono text-purple-300 outline-none" />
              <button onClick={() => copyToClipboard(webhookUrl)} className="bg-purple-600 hover:bg-purple-500 px-6 rounded-2xl text-white">
                {copied ? <Check size={18}/> : <Copy size={18}/>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Verify Token (Secret Key)</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input readOnly value={config.verifyToken} className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-2xl text-xs font-mono text-white outline-none" />
            </div>
          </div>
        </div>
      </section>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChannelCard title="WhatsApp Cloud" icon={<MessageCircle size={24} className="text-emerald-400" />} status={connectionStatus.whatsapp} isActive={config.whatsappEnabled} onToggle={() => setConfig({...config, whatsappEnabled: !config.whatsappEnabled})} desc="Automate business chats via official Meta Cloud API." onRetry={() => verifyChannel('whatsapp')} />
        <ChannelCard title="Instagram DM" icon={<Instagram size={24} className="text-fuchsia-400" />} status={connectionStatus.instagram} isActive={config.instagramEnabled} onToggle={() => setConfig({...config, instagramEnabled: !config.instagramEnabled})} desc="AI responses for Instagram Business DMs & Stories." onRetry={() => verifyChannel('instagram')} />
        <ChannelCard title="LinkedIn AI" status="idle" desc="Coming Soon: B2B lead generation & auto-pilot." disabled isActive={false} />
      </div>

      {/* CONFIGURATION FORM */}
      <section className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Settings size={20} /></div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Step 2: Credential Configuration</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* WhatsApp Config */}
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]"><MessageCircle size={14}/> WhatsApp Node</h4>
            <div className={`p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] transition-all ${!config.whatsappEnabled ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
               <button onClick={launchWhatsAppSignup} className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl">
                 <Facebook size={16} className="text-[#1877F2]" /> Connect WhatsApp
               </button>
            </div>
            <div className="space-y-5">
              <ConfigInput label="Access Token" value={config.whatsappToken} isSensitive disabled={!config.whatsappEnabled} placeholder="EAAG..." onChange={(v) => setConfig({...config, whatsappToken: v})} />
              <ConfigInput label="Phone ID" value={config.phoneNumberId} disabled={!config.whatsappEnabled} placeholder="1029..." onChange={(v) => setConfig({...config, phoneNumberId: v})} />
            </div>
          </div>

          {/* Instagram Config */}
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.3em]"><Instagram size={14}/> Instagram Node</h4>
            <div className={`p-6 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-[2rem] transition-all ${!config.instagramEnabled ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
               <button onClick={launchInstagramSignup} className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-fuchsia-50 transition-all shadow-xl">
                 <Instagram size={16} className="text-[#E4405F]" /> Connect Instagram
               </button>
            </div>
            <div className="space-y-5">
              <ConfigInput label="Graph Token" value={config.instagramToken} isSensitive disabled={!config.instagramEnabled} placeholder="EAAG..." onChange={(v) => setConfig({...config, instagramToken: v})} />
              <ConfigInput label="Business ID" value={config.instagramBusinessId} disabled={!config.instagramEnabled} placeholder="1784..." onChange={(v) => setConfig({...config, instagramBusinessId: v})} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-10 mt-10 border-t border-white/5">
          <button onClick={handleSaveSettings} disabled={loading} className="w-full sm:w-auto bg-purple-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-purple-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>}
            {loading ? "Committing Changes..." : "Deploy Configuration"}
          </button>
          {saveStatus === 'success' && <div className="text-emerald-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Uplink Secured</div>}
        </div>
      </section>
    </div>
  );
}