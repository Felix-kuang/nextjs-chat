import { useState, useEffect } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";
import Login from "./Login";

let socket;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      socket.emit("sendMessage", { message: input, userId: user.id });
      setInput("");
    }
  };

  const handleLogin = async (user) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }
      const data = await response.json();
      setUser(data.data);
      setLoggedIn(true);

      const fetchMessages = async () => {
        try {
          const response = await fetch("api/messages");
          const initialMessages = await response.json();
          setMessages(initialMessages.data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };

      fetchMessages();

      socket = io();
      socket.on("connect", () => {
        console.log(`${user.username} Connected!`);
      });

      socket.on("receiveMessage", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-slate-800 container">
      <div className="flex-1 w-10/12 mx-auto bg-gray-100 p-4 rounded-lg sm:w-1/2">
        {messages.map((msg, index) => {
          // Determine if the current message is the last message in the list
          const isLastMessage = index === messages.length - 1;
          // Determine if the current message is a notification
          const isNotification = msg.is_notification;

          return (
            <motion.div
              key={msg.id} // Use a unique identifier for keys
              className="container my-1 items-start"
              initial={{ x: "100%", opacity: 0 }} // Start off-screen to the right
              animate={{ x: 0, opacity: 1 }} // Animate into view
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                delay: !isLastMessage && !isNotification ? index * 0.075 : 0, // Apply delay for old messages only
              }}
            >
              {isNotification ? (
                <div className="text-sm text-center p-2 ">
                  <span className="text-gray-500">{msg.text}</span>
                </div>
              ) : (
                <div className="flex flex-col shadow rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {msg.username}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(msg.date).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-600 break-words">{msg.text}</p>
                </div>
              )}
            </motion.div>
          );
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
