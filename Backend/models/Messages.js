const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  timestamp: { type: Date, default: Date.now },
  from: { type: String, enum: ["user", "bot"] },
});

module.exports = mongoose.model("Message", MessageSchema);
