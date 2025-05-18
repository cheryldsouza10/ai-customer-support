const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

const hashPassword = async (plainPassword) => {
  const saltRounds = 5;
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  const normalisedPassword = await hashPassword(password);

  if (!user) {
    user = new User({ email, password: normalisedPassword });
    await user.save();
  }
  else {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, userId: user._id });
});


module.exports = router;
