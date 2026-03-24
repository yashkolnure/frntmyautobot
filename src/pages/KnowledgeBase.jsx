import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, PlusCircle, Building2, Database } from 'lucide-react';

const API_BASE = "http://72.60.196.84:8000";

const KnowledgeBase = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState('');
  const [newBizName, setNewBizName] = useState('');
  const [dataList, setDataList] = useState([]);
  const [newEntry, setNewEntry] = useState({ category: 'faq', content: '' });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      const bizRes = await axios.get(`${API_BASE}/list-businesses`);
      setBusinesses(bizRes.data.businesses);
      if (selectedBiz) {
        const dataRes = await axios.get(`${API_BASE}/business/${selectedBiz}`);
        setDataList(dataRes.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { refresh(); }, [selectedBiz]);

  const handleSave = async () => {
    if (!selectedBiz || !newEntry.content) return alert("Select business and enter content!");
    setLoading(true);
    const fd = new FormData();
    fd.append('biz_id', selectedBiz);
    fd.append('category', newEntry.category);
    fd.append('content', newEntry.content);
    
    await axios.post(`${API_BASE}/manage-data`, fd);
    setNewEntry({ ...newEntry, content: '' });
    setLoading(false);
    refresh();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this data?")) {
      await axios.delete(`${API_BASE}/delete-item/${id}`);
      refresh();
    }
  };
  
  return (
    <div className="p-20 bg-slate-950 min-h-screen text-slate-200">
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">myAutoBot <span className="text-blue-500">Engine</span></h1>
          <p className="text-slate-500 text-sm">Multi-Tenant Knowledge Management</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            <select 
              className="bg-transparent p-2 outline-none border-r border-slate-800 mr-2"
              value={selectedBiz}
              onChange={(e) => setSelectedBiz(e.target.value)}
            >
              <option value="">Select Existing Business</option>
              {businesses.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input 
              className="bg-transparent p-2 outline-none w-40"
              placeholder="Or Create New..."
              value={newBizName}
              onChange={(e) => setNewBizName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (setSelectedBiz(newBizName), setNewBizName(''))}
            />
          </div>
        </div>
      </header>

      {!selectedBiz ? (
        <div className="text-center py-20 opacity-40">
           <Building2 size={80} className="mx-auto mb-4" />
           <p className="text-xl">Select a business face to start managing data</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* INPUT FORM */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 sticky top-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                <PlusCircle size={20}/> Add Information
              </h2>
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <select 
                className="w-full bg-slate-800 p-3 mt-1 mb-4 rounded-lg border border-slate-700"
                onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
              >
                <option value="faq">Q&A (FAQ)</option>
                <option value="instruction">System Instruction</option>
                <option value="contact">Contacts & Links</option>
              </select>

              <label className="text-xs font-bold text-slate-500 uppercase">Content</label>
              <textarea 
                className="w-full bg-slate-800 p-3 mt-1 h-48 rounded-lg border border-slate-700 outline-none focus:border-blue-500"
                placeholder={newEntry.category === 'faq' ? "Q: Delivery time?\nA: 3-5 business days." : "Enter business info..."}
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
              />
              
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 p-4 mt-4 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {loading ? "Syncing..." : `Save to ${selectedBiz}`}
              </button>
            </div>
          </div>

          {/* VIEW DATA */}
          <div className="lg:col-span-8 space-y-4">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                   <Database size={20} className="text-blue-500"/> Vector Storage: {selectedBiz}
                </h2>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400">{dataList.length} Entries</span>
             </div>

             {dataList.length === 0 && <p className="text-slate-600 italic">No data synced yet for this face.</p>}

             {dataList.map(item => (
              <div key={item.id} className="group bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-blue-900 transition-all flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">{item.id}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-all p-2"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;