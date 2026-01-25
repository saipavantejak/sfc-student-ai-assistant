
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBubble from './components/ChatBubble';
import ChatWindow from './components/ChatWindow';
import { Message, DocumentFile } from './types';
import { COLORS } from './constants';
import { askGemini } from './services/geminiService';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: "Hello! I am TerrierHelper. You can upload multiple SFC documents (like 'The Cord', syllabi, or campus maps), and I'll help you with any questions about them.",
      timestamp: new Date()
    }
  ]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'ingesting' | 'ready'>('idle');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadState('ingesting');
    
    const newDocs: DocumentFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      newDocs.push({
        name: file.name,
        base64,
        mimeType: file.type || 'application/pdf'
      });
    }

    setDocuments(prev => [...prev, ...newDocs]);
    setUploadState('ready');
    
    const fileNames = newDocs.map(d => d.name).join(', ');
    setMessages(prev => [...prev, {
      id: uuidv4(),
      role: 'bot',
      content: `I've successfully ingested: ${fileNames}. You can now ask questions about these documents or upload more.`,
      timestamp: new Date()
    }]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setUploadState('idle');
      return updated;
    });
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const historyToSend = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || '';
      const response = await askGemini(apiKey, text, historyToSend, documents);
      
      const botMessage: Message = {
        id: uuidv4(),
        role: 'bot',
        content: response.text,
        timestamp: new Date(),
        source: documents.length > 0 ? `${documents.length} Document(s)` : undefined,
        link: response.text.toLowerCase().includes("cannot find") ? "mailto:thehub@sfc.edu" : undefined
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'bot',
        content: `Error: ${error.message || "Failed to connect to TerrierHelper service."}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: COLORS.sfcRed }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full opacity-5 pointer-events-none" style={{ backgroundColor: COLORS.sfcNavy }}></div>

      <main className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-gray-100">
        {/* Left Side: SFC Branding & Info */}
        <div 
          className="md:w-1/3 p-8 flex flex-col justify-between text-white"
          style={{ backgroundColor: COLORS.sfcNavy }}
        >
          <div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 transition-transform hover:rotate-0">
               <span className="text-2xl font-black" style={{ color: COLORS.sfcRed }}>SFC</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">TerrierHelper</h1>
            <p className="text-sm opacity-80 leading-relaxed">
              The multi-document assistant for St. Francis College. 
              Upload handbooks, syllabi, or policy docs to get instant contextual answers.
            </p>
          </div>
          
          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Quick Links</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline opacity-80 hover:opacity-100">Student Portal</a></li>
              <li><a href="#" className="hover:underline opacity-80 hover:opacity-100">Academic Support</a></li>
              <li><a href="#" className="hover:underline opacity-80 hover:opacity-100">Financial Aid</a></li>
            </ul>
          </div>
        </div>

        {/* Right Side: Simulation Portal */}
        <div className="md:w-2/3 p-8 bg-gray-50 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <i className="fa-solid fa-folder-open text-6xl mb-6 text-gray-300"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Ingestion</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Upload one or more PDF documents to provide TerrierHelper with the context it needs to help you.
            </p>

            {/* Ingestion Panel */}
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-left">
                Documents Ingested ({documents.length})
              </label>
              
              <div className="relative group mb-4">
                <input 
                  type="file" 
                  accept="application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center gap-3 transition-colors border-gray-200 group-hover:border-[#cf2e2e] bg-gray-50 group-hover:bg-[#ffeded]`}>
                  {uploadState === 'ingesting' ? (
                    <i className="fa-solid fa-spinner fa-spin text-2xl text-[#cf2e2e]"></i>
                  ) : (
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-400 group-hover:text-[#cf2e2e]"></i>
                  )}
                  <span className="text-xs font-medium text-gray-600">
                    Click or drag to add PDFs
                  </span>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 group">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <i className="fa-solid fa-file-pdf text-[#cf2e2e] flex-shrink-0"></i>
                      <span className="text-xs truncate text-gray-700 font-medium">{doc.name}</span>
                    </div>
                    <button 
                      onClick={() => removeDocument(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4 italic">No documents uploaded yet.</p>
                )}
              </div>
              
              <p className="mt-4 text-[10px] text-gray-400 uppercase text-center font-bold">
                Private & Local Processing
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex items-center justify-between text-xs text-gray-400 font-medium">
             <span>St. Francis College © 2025</span>
             <span className="flex items-center gap-2">
               <i className="fa-solid fa-shield-halved"></i>
               Secure Session
             </span>
          </div>
        </div>
      </main>

      {/* Floating Chat Components */}
      <ChatWindow 
        isOpen={isChatOpen} 
        messages={messages} 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        handbookStatus={uploadState === 'ready' ? 'ready' : documents.length > 0 ? 'ready' : 'idle'}
      />
      <ChatBubble 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        isOpen={isChatOpen} 
      />
    </div>
  );
};

export default App;
