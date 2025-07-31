import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const AdminLogin = () => {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { phone, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { phone, password });
            const decoded = jwtDecode(res.data.token);
            if (decoded.user.role !== 'admin') {
                setError('Access Denied. Not an admin user.');
                return;
            }
            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed.');
        }
    };
    return (
        <div style={{ maxWidth: '450px', margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h2>Admin Login</h2>
            {error && <div className="error-text">{error}</div>}
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <input type="tel" placeholder="Admin Phone Number" name="phone" value={phone} onChange={onChange} required style={{ margin: '0.5rem 0', padding: '0.9rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd' }} />
                <input type="password" placeholder="Admin Password" name="password" value={password} onChange={onChange} required style={{ margin: '0.5rem 0', padding: '0.9rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd' }} />
                <input type="submit" value="Login to Dashboard" style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: '#7B3F00', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' }} />
            </form>
        </div>
    );
};
export default AdminLogin;