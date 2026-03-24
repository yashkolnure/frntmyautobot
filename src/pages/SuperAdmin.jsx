import React, { useEffect, useState, useCallback } from 'react';

// ─── DESIGN TOKENS — exact match from landing page ──────────────────
const T = {
  bg0: '#03020a', bg1: '#070512', bg2: '#0d0b1e', bg3: '#13102b',
  border:  'rgba(99,102,241,0.18)',
  borderH: 'rgba(99,102,241,0.45)',
  purple:  '#7c3aed', purpleL: '#a78bfa',
  indigo:  '#4f46e5', indigoL: '#818cf8',
  blue:    '#3b82f6', blueL:   '#93c5fd',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  green: '#22c55e', red: '#ef4444',
  font: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

// ─────────────────────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────────────────────
const ADMIN_EMAIL    = "yashkolnure58@gmail.com";
const ADMIN_PASSWORD = "Y@sh@8767";
const API_BASE       = "/api/admin";
const ADMIN_SECRET   = "dqweydoewufodiuweiofyuwyrufoiweufoiuowriufocyiwetidc";

// ─────────────────────────────────────────────────────────────
//  API helpers
// ─────────────────────────────────────────────────────────────
const adminHeaders = () => ({
  "Content-Type": "application/json",
  "x-admin-key": ADMIN_SECRET,
});

const adminApi = {
  getUsers: async () => {
    const r = await fetch(`${API_BASE}/users`, { headers: adminHeaders() });
    const data = await r.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.users)) return data.users;
    throw new Error(data.message || "Unexpected response shape");
  },
  addTokens: async (userId, amount) => {
    const r = await fetch(`${API_BASE}/users/${userId}/tokens`, {
      method: "PATCH", headers: adminHeaders(),
      body: JSON.stringify({ amount }),
    });
    return r.json();
  },
  deleteUser: async (userId) => {
    const r = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE", headers: adminHeaders(),
    });
    return r.json();
  },
};

