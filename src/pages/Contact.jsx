import React from 'react';
import { Mail, Phone, MapPin, Send, Clock} from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#05010d] pt-32 pb-20 relative overflow-hidden">
      
      {/* --- 1. BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[60vw] h-[60vh] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vh] bg-fuchsia-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* --- 2. LEFT SIDE: CONTACT INFO --- */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-6">
                Talk to a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Human.</span>
              </h1>
              <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed max-w-md">
                Have a question about a custom plan or need technical help? Our team usually replies in <b>less than 2 hours.</b>
              </p>
            </div>

            <div className="grid gap-8">
              {/* Email Card */}
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Email Support</p>
                  <p className="text-white text-lg font-bold">hello@myautobot.ai</p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Call Our Office</p>
                  <p className="text-white text-lg font-bold">+1 (555) 000-2470</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Headquarters</p>
                  <p className="text-white text-lg font-bold">Avenirya Solutions, Pune 411021</p>
                </div>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-6 max-w-md">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Support Online</span>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Response: 1h 42m</span>
                </div>
            </div>
          </div>

          {/* --- 3. RIGHT SIDE: THE CONTACT FORM --- */}
          <div className="relative group">
            {/* Form Glow */}
            <div className="absolute inset-0 bg-purple-600/10 blur-[80px] rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative bg-[#0b031a]/60 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Send a Message</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Fill out the details below</p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject</label>
                  <select className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-all text-sm appearance-none cursor-pointer">
                    <option className="bg-[#0b031a]">General Inquiry</option>
                    <option className="bg-[#0b031a]">Technical Support</option>
                    <option className="bg-[#0b031a]">Partnership / Sales</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Message</label>
                  <textarea 
                    rows="4" 
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm" 
                    placeholder="How can myAutoBot help your business?"
                  ></textarea>
                </div>

                <button className="w-full relative group/btn overflow-hidden bg-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                  <span className="relative z-10">Send Inquiry</span>
                  <Send size={18} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;