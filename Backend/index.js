const express = require("express");
const cors = require("cors");
const http = require("http");
const attachWebSocket = require("./websocket");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/login", require("./routes/auth"));
app.use("/api/messages", require("./routes/chat"));

const server = http.createServer(app);

// Attach WebSocket to the same server
attachWebSocket(server);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

require("./websocket");
