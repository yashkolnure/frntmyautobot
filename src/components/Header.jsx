import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X, ArrowRight } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated NavLinks: Pricing is a route (/pricing), others are hashes (#)
  const navLinks = [
    { name: 'Features', href: '#features', isRoute: false },
    { name: 'How it Works', href: '#how-it-works', isRoute: false },
    { name: 'Pricing', href: '/pricing', isRoute: true }, // Added Pricing
    { name: 'Use Cases', href: '#use-cases', isRoute: false },
    { name: 'FAQ', href: '#faq', isRoute: false },
  ];

  const getLinkHref = (href) => {
    return isHomePage ? href : `/${href}`;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-4 py-4 lg:py-6 transition-all duration-500">
      <div 
        className={`container mx-auto transition-all duration-500 rounded-2xl lg:rounded-[2.5rem] border ${
          isScrolled 
            ? 'max-w-6xl bg-[#05010d]/70 backdrop-blur-xl border-white/10 shadow-2xl py-2 px-4 lg:px-8' 
            : ' bg-transparent border-transparent py-0 px-2'
        }`}
      >
        <div className="flex items-center justify-between h-14 lg:h-16">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
            <div className="relative bg-[#0b031a] p-2 rounded-xl border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Bot className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
            </div>
            <span className="font-black text-2xl uppercase lg:text-xl tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
              MyAutoBot.in
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full border border-white/10 p-1 backdrop-blur-md">
            {navLinks.map((link) => (
              link.isRoute ? (
                /* Use Link for /pricing */
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-5 py-2 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all rounded-full hover:bg-white/10 ${
                    location.pathname === link.href ? 'text-purple-400 bg-white/5' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                /* Use <a> for #hashes */
                <a
                  key={link.name}
                  href={getLinkHref(link.href)}
                  className="px-2 py-2 text-[10px] lg:text-xs font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-all rounded-full hover:bg-white/10"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex items-center gap-2 lg:gap-4">
         
            
            <Link 
              to="/login"
              className="relative group overflow-hidden px-5 py-2.5 bg-purple-600 text-white rounded-xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
            >
              <span className="relative z-10 italic">Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </Link>

            <button 
              className="md:hidden p-2 text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div 
        className={`fixed inset-x-4 top-24 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}
      >
        <nav className="bg-[#0b031a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-3">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-4 border border-white/5 rounded-2xl text-center text-sm font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.href ? 'bg-purple-600 text-white' : 'bg-white/5 text-white'
                }`}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={getLinkHref(link.href)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-center text-sm font-black text-white uppercase tracking-widest hover:bg-purple-600 transition-all"
              >
                {link.name}
              </a>
            )
          ))}
          <div className="h-px bg-white/10 my-2"></div>
          <Link 
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl text-center font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-900/40"
          >
            Login / Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;