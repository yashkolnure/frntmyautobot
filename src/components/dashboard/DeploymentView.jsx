import React, { useState, useMemo, useEffect } from 'react';
import { 
   Globe, Check, Loader2, Terminal, ShieldCheck, 
  Palette, Zap, Command, Cpu, Monitor,
  Laptop, Share2, Box
} from 'lucide-react';
import { getConfig } from '../../api';

const CONFIG = {
  DOMAIN: window.location.origin,
  WIDGET_PATH: '/bot-widget.js',
};

// PROFESSIONAL THEME PRESETS (3 Light, 2 Dark)
const THEMES = [
  { id: 'executive', name: 'Executive White', color: 'bg-blue-600', glow: 'shadow-blue-500/10' },
  { id: 'luxe', name: 'Luxe Ivory', color: 'bg-[#c5a059]', glow: 'shadow-[#c5a059]/10' },
  { id: 'minimal', name: 'Essential Light', color: 'bg-black', glow: 'shadow-black/5' },
  { id: 'slate', name: 'Slate Midnight', color: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  { id: 'oceanic', name: 'Oceanic Blue', color: 'bg-sky-500', glow: 'shadow-sky-500/20' }
];

const TECH_STACKS = {
  wordpress: {
    name: "WordPress",
    icon: <Box size={20} />,
    steps: [
      "Access your WordPress Dashboard.",
      "Install 'Insert Headers and Footers' via the Plugin menu.",
      "Navigate to Settings > Insert Headers and Footers.",
      "Paste the snippet into the 'Scripts in Footer' field.",
      "Save and refresh your site to verify connection."
    ]
  },
  shopify: {
    name: "Shopify / Wix",
    icon: <Share2 size={20} />,
    steps: [
      "Navigate to Online Store > Themes > Edit Code.",
      "Open your 'theme.liquid' or Master template file.",
      "Paste the snippet immediately before the </body> tag.",
      "Wix users: Go to Settings > Custom Code and add as 'Body - End'."
    ]
  },
  react: {
    name: "React / Next.js",
    icon: <Cpu size={20} />,
    steps: [
      "Locate your project's root index.html or _document.js.",
      "Paste the script tags inside the <body> block.",
      "For Next.js, use the 'next/script' component for optimal loading.",
      "Verify the botId is correctly initialized in the global scope."
    ]
  },
  custom: {
    name: "Legacy HTML",
    icon: <Laptop size={20} />,
    steps: [
      "Open your primary template file (index.html / home.php).",
      "Scroll to the absolute end of the document.",
      "Paste the script snippet immediately before the closing </body> tag.",
      "Sync the updated file with your production server."
    ]
  }
};

export default function DeploymentView({ userId: propUserId }) {
  // Use local state to manage the ID
  const [userId, setUserId] = useState(propUserId);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].id);
  const [copiedType, setCopiedType] = useState(null);
  const [activeTech, setActiveTech] = useState('wordpress');

  // SELF-HEALING: If Parent doesn't provide ID, fetch it from API
  useEffect(() => {
    if (!propUserId) {
      const recoverId = async () => {
        try {
          const { data: res } = await getConfig();
          if (res?.bot?._id) setUserId(res.bot._id);
        } catch (e) {
          console.error("Neural Link failed to retrieve ID");
        }
      };
      recoverId();
    } else {
      setUserId(propUserId);
    }
  }, [propUserId]);
