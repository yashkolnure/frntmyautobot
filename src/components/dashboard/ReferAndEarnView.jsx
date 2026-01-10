import React, { useState, useEffect, useCallback } from 'react';
import { 
  Gift, Copy, Share2, Users, Coins, CheckCircle, 
  Send, Twitter, MessageCircle, ExternalLink, Zap, Loader2, RefreshCw,
  Trophy, ArrowUpRight, Network
} from 'lucide-react';
import axios from 'axios';

const ReferAndEarnView = ({ user }) => {
  const [copyStatus, setCopyStatus] = useState({ link: false, code: false });
  const [activeCode, setActiveCode] = useState("");
  const [liveStats, setLiveStats] = useState({ tokens: 0, count: 0 });
  const [isSyncing, setIsSyncing] = useState(true);

  const currentUserId = user?._id || user?.user || localStorage.getItem('userId');
  const API_BASE = ""; 

  const fetchLiveStats = useCallback(async () => {
    if (!currentUserId) return;
    setIsSyncing(true);
    try {
      const res = await axios.get(`${API_BASE}/api/auth/user-profile/${currentUserId}`);
      if (res.data) {
        setLiveStats({
          tokens: res.data.tokens || 0,
          count: res.data.referralCount || 0
        });
        if (res.data.referralCode) setActiveCode(res.data.referralCode);
      }
    } catch (err) {
      console.error("❌ Live Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [currentUserId]);

  useEffect(() => { fetchLiveStats(); }, [fetchLiveStats]);

  useEffect(() => {
    const generateAndSync = async () => {
      if (currentUserId && !activeCode && !isSyncing) {
        const generatedCode = currentUserId.toString().slice(-6).toUpperCase();
        setActiveCode(generatedCode);
        try {
          await axios.patch(`${API_BASE}/api/auth/update-referral`, {
            userId: currentUserId,
            referralCode: generatedCode
          });
        } catch (err) { console.error("❌ DB Update failed"); }
      }
    };
    generateAndSync();
  }, [currentUserId, activeCode, isSyncing]);

  const referralLink = `https://myautobot.in/login?ref=${activeCode || 'SYNCING'}`;

  const copyToClipboard = (text, type) => {
    if (!activeCode) return;
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [type]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
  };

  return (
    <div className="space-y-8 mx-auto pb-10 ">
      
      {/* --- SECTION 1: DYNAMIC HERO --- */}
      <div className="relative group overflow-hidden rounded-[3rem] bg-[#0b031a] border border-white/10 p-1 md:p-1.5 shadow-2xl transition-all hover:border-purple-500/30">
        <div className="relative z-10 bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-[2.8rem] p-4 md:p-8 overflow-hidden">
          
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                <Zap size={14} className={`text-purple-400 ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                  {isSyncing ? "Synchronizing Data..." : "Propagation Protocol Active"}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                Expand the 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400"> Network.</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed font-medium">
                For every operator who joins the MyAutoBot neural link via your invitation, <span className="text-white font-bold">50 Bonus Tokens</span> are granted to both nodes instantly.
              </p>
              <div className="flex items-center gap-6">
                <button onClick={fetchLiveStats} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-purple-400 hover:text-white transition-all group">
                  <RefreshCw size={14} className={`group-hover:rotate-180 transition-transform duration-500 ${isSyncing ? 'animate-spin' : ''}`} /> Update Stats
                </button>
              </div>
            </div>

            {/* Floating Visual Badge */}
            <div className="relative hidden lg:block pr-10">
              <div className="absolute inset-0 bg-purple-500/20 blur-[60px] animate-pulse rounded-full"></div>
              <div className="relative w-48 h-48 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[3rem] flex flex-col items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                 <Trophy size={60} className="text-purple-400 mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                 <span className="text-white font-black text-2xl tracking-tighter italic">LEGACY</span>
                 <span className="text-purple-500 text-[10px] font-black tracking-widest uppercase">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: COMMAND CARDS --- */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* INVITE CARD */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-10 backdrop-blur-2xl relative overflow-hidden group hover:border-purple-500/20 transition-all">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Network size={180} />
          </div>
          
          <h4 className="text-white font-black uppercase text-xs tracking-widest mb-10 flex items-center gap-3">
            <Share2 size={18} className="text-purple-400" /> Invitation Management
          </h4>
          
          <div className="space-y-10 relative z-10">
            {/* LINK BOX */}
            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Neural Link</label>
                <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest">Global Protocol</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 p-3 bg-black/60 border border-white/5 rounded-3xl group/box hover:border-white/10 transition-all">
                <div className="flex-1 px-4 py-3 font-mono text-sm text-purple-200 truncate select-all">
                  {referralLink}
                </div>
                <button onClick={() => copyToClipboard(referralLink, 'link')} className={`px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${copyStatus.link ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'}`}>
                  {copyStatus.link ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copyStatus.link ? 'Verified' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* CODE BOX */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Manual Access Code</label>
              <div className="flex flex-col sm:flex-row gap-3 p-3 bg-black/60 border border-white/5 rounded-3xl group/box hover:border-white/10 transition-all">
                <div className="flex-1 px-4 py-3 font-mono text-3xl font-black tracking-[0.4em] text-white">
                  {activeCode || "SYNCING"}
                </div>
                <button onClick={() => copyToClipboard(activeCode, 'code')} className={`px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${copyStatus.code ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                  {copyStatus.code ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copyStatus.code ? 'Verified' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
               <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Deploy your AI Agent on MyAutoBot! Use my code ' + activeCode + ' for 50 bonus tokens: ' + referralLink)}`)} className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl">
                  <MessageCircle size={22} /> WhatsApp Broadcast
               </button>
               <button onClick={() => window.open(`https://t.me/share/url?url=${referralLink}`)} className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                  <Send size={22} /> Telegram Link
               </button>
            </div>
          </div>
        </div>

        {/* STATUS HUB CARD */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-[#1a0b2e] to-[#05010d] border border-purple-500/30 rounded-[3rem] p-10 text-center h-full flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-fuchsia-500/30 blur-[40px] animate-pulse rounded-full"></div>
              <div className="relative w-24 h-24 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Coins size={44} className="text-white" />
              </div>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-2">Total Tokens Accrued</p>
            <h3 className="text-7xl font-black text-white tracking-tighter italic mb-8 drop-shadow-2xl">
              {liveStats.count * 50}
            </h3>
            
            <div className="w-full space-y-6 bg-black/40 p-6 rounded-3xl border border-white/5">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Invite Count</span>
                 <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                   <Users size={12} /> {liveStats.count}
                 </div>
               </div>
               
               <div className="space-y-2">
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${Math.min(liveStats.count * 10, 100)}%` }}></div>
                 </div>
                 <div className="flex justify-between text-[8px] font-black uppercase text-slate-600 tracking-widest">
                   <span>Rank: Initiate</span>
                   <span>Next Bonus: {((Math.floor(liveStats.count / 10) + 1) * 10)}</span>
                 </div>
               </div>

               <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Yield Rate</span>
                 <span className="text-white font-black text-xs uppercase">+50 / NODE</span>
               </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-fuchsia-500 font-black text-[10px] uppercase tracking-widest">
              <ArrowUpRight size={14} /> Propagation Level 1
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReferAndEarnView;