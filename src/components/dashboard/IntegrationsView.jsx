import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageCircle, Instagram, Link, Copy, Check, Settings, 
  Loader2, ShieldCheck, RefreshCw, Sparkles, Key, Info, 
  ChevronDown, ChevronUp, Eye, EyeOff, Power, PowerOff,
  Facebook // Added for the button icon
} from 'lucide-react';
import API from '../../api';

// --- Sub-Component: Configuration Input ---
const ConfigInput = ({ label, type, value, onChange, placeholder, isSensitive = false, disabled = false }) => {
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
        {isSensitive && !disabled && (
          <button 
            type="button"
            onClick={() => setShowValue(!showValue)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-purple-400 transition-colors"
          >
            {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
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
    verifyToken: '', 
  });

  const [connectionStatus, setConnectionStatus] = useState({
    whatsapp: 'idle',
    instagram: 'idle'
  });

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

  // --- Launch Embedded Signup ---
  const launchWhatsAppSignup = () => {
    if (!window.FB) return alert("Meta SDK not loaded yet.");
    
    window.FB.login((response) => {
      if (response.authResponse) {
        const code = response.authResponse.code;
        // Redirect to your backend callback with the code
        window.location.href = `https://myautobot.in/api/auth/callback?code=${code}`;
      }
    }, {
      config_id: '1510513603582692', // Your official Configuration ID
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        feature: 'whatsapp_embedded_signup',
        version: 'v3'
      }
    });
  };

  const fetchConfig = useCallback(async () => {
    try {
      setInitialLoading(true);
      const { data } = await API.get(`/bot/config`); 
      if (data) {
        setConfig({
          whatsappToken: data.whatsappToken || '',
          phoneNumberId: data.phoneNumberId || '',
          whatsappEnabled: data.whatsappEnabled ?? false,
          instagramToken: data.instagramToken || '',
          instagramBusinessId: data.instagramBusinessId || '',
          instagramEnabled: data.instagramEnabled ?? false,
          verifyToken: data.verifyToken || '',
        });
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
    if ((platform === 'whatsapp' && !customConfig.whatsappEnabled) || 
        (platform === 'instagram' && !customConfig.instagramEnabled)) return;

    setConnectionStatus(prev => ({ ...prev, [platform]: 'checking' }));
    try {
      const targetId = platform === 'whatsapp' ? customConfig.phoneNumberId : customConfig.instagramBusinessId;
      const rawToken = platform === 'whatsapp' ? customConfig.whatsappToken : customConfig.instagramToken;
      const tokenToSend = rawToken.includes('***') ? null : rawToken;

      const response = await API.post(`/bot/settings/verify`, {
        platform,
        id: targetId,
        token: tokenToSend 
      });

      setConnectionStatus(prev => ({ 
        ...prev, 
        [platform]: response.data.valid ? 'connected' : 'failed' 
      }));
    } catch (err) {
      setConnectionStatus(prev => ({ ...prev, [platform]: 'failed' }));
    }
  };

  const launchInstagramSignup = () => {
  if (!window.FB) return alert("Meta SDK not loaded.");

  window.FB.login((response) => {
    if (response.authResponse) {
      const code = response.authResponse.code;
      // Send to your backend with a platform flag
      window.location.href = `https://myautobot.in/api/auth/callback?platform=instagram&code=${code}`;
    }
  }, {
    config_id: '1510513603582692', // Use the ID from your screenshot
    response_type: 'code',
    override_default_response_type: true,
    extras: {
      feature: 'instagram_messaging', // Specific feature for IG DMs
      version: 'v3'
    }
  });
};

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveStatus(null);
    try {
      await API.post(`/bot/settings/update`, config);
      setSaveStatus('success');
      if (config.whatsappEnabled) verifyChannel('whatsapp');
      if (config.instagramEnabled) verifyChannel('instagram');
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
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            {showGuide ? <ChevronUp size={14}/> : <Info size={14}/>}
            {showGuide ? "Minimize Docs" : "Integration Docs"}
          </button>
        </div>
      </div>

      {/* WEBHOOK SECTION */}
      <section className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Link size={20} /></div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Step 1: Webhook Handshake</h3>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-6 relative z-10">
          <div className="lg:col-span-3 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Meta Callback URL</label>
            <div className="flex gap-2">
              <input readOnly value={webhookUrl} className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl text-[10px] font-mono text-purple-300 outline-none" />
              <button onClick={() => copyToClipboard(webhookUrl)} className="bg-purple-600 hover:bg-purple-500 px-6 rounded-2xl text-white transition-all flex items-center justify-center">
                {copied ? <Check size={18}/> : <Copy size={18}/>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Verify Token (Secret Key)</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text"
                placeholder="Ex: my_secure_secret_123"
                value={config.verifyToken}
                onChange={(e) => setConfig({...config, verifyToken: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-2xl text-xs font-mono text-white outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATUS CARDS WITH TOGGLES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChannelCard 
          title="WhatsApp Cloud" 
          icon={<MessageCircle size={24} className="text-emerald-400" />} 
          status={connectionStatus.whatsapp}
          isActive={config.whatsappEnabled}
          onToggle={() => setConfig({...config, whatsappEnabled: !config.whatsappEnabled})}
          desc="Automate business chats via official Meta Cloud API."
          onRetry={() => verifyChannel('whatsapp')}
        />
        <ChannelCard 
          title="Instagram DM" 
          icon={<Instagram size={24} className="text-fuchsia-400" />} 
          status={connectionStatus.instagram}
          isActive={config.instagramEnabled}
          onToggle={() => setConfig({...config, instagramEnabled: !config.instagramEnabled})}
          desc="AI responses for Instagram Business DMs & Stories."
          onRetry={() => verifyChannel('instagram')}
        />
        <ChannelCard 
          title="LinkedIn AI" 
          status="idle" 
          desc="Coming Soon: B2B lead generation & auto-pilot."
          disabled
          isActive={false}
        />
      </div>

      {/* CONFIGURATION FORM */}
      <section className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Settings size={20} /></div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Step 2: Credential Configuration</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* WhatsApp Config */}
          <div className="space-y-6">
            <h4 className="flex items-center justify-between text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><MessageCircle size={14}/> WhatsApp Node Settings</span>
            </h4>

            {/* 1-CLICK CONNECT BUTTON */}
            <div className={`p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] transition-opacity duration-300 ${!config.whatsappEnabled ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
               <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest text-center">SaaS Quick Connect (Recommended)</p>
               <button 
                 onClick={launchWhatsAppSignup}
                 className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl"
               >
                 <Facebook size={16} className="text-[#1877F2]" />
                 Connect with Facebook
               </button>
               <p className="text-[8px] text-slate-500 mt-4 text-center italic">One-click setup for Cloud API & Webhooks</p>
            </div>

            <div className="relative flex items-center gap-4 my-4">
               <div className="flex-1 h-[1px] bg-white/5"></div>
               <span className="text-[8px] font-black text-slate-700 uppercase">Or Manual Entry</span>
               <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            <div className="space-y-5">
              <ConfigInput 
                isSensitive 
                disabled={!config.whatsappEnabled}
                label="Permanent Access Token" 
                value={config.whatsappToken} 
                onChange={(v) => setConfig({...config, whatsappToken: v})} 
                placeholder="EAAG..." 
              />
              <ConfigInput 
                disabled={!config.whatsappEnabled}
                label="Phone Number ID" 
                value={config.phoneNumberId} 
                onChange={(v) => setConfig({...config, phoneNumberId: v})} 
                placeholder="1029..." 
              />
            </div>
          </div>

          {/* Instagram Config */}
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.3em]">
              <Instagram size={14}/> Instagram Node Settings
            </h4>
            {/* Note: You can add a similar "Connect" button for Instagram here later */}
            <div className={`p-6 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-[2rem] transition-all ${!config.instagramEnabled ? 'opacity-30 grayscale' : 'opacity-100'}`}>
  <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest text-center">Cloud Sync (Recommended)</p>
  <button 
    onClick={launchInstagramSignup}
    className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-fuchsia-50 transition-all shadow-xl"
  >
    <Instagram size={16} className="text-[#E4405F]" />
    Connect Instagram DMs
  </button>
  <p className="text-[8px] text-slate-500 mt-4 text-center italic">One-click link for Business DMs</p>
</div>
            <div className="space-y-5">
              <ConfigInput 
                isSensitive 
                disabled={!config.instagramEnabled}
                label="Graph Access Token" 
                value={config.instagramToken} 
                onChange={(v) => setConfig({...config, instagramToken: v})} 
                placeholder="EAAG..." 
              />
              <ConfigInput 
                disabled={!config.instagramEnabled}
                label="Instagram Business ID" 
                value={config.instagramBusinessId} 
                onChange={(v) => setConfig({...config, instagramBusinessId: v})} 
                placeholder="1784..." 
              />
            </div>
          </div>
        </div>

        {/* SAVE ACTION */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 mt-10 border-t border-white/5">
          <button 
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full sm:w-auto bg-purple-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-purple-500 transition-all shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>}
            {loading ? "Committing Changes..." : "Deploy Configuration"}
          </button>

          {saveStatus === 'success' && (
            <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-left-2">
              <Check size={16} /> Data Secured & Uplinked
            </div>
          )}
        </div>
      </section>
    </div>
  );
}