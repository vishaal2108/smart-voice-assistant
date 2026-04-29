import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VoiceInput from "../components/VoiceInput";
import styles from "./StudentDashboard.module.css";
import { normalizeStaffAssignments } from "../utils/staffAssignments";

function StudentDashboard() {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState(null);
  const [studentPerformances, setStudentPerformances] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [fees, setFees] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token_student");
    localStorage.removeItem("role_student");
    navigate("/student-login");
  };

  const extractResponseData = async (res) => {
    const raw = await res.text();

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return raw;
    }
  };

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setErrorMessage("");
        const [
          profileRes,
          performanceRes,
          timetableRes,
          noticeRes,
          placementRes,
          feeRes,
          circularRes,
          staffRes,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/student/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_student")}`,
            },
          }),
          fetch("http://localhost:5000/api/student/performance", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_student")}`,
            },
          }),
          fetch("http://localhost:5000/api/timetable"),
          fetch("http://localhost:5000/api/notices"),
          fetch("http://localhost:5000/api/placements"),
          fetch("http://localhost:5000/api/fees"),
          fetch("http://localhost:5000/api/circulars"),
          fetch("http://localhost:5000/api/staff-assignments"),
        ]);

        const [
          profileData,
          performanceData,
          timetableData,
          noticeData,
          placementData,
          feeData,
          circularData,
          staffData,
        ] = await Promise.all([
          extractResponseData(profileRes),
          extractResponseData(performanceRes),
          extractResponseData(timetableRes),
          extractResponseData(noticeRes),
          extractResponseData(placementRes),
          extractResponseData(feeRes),
          extractResponseData(circularRes),
          extractResponseData(staffRes),
        ]);

        if (
          profileRes.status === 401 ||
          profileRes.status === 403 ||
          performanceRes.status === 401 ||
          performanceRes.status === 403
        ) {
          handleLogout();
          return;
        }

        if (profileRes.ok && profileData && !Array.isArray(profileData)) {
          setStudentProfile(profileData);
        }

        if (performanceRes.ok && Array.isArray(performanceData)) {
          setStudentPerformances(performanceData);
        }

        if (timetableRes.ok && Array.isArray(timetableData)) {
          setTimetable(timetableData);
        }

        if (noticeRes.ok && Array.isArray(noticeData)) {
          setNotices(noticeData);
        }

        if (placementRes.ok && Array.isArray(placementData)) {
          setPlacements(placementData);
        }

        if (feeRes.ok && Array.isArray(feeData)) {
          setFees(feeData);
        }

        if (circularRes.ok && Array.isArray(circularData)) {
          setCirculars(circularData);
        }

        if (staffRes.ok && Array.isArray(staffData)) {
          setStaffAssignments(normalizeStaffAssignments(staffData));
        }

        if (
          (!profileRes.ok && profileRes.status !== 404) ||
          !performanceRes.ok ||
          !timetableRes.ok ||
          !noticeRes.ok ||
          !placementRes.ok ||
          !feeRes.ok ||
          !circularRes.ok ||
          !staffRes.ok
        ) {
          setErrorMessage("Some sections could not be loaded. Please refresh or try again later.");
        }
      } catch (error) {
        setErrorMessage("Failed to load student dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

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

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <div className={styles.dashboardGrid}>
          <div className={styles.card}>
            <h3>My Profile</h3>
            {loading && <p>Loading profile...</p>}
            {!loading && !studentProfile && <p>Student details are not linked yet.</p>}
            {!loading && studentProfile && (
              <ul className={styles.list}>
                <li><strong>Name:</strong> {studentProfile.name}</li>
                <li><strong>Email:</strong> {studentProfile.email}</li>
                {studentProfile.department && <li><strong>Department:</strong> {studentProfile.department}</li>}
                {studentProfile.year && <li><strong>Year:</strong> {studentProfile.year}</li>}
                {studentProfile.phone && <li><strong>Phone:</strong> {studentProfile.phone}</li>}
                {studentProfile.address && <li><strong>Address:</strong> {studentProfile.address}</li>}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>My Performance</h3>
            {loading && <p>Loading performance...</p>}
            {!loading && studentPerformances.length === 0 && <p>No performance records available.</p>}
            {!loading && studentPerformances.length > 0 && (
              <ul className={styles.list}>
                {studentPerformances.map((item) => (
                  <li key={item._id || `${item.studentEmail}-${item.month}`}>
                    <strong>{item.month}</strong>
                    {` | Attendance: ${item.attendancePercentage}% | Overall: ${item.overallPercentage}%`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>Timetable</h3>
            {loading && <p>Loading timetable...</p>}
            {!loading && timetable.length === 0 && <p>No timetable entries available.</p>}
            {!loading && timetable.length > 0 && (
              <ul className={styles.list}>
                {timetable.map((item) => (
                  <li key={item._id || `${item.day}-${item.time}-${item.subject}`}>
                    {item.day ? `${item.day}: ` : ""}
                    {item.time ? `${item.time} - ` : ""}
                    {item.subject}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>Notices</h3>
            {loading && <p>Loading notices...</p>}
            {!loading && notices.length === 0 && <p>No notices available.</p>}
            {!loading && notices.length > 0 && (
              <ul className={styles.list}>
                {notices.map((item) => (
                  <li key={item._id || item.title}>
                    <strong>{item.title}</strong>
                    {item.date ? ` | ${item.date}` : ""}
                    {item.content ? ` - ${item.content}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>Placements</h3>
            {loading && <p>Loading placements...</p>}
            {!loading && placements.length === 0 && <p>No placement updates.</p>}
            {!loading && placements.length > 0 && (
              <ul className={styles.list}>
                {placements.map((item) => (
                  <li key={item._id || item.companyName}>
                    <strong>{item.companyName}</strong>
                    {item.package ? ` | ${item.package}` : ""}
                    {item.date ? ` | ${item.date}` : ""}
                    {item.eligibility ? ` | ${item.eligibility}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>Fees</h3>
            {loading && <p>Loading fees...</p>}
            {!loading && fees.length === 0 && <p>No fee details available.</p>}
            {!loading && fees.length > 0 && (
              <ul className={styles.list}>
                {fees.map((item) => (
                  <li key={item._id || `${item.department}-${item.year}`}>
                    {item.department ? `${item.department} ` : ""}
                    {item.year ? `(${item.year}) ` : ""}
                    {item.totalFee ? `- Rs. ${item.totalFee}` : ""}
                    {item.dueDate ? ` | Due: ${item.dueDate}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>Circulars</h3>
            {loading && <p>Loading circulars...</p>}
            {!loading && circulars.length === 0 && <p>No circulars available.</p>}
            {!loading && circulars.length > 0 && (
              <ul className={styles.list}>
                {circulars.map((item) => (
                  <li key={item._id || item.title}>
                    <strong>{item.title}</strong>
                    {item.date ? ` | ${item.date}` : ""}
                    {item.content ? ` - ${item.content}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>Staff Assignments</h3>
            {loading && <p>Loading staff assignments...</p>}
            {!loading && staffAssignments.length === 0 && <p>No staff assignments yet.</p>}
            {!loading && staffAssignments.length > 0 && (
              <ul className={styles.list}>
                {staffAssignments.map((item) => (
                  <li key={item._id || `${item.staffName}-${item.subject}`}>
                    {item.subject ? `${item.subject} - ` : ""}
                    {item.staffName}
                    {item.department ? ` | ${item.department}` : ""}
                    {item.year ? ` | ${item.year}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
