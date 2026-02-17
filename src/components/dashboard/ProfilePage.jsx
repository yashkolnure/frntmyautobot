import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { 
  User, Shield, Zap, Database, Edit3, Loader2, Share2, 
  ArrowRight, Lock, Save, CheckCircle2, PlusCircle, Trash2, 
  X, Cpu, HardDrive, Terminal, Info, LayoutGrid, MessageSquare
} from 'lucide-react';

const ENGINE_API = "http://72.60.196.84:8000"; 
const MAIN_API = "http://127.0.0.1:5005/api";

export default function ProfilePage({ userId: propUserId }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state for profile edits
  const [editForm, setEditForm] = useState({ name: '', email: '', contact: '' });

  // KB & Trainer States
  const [showTrainer, setShowTrainer] = useState(false);
  const [currentKBName, setCurrentKBName] = useState(''); 
  const [dataList, setDataList] = useState([]);
  const [newEntry, setNewEntry] = useState({ category: 'faq', question: '', answer: '', content: '' });
  const [newKBInput, setNewKBInput] = useState(''); 
  const [engineLoading, setEngineLoading] = useState(false);

  // --- 1. IDENTITY ANCHOR ---
  const targetUserId = useMemo(() => {
    if (propUserId && propUserId !== "null") return propUserId;
    const stored = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('userData') || '{}')._id;
    return stored;
  }, [propUserId]);

  // Isolated ID for Neural Engine
  const getNeuralBizId = useCallback((kbName) => `${kbName}_${targetUserId}`, [targetUserId]);

  // --- 2. DATA SYNC ---
  const syncNeuralProfile = useCallback(async () => {
    if (!targetUserId) return;
    try {
      const res = await axios.get(`${MAIN_API}/all/${targetUserId}`);
      if (res.data.success) {
        const data = res.data.data;
        setProfileData(data);
        setEditForm({
          name: data.name || '',
          email: data.email || '',
          contact: data.contact || ''
        });
      }
    } catch (err) { console.error("Profile Sync Failed", err); }
    finally { setLoading(false); }
  }, [targetUserId]);

  useEffect(() => { syncNeuralProfile(); }, [syncNeuralProfile]);

  // --- 3. PROFILE ACTIONS ---
  const handleSaveRegistry = async () => {
    setIsSaving(true);
    try {
      const res = await axios.put(`${MAIN_API}/update/${targetUserId}`, editForm);
      if (res.data.success) {
        setProfileData(res.data.data);
        setIsEditing(false);
      }
    } catch (err) { alert("Update Failed"); }
    finally { setIsSaving(false); }
  };

  // --- 4. KNOWLEDGE BASE MANAGEMENT ---
  const handleCreateKB = async () => {
    if (!newKBInput.trim()) return;
    try {
      const res = await axios.post(`${MAIN_API}/kb/create/${targetUserId}`, { 
        kbName: newKBInput.trim(), 
        kbType: 'Neural Node' 
      });
      if (res.data.success) {
        setNewKBInput('');
        syncNeuralProfile();
      }
    } catch (err) { alert("KB Creation Failed"); }
  };
  
