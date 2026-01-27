const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { command } = req.body;
  let response = "";

  if (!command) {
    return res.json({ reply: "No command received" });
  }

  if (command.includes("hello")) {
    response = "Hello Vishaal, how can I help you?";
  } else if (command.includes("time")) {
    response = `The current time is ${new Date().toLocaleTimeString()}`;
  } else if (command.includes("your name")) {
    response = "I am your smart college voice assistant";
  } else {
    response = "Sorry, I did not understand that";
  }

  res.json({ reply: response });
});

module.exports = router;
