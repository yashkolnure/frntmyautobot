import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Calendar, Trash2, Users, Loader2, Database, } from 'lucide-react';

export default function LeadsSection() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/leads/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteLead = async (id) => {
    if(!window.confirm("Permanent deletion of this intelligence record?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(leads.filter(lead => lead._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredLeads = filter === 'All' ? leads : leads.filter(l => l.status === filter);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-purple-400">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="text-xs font-black uppercase tracking-[0.4em] animate-pulse">Scanning Lead Database...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1400px] mx-auto">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            Captured Intelligence <Database className="text-purple-500 w-6 h-6" />
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Verified contact data extracted from AI conversations</p>
        </div>
        
        {/* Filter Tabs - Cyber Style */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {['All', 'New', 'Contacted', 'Closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f 
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="bg-white/5 border-2 border-dashed border-white/5 rounded-[3rem] p-24 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="bg-white/5 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-700 border border-white/10 group-hover:scale-110 transition-transform duration-700">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">No Intelligence Found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">When customers provide contact details to your agent, the extracted data will populate here.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-3xl rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden relative">
          {/* Subtle Scanline Effect on Table */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-[scan_8s_linear_infinite] pointer-events-none" />
          
          <table className="w-full text-left border-collapse relative z-10">
            <thead className="bg-black/40 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contextual Trigger</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Capture Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Lead Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-purple-500/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl shadow-lg ${
                        lead.contact.includes('@') 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {lead.contact.includes('@') ? <Mail size={18}/> : <Phone size={18}/>}
                      </div>
                      <span className="font-black text-white text-sm tracking-tight uppercase italic">{lead.contact}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-400 line-clamp-1 italic font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                      "{lead.lastMessage}"
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                       <Calendar size={12} className="text-purple-500/50" />
                       {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={lead.status}
                      onChange={(e) => updateStatus(lead._id, e.target.value)}
                      className={`text-[10px] font-black px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all appearance-none tracking-widest ${
                        lead.status === 'New' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' :
                        lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <option value="New" className="bg-[#0b031a] text-white">NEW</option>
                      <option value="Contacted" className="bg-[#0b031a] text-white">CONTACTED</option>
                      <option value="Closed" className="bg-[#0b031a] text-white">CLOSED</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => deleteLead(lead._id)}
                      className="text-slate-700 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all active:scale-90"
                      title="Purge Record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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