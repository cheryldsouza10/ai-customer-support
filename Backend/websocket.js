const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/Messages");
const User = require("./models/Users");
const { getLLMResponse } = require("./controllers/llm");

const attachWebsocket = (server) => {
  const wss = new WebSocket.Server({ server }, () => {
    console.log("WebSocket server running on 3002");
  });

  wss.on("connection", (ws, req) => {
    console.log('Client connected');
    let user = null;

    ws.on("message", async (data) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === "auth") {
        const decoded = jwt.verify(parsed.token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
        if (!user) return ws.close();
        return;
      }

        if (parsed.from) {
          user = await User.findById(parsed.from);
        }

        await Message.create({
          userId: user._id,
          text: parsed.text,
          from: "user",
          timestamp: new Date(),
        });

        const aiReply = await getLLMResponse(parsed.text);
        const reply = {
          text: aiReply,
          timestamp: new Date().toISOString(),
          sender: 'AI Bot',
          from: "bot"
        };

        await Message.create({
          userId: user._id,
          text: reply.text,
          from: "bot",
          timestamp: new Date(),
        });
        ws.send(JSON.stringify(reply));
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    });
  });
}

module.exports = attachWebsocket;
