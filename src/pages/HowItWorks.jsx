import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, Zap, MessageSquare, Cpu, Workflow, Rocket,
  ShieldCheck, ArrowRight, Share2, Sparkles, 
  Terminal, Globe, Code, Braces
} from 'lucide-react';

const StepCard = ({ number, icon: Icon, title, desc, details, color }) => (
  <div className="group relative p-10 rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:bg-[#0b031a]/80 hover:border-purple-500/40">
    <div className={`absolute -top-6 -left-6 w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-4xl font-black italic transition-all group-hover:scale-110 group-hover:rotate-6 ${color} shadow-2xl shadow-purple-500/20`}>
      {number}
    </div>
    
    <div className="mt-6">
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">
        {title}
      </h3>
      <p className="text-slate-400 font-medium leading-relaxed mb-8">
        {desc}
      </p>
      
      <div className="space-y-3">
        {details.map((detail, i) => (
          <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')}`}></div>
            {detail}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Database,
      color: "text-blue-400",
      title: "Train Your AI",
      desc: "Feed your bot the knowledge it needs. Upload PDFs, FAQs, or sync your website URL. Add specific instructions to define its personality and goals.",
      details: ["Knowledge Ingestion", "Custom Instructions", "Personality Mapping"]
    },
    {
      number: "02",
      icon: Globe,
      color: "text-emerald-400",
      title: "Web Integration",
      desc: "Deploy instantly to your website. We provide a custom shareable link and a lightweight script to embed the chatbot directly on your site.",
      details: ["Custom Chat Link", "Embeddable Script", "One-Click Preview"]
    },
    {
      number: "03",
      icon: Share2,
      color: "text-fuchsia-400",
      title: "Social Omni-Channel",
      desc: "Connect your official business handles. Seamlessly integrate your AI with Instagram, Facebook Messenger, and WhatsApp.",
      details: ["Official Meta Sync", "Cross-Platform Chat", "24/7 Social Presence"]
    },
    {
      number: "04",
      icon: Code,
      color: "text-cyan-400",
      title: "API & Workflows",
      desc: "Generate custom API keys to use your AI agent in your own web apps or connect it to n8n workflows for advanced automation.",
      details: ["API Key Generation", "n8n Dashboard Sync", "Workflow Automation"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 lg:pt-40 pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] bg-purple-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vh] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center max-w-6xl mx-auto mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-pulse">
            <Zap size={14} /> The Deployment Matrix
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-8">
            Build. Train. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
              Deploy Everywhere.
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 font-medium leading-relaxed">
            Avenirya Solutions provides the framework; you provide the knowledge. Turn your business data into a high-converting AI agent in minutes.
          </p>
        </div>

        {/* --- STEP BY STEP GRID --- */}
        <div className="grid lg:grid-cols-2 gap-16 mb-40">
          {steps.map((step, idx) => (
            <StepCard key={idx} {...step} />
          ))}
        </div>

        {/* --- API & DEVELOPER SECTION --- */}
        <section className="py-24 px-10 lg:px-20 rounded-[4rem] bg-gradient-to-br from-[#0b031a] to-black border border-white/10 relative overflow-hidden mb-32 group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Braces className="text-cyan-400" />
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Developer Protocol</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter mb-8">
                Custom API & <br /> Workflow Sync.
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                Generate secure API keys to embed MyAutoBot's intelligence directly into your custom applications or automate your business logic via **n8n workflows**.
              </p>
              
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[11px] font-black text-white uppercase tracking-widest">REST API Ready</span>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                   <Zap className="text-orange-400 w-4 h-4" />
                   <span className="text-[11px] font-black text-white uppercase tracking-widest">n8n Integrated</span>
                 </div>
              </div>
            </div>

            {/* API Key Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#05010d] border border-white/10 p-8 lg:p-12 rounded-[3.5rem] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                   <Terminal className="text-cyan-400" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">API CONFIGURATION</span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Access Key</p>
                    <div className="p-4 bg-black border border-white/5 rounded-xl flex justify-between items-center">
                      <code className="text-cyan-400 text-xs font-mono">sk_live_avenirya_77xx...</code>
                      <ArrowRight size={14} className="text-slate-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Webhook Endpoint</p>
                    <div className="p-4 bg-black border border-white/5 rounded-xl flex justify-between items-center">
                      <code className="text-slate-400 text-[10px] font-mono">https://n8n.myautobot.in/hook/...</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <div className="text-center">
          <Link 
            to="/login?id=register" 
            className="inline-flex px-12 py-6 bg-purple-600 text-white rounded-2xl font-black text-xl lg:text-2xl uppercase tracking-[0.1em] italic transition-all hover:bg-purple-500 hover:scale-105 active:scale-95 items-center gap-4 shadow-[0_20px_50px_rgba(168,85,247,0.4)]"
          >
            Launch Your Instance <Rocket size={28} />
          </Link>
          <p className="mt-8 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">
            Free Setup. No Credit Card Required. Official Meta Partner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;