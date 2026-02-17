const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");
const Fee = require("../models/Fee");
const Placement = require("../models/Placement");
const Notice = require("../models/Notice");

// POST /api/command
router.post("/", async (req, res) => {
  const { command } = req.body;
  let response = "";

  if (!command) {
    return res.json({ reply: "No command received" });
  }

  const cmd = command.toLowerCase(); // case-insensitive check

  // Hello greeting
  if (cmd.includes("hello")) {
    response = "Hello , how can I help you?";

  // Timetable query
  } else if (cmd.includes("timetable") || cmd.includes("time table") || cmd.includes("schedule")) {

    // Determine requested day
    let requestedDay = "";
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (let day of weekdays) {
      if (cmd.includes(day.toLowerCase())) {
        requestedDay = day;
        break;
      }
    }

    // Default: today
    if (!requestedDay) {
      requestedDay = new Date().toLocaleString("en-US", { weekday: "long" });
    }

    // Fetch timetable
    const timetable = await Timetable.find({
      day: { $regex: new RegExp(`^${requestedDay}$`, "i") },
    });

    if (timetable.length === 0) {
      response = `No timetable found for ${requestedDay}`;
    } else {
      response = `Your timetable for ${requestedDay}:\n`;
      timetable.forEach((item) => {
        response += `${item.time}: ${item.subject}\n`;
      });
    }
    // Fees query
  } else if (cmd.includes("fee") || cmd.includes("fees")) {

    const fee = await Fee.findOne();

    if (!fee) {
      response = "No fee details available.";
    } else {
      response = `The total fee is ${fee.totalFee} rupees. Due date is ${fee.dueDate}.`;
    }

   // Placement query (Dynamic from DB)
  } else if (
    cmd.includes("placement") ||
    cmd.includes("drive") ||
    cmd.includes("placements")
  ) {

    const placement = await Placement.findOne().sort({ _id: -1 });

    if (!placement) {
      response = "No placement updates available.";
    } else {
      response = `Latest placement drive is from ${placement.companyName} offering ${placement.package}. Eligibility: ${placement.eligibility}. Date: ${placement.date}`;
    }
  // Notice query
  } else if (cmd.includes("notice") || cmd.includes("notices")) {

    const notice = await Notice.findOne().sort({ _id: -1 });

    if (!notice) {
      response = "No notices available.";
    } else {
      response = `Latest notice: ${notice.title}. ${notice.content}`;
    }

  // Current time
  } else if (cmd.includes("time")) {
    response = `The current time is ${new Date().toLocaleTimeString()}`;

  // Assistant name
  } else if (cmd.includes("your name")) {
    response = "I am your Smart College Voice Assistant";

  // Unknown command
  } else {
    response = "Sorry, I did not understand that";
  }

  // Send back response
  res.json({ reply: response });
});

module.exports = router;
