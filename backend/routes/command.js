const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");
const Fee = require("../models/Fee");
const Placement = require("../models/Placement");
const Notice = require("../models/Notice");
const Circular = require("../models/Circular");
const StaffAssignment = require("../models/StaffAssignment");
const StudentPerformance = require("../models/StudentPerformance");

const SUBJECT_KEYWORDS = [
  "ai/ml",
  "big data",
  "cloud computing",
  "data science",
  "data structures",
  "fullstack",
  "network security",
  "oops",
  "web development",
];

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const extractSubjectFromCommand = (command) => {
  const cmd = normalizeText(command);
  return SUBJECT_KEYWORDS.find((subject) => cmd.includes(subject)) || "";
};

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
  } else if (
    cmd.includes("staff") ||
    cmd.includes("faculty") ||
    cmd.includes("teacher") ||
    cmd.includes("who handles") ||
    cmd.includes("who teaches") ||
    cmd.includes("who is taking")
  ) {
    if (cmd.includes("padmavathi") || cmd.includes("hod")) {
      response = "Dr.V.Padmavathi is the HOD and she is not currently assigned to a subject.";
    } else {
      const subject = extractSubjectFromCommand(cmd);
      const assignments = await StaffAssignment.find().sort({ subject: 1 });

      if (!subject) {
        if (assignments.length === 0) {
          response = "No staff assignment details are available right now.";
        } else {
          response = "Current staff assignments are:\n";
          assignments.forEach((item) => {
            response += `${item.subject}: ${item.staffName}\n`;
          });
        }
      } else {
        const match = assignments.find(
          (item) => normalizeText(item.subject) === normalizeText(subject)
        );

        if (!match) {
          response = `I could not find staff assignment for ${subject}.`;
        } else {
          response = `${match.subject} is handled by ${match.staffName}.`;
        }
      }
    }

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

  // Circular query
  } else if (cmd.includes("circular") || cmd.includes("circulars")) {

    const circular = await Circular.findOne().sort({ _id: -1 });

    if (!circular) {
      response = "No circulars available.";
    } else {
      response = `Latest circular: ${circular.title}. ${circular.content}`;
    }

  // Attendance / performance query
  } else if (
    cmd.includes("attendance") ||
    cmd.includes("performance") ||
    cmd.includes("marks") ||
    cmd.includes("result")
  ) {

    const record = await StudentPerformance.findOne().sort({ month: -1, _id: -1 });

    if (!record) {
      response = "No performance records are available yet.";
    } else {
      response = `Latest performance record: ${record.studentName} (${record.month}). Attendance ${record.attendancePercentage}%. Overall ${record.overallPercentage}%.`;
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