// ─────────────────────────────────────────────────────────────
//  GLOBAL CSS
// ─────────────────────────────────────────────────────────────
const GlobalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${T.font}; background: ${T.bg1}; }
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
    @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
    @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes pl      { 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes shim    { 0%{background-position:-200% center} 100%{background-position:200% center} }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: ${T.bg1}; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px ${T.bg2} inset !important;
      -webkit-text-fill-color: ${T.t1} !important;
    }
    .user-row:hover td { background: rgba(99,102,241,0.04) !important; }
    button { font-family: ${T.font}; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
//  ICONS
// ─────────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, stroke = 'currentColor', fill = 'none', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IcoShield  = p => <Ico {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoUsers   = p => <Ico {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcoTrash   = p => <Ico {...p} d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />;
const IcoSearch  = p => <Ico {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const IcoPlus    = p => <Ico {...p} d="M12 5v14M5 12h14" />;
const IcoRefresh = p => <Ico {...p} d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-5.02" />;
const IcoLogout  = p => <Ico {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const IcoEye     = p => <Ico {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IcoEyeOff  = p => <Ico {...p} d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />;
const IcoX       = p => <Ico {...p} d="M18 6L6 18M6 6l12 12" />;
const IcoCheck   = p => <Ico {...p} d="M20 6L9 17l-5-5" />;
const IcoPhone   = p => <Ico {...p} size={13} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1H6.6a2 2 0 0 1 2 1.72c.13.96.34 1.9.66 2.8a2 2 0 0 1-.45 2.11L7.6 8.84A16 16 0 0 0 13.16 14.4l1.21-1.21a2 2 0 0 1 2.11-.45c.9.32 1.84.53 2.8.66A2 2 0 0 1 21.07 15.16z" />;

// ─────────────────────────────────────────────────────────────
//  TOKEN MODAL
// ─────────────────────────────────────────────────────────────
function TokenModal({ user, onClose, onConfirm }) {
  const [amount, setAmount]   = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const num = parseInt(amount, 10);
    if (!num || num <= 0) return;
    setLoading(true);
    await onConfirm(user._id, num);
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      background: "rgba(3,2,10,0.85)", backdropFilter: "blur(16px)",
    }}>
      <div style={{
        background: `linear-gradient(145deg, ${T.bg2}, ${T.bg3})`,
        border: `1px solid ${T.borderH}`,
        borderRadius: 20, padding: "1.75rem",
        width: "100%", maxWidth: 420,
        boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px ${T.border}`,
        animation: "fadeUp 0.25s ease",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ fontSize: 11, color: T.t3, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Add Tokens</p>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: T.t1 }}>{user.name}</h3>
            <p style={{ fontSize: 12, color: T.purpleL, marginTop: 3 }}>
              Current balance: <strong>{(user.tokens || 0).toLocaleString()}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "0.45rem", color: T.t3, cursor: "pointer",
            display: "flex", alignItems: "center",
          }}>
            <IcoX size={16} />
          </button>
        </div>

        {success ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "1.5rem 0", color: T.green }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IcoCheck size={22} stroke={T.green} sw={2.5} />
            </div>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: T.t1 }}>Tokens added successfully!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: 10, color: T.t3, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>Amount</label>
              <input
                type="number" min="1" value={amount} autoFocus
                onChange={e => setAmount(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. 500"
                style={{
                  width: "100%", background: T.bg1, border: `1px solid ${T.border}`,
                  borderRadius: 12, padding: "0.875rem 1rem",
                  color: T.t1, fontSize: "1.3rem", fontWeight: 800,
                  fontFamily: "'DM Mono', monospace", outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = T.borderH}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              {amount && parseInt(amount) > 0 && (
                <p style={{ fontSize: 12, color: T.indigoL, marginTop: "0.5rem" }}>
                  New total: <strong>{((user.tokens || 0) + parseInt(amount)).toLocaleString()}</strong> tokens
                </p>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {[50, 100, 500, 1000].map(p => (
                <button key={p} onClick={() => setAmount(String(p))} style={{
                  background: amount === String(p) ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${amount === String(p) ? T.borderH : T.border}`,
                  borderRadius: 10, padding: "0.5rem 0",
                  color: amount === String(p) ? T.indigoL : T.t3,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                }}>+{p}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={onClose} style={{
                flex: 1, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "0.75rem", color: T.t2,
                fontWeight: 600, cursor: "pointer", fontSize: 13,
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={!amount || parseInt(amount) <= 0 || loading} style={{
                flex: 2,
                background: !amount || parseInt(amount) <= 0 ? "rgba(79,70,229,0.2)" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "0.75rem", color: "white",
                fontWeight: 700, cursor: !amount || parseInt(amount) <= 0 ? "not-allowed" : "pointer",
                fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                opacity: loading ? 0.7 : 1,
                boxShadow: !amount || parseInt(amount) <= 0 ? "none" : "0 4px 18px rgba(79,70,229,0.4)",
                transition: "all 0.2s",
              }}>
                {loading
                  ? <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                  : <IcoPlus size={15} />}
                {loading ? "Adding…" : "Add Tokens"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  LOGIN PAGE
// ─────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const handleLogin = async () => {
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 500));
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      onLogin();
    } else {
      setShake(true);
      setError("Invalid credentials. Access denied.");
      setTimeout(() => setShake(false), 600);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg1,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", fontFamily: T.font, position: "relative", overflow: "hidden",
    }}>
      <GlobalCSS />

      {/* Ambient glow — identical to landing */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "48vw", height: "52vh", background: "radial-gradient(circle,rgba(79,70,229,.13) 0%,transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "38vw", height: "44vh", background: "radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "10%", width: "42vw", height: "40vh", background: "radial-gradient(circle,rgba(124,58,237,.09) 0%,transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div style={{
        width: "100%", maxWidth: 420, position: "relative", zIndex: 1,
        animation: shake ? "shake 0.5s ease" : "fadeUp 0.6s ease both",
      }}>
        {/* Branding */}
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <div style={{
            width: 62, height: 62, margin: "0 auto 1rem",
            background: "linear-gradient(135deg, rgba(79,70,229,0.22), rgba(124,58,237,0.12))",
            border: `1px solid ${T.borderH}`,
            borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "float 3s ease-in-out infinite",
            boxShadow: "0 0 40px rgba(79,70,229,0.2)",
          }}>
            <IcoShield size={26} stroke={T.indigoL} />
          </div>

          {/* Same pill badge style as landing hero */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(79,70,229,0.1)", border: "1px solid rgba(99,102,241,0.28)",
            borderRadius: 30, padding: "5px 14px", marginBottom: 14,
          }}>
            <span style={{ color: T.purpleL, fontSize: 13 }}>✦</span>
            <span style={{ color: T.purpleL, fontSize: 13, fontWeight: 600 }}>MyAutoBot · Admin Portal</span>
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: T.t1, letterSpacing: -0.5, margin: 0 }}>
            Super Admin
          </h1>
          <p style={{ fontSize: 12, color: T.t3, marginTop: 6, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
            RESTRICTED — AUTHORIZED ACCESS ONLY
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))",
          border: `1px solid ${T.border}`,
          borderRadius: 22, padding: "1.75rem",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 12, padding: "0.7rem 1rem", marginBottom: "1.25rem",
              fontSize: 13, color: "#fca5a5",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <IcoX size={14} stroke="#fca5a5" sw={2.5} /> {error}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 10, color: T.t3, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Admin Email
            </label>
            <input
              type="email" value={email} placeholder="admin@domain.com"
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%", background: T.bg0, border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "0.8rem 1rem",
                color: T.t1, fontSize: 14, fontFamily: T.font,
                outline: "none", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = T.borderH}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: 10, color: T.t3, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"} value={password} placeholder="••••••••••"
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", background: T.bg0, border: `1px solid ${T.border}`,
                  borderRadius: 12, padding: "0.8rem 3rem 0.8rem 1rem",
                  color: T.t1, fontSize: 14, fontFamily: T.font,
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = T.borderH}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              <button onClick={() => setShowPw(v => !v)} style={{
                position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: T.t3, cursor: "pointer", padding: 0,
                display: "flex", alignItems: "center",
              }}>
                {showPw ? <IcoEyeOff size={16} /> : <IcoEye size={16} />}
              </button>
            </div>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{
            width: "100%",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            border: "none", borderRadius: 12, padding: "0.875rem",
            color: "white", fontSize: 15, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem",
            boxShadow: "0 6px 26px rgba(79,70,229,0.42)",
            transition: "all 0.2s",
          }}>
            {loading
              ? <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> Authenticating…</>
              : <><IcoShield size={16} stroke="white" /> Authorize Access</>}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: "1.25rem" }}>
          <IcoCheck size={12} stroke={T.green} sw={2.5} />
          <span style={{ fontSize: 12, color: T.t3, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>
            All access attempts are logged
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  STAT CARD — mirrors landing page stats bar
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, gradient }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${T.border}`,
      borderRadius: 18, padding: "1.25rem 1.5rem",
    }}>
      <p style={{ fontSize: 10, color: T.t3, letterSpacing: "0.14em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>{label}</p>
      <p style={{
        fontSize: "clamp(28px,3.5vw,38px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: "0.25rem",
        backgroundImage: gradient,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{value}</p>
      <p style={{ fontSize: 12, color: T.t3 }}>{sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [tokenModal, setTokenModal] = useState(null);
  const [toast, setToast]           = useState(null);
  const [deleting, setDeleting]     = useState(null);
  const [sortBy, setSortBy]         = useState("createdAt");
  const [sortDir, setSortDir]       = useState("desc");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getUsers();
      setUsers(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("[Admin] fetchUsers:", err);
      showToast("Failed to fetch users — check console", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAddTokens = async (userId, amount) => {
    try {
      await adminApi.addTokens(userId, amount);
      showToast(`+${amount} tokens added successfully`);
      fetchUsers();
    } catch {
      showToast("Failed to add tokens", "error");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete "${user.name}"? This cannot be undone.`)) return;
    setDeleting(user._id);
    try {
      await adminApi.deleteUser(user._id);
      showToast(`${user.name} removed`);
      fetchUsers();
    } catch {
      showToast("Failed to delete user", "error");
    } finally {
      setDeleting(null);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("desc"); }
  };

  const filtered = users
    .filter(u =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.contact?.includes(search)
    )
    .sort((a, b) => {
      let va = a[sortBy] ?? "", vb = b[sortBy] ?? "";
      if (sortBy === "tokens")    { va = va || 0; vb = vb || 0; }
      if (sortBy === "createdAt") { va = new Date(va); vb = new Date(vb); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const stats = {
    total:       users.length,
    totalTokens: users.reduce((s, u) => s + (u.tokens || 0), 0),
    avgTokens:   users.length ? Math.round(users.reduce((s, u) => s + (u.tokens || 0), 0) / users.length) : 0,
    withContact: users.filter(u => u.contact).length,
  };

  // Avatar palette — indigo / purple / blue / green / amber / pink, same as landing role cards
  const avatarPalette = [
    ["rgba(79,70,229,0.22)",  "#818cf8"],
    ["rgba(124,58,237,0.22)", "#a78bfa"],
    ["rgba(59,130,246,0.22)", "#93c5fd"],
    ["rgba(16,185,129,0.18)", "#6ee7b7"],
    ["rgba(245,158,11,0.18)", "#fcd34d"],
    ["rgba(236,72,153,0.18)", "#f9a8d4"],
  ];

  const SortArrow = ({ field }) => {
    if (sortBy !== field) return <span style={{ opacity: 0.25, marginLeft: 4, fontSize: 10 }}>↕</span>;
    return <span style={{ color: T.indigoL, marginLeft: 4, fontSize: 10 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg1, color: T.t2, fontFamily: T.font }}>
      <GlobalCSS />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 100,
          background: toast.type === "error" ? "rgba(239,68,68,0.92)" : "rgba(22,163,74,0.92)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
          borderRadius: 12, padding: "0.7rem 1.1rem",
          fontSize: 13, fontWeight: 600, color: "white",
          animation: "slideIn 0.3s ease",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", gap: "0.5rem",
        }}>
          {toast.type === "error" ? <IcoX size={14} stroke="white" sw={2.5} /> : <IcoCheck size={14} stroke="white" sw={2.5} />}
          {toast.msg}
        </div>
      )}

      {tokenModal && (
        <TokenModal user={tokenModal} onClose={() => setTokenModal(null)} onConfirm={handleAddTokens} />
      )}

      {/* Ambient glow — same as landing */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-5%", left: "-5%", width: "40vw", height: "45vh", background: "radial-gradient(circle,rgba(79,70,229,.1) 0%,transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "35vw", height: "40vh", background: "radial-gradient(circle,rgba(59,130,246,.06) 0%,transparent 70%)", borderRadius: "50%" }} />
      </div>

      

      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "5.25rem 1.75rem 5rem", position: "relative", zIndex: 1 }}>

        {/* Page heading */}
        <div style={{ marginBottom: "1.75rem", animation: "fadeUp 0.5s ease both" }}>
          {/* Section label — same style as landing section labels */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: T.purpleL, textTransform: "uppercase", marginBottom: 10 }}>
            Control Panel
          </div>
          <h1 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, color: T.t1, letterSpacing: -0.8, marginBottom: 8, lineHeight: 1.1 }}>
            User Management
          </h1>
          <p style={{ fontSize: 15, color: T.t2, lineHeight: 1.7, maxWidth: 560 }}>
            All registered accounts on your platform — manage tokens, search, sort, and remove users in real time.
          </p>
        </div>

        {/* Stats — same gradient number style as landing stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.75rem", animation: "fadeUp 0.55s ease both" }}>
          <StatCard label="Total Users"   value={stats.total.toLocaleString()}       sub="registered accounts"   gradient="linear-gradient(135deg,#818cf8,#60a5fa)" />
          <StatCard label="Total Tokens"  value={stats.totalTokens.toLocaleString()} sub="in circulation"        gradient="linear-gradient(135deg,#4ade80,#22c55e)" />
          <StatCard label="Avg per User"  value={stats.avgTokens.toLocaleString()}   sub="tokens per account"    gradient="linear-gradient(135deg,#93c5fd,#3b82f6)" />
          <StatCard label="With Mobile"   value={stats.withContact}                  sub={`of ${stats.total} users`} gradient="linear-gradient(135deg,#fcd34d,#f59e0b)" />
        </div>

        {/* Table card — same card style as landing feature grid cards */}
        <div style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          border: `1px solid ${T.border}`,
          borderRadius: 22, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "fadeUp 0.6s ease both",
        }}>
          {/* Toolbar */}
          <div style={{
            padding: "1.1rem 1.5rem",
            borderBottom: `1px solid ${T.border}`,
            background: "rgba(79,70,229,0.025)",
            display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                background: "rgba(79,70,229,0.1)", border: "1px solid rgba(99,102,241,0.28)",
                borderRadius: 10, padding: "0.45rem",
                display: "flex", alignItems: "center", color: T.indigoL,
              }}>
                <IcoUsers size={17} stroke={T.indigoL} />
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: T.t1, margin: 0 }}>User Directory</h2>
                <p style={{ fontSize: 11, color: T.t3, margin: 0 }}>{filtered.length} of {users.length} records</p>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: T.t3, display: "flex" }}>
                <IcoSearch size={14} />
              </span>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, phone…"
                style={{
                  background: T.bg0, border: `1px solid ${T.border}`,
                  borderRadius: 10, padding: "0.55rem 1rem 0.55rem 2.25rem",
                  color: T.t1, fontSize: 13, fontFamily: T.font,
                  outline: "none", width: 240, transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = T.borderH}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>

            <button onClick={fetchUsers} title="Refresh" style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "0.55rem 0.65rem", color: T.t3, cursor: "pointer",
              display: "flex", alignItems: "center", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.color = T.t1; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; }}
            >
              <span style={{ display: "inline-block", animation: loading ? "spin 0.7s linear infinite" : "none" }}>
                <IcoRefresh size={15} />
              </span>
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 36, height: 36, border: "3px solid rgba(99,102,241,0.15)", borderTopColor: T.indigoL, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                <p style={{ fontSize: 12, color: T.t3, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>LOADING USER DATA…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "5rem", textAlign: "center", color: T.t3, fontSize: 15 }}>
                No users match your search.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.015)" }}>
                    {[
                      { label: "User",       field: "name" },
                      { label: "Email",      field: "email" },
                      { label: "Mobile",     field: "contact" },
                      { label: "Tokens",     field: "tokens" },
                      { label: "Registered", field: "createdAt" },
                      { label: "Actions",    field: null },
                    ].map(({ label, field }) => (
                      <th key={label} onClick={() => field && toggleSort(field)} style={{
                        padding: "0.75rem 1.25rem",
                        fontSize: 10, color: T.t3,
                        letterSpacing: "0.14em", fontWeight: 700,
                        textTransform: "uppercase", textAlign: "left",
                        cursor: field ? "pointer" : "default",
                        userSelect: "none", whiteSpace: "nowrap",
                      }}>
                        {label}{field && <SortArrow field={field} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => {
                    const [avatarBg, avatarFg] = avatarPalette[i % avatarPalette.length];
                    return (
                      <tr key={user._id} className="user-row" style={{ borderTop: `1px solid ${T.border}`, transition: "background 0.15s" }}>

                        {/* Name + avatar */}
                        <td style={{ padding: "0.9rem 1.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                              background: avatarBg, border: `1px solid ${avatarFg}44`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, fontWeight: 800, color: avatarFg,
                            }}>
                              {user.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: T.t1, margin: 0 }}>{user.name}</p>
                              {user.referralCode && (
                                <p style={{ fontSize: 10, color: T.t3, margin: 0, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>
                                  REF: {user.referralCode}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: "0.9rem 1.25rem" }}>
                          <span style={{ fontSize: 12, color: T.t2, fontFamily: "'DM Mono', monospace" }}>{user.email}</span>
                        </td>

                        {/* Mobile */}
                        <td style={{ padding: "0.9rem 1.25rem" }}>
                          {user.contact ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <IcoPhone stroke={T.t3} />
                              <span style={{ fontSize: 12, color: T.t2, fontFamily: "'DM Mono', monospace" }}>{user.contact}</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 13, color: T.t3 }}>—</span>
                          )}
                        </td>

                        {/* Tokens — indigo pill, same border/bg pattern as landing */}
                        <td style={{ padding: "0.9rem 1.25rem" }}>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: "0.375rem",
                            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)",
                            borderRadius: 8, padding: "0.25rem 0.625rem",
                          }}>
                            <span style={{ color: T.indigoL, fontSize: 9 }}>◈</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: T.indigoL, fontFamily: "'DM Mono', monospace" }}>
                              {(user.tokens || 0).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        {/* Registered */}
                        <td style={{ padding: "0.9rem 1.25rem" }}>
                          <span style={{ fontSize: 11, color: T.t3, fontFamily: "'DM Mono', monospace" }}>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "0.9rem 1.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <button onClick={() => setTokenModal(user)} style={{
                              display: "flex", alignItems: "center", gap: "0.375rem",
                              background: "rgba(79,70,229,0.08)", border: "1px solid rgba(99,102,241,0.22)",
                              borderRadius: 9, padding: "0.375rem 0.75rem",
                              color: T.indigoL, fontSize: 12, fontWeight: 600,
                              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,70,229,0.18)"; e.currentTarget.style.borderColor = T.borderH; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(79,70,229,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.22)"; }}
                            >
                              <IcoPlus size={13} stroke={T.indigoL} /> Tokens
                            </button>

                            <button onClick={() => handleDelete(user)} disabled={deleting === user._id} style={{
                              background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
                              borderRadius: 9, padding: "0.375rem 0.5rem",
                              color: "#fca5a5", cursor: "pointer",
                              display: "flex", alignItems: "center",
                              opacity: deleting === user._id ? 0.5 : 1,
                              transition: "all 0.15s",
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.18)"; }}
                            >
                              {deleting === user._id
                                ? <span style={{ display: "inline-block", width: 13, height: 13, border: "2px solid rgba(252,165,165,0.3)", borderTopColor: "#fca5a5", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                                : <IcoTrash size={14} stroke="#fca5a5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {!loading && (
            <div style={{
              padding: "0.75rem 1.5rem",
              borderTop: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: 11, color: T.t3,
              fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em",
            }}>
              <span>SHOWING {filtered.length} RECORDS</span>
              <span>SORTED BY {sortBy.toUpperCase()} {sortDir === "asc" ? "↑" : "↓"}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────────
export default function SuperAdminPanel() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("adminAuth") === "true");

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setAuthed(false);
  };

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={handleLogout} />;
}