import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Utensils, Home, ShoppingBag, Briefcase, Stethoscope, 
  GraduationCap, Car, Plane, ArrowRight, Zap, 
  CheckCircle, Bot, Sparkles, Rocket
} from 'lucide-react';

const CaseCard = ({ icon: Icon, industry, title, scenarios, color }) => (
  <div className="group relative p-8 lg:p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:bg-[#0b031a]/90 hover:border-purple-500/40">
    <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity ${color}`}>
      <Icon size={160} />
    </div>

    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-black/40 border border-white/10 ${color} shadow-2xl transition-transform group-hover:scale-110`}>
        <Icon size={28} />
      </div>

      <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${color}`}>
        {industry}
      </p>
      
      <h3 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter italic mb-6">
        {title}
      </h3>

      <div className="space-y-4 mb-8">
        {scenarios.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle size={14} className="mt-1 text-purple-500 shrink-0" />
            <p className="text-slate-400 text-sm font-medium leading-relaxed">{s}</p>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deploy Template</span>
        <ArrowRight size={16} className="text-purple-500" />
      </div>
    </div>
  </div>
);

const UseCases = () => {
  const industries = [
    {
      industry: "Hospitality",
      icon: Utensils,
      color: "text-orange-400",
      title: "Restaurants & Cafes",
      scenarios: [
        "Automated table reservations and waitlist management via WhatsApp.",
        "Instant PDF menu sharing and specialized daily recommendation bots.",
        "Order status tracking and collection of customer feedback post-dining."
      ]
    },
    {
      industry: "Real Estate",
      icon: Home,
      color: "text-blue-400",
      title: "Property & Leasing",
      scenarios: [
        "Pre-qualifying buyers by collecting budget and location requirements.",
        "Automated booking for property walkthroughs and virtual tours.",
        "Sending brochures and payment plans instantly upon inquiry."
      ]
    },
    {
      industry: "E-Commerce",
      icon: ShoppingBag,
      color: "text-fuchsia-400",
      title: "Online Retailers",
      scenarios: [
        "24/7 product availability checks and sizing guide assistance.",
        "Cart abandonment recovery through personalized Instagram DMs.",
        "Automated order confirmation and shipping tracking updates."
      ]
    },
    {
      industry: "B2B Agencies",
      icon: Briefcase,
      color: "text-purple-400",
      title: "Marketing & SaaS",
      scenarios: [
        "White-label bot deployment for agency clients via Avenirya infrastructure.",
        "Qualifying inbound leads before they reach the sales team.",
        "24/7 technical support and FAQ handling for software users."
      ]
    },
    {
      industry: "Healthcare",
      icon: Stethoscope,
      color: "text-emerald-400",
      title: "Clinics & Wellness",
      scenarios: [
        "Booking medical appointments and sending automated reminders.",
        "Answering FAQs about services, insurance, and doctor availability.",
        "Pre-consultation data collection for smoother patient intake."
      ]
    },
    {
      industry: "Education",
      icon: GraduationCap,
      color: "text-cyan-400",
      title: "Schools & EdTech",
      scenarios: [
        "Handling admission inquiries and sharing course brochures.",
        "Automated fee payment reminders and receipt generation.",
        "24/7 student support for common portal and course questions."
      ]
    },
    {
      industry: "Automotive",
      icon: Car,
      color: "text-red-400",
      title: "Dealerships",
      scenarios: [
        "Scheduling test drives and service appointments via WhatsApp.",
        "Sending vehicle specifications and on-road pricing details.",
        "Instant trade-in value estimations based on user input."
      ]
    },
    {
      industry: "Travel",
      icon: Plane,
      color: "text-indigo-400",
      title: "Tours & Travels",
      scenarios: [
        "Sharing customized holiday itineraries based on destination.",
        "Collecting traveler details for visa processing and bookings.",
        "Instant customer support for flight changes or hotel check-ins."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#05010d] pt-32 lg:pt-40 pb-24 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-purple-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-pulse">
            <Sparkles size={14} /> Diverse Industry Solutions
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-8">
            Built for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600">
              Every Workflow.
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 font-medium leading-relaxed">
            From local businesses to global agencies, MyAutoBot provides the specialized automation needed to capture leads 24/7.
          </p>
        </div>

        {/* --- USE CASE GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          {industries.map((item, idx) => (
            <CaseCard key={idx} {...item} />
          ))}
        </div>

        {/* --- PERFORMANCE HIGHLIGHT --- */}
        <section className="py-24 px-10 lg:px-20 rounded-[4rem] bg-gradient-to-br from-[#0b031a] to-black border border-white/10 relative overflow-hidden mb-32">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-600/5 blur-[100px] pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter mb-8 leading-tight">
                Optimized for <br /> Conversion.
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                Every bot deployment is optimized to utilize exactly **5 tokens per interaction**, ensuring maximum ROI for your specific use case.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-white font-black text-2xl mb-1">99.9%</p>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Uptime Guarantee</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-white font-black text-2xl mb-1">&lt;15s</p>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Response Latency</p>
                 </div>
              </div>
            </div>

            {/* Use Case Visualization */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative bg-[#05010d] border border-white/10 p-10 rounded-[3.5rem] shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                   <Bot className="text-purple-500" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Omni-Channel Status</span>
                </div>
                <div className="space-y-4">
                  {[
                    { channel: "WhatsApp", status: "Connected", val: "54 New Leads" },
                    { channel: "Instagram", status: "Active", val: "12 inquiries" },
                    { channel: "Website", status: "Syncing", val: "847 Visitors" }
                  ].map((ch, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-white font-bold italic">{ch.channel}</span>
                      <span className="text-purple-400 font-mono text-xs">{ch.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <div className="text-center">
          <Link 
            to="/login?id=register" 
            className="inline-flex px-12 py-6 bg-purple-600 text-white rounded-2xl font-black text-xl lg:text-2xl uppercase tracking-[0.1em] italic transition-all hover:bg-purple-500 hover:scale-105 active:scale-95 items-center gap-4 shadow-[0_20px_50px_rgba(168,85,247,0.4)]"
          >
            Start Your Deployment <Rocket size={28} />
          </Link>
          <p className="mt-8 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">
            Powered by Avenirya Solutions. Official Meta Tech Provider.
          </p>
        </div>

      </div>
    </div>
  );
};

export default UseCases;