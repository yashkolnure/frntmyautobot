import React, { useState, useMemo, useEffect } from 'react';
import { 
  Globe, Check, Terminal, Palette, Zap, Command, 
  Copy, Laptop, Share2, Box, Cpu, ShieldCheck, HelpCircle, ExternalLink
} from 'lucide-react';

const DOMAIN = window.location.origin;
const WIDGET_PATH = '/bot-widget.js';

const THEMES = [
  { id: 'executive', name: 'Executive White', color: 'bg-blue-600' },
  { id: 'luxe', name: 'Luxe Ivory', color: 'bg-[#c5a059]' },
  { id: 'minimal', name: 'Essential Light', color: 'bg-black' },
  { id: 'slate', name: 'Slate Midnight', color: 'bg-emerald-500' },
  { id: 'oceanic', name: 'Oceanic Blue', color: 'bg-sky-500' }
];

const PLATFORMS = {
  wordpress: {
    name: "WordPress",
    icon: <Box size={18} />,
    steps: ["Install 'Insert Headers & Footers' plugin.", "Paste code into the 'Footer' section.", "Save Changes."]
  },
  shopify: {
    name: "Shopify / Wix",
    icon: <Share2 size={18} />,
    steps: ["Go to Online Store > Themes > Edit Code.", "Open 'theme.liquid'.", "Paste before the </body> tag."]
  },
  react: {
    name: "React / Next.js",
    icon: <Cpu size={18} />,
    steps: ["Add snippet to index.html.", "Or use the 'next/script' component.", "Ensure botId is a string."]
  },
  legacy: {
    name: "Custom HTML",
    icon: <Laptop size={18} />,
    steps: ["Open your HTML file.", "Scroll to the bottom.", "Paste code right before </body>."]
  }
};

export default function DeploymentView() {
  const [userId, setUserId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('executive');
  const [copiedType, setCopiedType] = useState(null);

  useEffect(() => {
    const getLocalId = () => {
      const keys = ['user', 'auth', 'userData', 'userId'];
      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        try {
          const parsed = JSON.parse(stored);
          const id = parsed.userId || parsed._id || parsed.id;
          if (id) return id;
        } catch (e) {
          if (stored.length >= 24) return stored;
        }
      }
      return null;
    };
    setUserId(getLocalId());
  }, []);

  const chatLink = useMemo(() => `${DOMAIN}/chat/${userId}?theme=${selectedTheme}`, [userId, selectedTheme]);
  const embedCode = useMemo(() => `<script>
  window.myAutoBotId = "${userId}";
  window.myAutoBotOrigin = "${DOMAIN}";
  window.myAutoBotTheme = "${selectedTheme}";
</script>
<script src="${DOMAIN}${WIDGET_PATH}" async></script>`, [userId, selectedTheme]);

  const copy = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  if (!userId) {
    return (
      <div className="p-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
        <HelpCircle className="mx-auto text-slate-700 mb-4 animate-bounce" size={48} />
        <h3 className="text-white font-black uppercase tracking-widest">Session Expired</h3>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Please log in to retrieve your Deployment ID.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8  mx-auto pb-20 px-4 md:px-0">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            Production Deployment <Zap size={24} className="text-blue-500 fill-blue-500" />
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded uppercase tracking-widest">Active Node</span>
             <code className="text-[10px] text-slate-500 font-mono tracking-tighter">{userId}</code>
          </div>
        </div>
        <button onClick={() => window.open(chatLink)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Test Live Bot</span>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. INTEGRATION SNIPPETS */}
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Terminal size={100} /></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20"><Globe size={20} className="text-blue-400" /></div>
                    <div>
                        <p className="text-white font-black text-[11px] uppercase tracking-widest">Standalone Interface</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">For social media bios and direct emails</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 bg-black/60 border border-white/5 px-6 py-4 rounded-2xl overflow-hidden flex items-center">
                        <code className="text-[11px] font-mono text-blue-300 truncate">{chatLink}</code>
                    </div>
                    <button onClick={() => copy(chatLink, 'link')} className="bg-blue-600 text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/20 transition-all">
                        {copiedType === 'link' ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-slate-500/10 p-3 rounded-2xl border border-white/10"><Terminal size={20} className="text-slate-400" /></div>
                    <div>
                        <p className="text-white font-black text-[11px] uppercase tracking-widest">Website Widget Protocol</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Universal snippet for all modern websites</p>
                    </div>
                </div>
                <div className="relative group bg-black/60 rounded-3xl border border-white/5 overflow-hidden">
                    <button onClick={() => copy(embedCode, 'code')} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                        {copiedType === 'code' ? 'Code Copied' : 'Copy Snippet'}
                    </button>
                    <pre className="p-10 text-blue-100/60 text-[11px] font-mono overflow-x-auto leading-loose custom-scrollbar">
                        {embedCode}
                    </pre>
                </div>
            </div>
        </div>

        {/* 3. BRANDING & CHECKLIST */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                    <Palette size={18} className="text-blue-500" />
                    <span className="text-white font-black text-[10px] uppercase tracking-widest italic">Branding Preset</span>
                </div>
                <div className="space-y-2">
                    {THEMES.map((t) => (
                        <button key={t.id} onClick={() => setSelectedTheme(t.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedTheme === t.id ? 'bg-blue-600 border-blue-500 shadow-xl' : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-500'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTheme === t.id ? 'text-white' : ''}`}>{t.name}</span>
                            </div>
                            {selectedTheme === t.id && <Check size={14} className="text-white" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-600/20">
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck size={20} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Go-Live Checklist</span>
                </div>
                <ul className="space-y-4">
                    {['Script Added to Site', 'Token Balance > 0', 'Lead Capture Enabled', 'Knowledge Base Sync'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 opacity-90">
                            <div className="bg-white/20 rounded-full p-1"><Check size={10} /></div>
                            <span className="text-[10px] font-black uppercase tracking-tight">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* 4. PLATFORM SPECIFIC GUIDES */}
        <div className="lg:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(PLATFORMS).map((p, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.07] transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-blue-500">{p.icon}</div>
                            <span className="text-white font-black text-[10px] uppercase tracking-widest">{p.name}</span>
                        </div>
                        <ul className="space-y-2">
                            {p.steps.map((step, idx) => (
                                <li key={idx} className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter leading-relaxed">
                                    • {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}