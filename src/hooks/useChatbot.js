// src/hooks/useChatbot.js
import { useState, useEffect, useRef } from "react";
import { processMessage } from "../utils/messageProcessor";
import { isEmergency } from "../utils/emergencyDetector";

/**
 * Custom hook for managing chatbot state and logic
 * @returns {Object} - Chatbot state and handlers
 */
const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm MediBot, your virtual health assistant. I can provide general health information, but I'm not a substitute for professional medical advice. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Process and send user message, generate bot response
   */
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const userMessage = { type: "user", content: input.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear input field
    const userInput = input;
    setInput("");
    
    // Bot typing indicator
    setIsTyping(true);
    
    // Process user input after a delay
    setTimeout(() => {
      const inputLower = userInput.toLowerCase().trim();
      let botResponse = "";
      
      // Check for emergency keywords
      if (isEmergency(inputLower)) {
        botResponse = "⚠️ This sounds like a medical emergency. Please call emergency services (911/999/112) immediately or go to your nearest emergency room. Do not wait for online advice for urgent medical situations.";
      } else {
        // Process the message
        botResponse = processMessage(inputLower);
        
        // Add medical disclaimer
        botResponse += "\n\nRemember: This information is general in nature and not a substitute for professional medical advice.";
      }
      
      // Add bot response
      const botMessage = { type: "bot", content: botResponse };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return {
    messages,
    input,
    setInput,
    isTyping,
    handleSendMessage,
    handleKeyPress,
    messagesEndRef
  };
};

export default useChatbot;