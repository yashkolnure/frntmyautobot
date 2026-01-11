import React from 'react';
import { 
  Zap, Database, ShieldCheck, Cpu, MessageSquare, 
  BarChart3, Globe, Code, Layers, Rocket, Sparkles, 
  ArrowRight, Terminal, Workflow, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TechnicalFeature = ({ icon: Icon, title, desc, tag, color, metric }) => (
  <div className="group relative p-8 lg:p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/40 hover:bg-[#0b031a]/90 overflow-hidden">
    {/* Background Decorative Icon */}
    <div className={`absolute -top-10 -right-10 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity ${color}`}>
      <Icon size={200} />
    </div>
    
    <div className="relative z-10">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-black/40 border border-white/10 ${color} shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={32} />
      </div>

      {tag && (
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest">
            {tag}
          </span>
          {metric && <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{metric}</span>}
        </div>
      )}

      <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed font-medium mb-6">
        {desc}
      </p>
      
      <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
        Protocol Status: Active <ArrowRight size={14} />
      </div>
    </div>
  </div>
);

const FeaturesPage = () => {
  const specs = [
    {
      icon: Database,
      title: "Neural Lead Capture",
      desc: "Automatically identifies and extracts customer names, contact numbers, and intent from raw conversations into a structured lead dashboard.",
      tag: "Conversion Engine",
      metric: "Real-time Sync",
      color: "text-emerald-400"
    },
    {
      icon: ShieldCheck,
      title: "Meta Tech Provider",
      desc: "Fully integrated with official WhatsApp and Instagram Business APIs. Enjoy secure, ban-free automation with the backing of official Meta partnership.",
      tag: "Official Status",
      metric: "Verified Node",
      color: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Token-Based Billing",
      desc: "Predictable scaling for your business. Every API interaction consumes exactly 5 tokens, allowing for clear ROI calculation and cost management.",
      tag: "Economy System",
      metric: "5 Tokens/Call",
      color: "text-yellow-400"
    },
    {
      icon: Workflow,
      title: "n8n Automation",
      desc: "Connect your custom n8n dashboards to build hyper-complex workflows, from CRM updates to automated invoice generation during chat.",
      tag: "Infrastructure",
      metric: "n8n Integrated",
      color: "text-orange-400"
    },
    {
      icon: Cpu,
      title: "Self-Hosted LLMs",
      desc: "We run proprietary chat models on GPU-enabled VPS nodes in India. This ensures human-like responses with ultra-low latency for your local customers.",
      tag: "Compute Node",
      metric: "GPU Powered",
      color: "text-fuchsia-400"
    },
    {
      icon: Code,
      title: "Custom API & Webhooks",
      desc: "Deploy custom bots or connect your existing software via our robust API. Designed for developers and agencies seeking white-label solutions.",
      tag: "Developer Ready",
      metric: "REST API",
      color: "text-cyan-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 lg:pt-40 pb-24 relative overflow-hidden">
      
      {/* --- AMBIENT DEPTH LAYERS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vh] bg-purple-900/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-5xl mx-auto text-center mb-32">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
            <Activity size={14} className="text-purple-500" /> System Specifications
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-10">
            Automate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
              The Interaction.
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            MyAutoBot is a high-performance AI agent platform built to handle the entire lead lifecycle—from the first "Hello" to a verified CRM entry.
          </p>
        </div>

        {/* --- MAIN FEATURES GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {specs.map((spec, idx) => (
            <TechnicalFeature key={idx} {...spec} />
          ))}
        </div>

        {/* --- TECHNICAL BREAKDOWN: TOKENOMICS --- */}
        <section className="relative rounded-[4rem] bg-gradient-to-br from-[#0b031a] to-black border border-white/10 p-10 lg:p-20 overflow-hidden mb-32">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-600/5 blur-[100px] pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-purple-400 font-black uppercase tracking-[0.3em] text-xs mb-6">Resource Allocation</p>
              <h2 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter mb-8 leading-tight">
                Transparent <br /> Token Economy.
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400 shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">5 Tokens Per Request</h4>
                    <p className="text-slate-400 text-sm">Every chat interaction, whether complex or simple, consumes a flat rate of 5 tokens.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Real-time Deduction</h4>
                    <p className="text-slate-400 text-sm">View your token balance live in the dashboard. No hidden costs or monthly surprises.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Token Counter Mockup */}
            <div className="relative">
              <div className="bg-[#1a0b2e] border border-purple-500/30 p-10 rounded-[3rem] shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Balance</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="text-7xl font-black text-white italic tracking-tighter mb-4 flex items-baseline gap-2">
                  12,450 <span className="text-xl text-purple-500 uppercase not-italic">TKN</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-600 w-[75%]"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Last Call</p>
                    <p className="text-white font-mono">-5 TKN</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Daily Cap</p>
                    <p className="text-white font-mono">UNLIMITED</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CALL TO DEPLOY --- */}
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter mb-10">
            System Ready for <span className="text-purple-500">Deployment.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/login?id=register" className="px-12 py-5 bg-purple-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:bg-purple-500 transition-all active:scale-95 flex items-center gap-3 italic">
              Initialize Node <Rocket size={20} />
            </Link>
            <div className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">
              Tech Provider ID: 001-AVENIRYA
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeaturesPage;