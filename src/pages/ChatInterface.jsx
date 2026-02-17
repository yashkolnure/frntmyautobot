
//test page endpoint /chattest
import React, { useState } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [bizId, setBizId] = useState('skyline_realty_01'); // Toggle this to test
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const fd = new FormData();
    fd.append('biz_id', bizId);
    fd.append('user_query', input);

    try {
      const res = await axios.post('http://72.60.196.84:8000/chat', fd);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 p-6 text-white">
      {/* Business Selector - For Testing Isolation */}
      <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-blue-900 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-blue-400">Current Face:</h3>
          <p className="text-xl font-black">{bizId}</p>
        </div>
        <select 
          className="bg-slate-800 p-2 rounded"
          onChange={(e) => setBizId(e.target.value)}
          value={bizId}
        >
          <option value="skyline_realty_01">Skyline Realty</option>
          <option value="iron_forge_gym">Iron Forge Gym</option>
        </select>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-blue-500 animate-pulse">Llama is thinking...</div>}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input 
          className="flex-1 bg-slate-800 p-4 rounded-xl outline-none focus:ring-2 ring-blue-500"
          placeholder={`Ask ${bizId} something...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-600 px-8 rounded-xl font-bold">Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;