const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");

// Add timetable
router.post("/timetable", async (req, res) => {
  try {
    const newEntry = new Timetable(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Timetable added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get ALL timetable
router.get("/timetable", async (req, res) => {
  try {
    const data = await Timetable.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get timetable by day
router.get("/timetable/:day", async (req, res) => {
  try {
    const day = req.params.day;
    const data = await Timetable.find({ day: day });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
