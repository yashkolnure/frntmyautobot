import React from 'react';
import { ArrowLeft, Home, Rocket, Bot, ShieldCheck, AlertTriangle } from 'lucide-react';

// --- CONSISTENT BACKGROUND ---
const FullPageAmbientGlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#05010d]">
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-purple-800/20 blur-[150px] mix-blend-screen animate-[pulse_10s_infinite]"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[60vh] rounded-full bg-violet-800/10 blur-[200px] mix-blend-screen"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.05),transparent_70%)]"></div>
  </div>
);

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans selection:bg-purple-500/90 text-slate-200">
      
      <FullPageAmbientGlow />

      <div className="relative z-10 container mx-auto px-6 text-center">
        
        {/* --- GLITCHY 404 HEADER --- */}
        <div className="relative inline-block mb-8">
            <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-white/5 select-none">
                404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)] mb-6 animate-bounce">
                        <Bot size={40} className="text-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/50 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                        <AlertTriangle size={12} /> Neural Path Broken
                    </div>
                </div>
            </div>
        </div>

        {/* --- TEXT CONTENT --- */}
        <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Datastream.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
                The page you are looking for has been de-indexed or moved to a restricted node. 
                Our AI agents couldn't find a valid response for this URL.
            </p>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
                onClick={() => window.history.back()}
                className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Go Back
            </button>

            <a 
                href="/" 
                className="group px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-3 transition-all active:scale-95"
            >
                <Home size={16} /> Return to Base
            </a>
        </div>

        {/* --- TECH PROVIDER FOOTER --- */}
        <div className="mt-24 flex flex-col items-center gap-6 opacity-40">
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                <ShieldCheck size={14} className="text-purple-500" />
                Official Meta Tech Provider
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                Avenirya Solutions OPC Pvt Ltd • 2026
            </p>
        </div>

      </div>

      {/* Background scanline animation */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .min-h-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(168,85,247,0.03), transparent);
          height: 100px;
          width: 100%;
          animation: scan 4s linear infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;