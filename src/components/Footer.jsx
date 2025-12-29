import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, Instagram, Facebook, Linkedin, Twitter, 
  ShieldCheck, Globe, Zap, Server, MapPin
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // --- DYNAMIC DEPLOYMENT STATES ---
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [lastPing, setLastPing] = useState(new Date().toLocaleTimeString());
  
  // Simulated node details
  const nodeDetails = {
    id: "SRV-1208",
    location: "Mumbai, IN",
    provider: "MyAutoBot Edge"
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate heartbeat
      setIsSystemOnline(Math.random() > 0.02);
      setLastPing(new Date().toLocaleTimeString());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Process', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' }
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' }
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'API Docs', href: '/docs' }
    ],
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05010d] backdrop-blur-xl pt-20 pb-10 overflow-hidden font-sans">
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* --- BRAND COLUMN --- */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="bg-[#0b031a] p-2 rounded-xl border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                myAutoBot <span className="text-purple-500">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs font-medium">
              The smartest AI engine for lead extraction. We help you turn WhatsApp and Instagram chats into real business growth.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* --- LINKS COLUMNS --- */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center gap-2">
                  <div className="w-1 h-3 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                  {title}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-slate-500 hover:text-purple-400 text-xs font-bold transition-colors uppercase tracking-widest block">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* --- DYNAMIC DEPLOYMENT STATUS CARD --- */}
          <div className="lg:col-span-3">
            <div className={`bg-white/5 border ${isSystemOnline ? 'border-white/10' : 'border-red-500/30'} p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group transition-all duration-700`}>
              <div className={`absolute -top-4 -right-4 p-6 ${isSystemOnline ? 'bg-purple-600/10' : 'bg-red-600/10'} rounded-full blur-2xl transition-all`}></div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isSystemOnline ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]' : 'bg-red-500 animate-ping shadow-[0_0_8px_rgba(239,68,68,1)]'}`}></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    {isSystemOnline ? 'Neural Link Active' : 'Uplink Failed'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Last Ping</span>
                  <span className="text-[8px] font-mono text-purple-400 leading-none">{lastPing}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Server className={`w-4 h-4 ${isSystemOnline ? 'text-purple-400' : 'text-slate-600'} shrink-0`} />
                  <div>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active Node</p>
                    <p className="text-[11px] text-white font-bold tracking-tight">{nodeDetails.id} <span className="text-slate-500 text-[10px] font-medium">— {nodeDetails.provider}</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Server Location</p>
                    <p className="text-[11px] text-white font-bold tracking-tight">{nodeDetails.location}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                   <Zap size={10} className="text-emerald-500" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Latency: 24ms</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic underline underline-offset-4 cursor-pointer hover:text-white transition-colors">Details</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
              © {currentYear} myAutoBot Systems
            </p>
            <p className="text-slate-700 text-[9px] font-bold uppercase tracking-widest">
              Avenirya Solutions OPC Pvt Ltd by Yash Kolnure
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500/50" />
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Ver: 2.0.45</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;