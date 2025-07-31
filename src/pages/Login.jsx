import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' }); // Changed email to phone
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { phone, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { phone, password }); // Changed email to phone
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Welcome Back!</h2>
      <p>Log in to view your orders and checkout faster.</p>
      {error && <div className="error-text">{error}</div>}
      <form onSubmit={onSubmit} style={formStyle}>
        {/* Changed from email to phone input */}
        <input type="tel" placeholder="Phone Number" name="phone" value={phone} onChange={onChange} required style={inputStyle} />
        <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required style={inputStyle} />
        <input type="submit" value="Login" style={submitStyle} />
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/signup" style={{color: '#C4A484'}}>Sign Up</Link>
      </p>
    </div>
  );
};

// Common styles for form pages (no changes here)
const formContainerStyle = {
  maxWidth: '450px',
  margin: '3rem auto',
  padding: '2rem',
  background: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  textAlign: 'center'
};
const formStyle = { display: 'flex', flexDirection: 'column' };
const inputStyle = {
  margin: '0.5rem 0',
  padding: '0.9rem',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #ddd'
};
const submitStyle = {
  padding: '1rem',
  fontSize: '1.1rem',
  backgroundColor: '#C4A484',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '1rem',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease'
};

export default Login;