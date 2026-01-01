import React, { useEffect, useState } from 'react';
// Import the new functions from your api.js file
import { getAllUsers, decommissionNode } from '../api'; 
import { 
  Users, Search, Trash2, ShieldAlert, Activity, 
  Database, Mail, Phone, Loader2, RefreshCw 
} from 'lucide-react';

export default function SuperAdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(); // Using the api.js helper
      setUsers(res.data);
    } catch (err) {
      console.error("Neural Link Refused:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Decommission this node from the network?")) {
      try {
        await decommissionNode(id); // Using the api.js helper
        fetchNodes(); // Refresh list
      } catch (err) {
        alert("Authorization Error: Could not remove node.");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto space-y-8 pt-32 pb-20 px-4 animate-in fade-in duration-1000 bg-[#05010d] min-h-screen text-white">
      
      {/* --- SYSTEM HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Identity Nodes" value={users.length} icon={<Users size={24} />} color="text-purple-400" />
        <StatCard label="Network Integrity" value="Active" icon={<ShieldAlert size={24} />} color="text-emerald-400" />
        <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 flex flex-col justify-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Admin Security Status</p>
            <div className="flex items-center gap-2 text-purple-400 text-sm font-black">
                <Activity size={14} className="animate-pulse" /> ENCRYPTED_SESSION
            </div>
        </div>
      </div>

      {/* --- USER MANAGEMENT CORE --- */}
      <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* HEADER & SEARCH */}
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-purple-600/5">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-3 rounded-2xl">
              <Database size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Node Directory</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text"
                placeholder="SEARCH NODE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border border-white/10 pl-12 pr-6 py-3 rounded-xl outline-none focus:border-purple-500/50 text-[10px] font-black uppercase tracking-widest w-64"
              />
            </div>
            <button onClick={fetchNodes} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity Node</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-purple-500/5 transition-all group">
                    <td className="px-8 py-6">
                      <span className="text-xs font-black uppercase text-zinc-200">{user.name}</span>
                    </td>
                    <td className="px-8 py-6 font-mono text-[11px] text-zinc-400">
                      {user.email}
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 flex items-center justify-between">
    <div className="flex items-center gap-5">
      <div className={`bg-purple-600/10 p-4 rounded-2xl border border-purple-500/20 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black italic text-white">{value}</h3>
      </div>
    </div>
  </div>
);