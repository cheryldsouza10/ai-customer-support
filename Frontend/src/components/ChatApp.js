import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatApp.css";

export default function ChatApp({user, setLoggedIn}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetchMessages();
      initWebSocket(token);
    }
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const initWebSocket = () => {
    //Create websocket connection
    socketRef.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
  
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const authPayload = JSON.stringify({ type: "auth", token });
  
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(authPayload);
        } else {
          console.warn("WebSocket not open yet, delaying auth...");
          const interval = setInterval(() => {
            if (socketRef.current.readyState === WebSocket.OPEN) {
              socketRef.current.send(authPayload);
              clearInterval(interval);
            }
          }, 100); // Retry every 100ms
        }
      } else {
        console.error("JWT token not found");
      }
    };

    socketRef.current.onmessage = (event) => {
      const message = {...JSON.parse(event.data), isReply: true};
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socketRef.current.onclose = () => {
      handleLogout();
      console.log("WebSocket disconnected");
    }
    socketRef.current.onerror = (error) => {
      handleLogout();
      alert('Websocket connection failed');
      console.error("WebSocket error:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, timestamp: new Date().toISOString(), from: user };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    try {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(newMessage));
      } else {
        alert("Connection Error");
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    setLoggedIn(false);
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

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
