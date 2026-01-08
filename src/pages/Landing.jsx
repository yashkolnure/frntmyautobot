import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Instagram, Facebook, Globe, Zap, Database, 
  ShieldCheck, Clock, ArrowRight, ChevronDown, ChevronUp, Star, 
  CheckCircle, XCircle, Mail, User, Sparkles, 
  LayoutTemplate, BarChart3, Rocket, Cpu, Share2, Terminal,Bot, Utensils, Wrench, ShoppingBag, Briefcase, 
} from 'lucide-react';

// --- THE AMBIENT BACKGROUND COMPONENT ---
// This layer sits fixed behind everything else.
const FullPageAmbientGlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Blob 1: Top-Left Primary Purple */}
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-purple-800/30 blur-[150px] mix-blend-screen animate-[pulse_10s_infinite]"></div>
    
    {/* Blob 2: Mid-Right Fuchsia Accent */}
    <div className="absolute top-[30%] right-[-20%] w-[60vw] h-[60vh] rounded-full bg-fuchsia-800/20 blur-[180px] mix-blend-screen animate-[pulse_15s_infinite]"></div>
    
    {/* Blob 3: Center-Left Deep Indigo */}
    <div className="absolute bottom-[10%] left-[-15%] w-[50vw] h-[50vh] rounded-full bg-indigo-900/30 blur-[160px] mix-blend-screen"></div>
    
    {/* Blob 4: Bottom-Right Violet */}
    <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[60vh] rounded-full bg-violet-800/20 blur-[200px] mix-blend-screen"></div>

    {/* Blob 5: Subtle Center Wash */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.05),transparent_70%)]"></div>
    
    {/* Noise texture overlay for "cyber" feel */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
  </div>
);


