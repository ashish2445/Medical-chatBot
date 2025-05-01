// src/components/Header.jsx
import { MessageCircle } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-blue-600 text-white p-4 flex items-center">
      <MessageCircle className="mr-2" />
      <h1 className="text-xl font-bold">MediBot Health Assistant</h1>
    </div>
  );
};

export default Header;