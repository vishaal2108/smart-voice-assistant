import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ParentDashboard.module.css";

const HOD_DESK = {
  intro: "Greetings from the Department of Information Technology.",
  program:
    "The B.Tech Information Technology programme, initiated in the academic year 1999-2000, is a flagship and exclusive course of our institution. Designed to stay abreast with technological advancements, the programme is known for its strong synchronization between academic curriculum and industry requirements, preparing students to meet the dynamic challenges of the IT sector.",
  faculty:
    "Our department is supported by a team of qualified, experienced, and committed faculty members, who not only guide students academically but also provide individual mentoring with parental care and professional insight.",
  domains: [
    "Artificial Intelligence",
    "Machine Learning",
    "Cloud Computing and Virtualization Technologies",
    "Internet of Things",
  ],
  delivery:
    "These areas are integrated through core subjects, electives, industry-relevant projects, internships, and technical workshops, enabling our students to be technologically competent and industry-ready.",
  highlights: [
    "Industry-aligned curriculum focusing on emerging areas like AI, ML, IoT, Cybersecurity, and Cloud platforms.",
    "Strong academic and research ecosystem encouraging faculty and students to engage in publications and innovation.",
    "Hands-on training and lab infrastructure, including Centers of Excellence and access to real-time simulation tools.",
    "Regular industry interaction, internships, hackathons, and technical symposiums.",
    "Consistent placement track record, with students excelling in top IT companies and higher studies.",
  ],
  closing:
    "At the Department of Information Technology, we foster a culture of continuous learning, ethical responsibility, and technological excellence. We take pride in shaping graduates who are not only technically proficient but also capable of adapting and leading in a global IT landscape.",
};

const STAFF_ORDER = [
  "padmavathi",
  "manikandan",
  "aruna",
  "mahalakshmi",
  "valampuranayaki",
  "ezhilarasi",
  "jeevitha",
  "priyadarshini",
  "gayathri",
  "ganesh",
];

