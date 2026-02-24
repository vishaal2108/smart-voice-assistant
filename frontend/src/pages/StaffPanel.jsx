import { useState } from "react";
import styles from "./StaffPanel.module.css";

function StaffPanel() {
  // Timetable State
  const [day, setDay] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");

  // Fees State
  const [totalFee, setTotalFee] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Placement State
  const [companyName, setCompanyName] = useState("");
  const [packageOffered, setPackageOffered] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [placementDate, setPlacementDate] = useState("");

  // Notice State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTimetable = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, subject, time }),
    });
    setDay("");
    setSubject("");
    setTime("");
  };

  const handleFees = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalFee, dueDate }),
    });
    setTotalFee("");
    setDueDate("");
  };

  const handlePlacement = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/placements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        package: packageOffered,
        eligibility,
        date: placementDate,
      }),
    });
    setCompanyName("");
    setPackageOffered("");
    setEligibility("");
    setPlacementDate("");
  };

  const handleNotice = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setTitle("");
    setContent("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Staff Dashboard</h2>

        <div className={styles.grid}>
          {/* Timetable */}
          <div className={styles.card}>
            <h3>Timetable Entry</h3>
            <form onSubmit={handleTimetable}>
              <input className={styles.input} placeholder="Day" value={day} onChange={(e) => setDay(e.target.value)} required />
              <input className={styles.input} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              <input className={styles.input} placeholder="Time" value={time} onChange={(e) => setTime(e.target.value)} required />
              <button className={styles.button} type="submit">Add Timetable</button>
            </form>
          </div>

          {/* Fees */}
          <div className={styles.card}>
            <h3>Fees Entry</h3>
            <form onSubmit={handleFees}>
              <input className={styles.input} placeholder="Total Fee" value={totalFee} onChange={(e) => setTotalFee(e.target.value)} required />
              <input className={styles.input} placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              <button className={styles.button} type="submit">Add Fees</button>
            </form>
          </div>

          {/* Placement */}
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

          {/* Notice */}
          <div className={styles.card}>
            <h3>Notice Entry</h3>
            <form onSubmit={handleNotice}>
              <input className={styles.input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input className={styles.input} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
              <button className={styles.button} type="submit">Add Notice</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffPanel;


