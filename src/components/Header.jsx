import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X, ArrowRight } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll Listener for the "Floating Island" effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Updated NavLinks: Using absolute hash paths ensures they work from any page
  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Use Cases', href: '/use-cases' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Pricing', href: '/pricing', isRoute: true },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname + location.hash;
    return currentPath === path || (path === '/' && currentPath === '');
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out px-4 ${
      isScrolled ? 'py-4' : 'py-6 lg:py-8'
    }`}>
      <div 
        className={`container mx-auto transition-all duration-500 rounded-[2rem] lg:rounded-[2.5rem] border ${
          isScrolled 
            ? 'max-w-6xl bg-[#05010d]/80 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 px-6 lg:px-10' 
            : 'max-w-8xl bg-transparent border-transparent py-0 px-4'
        }`}
      >
        <div className="flex items-center justify-between h-14 lg:h-16 gap-4 w-full">
          
          {/* --- LOGO SECTION --- */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative bg-[#0b031a] p-2 rounded-xl border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:border-purple-400 transition-colors">
              <Bot className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl lg:text-2xl tracking-tighter italic text-white uppercase">
                MyAuto<span className="text-purple-400">Bot</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Systems</span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 lg:px-6 py-2.5 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all rounded-xl italic whitespace-nowrap ${
                  isActive(link.href)
                    ? 'text-purple-400 bg-white/5' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link 
              to="/login"
              className="px-6 lg:px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl italic flex items-center gap-2 group/btn"
            >
              Login
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform hidden lg:block" />
            </Link>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`fixed inset-x-4 top-24 md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}
      >
        <nav className="bg-[#0b031a]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">Navigation</p>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-black uppercase tracking-widest italic transition-all ${
                isActive(link.href) ? 'bg-purple-600 text-white' : 'bg-white/5 text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2"></div>
          <Link 
            to="/login"
            className="w-full py-5 bg-white text-black rounded-2xl text-center font-black text-sm uppercase tracking-widest italic shadow-lg"
          >
            System Access
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;