// 5. DEFINE THE MISSING copyToClipboard function
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const chatLink = useMemo(() => `${CONFIG.DOMAIN}/chat/${userId}?theme=${selectedTheme}`, [userId, selectedTheme]);
  const embedCode = useMemo(() => `<script>
  window.petobaBotId = "${userId}";
  window.petobaOrigin = "${CONFIG.DOMAIN}";
  window.petobaTheme = "${selectedTheme}";
</script>
<script src="${CONFIG.DOMAIN}${CONFIG.WIDGET_PATH}" async></script>`, [userId, selectedTheme]);

  // LOADING GUARD
  if (!userId) return (
    <div className="flex flex-col h-96 items-center justify-center text-slate-400">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-slate-500">
        Waiting for Neural ID...
      </p>
    </div>
  );
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700  mx-auto pb-20 px-4 md:px-0">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            Go Live <Command size={24} className="text-blue-500" />
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Deploy your professional AI assistant across your ecosystem</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Production Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. CHANNELS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
            {/* STANDALONE LINK */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] border border-white/10 p-6 md:p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-[scan_15s_linear_infinite] pointer-events-none" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <Globe size={20} />
                    </div>
                    <div>
                        <span className="font-black text-white text-sm uppercase tracking-tight block italic">Direct Access Link</span>
                        <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase">Public Node</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <div className="flex-1 bg-black/40 border border-white/5 px-6 py-4 rounded-2xl flex items-center overflow-hidden">
                        <code className="text-[10px] font-mono text-blue-400 truncate tracking-tight">{chatLink}</code>
                    </div>
                    <button onClick={() => copyToClipboard(chatLink, 'link')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                        {copiedType === 'link' ? <Check size={16} /> : 'Copy Link'}
                    </button>
                </div>
            </div>

            {/* SCRIPT INJECTION */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] border border-white/10 p-6 md:p-6 relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-slate-600/10 border border-slate-500/30 text-slate-400 flex items-center justify-center shadow-inner">
                        <Terminal size={20} />
                    </div>
                    <div>
                        <span className="font-black text-white text-sm uppercase tracking-tight block italic">Website Script Snippet</span>
                        <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase">Industrial Integration</span>
                    </div>
                </div>
                <div className="relative group/code overflow-hidden rounded-[2rem] border border-white/5 shadow-inner shadow-black/50">
                    <div className="absolute top-4 right-4 z-20">
                        <button 
                            onClick={() => copyToClipboard(embedCode, 'code')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 shadow-lg"
                        >
                            {copiedType === 'code' ? <Check size={14} className="text-blue-400"/> : 'Copy Snippet'}
                        </button>
                    </div>
                    <pre className="bg-[#05010d] text-blue-200/60 p-10 pt-14 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed custom-scrollbar">
                        {embedCode}
                    </pre>
                </div>
            </div>
        </div>

        {/* 3. THEME SELECTOR (4 COLS) */}
        <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/10 p-6 md:p-6 h-full">
                <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                    <div className="w-11 h-11 rounded-2xl bg-slate-700/20 border border-slate-500/30 text-slate-400 flex items-center justify-center shadow-inner">
                        <Palette size={20} />
                    </div>
                    <div>
                        <span className="font-black text-white text-sm uppercase tracking-tight block italic">Visual Presets</span>
                        <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase">Professional Branding</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    {THEMES.map((t) => (
                        <button 
                          key={t.id} 
                          onClick={() => setSelectedTheme(t.id)} 
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                            selectedTheme === t.id 
                            ? 'bg-blue-600/10 border-blue-500/50 shadow-md scale-[1.02]' 
                            : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                          }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${t.color} ${t.glow} transition-transform duration-500`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTheme === t.id ? 'text-white' : 'text-slate-500'}`}>
                                  {t.name}
                                </span>
                            </div>
                            {selectedTheme === t.id && <Check size={14} className="text-blue-500" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* 4. STEP-BY-STEP INSTRUCTIONS */}
        <div className="lg:col-span-12">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/10 p-6 md:p-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* SELECTION SIDEBAR */}
                    <div className="lg:w-1/3 space-y-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                            Platform Protocol <Laptop size={20} className="text-blue-500" />
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                            {Object.entries(TECH_STACKS).map(([key, tech]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTech(key)}
                                    className={`flex flex-col lg:flex-row items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${
                                        activeTech === key 
                                        ? 'bg-blue-600 border-blue-500 shadow-xl text-white' 
                                        : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                                    }`}
                                >
                                    <div className={`${activeTech === key ? 'text-white' : 'text-blue-400'} transition-colors`}>{tech.icon}</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{tech.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DYNAMIC MANUAL */}
                    <div className="lg:w-2/3 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Monitor size={120} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg">
                                    <ShieldCheck size={18} />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest italic tracking-tight">Manual: {TECH_STACKS[activeTech].name} Deployment</h4>
                            </div>

                            <div className="space-y-6">
                                {TECH_STACKS[activeTech].steps.map((step, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <span className="shrink-0 text-[10px] font-black text-blue-500 bg-blue-500/10 w-7 h-7 flex items-center justify-center rounded-lg border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            {i + 1}
                                        </span>
                                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight italic">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes scan { 
          0% { transform: translateY(-100%); } 
          100% { transform: translateY(100%); } 
        }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}