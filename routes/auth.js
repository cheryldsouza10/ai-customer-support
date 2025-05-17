const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email, password });
    await user.save();
  } else if (user.password !== password) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, userId: user._id });
});

module.exports = router;
