import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true); // Ensure loading is true at the start
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                if (error.response?.data?.msg === 'Token is not valid') {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                console.error('Could not fetch orders', error);
            } finally {
                // This is the crucial part: always set loading to false
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]); // Dependency array is correct

    if (loading) return <p>Loading your orders...</p>;

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>My Orders</h2>
            {orders.length === 0 ? (
                <p style={{ textAlign: 'center' }}>You have no orders yet. <Link to="/products">Start shopping!</Link></p>
            ) : (
                orders.map(order => (
                    <div key={order._id} style={{...orderCardStyle, borderLeft: `5px solid ${getStatusColor(order.orderStatus)}`}}>
                        <div style={orderHeaderStyle}>
                            <div><strong>Order ID:</strong> {order._id}</div>
                            <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                            <div><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</div>
                            <div><strong>Status:</strong> <span style={{fontWeight: 'bold', color: getStatusColor(order.orderStatus)}}>{order.orderStatus}</span></div>
                        </div>
                        {order.orderType === 'Takeaway' && order.pickupTime && (
                            <div style={detailRowStyle}><strong>Pickup Time:</strong> {new Date(order.pickupTime).toLocaleString()}</div>
                        )}
                        {order.specialInstructions && (
                            <div style={detailRowStyle}><strong>Your Instructions:</strong> <em>"{order.specialInstructions}"</em></div>
                        )}
                        {order.orderStatus === 'Declined' && order.declineReason && (
                             <div style={{...detailRowStyle, color: '#D8000C', background: '#FFD2D2', padding: '0.5rem', borderRadius: '5px'}}><strong>Bakery Note:</strong> {order.declineReason}</div>
                        )}
                        <div style={itemsContainerStyle}>
                            <strong>Items:</strong>
                            {order.orderItems.map(item => (
                                <div key={item.product}>- {item.name} (x{item.quantity})</div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
// Helper function for status colors
const getStatusColor = (status) => {
    if (status === 'Delivered' || status === 'Accepted') return 'green';
    if (status === 'Declined') return 'red';
    if (status === 'Processing') return 'orange';
    return 'grey';
}
// Styles
const containerStyle = { maxWidth: '900px', margin: '2rem auto' };
const orderCardStyle = { background: '#fff', padding: '1.5rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' };
const orderHeaderStyle = { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem' };
const detailRowStyle = { borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' };
const itemsContainerStyle = { ...detailRowStyle, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' };
export default MyOrders;