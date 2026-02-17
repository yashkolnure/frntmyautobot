import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, MessageCircle } from 'lucide-react'; // Optional: for better icons

const WhatsAppDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    phoneNumberId: "",
    metaToken: ""
  });
  
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(false);
  const [bizId, setBizId] = useState('default_biz_id');
  const [loadingToggle, setLoadingToggle] = useState(false);

  const chatEndRef = useRef(null);
  const API_BASE = "http://127.0.0.1:5005/api/auth/webhook";
  const { phoneNumberId: PHONE_NUMBER_ID, metaToken: META_TOKEN } = credentials;

  useEffect(() => {
    const fetchInitialData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const historyRes = await axios.get(`${API_BASE}/messages?userId=${userId}`);
        setConversations(historyRes.data);

        const profileRes = await axios.get(`http://127.0.0.1:5005/api/user-profile/${userId}`);
        const user = profileRes.data;

        setIsAutoReplyEnabled(user.botConfig?.isManualPromptEnabled || false);
        setBizId(user.name || 'Avenirya User');
        
        setCredentials({
          phoneNumberId: user.whatsappBusinessId || "959176433945485",
          metaToken: user.whatsappToken || ""
        });
        
      } catch (err) { console.error("Initial load failed:", err); }
    };
  
    fetchInitialData();
    const interval = setInterval(fetchInitialData, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleAutoReply = async () => {
    const userId = localStorage.getItem('userId');
    setLoadingToggle(true);
    try {
      const res = await axios.post(`${API_BASE}/toggle-auto-reply`, {
        userId,
        enabled: !isAutoReplyEnabled
      });
      setIsAutoReplyEnabled(res.data.isAutoReplyEnabled);
    } catch (err) {
      alert("Failed to update AI settings");
    } finally {
      setLoadingToggle(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedContact]);

  const sendMessage = async (type, payload) => {
    if (!selectedContact) return;
    const userId = localStorage.getItem('userId');

    let metaData = { messaging_product: "whatsapp", to: selectedContact, type };
    if (type === 'text') metaData.text = { body: payload };
    if (type === 'image') metaData.image = { link: payload };
    if (type === 'location') metaData.location = payload;

    try {
      await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, metaData, {
        headers: { 'Authorization': `Bearer ${META_TOKEN}` }
      });

      await axios.post(`${API_BASE}/log-outgoing`, {
        userId,
        customerNumber: selectedContact,
        text: type === 'text' ? payload : `[Sent ${type}]`,
        source: 'whatsapp',
        type 
      });

      setReplyText("");
      setIsMenuOpen(false);
    } catch (err) { console.error("Send error:", err); }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendMessage('location', {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          name: "My Current Location"
        });
      });
    }
  };

  const whatsappChats = conversations.filter(conv => conv.messages.some(m => m.source === 'whatsapp'));
  const activeChat = whatsappChats.find(c => c.customerIdentifier === selectedContact);
  const messages = activeChat ? activeChat.messages.filter(m => m.source === 'whatsapp') : [];

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] font-sans text-[#111b21]">
      
      {/* --- SITE TOP HEADER --- */}
      <header className="h-12 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-[100]">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-[#008069] rounded-lg flex items-center justify-center text-white font-black">M</div>
          <span className="text-xl font-black tracking-tighter text-[#111b21]">
            MyAutoBot<span className="text-[#008069]"></span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '/dashboard'} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <div className="h-8 w-[1px] bg-gray-200 mx-2" />
          <button
           onClick={() => window.location.href = '/dashboard'} 
           className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Application Area (adjusted height for header) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-full bg-[#fff] h-full overflow-hidden">
          
          {/* Sidebar */}
          <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[450px] border-r border-[#d1d7db] bg-white`}>
            <header className="bg-[#f0f2f5] p-4 shrink-0 border-b border-[#d1d7db]">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3 text-[#008069] font-black text-lg uppercase tracking-tighter italic">
                    <MessageCircle className="text-[#008069]" /> {bizId}
                 </div>
                 <div className="flex gap-2">
                   <button className="hover:bg-gray-200 p-2 rounded-full transition-all">💬</button>
                   <button className="hover:bg-gray-200 p-2 rounded-full transition-all">⋮</button>
                 </div>
              </div>

              {/* AI TOGGLE CARD */}
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isAutoReplyEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                     🤖
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">AI Automation</span>
                    <span className="text-xs font-bold">{isAutoReplyEnabled ? 'AUTO-REPLY ACTIVE' : 'MANUAL MODE'}</span>
                  </div>
                </div>
                
                <button 
                  onClick={toggleAutoReply}
                  disabled={loadingToggle}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                    isAutoReplyEnabled ? 'bg-[#00a884]' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isAutoReplyEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </header>

            <div className="bg-white px-4 py-3 border-b border-[#f0f2f5]">
              <input type="text" placeholder="Search or start new chat" className="w-full bg-[#f0f2f5] rounded-lg px-4 py-2 text-sm focus:outline-none border-none focus:ring-1 ring-[#008069]" />
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white">
              {whatsappChats.map(conv => (
                <div key={conv._id} onClick={() => { setSelectedContact(conv.customerIdentifier); setIsSidebarOpen(false); }} className={`flex items-center p-3 cursor-pointer border-b border-[#f0f2f5] hover:bg-[#f5f6f6] transition-colors ${selectedContact === conv.customerIdentifier ? 'bg-[#f0f2f5]' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md uppercase">{conv.customerIdentifier.slice(-2)}</div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-[#111b21]">+{conv.customerIdentifier}</span>
                      <span className="text-[10px] text-[#667781] uppercase font-bold">{new Date(conv.lastInteraction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-[#667781] truncate mt-1">{conv.messages[conv.messages.length - 1]?.text || "New message"}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Chat Area */}
          <main className={`${!isSidebarOpen ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-[#efeae2] relative`}>
            {selectedContact ? (
              <>
                <header className="h-[60px] bg-[#f0f2f5] flex items-center px-4 border-b border-[#d1d7db] z-20 shadow-sm shrink-0">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-[#008069] text-2xl font-bold">←</button>
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0 uppercase">{selectedContact.slice(-2)}</div>
                  <div className="ml-3">
                    <h2 className="font-bold text-sm leading-tight">+{selectedContact}</h2>
                    <p className="text-[10px] text-[#00a884] font-black uppercase tracking-widest">online</p>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-2 relative">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`}}></div>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex z-10 relative ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[85%] lg:max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm text-[14.2px] relative ${msg.role === 'user' ? 'bg-[#fff] rounded-tl-none' : 'bg-[#dcf8c6] rounded-tr-none'}`}>
                        <div className={`absolute top-0 w-3 h-3 ${msg.role === 'user' ? '-left-2 bg-[#fff]' : '-right-2 bg-[#dcf8c6]'}`} style={{ clipPath: msg.role === 'user' ? 'polygon(100% 0, 0 0, 100% 100%)' : 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                        {msg.type === 'location' ? (
                          <div className="p-1">
                            <div className="bg-gray-200 h-24 w-full rounded-md flex items-center justify-center text-xs text-gray-600 mb-1 font-bold italic tracking-tighter uppercase">📍 GPS LOCATION</div>
                            <p className="text-[#111b21] underline cursor-pointer text-xs font-black italic uppercase">Open in Maps</p>
                          </div>
                        ) : ( <p className="leading-tight">{msg.text}</p> )}
                        <p className="text-[9px] text-[#667781] text-right mt-1 ml-4 uppercase font-bold">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <footer className="p-2.5 bg-[#f0f2f5] flex items-center gap-3 relative shrink-0">
                  <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-full transition-all ${isMenuOpen ? 'bg-gray-300 rotate-45' : 'hover:bg-gray-200'}`}>
                      <svg viewBox="0 0 24 24" width="24" height="24" className="text-[#54656f]"><path fill="currentColor" d="M12 4c.552 0 1 .448 1 1v6h6c.552 0 1 .448 1 1s-.448 1-1 1h-6v6c0 .552-.448 1-1 1s-1-.448-1-1v-6H5c-.552 0-1-.448-1-1s.448-1 1-1h6V5c0-.552.448-1 1-1z"/></svg>
                    </button>
                    {isMenuOpen && (
                      <div className="absolute bottom-14 left-0 bg-white shadow-xl rounded-2xl p-2 flex flex-col gap-1 min-w-[180px] border border-gray-100 animate-in fade-in slide-in-from-bottom-2 z-50">
                        <button onClick={() => { const url = prompt("Paste Image URL:"); if(url) sendMessage('image', url); }} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl transition-colors text-sm font-bold text-gray-700 italic uppercase tracking-tighter">🖼️ Image Link</button>
                        <button onClick={handleLocation} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl transition-colors text-sm font-bold text-gray-700 italic uppercase tracking-tighter">📍 GPS Location</button>
                      </div>
                    )}
                  </div>
                  <input className="flex-1 bg-white border-none rounded-lg px-4 py-2.5 text-sm focus:outline-none shadow-sm" placeholder="Type a message" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage('text', replyText)} />
                  <button onClick={() => sendMessage('text', replyText)} className={`p-2 rounded-full transition-all ${replyText.trim() ? 'text-[#008069]' : 'text-[#54656f]'}`}><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/></svg></button>
                </footer>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#f8f9fa] relative overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`}}></div>
                 <div className="w-64 h-64 bg-[#f0f2f5] rounded-full flex items-center justify-center mb-10 shadow-inner border border-gray-100 italic"><span className="text-8xl filter drop-shadow-md">📲</span></div>
                 <h2 className="text-3xl font-black text-[#111b21] italic tracking-tighter uppercase">WhatsApp <span className="text-[#008069]">Terminal</span></h2>
                 <p className="mt-4 text-[#667781] text-xs font-bold max-w-sm leading-relaxed uppercase tracking-widest opacity-60">
                    Automated client management node for {bizId}. Manage manual overrides and AI automation cycles.
                 </p>
                 <div className="mt-20 flex items-center gap-2 text-[10px] text-[#8696a0] font-black tracking-[0.3em] uppercase">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                    ENCRYPTED NODE
                 </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;