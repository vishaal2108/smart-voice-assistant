import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffPanel from "./pages/StaffPanel";
import VoiceInput from "./components/VoiceInput";   // add at top
// Simple Home Page
function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Smart College Assistant</h2>
      <p>Select Login Type</p>
      <a href="/student-login">Student Login</a> |{" "}
      <a href="/staff-login">Staff Login</a>
    </div>
  );
}



function StudentDashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Student Voice Assistant 🎓</h2>
      <VoiceInput />
    </div>
  );
}


function StaffDashboard() {
  return <h2>Welcome Staff 👩‍🏫</h2>;
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
