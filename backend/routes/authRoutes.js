const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Student Login
router.post("/login/student", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password, role: "student" });

  if (!user) {
    return res.status(401).json({ message: "Invalid Student Credentials" });
  }

  res.json({ message: "Student Login Successful" });
});

// Staff Login
router.post("/login/staff", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password, role: "staff" });

  if (!user) {
    return res.status(401).json({ message: "Invalid Staff Credentials" });
  }

  res.json({ message: "Staff Login Successful" });
});

module.exports = router;
