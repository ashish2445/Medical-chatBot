// src/components/ChatBot.jsx
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Header from "./Header";
import { processMessage } from "../utils/messageProcessor";
import { isEmergency } from "../utils/emergencyDetector";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm MediBot, your virtual health assistant. I can provide general health information, but I'm not a substitute for professional medical advice. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (userInput) => {
    if (userInput.trim() === "") return;
    
    // Add user message
    const userMessage = { type: "user", content: userInput.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Bot typing indicator
    setIsTyping(true);
    
    // Process user input after a delay
    setTimeout(() => {
      const input = userInput.toLowerCase().trim();
      let botResponse = "";
      
      // Check for emergency keywords
      if (isEmergency(input)) {
        botResponse = "⚠️ This sounds like a medical emergency. Please call emergency services (911/999/112) immediately or go to your nearest emergency room. Do not wait for online advice for urgent medical situations.";
      } else {
        // Process the message
        botResponse = processMessage(input);
        
        // Add medical disclaimer
        botResponse += "\n\nRemember: This information is general in nature and not a substitute for professional medical advice.";
      }
      
      // Add bot response
      const botMessage = { type: "bot", content: botResponse };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full h-screen max-w-md mx-auto bg-gray-50 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <Header />
      
      {/* Disclaimer */}
      <div className="bg-yellow-50 p-3 flex items-start border-b border-yellow-100">
        <div className="text-yellow-500 mr-2 flex-shrink-0 mt-1">ℹ️</div>
        <p className="text-xs text-gray-700">
          This chatbot provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
        </p>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBot;