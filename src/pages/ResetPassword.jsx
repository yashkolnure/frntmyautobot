import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Zap, Loader2 } from 'lucide-react';
import { resetPassword } from '../api';

export default function ResetPassword() {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await resetPassword(token, password);
      // Navigate to Auth page only after success
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Recalibration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05010d] px-6">
      <div className="w-full max-w-md bg-[#0b031a]/60 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
           <div className="w-14 h-14 bg-purple-600/20 border border-purple-500/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-purple-400" size={28} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">New Access Key</h1>
          {error && <p className="mt-4 text-[10px] font-black uppercase text-red-400 tracking-widest">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password" 
            placeholder="NEW_PASSWORD" 
            required
            className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 text-xs font-bold uppercase tracking-widest"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="w-full bg-purple-600 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-lg hover:bg-purple-500 transition-all flex items-center justify-center gap-2 italic">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            Update Credentials
          </button>
        </form>
      </div>
    </div>
  );
}