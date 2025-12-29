import React from 'react';
import { Scale, AlertTriangle, Ban, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  const lastUpdated = "December 25, 2025";

  const sections = [
    {
      title: "1. Acceptance",
      icon: <Scale className="text-purple-500" />,
      text: "By creating an account on myAutoBot, you agree to these rules. If you do not agree, please do not use our software. We may update these terms as our AI technology evolves."
    },
    {
      title: "2. Rules of Use",
      icon: <Ban className="text-red-500" />,
      text: "You must use our bots for legal business only. You are not allowed to use myAutoBot to spam people, send offensive messages, or pretend to be another person or brand."
    },
    {
      title: "3. Payments & Billing",
      icon: <creditCard className="text-fuchsia-500" />,
      text: "We offer a 7-day free trial. After that, you will be charged based on your chosen plan. You can cancel your subscription at any time through your dashboard settings."
    },
    {
      title: "4. Account Safety",
      icon: <zap className="text-emerald-500" />,
      text: "You are responsible for keeping your login details safe. If you see any strange activity on your account, please tell us immediately so we can lock it down."
    },
    {
      title: "5. Limitation of Liability",
      icon: <AlertTriangle className="text-orange-500" />,
      text: "While our AI is very smart, it is still learning. We are not responsible if the bot gives an incorrect answer. Always check your chat logs to ensure accuracy."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 pb-20 relative overflow-hidden">
      
      {/* --- BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-indigo-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="max-w-3xl mx-auto mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors mb-8 group text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            Terms of <span className="text-purple-500">Service.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Agreement Version 2.4 • Updated: {lastUpdated}
          </p>
        </div>

        {/* --- TERMS CONTENT CARD --- */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0b031a]/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            
            {/* Top Design Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

            <div className="space-y-16">
              {sections.map((section, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                      {section.icon}
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="pl-2 md:pl-16">
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium italic">
                      {section.text}
                    </p>
                  </div>

                  {/* Vertical Connection Line */}
                  {i !== sections.length - 1 && (
                    <div className="absolute top-16 left-8 w-px h-16 bg-gradient-to-b from-white/10 to-transparent hidden md:block"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Termination Notice */}
            <div className="mt-20 p-8 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-center">
              <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Account Termination</h3>
              <p className="text-slate-500 text-xs mb-0 leading-relaxed">
                We reserve the right to suspend any account that violates our anti-spam policies or 
                misuses our API. Be smart, be kind.
              </p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
              © 2025 myAutoBot AI Systems • Avenirya Technology Group
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;