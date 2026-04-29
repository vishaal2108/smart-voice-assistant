# Smart College Assistant - Complete Source Code

## Project Overview
This document contains the complete source code for the Smart College Assistant project, organized by backend and frontend components.

---

## BACKEND SOURCE CODE

### Backend Configuration Files

#### 1. server.js
```javascript
const app = require("./app");
const connectDB = require("./config/db");
const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
```

#### 2. app.js
```javascript
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
```

#### 3. config/db.js
```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/smart_voice_assistant"
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Backend Middleware

#### 4. middleware/authMiddleware.js
```javascript
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "smart_college_secret";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  JWT_SECRET,
};
```

### Backend Data Models

#### 5. models/User.js
```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "staff", "parent"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
```

#### 6. models/Student.js
```javascript
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Student", studentSchema);
```

#### 7. models/Timetable.js
```javascript
const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  classroom: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Timetable", timetableSchema);
```

#### 8. models/Notice.js
```javascript
const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

module.exports = mongoose.model("Notice", noticeSchema);
```

#### 9. models/Fee.js
```javascript
const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalFee: {
    type: Number,
    required: true,
  },
  feePaid: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "pending",
  },
});

module.exports = mongoose.model("Fee", feeSchema);
```

#### 10. models/Placement.js
```javascript
const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  ctc: {
    type: String,
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  driveDate: {
    type: Date,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Placement", placementSchema);
```

#### 11. models/StaffAssignment.js
```javascript
const mongoose = require("mongoose");

const staffAssignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  qualifications: {
    type: String,
  },
  experience: {
    type: Number,
  },
});

module.exports = mongoose.model("StaffAssignment", staffAssignmentSchema);
```

#### 12. models/Circular.js
```javascript
const mongoose = require("mongoose");

const circularSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  validTill: {
    type: Date,
  },
  department: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

module.exports = mongoose.model("Circular", circularSchema);
```

### Backend Routes

#### 13. routes/authRoutes.js
```javascript
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

    const token = signToken(user);

    return res.status(201).json({
      message: "User registered successfully",
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
});

router.post("/login/student", loginByRole("student"));
router.post("/login/staff", loginByRole("staff"));
router.post("/login/parent", loginByRole("parent"));

module.exports = router;
```

---

## FRONTEND SOURCE CODE

### Frontend Entry Points

#### 14. frontend/src/main.jsx
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 15. frontend/src/App.jsx
```javascript
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import ParentLogin from "./pages/ParentLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffPanel from "./pages/StaffPanel";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import collegeLogo from "./assets/college-logo.png";
import "./App.css";

function Home() {
  return (
    <div className="home-wrapper">
      <img className="home-logo" src={collegeLogo} alt="College Logo" />
      <div className="home-card">
        <h2>Smart College Assistant</h2>
        <p>Select Login Type</p>

        <div className="home-links">
          <Link to="/student-login">Student Login</Link>
          <Link to="/staff-login">Staff Login</Link>
          <Link to="/parent-login">Parent Login</Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/parent-login" element={<ParentLogin />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute role="staff">
              <StaffPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute role="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
```

### Frontend Components

#### 16. frontend/src/components/ProtectedRoute.jsx
```javascript
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
```

#### 17. frontend/src/components/VoiceInput.jsx
```javascript
import React, { useState } from "react";
import MicButton from "./MicButton";
import axios from "axios";
import styles from "./VoiceInput.module.css";

const VoiceInput = ({ onResponse }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVoiceInput = async (recognizedText) => {
    setTranscript(recognizedText);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/command/process",
        { query: recognizedText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        onResponse(response.data.response);
      }
    } catch (error) {
      console.error("Error processing command:", error);
      onResponse("Sorry, I could not process your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.voiceInputContainer}>
      <MicButton
        onTranscript={handleVoiceInput}
        setIsListening={setIsListening}
      />
      {isListening && <p>Listening...</p>}
      {transcript && <p>You said: {transcript}</p>}
      {isLoading && <p>Processing...</p>}
    </div>
  );
};

export default VoiceInput;
```

#### 18. frontend/src/components/VoiceOutput.jsx
```javascript
import React, { useEffect } from "react";
import styles from "./VoiceInput.module.css";

const VoiceOutput = ({ text, autoPlay = true }) => {
  useEffect(() => {
    if (text && autoPlay) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [text, autoPlay]);

  return (
    <div className={styles.voiceOutputContainer}>
      <p>{text}</p>
    </div>
  );
};

export default VoiceOutput;
```

#### 19. frontend/src/components/MicButton.jsx
```javascript
import React, { useEffect } from "react";
import styles from "./VoiceInput.module.css";

const MicButton = ({ onTranscript, setIsListening }) => {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.language = "en-US";

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <button className={styles.micButton} onClick={startListening}>
      🎤 Click to Speak
    </button>
  );
};

export default MicButton;
```

### Frontend Pages

#### 20. frontend/src/pages/StudentLogin.jsx
```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AuthPage.module.css";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login/student", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "student");
      localStorage.setItem("userId", response.data.user.id);
      navigate("/student-dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Student Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
```

#### 21. frontend/src/pages/StaffLogin.jsx
```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AuthPage.module.css";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login/staff", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "staff");
      localStorage.setItem("userId", response.data.user.id);
      navigate("/staff-dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Staff Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
```

#### 22. frontend/src/pages/ParentLogin.jsx
```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AuthPage.module.css";

const ParentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login/parent", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "parent");
      localStorage.setItem("userId", response.data.user.id);
      navigate("/parent-dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Parent Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default ParentLogin;
```

#### 23. frontend/src/pages/StudentDashboard.jsx
```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VoiceInput from "../components/VoiceInput";
import VoiceOutput from "../components/VoiceOutput";
import styles from "./StudentDashboard.module.css";

const StudentDashboard = () => {
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Student Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className={styles.contentArea}>
        <h2>Smart College Assistant</h2>
        <p>Ask your academic queries using voice</p>

        <VoiceInput onResponse={setResponse} />

        {response && <VoiceOutput text={response} />}
      </div>
    </div>
  );
};

export default StudentDashboard;
```

---

## Configuration Files

#### 24. backend/package.json
```json
{
  "name": "smart-college-assistant-backend",
  "version": "1.0.0",
  "description": "Backend for Smart College Assistant",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

#### 25. frontend/package.json
```json
{
  "name": "smart-college-assistant-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.5"
  }
}
```

---

## Additional Files to Create

For complete implementation, also create:

1. **backend/routes/timetableRoutes.js** - Routes for timetable queries
2. **backend/routes/contentRoutes.js** - Routes for notices and circulars
3. **backend/routes/academicsRoutes.js** - Routes for fees and placements
4. **backend/routes/command.js** - Command processing route
5. **backend/utils/validators.js** - Email and input validation utilities
6. **frontend/src/pages/StaffPanel.jsx** - Staff management interface
7. **frontend/src/pages/ParentDashboard.jsx** - Parent view interface
8. **frontend/src/utils/validators.js** - Frontend validation utilities
9. **.env file** - Environment variables for both backend and frontend

---

## Database Setup

Create MongoDB collections with these indexes:

```javascript
db.users.createIndex({ email: 1 });
db.students.createIndex({ rollNumber: 1 });
db.timetables.createIndex({ department: 1, year: 1, section: 1 });
db.notices.createIndex({ postedDate: -1 });
db.fees.createIndex({ studentId: 1 });
db.placements.createIndex({ driveDate: -1 });
db.staffassignments.createIndex({ department: 1, subject: 1 });
```

---

## Installation and Setup

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

End of Source Code Documentation
