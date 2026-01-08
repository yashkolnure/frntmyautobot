import React from 'react';
import { 
  Bot, MessageSquare, Settings, LogOut, 
  Share2, Users, Terminal, Coins, Zap , Key
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, userTokens = 0 }) {
  return (
    <aside className="h-full w-full bg-black/60 lg:bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col p-4 lg:p-4 overflow-y-auto custom-scrollbar relative">

      {/* 🤖 BRANDING */}
      <div className="flex items-center gap-3 mb-6 mt-4 lg:mb-8 px-2 group cursor-pointer"  onClick={() => setActiveTab('training')}>
        <div className="bg-purple-600 p-2 rounded-xl text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-500">
          <Bot size={22} />
        </div>
        <span className="font-black text-xl lg:text-xl tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
          MyAutoBot.in
        </span>
      </div>
      
      {/* 🔗 NAVIGATION LINKS */}
      <nav className="flex-1 space-y-1 lg:space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2 px-2">Core Control</p>
        
        <SidebarItem 
          icon={<Terminal size={20}/>} 
          label="AI Training" 
          active={activeTab === 'training'} 
          onClick={() => setActiveTab('training')}
        />

        <SidebarItem 
          icon={<Share2 size={20}/>} 
          label="Deployment" 
          active={activeTab === 'deployment'}
          onClick={() => setActiveTab('deployment')}
        />

        
        <SidebarItem 
          icon={<Users size={20}/>} 
          label="Leads Monitor" 
          active={activeTab === 'leads'} 
          onClick={() => setActiveTab('leads')}
        />
        <SidebarItem 
          icon={<MessageSquare size={20}/>} 
          label="Chat History" 
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        />


        <SidebarItem 
          icon={<Settings size={20}/>} 
          label="Socials (BETA)" 
          active={activeTab === 'integrations'}
          onClick={() => setActiveTab('integrations')}
        />

        <SidebarItem 
          icon={<Key size={20}/>} 
          label="API Keys" 
          active={activeTab === 'apikeys'}
          onClick={() => setActiveTab('apikeys')}
        />
        {/* --- NEW: NEURAL CREDITS LINK --- */}
        <SidebarItem 
          icon={<Coins size={20}/>} 
          label="Credits Refill" 
          active={activeTab === 'purchase'}
          onClick={() => setActiveTab('purchase')}
        />
      </nav>

      {/* 👤 SYSTEM STATUS / LOGOUT */}
      <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
        
        {/* --- NEW: LIVE CREDIT HUD --- */}
        <div 
          onClick={() => setActiveTab('purchase')}
          className="mx-2 p-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Neural Balance</span>
            <Zap size={12} className="text-purple-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white italic tabular-nums">{userTokens}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Credits</span>
          </div>
          <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div 
              className="h-full bg-purple-600 transition-all duration-1000" 
              style={{ width: `${Math.min((userTokens / 500) * 100, 100)}%` }} 
             />
          </div>
        </div>

        <div className="px-4 hidden sm:block">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Node: SRV-1208</span>
            </div>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">AES-256 Protected Session</p>
        </div>
        
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-3 text-slate-500 hover:text-red-400 transition-all p-4 rounded-2xl hover:bg-red-500/5 group font-black text-[10px] lg:text-xs uppercase tracking-widest"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out System
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-600/10 to-transparent pointer-events-none -z-10" />
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.1); border-radius: 10px; }
      `}</style>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`relative group flex items-center gap-3 p-3.5 lg:p-3 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
        active 
          ? 'bg-purple-600 text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.5)] scale-[1.02]' 
          : 'text-slate-200 hover:text-slate-100 hover:bg-white/5'
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full shadow-[0_0_10px_white]" />
      )}
      
      <span className={`${active ? 'text-white' : 'text-purple-500/50 group-hover:text-purple-400'} transition-colors`}>
        {icon}
      </span>

      <span className={`text-[11px] lg:text-s font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {label}
      </span>

      {!active && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
      )}
    </div>
  );
}