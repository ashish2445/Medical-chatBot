// src/components/ChatInput.jsx
import { useState } from "react";
import { Send, AlertTriangle } from "lucide-react";

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your health question..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg"
        >
          <Send size={20} />
        </button>
      </div>
      <div className="flex items-center mt-2">
        <AlertTriangle className="text-red-500 mr-1" size={14} />
        <p className="text-xs text-gray-500">For emergencies, call 911 or your local emergency number.</p>
      </div>
    </div>
  );
};

export default ChatInput;