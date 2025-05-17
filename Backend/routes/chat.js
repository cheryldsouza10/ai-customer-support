const express = require("express");
const router = express.Router();
const Message = require("../models/Messages");

// Save a message
router.post("/", async (req, res) => {
  const { userId, text, from } = req.body;
  const message = await Message.create({ userId, text, from });
  res.json(message);
});

// Fetch messages by userId
router.get("/:userId", async (req, res) => {
  const messages = await Message.find({ userId: req.params.userId });
  res.json(messages);
});

module.exports = router;
