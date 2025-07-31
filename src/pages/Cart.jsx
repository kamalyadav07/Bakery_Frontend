import React from 'react';
import { useCart } from '../context/cart/CartState';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div style={cartContainerStyle}>
            <h2 style={{ textAlign: 'center', color: '#7B3F00' }}>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <div style={{textAlign: 'center'}}>
                    <p>Your cart is empty.</p>
                    <Link to="/products" style={browseButtonStyle}>Start Shopping</Link>
                </div>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item._id} style={cartItemStyle}>
                            <img src={item.imageUrl} alt={item.name} style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px'}}/>
                            <div style={{flex: 1, marginLeft: '1rem'}}>
                                <h4>{item.name}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ₹{item.price.toFixed(2)}</p>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} style={removeButtonStyle}>Remove</button>
                        </div>
                    ))}
                    <div style={cartSummaryStyle}>
                        <h3>Total: ₹{total.toFixed(2)}</h3>
                        <button onClick={clearCart} style={clearButtonStyle}>Clear Cart</button>
                        <Link to="/checkout" style={checkoutButtonStyle}>Proceed to Checkout</Link>
                    </div>
                </>
            )}
        </div>
    );
};

// Styles
const cartContainerStyle = { maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'};
const cartItemStyle = { display: 'flex', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' };
const removeButtonStyle = { backgroundColor: '#E74C3C', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' };
const cartSummaryStyle = { marginTop: '2rem', textAlign: 'right' };
const clearButtonStyle = { backgroundColor: 'grey', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '5px', cursor: 'pointer', marginRight: '1rem' };
const checkoutButtonStyle = { textDecoration: 'none', backgroundColor: '#2ECC71', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const browseButtonStyle = { display: 'inline-block', marginTop: '1rem', backgroundColor: '#C4A484', color: 'white', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '5px' };

export default Cart;