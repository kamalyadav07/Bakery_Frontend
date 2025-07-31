import React from 'react';
import { useNavigate } from 'react-router-dom';
const LoginChooser = () => {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: 'center', maxWidth: '500px', margin: '5rem auto', padding: '3rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '2rem' }}>Choose Your Login</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <button onClick={() => navigate('/login/user')} style={{ padding: '1rem', fontSize: '1.2rem', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#C4A484' }}>
                    Login as Customer
                </button>
                <button onClick={() => navigate('/login/admin')} style={{ padding: '1rem', fontSize: '1.2rem', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#7B3F00' }}>
                    Login as Admin
                </button>
            </div>
        </div>
    );
};
export default LoginChooser;