import React from 'react';
import { 
  Zap, Gift, Users, CheckCircle, ArrowRight, 
  Rocket, ShieldCheck, Globe, Coins, Database, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TokenRefillCard = ({ amount, price, bonus, highlight, ctaText }) => (
  <div className={`relative p-8 lg:p-10 rounded-[3rem] transition-all duration-500 flex flex-col h-full border ${
    highlight 
      ? 'bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0b031a] border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-105 z-10' 
      : 'bg-white/5 border-white/10 hover:border-purple-500/30'
  }`}>
    {highlight && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-purple-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
        Recommended Refill
      </div>
    )}

    <div className="mb-8">
      <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2 italic">Refill Protocol</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black text-white italic tracking-tighter">{amount}</span>
        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest ml-2">Tokens</span>
      </div>
    </div>

    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-8">
      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Acquisition Cost</p>
      <p className="text-xl font-black text-white italic">{price}</p>
    </div>

    <ul className="space-y-4 mb-10 flex-1">
      <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
        <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5" />
        One-time payment, no subscription
      </li>
      <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
        <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5" />
        {bonus ? `Includes ${bonus} Bonus Tokens` : "Instant balance synchronization"}
      </li>
      <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
        <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5" />
        Official Meta Partner API access
      </li>
    </ul>

    <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-center italic ${
      highlight 
        ? 'bg-purple-600 text-white shadow-xl hover:bg-purple-500' 
        : 'bg-white/10 text-white hover:bg-white/20'
    }`}>
      {ctaText}
    </button>
  </div>
);

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#05010d] pt-32 lg:pt-40 pb-24 relative overflow-hidden">
      {/* --- AMBIENT BLOBS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vh] bg-purple-900/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 italic">
            <Activity size={14} className="text-purple-500" /> Token Economy v1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-8">
            Start For <span className="text-purple-400">Free.</span> <br />
            Refill As You <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">Scale.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            No monthly contracts. No hidden fees. Experience the power of MyAutoBot with a massive welcome bonus.
          </p>
        </div>

        {/* --- THE STARTER BUNDLES (WELCOME & REFERRAL) --- */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* Welcome Bonus Card */}
          <div className="bg-gradient-to-br from-purple-600/20 to-transparent p-10 rounded-[3.5rem] border border-purple-500/30 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:rotate-12 transition-transform">
                <Gift size={32} className="text-white" />
              </div>
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Registration Reward</p>
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">+500 Welcome Tokens</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Immediately power your first <span className="text-white font-bold">100 AI Interactions</span> for free upon system initialization.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-5 text-white group-hover:scale-110 transition-transform duration-700">
               <Rocket size={250} />
            </div>
          </div>

          {/* Referral Card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-transparent p-10 rounded-[3.5rem] border border-blue-500/30 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:rotate-12 transition-transform">
                <Users size={32} className="text-white" />
              </div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Network Expansion</p>
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">+50 Referral Yield</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Expand the MyAutoBot grid. Receive <span className="text-white font-bold">50 Tokens</span> for every verified node that joins using your code.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-5 text-white group-hover:scale-110 transition-transform duration-700">
               <Globe size={250} />
            </div>
          </div>
        </div>

        

        {/* --- SYSTEM LOGIC EXPLAINER --- */}
        <section className="py-20 px-10 rounded-[4rem] bg-[#0b031a]/60 backdrop-blur-3xl border border-white/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-12">How The Economy Operates</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                <Coins className="mx-auto mb-4 text-purple-400" size={32} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Interaction Cost</p>
                <p className="text-2xl font-black text-white italic">5 TOKENS</p>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Per AI Response</p>
              </div>
              <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                <Database className="mx-auto mb-4 text-emerald-400" size={32} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Lead Storage</p>
                <p className="text-2xl font-black text-white italic">FREE</p>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Capture Unlimited Data</p>
              </div>
              <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                <ShieldCheck className="mx-auto mb-4 text-blue-400" size={32} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Meta Partner</p>
                <p className="text-2xl font-black text-white italic">VERIFIED</p>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Official API Sync</p>
              </div>
            </div>
            
            <div className="mt-16">
              <Link 
                to="/login?id=register" 
                className="inline-flex px-12 py-5 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 transition-all active:scale-95 italic gap-3 items-center"
              >
                Deploy My 500 Tokens <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PricingPage;