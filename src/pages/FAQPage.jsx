import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, Bot, ShieldCheck, Zap, ArrowRight,
  HelpCircle, MessageSquare, Database, Rocket,
  Activity, Lock, Globe
} from 'lucide-react';

const FaqItem = ({ question, answer, isOpen, toggle }) => (
  <div className={`border rounded-[2rem] overflow-hidden transition-all duration-300 backdrop-blur-md mb-4 ${
    isOpen 
      ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]' 
      : 'bg-white/5 border-white/10 hover:border-purple-500/30 hover:bg-white/10'
  }`}>
    <button 
      onClick={toggle} 
      className="w-full p-6 lg:p-8 text-left flex justify-between items-center group cursor-pointer"
    >
      <span className={`font-black text-lg lg:text-xl uppercase tracking-tight transition-colors ${
        isOpen ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
      }`}>
        {question}
      </span>
      {isOpen 
        ? <ChevronUp className="text-purple-400 w-6 h-6 shrink-0" /> 
        : <ChevronDown className="text-slate-500 w-6 h-6 shrink-0 group-hover:text-purple-400" />
      }
    </button>
    <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
    }`}>
      <div className="overflow-hidden">
        <div className="px-8 pb-8 text-slate-300 font-medium text-lg leading-relaxed border-t border-white/5 pt-6">
          {answer}
        </div>
      </div>
    </div>
  </div>
);

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What exactly is MyAutoBot.in?",
      a: "MyAutoBot.in is an AI Agent platform developed by Avenirya Solutions that allows businesses to build, train, and deploy intelligent chatbots across WhatsApp, Instagram, and websites to automate lead generation. We are an Official Meta Tech Provider."
    },
    {
      q: "How does the training process work?",
      a: "You provide the knowledge—PDFs, website URLs, or custom text instructions. Our system ingests this data into a private knowledge base, creating an AI agent that understands your specific business logic and tone."
    },
    {
      q: "Is my customer data secure?",
      a: "Absolutely. We utilize self-hosted LLM nodes on secure GPU-enabled VPS servers. Your data is isolated and encrypted, ensuring that your 'Knowledge Sync' remains private to your instance only."
    },
    {
      q: "How do I deploy it to my website?",
      a: "Once trained, the platform generates a custom chat link and a lightweight script. You simply copy and paste this script into your website's header or body to have a live AI assistant ready for visitors."
    },
    {
      q: "How does the Token system work?",
      a: "We operate on a transparent tokenomics model where every AI-generated response consumes exactly 5 tokens from your balance. There are no hidden fees—you only pay for the interactions your bot handles."
    },
    {
      q: "Can I connect it to Instagram and WhatsApp?",
      a: "Yes. As a Meta Tech Provider, we offer direct integration with official WhatsApp and Instagram Business APIs. This ensures high deliverability and protects your accounts from being banned."
    },
    {
      q: "Can I use it for my own apps or n8n?",
      a: "Yes. You can generate custom API keys within the dashboard to integrate your AI agent into external web apps or n8n automation workflows for deeper business logic."
    },
    {
      q: "What is Avenirya Solutions' role?",
      a: "Avenirya Solutions OPC Pvt Ltd is the parent company and official developer of the MyAutoBot ecosystem. We provide the infrastructure and technical support for all deployed AI nodes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 lg:pt-40 pb-24 relative overflow-hidden">
      
      {/* --- AMBIENT GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vh] bg-purple-900/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            <HelpCircle size={14} className="text-purple-500" /> Information Terminal
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-8">
            Intel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
              Briefing.
            </span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about deploying your AI agents with Avenirya's official infrastructure.
          </p>
        </div>

        {/* --- FAQ ACCORDION --- */}
        <div className="mb-32">
          {faqs.map((faq, idx) => (
            <FaqItem 
              key={idx}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === idx}
              toggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>

        {/* --- QUICK LINKS / STATS --- */}
        <div className="grid md:grid-cols-3 gap-6 mb-32 text-center">
          {[
            { icon: ShieldCheck, label: "Meta Partner", val: "Official Provider" },
            { icon: Zap, label: "Billing Logic", val: "5 TKN / Reply" },
            { icon: Globe, label: "Uptime", val: "99.98% Active" }
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
              <stat.icon className="mx-auto mb-4 text-purple-500" size={32} />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-white font-black uppercase italic">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* --- SUPPORT CTA --- */}
        <section className="relative p-12 lg:p-20 rounded-[4rem] bg-gradient-to-br from-[#0b031a] to-black border border-white/10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
          <h2 className="text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tighter mb-8 relative z-10">
            Still Have <span className="text-purple-500">Unanswered</span> Questions?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link to="/login" className="px-12 py-5 bg-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all hover:bg-purple-500 flex items-center gap-2 italic">
              Deploy Now <ArrowRight size={18} />
            </Link>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Email: support@myautobot.in
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default FAQPage;