import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VoiceInput from "../components/VoiceInput";
import styles from "./StudentDashboard.module.css";

const API_BASE = "http://localhost:5000/api";

function StudentDashboard() {
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [fees, setFees] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authToken = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (!authToken || userRole !== "student") {
      navigate("/student-login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const responses = await Promise.all([
          fetch(`${API_BASE}/timetable`, { headers: { Authorization: `Bearer ${authToken}` } }),
          fetch(`${API_BASE}/notices`, { headers: { Authorization: `Bearer ${authToken}` } }),
          fetch(`${API_BASE}/placements`, { headers: { Authorization: `Bearer ${authToken}` } }),
          fetch(`${API_BASE}/fees`, { headers: { Authorization: `Bearer ${authToken}` } }),
          fetch(`${API_BASE}/circulars`, { headers: { Authorization: `Bearer ${authToken}` } }),
          fetch(`${API_BASE}/staff-assignments`, { headers: { Authorization: `Bearer ${authToken}` } }),
        ]);

        const bad = responses.find((res) => !res.ok);
        if (bad) {
          if (bad.status === 401 || bad.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/student-login");
            return;
          }
          throw new Error(`Unable to load data (${bad.status})`);
        }

        const [timetableData, noticesData, placementsData, feesData, circularsData, staffAssignmentsData] = await Promise.all(
          responses.map((res) => res.json())
        );

        setTimetable(Array.isArray(timetableData) ? timetableData : []);
        setNotices(Array.isArray(noticesData) ? noticesData : []);
        setPlacements(Array.isArray(placementsData) ? placementsData : []);
        setFees(Array.isArray(feesData) ? feesData : []);
        setCirculars(Array.isArray(circularsData) ? circularsData : []);
        setStaffAssignments(Array.isArray(staffAssignmentsData) ? staffAssignmentsData : []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, userRole, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/student-login");
  };

  const renderList = (items, title, renderItem) => (
    <div className={styles.card}>
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className={styles.voiceHint}>No {title.toLowerCase()} found.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item._id || item.id}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <p>Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Student Dashboard</h2>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.voiceCard}>
          <h3>Voice Assistant</h3>
          <p className={styles.voiceHint}>
            Ask about timetable, fees, placements, notices, circulars, or which staff handles a subject.
          </p>
          <VoiceInput />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
