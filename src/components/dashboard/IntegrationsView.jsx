import React, { useState, useEffect } from "react";
import {
  Instagram, Copy, Check, Sparkles, Loader2, ShieldCheck, Key, 
  Fingerprint, MessageSquare, Send, Smartphone, X, Globe
} from "lucide-react";
import API from "../../api";

export default function IntegrationsView() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const [instaConfig, setInstaConfig] = useState({
    instaId: "",
    accessToken: "",
    verifyToken: "ma_ig_" + Math.random().toString(36).substring(7)
  });

  const [waConfig, setWaConfig] = useState({
    phoneId: "",
    accessToken: "",
    verifyToken: "ma_wa_handshake_kyifcljsxujudsjnxavenirya2026"
  });

  const [tgConfig, setTgConfig] = useState({ botToken: "" });

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await API.get(`/integrations/all/${userId}`);
        if (res.data) {
          setInstaConfig(p => ({ ...p, instaId: res.data.instaId, accessToken: res.data.instaAccessToken }));
          setWaConfig(p => ({ ...p, phoneId: res.data.waPhoneId, accessToken: res.data.waAccessToken }));
          setTgConfig({ botToken: res.data.tgBotToken || "" });
        }
      } catch (err) {
        console.log("Starting with fresh configuration");
      } finally { setFetching(false); }
    };
    fetchConfigs();
  }, []);

  const webhookUrl = (platform) => `${window.location.origin}/api/auth/webhook/${platform}`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSave = async (platform, data) => {
    const userId = localStorage.getItem("userId");
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      await API.post(`/integrations/manual/${platform}`, { userId, ...data });
      setStatus({ type: "success", message: `${platform.toUpperCase()} connection established!` });
    } catch (err) {
      setStatus({ type: "error", message: `Failed to sync ${platform} configuration.` });
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="h-60 flex flex-col items-center justify-center space-y-4">
       <Loader2 className="animate-spin text-purple-500" size={32} />
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Integration Nodes...</p>
    </div>
  );

  return (
    <div className=" mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h2 className="text-2xl font-black text-white uppercase flex gap-3 items-center italic">
          Neural Connectors <Sparkles className="text-purple-500 animate-pulse" />
        </h2>
        <p className="text-xs text-slate-500 font-medium max-w-xl">Link your social nodes to the AutoBot brain. Ensure your Webhook settings in Meta/Telegram match the identifiers below.</p>
      </header>

      {/* INSTAGRAM */}
      <div className="group bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-pink-500/20 transition-all">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-500"><Instagram size={24}/></div>
           <div>
             <h3 className="text-sm font-black text-white uppercase">Instagram Node</h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Meta API Gateway</p>
           </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
           <WebhookField label="Callback URL" value={webhookUrl('instagram')} onCopy={() => copyToClipboard(webhookUrl('instagram'), 'ig_u')} copied={copied === 'ig_u'} />
           <WebhookField label="Verify Token" value={instaConfig.verifyToken} color="text-green-400" onCopy={() => copyToClipboard(instaConfig.verifyToken, 'ig_v')} copied={copied === 'ig_v'} />
        </div>

        <div className="space-y-6">
           <InputField label="Business Account ID" icon={<Fingerprint size={18}/>} placeholder="17841..." value={instaConfig.instaId} onChange={(e) => setInstaConfig({...instaConfig, instaId: e.target.value})} />
           <InputField label="System Access Token" icon={<Key size={18}/>} placeholder="EAAG..." type="password" value={instaConfig.accessToken} onChange={(e) => setInstaConfig({...instaConfig, accessToken: e.target.value})} />
           <button onClick={() => handleSave('instagram', { instaId: instaConfig.instaId, accessToken: instaConfig.accessToken })} disabled={loading} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16}/>} Establish Instagram Link
           </button>
        </div>
      </div>

      {/* WHATSAPP */}
      <div className="group bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/20 transition-all">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><MessageSquare size={24}/></div>
           <div>
             <h3 className="text-sm font-black text-white uppercase">WhatsApp Cloud</h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Business API Node</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
           <WebhookField label="Webhook URL" value={webhookUrl('whatsapp')} onCopy={() => copyToClipboard(webhookUrl('whatsapp'), 'wa_u')} copied={copied === 'wa_u'} />
           <WebhookField label="Handshake Token" value={waConfig.verifyToken} color="text-emerald-400" onCopy={() => copyToClipboard(waConfig.verifyToken, 'wa_v')} copied={copied === 'wa_v'} />
        </div>

        <div className="space-y-6">
           <InputField label="Phone Number ID" icon={<Smartphone size={18}/>} placeholder="1056..." value={waConfig.phoneId} onChange={(e) => setWaConfig({...waConfig, phoneId: e.target.value})} />
           <InputField label="System User Token" icon={<Key size={18}/>} placeholder="EAAG..." type="password" value={waConfig.accessToken} onChange={(e) => setWaConfig({...waConfig, accessToken: e.target.value})} />
           <button onClick={() => handleSave('whatsapp', { phoneId: waConfig.phoneId, accessToken: waConfig.accessToken })} disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16}/>} Establish WhatsApp Link
           </button>
        </div>
      </div>

      {/* TELEGRAM */}
      <div className="group bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-sky-500/20 transition-all">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-500"><Send size={24}/></div>
           <div>
             <h3 className="text-sm font-black text-white uppercase">Telegram Bot</h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">@BotFather Protocol</p>
           </div>
        </div>

        <div className="space-y-6">
           <InputField label="Bot API Token" icon={<Fingerprint size={18}/>} placeholder="123456:ABC-DEF..." type="password" value={tgConfig.botToken} onChange={(e) => setTgConfig({botToken: e.target.value})} />
           <button onClick={() => handleSave('telegram', { botToken: tgConfig.botToken })} disabled={loading} className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-sky-500 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16}/>} Establish Telegram Link
           </button>
        </div>
      </div>

      {/* FLOATING STATUS */}
      {status.message && (
        <div className={`fixed bottom-8 right-8 p-5 rounded-[2rem] shadow-2xl border ${status.type === "success" ? "bg-emerald-500/90 border-emerald-400" : "bg-red-500/90 border-red-400"} backdrop-blur-xl text-white flex items-center gap-6 animate-in slide-in-from-bottom-10`}>
           <div className="flex items-center gap-3">
             {status.type === "success" ? <ShieldCheck size={20}/> : <X size={20}/>}
             <p className="text-xs font-black uppercase tracking-tighter italic">{status.message}</p>
           </div>
           <button onClick={() => setStatus({type:"", message:""})} className="p-1 hover:bg-white/10 rounded-full"><X size={14}/></button>
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENTS for Clean Code
function WebhookField({ label, value, color = "text-purple-400", onCopy, copied }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest px-1">{label}</label>
      <div className="flex gap-2 p-1.5 bg-black/50 border border-white/5 rounded-2xl">
        <input readOnly value={value} className={`flex-1 bg-transparent p-2.5 font-mono text-[11px] outline-none ${color}`} />
        <button onClick={onCopy} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all">
          {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

function InputField({ label, icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest px-1">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-600">{icon}</div>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full pl-12 pr-4 py-4 bg-black/40 text-white font-bold text-xs rounded-2xl border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-700" />
      </div>
    </div>
  );
}