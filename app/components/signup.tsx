"use client";

import { useState } from "react";
import styles from "./auth.module.scss"; // reuse the same styles
import { useNavigate } from "react-router-dom";
import { Path, PropertyGpt } from "../constant";

export function SignupPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch(
        PropertyGpt.BaseUrl + PropertyGpt.SignupPath,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );

      if (response.ok) {
        // Redirect to login or home after signup
        navigate(Path.Login);
      } else {
        const result = await response.json();
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={styles["auth-form"]}>
        <h2>Sign Up</h2>
        {error && <p className={styles["error"]}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Sign Up</button>
        <p>
          Already have an account?{" "}
          <a onClick={() => navigate(Path.Auth)}>Log in</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