const handleDeleteKB = async (kbId) => {
  if (!window.confirm("Remove this Knowledge Base from your registry?")) return;

  try {
    // We send only the deleteKBId flag to trigger the $pull logic in the backend
    const res = await axios.put(`${MAIN_API}/update/${targetUserId}`, { 
      deleteKBId: kbId 
    });

    if (res.data.success) {
      // The backend returns the updated user object; setting it here refreshes the table instantly
      setProfileData(res.data.data);
    }
  } catch (err) {
    console.error("Deletion failed:", err);
    alert("Could not remove knowledge base.");
  }
};

  const handleSelectKB = async (kbName) => {
    try {
      await axios.put(`${MAIN_API}/update/${targetUserId}`, { activeKnowledgeBase: kbName });
      syncNeuralProfile();
    } catch (err) { console.error("Selection Failed"); }
  };

  // --- 5. NEURAL ENGINE ACTIONS ---
  const fetchKBContent = useCallback(async (kbName) => {
    if (!kbName) return;
    const bizId = getNeuralBizId(kbName);
    try {
      const res = await axios.get(`${ENGINE_API}/business/${bizId}`);
      setDataList(res.data.data || []);
    } catch (err) { setDataList([]); }
  }, [getNeuralBizId]);

  const handleSaveNeuralNode = async () => {
    let finalContent = newEntry.content;
    if (newEntry.category === 'faq') {
      if (!newEntry.question || !newEntry.answer) return alert("Fill Q&A pair");
      finalContent = `Q: ${newEntry.question}\nA: ${newEntry.answer}`;
    }
    if (!finalContent) return;

    setEngineLoading(true);
    const fd = new FormData();
    fd.append('biz_id', getNeuralBizId(currentKBName));
    fd.append('category', newEntry.category);
    fd.append('content', finalContent);

    try {
      await axios.post(`${ENGINE_API}/manage-data`, fd);
      setNewEntry({ ...newEntry, question: '', answer: '', content: '' });
      fetchKBContent(currentKBName);
    } catch (err) { alert("Neural Sync Failed"); }
    finally { setEngineLoading(false); }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Loader2 className="text-purple-500 animate-spin" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 mt-6">Initializing Profile</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-200 p-2 lg:p-0 ">
      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-4">

        {/* --- IDENTITY SIDEBAR --- */}
        <div className="space-y-6">
          <div className=" backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px]" />
            <div className="w-24 h-24 rounded-full border-2 border-purple-500/20 p-1 mx-auto mb-6 relative z-10">
               <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                  <User size={40} className="text-purple-500/30" />
               </div>
            </div>
            <h2 className="text-xl font-black text-white uppercase italic relative z-10">{profileData?.name}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{profileData?.email}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/20 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Neural Balance</p>
                  <p className="text-4xl font-black text-white italic mt-1 tabular-nums">{profileData?.tokens?.toLocaleString() || 0}</p>
                </div>
                <Zap className="text-purple-500 animate-pulse" size={24} />
             </div>
             <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase transition-all active:scale-95 shadow-lg shadow-purple-600/20">Refill Credits</button>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          
          {/* PROFILE EDIT SECTION */}
          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2"><Shield size={18} className="text-purple-500"/> System Profile</span>
              <button 
                onClick={() => isEditing ? handleSaveRegistry() : setIsEditing(true)} 
                className="text-[10px] font-black uppercase text-purple-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : isEditing ? <><Save size={14} /> Save changes</> : <><Edit3 size={14} /> Edit Registry</>}
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput label="Full Name" value={editForm.name} disabled={!isEditing} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
              <ProfileInput label="Email Node" value={editForm.email} disabled={!isEditing} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
              <ProfileInput label="Contact Link" value={editForm.contact} disabled={!isEditing} onChange={(e) => setEditForm({...editForm, contact: e.target.value})} />
              <ProfileInput label="Neural API Key" value={profileData?.apiKey} disabled={true} isMasked />
            </div>
          </div>

          {/* KNOWLEDGE BASE MANAGEMENT */}
          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <LayoutGrid size={18} className="text-purple-500"/> Knowledge Registry
              </span>
              <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto">
                <input 
                  className="bg-transparent px-3 py-1.5 text-[10px] font-bold text-white outline-none w-full md:w-32 focus:md:w-48 transition-all"
                  placeholder="New KB Name..."
                  value={newKBInput}
                  onChange={(e) => setNewKBInput(e.target.value)}
                />
                <button onClick={handleCreateKB} className="bg-purple-600 p-2 rounded-xl text-white hover:bg-purple-500 transition-colors"><PlusCircle size={16} /></button>
              </div>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[550px]">
                <thead>
                  <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-3">KB Identifier</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(profileData?.knowledgeBases || []).map((kb) => (
                    <tr key={kb._id} className="bg-white/5 hover:bg-white/10 transition-all group">
                      <td className="px-6 py-4 rounded-l-2xl">
                        <span className="text-xs font-bold text-white uppercase italic">{kb.name}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleSelectKB(kb.name)}
                          className={`px-3 py-1 text-[8px] font-black rounded-full uppercase border transition-all 
                            ${profileData.activeKnowledgeBase === kb.name ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-500/10 text-slate-500 border-white/5'}`}
                        >
                          {profileData.activeKnowledgeBase === kb.name ? 'Active' : 'Set Live'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right rounded-r-2xl space-x-2">
                        <button onClick={() => { setCurrentKBName(kb.name); fetchKBContent(kb.name); setShowTrainer(true); }} className="px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 rounded-xl text-purple-400 text-[9px] font-black uppercase transition-all inline-flex items-center gap-2"><Terminal size={12}/> Train</button>
                        <button onClick={() => handleDeleteKB(kb._id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!profileData?.knowledgeBases || profileData.knowledgeBases.length === 0) && (
                <div className="py-20 text-center opacity-30 flex flex-col items-center">
                  <HardDrive size={32} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Registry is Empty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- NEURAL TRAINER MODAL --- */}
      {showTrainer && (
        <div className="fixed inset-0 z-[15000] flex items-center justify-center p-0 md:p-12 bg-black/95 backdrop-blur-3xl animate-in zoom-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-6xl h-full md:h-[85vh] rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <header className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
               <div className="flex items-center gap-4">
                 <div className="bg-purple-600/20 p-3 rounded-2xl"><Cpu size={24} className="text-purple-500" /></div>
                 <div>
                   <h3 className="text-xl font-black text-white uppercase italic">{currentKBName}</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Training Active Node</p>
                 </div>
               </div>
               <button onClick={() => setShowTrainer(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={20}/></button>
            </header>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
               <div className="lg:col-span-5 p-6 md:p-8 border-r border-white/5 space-y-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Category</label>
                    <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white outline-none focus:border-purple-500" value={newEntry.category} onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}>
                      <option value="faq">FAQ (Question/Answer)</option>
                      <option value="instruction">System Instruction</option>
                      <option value="general">Business Detail</option>
                    </select>

                    {newEntry.category === 'faq' ? (
                      <div className="space-y-4 animate-in slide-in-from-left duration-300">
                         <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white outline-none focus:border-purple-500" placeholder="User Question..." value={newEntry.question} onChange={(e) => setNewEntry({...newEntry, question: e.target.value})} />
                         <textarea className="w-full bg-white/5 border border-white/10 p-4 h-40 rounded-2xl text-xs font-bold text-white outline-none focus:border-purple-500" placeholder="AI Response..." value={newEntry.answer} onChange={(e) => setNewEntry({...newEntry, answer: e.target.value})} />
                      </div>
                    ) : (
                      <textarea className="w-full bg-white/5 border border-white/10 p-4 h-60 rounded-2xl text-xs font-bold text-white outline-none focus:border-purple-500" placeholder="Bulk training data..." value={newEntry.content} onChange={(e) => setNewEntry({...newEntry, content: e.target.value})} />
                    )}

                    <button onClick={handleSaveNeuralNode} disabled={engineLoading} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {engineLoading ? "Injecting Node..." : `Sync to Brain`}
                    </button>
                  </div>
               </div>

               <div className="lg:col-span-7 p-6 md:p-8 bg-black/20 overflow-y-auto custom-scrollbar">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><HardDrive size={14} className="text-purple-500"/> Total Brain Nodes: {dataList.length}</h4>
                  <div className="space-y-4">
                    {dataList.map((item) => (
                      <div key={item.id} className="group bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all flex justify-between items-start">
                        <div className="flex-1 overflow-hidden">
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest mb-3 inline-block ${item.category === 'faq' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>{item.category}</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-bold italic whitespace-pre-wrap break-words">"{item.content}"</p>
                        </div>
                        <button onClick={async () => {
                           if(window.confirm("Purge Node?")) {
                             await axios.delete(`${ENGINE_API}/delete-item/${item.id}`);
                             fetchKBContent(currentKBName);
                           }
                        }} className="p-2 text-slate-600 hover:text-red-500 transition-all ml-4 shrink-0"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

function ProfileInput({ label, value, disabled, isMasked, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{label}</label>
      <input 
        type={isMasked ? "password" : "text"} 
        value={value || ''} 
        disabled={disabled} 
        onChange={onChange}
        className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold transition-all 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 focus:border-purple-500/50 outline-none ring-offset-black focus:ring-1 focus:ring-purple-500/30'}`}
      />
    </div>
  );
}