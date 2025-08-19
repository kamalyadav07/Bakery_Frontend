import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
        window.location.reload();
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      console.error("🔥 Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {error && <p style={errorStyle}>{error}</p>}
        <button type="submit" style={btnStyle}>
          Login
        </button>
      </form>
    </div>
  );
};

const containerStyle = { padding: "2rem", textAlign: "center" };
const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  maxWidth: "300px",
  margin: "0 auto",
};
const inputStyle = {
  padding: "0.5rem",
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
const btnStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#3D2B1F",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const errorStyle = { color: "red", fontSize: "0.9rem" };

export default Login;
