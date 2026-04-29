import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StaffPanel.module.css";
import { isValidEmail, isValidMonth, isEmpty } from "../utils/validators";

const EDIT_RESOURCE_CONFIG = {
  timetable: {
    label: "Timetable",
    path: "timetable",
    fields: ["day", "subject", "time"],
  },
  fees: {
    label: "Fees",
    path: "fees",
    fields: ["department", "year", "totalFee", "dueDate"],
  },
  placements: {
    label: "Placements",
    path: "placements",
    fields: ["companyName", "package", "eligibility", "date"],
  },
  notices: {
    label: "Notices",
    path: "notices",
    fields: ["title", "content", "date"],
  },
  circulars: {
    label: "Circulars",
    path: "circulars",
    fields: ["title", "content", "date"],
  },
  staffAssignments: {
    label: "Staff Assignments",
    path: "staff-assignments",
    fields: ["staffName", "subject", "designation", "qualification", "department", "year", "imageUrl", "profilePdfUrl"],
  },
};

function StaffPanel() {
  const navigate = useNavigate();

  // Timetable state
  const [day, setDay] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");

  // Fees state
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Placement state
  const [companyName, setCompanyName] = useState("");
  const [packageOffered, setPackageOffered] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [placementDate, setPlacementDate] = useState("");

  // Notice state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Circular state
  const [circularTitle, setCircularTitle] = useState("");
  const [circularContent, setCircularContent] = useState("");
  const [circularDate, setCircularDate] = useState("");

  // Staff assignment state
  const [staffName, setStaffName] = useState("");
  const [staffSubject, setStaffSubject] = useState("");
  const [staffDesignation, setStaffDesignation] = useState("");
  const [staffQualification, setStaffQualification] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");
  const [staffYear, setStaffYear] = useState("");
  const [staffImageUrl, setStaffImageUrl] = useState("");
  const [staffProfilePdfUrl, setStaffProfilePdfUrl] = useState("");

  // Student performance state
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [performanceMonth, setPerformanceMonth] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState("");
  const [subjectMarksInput, setSubjectMarksInput] = useState("");
  const [editingPerformanceId, setEditingPerformanceId] = useState("");
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [isLoadingPerformanceRecords, setIsLoadingPerformanceRecords] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentRecordName, setStudentRecordName] = useState("");
  const [studentRecordEmail, setStudentRecordEmail] = useState("");
  const [studentRecordParentEmail, setStudentRecordParentEmail] = useState("");
  const [studentRecordDepartment, setStudentRecordDepartment] = useState("");
  const [studentRecordYear, setStudentRecordYear] = useState("");
  const [studentRecordPhone, setStudentRecordPhone] = useState("");
  const [studentRecordAddress, setStudentRecordAddress] = useState("");
  const [editResourceType, setEditResourceType] = useState("timetable");
  const [editRecords, setEditRecords] = useState([]);
  const [isLoadingEditRecords, setIsLoadingEditRecords] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState("");
  const [editingRecordValues, setEditingRecordValues] = useState({});

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token_staff")}`,
  };

  const handleAuthFailure = (res) => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token_staff");
      localStorage.removeItem("role_staff");
      navigate("/staff-login");
      return true;
    }

    return false;
  };

  const extractErrorMessage = async (res, fallbackMessage) => {
    try {
      const raw = await res.text();
      if (!raw) {
        return fallbackMessage;
      }

      try {
        const parsed = JSON.parse(raw);
        return parsed.message || fallbackMessage;
      } catch (error) {
        return raw;
      }
    } catch (error) {
      return fallbackMessage;
    }
  };

  const resetStudentForm = () => {
    setEditingStudentId(null);
    setStudentRecordName("");
    setStudentRecordEmail("");
    setStudentRecordParentEmail("");
    setStudentRecordDepartment("");
    setStudentRecordYear("");
    setStudentRecordPhone("");
    setStudentRecordAddress("");
  };

  const resetPerformanceForm = () => {
    setEditingPerformanceId("");
    setStudentName("");
    setStudentEmail("");
    setParentEmail("");
    setPerformanceMonth("");
    setAttendancePercentage("");
    setSubjectMarksInput("");
  };

  const showSuccess = (message) => {
    alert(message);
  };

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await fetch("http://localhost:5000/api/students", {
        headers: authHeaders,
      });

      if (handleAuthFailure(res)) {
        return;
      }

      if (!res.ok) {
        const message = await extractErrorMessage(res, "Failed to load student records");
        alert(message);
        return;
      }

      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const loadPerformanceRecords = async () => {
    setIsLoadingPerformanceRecords(true);
    try {
      const res = await fetch("http://localhost:5000/api/student-performance", {
        headers: authHeaders,
      });

      if (handleAuthFailure(res)) {
        return;
      }

      if (!res.ok) {
        const message = await extractErrorMessage(res, "Failed to load student performance records");
        alert(message);
        return;
      }

      const data = await res.json();
      setPerformanceRecords(Array.isArray(data) ? data : []);
    } finally {
      setIsLoadingPerformanceRecords(false);
    }
  };

  useEffect(() => {
    loadPerformanceRecords();
  }, []);

  const loadEditRecords = async (resourceType = editResourceType) => {
    setIsLoadingEditRecords(true);
    setEditingRecordId("");
    setEditingRecordValues({});

    const config = EDIT_RESOURCE_CONFIG[resourceType];
    try {
      const res = await fetch(`http://localhost:5000/api/${config.path}`, {
        headers: authHeaders,
      });

      if (handleAuthFailure(res)) {
        return;
      }

      if (!res.ok) {
        const message = await extractErrorMessage(res, `Failed to load ${config.label}`);
        alert(message);
        return;
      }

      const data = await res.json();
      setEditRecords(Array.isArray(data) ? data : []);
    } finally {
      setIsLoadingEditRecords(false);
    }
  };

  useEffect(() => {
    loadEditRecords(editResourceType);
  }, [editResourceType]);

  const handleTimetable = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/timetable", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ day, subject, time }),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      alert("Failed to add timetable");
      return;
    }

    setDay("");
    setSubject("");
    setTime("");
    showSuccess("Timetable details added in DB.");
  };

  const handleFees = async (e) => {
    e.preventDefault();

    const numericFee = Number(totalFee);
    if (Number.isNaN(numericFee) || numericFee <= 0) {
      alert("Total fee must be a positive number.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/fees", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        department,
        year,
        totalFee: numericFee,
        dueDate,
      }),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      alert("Failed to add fee details");
      return;
    }

    setDepartment("");
    setYear("");
    setTotalFee("");
    setDueDate("");
    showSuccess("Fee details added in DB.");
  };

  const handlePlacement = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/placements", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        companyName,
        package: packageOffered,
        eligibility,
        date: placementDate,
      }),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      alert("Failed to add placement");
      return;
    }

    setCompanyName("");
    setPackageOffered("");
    setEligibility("");
    setPlacementDate("");
    showSuccess("Placement details added in DB.");
  };

  const handleNotice = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/notices", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ title, content, date: new Date().toISOString() }),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      alert("Failed to add notice");
      return;
    }

    setTitle("");
    setContent("");
    showSuccess("Notice details added in DB.");
  };

  const handleCircular = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/circulars", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        title: circularTitle,
        content: circularContent,
        date: circularDate,
      }),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      alert("Failed to add circular");
      return;
    }

    setCircularTitle("");
    setCircularContent("");
    setCircularDate("");
    showSuccess("Circular details added in DB.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token_staff");
    localStorage.removeItem("role_staff");
    navigate("/staff-login");
  };

  const parseSubjectMarks = (rawValue) => {
    const pairs = rawValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (pairs.length === 0) {
      return null;
    }

    const subjects = [];

    for (const pair of pairs) {
      const [subjectName, markValue] = pair.split(":").map((item) => item?.trim());
      const mark = Number(markValue);

      if (!subjectName || Number.isNaN(mark)) {
        return null;
      }

      subjects.push({ subject: subjectName, mark });
    }

    return subjects;
  };

  const formatSubjectMarks = (subjects = []) =>
    subjects.map((item) => `${item.subject}:${item.mark}`).join(", ");

  const handleStaffAssignment = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/staff-assignments", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        staffName,
        subject: staffSubject,
        designation: staffDesignation,
        qualification: staffQualification,
        department: staffDepartment,
        year: staffYear,
        imageUrl: staffImageUrl,
        profilePdfUrl: staffProfilePdfUrl,
      }),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      alert("Failed to add staff assignment");
      return;
    }

    setStaffName("");
    setStaffSubject("");
    setStaffDesignation("");
    setStaffQualification("");
    setStaffDepartment("");
    setStaffYear("");
    setStaffImageUrl("");
    setStaffProfilePdfUrl("");
    loadEditRecords("staffAssignments");
    showSuccess("Staff subject details updated for parents.");
  };

  const handleStudentPerformance = async (e) => {
    e.preventDefault();

    if (!isValidEmail(studentEmail)) {
      alert("Enter a valid student email.");
      return;
    }

    if (!isValidEmail(parentEmail)) {
      alert("Enter a valid parent email.");
      return;
    }

    if (!isValidMonth(performanceMonth)) {
      alert("Select a valid month.");
      return;
    }

    const numericAttendance = Number(attendancePercentage);
    if (Number.isNaN(numericAttendance) || numericAttendance < 0 || numericAttendance > 100) {
      alert("Attendance percentage must be between 0 and 100.");
      return;
    }

    const parsedSubjects = parseSubjectMarks(subjectMarksInput);

    if (!parsedSubjects) {
      alert("Enter marks as Subject:Mark, Subject:Mark (example: Math:80, Physics:75)");
      return;
    }

    const url = editingPerformanceId
      ? `http://localhost:5000/api/student-performance/${editingPerformanceId}`
      : "http://localhost:5000/api/student-performance";
    const method = editingPerformanceId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: authHeaders,
      body: JSON.stringify({
        studentName,
        studentEmail,
        parentEmail,
        month: performanceMonth,
        attendancePercentage: numericAttendance,
        subjects: parsedSubjects,
      }),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      const message = await extractErrorMessage(
        res,
        editingPerformanceId ? "Failed to update student performance" : "Failed to save student performance"
      );
      alert(message);
      return;
    }

    resetPerformanceForm();
    loadPerformanceRecords();
    showSuccess(
      editingPerformanceId
        ? "Student performance updated in DB."
        : "Student performance updated for parent and student dashboards."
    );
  };

  const handleEditPerformance = (record) => {
    setEditingPerformanceId(record._id);
    setStudentName(record.studentName || "");
    setStudentEmail(record.studentEmail || "");
    setParentEmail(record.parentEmail || "");
    setPerformanceMonth(record.month || "");
    setAttendancePercentage(String(record.attendancePercentage ?? ""));
    setSubjectMarksInput(formatSubjectMarks(record.subjects || []));
  };

  const handleDeletePerformance = async (recordId) => {
    const confirmed = window.confirm("Delete this student performance record?");
    if (!confirmed) {
      return;
    }

    const res = await fetch(`http://localhost:5000/api/student-performance/${recordId}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      const message = await extractErrorMessage(res, "Failed to delete student performance");
      alert(message);
      return;
    }

    setPerformanceRecords((prev) => prev.filter((item) => item._id !== recordId));
    if (editingPerformanceId === recordId) {
      resetPerformanceForm();
    }

    loadPerformanceRecords();
    showSuccess("Student performance removed from DB.");
  };

  const handleStudentRecordSubmit = async (e) => {
    e.preventDefault();

    if (isEmpty(studentRecordName)) {
      alert("Student name is required.");
      return;
    }

    if (!isValidEmail(studentRecordEmail)) {
      alert("Enter a valid student email.");
      return;
    }

    if (!isValidEmail(studentRecordParentEmail)) {
      alert("Enter a valid parent email.");
      return;
    }

    const payload = {
      name: studentRecordName,
      email: studentRecordEmail,
      parentEmail: studentRecordParentEmail,
      department: studentRecordDepartment,
      year: studentRecordYear,
      phone: studentRecordPhone,
      address: studentRecordAddress,
    };

    const url = editingStudentId
      ? `http://localhost:5000/api/students/${editingStudentId}`
      : "http://localhost:5000/api/students";
    const method = editingStudentId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: authHeaders,
      body: JSON.stringify(payload),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      const message = await extractErrorMessage(res, "Failed to save student");
      alert(message);
      return;
    }

    const result = await res.json().catch(() => ({}));
    const savedStudent = result?.data;
    if (savedStudent?._id) {
      setStudents((prev) => {
        const existingIndex = prev.findIndex((item) => item._id === savedStudent._id);
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = savedStudent;
          return next;
        }
        return [savedStudent, ...prev];
      });
    }

    resetStudentForm();
    loadStudents();
    showSuccess("Student details saved in DB and linked by parent email.");
  };

  const handleEditStudent = (student) => {
    setEditingStudentId(student._id);
    setStudentRecordName(student.name || "");
    setStudentRecordEmail(student.email || "");
    setStudentRecordParentEmail(student.parentEmail || "");
    setStudentRecordDepartment(student.department || "");
    setStudentRecordYear(student.year || "");
    setStudentRecordPhone(student.phone || "");
    setStudentRecordAddress(student.address || "");
  };

  const handleDeleteStudent = async (studentId) => {
    const confirmed = window.confirm("Delete this student record?");
    if (!confirmed) {
      return;
    }

    const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      const message = await extractErrorMessage(res, "Failed to delete student");
      alert(message);
      return;
    }

    setStudents((prev) => prev.filter((item) => item._id !== studentId));

    if (editingStudentId === studentId) {
      resetStudentForm();
    }

    loadStudents();
    showSuccess("Student details removed from DB.");
  };

  const startEditExistingRecord = (record) => {
    const config = EDIT_RESOURCE_CONFIG[editResourceType];
    const values = {};
    config.fields.forEach((field) => {
      values[field] = record[field] ?? "";
    });

    setEditingRecordId(record._id);
    setEditingRecordValues(values);
  };

  const handleEditExistingField = (field, value) => {
    setEditingRecordValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cancelEditExistingRecord = () => {
    setEditingRecordId("");
    setEditingRecordValues({});
  };

  const saveEditExistingRecord = async () => {
    if (!editingRecordId) {
      return;
    }

    const config = EDIT_RESOURCE_CONFIG[editResourceType];
    const payload = { ...editingRecordValues };
    if (config.path === "fees") {
      payload.totalFee = Number(payload.totalFee);
    }

    const res = await fetch(`http://localhost:5000/api/${config.path}/${editingRecordId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify(payload),
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      const message = await extractErrorMessage(res, `Failed to update ${config.label}`);
      alert(message);
      return;
    }

    cancelEditExistingRecord();
    loadEditRecords(editResourceType);
    showSuccess(`${config.label} updated in DB.`);
  };

  const deleteExistingRecord = async (recordId) => {
    const config = EDIT_RESOURCE_CONFIG[editResourceType];
    const confirmed = window.confirm(`Delete this ${config.label} record?`);
    if (!confirmed) {
      return;
    }

    const res = await fetch(`http://localhost:5000/api/${config.path}/${recordId}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (handleAuthFailure(res)) {
      return;
    }

    if (!res.ok) {
      const message = await extractErrorMessage(res, `Failed to delete ${config.label}`);
      alert(message);
      return;
    }

    if (editingRecordId === recordId) {
      cancelEditExistingRecord();
    }

    loadEditRecords(editResourceType);
    showSuccess(`${config.label} deleted from DB.`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Staff Dashboard</h2>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Timetable Entry</h3>
            <form onSubmit={handleTimetable}>
              <input className={styles.input} placeholder="Day" value={day} onChange={(e) => setDay(e.target.value)} required />
              <input className={styles.input} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              <input className={styles.input} placeholder="Time" value={time} onChange={(e) => setTime(e.target.value)} required />
              <button className={styles.button} type="submit">Add Timetable</button>
            </form>
          </div>

          <div className={styles.card}>
            <h3>Fee Structure Entry</h3>
            <form onSubmit={handleFees}>
              <input className={styles.input} placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
              <input className={styles.input} placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
              <input className={styles.input} placeholder="Total Fee" value={totalFee} onChange={(e) => setTotalFee(e.target.value)} required />
              <input className={styles.input} placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              <button className={styles.button} type="submit">Add Fee Structure</button>
            </form>
          </div>

          <div className={styles.card}>
            <h3>Placement Entry</h3>
            <form onSubmit={handlePlacement}>
              <input className={styles.input} placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              <input className={styles.input} placeholder="Package" value={packageOffered} onChange={(e) => setPackageOffered(e.target.value)} required />
              <input className={styles.input} placeholder="Eligibility" value={eligibility} onChange={(e) => setEligibility(e.target.value)} required />
              <input className={styles.input} placeholder="Date" value={placementDate} onChange={(e) => setPlacementDate(e.target.value)} required />
              <button className={styles.button} type="submit">Add Placement</button>
            </form>
          </div>

          <div className={styles.card}>
            <h3>Notice Entry</h3>
            <form onSubmit={handleNotice}>
              <input className={styles.input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input className={styles.input} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
              <button className={styles.button} type="submit">Add Notice</button>
            </form>
          </div>

          <div className={styles.card}>
            <h3>Circular Entry</h3>
            <form onSubmit={handleCircular}>
              <input className={styles.input} placeholder="Title" value={circularTitle} onChange={(e) => setCircularTitle(e.target.value)} required />
              <input className={styles.input} placeholder="Content" value={circularContent} onChange={(e) => setCircularContent(e.target.value)} required />
              <input className={styles.input} placeholder="Date" value={circularDate} onChange={(e) => setCircularDate(e.target.value)} required />
              <button className={styles.button} type="submit">Add Circular</button>
            </form>
          </div>

          <div className={styles.card}>
            <h3>Staff Subject Allocation</h3>
            <form onSubmit={handleStaffAssignment}>
              <input className={styles.input} placeholder="Staff Name" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
              <input className={styles.input} placeholder="Subject" value={staffSubject} onChange={(e) => setStaffSubject(e.target.value)} required />
              <input className={styles.input} placeholder="Designation (optional)" value={staffDesignation} onChange={(e) => setStaffDesignation(e.target.value)} />
              <input className={styles.input} placeholder="Qualification (optional)" value={staffQualification} onChange={(e) => setStaffQualification(e.target.value)} />
              <input className={styles.input} placeholder="Department (optional)" value={staffDepartment} onChange={(e) => setStaffDepartment(e.target.value)} />
              <input className={styles.input} placeholder="Year (optional)" value={staffYear} onChange={(e) => setStaffYear(e.target.value)} />
              <input className={styles.input} placeholder="Image URL (optional)" value={staffImageUrl} onChange={(e) => setStaffImageUrl(e.target.value)} />
              <input className={styles.input} placeholder="Profile PDF URL (optional)" value={staffProfilePdfUrl} onChange={(e) => setStaffProfilePdfUrl(e.target.value)} />
              <button className={styles.button} type="submit">Add Staff Subject</button>
            </form>
          </div>

          <div className={styles.card}>
            <h3>Student Monthly Performance</h3>
            <form onSubmit={handleStudentPerformance}>
              <input className={styles.input} placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
              <input className={styles.input} type="email" placeholder="Student Email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
              <input className={styles.input} type="email" placeholder="Parent Email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} required />
              <input className={styles.input} type="month" value={performanceMonth} onChange={(e) => setPerformanceMonth(e.target.value)} required />
              <input className={styles.input} type="number" min="0" max="100" placeholder="Attendance Percentage" value={attendancePercentage} onChange={(e) => setAttendancePercentage(e.target.value)} required />
              <input className={styles.input} placeholder="Subject Marks (Math:80, Physics:75)" value={subjectMarksInput} onChange={(e) => setSubjectMarksInput(e.target.value)} required />
              <button className={styles.button} type="submit">{editingPerformanceId ? "Update Performance" : "Save Performance"}</button>
              {editingPerformanceId && (
                <button type="button" className={styles.secondaryButton} onClick={resetPerformanceForm}>
                  Cancel Edit
                </button>
              )}
            </form>
            {isLoadingPerformanceRecords && <p className={styles.emptyText}>Loading performance records...</p>}
            {!isLoadingPerformanceRecords && performanceRecords.length === 0 && (
              <p className={styles.emptyText}>No performance records yet.</p>
            )}
            {!isLoadingPerformanceRecords && performanceRecords.length > 0 && (
              <ul className={styles.list}>
                {performanceRecords.map((record) => (
                  <li key={record._id} className={styles.listItem}>
                    <div>
                      <strong>{record.studentName}</strong> ({record.studentEmail})
                      <div className={styles.meta}>
                        Month: {record.month} | Attendance: {record.attendancePercentage}% | Overall: {record.overallPercentage}%
                      </div>
                      <div className={styles.meta}>
                        Subjects: {formatSubjectMarks(record.subjects || [])}
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button type="button" className={styles.smallButton} onClick={() => handleEditPerformance(record)}>
                        Edit
                      </button>
                      <button type="button" className={styles.smallDeleteButton} onClick={() => handleDeletePerformance(record._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>{editingStudentId ? "Edit Student Details" : "Add Student Details"}</h3>
            <form onSubmit={handleStudentRecordSubmit}>
              <input className={styles.input} placeholder="Student Name" value={studentRecordName} onChange={(e) => setStudentRecordName(e.target.value)} required />
              <input className={styles.input} type="email" placeholder="Student Email" value={studentRecordEmail} onChange={(e) => setStudentRecordEmail(e.target.value)} required />
              <input className={styles.input} type="email" placeholder="Parent Email" value={studentRecordParentEmail} onChange={(e) => setStudentRecordParentEmail(e.target.value)} required />
              <input className={styles.input} placeholder="Department (optional)" value={studentRecordDepartment} onChange={(e) => setStudentRecordDepartment(e.target.value)} />
              <input className={styles.input} placeholder="Year (optional)" value={studentRecordYear} onChange={(e) => setStudentRecordYear(e.target.value)} />
              <input className={styles.input} placeholder="Phone (optional)" value={studentRecordPhone} onChange={(e) => setStudentRecordPhone(e.target.value)} />
              <input className={styles.input} placeholder="Address (optional)" value={studentRecordAddress} onChange={(e) => setStudentRecordAddress(e.target.value)} />
              <button className={styles.button} type="submit">{editingStudentId ? "Update Student" : "Add Student"}</button>
              {editingStudentId && (
                <button type="button" className={styles.secondaryButton} onClick={resetStudentForm}>
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className={styles.card}>
            <h3>Edit Existing Data</h3>
            <div className={styles.editToolbar}>
              <select
                className={styles.input}
                value={editResourceType}
                onChange={(e) => setEditResourceType(e.target.value)}
              >
                {Object.entries(EDIT_RESOURCE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.smallButton}
                onClick={() => loadEditRecords(editResourceType)}
              >
                Refresh
              </button>
            </div>

            {isLoadingEditRecords && <p className={styles.emptyText}>Loading existing records...</p>}
            {!isLoadingEditRecords && editRecords.length === 0 && (
              <p className={styles.emptyText}>No records available for this section.</p>
            )}

            {!isLoadingEditRecords && editRecords.length > 0 && (
              <ul className={styles.list}>
                {editRecords.map((record) => (
                  <li key={record._id} className={styles.listItem}>
                    <div className={styles.recordContent}>
                      {editingRecordId === record._id ? (
                        <div>
                          {EDIT_RESOURCE_CONFIG[editResourceType].fields.map((field) => (
                            <input
                              key={field}
                              className={styles.input}
                              placeholder={field}
                              value={editingRecordValues[field] ?? ""}
                              onChange={(e) => handleEditExistingField(field, e.target.value)}
                            />
                          ))}
                          <div className={styles.actions}>
                            <button type="button" className={styles.smallButton} onClick={saveEditExistingRecord}>
                              Save
                            </button>
                            <button type="button" className={styles.secondaryButtonInline} onClick={cancelEditExistingRecord}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.meta}>
                          {EDIT_RESOURCE_CONFIG[editResourceType].fields
                            .map((field) => `${field}: ${record[field] ?? ""}`)
                            .join(" | ")}
                        </div>
                      )}
                    </div>
                    {editingRecordId !== record._id && (
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.smallButton}
                          onClick={() => startEditExistingRecord(record)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.smallDeleteButton}
                          onClick={() => deleteExistingRecord(record._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.card}>
            <h3>Student Records</h3>
            {isLoadingStudents && <p className={styles.emptyText}>Loading students...</p>}
            {!isLoadingStudents && students.length === 0 && (
              <p className={styles.emptyText}>No student records yet.</p>
            )}
            {!isLoadingStudents && students.length > 0 && (
              <ul className={styles.list}>
                {students.map((student) => (
                  <li key={student._id} className={styles.listItem}>
                    <div>
                      <strong>{student.name}</strong> ({student.email})
                      <div className={styles.meta}>
                        Parent: {student.parentEmail}
                        {student.department ? ` | Dept: ${student.department}` : ""}
                        {student.year ? ` | Year: ${student.year}` : ""}
                        {student.phone ? ` | Phone: ${student.phone}` : ""}
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button type="button" className={styles.smallButton} onClick={() => handleEditStudent(student)}>
                        Edit
                      </button>
                      <button type="button" className={styles.smallDeleteButton} onClick={() => handleDeleteStudent(student._id)}>
                        Delete
                      </button>
                    </div>
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

export default StaffPanel;
