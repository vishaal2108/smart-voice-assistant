const express = require("express");
const cors = require("cors");
const commandRoute = require("./routes/command");
const connectDB = require("./config/db");
const timetableRoutes = require("./routes/timetableRoutes");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", timetableRoutes);
app.use("/api", contentRoutes);
app.use("/api/command", commandRoute);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
