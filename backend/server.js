const express = require("express");
const cors = require("cors");
const commandRoute = require("./routes/command");
const connectDB = require("./config/db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
const timetableRoutes = require("./routes/timetableRoutes");
app.use("/api", timetableRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);


app.use("/api/command", commandRoute);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
