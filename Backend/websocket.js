const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/Messages");
const User = require("./models/Users");
const { getLLMResponse } = require("./controllers/llm");

const wss = new WebSocket.Server({ port: 3002 }, () => {
  console.log("WebSocket server running on ws://localhost:3002");
});

wss.on("connection", (ws, req) => {
  console.log('Client connected');
  let user = null;

  ws.on("message", async (data) => {
    try {
      const parsed = JSON.parse(data);
      console.log('Received:', parsed);
      // if (parsed.type === "auth") {
      //   const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      //   user = await User.findById(decoded.id);
      //   if (!user) return ws.close();
      //   return;
      // }

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
      ws.send(JSON.stringify(reply));
      
      await Message.create({
        userId: user._id,
        text: reply.text,
        from: "bot",
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("WebSocket error:", err);
    }
  });
});
