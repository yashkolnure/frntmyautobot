import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ─── DESIGN TOKENS (shared with LandingPage) ─────────────────────────
const T = {
  bg0:'#03020a', bg1:'#070512', bg2:'#0d0b1e', bg3:'#13102b',
  border:'rgba(99,102,241,0.18)', borderH:'rgba(99,102,241,0.45)',
  purple:'#7c3aed', purpleL:'#a78bfa', blue:'#3b82f6',
  t1:'#f1f5f9', t2:'#94a3b8', t3:'#475569',
  green:'#22c55e',
  font:"'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

// ─── INLINE SVG ICONS ────────────────────────────────────────────────
const Ico = ({ d, size = 20, stroke = 'currentColor', fill = 'none', sw = 1.8, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);
const IcoArrow = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7" />;
const IcoMenu  = p => <Ico {...p} d="M4 6h16M4 12h16M4 18h16" />;
const IcoX     = p => <Ico {...p} d="M18 6L6 18M6 6l12 12" />;

const Header = () => {
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovLogin,         setHovLogin]         = useState(false);
  const [hovCta,           setHovCta]           = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Features',     href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Use Cases',    href: '/use-cases' },
    { name: 'FAQ',          href: '/faq' },
    { name: 'Pricing',      href: '/pricing' },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path));

  const navBg     = isScrolled ? 'rgba(7,5,18,0.88)' : 'transparent';
  const navBorder = isScrolled ? T.border            : 'transparent';
  const navBlur   = isScrolled ? 'blur(20px)'        : 'none';
  const navShadow = isScrolled ? '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.14)' : 'none';
  const navPadY   = isScrolled ? '8px 28px'          : '0 24px';
  const navRadius = isScrolled ? 24                  : 0;
  const navMaxW   = isScrolled ? 1120                : '100%';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
        .nav-link-pill { transition: color .2s, background .2s; }
        .nav-link-pill:hover { color: ${T.t1} !important; background: rgba(99,102,241,0.08) !important; }
        .mobile-nav-item { transition: background .2s, color .2s; }
        .mobile-nav-item:hover { background: rgba(99,102,241,0.12) !important; color: ${T.t1} !important; }
        @keyframes mobileSlideIn {
          from { opacity:0; transform:translateY(-12px) scale(.97); }
          to   { opacity:1; transform:translateY(0)     scale(1); }
        }
        @keyframes pl { 0%,100%{opacity:1}50%{opacity:.4} }
      `}</style>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: isScrolled ? '12px 20px' : '0',
        transition: 'padding .4s ease',
        fontFamily: T.font,
      }}>

        {/* ── INNER CONTAINER ── */}
        <div style={{
          maxWidth: navMaxW,
          margin: '0 auto',
          background: navBg,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          border: `1px solid ${navBorder}`,
          borderRadius: navRadius,
          boxShadow: navShadow,
          padding: navPadY,
          transition: 'all .45s cubic-bezier(.4,0,.2,1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: isScrolled ? 60 : 72,
        }}>

          {/* ── LOGO ── */}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', flexShrink: 0,
          }}>
            {/* image icon — replaces the old gradient badge */}
            <img
              src="https://avenirya.com/wp-content/uploads/2026/03/image-removebg-preview-1.png"
              alt=""
              style={{
                height: isScrolled ? 34 : 38,
                width: 'auto',
                objectFit: 'contain',
                transition: 'height .4s ease',
                display: 'block',
                flexShrink: 0,
              }}
            />
            {/* wordmark — unchanged */}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{
                fontWeight: 900, fontSize: 18, letterSpacing: -.5,
                color: T.t1,
              }}>
                MyAuto<span style={{
                  backgroundImage: 'linear-gradient(135deg,#818cf8,#a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Bot</span>
              </span>
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: '0.35em',
                textTransform: 'uppercase', color: T.t3, marginTop: 2,
              }}>Systems</span>
            </div>
          </Link>

          {/* ── DESKTOP NAV PILL ── */}
          <nav style={{
            display: 'flex', alignItems: 'center', gap: 2,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${T.border}`,
            borderRadius: 14, padding: '4px',
            backdropFilter: 'blur(10px)',
          }} className="desktop-nav">
            {navLinks.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="nav-link-pill"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 13, fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    fontFamily: T.font,
                    color: active ? T.purpleL : T.t3,
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                    border: active ? `1px solid rgba(99,102,241,0.28)` : '1px solid transparent',
                    transition: 'all .2s',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ── ACTION BUTTONS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Login */}
            <Link
              to="/login"
              onMouseEnter={() => setHovLogin(true)}
              onMouseLeave={() => setHovLogin(false)}
              style={{
                padding: '9px 20px',
                borderRadius: 10,
                fontSize: 13, fontWeight: 600,
                fontFamily: T.font,
                textDecoration: 'none',
                color: T.t2,
                background: hovLogin ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${hovLogin ? T.borderH : T.border}`,
                transition: 'all .2s',
                display: 'inline-block',
              }}
            >
              Log in
            </Link>

            {/* Get Started */}
            <Link
              to="/login?id=register"
              onMouseEnter={() => setHovCta(true)}
              onMouseLeave={() => setHovCta(false)}
              className="cta-desktop-only"
              style={{
                padding: '9px 20px',
                borderRadius: 10,
                fontSize: 13, fontWeight: 700,
                fontFamily: T.font,
                textDecoration: 'none',
                color: 'white',
                background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                border: '1px solid transparent',
                boxShadow: hovCta
                  ? '0 6px 22px rgba(79,70,229,0.6)'
                  : '0 4px 14px rgba(79,70,229,0.38)',
                transform: hovCta ? 'translateY(-1px)' : 'translateY(0)',
                transition: 'all .2s',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              Get Started Free
              <IcoArrow size={14} stroke="rgba(255,255,255,0.8)" sw={2.2}/>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(v => !v)}
              aria-label="Toggle Menu"
              style={{
                display: 'none',
                padding: '9px', borderRadius: 10,
                background: isMobileMenuOpen
                  ? 'rgba(99,102,241,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isMobileMenuOpen ? T.borderH : T.border}`,
                color: isMobileMenuOpen ? T.purpleL : T.t2,
                cursor: 'pointer',
                transition: 'all .2s',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: T.font,
              }}
              className="hamburger-btn"
            >
              {isMobileMenuOpen
                ? <IcoX   size={18} stroke="currentColor" sw={2}/>
                : <IcoMenu size={18} stroke="currentColor" sw={2}/>
              }
            </button>
          </div>
        </div>

        {/* ── MOBILE DROPDOWN ── */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)',
            left: 16, right: 16,
            background: T.bg2,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${T.borderH}`,
            borderRadius: 20,
            padding: '16px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)',
            animation: 'mobileSlideIn .3s cubic-bezier(.34,1.56,.64,1)',
            fontFamily: T.font,
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.35em',
              textTransform: 'uppercase', color: T.t3,
              padding: '4px 12px 12px',
            }}>Navigation</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(link => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="mobile-nav-item"
                    style={{
                      padding: '13px 16px',
                      borderRadius: 12,
                      fontSize: 14, fontWeight: 600,
                      fontFamily: T.font,
                      textDecoration: 'none',
                      color: active ? T.purpleL : T.t1,
                      background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? T.borderH : T.border}`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {link.name}
                    {active && (
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: T.purpleL,
                        boxShadow: `0 0 8px ${T.purpleL}`,
                        animation: 'pl 2s infinite',
                      }}/>
                    )}
                  </Link>
                );
              })}
            </div>

            <div style={{
              height: 1,
              background: `linear-gradient(90deg,transparent,${T.border},transparent)`,
              margin: '12px 0',
            }}/>

            <Link
              to="/signup"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 14,
                fontSize: 14, fontWeight: 700,
                fontFamily: T.font,
                textDecoration: 'none',
                color: 'white',
                background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                boxShadow: '0 4px 18px rgba(79,70,229,0.45)',
              }}
            >
              Get Started Free
              <IcoArrow size={15} stroke="rgba(255,255,255,0.85)" sw={2.2}/>
            </Link>

            <Link
              to="/login"
              style={{
                display: 'block', textAlign: 'center',
                padding: '12px', marginTop: 8,
                borderRadius: 12,
                fontSize: 13, fontWeight: 600,
                fontFamily: T.font,
                textDecoration: 'none',
                color: T.t3,
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${T.border}`,
              }}
            >
              Already have an account? Log in
            </Link>
          </div>
        )}

        <style>{`
          .desktop-nav      { display:flex !important; }
          .hamburger-btn    { display:none !important; }
          .cta-desktop-only { display:flex !important; }
          @media(max-width:768px){
            .desktop-nav      { display:none !important; }
            .hamburger-btn    { display:flex !important; }
            .cta-desktop-only { display:none !important; }
          }
        `}</style>
      </header>
    </>
  );
};

export default Header;