import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { isValidEmail, isEmpty } from "../utils/validators";

function ParentLogin() {
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

    const res = await fetch("http://localhost:5000/api/login/parent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token_parent", data.token);
      localStorage.setItem("role_parent", data.user.role);
      navigate("/parent-dashboard");
      return;
    }

    alert(data.message || "Login failed");
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <span className={styles.tag}>Parent Portal</span>
        <h2 className={styles.title}>Parent Login</h2>
        <p className={styles.subtitle}>View student marks, attendance, and monthly performance.</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <input
            className={styles.input}
            type="email"
            placeholder="Parent Email"
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

export default ParentLogin;
