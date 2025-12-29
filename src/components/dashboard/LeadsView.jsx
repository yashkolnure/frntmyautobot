import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Loader2, Inbox, MessageCircle, Database, Sparkles, Zap } from 'lucide-react';
import API from '../../api';

export default function LeadsView() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CONFIGURATION ---
  const DEFAULT_COUNTRY_CODE = '91';

  useEffect(() => {
    API.get('/leads')
      .then(res => {
        setLeads(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const getWhatsAppLink = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      cleaned = DEFAULT_COUNTRY_CODE + cleaned;
    }
    return `https://wa.me/${cleaned}`;
  };

  if (loading) return (
    <div className="flex flex-col h-96 items-center justify-center text-purple-400">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Lead Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto pb-20">
      
      {/* SECTION HEADER */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            Intelligence Dashboard <Database size={24} className="text-purple-500" />
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Verified contact extractions from neural sessions</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Extraction Active</span>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-3xl border-2 border-dashed border-white/5 rounded-[3rem] p-32 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <Inbox className="mx-auto text-slate-700 mb-6 group-hover:scale-110 transition-transform duration-700" size={60} />
            <h3 className="text-white font-black text-xl uppercase tracking-tighter italic">Intelligence Repository Empty</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Awaiting first successful data extraction.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative">
          {/* Holographic Table Shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-[scan_10s_linear_infinite] pointer-events-none" />
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse relative z-10">
              <thead>
                <tr className="bg-black/40 border-b border-white/5">
                  <th className="pl-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-left">Identity Cluster</th>
                  <th className="px-3 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-left">Extracted Node</th>
                  <th className="px-3 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-left">Contextual Signal</th>
                  <th className="px-3 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-left">Capture Date</th>
                  <th className="px-3 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Neural Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => {
                  const isEmail = lead.contact.includes('@');
                  const isPhone = !isEmail && lead.contact.replace(/\D/g, '').length >= 10;

                  return (
                    <tr key={lead._id} className="group hover:bg-purple-500/5 transition-all duration-300">
                      
                      {/* IDENTITY */}
                      <td className="pl-4 py-3">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black text-xs shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                            {lead.customerIdentifier?.charAt(0) || <Sparkles size={14}/>}
                          </div>
                          <div>
                             <span className="font-black text-white text-sm uppercase tracking-tight block italic">{lead.customerIdentifier || "GUEST_USER"}</span>
                             <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase">Verified Lead</span>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT PILL */}
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border backdrop-blur-md flex items-center gap-2 w-fit transition-all ${
                          isEmail 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {isEmail ? <Mail size={12}/> : <Phone size={12}/>}
                          {lead.contact}
                        </span>
                      </td>

                      {/* CONTEXT */}
                      <td className="px-3 py-3 max-w-[250px]">
                        <p className="text-xs text-slate-400 truncate italic font-medium group-hover:text-slate-200 transition-colors">
                            "{lead.lastMessage}"
                        </p>
                      </td>

                      {/* TIMESTAMP */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] uppercase">
                          <Calendar size={12} className="text-purple-500/50" />
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-3 py-3">
                        <div className="flex justify-center items-center gap-3">
                          {isEmail ? (
                            <a 
                                href={`mailto:${lead.contact}`} 
                                className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:border-purple-500 transition-all shadow-xl active:scale-95"
                            >
                                <Mail size={14} /> Send Email
                            </a>
                          ) : isPhone ? (
                            <>
                              <a 
                                  href={`tel:${lead.contact}`} 
                                  className="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-white hover:bg-white/10 transition-all active:scale-90"
                              >
                                  <Phone size={16} />
                              </a>
                              <a 
                                href={getWhatsAppLink(lead.contact)} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
                              >
                                <MessageCircle size={14} /> Open WhatsApp
                              </a>
                            </>
                          ) : (
                            <span className="text-[9px] font-black text-red-500/50 uppercase tracking-[0.2em] border border-red-500/20 px-3 py-1 rounded-lg">Format Error</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan { 
          0% { transform: translateY(-100%); } 
          100% { transform: translateY(100%); } 
        }
      `}</style>
    </div>
  );
}