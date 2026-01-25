
import React, { useState, useRef, useEffect } from 'react';
// Fix: Removed non-existent HandbookFile import that was causing a module error
import { Message } from '../types';
import { COLORS } from '../constants';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  handbookStatus: 'idle' | 'ingesting' | 'ready';
}

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
    <div className="fixed bottom-24 right-6 w-full max-w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div 
        style={{ backgroundColor: COLORS.sfcNavy }}
        className="p-4 flex items-center gap-3 text-white"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img 
            src="https://picsum.photos/seed/sfc/100/100" 
            alt="SFC Mascot" 
            className="w-8 h-8 object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">TerrierHelper</h3>
          <p className="text-xs opacity-80">
            {handbookStatus === 'ready' ? 'Trained on The Cord 2025-26' : 'Awaiting handbook ingestion...'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
              }`}
            >
              {msg.content}
              {msg.link && (
                <div className="mt-2">
                  <a 
                    href={msg.link} 
                    className="text-blue-500 underline font-medium"
                  >
                    Email Support Hub
                  </a>
                </div>
              )}
              {msg.source && (
                <div className="mt-2 text-[10px] uppercase tracking-wider opacity-60 font-bold">
                  Source: {msg.source}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={handbookStatus === 'ready' ? "Ask about grades, guests..." : "Please upload handbook first..."}
            disabled={handbookStatus !== 'ready' || isLoading}
            className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cf2e2e] transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || handbookStatus !== 'ready' || isLoading}
            style={{ backgroundColor: COLORS.sfcRed }}
            className="w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
