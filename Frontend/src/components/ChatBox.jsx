// ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import { useBroadcastEvent, useEventListener, useMyPresence } from "@liveblocks/react";

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const broadcast = useBroadcastEvent();
  const [myPresence] = useMyPresence();

  useEventListener(({ event }) => {
    if (event.type === "CHAT_MESSAGE") {
      setMessages((prev) => [...prev, event.payload]);
    }
  });

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessage = {
      user: myPresence?.name || "Anonymous",
      text: input,
      timestamp: new Date().toISOString(),
    };
    broadcast({ type: "CHAT_MESSAGE", payload: newMessage });
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-[#1f1f1f] text-white rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
      <div className="bg-[#2a2a2a] px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Live Chat</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="flex-1 px-4 py-2 overflow-y-auto max-h-60">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="text-sm text-gray-400">{msg.user}</span>
            <div className="bg-[#333] px-3 py-1 rounded text-sm">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex items-center border-t border-gray-700">
        <input
          className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="px-3 py-2 text-sm hover:bg-[#333]">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
