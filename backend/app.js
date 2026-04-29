const express = require("express");
const cors = require("cors");
const commandRoute = require("./routes/command");
const timetableRoutes = require("./routes/timetableRoutes");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const academicsRoutes = require("./routes/academicsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", timetableRoutes);
app.use("/api", contentRoutes);
app.use("/api", academicsRoutes);
app.use("/api/command", commandRoute);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;
