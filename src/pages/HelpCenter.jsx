import React from 'react';
import { 
  Search, ArrowRight, Bot, Database, 
  Smartphone, ShieldCheck, MessageSquare, Zap,
  LifeBuoy
} from 'lucide-react';

const HelpCenter = () => {
  const categories = [
    { 
      name: "Getting Started", 
      icon: <Bot />, 
      count: "12 Articles",
      desc: "Learn how to set up your first AI bot in minutes."
    },
    { 
      name: "Bot Training", 
      icon: <Database />, 
      count: "8 Articles",
      desc: "How to teach your bot using PDFs and websites."
    },
    { 
      name: "Connect Channels", 
      icon: <Smartphone />, 
      count: "15 Articles",
      desc: "Integrate with WhatsApp, Instagram, and Web."
    },
    { 
      name: "Account & Safety", 
      icon: <ShieldCheck />, 
      count: "6 Articles",
      desc: "Manage your billing, team, and data security."
    },
  ];

  const popularArticles = [
    "How to connect my WhatsApp Business number?",
    "Can I train the bot using my website URL?",
    "How do I see my captured leads?",
    "Managing your monthly subscription",
    "How to change the bot's personality"
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 pb-20 relative overflow-hidden">
      
      {/* --- 1. BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vh] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vh] bg-fuchsia-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- 2. HEADER & SEARCH --- */}
        <div className="max-w-4xl mx-auto text-center mb-20 lg:mb-32">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Help?</span>
          </h1>
          
          <div className="relative group max-w-2xl mx-auto">
            {/* Search Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-[2.2rem] blur opacity-20 group-focus-within:opacity-50 transition-opacity"></div>
            
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search for 'WhatsApp setup'..." 
                className="w-full pl-16 pr-6 py-6 bg-[#0b031a] border border-white/10 rounded-[2rem] text-white outline-none focus:border-purple-500/50 backdrop-blur-xl transition-all shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* --- 3. CATEGORIES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {categories.map((cat, i) => (
            <div key={i} className="group p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-[#0b031a] hover:border-purple-500/30 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{cat.desc}</p>
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full">
                {cat.count}
              </span>
            </div>
          ))}
        </div>

        {/* --- 4. POPULAR ARTICLES --- */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <Zap className="text-purple-500 w-6 h-6" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Popular Topics</h2>
          </div>

          <div className="grid gap-4">
            {popularArticles.map((q, i) => (
              <button 
                key={i} 
                className="w-full flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <MessageSquare className="w-5 h-5 text-slate-600 group-hover:text-purple-500" />
                  <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{q}</span>
                </div>
                <ArrowRight size={18} className="text-slate-700 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* --- 5. SUPPORT CTA --- */}
        <div className="mt-32 text-center p-12 lg:p-20 bg-gradient-to-b from-white/[0.02] to-transparent border-t border-white/5 rounded-[4rem]">
          <LifeBuoy className="w-12 h-12 text-purple-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white uppercase mb-4">Still need help?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            Can't find what you're looking for? Our friendly support team is ready to assist you.
          </p>
          <button className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-xl shadow-purple-900/20">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;