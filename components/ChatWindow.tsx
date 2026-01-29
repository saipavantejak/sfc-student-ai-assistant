
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { COLORS } from '../constants';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  handbookStatus: 'idle' | 'ingesting' | 'ready';
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Simple markdown-style formatter for better readability
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Handle bullet points
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          const content = line.trim().substring(2);
          return (
            <div key={i} className="flex gap-2 ml-1">
              <span className="text-[#cf2e2e]">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
            </div>
          );
        }
        
        // Handle bold and general text
        return (
          <p key={i} className="min-h-[1em]" dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
        );
      })}
    </div>
  );
};

// Helper for bold formatting
const formatBold = (str: string) => {
  return str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  isOpen, 
  messages, 
  onSendMessage, 
  isLoading,
  handbookStatus
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-full max-w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div 
        style={{ backgroundColor: COLORS.sfcNavy }}
        className="p-4 flex items-center gap-3 text-white shadow-md relative z-10"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white/20">
          <img 
            src="https://picsum.photos/seed/sfc/100/100" 
            alt="SFC Mascot" 
            className="w-8 h-8 object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">TerrierHelper</h3>
          <p className="text-[10px] opacity-70 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${handbookStatus === 'ready' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            {handbookStatus === 'ready' ? 'System ready' : 'Awaiting documents...'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[88%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}
            >
              <FormattedText text={msg.content} />
              
              {msg.link && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <a 
                    href={msg.link} 
                    className="text-blue-500 hover:text-blue-700 underline font-semibold flex items-center gap-1"
                  >
                    <i className="fa-solid fa-envelope text-xs"></i>
                    Email Support Hub
                  </a>
                </div>
              )}
              {msg.source && (
                <div className="mt-3 text-[10px] uppercase tracking-wider opacity-40 font-black border-t pt-1 border-gray-100 flex items-center gap-1">
                  <i className="fa-solid fa-book-open"></i>
                  Ref: {msg.source}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <div className="flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-[#cf2e2e] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#cf2e2e] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-[#cf2e2e] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl focus-within:ring-2 focus-within:ring-[#cf2e2e]/20 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={handbookStatus === 'ready' ? "Type your question..." : "Waiting for docs..."}
            disabled={handbookStatus !== 'ready' || isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || handbookStatus !== 'ready' || isLoading}
            style={{ backgroundColor: COLORS.sfcRed }}
            className="w-10 h-10 rounded-lg text-white flex items-center justify-center transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:grayscale shadow-sm"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
