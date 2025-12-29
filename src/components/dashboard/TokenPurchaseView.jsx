import React, { useState } from 'react';
import { Zap, Coins, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export default function TokenPurchaseView({ userTokens = 0, onPurchase }) {
  const [customAmount, setCustomAmount] = useState(500);
  const [loadingId, setLoadingId] = useState(null);

  // Logic: 1 Rupee = 10 Tokens
  // We add extra "Bonus" tokens for bigger amounts
  const getBonus = (amount) => {
    if (amount >= 1000) return Math.floor(amount * 10 * 0.20); // 20% Extra
    if (amount >= 500) return Math.floor(amount * 10 * 0.15); // 15% Extra
    if (amount >= 100) return Math.floor(amount * 10 * 0.10); // 10% Extra
    return 0;
  };

  const fastPacks = [
    { id: 'p1', amt: 100, tokens: 1000, bonus: 0, note: 'Basic' },
    { id: 'p2', amt: 500, tokens: 5000, bonus: 250, note: 'Most Popular', popular: true },
    { id: 'p3', amt: 1000, tokens: 10000, bonus: 1000, note: 'Best Value' },
  ];

  const handleBuy = (amount, id) => {
    setLoadingId(id);
    const totalTokens = (amount * 10) + getBonus(amount);
    
    // This sends data to your backend
    onPurchase?.({ amount, tokens: totalTokens });
    
    setTimeout(() => setLoadingId(null), 2000);
  };

  return (
    <div className="w-full  mx-auto pb-20 px-4 space-y-10">
      
      {/* HEADER: Shows current balance */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-4 gap-2">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            Add <span className="text-purple-600">Tokens</span>
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">1 Rupee = 10 Neural Tokens</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase font-black">Your Balance</p>
            <p className="text-2xl font-black text-white italic">{userTokens.toLocaleString()}</p>
          </div>
          <Coins className="text-purple-500" size={28} />
        </div>
      </div>

      {/* SECTION 1: Standard Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fastPacks.map((pack) => (
          <div 
            key={pack.id}
            className={`p-8 rounded-3xl border transition-all cursor-pointer hover:scale-[1.02] ${
              pack.popular ? 'bg-purple-600/10 border-purple-500 shadow-lg' : 'bg-white/5 border-white/10'
            }`}
            onClick={() => handleBuy(pack.amt, pack.id)}
          >
            <div className="flex justify-between mb-4">
              <span className="text-[10px] font-black text-purple-400 uppercase">{pack.note}</span>
              <Zap size={18} className={pack.popular ? 'text-purple-500' : 'text-zinc-600'} />
            </div>
            
            <div className="text-4xl font-black text-white mb-1">₹{pack.amt}</div>
            <div className="text-2xl font-black text-zinc-300 italic">
              {(pack.tokens + pack.bonus).toLocaleString()} <span className="text-xs not-italic text-zinc-500">Tokens</span>
            </div>
            
            {pack.bonus > 0 && (
              <div className="mt-2 text-xs font-bold text-emerald-500 uppercase">+{pack.bonus} Bonus Included</div>
            )}

            <button className="w-full mt-8 py-3 bg-purple-600 text-white font-black uppercase text-xs rounded-xl hover:bg-purple-500">
              {loadingId === pack.id ? <Loader2 className="animate-spin mx-auto" /> : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>

      {/* SECTION 2: Custom Amount Box */}
      <div className="bg-[#0a0a0f] border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase italic">Custom Recharge</h2>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-purple-600 italic">₹</span>
              <input 
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-white/10 rounded-2xl p-8 pl-14 text-5xl font-black text-white outline-none focus:border-purple-600 transition-all italic"
              />
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase">Min Recharge: ₹50</p>
          </div>

          <div className="bg-purple-600/5 border border-purple-500/20 p-8 rounded-3xl space-y-4">
            <div className="flex justify-between text-zinc-400 text-sm font-bold uppercase">
              <span>Basic Tokens</span>
              <span>{customAmount * 10}</span>
            </div>
            <div className="flex justify-between text-emerald-500 text-sm font-bold uppercase">
              <span>Extra Bonus</span>
              <span>+{getBonus(customAmount)}</span>
            </div>
            <div className="flex justify-between text-white text-2xl font-black uppercase pt-4 border-t border-white/10">
              <span>Total tokens</span>
              <span>{(customAmount * 10) + getBonus(customAmount)}</span>
            </div>

            <button 
              onClick={() => handleBuy(customAmount, 'custom')}
              disabled={customAmount < 50}
              className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-30"
            >
              {loadingId === 'custom' ? <Loader2 className="animate-spin" /> : <><Sparkles size={18}/> Pay ₹{customAmount}</>}
            </button>
          </div>

        </div>
      </div>

      {/* Safety Badges */}
      <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Instant Credit</span>
        </div>
      </div>

    </div>
  );
}