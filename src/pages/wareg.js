import React, { useState } from 'react';

const WhatsAppRegister = () => {
  const [config, setConfig] = useState({
    token: '',
    phoneNumberId: '',
    pin: '',
    region: 'IN' // Recommended for India-based Avenirya Solutions
  });

  const [status, setStatus] = useState({ 
    loading: false, 
    message: '', 
    error: false, 
    details: null 
  });

  const regions = [
    { code: 'IN', name: 'India' },
    { code: 'AU', name: 'Australia' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'DE', name: 'Germany' },
    { code: 'BR', name: 'Brazil' },
    { code: 'US', name: 'USA' },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: 'Initiating registration...', error: false, details: null });

    // Note: We use v20.0 because v21.0+ has deprecated the standalone /register endpoint
    const url = `https://graph.facebook.com/v20.0/${config.phoneNumberId}/register`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          pin: config.pin,
          data_localization_region: config.region
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          loading: false, 
          message: 'Success! Your number is registered and connected.', 
          error: false 
        });
      } else {
        // Log the full error to the console for debugging
        console.error("Meta API Error:", data.error);
        
        setStatus({ 
          loading: false, 
          message: data.error?.message || 'Registration failed.', 
          error: true,
          details: data.error // Storing full error object
        });
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        message: 'Network error. Please check your internet or CORS settings.', 
        error: true 
      });
    }
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">WhatsApp Registration</h2>
          <p className="text-slate-400 text-sm mt-1">v20.0 Legacy Registration Bridge</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Access Token</label>
            <input
              type="password"
              name="token"
              value={config.token}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste Token Here"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number ID</label>
            <input
              type="text"
              name="phoneNumberId"
              value={config.phoneNumberId}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="884023..."
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">6-Digit PIN</label>
              <input
                type="text"
                name="pin"
                maxLength="6"
                value={config.pin}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="123456"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Region</label>
              <select
                name="region"
                value={config.region}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              >
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>{r.name} ({r.code})</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold text-sm uppercase tracking-widest transition-all ${
              status.loading ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500 shadow-lg'
            }`}
          >
            {status.loading ? 'Processing...' : 'Register Number'}
          </button>
        </form>

        {status.message && (
          <div className={`mt-6 p-4 rounded-lg text-sm ${
            status.error ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'bg-green-900/20 text-green-400 border border-green-900/50'
          }`}>
            <p className="font-bold">{status.message}</p>
            {status.details && (
              <div className="mt-2 text-xs opacity-80 bg-black/20 p-2 rounded">
                <p>Code: {status.details.code}</p>
                <p>Subcode: {status.details.error_subcode || 'None'}</p>
                <p>Type: {status.details.type}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppRegister;