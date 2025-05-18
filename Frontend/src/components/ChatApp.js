import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatApp.css";
import Login from "./Login";

export default function ChatApp({user, onLogout}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuthenticated(true);
      fetchMessages();
      initWebSocket(token);
    }
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      console.log(process.env)
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const initWebSocket = () => {
    socketRef.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
  
      // const token = localStorage.getItem("jwtToken");
      // if (token) {
      //   socketRef.current.send(JSON.stringify({ type: "auth", token }));
      // }
    };

    socketRef.current.onmessage = (event) => {
      const message = {...JSON.parse(event.data), isReply: true};
      setMessages((prevMessages) => [...prevMessages, message]);
      setTyping(false);
      console.log(messages);
    };

    socketRef.current.onclose = () => console.log("WebSocket disconnected");
    socketRef.current.onerror = (error) => console.error("WebSocket error:", error);
  };

  const handleSend = async () => {
    setTyping(true);
    if (!input.trim()) return;
    console.log(user);

    const newMessage = { text: input, timestamp: new Date().toISOString(), from: user };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    try {
      socketRef.current.send(JSON.stringify(newMessage));
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  if (!isAuthenticated) {
    // return <Login
    //   setIsAuthenticated={setIsAuthenticated}
    //   initWebSocket={initWebSocket}
    // />
    return null;
  }

  return (
    <div className="chat-container">
      <button
        className="logout-button"
        onClick={handleLogout}
      >
  Logout
</button>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
          key={index}
          className={`chat-message ${
            msg.from === "bot" ? "chat-bot" : "chat-user"
          }`}
        >
          <div className="chat-text">{msg.text}</div>
          <div className="chat-time">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
