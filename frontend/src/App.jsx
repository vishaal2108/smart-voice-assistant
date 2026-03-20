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
