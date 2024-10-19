"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";

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
    <div className="flex flex-col h-screen w-screen p-4 bg-slate-800 container">
      <div className="flex-1 overflow-auto w-1/2 mx-auto bg-gray-100 p-4 rounded-lg">
        {messages.map((msg) => {
          if (msg.is_notification) {
            return (
              <div key={msg.id} className="p-2 text-sm text-center">
                <span className="text-gray-500">{msg.text}</span>
              </div>
            );
          } else {
            return (
              <div key={msg.id} className="p-2 my-0.5 rounded-lg shadow">
                <span className="text-slate-800">{msg.text}</span>
              </div>
            );
          }
        })}
      </div>
      <div className= "flex mt-4 w-1/2 mx-auto">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300  rounded-l-lg text-slate-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
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
