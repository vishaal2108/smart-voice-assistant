import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";

function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      navigate("/staff-dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <span className={styles.tag}>Staff Portal</span>
        <h2 className={styles.title}>Staff Login</h2>
        <p className={styles.subtitle}>Manage notices, circulars, timetable, fees, and placements.</p>

        <form className={styles.form} onSubmit={handleLogin}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
          <button className={styles.submitBtn} type="submit">Login</button>
        </form>

        <p className={styles.backRow}>
          Go back to <Link className={styles.backLink} to="/">login selection</Link>
        </p>
      </div>
    </div>
  );
}

export default StaffLogin;
