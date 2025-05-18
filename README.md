# ai-customer-support
# 🧠 AI Chatbot App (Full Stack)

This is a full-stack AI-powered chatbot application built using **React** (frontend), **Node.js with Express** (backend), **WebSocket** for real-time chat, **MongoDB Atlas** for data persistence, and **JWT** for authentication.

---

## ⚙️ Requirements

- Node.js (v16 or later)
- npm
- MongoDB Atlas (cloud DB)
- OpenRouter or HuggingFace API key (optional for AI response)

---

## 🔧 Backend Setup
### 1. Navigate to the backend directory and install dependancies:
cd backend
npm install

### 2. Create .env file in the backend:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_uri
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key   # Optional for AI integration

### 3. Run the backend server:
npm run dev

Runs both the HTTP API and WebSocket server on http://localhost:3000
Connects to MongoDB Atlas
Authenticates and stores messages per user

## 💻 Frontend Setup
### 1. Navigate to the frontend directory and install dependancies:
cd ../frontend
npm install

### 2. Create .env file in frontend/:
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WEBSOCKET_URL=ws://localhost:5000

Use wss:// if backend is deployed with HTTPS (e.g., on Render).

### 3. Start the React App:
npm start

Opens at http://localhost:3000
On login, JWT is stored in localStorage
If authenticated, WebSocket connects and chat begins
If user is new, account is created automatically

## 🛠️ Deployment
Backend (Render)
Frontend (Vercel)

## ✅ Features
👥 JWT-based user auth (login/register)

🧠 AI-powered bot replies (OpenRouter/HuggingFace)

💬 Real-time chat using WebSocket

🗃️ Chat history stored in MongoDB per user

🔒 Passwords hashed with bcrypt

🔁 Reconnect WebSocket on failure

🚪 Logout clears token and redirects