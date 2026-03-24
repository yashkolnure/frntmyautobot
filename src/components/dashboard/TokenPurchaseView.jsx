import React, { useState } from 'react';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  bg0: '#03020a', bg1: '#070512', bg2: '#0d0b1e', bg3: '#13102b',
  border:  'rgba(99,102,241,0.18)',
  borderH: 'rgba(99,102,241,0.45)',
  indigo: '#4f46e5', indigoL: '#818cf8',
  purple: '#7c3aed', purpleL: '#a78bfa',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  green: '#22c55e', red: '#ef4444', amber: '#f59e0b',
  font: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono: "'DM Mono',monospace",
};

// ─── ICONS ───────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoZap      = p => <Ico {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoCheck    = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoShield   = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoStar     = p => <Ico {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const IcoArrow    = p => <Ico {...p} d="M5 12h14M12 5l7 7-7 7" />;
const IcoCoin     = p => <Ico {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2" />;
const IcoSparkle  = p => <Ico {...p} d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />;

// ─── BONUS LOGIC ─────────────────────────────────────────────────────
const getBonus = (amount) => {
  const base = amount * 10;
  if (amount >= 1000) return Math.floor(base * 0.20);
  if (amount >= 500)  return Math.floor(base * 0.15);
  if (amount >= 100)  return Math.floor(base * 0.10);
  return 0;
};

const getBonusPct = (amount) => {
  if (amount >= 1000) return '20%';
  if (amount >= 500)  return '15%';
  if (amount >= 100)  return '10%';
  return null;
};

const fastPacks = [
  { id: 'p1', amt: 100,  label: 'Starter',      popular: false },
  { id: 'p2', amt: 500,  label: 'Most Popular',  popular: true  },
  { id: 'p3', amt: 1000, label: 'Best Value',    popular: false },
];

// ─── MAIN ────────────────────────────────────────────────────────────
export default function TokenPurchaseView({ userTokens = 0, onPurchase }) {
  const [customAmount, setCustomAmount] = useState(500);
  const [loadingId,    setLoadingId]    = useState(null);
  const [hovPack,      setHovPack]      = useState(null);
  const [inputHov,     setInputHov]     = useState(false);

  const handleBuy = async (amount, id) => {
    if (!window.Razorpay) { alert('Razorpay SDK not found.'); return; }
    setLoadingId(id);
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Order creation failed.');
      const order = await response.json();

      const options = {
        key: 'rzp_live_R795ytd3I8Ex1o',
        amount: order.amount,
        currency: 'INR',
        name: 'MyAutoBot.in',
        description: `Neural Token Recharge: ₹${amount}`,
        order_id: order.order_id,
        handler: async (razorResponse) => {
          try {
            const userId = localStorage.getItem('userId');
            if (!userId) { alert('Session error. Please log in again.'); return; }
            const verifyRes = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: razorResponse.razorpay_order_id,
                razorpay_payment_id: razorResponse.razorpay_payment_id,
                razorpay_signature: razorResponse.razorpay_signature,
                userId, amount,
              }),
            });
            const result = await verifyRes.json();
            if (result.success) {
              alert(`Transaction Successful! New Balance: ${result.newBalance} Tokens.`);
              if (onPurchase) onPurchase(result.newBalance);
            } else { alert('Verification failed: ' + result.message); }
          } catch (err) { console.error('Verification error:', err); }
          finally { setLoadingId(null); }
        },
        modal: { ondismiss: () => setLoadingId(null) },
        theme: { color: '#7c3aed' },
        prefill: { name: localStorage.getItem('userName') || '' },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error('Init failed:', err);
      alert('Failed to reach payment gateway.');
      setLoadingId(null);
    }
  };

  const customTotal  = customAmount * 10 + getBonus(customAmount);
  const customBonus  = getBonus(customAmount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem', fontFamily: T.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
        .pack-card { transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease; cursor: pointer; }
        .badge-row { transition: opacity 0.3s ease; }
        .badge-row:hover { opacity: 1 !important; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(59,130,246,0.05), rgba(124,58,237,0.08))',
        border: `1px solid ${T.border}`, borderRadius: 22, padding: '2rem',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.5s ease both',
      }}>
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', width: 200, height: 200, background: 'radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: T.purpleL, textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 12 }}>
              Token Marketplace
            </div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: T.t1, letterSpacing: -0.8, margin: '0 0 8px' }}>
              Add{' '}
              <span style={{ backgroundImage: 'linear-gradient(135deg,#818cf8,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shim 5s linear infinite' }}>
                Neural Tokens
              </span>
            </h2>
            <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.75, maxWidth: 420, margin: 0 }}>
              <strong style={{ color: T.t1 }}>₹1 = 10 Tokens</strong> · Instant activation · No expiration on any balance.
            </p>
          </div>

          {/* Balance pill */}
          <div style={{
            background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
            border: `1px solid ${T.border}`, borderRadius: 16,
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.875rem',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoCoin size={18} stroke={T.amber} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, margin: '0 0 3px' }}>Active Balance</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: T.amber, fontFamily: T.mono, margin: 0, letterSpacing: -0.5 }}>{userTokens.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* decorative */}
        <div style={{ position: 'absolute', right: '-1.5rem', bottom: '-1.5rem', opacity: 0.05, transform: 'rotate(-12deg)' }}>
          <IcoCoin size={130} stroke={T.purpleL} sw={1} />
        </div>
      </div>

      {/* ── QUICK PACKS ──────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
        border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden',
        animation: 'fadeUp 0.55s ease both',
      }}>
        {/* toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: `1px solid ${T.border}`,
          background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
        }}>
          <h4 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 10, fontWeight: 700, color: T.indigoL,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: T.mono, margin: 0,
          }}>
            <IcoZap size={14} stroke={T.indigoL} /> Quick Packs
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '4px 10px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.green, display: 'inline-block', animation: 'pl 2s infinite' }} />
            <span style={{ color: '#4ade80', fontSize: 10, fontWeight: 700, fontFamily: T.mono }}>Instant Fulfillment</span>
          </div>
        </div>

        {/* pack cards */}
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
          {fastPacks.map((pack, idx) => {
            const total   = (pack.amt * 10) + getBonus(pack.amt);
            const bonus   = getBonus(pack.amt);
            const bonusPct= getBonusPct(pack.amt);
            const isHov   = hovPack === pack.id;
            const loading = loadingId === pack.id;

            return (
              <div key={pack.id} className="pack-card"
                onClick={() => !loading && handleBuy(pack.amt, pack.id)}
                onMouseEnter={() => setHovPack(pack.id)}
                onMouseLeave={() => setHovPack(null)}
                style={{
                  background: pack.popular
                    ? 'linear-gradient(145deg,rgba(79,70,229,0.14),rgba(124,58,237,0.08))'
                    : `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
                  border: `1px solid ${pack.popular
                    ? (isHov ? 'rgba(99,102,241,0.55)' : 'rgba(99,102,241,0.35)')
                    : (isHov ? T.borderH : T.border)}`,
                  borderRadius: 16, padding: '1.5rem',
                  position: 'relative', overflow: 'hidden',
                  transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHov ? `0 16px 40px rgba(79,70,229,${pack.popular ? '.22' : '.14'})` : 'none',
                  animationDelay: `${idx * 0.06}s`,
                }}
              >
                {/* Popular glow */}
                {pack.popular && (
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
                )}

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    fontFamily: T.mono, padding: '3px 9px', borderRadius: 20,
                    background: pack.popular ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.06)',
                    border: pack.popular ? '1px solid transparent' : `1px solid ${T.border}`,
                    color: pack.popular ? 'white' : T.t3,
                    boxShadow: pack.popular ? '0 2px 10px rgba(79,70,229,.4)' : 'none',
                  }}>{pack.label}</span>
                  <IcoZap size={15} stroke={pack.popular ? T.indigoL : T.t3} />
                </div>

                {/* Price */}
                <p style={{ fontSize: 36, fontWeight: 900, color: T.t1, fontFamily: T.mono, margin: '0 0 4px', letterSpacing: -1, lineHeight: 1 }}>
                  ₹{pack.amt}
                </p>

                {/* Token total */}
                <p style={{ fontSize: 14, fontWeight: 700, color: T.t2, fontFamily: T.mono, margin: '0 0 12px' }}>
                  {total.toLocaleString()}{' '}
                  <span style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>tokens</span>
                </p>

                {/* Bonus badge */}
                {bonus > 0 && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: '1.25rem',
                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                    borderRadius: 8, padding: '3px 9px',
                    fontSize: 9, fontWeight: 700, color: '#4ade80', fontFamily: T.mono, letterSpacing: '0.08em',
                  }}>
                    <IcoCheck size={10} stroke="#4ade80" sw={2.5} />
                    +{bonus.toLocaleString()} bonus · {bonusPct} extra
                  </div>
                )}

                {/* CTA button */}
                <button disabled={loading} style={{
                  width: '100%', padding: '0.75rem',
                  borderRadius: 11, border: 'none',
                  background: pack.popular
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    : 'rgba(255,255,255,0.05)',
                  color: 'white', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.font,
                  boxShadow: pack.popular ? '0 4px 16px rgba(79,70,229,.35)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
                  border: pack.popular ? 'none' : `1px solid ${T.border}`,
                }}>
                  {loading
                    ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                    : <IcoArrow size={13} />}
                  {loading ? 'Processing…' : 'Claim Pack'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CUSTOM RECHARGE ──────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
        border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden',
        animation: 'fadeUp 0.6s ease both',
      }}>
        {/* toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: `1px solid ${T.border}`,
          background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
        }}>
          <h4 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 10, fontWeight: 700, color: T.indigoL,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: T.mono, margin: 0,
          }}>
            <IcoSparkle size={14} stroke={T.indigoL} /> Custom Recharge
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '4px 10px' }}>
            <IcoZap size={11} stroke={T.amber} />
            <span style={{ color: T.amber, fontSize: 10, fontWeight: 700, fontFamily: T.mono }}>Any Amount</span>
          </div>
        </div>

        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem', alignItems: 'start' }}>

          {/* Amount input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>
              Enter Amount (₹)
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: T.bg0, border: `1px solid ${inputHov ? T.borderH : T.border}`,
              borderRadius: 12, padding: '0.875rem 1rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={() => setInputHov(true)}
              onMouseLeave={() => setInputHov(false)}
            >
              <span style={{ fontSize: 20, fontWeight: 900, color: T.purpleL, fontFamily: T.mono, lineHeight: 1 }}>₹</span>
              <input
                type="number"
                value={customAmount}
                onChange={e => setCustomAmount(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: T.t1, fontSize: 28, fontWeight: 900, fontFamily: T.mono,
                  letterSpacing: -0.5, lineHeight: 1,
                }}
              />
            </div>
            <p style={{ fontSize: 10, color: T.t3, fontFamily: T.mono, margin: 0 }}>Minimum: ₹1</p>

            {/* Quick amount pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[100, 250, 500, 1000, 2000].map(amt => (
                <button key={amt} onClick={() => setCustomAmount(amt)} style={{
                  padding: '4px 10px', borderRadius: 8,
                  background: customAmount === amt ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)',
                  border: customAmount === amt ? '1px solid transparent' : `1px solid ${T.border}`,
                  color: customAmount === amt ? 'white' : T.t3,
                  fontSize: 11, fontWeight: 700, fontFamily: T.mono,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: customAmount === amt ? '0 2px 10px rgba(79,70,229,.35)' : 'none',
                }}>₹{amt}</button>
              ))}
            </div>
          </div>

          {/* Breakdown card */}
          <div style={{
            background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
            border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: T.t3, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono, margin: 0 }}>
              Token Breakdown
            </p>

            {[
              { label: 'Standard Credit',  value: `${(customAmount * 10).toLocaleString()}`, color: T.t2 },
              { label: 'Neural Bonus',     value: `+${customBonus.toLocaleString()}`,        color: '#4ade80' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0.875rem', borderRadius: 9, background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 10, color: T.t3, fontFamily: T.mono }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: r.color, fontFamily: T.mono }}>{r.value}</span>
              </div>
            ))}

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', borderRadius: 10, background: 'rgba(79,70,229,0.08)', border: `1px solid rgba(99,102,241,0.25)` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.t2, fontFamily: T.mono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Output</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: T.indigoL, fontFamily: T.mono, letterSpacing: -0.5 }}>{customTotal.toLocaleString()}</span>
            </div>

            {/* Authorize button */}
            <button
              onClick={() => handleBuy(customAmount, 'custom')}
              disabled={customAmount < 1 || loadingId === 'custom'}
              style={{
                width: '100%', padding: '0.875rem',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: '1px solid transparent', borderRadius: 11,
                color: 'white', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: customAmount < 1 || loadingId === 'custom' ? 'not-allowed' : 'pointer',
                fontFamily: T.font,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: '0 4px 16px rgba(79,70,229,.35)',
                opacity: customAmount < 1 ? 0.3 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (customAmount >= 1) { e.currentTarget.style.boxShadow = '0 6px 24px rgba(79,70,229,.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loadingId === 'custom'
                ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                : <IcoSparkle size={13} />}
              {loadingId === 'custom' ? 'Processing…' : `Authorize ₹${customAmount.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE BADGES ────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
        border: `1px solid ${T.border}`, borderRadius: 16,
        padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', flexWrap: 'wrap',
        animation: 'fadeUp 0.65s ease both',
        opacity: 0.55, transition: 'opacity 0.3s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.55'}
      >
        {[
          { icon: <IcoShield size={14} />, label: 'Secure Handshake' },
          { icon: <IcoZap size={14} />,   label: 'Instant Fulfillment' },
          { icon: <IcoStar size={14} />,  label: 'No Expiration' },
        ].map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: T.t3 }}>
            {b.icon}
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}