
import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { chatWithGemini } from './services/geminiService';
import MessageBubble from './components/MessageBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Oi... (olho para baixo timidamente). Tem alguém aí?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = [...messages, userMessage];
      const responseText = await chatWithGemini(historyForApi);
      
      const modelMessage: Message = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error communicating with persona:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto shadow-2xl bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border-2 border-white shadow-sm">
            <img 
              src="https://picsum.photos/seed/persona/200" 
              alt="Persona Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-semibold text-slate-800 text-sm">Alguém Reservado</h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400">Online agora</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', text: 'Oi... (olho para baixo timidamente). Tem alguém aí?', timestamp: new Date() }])}
          className="text-slate-400 hover:text-red-500 transition-colors"
          title="Reiniciar conversa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5"
      >
        <div className="text-center my-6">
          <span className="bg-slate-200 text-slate-500 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-medium">
            Início da conversa segura
          </span>
        </div>
        
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-slate-200 sticky bottom-0">
        <div className="flex items-end gap-2 bg-slate-100 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none max-h-32 scrollbar-hide"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-xl transition-all ${
              !input.trim() || isLoading 
                ? 'bg-slate-200 text-slate-400' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Suas mensagens são privadas e protegidas.
        </p>
      </footer>
    </div>
  );
};

export default App;
