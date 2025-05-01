// src/components/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ message }) => {
  const { type, content } = message;
  
  return (
    <div 
      className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div 
        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
          type === "user" 
            ? "bg-blue-500 text-white rounded-br-none" 
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;