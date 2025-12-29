import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, CreditCard, Shield, Zap, ArrowRight, Info,  Loader2 } from 'lucide-react';

const PricingPage = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [currency, setCurrency] = useState('INR'); 
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const GST_RATE = 0.18;
  const USD_EXCHANGE = 85; 

  const tiers = [
    {
      id: 'starter',
      name: "Starter Plan",
      monthlyINR: 0,
      annualINR: 0,
      tokens: "500",
      model: "Llama 3.2 3B",
      details: "Basic AI setup for personal websites and testing.",
      features: [
        "Website Chat Automation",
        "500 Monthly Tokens",
        "Llama 3.2 (3B) AI Model",
        "Standard Bot Professionalism",
        "Basic Lead Extraction (Name/Email)",
        "Standard Response Speed",
        "7-Day Chat History Storage",
        "Email Support"
      ],
      color: "border-slate-800",
      button: "Start Free",
    },
    {
      id: 'pro',
      name: "Pro Plan",
      monthlyINR: 799,
      annualINR: 4999,
      tokens: "5,000",
      model: "Qwen 2.5 7B",
      details: "Advanced automation for growing business sales.",
      features: [
        "WhatsApp Chat Automation",
        "Telegram Chat Automation",
        "5,000 Monthly Tokens",
        "Smart Qwen 2.5 (7B) AI Model",
        "Train AI with 10 PDF/Text Files",
        "Enhanced Bot Professionalism",
        "Priority Response Speed",
        "Lifetime Lead Data Storage",
        "Personal Chatbot Web Link",
        "Priority Email Support"
      ],
      color: "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]",
      button: "Choose Pro",
      popular: true
    },
    {
      id: 'enterprise',
      name: "Enterprise Plan",
      monthlyINR: 1299,
      annualINR: 7999,
      tokens: "50,000",
      model: "Llama 3.3 70B",
      details: "Maximum power for agencies and large companies.",
      features: [
        "Instagram Chat Automation",
        "Facebook Messenger Automation",
        "50,000 Monthly Tokens",
        "Expert Llama 3.3 (70B) AI Model",
        "Private Dedicated VPS Server",
        "Maximum Bot Professionalism",
        "Instant Ultra-Fast Responses",
        "Auto-Train AI from Website URL",
        "Full API & Webhook Access",
        "24/7 Dedicated Manager Support"
      ],
      color: "border-emerald-500/30",
      button: "Choose Enterprise",
    }
  ];

  const formatPrice = (amount) => {
    const val = currency === 'USD' ? amount / USD_EXCHANGE : amount;
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(val);
  };

  const calculateInvoice = (plan) => {
    const subtotal = isAnnual ? plan.annualINR : plan.monthlyINR;
    const tax = subtotal * GST_RATE;
    const total = subtotal + tax;
    const savings = isAnnual ? (plan.monthlyINR * 12) - plan.annualINR : 0;
    return { subtotal, tax, total, savings };
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedPlan(null);
      navigate('/dashboard'); // Move to the app
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#05010d] text-white pt-32 pb-20 px-6 font-sans selection:bg-purple-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08),transparent_70%)]"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
            MyAutoBot <span className="text-purple-500">Pricing</span>
          </h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-10 opacity-60">Secure your computational node</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Currency Switch */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {['INR', 'USD'].map((c) => (
                <button 
                  key={c} 
                  onClick={() => setCurrency(c)} 
                  className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${currency === c ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${!isAnnual ? 'text-white' : 'text-slate-600'}`}>Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)} 
                className="w-14 h-7 bg-white/5 border border-white/10 rounded-full p-1 relative transition-all"
              >
                <div className={`w-5 h-5 bg-purple-600 rounded-full transition-all duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isAnnual ? 'text-white' : 'text-slate-600'}`}>
                Yearly <span className="text-emerald-500 ml-1">SAVE HUGE</span>
              </span>
            </div>
          </div>
        </div>

        {/* --- PLAN CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative bg-[#0b031a]/60 backdrop-blur-3xl p-10 rounded-[3rem] border transition-all duration-500 group hover:-translate-y-2 flex flex-col ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[8px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-xl">
                  Best Value Node
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">{plan.name}</h3>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{plan.details}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-black italic">
                  {formatPrice(isAnnual ? plan.annualINR / 12 : plan.monthlyINR)}
                </span>
                <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">/ month</span>
              </div>

              {/* Specs Grid */}
              <div className="mb-8 grid grid-cols-2 gap-4 border-y border-white/5 py-6">
                 <div>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Token Limit</p>
                    <p className="text-sm font-black text-white italic">{plan.tokens}</p>
                 </div>
                 <div>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">AI Engine</p>
                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{plan.model}</p>
                 </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setSelectedPlan(plan)} 
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 italic ${
                  plan.popular 
                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/30 hover:bg-purple-500' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.button} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- INVOICE MODAL --- */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0b031a] border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            
            <button 
              onClick={() => setSelectedPlan(null)} 
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24}/>
            </button>
            
            <h2 className="text-2xl font-black uppercase italic mb-8 text-white tracking-tighter">Order Summary</h2>

            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-end pb-6 border-b border-white/5">
                <div>
                  <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-1">{selectedPlan.name}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {isAnnual ? '12 Months Commitment' : '1 Month Subscription'}
                  </p>
                </div>
                <p className="text-2xl font-black italic text-white">
                  {formatPrice(calculateInvoice(selectedPlan).subtotal)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  <span>Plan Subtotal</span>
                  <span>{formatPrice(calculateInvoice(selectedPlan).subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Government GST (18%)</span>
                  <span className="text-emerald-500">+{formatPrice(calculateInvoice(selectedPlan).tax)}</span>
                </div>
                {isAnnual && calculateInvoice(selectedPlan).savings > 0 && (
                   <div className="flex justify-between text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                     <span>Annual Savings Applied</span>
                     <span>-{formatPrice(calculateInvoice(selectedPlan).savings)}</span>
                   </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white opacity-60">Grand Total</span>
                <span className="text-4xl font-black italic text-white leading-none">
                    {formatPrice(calculateInvoice(selectedPlan).total)}
                </span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-6 rounded-2xl text-white font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 italic"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} /> Authorize & Pay
                </>
              )}
            </button>
            
            <p className="text-[8px] text-center mt-8 text-slate-600 font-black uppercase tracking-[0.4em]">
              Secured by Avenirya Solutions OPC Pvt Ltd • 256-bit SSL
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;