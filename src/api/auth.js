// src/api/auth.js
import { API_BASE_URL } from "./config";

// Signup API call
export const signup = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Signup failed");

    return data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

// Login API call
export const login = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};
