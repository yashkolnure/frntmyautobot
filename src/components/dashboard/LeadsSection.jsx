import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
const IcoMail     = p => <Ico {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const IcoPhone    = p => <Ico {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1H6.6a2 2 0 0 1 2 1.72c.13.96.34 1.9.66 2.8a2 2 0 0 1-.45 2.11L7.6 8.84A16 16 0 0 0 13.16 14.4l1.21-1.21a2 2 0 0 1 2.11-.45c.9.32 1.84.53 2.8.66A2 2 0 0 1 21.07 15.16z" />;
const IcoCal      = p => <Ico {...p} d="M3 9h18M3 4h18v17H3zM16 2v4M8 2v4" />;
const IcoTrash    = p => <Ico {...p} d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />;
const IcoUsers    = p => <Ico {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcoDatabase = p => <Ico {...p} d="M12 2C6.477 2 2 3.567 2 5.5v13C2 20.433 6.477 22 12 22s10-1.567 10-3.5v-13C22 3.567 17.523 2 12 2zM2 5.5C2 7.433 6.477 9 12 9s10-1.567 10-3.5M2 12c0 1.933 4.477 3.5 10 3.5s10-1.567 10-3.5" />;

// ─── STATUS CONFIG ────────────────────────────────────────────────────
const STATUS_CFG = {
  New:       { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', color: '#818cf8' },
  Contacted: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.28)', color: '#fcd34d' },
  Closed:    { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.28)',  color: '#4ade80' },
};

export default function LeadsSection() {
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All');

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
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
      setLeads(leads.map(l => l._id === id ? { ...l, status: newStatus } : l));
    } catch {
      alert('Failed to update status');
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Permanently delete this lead record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter(l => l._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const filteredLeads = filter === 'All' ? leads : leads.filter(l => l.status === filter);

  const card = {
    background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
    border: `1px solid ${T.border}`,
    borderRadius: 20,
  };

  // ── LOADING ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '1.25rem', fontFamily: T.font }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(99,102,241,0.15)`, borderTopColor: T.indigoL, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 30, padding: '5px 14px' }}>
        <span style={{ color: T.purpleL }}>✦</span>
        <span style={{ color: T.purpleL, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: T.mono }}>Scanning Lead Database…</span>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: '5rem', fontFamily: T.font }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .lead-row:hover td { background: rgba(99,102,241,0.04) !important; }
        .lead-row:hover .lead-msg { opacity: 1 !important; }
        .lead-row:hover .lead-del { opacity: 1 !important; }
        .leads-scroll::-webkit-scrollbar { height: 4px; }
        .leads-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 99px; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', animation: 'fadeUp 0.45s ease both' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: T.purpleL, textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 8 }}>
            Lead Intelligence
          </div>
          <h1 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, color: T.t1, letterSpacing: -0.6, margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            Captured Intelligence
            <IcoDatabase size={22} stroke={T.indigoL} />
          </h1>
          <p style={{ fontSize: 12, color: T.t3, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.mono, margin: 0 }}>
            Verified contact data extracted from AI conversations
          </p>
        </div>

        {/* Filter tabs — matching landing nav pill style */}
        <div style={{
          display: 'flex', gap: '0.25rem',
          background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
          borderRadius: 14, padding: '4px',
          backdropFilter: 'blur(10px)',
        }}>
          {['All', 'New', 'Contacted', 'Closed'].map(f => {
            const active = filter === f;
            const cfg = STATUS_CFG[f] || {};
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 18px', borderRadius: 10,
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: T.font,
                border: active ? `1px solid ${cfg.border || T.borderH}` : '1px solid transparent',
                background: active ? (cfg.bg || 'rgba(99,102,241,0.12)') : 'transparent',
                color: active ? (cfg.color || T.indigoL) : T.t3,
                transition: 'all 0.2s',
                boxShadow: active ? `0 0 12px ${cfg.bg || 'rgba(99,102,241,0.2)'}` : 'none',
              }}>
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── EMPTY STATE ─────────────────────────────────────────── */}
      {filteredLeads.length === 0 ? (
        <div style={{
          ...card,
          border: `2px dashed ${T.border}`,
          borderRadius: 24,
          padding: '6rem 2rem',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          animation: 'fadeUp 0.5s ease both',
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, background: 'radial-gradient(circle,rgba(79,70,229,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: 'rgba(79,70,229,0.08)', border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.t3,
            }}>
              <IcoUsers size={30} stroke={T.t3} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: T.t1, letterSpacing: -0.3, margin: 0 }}>No Intelligence Found</h3>
            <p style={{ fontSize: 14, color: T.t3, maxWidth: 380, lineHeight: 1.7, margin: 0 }}>
              When customers provide contact details to your agent, the extracted data will populate here.
            </p>
          </div>
        </div>
      ) : (
        /* ── TABLE ────────────────────────────────────────────── */
        <div style={{ ...card, overflow: 'hidden', animation: 'fadeUp 0.5s ease both', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div className="leads-scroll" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${T.border}` }}>
                  {['Contact Identity', 'Contextual Trigger', 'Capture Date', 'Lead Status', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '0.75rem 1.25rem',
                      fontSize: 9, color: T.t3,
                      letterSpacing: '0.16em', fontWeight: 700,
                      textTransform: 'uppercase', textAlign: i === 4 ? 'right' : 'left',
                      fontFamily: T.mono, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const isEmail = lead.contact.includes('@');
                  const sc = STATUS_CFG[lead.status] || STATUS_CFG.New;
                  return (
                    <tr key={lead._id} className="lead-row" style={{ borderTop: `1px solid ${T.border}`, transition: 'background 0.15s' }}>

                      {/* Contact */}
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            padding: '0.45rem',
                            background: isEmail ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
                            border: `1px solid ${isEmail ? 'rgba(59,130,246,0.28)' : 'rgba(34,197,94,0.28)'}`,
                            borderRadius: 9, display: 'flex',
                            color: isEmail ? '#93c5fd' : '#4ade80',
                          }}>
                            {isEmail ? <IcoMail size={15} stroke="currentColor" /> : <IcoPhone size={15} stroke="currentColor" />}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: T.t1, fontFamily: T.mono }}>
                            {lead.contact}
                          </span>
                        </div>
                      </td>

                      {/* Last message */}
                      <td style={{ padding: '0.875rem 1.25rem', maxWidth: 260 }}>
                        <p className="lead-msg" style={{
                          fontSize: 13, color: T.t2, fontStyle: 'italic',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          margin: 0, opacity: 0.65, transition: 'opacity 0.2s',
                        }}>
                          "{lead.lastMessage}"
                        </p>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <IcoCal size={11} stroke={T.t3} />
                          <span style={{ fontSize: 11, color: T.t3, fontFamily: T.mono }}>
                            {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* Status select */}
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <select
                          value={lead.status}
                          onChange={e => updateStatus(lead._id, e.target.value)}
                          style={{
                            appearance: 'none',
                            background: sc.bg, border: `1px solid ${sc.border}`,
                            borderRadius: 9, padding: '0.35rem 0.875rem',
                            color: sc.color, fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            fontFamily: T.mono, cursor: 'pointer', outline: 'none',
                          }}
                        >
                          <option value="New"       style={{ background: T.bg2, color: T.t1 }}>NEW</option>
                          <option value="Contacted"  style={{ background: T.bg2, color: T.t1 }}>CONTACTED</option>
                          <option value="Closed"     style={{ background: T.bg2, color: T.t1 }}>CLOSED</option>
                        </select>
                      </td>

                      {/* Delete */}
                      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                        <button
                          className="lead-del"
                          onClick={() => deleteLead(lead._id)}
                          title="Delete record"
                          style={{
                            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)',
                            borderRadius: 9, padding: '0.4rem 0.5rem',
                            color: '#fca5a5', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center',
                            opacity: 0, transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
                        >
                          <IcoTrash size={15} stroke="#fca5a5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* footer */}
          <div style={{
            padding: '0.75rem 1.5rem',
            borderTop: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 10, color: T.t3, fontFamily: T.mono, letterSpacing: '0.1em',
          }}>
            <span>SHOWING {filteredLeads.length} OF {leads.length} RECORDS</span>
            <span>FILTER: {filter.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
}