import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login({ onLoginSuccess, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login/login`, {
        email,
        password,
      });

      const { token, userId } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      setUser(userId);
      onLoginSuccess();
    } catch (err) {
      if (err?.status === 401) {
        alert("Login failed: Invalid Password")
      } else {
        alert(`Login failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login/SignUp</h2>
        <input
          className="login-input"
          placeholder="Username/Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
