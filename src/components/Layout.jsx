import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// --- THE AMBIENT BACKGROUND COMPONENT (From Landing Page) ---
const FullPageAmbientGlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-purple-800/30 blur-[150px] mix-blend-screen animate-[pulse_10s_infinite]"></div>
    <div className="absolute top-[30%] right-[-20%] w-[60vw] h-[60vh] rounded-full bg-fuchsia-800/20 blur-[180px] mix-blend-screen animate-[pulse_15s_infinite]"></div>
    <div className="absolute bottom-[10%] left-[-15%] w-[50vw] h-[50vh] rounded-full bg-indigo-900/30 blur-[160px] mix-blend-screen"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[60vh] rounded-full bg-violet-800/20 blur-[200px] mix-blend-screen"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.05),transparent_70%)]"></div>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
  </div>
);

export default function Layout({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPublicChat = location.pathname.startsWith('/chat/');
  const isKnowledgeBase = location.pathname === '/ykolnure';
  const iswhatsapp = location.pathname === '/whatsapp';

  // Route Protection logic (UNTOUCHED)
  if (isDashboard && !token) {
    return <Navigate to="/login" />;
  }

  // Dashboard & Public Chat Theme
  if (isDashboard || isPublicChat || isKnowledgeBase || iswhatsapp) {
    return (
      <div className="min-h-screen bg-[#05010d] text-slate-200 selection:bg-purple-500/90 relative overflow-x-hidden">
        {/* Ambient Glow layer */}
        <FullPageAmbientGlow />
        
        {/* Content Layer */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </div>
    );
  }

  // Standard Site Theme (Home, About, Login, etc.)
  return (
    <div className="min-h-screen bg-[#05010d] text-slate-200 flex flex-col relative overflow-x-hidden">
      <FullPageAmbientGlow />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}