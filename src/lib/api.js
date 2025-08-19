// src/lib/api.js
import axios from 'axios';

// Prefer REACT_APP_API_URL (prod/deploy), else fall back to relative (CRA proxy dev)
const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL, // '' => same origin; CRA dev proxy -> http://localhost:5000
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Tumhare backend x-auth-token header padhta hai:
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
