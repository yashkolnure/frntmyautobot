import React, { useEffect, useState } from 'react';
import { MessageCircle, Clock, ChevronRight, User, X, Sparkles, Activity, Terminal } from 'lucide-react';
import { getHistory } from '../../api'; 

export default function HistoryView() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getHistory(); 
        setConversations(data);
      } catch (err) { 
        console.error("Failed to fetch history:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-purple-400 animate-pulse">
      <Activity className="animate-spin mb-4" size={32} />
      <p className="text-xs font-black uppercase tracking-[0.3em]">Retrieving Encrypted Logs...</p>
    </div>
  );

  return (
    <div className="col-span-2 space-y-6  relative">
      
      {/* SECTION HEADER */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
            <Terminal size={18} className="text-purple-500" />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">Interaction Stream</h2>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-300 px-4 py-2 rounded-full border border-purple-500/30 backdrop-blur-md">
          {conversations.length} Active Neural Sessions
        </span>
      </div>

      {/* INTERACTION TABLE */}
      <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-5">Source Identity</th>
                <th className="px-8 py-5">Last Transmission</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {conversations.map((convo) => (
                <tr 
                  key={convo._id} 
                  onClick={() => setSelectedConvo(convo)}
                  className="hover:bg-purple-500/5 transition-all group cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <User size={20} />
                      </div>
                      <div>
                        <span className="font-black text-white text-sm tracking-tight block ">{convo.customerIdentifier}</span>
                        <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">Verified Lead</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-400 truncate max-w-xs font-medium italic">
                      "{convo.messages[convo.messages.length - 1]?.text}"
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-purple-300/60 bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/10 w-fit">
                      <Clock size={12} className="text-purple-500"/> 
                      {new Date(convo.lastInteraction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 text-purple-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all font-black text-[10px] uppercase tracking-widest ml-auto">
                      Access Logs <ChevronRight size={14}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- NEURAL TRANSCRIPT MODAL --- */}
      {selectedConvo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#05010d]/80 backdrop-blur-xl" 
            onClick={() => setSelectedConvo(null)} 
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#0b031a] w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(168,85,247,0.4)] flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 p-3 rounded-2xl text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl uppercase tracking-tighter italic">{selectedConvo.customerIdentifier}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-[9px] text-emerald-400 uppercase font-black tracking-[0.2em]">Live Decryption History</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedConvo(null)}
                className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90 border border-white/5"
              >
                <X size={20} />
              </button>
            </header>

            {/* Transcript Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-black/20 custom-scrollbar">
              {selectedConvo.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
                  <div className={`relative max-w-[85%] p-5 rounded-[1.8rem] text-sm font-medium shadow-2xl ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-purple-900/40' 
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none backdrop-blur-md'
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-3 font-mono opacity-40 uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                       [{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <footer className="p-6 border-t border-white/5 bg-black/40 text-center">
               <div className="inline-flex items-center gap-2 text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
                 <Sparkles size={12} className="text-purple-500/40" />
                 End of Secure Transcript
               </div>
            </footer>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}