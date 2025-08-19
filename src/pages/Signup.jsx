import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("📡 Sending signup request:", { name, email, phone, password });

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });

      console.log("📩 Response status:", res.status);

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Signup failed:", data);
        setError(data.message || "Signup failed");
        return;
      }

      console.log("✅ Signup success:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("🔑 Token saved to localStorage");
        navigate("/");
        window.location.reload();
      } else {
        setError("Invalid signup response");
      }
    } catch (err) {
      console.error("🔥 Signup error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup} style={formStyle}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {error && <p style={errorStyle}>{error}</p>}
        <button type="submit" style={btnStyle}>Signup</button>
      </form>
    </div>
  );
};

const containerStyle = { padding: "2rem", textAlign: "center" };
const formStyle = { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", maxWidth: "300px", margin: "0 auto" };
const inputStyle = { padding: "0.5rem", width: "100%", border: "1px solid #ccc", borderRadius: "4px" };
const btnStyle = { padding: "0.5rem 1rem", backgroundColor: "#3D2B1F", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const errorStyle = { color: "red", fontSize: "0.9rem" };

export default Signup;
