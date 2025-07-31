import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', phone: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { username, phone, password, password2 } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      return setError('Passwords do not match');
    }
    try {
      const newUser = { username, phone, password };
      const res = await axios.post('/api/auth/signup', newUser);
      localStorage.setItem('token', res.data.token);
      alert('Signup successful! You are now logged in.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Please try again.');
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Create Your Account</h2>
      <p>Join us to get the best-baked goods in town!</p>
      {error && <div className="error-text">{error}</div>}
      <form onSubmit={onSubmit} style={formStyle}>
        <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required style={inputStyle} />
        <input type="tel" placeholder="Phone Number" name="phone" value={phone} onChange={onChange} required style={inputStyle} />
        <input type="password" placeholder="Password (min. 6 characters)" name="password" value={password} onChange={onChange} minLength="6" required style={inputStyle} />
        <input type="password" placeholder="Confirm Password" name="password2" value={password2} onChange={onChange} minLength="6" required style={inputStyle} />
        <input type="submit" value="Create Account" style={submitStyle} />
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{color: '#C4A484'}}>Login</Link>
      </p>
    </div>
  );
};

const formContainerStyle = { maxWidth: '450px', margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' };
const formStyle = { display: 'flex', flexDirection: 'column' };
const inputStyle = { margin: '0.5rem 0', padding: '0.9rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd' };
const submitStyle = { padding: '1rem', fontSize: '1.1rem', backgroundColor: '#C4A484', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' };
export default Signup;