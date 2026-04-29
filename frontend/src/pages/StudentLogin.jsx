import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { isValidEmail, isEmpty } from "../utils/validators";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Enter a valid email address.");
      return;
    }

    if (isEmpty(password)) {
      alert("Password is required.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/login/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token_student", data.token);
      localStorage.setItem("role_student", data.user.role);
      navigate("/student-dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <span className={styles.tag}>Student Portal</span>
        <h2 className={styles.title}>Student Login</h2>
        <p className={styles.subtitle}>Access your dashboard and voice assistant.</p>

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

export default StudentLogin;
