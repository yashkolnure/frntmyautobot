import React, { useState, useEffect } from "react";
import {
  Instagram,
  Link,
  Copy,
  Check,
  Sparkles,
  Loader2,
  ShieldCheck,
  Key,
  Fingerprint,
  MessageSquare,
  Send,
  Smartphone,
  X
} from "lucide-react";
import API from "../../api";

export default function IntegrationsView() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  // --- INSTAGRAM STATE (UNCHANGED) ---
  const [instaConfig, setInstaConfig] = useState({
    instaId: "",
    accessToken: "",
    verifyToken: "my_autobot_handshake_" + Math.random().toString(36).substring(7)
  });

  // --- NEW PLATFORM STATES ---
  const [waConfig, setWaConfig] = useState({
    phoneId: "",
    accessToken: "",
    verifyToken: "ma_wa_handshake_" + Math.random().toString(36).substring(7)
  });

  const [tgConfig, setTgConfig] = useState({
    botToken: ""
  });

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await API.get(`/integrations/all/${userId}`);
        if (res.data) {
          // Sync Instagram (from your original logic)
          setInstaConfig(prev => ({
            ...prev,
            instaId: res.data.instaId || "",
            accessToken: res.data.instaAccessToken || ""
          }));
          // Sync WhatsApp
          setWaConfig(prev => ({
            ...prev,
            phoneId: res.data.waPhoneId || "",
            accessToken: res.data.waAccessToken || ""
          }));
          // Sync Telegram
          setTgConfig({ botToken: res.data.tgBotToken || "" });
        }
      } catch (err) {
        console.log("No saved configurations found");
      }
    };
    fetchConfigs();
  }, []);

  const webhookUrl = (platform) => `${window.location.origin}/api/auth/webhook/${platform}`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  // --- HANDLERS ---

  const handleManualConnect = async () => {
    if (!instaConfig.instaId || !instaConfig.accessToken) {
      setStatus({ type: "error", message: "Please fill in all Instagram fields" });
      return;
    }
    try {
      setLoading(true);
      setStatus({ type: "", message: "" });
      await API.post("/integrations/manual/instagram", {
        userId: localStorage.getItem("userId"),
        instaId: instaConfig.instaId,
        accessToken: instaConfig.accessToken,
        verifyToken: instaConfig.verifyToken
      });
      setStatus({ type: "success", message: "Instagram configuration saved successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: "Failed to save Instagram config." });
    } finally { setLoading(false); }
  };

  const handleWhatsAppConnect = async () => {
    if (!waConfig.phoneId || !waConfig.accessToken) {
      setStatus({ type: "error", message: "Please fill in all WhatsApp fields" });
      return;
    }
    try {
      setLoading(true);
      await API.post("/integrations/manual/whatsapp", {
        userId: localStorage.getItem("userId"),
        phoneId: waConfig.phoneId,
        accessToken: waConfig.accessToken,
        verifyToken: waConfig.verifyToken
      });
      setStatus({ type: "success", message: "WhatsApp linked successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: "Failed to save WhatsApp config." });
    } finally { setLoading(false); }
  };

  const handleTelegramConnect = async () => {
    if (!tgConfig.botToken) {
      setStatus({ type: "error", message: "Please enter a Bot Token" });
      return;
    }
    try {
      setLoading(true);
      await API.post("/integrations/manual/telegram", {
        userId: localStorage.getItem("userId"),
        botToken: tgConfig.botToken
      });
      setStatus({ type: "success", message: "Telegram Bot linked successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: "Failed to save Telegram config." });
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-10 pb-20 mx-auto ">
      <h2 className="text-2xl font-black text-white uppercase flex gap-2 items-center">
        Integrations <Sparkles className="text-purple-500" />
      </h2>

      {/* 1. INSTAGRAM SECTION (UNMODIFIED LOGIC/UI) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-pink-500 pl-4">
          <Instagram className="text-pink-500" size={20} />
          <h3 className="text-white font-black uppercase text-sm">Instagram Node</h3>
        </div>

        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Callback URL</label>
              <div className="flex gap-2">
                <input readOnly value={webhookUrl('instagram')} className="flex-1 p-3 bg-black/40 text-purple-300 font-mono text-xs rounded-xl border border-white/5" />
                <button onClick={() => copyToClipboard(webhookUrl('instagram'), 'ig_url')} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl text-white transition-colors">
                  {copied === 'ig_url' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Verify Token</label>
              <div className="flex gap-2">
                <input readOnly value={instaConfig.verifyToken} className="flex-1 p-3 bg-black/40 text-green-300 font-mono text-xs rounded-xl border border-white/5" />
                <button onClick={() => copyToClipboard(instaConfig.verifyToken, 'ig_v')} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl text-white transition-colors">
                  {copied === 'ig_v' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Instagram Business Account ID</label>
              <div className="flex items-center">
                <Fingerprint className="absolute left-3 text-gray-500" size={18} />
                <input type="text" placeholder="e.g. 17841..." className="w-full pl-10 p-3 bg-black/40 text-white rounded-xl border border-white/10 focus:border-purple-500 outline-none transition-all" value={instaConfig.instaId} onChange={(e) => setInstaConfig({ ...instaConfig, instaId: e.target.value })} />
              </div>
            </div>
            <div className="relative">
              <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Page Access Token</label>
              <div className="flex items-center">
                <Key className="absolute left-3 text-gray-500" size={18} />
                <input type="password" placeholder="EAAG..." className="w-full pl-10 p-3 bg-black/40 text-white rounded-xl border border-white/10 focus:border-purple-500 outline-none transition-all" value={instaConfig.accessToken} onChange={(e) => setInstaConfig({ ...instaConfig, accessToken: e.target.value })} />
              </div>
            </div>
          </div>
          <button onClick={handleManualConnect} disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs flex justify-center items-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={16} />} Save Instagram
          </button>
        </div>
      </section>

      {/* 2. WHATSAPP SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-4">
          <MessageSquare className="text-emerald-500" size={20} />
          <h3 className="text-white font-black uppercase text-sm">WhatsApp Cloud Node</h3>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Callback URL</label>
              <div className="flex gap-2">
                <input readOnly value={webhookUrl('whatsapp')} className="flex-1 p-3 bg-black/40 text-purple-300 font-mono text-xs rounded-xl border border-white/5" />
                <button onClick={() => copyToClipboard(webhookUrl('whatsapp'), 'wa_url')} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl text-white transition-colors">
                  {copied === 'wa_url' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Verify Token</label>
              <div className="flex gap-2">
                <input readOnly value={waConfig.verifyToken} className="flex-1 p-3 bg-black/40 text-green-300 font-mono text-xs rounded-xl border border-white/5" />
                <button onClick={() => copyToClipboard(waConfig.verifyToken, 'wa_v')} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl text-white transition-colors">
                  {copied === 'wa_v' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Phone Number ID</label>
              <div className="flex items-center">
                <Smartphone className="absolute left-3 text-gray-500" size={18} />
                <input type="text" placeholder="e.g. 1056..." className="w-full pl-10 p-3 bg-black/40 text-white rounded-xl border border-white/10 focus:border-purple-500 outline-none transition-all" value={waConfig.phoneId} onChange={(e) => setWaConfig({ ...waConfig, phoneId: e.target.value })} />
              </div>
            </div>
            <div className="relative">
              <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">System User Access Token</label>
              <div className="flex items-center">
                <Key className="absolute left-3 text-gray-500" size={18} />
                <input type="password" placeholder="EAAG..." className="w-full pl-10 p-3 bg-black/40 text-white rounded-xl border border-white/10 focus:border-purple-500 outline-none transition-all" value={waConfig.accessToken} onChange={(e) => setWaConfig({ ...waConfig, accessToken: e.target.value })} />
              </div>
            </div>
          </div>
          <button onClick={handleWhatsAppConnect} disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase text-xs flex justify-center items-center gap-2 hover:bg-emerald-500 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={16} />} Save WhatsApp
          </button>
        </div>
      </section>

      {/* 3. TELEGRAM SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-sky-500 pl-4">
          <Send className="text-sky-500" size={20} />
          <h3 className="text-white font-black uppercase text-sm">Telegram Bot Node</h3>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
          <div className="relative">
            <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Bot API Token (from @BotFather)</label>
            <div className="flex items-center">
              <Key className="absolute left-3 text-gray-500" size={18} />
              <input type="password" placeholder="123456:ABC-DEF..." className="w-full pl-10 p-3 bg-black/40 text-white rounded-xl border border-white/10 focus:border-purple-500 outline-none transition-all" value={tgConfig.botToken} onChange={(e) => setTgConfig({ botToken: e.target.value })} />
            </div>
          </div>
          <button onClick={handleTelegramConnect} disabled={loading} className="w-full bg-sky-600 text-white py-4 rounded-xl font-black uppercase text-xs flex justify-center items-center gap-2 hover:bg-sky-500 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={16} />} Save Telegram
          </button>
        </div>
      </section>

      {/* STATUS BANNER */}
      {status.message && (
        <div className={`fixed bottom-10 right-10 p-4 rounded-2xl shadow-2xl border ${status.type === "success" ? "bg-emerald-500 border-emerald-400" : "bg-red-500 border-red-400"} text-white flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5`}>
           <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
           <button onClick={() => setStatus({type:"", message:""})}><X size={14}/></button>
        </div>
      )}
    </div>
  );
}