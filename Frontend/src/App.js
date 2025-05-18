import React, { useState } from "react";
import Login from "./components/Login";
import ChatApp from "./components/ChatApp";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("jwtToken")
  );

  const [user, setUser] = useState();

  return loggedIn ? (
    <ChatApp user={user} setLoggedIn={setLoggedIn}/>
  ) : (
    <Login setUser={setUser} onLoginSuccess={() => setLoggedIn(true)} />
  );
}

export default App;
