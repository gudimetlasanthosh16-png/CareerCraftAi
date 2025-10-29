import React, { useState, useRef, useEffect } from 'react';
import { CHAT_ICON, CLOSE_ICON, SEND_ICON } from '../constants';
import { ChatMessage } from '../types';
import { chatWithBot } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'model', content: "Hello! How can I help with your career questions today?" }]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await chatWithBot(newMessages);
      const modelMessage: ChatMessage = { role: 'model', content: botResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-accent hover:bg-accent-hover text-white rounded-full p-4 shadow-lg z-30 transition-transform transform hover:scale-110"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? CLOSE_ICON : CHAT_ICON}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-secondary/80 backdrop-blur-lg rounded-lg shadow-2xl flex flex-col z-30 animate-slide-up border border-slate-800">
          <header className="p-4 bg-primary/70 rounded-t-lg border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Career Assistant</h3>
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-slate-800 text-gray-200 rounded-bl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-slate-800 text-gray-200 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce"></div>
                    </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-800 bg-primary/70 rounded-b-lg">
            <div className="flex items-center bg-secondary rounded-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="w-full bg-transparent p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-l-lg"
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-3 text-accent disabled:text-gray-500 disabled:cursor-not-allowed hover:text-cyber-cyan transition-colors">
                {SEND_ICON}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;