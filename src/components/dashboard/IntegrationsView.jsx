import React, { useState } from "react";
import { useEffect } from "react";
import {
  Instagram,
  Link,
  Copy,
  Check,
  Sparkles,
  Loader2,
  ShieldCheck,
  Key,
  Fingerprint
} from "lucide-react";
import API from "../../api";

export default function IntegrationsView() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Form State for Manual Instagram Connection
  const [instaConfig, setInstaConfig] = useState({
    instaId: "",
    accessToken: "",
    verifyToken: "my_autobot_handshake_" + Math.random().toString(36).substring(7)
  });
useEffect(() => {
  const fetchInstagramConfig = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await API.get(
        `/api/integrations/manual/instagram/${userId}`
      );

      setInstaConfig((prev) => ({
        ...prev,
        instaId: res.data.instaId || "",
        accessToken: res.data.accessToken || ""
      }));
    } catch (err) {
      console.log("No saved Instagram config found");
    }
  };

  fetchInstagramConfig();
}, []);


  const webhookUrl = `${window.location.origin}/api/auth/webhook/instagram`;

  const handleManualConnect = async () => {
    if (!instaConfig.instaId || !instaConfig.accessToken) {
      setStatus({ type: "error", message: "Please fill in all fields" });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      // Save credentials to your backend
      await API.post("/integrations/manual/instagram", {
        userId: localStorage.getItem("userId"),
        instaId: instaConfig.instaId,
        accessToken: instaConfig.accessToken,
        verifyToken: instaConfig.verifyToken
      });

      setStatus({ type: "success", message: "Instagram configuration saved successfully!" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to save configuration." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const connectInstagramBackend = async (userAccessToken) => {
  try {
    await API.post("/auth/meta-connect", {
      userId: localStorage.getItem("userId"),
      userAccessToken
    });

    setStatus({
      type: "success",
      message: "Instagram connected successfully 🎉"
    });
  } catch (err) {
    console.error(err);
    setStatus({
      type: "error",
      message: "Failed to connect Instagram"
    });
  } finally {
    setLoading(false);
  }
};

const handleFacebookConnect = () => {
  if (!window.FB) {
    setStatus({ type: "error", message: "Facebook SDK not loaded" });
    return;
  }

  setLoading(true);
  setStatus({ type: "", message: "" });

window.FB.login(
  function (response) {
    console.log("FB LOGIN RESPONSE >>>", response);

    if (!response.authResponse) {
      setLoading(false);
      setStatus({
        type: "error",
        message: "Facebook login cancelled"
      });
      return;
    }

    const userAccessToken = response.authResponse.accessToken;

    // 🔥 MUST START WITH EAAJ
    console.log("USER TOKEN PREFIX:", userAccessToken.slice(0, 4));

    connectInstagramBackend(userAccessToken);
  },
  {
    scope: "pages_show_list,pages_read_engagement,instagram_manage_messages",
    return_scopes: true
  }
);

};


  return (
    <div className="space-y-8 pb-20  mx-auto">
      <h2 className="text-2xl font-black text-white uppercase flex gap-2 items-center">
        Integrations <Sparkles className="text-purple-500" />
      </h2>

      {/* STEP 1: WEBHOOK SETUP FOR META DEVELOPER PORTAL */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-white font-black uppercase text-sm flex gap-2 items-center">
          <Link size={16} className="text-purple-400" /> 1. Webhook Configuration
        </h3>
        <p className="text-gray-400 text-xs">
          Copy these values into your Meta Developer App settings under <b>Webhooks &gt; Instagram</b>.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold">Callback URL</label>
            <div className="flex gap-2">
              <input readOnly value={webhookUrl} className="flex-1 p-3 bg-black/40 text-purple-300 font-mono text-xs rounded-xl border border-white/5" />
              <button onClick={() => copyToClipboard(webhookUrl)} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl text-white transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold">Verify Token</label>
            <div className="flex gap-2">
              <input readOnly value={instaConfig.verifyToken} className="flex-1 p-3 bg-black/40 text-green-300 font-mono text-xs rounded-xl border border-white/5" />
              <button onClick={() => copyToClipboard(instaConfig.verifyToken)} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl text-white transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: MANUAL CREDENTIALS */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
        <h3 className="text-white font-black uppercase text-sm flex gap-2 items-center">
          <Instagram size={16} className="text-pink-500" /> 2. Instagram Manual Setup
        </h3>

        <div className="space-y-4">
          <div className="relative">
            <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Instagram Business Account ID</label>
            <div className="flex items-center">
              <Fingerprint className="absolute left-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="e.g. 178414012345678"
                className="w-full pl-10 p-3 bg-black/40 text-white rounded-xl border border-white/10 focus:border-purple-500 outline-none transition-all"
                value={instaConfig.instaId}
                onChange={(e) => setInstaConfig({ ...instaConfig, instaId: e.target.value })}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Page Access Token (Long-Lived)</label>
            <div className="flex items-center">
              <Key className="absolute left-3 text-gray-500" size={18} />
              <input
                type="password"
                placeholder="EAAG..."
                className="w-full pl-10 p-3 bg-black/40 text-white rounded-xl border border-white/10 focus:border-purple-500 outline-none transition-all"
                value={instaConfig.accessToken}
                onChange={(e) => setInstaConfig({ ...instaConfig, accessToken: e.target.value })}
              />
            </div>
          </div>
        </div>

        {status.message && (
          <div className={`p-3 rounded-lg text-xs font-bold ${status.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {status.message}
          </div>
        )}

        <button
          onClick={handleManualConnect}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs flex justify-center items-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={16} />}
          Save & Verify Connection
        </button>
      </section>

    

      <div className="bg-purple-600/10 border border-purple-500/20 p-4 rounded-xl">
        <p className="text-purple-300 text-[10px] leading-relaxed">
          <b>PRO TIP:</b> To get a permanent token, use the Meta Graph API Explorer, select your App, generate a token with <code>instagram_manage_messages</code>, and then exchange it for a "Long-Lived" token.
        </p>
      </div>
    </div>
  );
}