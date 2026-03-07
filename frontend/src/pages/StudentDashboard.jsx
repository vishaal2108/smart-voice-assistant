import { useNavigate } from "react-router-dom";
import VoiceInput from "../components/VoiceInput";
import styles from "./StudentDashboard.module.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/student-login");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Student Dashboard</h2>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.voiceCard}>
          <h3>Voice Assistant</h3>
          <p className={styles.voiceHint}>
            Ask about timetable, fees, placements, notices, or circulars. Results will appear below after your question.
          </p>
          <VoiceInput />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
