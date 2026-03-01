import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StaffPanel.module.css";

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

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleAuthFailure = (res) => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/staff-login");
      return true;
    }

    return false;
  };

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
  };

  const handleFees = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/fees", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        department,
        year,
        totalFee: Number(totalFee),
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
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/staff-login");
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
        </div>
      </div>
    </div>
  );
}

export default StaffPanel;
