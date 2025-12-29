import React from 'react';
import { ShieldCheck, Eye, Lock, Database, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const lastUpdated = "December 25, 2025";

  const sections = [
    {
      title: "1. Data Ownership",
      icon: <Database className="text-purple-500" />,
      text: "Your data belongs to you. We do not sell your customer information, chat logs, or lead details to any third-party companies. We only store data to help your bot function correctly."
    },
    {
      title: "2. How We Use AI",
      icon: <Eye className="text-fuchsia-500" />,
      text: "Our AI 'reads' your uploaded documents (PDFs, URLs) to answer customer questions. This data is private to your account. We do not use your private business info to train bots for other people."
    },
    {
      title: "3. Encryption & Safety",
      icon: <Lock className="text-emerald-500" />,
      text: "Every conversation is protected with AES-256 encryption. This is the same level of security used by banks. Your API keys and passwords are salted and hashed for maximum safety."
    },
    {
      title: "4. Global Privacy",
      icon: <Globe className="text-blue-500" />,
      text: "We follow global standards like GDPR. You have the right to delete your account and all associated lead data at any time with a single click in your settings."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 pb-20 relative overflow-hidden">
      
      {/* --- BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-fuchsia-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="max-w-3xl mx-auto mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            Privacy <span className="text-purple-500">Policy.</span>
          </h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* --- CONTENT CARD --- */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0b031a]/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

            <div className="space-y-16">
              {sections.map((section, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      {section.icon}
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="pl-2 md:pl-16">
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                      {section.text}
                    </p>
                  </div>

                  {/* Vertical Accent Line */}
                  {i !== sections.length - 1 && (
                    <div className="absolute top-16 left-8 w-px h-16 bg-gradient-to-b from-white/10 to-transparent hidden md:block"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Support Box */}
            <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/5 text-center">
              <ShieldCheck className="w-10 h-10 text-purple-500 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Have a question about your data?</h3>
              <p className="text-slate-500 text-sm mb-6">Contact our privacy team at privacy@myautobot.ai</p>
              <Link to="/contact" className="text-purple-400 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">
                Contact Legal Team
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Privacy;