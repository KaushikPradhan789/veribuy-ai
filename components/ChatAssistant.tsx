import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from './ui/Icons';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi! I\'m VeriBuy AI. Ask me about product quality, seller trust, or where to find the best deals.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Keep chat session in ref so it persists across re-renders but doesn't trigger them
  const chatSession = useRef(createChatSession());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatSession.current.sendMessage({ message: userMsg.text });
      const text = result.text;
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text || "I didn't get a response. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel w-80 md:w-96 h-[500px] rounded-2xl mb-4 flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 border border-white/10">
          <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="font-semibold text-sm">Shopping Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-sm border border-white/5'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-sm border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-zinc-900/50 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about price or quality..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-full pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-white placeholder-zinc-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-50 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-secondary to-primary shadow-lg shadow-purple-900/40 flex items-center justify-center hover:scale-105 transition-transform duration-300"
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
      </button>
    </div>
  );
};

export default ChatAssistant;