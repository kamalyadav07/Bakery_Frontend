import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const { data } = await axios.get('/api/orders', config);
            setOrders(data);
        } catch (error) {
            if (error.response?.data?.msg === 'Token is not valid') {
                localStorage.removeItem('token');
                navigate('/login');
            }
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusUpdate = async (id, status) => {
        let declineReason = '';
        if (status === 'Declined') {
            declineReason = prompt("Please enter the reason for declining this order:");
            if (declineReason === null) return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
            const body = { status, declineReason };
            await axios.put(`/api/orders/${id}/status`, body, config);
            fetchOrders(); // Refresh the list
        } catch (error) {
            console.error("Failed to update order status", error);
            alert("Failed to update order status.");
        }
    };

    if (loading) return <p>Loading customer orders...</p>;

    return (
        <div style={containerStyle}>
            <h3>Customer Orders</h3>
            {orders.length === 0 ? <p>No orders yet.</p> : (
                orders.map(order => (
                    <div key={order._id} style={{...orderCardStyle, borderLeft: `5px solid ${getStatusColor(order.orderStatus)}`}}>
                        <div style={orderHeaderStyle}>
                            <div><strong>Order ID:</strong> {order._id}</div>
                            <div><strong>Customer:</strong> {order.user.username} ({order.user.phone})</div>
                            <div><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</div>
                            <div><strong>Status:</strong> {order.orderStatus}</div>
                        </div>
                        {order.specialInstructions && <p><strong>Instructions:</strong> {order.specialInstructions}</p>}
                        <div><strong>Items:</strong> {order.orderItems.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div>
                        
                        {order.orderStatus === 'Processing' && (
                            <div style={actionButtonsStyle}>
                                <button onClick={() => handleStatusUpdate(order._id, 'Accepted')} style={acceptBtn}>Accept</button>
                                <button onClick={() => handleStatusUpdate(order._id, 'Declined')} style={declineBtn}>Decline</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};
const getStatusColor = (status) => {
    if (status === 'Delivered' || status === 'Accepted') return 'green';
    if (status === 'Declined') return 'red';
    if (status === 'Processing') return 'orange';
    return 'grey';
}
const containerStyle = { marginTop: '2rem' };
const orderCardStyle = { background: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const orderHeaderStyle = { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' };
const actionButtonsStyle = { marginTop: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem', display: 'flex', gap: '1rem' };
const acceptBtn = { padding: '8px 12px', border: 'none', borderRadius: '5px', background: 'green', color: 'white', cursor: 'pointer' };
const declineBtn = { padding: '8px 12px', border: 'none', borderRadius: '5px', background: 'red', color: 'white', cursor: 'pointer' };
export default ViewOrders;