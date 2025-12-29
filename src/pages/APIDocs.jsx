import React, { useState } from 'react';
import { 
  Terminal, Copy, 
  Code2, Hash, 
  CheckCircle2
} from 'lucide-react';

const APIDocs = () => {
  const [activeEndpoint, setActiveEndpoint] = useState('get-leads');

  const menu = [
    { group: "Introduction", items: ["Authentication", "Rate Limits"] },
    { group: "Endpoints", items: ["Get Leads", "Send Message", "Bot Status"] },
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 pb-20 relative overflow-hidden">
      
      {/* --- 1. BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[50vw] h-[50vh] bg-purple-900/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-[#0b031a]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[800px]">
          
          {/* --- 2. SIDEBAR NAV --- */}
          <aside className="w-full lg:w-72 border-r border-white/5 bg-black/20 p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest">API v2.0</span>
            </div>

            <nav className="space-y-8">
              {menu.map((group) => (
                <div key={group.group} className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{group.group}</h4>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li 
                        key={item}
                        onClick={() => setActiveEndpoint(item.toLowerCase().replace(' ', '-'))}
                        className={`text-sm font-bold cursor-pointer transition-all flex items-center gap-2 ${
                          activeEndpoint === item.toLowerCase().replace(' ', '-') 
                          ? 'text-purple-400 translate-x-1' 
                          : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {activeEndpoint === item.toLowerCase().replace(' ', '-') && <div className="w-1 h-1 bg-purple-400 rounded-full" />}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* --- 3. MAIN CONTENT (Documentation) --- */}
          <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
            <div className="max-w-3xl">
              
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-center gap-2 text-purple-500 mb-4">
                  <Hash size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Methods / Leads</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-6">
                  Get All <span className="text-purple-500">Leads.</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  This endpoint returns a list of all leads captured by your bot across all channels (WhatsApp, Instagram, and Web). 
                  You can filter them by date or status.
                </p>
              </div>

              {/* Endpoint Badge */}
              <div className="flex items-center gap-4 mb-10 bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-lg uppercase border border-emerald-500/30">GET</span>
                <code className="text-purple-300 font-mono text-xs">https://api.myautobot.ai/v1/leads</code>
              </div>

              {/* Parameters Table */}
              <div className="mb-12">
                <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 border-l-2 border-purple-500 pl-4">Query Parameters</h3>
                <div className="space-y-4">
                  {[
                    { name: 'limit', type: 'integer', desc: 'Number of results per page (max 100).' },
                    { name: 'status', type: 'string', desc: 'Filter by "qualified", "interested", or "new".' }
                  ].map((param) => (
                    <div key={param.name} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border-b border-white/5">
                      <code className="text-purple-400 font-bold text-sm w-24">{param.name}</code>
                      <span className="text-[10px] text-slate-500 font-mono uppercase italic">{param.type}</span>
                      <p className="text-slate-400 text-sm">{param.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* --- 4. CODE EXAMPLES (Dark Column) --- */}
          <aside className="w-full lg:w-[450px] bg-black/40 border-l border-white/5 p-8 lg:p-12 relative">
            <div className="sticky top-12">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Request Example</h4>
              
              <div className="bg-[#05010d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-tighter">Curl</span>
                  </div>
                  <Copy size={14} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="p-6 font-mono text-xs leading-loose overflow-x-auto">
                  <p className="text-white">curl <span className="text-purple-400">https://api.myautobot.ai/v1/leads</span> \</p>
                  <p className="text-white ml-8">-H <span className="text-green-400">"Authorization: Bearer KEY"</span> \</p>
                  <p className="text-white ml-8">-G -d <span className="text-purple-300">limit=10</span></p>
                </div>
              </div>

              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-12 mb-6">Response Example</h4>
              
              <div className="bg-[#05010d] border border-white/10 rounded-2xl p-6 font-mono text-[11px] leading-relaxed relative group">
                <div className="absolute top-4 right-4 animate-pulse">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <pre className="text-slate-300">
{`{
  "status": "success",
  "data": [
    {
      "id": "ld_912",
      "name": "Alex Rivera",
      "email": "alex@agency.com",
      "intent": "Enterprise Quote",
      "source": "Instagram"
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default APIDocs;