const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);
  
  // Auto-rotate steps
  useEffect(() => {
    const timer = setInterval(() => setActiveStep((prev) => (prev + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#05010d] text-slate-200 font-sans selection:bg-purple-500/90 selection:text-white relative overflow-x-hidden">
      
      {/* --- THE FIVE FULL PAGE GLOWING BLOBS --- */}
      <FullPageAmbientGlow />

      {/* --- CONTENT LAYER (Z-INDEX 10 sits above the glow) --- */}
      <div className="relative z-10">
        
       {/* --- 1️⃣ HERO SECTION --- */}
<section className="pt-32 pb-20 container mx-auto px-6 text-center lg:text-left grid lg:grid-cols-12 gap-16 items-center  relative z-10">
  {/* Text Content (65% width) */}
  <div className="lg:col-span-8">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-500/50 text-purple-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)]">
      <Cpu className="w-4 h-4 animate-pulse" /> AI-Powered Lead Capture
    </div>
    <h1 className="text-5xl lg:text-[3.5rem] font-black tracking-tight mb-8 leading-[0.95] text-white drop-shadow-xl">
     Always Reply to Customers <br />
      <span className="text-transparent text-5xl  bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
        Even When You’re Offline
      </span>
    </h1>
    <p className="text-xl text-slate-300 mb-10 max-w-lg leading-relaxed mx-auto lg:mx-0">
      Your customers are messaging you 24/7. MyAutoBot replies instantly, answers questions, and saves customer details automatically.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <button className="group relative overflow-hidden px-6 py-3 bg-purple-600 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2">
        Start Free Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
    <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-sm font-bold text-purple-300/70 uppercase tracking-wider">
      <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Free Setup</span>
      <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> No Credit Card</span>
      <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Cancel Anytime</span>
    </div>
  </div>

      {/* COLUMN 2: REDESIGNED CHAT SIMULATION (35%) */}
      <div className="lg:col-span-4 relative group">
        <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full group-hover:bg-purple-600/30 transition-all duration-700"></div>
        
        {/* Glassmorphism Phone Frame */}
        <div className="relative bg-[#0b031a]/90 border-[4px] border-white/10 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/13] flex flex-col backdrop-blur-3xl">
          
          {/* Top Bar */}
          <div className="bg-white/5 p-6 pb-4 border-b border-white/10 flex items-center gap-3 backdrop-blur-md">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-xs uppercase tracking-widest">MyAutoBot AI</p>
              <p className="text-green-400 text-[10px] font-black uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Agent Active
              </p>
            </div>
          </div>

          {/* Chat Messages Area - Plain Background */}
          <div className="flex-1 p-5 space-y-6 overflow-y-auto bg-[#0b031a]">
            
            {/* User Inquiry */}
            <div className="flex flex-col items-start animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                <div className="bg-white/5 text-slate-200 p-4 rounded-2xl rounded-bl-none text-xs max-w-[85%] border border-white/10 shadow-sm">
                  Hi! I'm interested in booking a consultation for my team.
                </div>
            </div>

            {/* AI Qualifying & Ask */}
            <div className="flex flex-col items-end animate-[fadeIn_0.5s_ease-out_1.2s_both]">
                <div className="bg-purple-600 text-white p-4 rounded-2xl rounded-br-none text-xs max-w-[85%] shadow-lg shadow-purple-900/20">
                  I'd love to help! What's your <b>Email</b> or <b>WhatsApp</b> number so I can send our available slots?
                </div>
            </div>

            {/* User Provides Data */}
            <div className="flex flex-col items-start animate-[fadeIn_0.5s_ease-out_2.2s_both]">
                <div className="bg-white/5 text-slate-200 p-4 rounded-2xl rounded-bl-none text-xs max-w-[85%] border border-white/10 shadow-sm">
                  Sure, it's <b>alex@agency.com</b>
                </div>
            </div>

            {/* AI EXTRACTION SUCCESS CARD */}
            <div className="relative pt-4 animate-[fadeIn_0.5s_ease-out_3.0s_both]">
              <div className="absolute inset-0 bg-purple-500/10 blur-2xl animate-pulse"></div>
              <div className="relative bg-black/60 border-2 border-purple-500/40 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                <div className="bg-purple-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                     <p className="text-[10px] text-purple-300 font-black uppercase tracking-widest">Lead Captured</p>
                     <CheckCircle className="w-4 h-4 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
                     <p className="text-white font-mono text-[11px] truncate">alex@agency.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Bar Mockup */}
          <div className="p-5 bg-white/5 border-t border-white/10 backdrop-blur-md flex gap-3 items-center">
            <div className="flex-1 h-9 bg-black/40 rounded-full border border-white/10 flex items-center px-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
               AI is handling this chat...
            </div>
            <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center opacity-40">
              <Rocket className="w-4 h-4 text-white" />
            </div>
          </div>

        </div>
      </div>
</section>

        {/* --- 2️⃣ SOCIAL PROOF --- */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <p className="text-purple-300 text-xs font-black uppercase tracking-[0.3em] mb-10 drop-shadow-lg">Works Where Your Customers Already Chat</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 hover:opacity-100 transition-opacity">
               {/* Icons with subtle glow on hover */}
               <div className="flex items-center gap-3 text-xl font-bold hover:text-green-400 transition-colors hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"><MessageSquare /> WhatsApp</div>
               <div className="flex items-center gap-3 text-xl font-bold hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_10px_rgba(232,121,249,0.5)]"><Instagram /> Instagram</div>
               <div className="flex items-center gap-3 text-xl font-bold hover:text-blue-400 transition-colors hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]"><Facebook /> Messenger</div>
               <div className="flex items-center gap-3 text-xl font-bold hover:text-purple-400 transition-colors hover:drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]"><Globe /> Website</div>
            </div>
          </div>
        </section>

        {/* --- 3️⃣ PROBLEM SECTION --- */}
        <section className="py-20 container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center ">
          <div className="order-2 lg:order-1">
             {/* Illustration: The Overwhelmed Phone */}
             <div className="relative mx-auto max-w-md group">
  {/* Red Ambient Glow */}
  <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full animate-pulse"></div>
  
  {/* Phone Frame */}
  <div className="bg-[#1a0505] border-[2px] border-red-900/30 rounded-[3.5rem] p-0 shadow-2xl relative z-10 transform rotate-[-4deg] group-hover:rotate-0 transition-all duration-700 ease-out">
    <div className="bg-black rounded-[2.8rem] overflow-hidden relative h-[620px] border border-red-900/20">
      
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-30"></div>
      
      {/* Top Header Mockup */}
      <div className="pt-10 px-6 pb-4 bg-gradient-to-b from-red-950/40 to-transparent border-b border-white/5 relative z-20">
        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse">System Alert: Missed Inquiries</p>
      </div>

      {/* Infinite Scrolling List Container */}
      <div className="relative h-full overflow-hidden">
        {/* The Animated List (Duplicated for seamless loop) */}
        <div className="flex flex-col gap-3 p-4 animate-[scrollVertical_20s_linear_infinite] hover:[animation-play-state:paused]">
          {[
            { q: "Is this still available?", t: "2m ago" },
            { q: "I need a quote for 50 units.", t: "14m ago" },
            { q: "Can we talk on WhatsApp?", t: "1h ago" },
            { q: "What are your business hours?", t: "3h ago" },
            { q: "Sent you a DM on Instagram!", t: "5h ago" },
            { q: "Looking for the pricing PDF.", t: "8h ago" },
            /* Duplicated for seamless transition */
            { q: "Is this still available?", t: "2m ago" },
            { q: "I need a quote for 50 units.", t: "14m ago" },
            { q: "Can we talk on WhatsApp?", t: "1h ago" },
            { q: "What are your business hours?", t: "3h ago" },
            { q: "Sent you a DM on Instagram!", t: "5h ago" },
            { q: "Looking for the pricing PDF.", t: "8h ago" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-red-500/20 flex justify-between items-start group/msg transition-colors hover:bg-white/10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  <p className="font-bold text-red-400 text-[10px] uppercase tracking-tighter">Unread Lead</p>
                </div>
                <p className="text-slate-300 text-xs font-medium italic leading-relaxed">"{item.q}"</p>
                <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase">{item.t}</p>
              </div>
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border border-red-400">1</div>
            </div>
          ))}
        </div>

        {/* Floating "Missed" Warning - Fixed at bottom */}
        <div className="absolute bottom-24 inset-x-4 z-30">
          <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 mx-4 rounded-3xl text-center shadow-[0_15px_40px_-5px_rgba(220,38,38,0.6)] border border-red-400 transform scale-105">
            <div className="flex items-center justify-center gap-2 ">
               <XCircle className="w-5 h-5 text-white" />
               <p className="text-white font-black uppercase text-xl tracking-tighter">LEADS LOST</p>
            </div>
          </div>
        </div>

        {/* Faders to hide the entering/exiting items */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
      </div>
    </div>
  </div>

  <style jsx>{`
    @keyframes scrollVertical {
      0% { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }
  `}</style>
</div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl  font-black mb-8 leading-tight text-white uppercase tracking-tighter drop-shadow-lg">
              Why Most Businesses <br/><span className="text-red-500 underline decoration-red-500/30">Lose Leads Daily.</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Customers message you with interest, but if you don't reply instantly, they move on. Manual follow-ups are too slow.
            </p>
            <div className="space-y-5">
              {["Messages replied too late", "Customer details not saved", "Staff unavailable after hours", "Leads scattered across apps"].map((text, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-red-950/30 border border-red-900/50 backdrop-blur-sm hover:bg-red-900/50 transition-all">
                  <XCircle className="w-6 h-6 text-red-500 shrink-0 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                  <p className="text-lg text-red-100 font-medium">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-red-400 font-black text-lg uppercase tracking-widest border-l-4 border-red-500 pl-4">Outcome: Missed Messages = Missed Revenue.</p>
          </div>
        </section>

        {/* --- 4️⃣ SOLUTION SECTION --- */}
        <section className="py-16 relative " id ="features">
           {/* Subtle overlay to make this section pop a bit more */}
          <div className="absolute inset-0 "></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl  font-black text-white mb-8 tracking-tighter drop-shadow-2xl">MyAutoBot FIXES THIS <span className="text-purple-500 uppercase">Automatically.</span></h2>
            <p className="text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">Your smart team member who never sleeps. It replies instantly, understands needs, and saves details.</p>
            
            <div className="grid md:grid-cols-4 gap-6">
               {[
                 { icon: <Zap />, title: "Instant Replies", desc: "To every single message, 24/7." },
                 { icon: <Terminal />, title: "Smart Context", desc: "Understands intent, asks follow-ups." },
                 { icon: <Database />, title: "Auto-Save Leads", desc: "Zero manual data entry required." },
                 { icon: <Rocket />, title: "Zero Effort", desc: "Focus on closing, not chatting." }
               ].map((item, i) => (
                 <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:border-purple-500/50 hover:bg-purple-900/20 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/10 group-hover:to-fuchsia-500/10 transition-all duration-500"></div>
                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform relative z-10">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight relative z-10">{item.title}</h3>
                    <p className="text-slate-300 font-medium relative z-10">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* --- 5️⃣ HOW IT WORKS: THE NEURAL PIPELINE --- */}
<section className="py-16 relative overflow-hidden" id="how-it-works">
  <div className="container mx-auto px-6 relative z-10">
    <div className="text-center mb-24">
      <h2 className="text-4xl lg:text-5xl  font-black text-white uppercase tracking-tighter mb-4">
        The Pipeline <span className="text-purple-500">to Profit.</span>
      </h2>
      <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm italic">From raw data to qualified leads in minutes.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 relative">
      {/* Connecting Data Line (Desktop only) */}
      <div className="hidden md:block absolute top-[15%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent z-0">
        <div className="absolute inset-0 bg-purple-400 blur-sm animate-[shimmer_3s_infinite_linear]"></div>
      </div>

      {[
        { 
          num: "01", 
          title: "Knowledge Sync", 
          desc: "Upload your PDFs, website URL, or FAQs. Our AI absorbs your business logic instantly.",
          icon: <LayoutTemplate className="w-6 h-6" />,
          mockup: (
            <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>training_data.pdf</span>
                <span className="text-purple-400">98%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[98%] shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
              </div>
            </div>
          )
        },
        { 
          num: "02", 
          title: "AI Engagement", 
          desc: "The bot interacts 24/7, answering complex questions and building trust with your visitors.",
          icon: <MessageSquare className="w-6 h-6" />,
          mockup: (
            <div className="space-y-2">
              <div className="w-2/3 h-6 bg-purple-600/20 rounded-lg rounded-tl-none border border-purple-500/30 flex items-center px-3">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
              <div className="w-3/4 h-8 bg-white/5 rounded-lg border border-white/10 ml-auto flex items-center px-2">
                <div className="w-full h-1 bg-white/10 rounded-full"></div>
              </div>
            </div>
          )
        },
        { 
          num: "03", 
          title: "Lead Harvest", 
          desc: "Verified contact details are extracted and synced to your dashboard automatically.",
          icon: <Database className="w-6 h-6" />,
          mockup: (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#05010d]" />
              </div>
              <div className="flex-1">
                <div className="h-2 w-16 bg-emerald-500/40 rounded-full mb-1"></div>
                <div className="h-2 w-10 bg-white/10 rounded-full"></div>
              </div>
            </div>
          )
        }
      ].map((s, i) => (
        <div 
          key={i} 
          onMouseEnter={() => setActiveStep(i)}
          className={`group relative z-10 p-1 rounded-[3.5rem] transition-all duration-500 ${activeStep === i ? 'bg-gradient-to-b from-purple-500/40 to-transparent shadow-[0_20px_50px_-10px_rgba(168,85,247,0.3)]' : 'bg-transparent'}`}
        >
          <div className="bg-[#0b031a]/90 backdrop-blur-2xl rounded-[3.4rem] p-6 h-full border border-white/5 flex flex-col items-center text-center">
            
            {/* Step Number Badge */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-8 transition-all duration-500 ${activeStep === i ? 'bg-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.6)] rotate-12' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
              {s.num}
            </div>

            {/* Visual Mockup Illustration */}
            <div className="w-full h-32 mb-4 flex items-center justify-center">
              <div className={`w-full max-w-[180px] transition-all duration-500 ${activeStep === i ? 'scale-110 opacity-100' : 'scale-100 opacity-40 grayscale'}`}>
                {s.mockup}
              </div>
            </div>

            {/* Text Content */}
            <h3 className={`text-2xl font-black mb-4 uppercase tracking-tighter transition-colors ${activeStep === i ? 'text-white' : 'text-slate-500'}`}>
              {s.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              {s.desc}
            </p>

            {/* Glowing Icon Footer */}
            <div className={`mt-8 p-3 rounded-full transition-all ${activeStep === i ? 'bg-purple-500 text-white animate-bounce' : 'bg-white/5 text-slate-600'}`}>
              {s.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Background Section-specific Blobs */}
  <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
  <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-600/5 blur-[100px] rounded-full pointer-events-none"></div>
</section>
        {/* --- 6️⃣ LEAD GENERATION FOCUS --- */}
        <section className="py-16 container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center ">
           <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-6 uppercase tracking-wider">
                <Share2 className="w-4 h-4" /> Key Differentiator
              </div>
              <h2 className="text-4xl lg:text-5xl  font-black mb-8 leading-tight text-white uppercase tracking-tighter drop-shadow-xl">
                Built to Capture Leads <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600">From Conversations.</span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Unlike normal chatbots, MyAutoBot is designed to naturally collect real customer information during the chat flow.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {["Customer Name", "Phone Number", "Email Address", "Interest/Requirement", "Source Platform"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white font-bold p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <CheckCircle className="text-purple-400 w-5 h-5 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" /> {item}
                  </div>
                ))}
              </div>
              <p className="mt-10 text-2xl font-black text-purple-300 italic">Every conversation becomes a business opportunity.</p>
           </div>
           
           {/* Illustration: The Transformation Pipeline */}
<div className="relative group">
  {/* 1. Deep Ambient Aura */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-fuchsia-600/20 blur-[100px] rounded-full animate-pulse"></div>
  
  {/* 2. Main Outer Container */}
  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden">
    <div className="bg-[#05010d]/40 rounded-[3rem] p-10 relative overflow-hidden">
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

      {/* --- PHASE 1: THE INBOUND SIGNAL --- */}
      <div className="relative mb-12 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></div>
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Inbound Signal</span>
        </div>
        
        <div className="relative max-w-[85%] group/msg">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl blur opacity-20 group-hover/msg:opacity-40 transition-opacity"></div>
          <div className="relative p-5 bg-[#1a0b2e] border border-purple-500/30 rounded-2xl rounded-tl-none text-white shadow-xl">
            <p className="text-sm leading-relaxed">
              "Hi, I'm <span className="text-purple-300 font-bold">Alex</span>. I saw your ad on Instagram and I'd like a <span className="text-purple-300 font-bold">price list</span> for the bulk package."
            </p>
          </div>
        </div>

        {/* Neural Extraction Funnel (Particles) */}
        <div className="absolute -bottom-10 left-10 flex gap-1">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent animate-[bounce_2s_infinite]"></div>
          <div className="w-1 h-12 bg-gradient-to-b from-fuchsia-500 to-transparent animate-[bounce_2.5s_infinite_0.2s]"></div>
          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-transparent animate-[bounce_1.8s_infinite_0.4s]"></div>
        </div>
      </div>

      {/* --- PHASE 2: THE EXTRACTION CORE --- */}
      <div className="flex flex-col items-center mb-12 relative">
        <div className="w-14 h-14 bg-[#0b031a] border-2 border-purple-500/50 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-[ping_3s_infinite]"></div>
        </div>
        <div className="h-12 w-[2px] bg-gradient-to-b from-purple-500/50 to-transparent"></div>
      </div>

      {/* --- PHASE 3: THE SYNTHESIZED DOSSIER --- */}
      <div className="relative animate-[fadeIn_0.5s_ease-out_0.8s_both]">
        <div className="absolute -top-6 left-0 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2">
           <Database className="w-3 h-3" /> Synthesis Complete
        </div>

        <div className="bg-gradient-to-br from-[#1a0b2e] to-[#05010d] p-6 rounded-[2rem] border border-emerald-500/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden group/card">
          {/* Holographic Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-[scan_4s_linear_infinite] pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg tracking-tight">Alex Rivera</h4>
                <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-widest">Verified Lead</p>
              </div>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 transition-colors group-hover/card:border-emerald-500/20">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Intent</p>
              <p className="text-white text-xs font-bold">Bulk Pricing</p>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 transition-colors group-hover/card:border-emerald-500/20">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Source</p>
              <p className="text-white text-xs font-bold flex items-center gap-1.5">
                <Instagram className="w-3 h-3 text-fuchsia-400" /> Instagram
              </p>
            </div>
          </div>

          <div className="mt-3 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-emerald-500" />
              <span className="text-[11px] text-emerald-100 font-mono">alex.r@agency.com</span>
            </div>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        </section>

        {/* --- 7️⃣ FEATURES GRID --- */}
        <section className="py-16 container mx-auto px-6 ">
          <h2 className="text-4xl lg:text-5xl  font-black text-center mb-12 text-white uppercase tracking-widest drop-shadow-lg">Everything  <span className="text-purple-500">you need.</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Database />, title: "Automatic Lead Capture", desc: "No forms. Leads collected naturally during chat." },
              { icon: <Share2 />, title: "All-In-One Inbox", desc: "WhatsApp, Instagram, Web — managed in one place." },
              { icon: <Clock />, title: "24/7 Availability", desc: "Your business responds instantly, anytime, anywhere." },
              { icon: <Bot />, title: "Smart Follow-Ups", desc: "The bot asks the right questions at the right time." },
              { icon: <BarChart3 />, title: "Lead Insights dashboard", desc: "See what customers ask most and what converts." },
              { icon: <ShieldCheck />, title: "Secure & Private", desc: "Bank-grade encryption. Your data stays private." },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-purple-900/20 hover:border-purple-500/40 transition-all group hover:-translate-y-2 duration-300">
                <div className="text-purple-500 mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{f.icon}</div>
                <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

       {/* --- 8️⃣ USE CASES: BUILT FOR YOUR BUSINESS --- */}
<section className="py-14 lg:py-20 relative z-10 overflow-hidden" id="use-cases">
  <div className="container mx-auto px-6  ">
    
    {/* Section Header */}
    <div className="text-center mb-8 lg:mb-14">
      <h2 className="text-3xl lg:text-5xl  font-black text-white uppercase tracking-tighter mb-4">
        Ready for <span className="text-purple-500">Any Industry.</span>
      </h2>
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs lg:text-sm italic">
        Smart automation that fits your workflow.
      </p>
    </div>

    {/* Responsive Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { 
          type: "Restaurants", 
          use: "Bot sends menus and takes table bookings automatically.",
          icon: <Utensils className="w-8 h-8" />,
          color: "group-hover:text-orange-400"
        },
        { 
          type: "Service Biz", 
          use: "Capture what customers need without manual calls.",
          icon: <Wrench className="w-8 h-8" />,
          color: "group-hover:text-blue-400"
        },
        { 
          type: "Online Brands", 
          use: "Turn Instagram and WhatsApp chats into real sales.",
          icon: <ShoppingBag className="w-8 h-8" />,
          color: "group-hover:text-fuchsia-400"
        },
        { 
          type: "Agencies", 
          use: "Ask clients questions before you even meet them.",
          icon: <Briefcase className="w-8 h-8" />,
          color: "group-hover:text-purple-400"
        }
      ].map((u, i) => (
        <div 
          key={i} 
          className="group relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50 hover:bg-[#0b031a]/80"
        >
          {/* Subtle Icon Glow */}
          <div className={`mb-6 transition-all duration-500 ${u.color} drop-shadow-[0_0_8px_rgba(168,85,247,0)] group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]`}>
            {u.icon}
          </div>

          <h3 className="text-xl lg:text-2xl font-black text-white mb-3 uppercase tracking-tight">
            {u.type}
          </h3>
          
          <p className="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
            {u.use}
          </p>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-6 left-8 right-8 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-purple-500 transition-all duration-700 group-hover:w-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Background glow for the section */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
</section>

  {/* --- 9️⃣ COMPARISON SECTION --- */}
      <section className="py-16 relative w-full">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
   <h2 className="text-4xl lg:text-5xl  font-black text-center mb-12 text-white uppercase tracking-widest drop-shadow-lg">Ready to  <span className="text-purple-500">SHIFT.</span></h2>
            <p className="text-purple-400 font-bold uppercase tracking-[0.3em] text-sm opacity-80">
              Stop struggling. Start automating.
            </p>
          </div>

          <div className="relative  mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-stretch perspective-1000">
              
              {/* LEFT CARD: The Old Way */}
              <div className="lg:transform lg:rotate-y-[10deg] lg:scale-95 lg:origin-right z-10 relative group">
                <div className="bg-[#110524]/60 backdrop-blur-xl border-2 border-red-900/20 p-10 rounded-[2.5rem] relative overflow-hidden h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-10 pointer-events-none"></div>
                  
                  <h3 className="text-2xl font-black mb-10 text-red-500/60 uppercase tracking-widest flex items-center gap-3">
                    <XCircle className="w-8 h-8" /> Manual Chaos
                  </h3>
                  
                  <ul className="space-y-6 relative z-10">
                    {[
                      "Replies take hours (or days)",
                      "Leads lost in messy DMs",
                      "Zero data capture while you sleep",
                      "High human error rate"
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-4 opacity-60 group-hover:opacity-100 transition-opacity">
                        <XCircle className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
                        <span className="text-lg font-medium text-slate-400 leading-tight">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RIGHT CARD: The New Way (MyAutoBot AI) */}
              <div className="lg:transform lg:rotate-y-[-5deg] lg:scale-105 lg:-ml-6 z-20 relative">
                {/* Intense Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-fuchsia-500 blur-xl opacity-30 animate-pulse"></div>
                
                <div className="bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0b031a] backdrop-blur-2xl border-2 border-purple-400/50 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl h-full">
                  
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" /> MyAutoBot
                    </h3>
                    <div className="px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span> Live AI
                    </div>
                  </div>

                  <ul className="space-y-6 relative z-10">
                    {[
                      "Instant <1 second AI replies",
                      "Leads synced to CRM automatically",
                      "Works 24/7/365 without breaks",
                      "Zero leads missed, ever"
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                        <span className="text-xl font-bold text-white leading-tight">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* --- 🔟 TESTIMONIAL --- */}
        <section className="py-12 container mx-auto px-6 text-center  relative ">
           {/* Subtle light leak for testimonial focus */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] bg-purple-500/10 blur-[100px] rounded-full -z-10 mix-blend-screen pointer-events-none"></div>
           
           <div className="flex justify-center gap-2 mb-12">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-10 h-10 fill-purple-500 text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-[pulse_3s_infinite]" style={{animationDelay: `${i*0.2}s`}} />)}
           </div>
           <blockquote className="text-3xl md:text-5xl  font-black max-w-5xl  mx-auto leading-tight italic text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white drop-shadow-xl tracking-tighter">
            “MyAutoBot stopped us from missing WhatsApp leads. We now get customer details automatically without chasing anyone.”
           </blockquote>
           <div className="mt-16">
              <p className="text-white font-black text-2xl uppercase tracking-widest">Sarah Jenkins</p>
              <p className="text-purple-400 font-bold tracking-[0.3em] uppercase text-sm mt-2">Owner, Apex Realty Group</p>
           </div>
        </section>

        {/* --- 1️⃣1️⃣ FAQ SECTION --- */}
        <section className="py-18 container mx-auto px-6 max-w-6xl " id ="faq">
          <h2 className="text-4xl lg:text-5xl  font-black text-center mb-12 text-white uppercase tracking-widest drop-shadow-lg">Intel Briefing</h2>
          <div className="space-y-6">
            {[
              { q: "Is it hard to set up?", a: "No. We handle the setup. You give us your info, we train the bot." },
              { q: "Does it work on WhatsApp?", a: "Yes, WhatsApp is fully supported via official APIs." },
              { q: "Can I see and export leads?", a: "Yes. All leads are accessible in your dashboard and exportable to CSV." },
              { q: "Is customer data safe?", a: "Yes. Data is encrypted with enterprise-grade security. Your leads are yours." },
              { q: "Can I cancel anytime?", a: "Yes. No long-term contracts. Pause or cancel whenever." }
            ].map((item, i) => (
              <div key={i} className={`border rounded-[2rem] overflow-hidden transition-all duration-300 backdrop-blur-md ${activeFaq === i ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/10 hover:border-purple-500/30 hover:bg-white/10'}`}>
                <button onClick={() => toggleFaq(i)} className="w-full p-8 text-left flex justify-between items-center group cursor-pointer">
                  <span className={`font-black text-xl uppercase tracking-tight transition-colors ${activeFaq === i ? 'text-purple-300' : 'text-white group-hover:text-purple-300'}`}>{item.q}</span>
                  {activeFaq === i ? <ChevronUp className="text-purple-400 w-8 h-8 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" /> : <ChevronDown className="text-slate-500 w-8 h-8 group-hover:text-purple-400" />}
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="px-8 pb-8 text-slate-300 font-medium text-lg leading-relaxed border-t border-white/5 pt-6">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
{/* --- 1️⃣2️⃣ REDESIGNED FINAL CTA --- */}
{/* --- 12. FINAL CTA: THE POWER-CARD --- */}
<section className="py-20 lg:py-16 relative z-20">
  <div className="container mx-auto px-6">
    {/* Inner Card - Max-width keeps it from being "too big" on huge monitors */}
    <div className=" mx-auto relative group">
      
      {/* 1. Behind-the-Card Glow (Does not cause scroll) */}
      <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      {/* 2. The Main Card Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] border border-white/10 bg-[#0b031a]/60 backdrop-blur-2xl p-8 md:p-16 lg:p-24 shadow-2xl">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        {/* Content Stack */}
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <Sparkles className="w-4 h-4" /> Ready for Deployment
          </div>

          {/* Headline - Responsive Font Sizes */}
          <h2 className="text-3xl md:text-5xl lg:text-5xl  font-black text-white leading-[1.1] uppercase tracking-tighter mb-6">
            EVERY CHAT IS A <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
              SALES OPPORTUNITY.
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-sm md:text-lg lg:text-xl text-slate-400 max-w-2xl mb-12 font-medium">
            Stop losing leads to slow response times. Let <span className="text-white">myAutoBot</span> handle your conversations 24/7.
          </p>

          {/* Responsive Button - Tighter Sizing */}
          <div className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-lg lg:text-xl uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center gap-3 active:scale-95 group/btn">
              Start Free Trial 
              <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Compact Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 lg:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all">
            {['Free setup', '7-day trial', 'No credit card'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-white uppercase tracking-widest">
                <CheckCircle className="w-4 h-4 text-purple-500" /> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Corner Brackets */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-purple-500/20 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-purple-500/20 rounded-br-xl pointer-events-none"></div>
      </div>
    </div>
  </div>
</section>

        
      </div>

      {/* Global CSS needed for some animations */}
      <style jsx>{`
        .typing-demo { animation: typing 3s steps(25), blink .5s step-end infinite alternate; }
        @keyframes typing { from { width: 0 } }
        @keyframes blink { 50% { border-color: transparent } }
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          10% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(-350%); opacity: 1; }
          100% { transform: translateY(-400%); opacity: 0; }
        }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
      `}</style>
    </div>
  );
};

export default LandingPage;