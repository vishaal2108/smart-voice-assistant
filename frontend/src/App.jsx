import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffPanel from "./pages/StaffPanel";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h2>Smart College Assistant</h2>
        <p>Select Login Type</p>

        <div className="home-links">
          <Link to="/student-login">Student Login</Link>
          <Link to="/staff-login">Staff Login</Link>
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
      </Routes>
    </Router>
  );
}

export default App;
