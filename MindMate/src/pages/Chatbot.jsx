import React, { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Smile } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Chatbox() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello there! I'm MindMate, your friendly AI companion. I'm here to listen and support you.", sender: "bot", timestamp: new Date() },
    { id: 2, text: "What's on your mind today? Feel free to share anything.", sender: "bot", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const botReplyText = await fetchBotReply(input);
      const newBotMessage = {
        id: messages.length + 2,
        text: botReplyText,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Oops! I couldn't connect right now. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const fetchBotReply = async (msg) => {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ message: msg })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.reply || "I'm sorry, I couldn't generate a response.";
  };

  const formatTimestamp = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 pt-[72px] sm:pt-[76px] pb-8 md:pb-12">
        <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          <div className="flex items-center p-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md z-10">
            <div className="relative">
              <span className="text-4xl mr-3">🤖</span>
              <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse-slow border-2 border-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">MindMate</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-xl shadow-sm
                  ${msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"} text-right`}>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-700 italic px-4 py-2 rounded-xl rounded-bl-none shadow-sm max-w-[80%]">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce1"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce2"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce3"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
            <button type="button" className="p-2 text-gray-500 hover:text-blue-600 rounded-full" disabled>
              <PlusCircle size={22} />
            </button>
            <button type="button" className="p-2 text-gray-500 hover:text-blue-600 rounded-full" disabled>
              <Smile size={22} />
            </button>
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
              placeholder="Type your message to MindMate..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isTyping}
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
