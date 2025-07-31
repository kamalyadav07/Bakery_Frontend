import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cart/CartState';
import { jwtDecode } from 'jwt-decode';
const Navbar = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const token = localStorage.getItem('token');
    let user = null;
    try {
        if (token) user = jwtDecode(token).user;
    } catch(e) { /* ignore error */ }
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };
    return (
        <nav style={{ background: '#3D2B1F', color: '#FEFBF6', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
            <h1 style={{ margin: 0, fontFamily: "'Brush Script MT', cursive", fontSize: '2rem' }}><Link to="/" style={{ color: '#FEFBF6', textDecoration: 'none' }}>Sweet Delights</Link></h1>
            <ul style={{ listStyle: 'none', display: 'flex', padding: 0, margin: 0, alignItems: 'center' }}>
                <li><Link to="/products" style={{ color: '#FEFBF6', textDecoration: 'none', margin: '0 1rem', fontWeight: 'bold' }}>Our Bakes</Link></li>
                <li><Link to="/cart" style={{ color: '#FEFBF6', textDecoration: 'none', margin: '0 1rem', fontWeight: 'bold' }}>Cart {itemCount > 0 && <span style={{ backgroundColor: '#E74C3C', color: 'white', borderRadius: '50%', padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{itemCount}</span>}</Link></li>
                {user ? (
                    <>
                        {user.role === 'admin' && <li><Link to="/admin/dashboard" style={{ color: '#FEFBF6', textDecoration: 'none', margin: '0 1rem', fontWeight: 'bold' }}>Dashboard</Link></li>}
                        {user.role === 'user' && <li><Link to="/my-orders" style={{ color: '#FEFBF6', textDecoration: 'none', margin: '0 1rem', fontWeight: 'bold' }}>My Orders</Link></li>}
                        <li><button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #C4A484', color: '#C4A484', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' }}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login" style={{ color: '#FEFBF6', textDecoration: 'none', margin: '0 1rem', fontWeight: 'bold' }}>Login / Sign Up</Link></li>
                )}
            </ul>
        </nav>
    );
};
export default Navbar;