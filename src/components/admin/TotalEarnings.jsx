import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TotalEarnings = () => {
    const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEarnings = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('/api/orders/earnings', config);
                setEarnings(data);
            } catch (error) {
                if (error.response?.data?.msg === 'Token is not valid') {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                console.error("Failed to fetch earnings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, [navigate]);

    if (loading) return <p>Calculating earnings...</p>;

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h4>Today's Earnings</h4>
                <p style={amountStyle}>₹{earnings.daily.toFixed(2)}</p>
            </div>
            <div style={cardStyle}>
                <h4>This Month's Earnings</h4>
                <p style={amountStyle}>₹{earnings.monthly.toFixed(2)}</p>
            </div>
            <div style={cardStyle}>
                <h4>This Year's Earnings</h4>
                <p style={amountStyle}>₹{earnings.yearly.toFixed(2)}</p>
            </div>
        </div>
    );
};
const containerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'center' };
const cardStyle = { background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' };
const amountStyle = { fontSize: '2rem', fontWeight: 'bold', color: '#7B3F00', margin: '0.5rem 0 0 0' };
export default TotalEarnings;