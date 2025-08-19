import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cart/CartState';
import { jwtDecode } from 'jwt-decode'; // ✅ For v4+, use named import

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const itemCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const token = localStorage.getItem('token');
  let user = null;
  try {
    if (token) user = jwtDecode(token)?.user;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={navStyle}>
      <h1 style={logoStyle}>
        <Link to="/" style={linkStyle}>Sweet Delights</Link>
      </h1>
      <ul style={ulStyle}>
        <li>
          <Link to="/products" style={linkStyle}>Our Bakes</Link>
        </li>

        {user?.role !== 'admin' && (
          <li>
            <Link to="/cart" style={linkStyle}>
              Cart {itemCount > 0 && <span style={cartBadgeStyle}>{itemCount}</span>}
            </Link>
          </li>
        )}

        {user ? (
          <>
            {user.role === 'admin' && (
              <li><Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link></li>
            )}
            {user.role === 'user' && (
              <li><Link to="/my-orders" style={linkStyle}>My Orders</Link></li>
            )}
            <li>
              <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
            </li>
          </>
        ) : (
          <li><Link to="/login" style={linkStyle}>Login / Sign Up</Link></li>
        )}
      </ul>
    </nav>
  );
};

const navStyle = { background: '#3D2B1F', color: '#FEFBF6', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 };
const logoStyle = { margin: 0, fontFamily: "'Brush Script MT', cursive", fontSize: '2rem' };
const ulStyle = { listStyle: 'none', display: 'flex', padding: 0, margin: 0, alignItems: 'center' };
const linkStyle = { color: '#FEFBF6', textDecoration: 'none', margin: '0 1rem', fontWeight: 'bold' };
const cartBadgeStyle = { backgroundColor: '#E74C3C', color: 'white', borderRadius: '50%', padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginLeft: '0.5rem' };
const logoutBtnStyle = { background: 'transparent', border: '1px solid #C4A484', color: '#C4A484', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' };

export default Navbar;
