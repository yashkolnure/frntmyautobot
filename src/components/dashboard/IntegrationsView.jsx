import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageCircle, Instagram, Link, Copy, Check, Settings, 
  Loader2, ShieldCheck, Linkedin, RefreshCw, Sparkles, Key, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import API from '../../api';

// --- Sub-Component: Instructional Guide ---
const ConnectionGuide = () => {
  return (
    <div className="mt-4 mb-10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid md:grid-cols-2 gap-6">
        {/* WhatsApp Guide */}
        <div className="bg-black/40 p-6 rounded-[2rem] border border-emerald-500/20 backdrop-blur-md">
          <h4 className="text-emerald-400 font-black text-xs uppercase mb-4 flex items-center gap-2 tracking-widest">
            <MessageCircle size={16} /> WhatsApp Protocol
          </h4>
          <ul className="space-y-3 text-[11px] text-slate-400 font-bold tracking-wide">
            <li className="flex gap-3"><span className="text-emerald-500 font-mono">01</span><span>Create a "Business" App at Meta Developers.</span></li>
            <li className="flex gap-3"><span className="text-emerald-500 font-mono">02</span><span>Add "WhatsApp" product and copy the <b>Phone Number ID</b>.</span></li>
            <li className="flex gap-3"><span className="text-emerald-500 font-mono">03</span><span>Generate a <b>Permanent Token</b> in System Users (Business Manager).</span></li>
          </ul>
        </div>

        {/* Instagram Guide */}
        <div className="bg-black/40 p-6 rounded-[2rem] border border-fuchsia-500/20 backdrop-blur-md">
          <h4 className="text-fuchsia-400 font-black text-xs uppercase mb-4 flex items-center gap-2 tracking-widest">
            <Instagram size={16} /> Instagram Protocol
          </h4>
          <ul className="space-y-3 text-[11px] text-slate-400 font-bold tracking-wide">
            <li className="flex gap-3"><span className="text-fuchsia-500 font-mono">01</span><span>Connect Instagram Business to a Facebook Page.</span></li>
            <li className="flex gap-3"><span className="text-fuchsia-500 font-mono">02</span><span>Add "Messenger/Instagram Graph API" to your Meta App.</span></li>
            <li className="flex gap-3"><span className="text-fuchsia-500 font-mono">03</span><span>Copy <b>Instagram Business ID</b> from Page Settings.</span></li>
          </ul>
        </div>
      </div>

      <div className="bg-purple-500/5 p-5 rounded-2xl border border-purple-500/20">
        <p className="text-[10px] text-slate-400 uppercase font-black text-center tracking-[0.1em]">
          Final Setup: Add the Webhook URL below to Meta "Webhooks" section & subscribe to <span className="text-purple-400">messages</span> field.
        </p>
      </div>
    </div>
  );
};

