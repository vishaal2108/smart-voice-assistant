import { useState } from "react";

function StaffPanel() {
  const [day, setDay] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/timetable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day, subject, time }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Timetable Added Successfully ✅");
      setDay("");
      setSubject("");
      setTime("");
    } else {
      alert("Error adding timetable");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Staff Data Entry Panel</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Add Timetable</button>
      </form>
    </div>
  );
}

export default StaffPanel;
