import React, { useState } from 'react';
import { Zap, Coins, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * TokenPurchaseView - MyAutoBot.in
 * A premium dark-themed UI for managing and purchasing neural tokens.
 */
export default function TokenPurchaseView({ userTokens = 0, onPurchase }) {
  const [customAmount, setCustomAmount] = useState(500);
  const [loadingId, setLoadingId] = useState(null);

  // Bonus Logic: Tiers for 10%, 15%, and 20% extra tokens
  const getBonus = (amount) => {
    const base = amount * 10;
    if (amount >= 1000) return Math.floor(base * 0.20);
    if (amount >= 500) return Math.floor(base * 0.15);
    if (amount >= 100) return Math.floor(base * 0.10);
    return 0;
  };

  const fastPacks = [
    { id: 'p1', amt: 100, note: 'Basic' },
    { id: 'p2', amt: 500, note: 'Most Popular', popular: true },
    { id: 'p3', amt: 1000, note: 'Best Value' },
  ];

  const handleBuy = async (amount, id) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not found. Please check your internet connection.");
      return;
    }

    setLoadingId(id);

    try {
      // 1. Initiate Order on the Backend
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) throw new Error("Order creation failed on server.");
      const order = await response.json();

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: "rzp_live_R795ytd3I8Ex1o", // MyAutoBot Live Key
        amount: order.amount,
        currency: "INR",
        name: "MyAutoBot.in",
        description: `Neural Token Recharge: ₹${amount}`,
        order_id: order.order_id,
        
        handler: async function (razorResponse) {
          try {
            // Retrieve userId as a string from localStorage
            const userId = localStorage.getItem('userId');

            if (!userId) {
              alert("Session error: User ID not found. Please log in again.");
              return;
            }

            // 3. Secure Backend Verification & Token Credit
            const verifyRes = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: razorResponse.razorpay_order_id,
                razorpay_payment_id: razorResponse.razorpay_payment_id,
                razorpay_signature: razorResponse.razorpay_signature,
                userId: userId,
                amount: amount 
              })
            });

            const result = await verifyRes.json();

            if (result.success) {
              alert(`Transaction Successful! New Balance: ${result.newBalance} Tokens.`);
              // Trigger parent update callback
              if (onPurchase) onPurchase(result.newBalance);
            } else {
              alert("Verification failed: " + result.message);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment successful, but we had trouble updating your balance. Please contact support.");
          } finally {
            setLoadingId(null);
          }
        },
        modal: {
          ondismiss: () => setLoadingId(null)
        },
        theme: { color: "#9333ea" }, // Purple primary brand color
        prefill: {
          name: localStorage.getItem('userName') || ""
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Initialization failed:", error);
      alert("Failed to reach payment gateway. Is the backend running?");
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full mx-auto pb-20 px-4 space-y-10 text-zinc-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            Add <span className="text-purple-600">Tokens</span>
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">
            ₹1 = 10 Neural Tokens • Instant Neural Activation
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 min-w-[220px]">
          <div className="text-right flex-1">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Active Balance</p>
            <p className="text-2xl font-black text-white italic">{userTokens.toLocaleString()}</p>
          </div>
          <div className="bg-purple-600/20 p-2 rounded-lg">
            <Coins className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* QUICK PACKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fastPacks.map((pack) => {
          const total = (pack.amt * 10) + getBonus(pack.amt);
          return (
            <div 
              key={pack.id}
              className={`p-8 rounded-3xl border transition-all cursor-pointer hover:translate-y-[-6px] hover:shadow-2xl hover:shadow-purple-600/10 ${
                pack.popular ? 'bg-purple-600/10 border-purple-500' : 'bg-white/5 border-white/10'
              }`}
              onClick={() => handleBuy(pack.amt, pack.id)}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  pack.popular ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {pack.note}
                </span>
                <Zap size={20} className={pack.popular ? 'text-purple-500' : 'text-zinc-600'} />
              </div>
              
              <div className="text-5xl font-black text-white mb-2 tracking-tighter italic">₹{pack.amt}</div>
              <div className="text-2xl font-bold text-zinc-300 italic">
                {total.toLocaleString()} <span className="text-sm not-italic text-zinc-500 uppercase tracking-widest ml-1 font-black">Tokens</span>
              </div>
              
              {getBonus(pack.amt) > 0 && (
                <div className="mt-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 inline-block px-2 py-1 rounded">
                  +{getBonus(pack.amt).toLocaleString()} Bonus Credit
                </div>
              )}

              <button className={`w-full mt-8 py-4 font-black uppercase text-xs rounded-xl transition-all tracking-widest ${
                pack.popular ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}>
                {loadingId === pack.id ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Claim Pack'}
              </button>
            </div>
          );
        })}
      </div>

      {/* CUSTOM RECHARGE INTERFACE */}
      <div className="bg-[#050508] border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-100px] right-[-100px] opacity-[0.02] pointer-events-none transition-transform duration-1000 group-hover:scale-110">
          <Coins size={400} className="text-purple-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Custom Neural Recharge</h2>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-purple-600 italic">₹</span>
              <input 
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-8 pl-14 text-6xl font-black text-white outline-none focus:border-purple-600 transition-all italic tracking-tighter"
              />
            </div>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Min Requirement: ₹1</p>
          </div>

          <div className="bg-purple-600/5 border border-purple-500/10 p-8 rounded-[2.5rem] space-y-5 backdrop-blur-sm">
            <div className="flex justify-between text-zinc-500 text-xs font-black uppercase tracking-widest">
              <span>Standard Credit</span>
              <span>{(customAmount * 10).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-500 text-xs font-black uppercase tracking-widest">
              <span>Neural Bonus</span>
              <span>+{getBonus(customAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end text-white pt-5 border-t border-white/10">
              <span className="text-sm font-black uppercase tracking-widest">Total Output</span>
              <span className="text-5xl font-black italic tracking-tighter text-purple-500">
                {(customAmount * 10 + getBonus(customAmount)).toLocaleString()}
              </span>
            </div>

            <button 
              onClick={() => handleBuy(customAmount, 'custom')}
              disabled={customAmount < 50}
              className="w-full py-6 mt-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase rounded-[1.5rem] flex items-center justify-center gap-3 transition-all disabled:opacity-20 tracking-[0.2em] shadow-xl shadow-purple-600/20"
            >
              {loadingId === 'custom' ? <Loader2 className="animate-spin" /> : (
                <>
                  <Sparkles size={18} />
                  Authorize ₹{customAmount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* COMPLIANCE & SECURITY BADGES */}
      <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3 group">
          <ShieldCheck size={20} className="text-zinc-400 group-hover:text-purple-500 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest">Secure Handshake</span>
        </div>
        <div className="flex items-center gap-3 group">
          <Zap size={20} className="text-zinc-400 group-hover:text-purple-500 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest">Instant Fulfillment</span>
        </div>
        <div className="flex items-center gap-3 group">
          <Coins size={200} className="hidden" /> {/* Hidden trigger for diagram logic */}
          <Coins size={20} className="text-zinc-400 group-hover:text-purple-500 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest">No Expiration</span>
        </div>
      </div>

    </div>
  );
}