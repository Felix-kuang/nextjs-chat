"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";

let socket;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io();

    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      socket.emit("sendMessage", input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-slate-800 container">
      <div className="flex-1 w-10/12 mx-auto bg-gray-100 p-4 rounded-lg sm:w-1/2">
        {messages.map((msg,index) => {
          if (msg.is_notification) {
            return (
              <div key={msg.id} className="p-2 text-sm text-center">
                <span className="text-gray-500">{msg.text}</span>
              </div>
            );
          } else {
            return (
              <motion.div
                key={msg.id}
                className="container p-2 my-0.5 rounded-lg shadow"
                initial={{ x: '100%', opacity: 0 }}  // Start off-screen to the right
                animate={{ x: 0, opacity: 1 }}  // Animate into view
                transition={{ duration: 0.5, ease: 'easeInOut' }}  // Smooth transition
              >
                <span className="text-slate-800 break-words">{msg.text}</span>
              </motion.div>
            );
          }
        })}
      </div>
      <div className="flex mt-4 mx-auto break-words w-10/12 sm:w-1/2">
        <textarea
          className="flex-1 p-2 border border-gray-300 rounded-l-lg text-slate-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          rows="2" // adjust this value as needed
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-r-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
