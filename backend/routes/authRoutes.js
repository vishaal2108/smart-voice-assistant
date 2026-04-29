const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/authMiddleware");
const { normalizeEmail, requireEmailField, isEmptyValue } = require("../utils/validators");

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const loginByRole = (role) => async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailCheck = requireEmailField(email, "email");
    if (!emailCheck.ok) {
      return res.status(400).json({ message: emailCheck.message });
    }

    if (isEmptyValue(password)) {
      return res.status(400).json({ message: "Password is required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail, role });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let passwordMatches = false;

    if (typeof user.password === "string" && user.password.startsWith("$2")) {
      passwordMatches = await bcrypt.compare(password, user.password);
    } else {
      // Backward compatibility for existing plain text passwords.
      passwordMatches = user.password === password;

      if (passwordMatches) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.json({
      message: `${role} login successful`,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

router.post("/register", async (req, res) => {
  try {
    const { email, password, role = "student" } = req.body;

    const emailCheck = requireEmailField(email, "email");
    if (!emailCheck.ok) {
      return res.status(400).json({ message: emailCheck.message });
    }

    if (isEmptyValue(password)) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!["student", "staff", "parent"].includes(role)) {
      return res.status(400).json({ message: "Role must be student, staff or parent" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, password: hashedPassword, role });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login/student", loginByRole("student"));
router.post("/login/staff", loginByRole("staff"));
router.post("/login/parent", loginByRole("parent"));

module.exports = router;
