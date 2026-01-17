import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Lottie from 'lottie-react';
import { Bot, X, MessageSquare, Send, RefreshCw, Trash2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BOT_AVATAR_URL = "https://lottie.host/56903f56-e91b-426b-9524-749e7b286663/z0CqG7Xg5e.json"; 

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hi! I'm **VITAM Buddy** 🤖. I know your grades, skills, and goals. Ask me anything about your studies or career!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [mood, setMood] = useState('neutral'); // neutral, happy, thinking, warning
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(BOT_AVATAR_URL)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Animation Error", err));

    const storedSession = localStorage.getItem('chatSessionId');
    if (storedSession) setSessionId(storedSession);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Determine mood based on AI text
  const analyzeMood = (text) => {
      if (text.includes("⚠️") || text.includes("risk") || text.includes("fail") || text.includes("warning")) return 'warning';
      if (text.includes("🎉") || text.includes("Great") || text.includes("Congratulations")) return 'happy';
      return 'neutral';
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setMood('thinking'); // Robot is thinking

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat`,
        { message: userMsg.text, sessionId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMsg = { role: 'model', text: res.data.reply };
      setMessages(prev => [...prev, botMsg]);
      setMood(analyzeMood(res.data.reply)); // Set mood from response
      
      if (res.data.sessionId) {
          setSessionId(res.data.sessionId);
          localStorage.setItem('chatSessionId', res.data.sessionId);
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ I'm having trouble connecting to my brain. Please try again." }]);
      setMood('warning');
    } finally {
      setLoading(false);
    }
  };

  const clearMemory = () => {
      setMessages([{ role: 'model', text: "Memory wiped! 🧹 Starting fresh. What's on your mind?" }]);
      setSessionId(null);
      localStorage.removeItem('chatSessionId');
      setMood('neutral');
  };

  // Dynamic Theme Colors based on Mood
  const getThemeColor = () => {
      switch(mood) {
          case 'warning': return 'bg-orange-500';
          case 'happy': return 'bg-green-500';
          case 'thinking': return 'bg-purple-500';
          default: return 'bg-blue-600';
      }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[380px] h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden glass-panel"
            style={{ boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.25)' }}
          >
            {/* Dynamic Header */}
            <motion.div 
                animate={{ backgroundColor: mood === 'warning' ? '#f97316' : mood === 'happy' ? '#22c55e' : mood === 'thinking' ? '#a855f7' : '#2563eb' }}
                className="p-4 flex items-center justify-between text-white shrink-0 transition-colors duration-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center p-1 backdrop-blur-sm relative overflow-hidden">
                   {/* Mood Emoji Badge */}
                   <div className="absolute -bottom-1 -right-1 z-10 text-lg">
                       {mood === 'happy' ? '😃' : mood === 'warning' ? '😟' : mood === 'thinking' ? '🤔' : ''}
                   </div>
                   {animationData ? <Lottie animationData={animationData} loop={true} /> : <Bot />}
                </div>
                <div>
                  <h3 className="font-bold text-base">VITAM Buddy</h3>
                  <p className="text-xs opacity-90 flex items-center gap-1 font-medium">
                     {mood === 'thinking' ? 'Computing...' : mood === 'warning' ? 'Attention Needed' : 'Online & Ready'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                 <button onClick={clearMemory} title="Clear Memory" className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <Trash2 size={18} />
                 </button>
                 <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20} />
                 </button>
              </div>
            </motion.div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-800/50 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                  }`}>
                    {msg.role === 'model' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Thinking Indicator */}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex items-center gap-2 shadow-sm">
                      <span className="text-xs font-medium text-gray-400 animate-pulse">Thinking</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-700 shrink-0">
                {messages.length < 3 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-none">
                        {[
                            "How should I study? 📚", 
                            "What career suits me? 💼", 
                            "I failed in a subject 🆘",
                            "Skills for Frontend? 💻"
                        ].map(suggestion => (
                            <button 
                                key={suggestion}
                                onClick={() => { setInput(suggestion); }} 
                                className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 text-xs font-medium text-gray-600 dark:text-gray-400 rounded-lg whitespace-nowrap hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-gray-200 dark:border-gray-700 transition-all active:scale-95"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl border border-transparent focus-within:border-blue-500 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for guidance..."
                  className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none dark:text-white"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className={`p-2.5 rounded-lg text-white transition-all shadow-md ${
                      !input.trim() || loading ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white relative group transition-colors duration-500 ${
            mood === 'warning' ? 'bg-gradient-to-r from-orange-500 to-red-600' :
            mood === 'happy' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 duration-1000 z-0"></div>
        {isOpen ? <X size={24} className="relative z-10" /> : <MessageSquare size={24} className="relative z-10" />}
        
        {/* Notification Badge */}
        {!isOpen && messages.length > 1 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                1
            </span>
        )}
      </motion.button>
      
    </div>
  );
};

export default AIChatWidget;
