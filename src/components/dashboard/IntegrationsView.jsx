import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Instagram,
  Link,
  Copy,
  Check,
  Sparkles,
  Facebook,
  Loader2,
  ShieldCheck
} from "lucide-react";
import API from "../../api";

export default function IntegrationsView() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const userId = localStorage.getItem("userId"); // ✅ REQUIRED

  /* ---------------- META SDK ---------------- */
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "900824542624488",
        xfbml: false,
        version: "v24.0"
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const connectMeta = (platform, configId) => {
  if (!window.FB) {
    alert("Meta SDK not loaded");
    return;
  }

  window.FB.login(
    (response) => {
      if (!response.authResponse) {
        alert("Meta authorization cancelled");
        return;
      }

      // 🔒 SAFELY HANDLE ASYNC
      (async () => {
        try {
          setLoading(true);
          await API.post("/auth/meta-connect", {
            platform,
            userId: localStorage.getItem("userId")
          });
          alert(`✅ ${platform} connected`);
        } catch (err) {
          console.error("Meta connect failed:", err);
          alert("❌ Meta connect failed");
        } finally {
          setLoading(false);
        }
      })();
    },
    {
      config_id: configId,
      response_type: "token"
    }
  );
};

  const webhookUrl = `${window.location.origin}/auth/webhook`;

  return (
    <div className="space-y-10 pb-20">

      <h2 className="text-2xl font-black text-white uppercase flex gap-2">
        Integrations <Sparkles className="text-purple-500" />
      </h2>

      {/* WEBHOOK */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-white font-black uppercase mb-3 flex gap-2">
          <Link size={16} /> Webhook URL
        </h3>

        <div className="flex gap-2">
          <input
            readOnly
            value={webhookUrl}
            className="flex-1 p-3 bg-black/40 text-purple-300 font-mono text-xs rounded-xl"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(webhookUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="bg-purple-600 px-4 rounded-xl text-white"
          >
            {copied ? <Check /> : <Copy />}
          </button>
        </div>
      </section>

      {/* CONNECT */}
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => connectMeta("whatsapp", "1510513603582692")}
          className="bg-white text-black py-4 rounded-xl font-black uppercase text-xs flex justify-center gap-2"
        >
          <Facebook size={16} /> Connect WhatsApp
        </button>

        <button
          onClick={() => connectMeta("instagram", "1418243342982885")}
          className="bg-white text-black py-4 rounded-xl font-black uppercase text-xs flex justify-center gap-2"
        >
          <Instagram size={16} /> Connect Instagram
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-purple-400">
          <Loader2 className="animate-spin" /> Connecting...
        </div>
      )}

      <button className="bg-purple-600 px-10 py-4 rounded-xl text-white font-black uppercase text-xs flex gap-2">
        <ShieldCheck size={16} /> Deploy Configuration
      </button>
    </div>
  );
}
