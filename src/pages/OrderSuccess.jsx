import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', margin: '2rem auto', maxWidth: '600px', borderRadius: '10px' }}>
            <h2 style={{ color: '#2ECC71' }}>Thank You!</h2>
            <h3>Your order has been placed successfully.</h3>
            <p>We've started preparing your delicious treats!</p>
            <Link to="/my-orders" style={{ display: 'inline-block', marginTop: '1.5rem', backgroundColor: '#C4A484', color: 'white', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '5px' }}>
                View My Orders
            </Link>
        </div>
    );
};

export default OrderSuccess;