// --- Sub-Component: Configuration Input ---
const ConfigInput = ({ label, type, value, onChange, placeholder }) => (
  <div className="relative group">
    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-1">{label}</label>
    <input 
      type={type}
      placeholder={placeholder} 
      className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-sm text-purple-100 outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all placeholder:text-slate-800 font-mono shadow-inner" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// --- Sub-Component: Channel Status Card ---
const ChannelCard = ({ title, icon, status, desc, onRetry, disabled }) => {
  const statusStyles = {
    idle: "text-slate-500 bg-white/5 border-white/10",
    checking: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    connected: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    failed: "text-red-400 bg-red-500/10 border-red-500/30"
  };

  return (
    <div className={`bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-white/[0.07]'} ${status === 'failed' ? 'border-red-500/30' : 'border-white/10'}`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-black/20 rounded-2xl">{icon}</div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md ${statusStyles[status]}`}>
            {status === 'checking' ? <Loader2 size={10} className="animate-spin" /> : <div className={`w-1 h-1 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />}
            {status === 'connected' ? 'Uplink Active' : status === 'failed' ? 'Link Error' : status === 'checking' ? 'Syncing...' : 'Offline'}
          </div>
        </div>
        <h4 className="font-black text-white mb-2 text-md uppercase tracking-tighter">{title}</h4>
        <p className="text-[10px] text-slate-500 leading-relaxed font-bold mb-4 tracking-tight">{desc}</p>
        
        {status === 'failed' && !disabled && (
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
    instagramToken: '',
    instagramBusinessId: '',
    verifyToken: '', 
  });

  const [connectionStatus, setConnectionStatus] = useState({
    whatsapp: 'idle',
    instagram: 'idle'
  });

  const fetchConfig = useCallback(async () => {
    try {
      setInitialLoading(true);
      const { data } = await API.get(`/bot/config`); 
      if (data) {
        const loadedConfig = {
          whatsappToken: data.whatsappToken || '',
          phoneNumberId: data.phoneNumberId || '',
          instagramToken: data.instagramToken || '',
          instagramBusinessId: data.instagramBusinessId || '',
          verifyToken: data.verifyToken || '',
        };
        setConfig(loadedConfig);
        if (loadedConfig.whatsappToken) verifyChannel('whatsapp', loadedConfig);
        if (loadedConfig.instagramToken) verifyChannel('instagram', loadedConfig);
      }
    } catch (err) {
      console.error("Neural Link Error:", err);
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

    // RULE: If the token contains asterisks, it's the masked version from the DB.
    // Send 'null' so the backend knows to use the stored/encrypted token.
    const tokenToSend = rawToken.includes('***') ? null : rawToken;

    const response = await API.post(`/bot/settings/verify`, {
      platform,
      id: targetId,
      token: tokenToSend 
    });

    if (response.data.valid) {
      setConnectionStatus(prev => ({ ...prev, [platform]: 'connected' }));
    } else {
      setConnectionStatus(prev => ({ ...prev, [platform]: 'failed' }));
    }
  } catch (err) {
    console.error("Verification Trigger Error:", err);
    setConnectionStatus(prev => ({ ...prev, [platform]: 'failed' }));
  }
};

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveStatus(null);
    try {
      await API.post(`/bot/settings/update`, config);
      setSaveStatus('success');
      await Promise.all([
        config.whatsappToken && verifyChannel('whatsapp'),
        config.instagramToken && verifyChannel('instagram')
      ]);
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
        <p className="text-xs font-black uppercase tracking-[0.4em] animate-pulse">Synchronizing Neural Links...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            Integrations <Sparkles className="text-purple-500 w-6 h-6 animate-pulse" />
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Meta API & Uplink Configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            {showGuide ? <ChevronUp size={14}/> : <Info size={14}/>}
            {showGuide ? "Hide Setup Guide" : "View Setup Guide"}
          </button>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/30 backdrop-blur-md">
            <ShieldCheck size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Uplink</span>
          </div>
        </div>
      </div>

      {showGuide && <ConnectionGuide />}

      {/* WEBHOOK / HANDSHAKE SECTION */}
      <section className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Link size={20} /></div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Step 1: Handshake URL</h3>
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
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Verify Token (Custom Secret)</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text"
                placeholder="Ex: my_secret_node_123"
                value={config.verifyToken}
                onChange={(e) => setConfig({...config, verifyToken: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-2xl text-xs font-mono text-white outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChannelCard 
          title="WhatsApp Business" 
          icon={<MessageCircle size={24} className="text-emerald-400" />} 
          status={connectionStatus.whatsapp}
          desc="AI automated replies for Cloud API nodes."
          onRetry={() => verifyChannel('whatsapp')}
        />
        <ChannelCard 
          title="Instagram DMs" 
          icon={<Instagram size={24} className="text-fuchsia-400" />} 
          status={connectionStatus.instagram}
          desc="Direct message automation via Graph API."
          onRetry={() => verifyChannel('instagram')}
        />
        <ChannelCard 
          title="LinkedIn B2B" 
          icon={<Linkedin size={24} className="text-blue-400" />} 
          status="idle" 
          desc="Enterprise automation (Coming Soon)."
          disabled
        />
      </div>

      {/* CONFIGURATION FORM */}
      <section className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Settings size={20} /></div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Step 2: Credential Uplink</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* WhatsApp */}
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
              <MessageCircle size={14}/> WhatsApp Node
            </h4>
            <div className="space-y-5">
              <ConfigInput label="Access Token" type="password" value={config.whatsappToken} onChange={(v) => setConfig({...config, whatsappToken: v})} placeholder="EAAG..." />
              <ConfigInput label="Phone Number ID" type="text" value={config.phoneNumberId} onChange={(v) => setConfig({...config, phoneNumberId: v})} placeholder="1029..." />
            </div>
          </div>

          {/* Instagram */}
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.3em]">
              <Instagram size={14}/> Instagram Node
            </h4>
            <div className="space-y-5">
              <ConfigInput label="Access Token" type="password" value={config.instagramToken} onChange={(v) => setConfig({...config, instagramToken: v})} placeholder="EAAG..." />
              <ConfigInput label="Business ID" type="text" value={config.instagramBusinessId} onChange={(v) => setConfig({...config, instagramBusinessId: v})} placeholder="1784..." />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 mt-10 border-t border-white/5">
          <button 
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full sm:w-auto bg-purple-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-purple-500 transition-all shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>}
            {loading ? "Syncing Nodes..." : "Activate & Verify Uplink"}
          </button>

          {saveStatus === 'success' && (
            <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest animate-in fade-in zoom-in">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              Configurations Synchronized
            </div>
          )}
        </div>
      </section>
    </div>
  );
}