import React from 'react';
import { useCart } from '../../context/cart/CartState'; // Import the useCart hook

const ProductItem = ({ product }) => {
    const { name, description, price, imageUrl, category, stock } = product;
    const { addToCart } = useCart(); // Get the addToCart function from context

    const handleAddToCart = () => {
        addToCart(product);
        alert(`${name} added to cart!`); // Simple feedback
    };

    return (
        <div style={cardStyle}>
            <img src={imageUrl} alt={name} style={imageStyle} />
            <div style={cardContentStyle}>
                <span style={categoryStyle}>{category}</span>
                <h3 style={nameStyle}>{name}</h3>
                <p style={descriptionStyle}>{description}</p>
                <div style={footerStyle}>
                    <p style={priceStyle}>₹{price.toFixed(2)}</p>
                    <button onClick={handleAddToCart} style={buttonStyle} disabled={stock === 0}>
                        {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Styles for the product card (no changes here)
const cardStyle = { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, box-shadow 0.3s ease' };
const imageStyle = { width: '100%', height: '200px', objectFit: 'cover' };
const cardContentStyle = { padding: '1rem', flex: '1', display: 'flex', flexDirection: 'column' };
const categoryStyle = { backgroundColor: '#FEFBF6', color: '#C4A484', padding: '0.2rem 0.5rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: '0.5rem' };
const nameStyle = { margin: '0.5rem 0', fontSize: '1.2rem' };
const descriptionStyle = { fontSize: '0.9rem', color: '#6c757d', flexGrow: 1, lineHeight: '1.4' };
const footerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' };
const priceStyle = { fontSize: '1.3rem', fontWeight: 'bold', color: '#7B3F00', margin: 0 };
const buttonStyle = { backgroundColor: '#C4A484', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease' };

export default ProductItem;

