import React, { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  Instagram,
  Link,
  Copy,
  Check,
  Settings,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Key,
  Info,
  ChevronUp,
  Facebook
} from "lucide-react";
import API from "../../api";

/* ---------------------------------------------
   CONFIG INPUT
--------------------------------------------- */
const ConfigInput = ({
  label,
  value,
  onChange,
  placeholder,
  isSensitive = false,
  disabled = false
}) => {
  const [showValue, setShowValue] = useState(false);

  return (
    <div className={`transition-opacity ${disabled ? "opacity-30" : ""}`}>
      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
        {label}
      </label>
      <input
        type={isSensitive && !showValue ? "password" : "text"}
        value={disabled ? "" : value}
        disabled={disabled}
        placeholder={disabled ? "Channel Disabled" : placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-purple-200 font-mono text-xs outline-none focus:border-purple-500"
      />
    </div>
  );
};

/* ---------------------------------------------
   CHANNEL CARD
--------------------------------------------- */
const ChannelCard = ({
  title,
  icon,
  desc,
  status,
  isActive,
  onToggle,
  onRetry,
  disabled
}) => {
  const colorMap = {
    idle: "text-slate-400",
    checking: "text-purple-400",
    connected: "text-emerald-400",
    failed: "text-red-400",
    disabled: "text-slate-600"
  };

  return (
    <div
      className={`p-6 rounded-[2rem] border bg-white/5 backdrop-blur-xl transition ${
        disabled ? "opacity-40" : "hover:-translate-y-1"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="p-3 rounded-xl bg-black/30">{icon}</div>
        {!disabled && (
          <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full relative ${
              isActive ? "bg-emerald-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                isActive ? "translate-x-6" : ""
              }`}
            />
          </button>
        )}
      </div>

      <h4 className="text-white font-black uppercase text-sm">{title}</h4>
      <p className="text-[10px] text-slate-500 font-bold mt-2 mb-4">{desc}</p>

      <div
        className={`text-[9px] font-black uppercase tracking-widest ${
          colorMap[isActive ? status : "disabled"]
        }`}
      >
        {isActive ? status : "disabled"}
      </div>

      {status === "failed" && isActive && (
        <button
          onClick={onRetry}
          className="mt-3 flex items-center gap-1 text-purple-400 text-[9px] font-black uppercase"
        >
          <RefreshCw size={10} /> Retry
        </button>
      )}
    </div>
  );
};

/* ---------------------------------------------
   MAIN COMPONENT
--------------------------------------------- */
export default function IntegrationsView({ userId }) {
  const [config, setConfig] = useState({
    whatsappEnabled: false,
    instagramEnabled: false,
    whatsappToken: "",
    instagramToken: "",
    phoneNumberId: "",
    instagramBusinessId: "",
    verifyToken: "myautobot_webhook_token_2025fdcs"
  });

  const [status, setStatus] = useState({
    whatsapp: "idle",
    instagram: "idle"
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  /* ---------------------------------------------
     CONSTANTS (NO TRAILING SLASH)
  --------------------------------------------- */
  const REDIRECT_URI = "https://myautobot.in/api/auth/callback";

  /* ---------------------------------------------
     META SDK INIT
  --------------------------------------------- */
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "900824542624488",
        autoLogAppEvents: true,
        xfbml: false,
        version: "v24.0"
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ---------------------------------------------
     FETCH CONFIG
  --------------------------------------------- */
  const fetchConfig = useCallback(async () => {
    try {
      const { data } = await API.get("/bot/config");
      if (data) setConfig((prev) => ({ ...prev, ...data }));
    } catch (e) {
      console.error(e);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  /* ---------------------------------------------
     SIGNUP FLOWS
  --------------------------------------------- */
  const launchSignup = (platform, configId) => {
    if (!window.FB) return alert("Meta SDK not loaded");

    window.FB.login(
      (response) => {
        if (response.authResponse?.code) {
          window.location.href = `${REDIRECT_URI}?platform=${platform}&code=${response.authResponse.code}`;
        }
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true
      }
    );
  };

  /* ---------------------------------------------
     SAVE SETTINGS
  --------------------------------------------- */
  const saveSettings = async () => {
    setLoading(true);
    try {
      await API.post("/bot/settings/update", config);
      alert("Configuration saved");
    } catch (e) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const webhookUrl = `${window.location.origin}/api/webhooks/meta?botId=${userId}`;

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (initialLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div className="space-y-10 pb-20 animate-in fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
          Integrations <Sparkles className="text-purple-500" />
        </h2>
      </div>

      {/* WEBHOOK */}
      <section className="p-8 rounded-[3rem] bg-white/5 border border-white/10">
        <h3 className="text-white font-black uppercase mb-4 flex items-center gap-2">
          <Link size={18} /> Webhook Setup
        </h3>

        <div className="flex gap-2">
          <input
            readOnly
            value={webhookUrl}
            className="flex-1 p-4 rounded-2xl bg-black/40 text-purple-300 font-mono text-xs"
          />
          <button
            onClick={() => copyText(webhookUrl)}
            className="px-6 bg-purple-600 rounded-2xl text-white"
          >
            {copied ? <Check /> : <Copy />}
          </button>
        </div>

        <div className="mt-4">
          <label className="text-[10px] text-slate-500 uppercase font-black">
            Verify Token
          </label>
          <input
            readOnly
            value={config.verifyToken}
            className="mt-1 w-full p-4 rounded-2xl bg-black/40 text-white font-mono text-xs"
          />
        </div>
      </section>

      {/* CHANNELS */}
      <div className="grid md:grid-cols-3 gap-6">
        <ChannelCard
          title="WhatsApp Cloud"
          icon={<MessageCircle className="text-emerald-400" />}
          desc="Official Meta WhatsApp Cloud API"
          status={status.whatsapp}
          isActive={config.whatsappEnabled}
          onToggle={() =>
            setConfig((c) => ({ ...c, whatsappEnabled: !c.whatsappEnabled }))
          }
          onRetry={() => {}}
        />

        <ChannelCard
          title="Instagram DM"
          icon={<Instagram className="text-fuchsia-400" />}
          desc="AI replies for Instagram Business DMs"
          status={status.instagram}
          isActive={config.instagramEnabled}
          onToggle={() =>
            setConfig((c) => ({ ...c, instagramEnabled: !c.instagramEnabled }))
          }
          onRetry={() => {}}
        />

        <ChannelCard
          title="LinkedIn"
          icon={<Settings />}
          desc="Coming Soon"
          disabled
        />
      </div>

      {/* CONNECT BUTTONS */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20">
          <button
            onClick={() => launchSignup("whatsapp", "1510513603582692")}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2"
          >
            <Facebook className="text-[#1877F2]" size={16} />
            Connect WhatsApp
          </button>
        </div>

        <div className="p-6 rounded-[2rem] bg-fuchsia-500/10 border border-fuchsia-500/20">
          <button
            onClick={() => launchSignup("instagram", "1418243342982885")}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2"
          >
            <Instagram className="text-[#E4405F]" size={16} />
            Connect Instagram
          </button>
        </div>
      </section>

      {/* SAVE */}
      <button
        onClick={saveSettings}
        disabled={loading}
        className="bg-purple-600 px-14 py-5 rounded-2xl text-white font-black uppercase text-xs flex items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
        Deploy Configuration
      </button>
    </div>
  );
}