function ParentDashboard() {
  const navigate = useNavigate();
  const [performances, setPerformances] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [brokenStaffImages, setBrokenStaffImages] = useState({});
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showOtherStaffs, setShowOtherStaffs] = useState(false);

  const orderedStaffCards = useMemo(() => {
    const sortedAssignments = [...staffAssignments].sort((a, b) => {
      const aName = String(a.staffName || "").toLowerCase();
      const bName = String(b.staffName || "").toLowerCase();

      const aIndex = STAFF_ORDER.findIndex((key) => aName.includes(key));
      const bIndex = STAFF_ORDER.findIndex((key) => bName.includes(key));

      const safeAIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const safeBIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

      if (safeAIndex !== safeBIndex) {
        return safeAIndex - safeBIndex;
      }

      return aName.localeCompare(bName);
    });

    return sortedAssignments;
  }, [staffAssignments]);

  const activeSubjectStaff = useMemo(
    () => {
      const hod = orderedStaffCards.find((item) =>
        String(item.staffName || "").toLowerCase().includes("padmavathi")
      );
      const handlers = orderedStaffCards.filter(
        (item) =>
          item.subject &&
          item.subject !== "N/A" &&
          !String(item.staffName || "").toLowerCase().includes("padmavathi")
      );

      return hod ? [hod, ...handlers] : handlers;
    },
    [orderedStaffCards]
  );

  const otherStaffs = useMemo(
    () =>
      orderedStaffCards.filter(
        (item) =>
          (!item.subject || item.subject === "N/A") &&
          !String(item.staffName || "").toLowerCase().includes("padmavathi")
      ),
    [orderedStaffCards]
  );

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/parent-login");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setErrorMessage("");
        const token = localStorage.getItem("token");
        const [performanceRes, staffRes, studentsRes] = await Promise.all([
          fetch("http://localhost:5000/api/parent/performance", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5000/api/staff-assignments"),
          fetch("http://localhost:5000/api/parent/students", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (
          performanceRes.status === 401 ||
          performanceRes.status === 403 ||
          studentsRes.status === 401 ||
          studentsRes.status === 403
        ) {
          handleLogout();
          return;
        }

        const [performanceData, staffData, studentsData] = await Promise.all([
          extractResponseData(performanceRes),
          extractResponseData(staffRes),
          extractResponseData(studentsRes),
        ]);

        if (performanceRes.ok && Array.isArray(performanceData)) {
          setPerformances(performanceData);
        }

        if (staffRes.ok && Array.isArray(staffData)) {
          setStaffAssignments(staffData);
        }

        if (studentsRes.ok && Array.isArray(studentsData)) {
          setStudents(studentsData);
        } else if (!studentsRes.ok) {
          const backendMessage =
            typeof studentsData === "object" && studentsData?.message
              ? studentsData.message
              : `Failed to load linked students (status ${studentsRes.status})`;
          setErrorMessage(backendMessage);
        }
      } catch (error) {
        setErrorMessage("Failed to load parent dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Parent Dashboard</h2>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.card}>
          <h3>Staff Subject Allocation</h3>
          {activeSubjectStaff.length === 0 ? (
            <p className={styles.emptyText}>No staff-subject details available yet.</p>
          ) : (
            <ul className={styles.staffGrid}>
              {activeSubjectStaff.map((item) => (
                <li
                  key={item._id}
                  className={`${styles.staffCard} ${String(item.staffName || "").toLowerCase().includes("padmavathi") ? styles.hodCard : ""}`}
                  onClick={() => setSelectedStaff(item)}
                >
                  {item.imageUrl && !brokenStaffImages[item._id] ? (
                    <img
                      className={styles.staffImage}
                      src={item.imageUrl}
                      alt={item.staffName}
                      onError={() =>
                        setBrokenStaffImages((prev) => ({
                          ...prev,
                          [item._id]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className={styles.staffFallback}>
                      {(item.staffName || "?").trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <strong>{item.staffName}</strong>
                  <p className={styles.meta}>
                    {item.designation || "Staff"}
                    {item.subject && item.subject !== "N/A" ? ` | Subject: ${item.subject}` : ""}
                  </p>
                  <p className={styles.hodHint}>Tap to view desk/profile</p>
                </li>
              ))}
            </ul>
          )}

          {otherStaffs.length > 0 && (
            <div className={styles.otherStaffWrap}>
              <button
                type="button"
                className={styles.otherStaffToggle}
                onClick={() => setShowOtherStaffs((prev) => !prev)}
              >
                {showOtherStaffs ? "Hide Other Staffs" : "Show Other Staffs"}
              </button>

              {showOtherStaffs && (
                <ul className={styles.staffGrid}>
                  {otherStaffs.map((item) => (
                    <li
                      key={item._id}
                      className={`${styles.staffCard} ${String(item.staffName || "").toLowerCase().includes("padmavathi") ? styles.hodCard : ""}`}
                      onClick={() => setSelectedStaff(item)}
                    >
                      {item.imageUrl && !brokenStaffImages[item._id] ? (
                        <img
                          className={styles.staffImage}
                          src={item.imageUrl}
                          alt={item.staffName}
                          onError={() =>
                            setBrokenStaffImages((prev) => ({
                              ...prev,
                              [item._id]: true,
                            }))
                          }
                        />
                      ) : (
                        <div className={styles.staffFallback}>
                          {(item.staffName || "?").trim().charAt(0).toUpperCase()}
                        </div>
                      )}
                      <strong>{item.staffName}</strong>
                      <p className={styles.meta}>{item.designation || "Staff"}</p>
                      <p className={styles.hodHint}>Tap to view desk/profile</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h3>Linked Student Details</h3>
          {errorMessage && <p className={styles.emptyText}>{errorMessage}</p>}
          {loading && <p className={styles.emptyText}>Loading student details...</p>}
          {!loading && students.length === 0 && (
            <p className={styles.emptyText}>No student details linked to this parent email yet.</p>
          )}
          {students.length > 0 && (
            <ul className={styles.list}>
              {students.map((student) => (
                <li key={student._id}>
                  <strong>{student.name}</strong> - {student.email}
                  {student.department ? ` | Dept: ${student.department}` : ""}
                  {student.year ? ` | Year: ${student.year}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.card}>
          <h3>Student Monthly Performance</h3>
          {loading && <p className={styles.emptyText}>Loading performance data...</p>}
          {!loading && performances.length === 0 && (
            <p className={styles.emptyText}>No performance records available yet.</p>
          )}
          {performances.map((item) => (
            <div key={item._id} className={styles.card}>
              <h3>{item.studentName}</h3>
              <p className={styles.meta}>
                Month: {item.month} | Attendance: {item.attendancePercentage}% | Overall: {item.overallPercentage}%
              </p>
              <table className={styles.subjects}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {item.subjects.map((subject, index) => (
                    <tr key={`${subject.subject}-${index}`}>
                      <td>{subject.subject}</td>
                      <td>{subject.mark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {selectedStaff && (
        <div className={styles.modalOverlay} onClick={() => setSelectedStaff(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedStaff.staffName} - Desk/Profile</h3>
              <button type="button" className={styles.modalClose} onClick={() => setSelectedStaff(null)}>
                Close
              </button>
            </div>

            <p><strong>Designation:</strong> {selectedStaff.designation || "Staff"}</p>
            {selectedStaff.qualification && (
              <p><strong>Qualification:</strong> {selectedStaff.qualification}</p>
            )}
            {selectedStaff.subject && selectedStaff.subject !== "N/A" && (
              <p><strong>Subject:</strong> {selectedStaff.subject}</p>
            )}

            {String(selectedStaff.staffName || "").toLowerCase().includes("padmavathi") && (
              <>
                <p>{HOD_DESK.intro}</p>
                <p>{HOD_DESK.program}</p>
                <p>{HOD_DESK.faculty}</p>
                <p><strong>Specialized Areas:</strong></p>
                <ul className={styles.modalList}>
                  {HOD_DESK.domains.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{HOD_DESK.delivery}</p>
                <p><strong>Key Highlights of the Department:</strong></p>
                <ul className={styles.modalList}>
                  {HOD_DESK.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{HOD_DESK.closing}</p>
              </>
            )}

            {selectedStaff.profilePdfUrl ? (
              <div className={styles.pdfWrap}>
                <a className={styles.pdfLink} href={selectedStaff.profilePdfUrl} target="_blank" rel="noreferrer">
                  Open profile PDF in new tab
                </a>
                <iframe
                  className={styles.pdfFrame}
                  src={selectedStaff.profilePdfUrl}
                  title={`${selectedStaff.staffName} profile`}
                />
              </div>
            ) : (
              <p className={styles.emptyText}>Profile PDF is not available for this staff member.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentDashboard;
