const express = require("express");
const cors = require("cors");
const http = require("http");
const attachWebSocket = require("./websocket");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/login", require("./routes/auth"));
app.use("/api/messages", require("./routes/chat"));

attachWebSocket(server);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
