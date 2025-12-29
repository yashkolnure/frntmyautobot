import React from 'react';
import { Sparkles, ShieldCheck, XCircle, Bot, Globe, Zap, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#05010d] pt-32 pb-20 relative overflow-hidden">
      
      {/* --- 1. BACKGROUND GLOWS (The "Five Blobs" Style) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vh] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-fuchsia-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- 2. HERO SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-24 lg:mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] lg:text-xs font-black mb-8 uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> The Mission
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
            WE KILL <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">DEAD AIR.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Every day, thousands of businesses lose customers because they take too long to reply. 
            We built <b>myAutoBot</b> to make sure no customer is ever left waiting again.
          </p>
        </div>

        {/* --- 3. THE "WHY" GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { 
              title: "The Problem", 
              desc: "Human teams need sleep and breaks. When your business is 'closed', you are losing leads.", 
              icon: <XCircle className="w-10 h-10 text-red-500" /> 
            },
            { 
              title: "Our Solution", 
              desc: "A smart AI that learns your business instantly and talks to customers like a pro.", 
              icon: <Bot className="w-10 h-10 text-purple-500" /> 
            },
            { 
              title: "The Result", 
              desc: "24/7 coverage, instant replies, and more sales without hiring more people.", 
              icon: <Zap className="w-10 h-10 text-fuchsia-500" /> 
            }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl hover:border-purple-500/50 transition-all group">
              <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* --- 4. GLOBAL REACH STATS --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32 border-y border-white/5 py-16 bg-white/[0.01]">
            {[
                { label: "Leads Captured", val: "2.4M+", icon: <Users /> },
                { label: "Countries", val: "12+", icon: <Globe /> },
                { label: "Uptime", val: "99.9%", icon: <ShieldCheck /> },
                { label: "AI Speed", val: "< 1s", icon: <Zap /> },
            ].map((stat, i) => (
                <div key={i} className="text-center">
                    <div className="text-purple-500 mb-2 flex justify-center">{stat.icon}</div>
                    <h4 className="text-3xl lg:text-5xl font-black text-white mb-2">{stat.val}</h4>
                    <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
            ))}
        </div>

        {/* --- 5. THE PARENT COMPANY (AVENIRYA) --- */}
        <div className="relative max-w-5xl mx-auto p-1 lg:p-12 rounded-[4rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent blur-3xl opacity-50"></div>
          
          <div className="relative bg-[#0b031a]/80 border border-white/10 p-12 lg:p-20 rounded-[3.5rem] backdrop-blur-2xl text-center">
             <div className="inline-flex items-center gap-2 mb-8 px-4 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Professional Grade
             </div>
             <h2 className="text-3xl lg:text-5xl font-black text-white uppercase mb-6 tracking-tighter">
                Part of <span className="text-purple-500">Avenirya Group.</span>
              </h2>
             <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed font-medium italic mb-10">
               "myAutoBot is the flagship automation tool developed by Avenirya. Our goal is to take 
               the complex power of Neural Networks and make it as easy to use as a simple chat app 
               for business owners worldwide."
             </p>
             <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase text-xs tracking-widest transition-all">
                Visit Avenirya.com
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;