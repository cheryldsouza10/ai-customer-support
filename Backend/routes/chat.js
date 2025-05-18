const express = require("express");
const router = express.Router();
const Message = require("../models/Messages");
const authenticate = require("../middleware/authMiddleware");

// Save a message
router.post("/", authenticate, async (req, res) => {
  const { userId, text, from } = req.body;
  const message = await Message.create({ userId, text, from });
  res.json(message);
});

// Fetch messages by userId
router.get("/:userId", authenticate, async (req, res) => {
  const decoded = jwt.verify(parsed.token, process.env.JWT_SECRET);
          user = await User.findById(decoded.id);
  const messages = await Message.find({ userId: req.params.userId });
  res.json(messages);
});

module.exports = router;
