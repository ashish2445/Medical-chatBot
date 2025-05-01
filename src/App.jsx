// src/App.jsx
import React from "react";
import ChatBot from "./components/ChatBot";
// import MediBot from "./components/MediBot";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ChatBot />
      {/* <MediBot /> */}
    </div>
  );
}

export default App;