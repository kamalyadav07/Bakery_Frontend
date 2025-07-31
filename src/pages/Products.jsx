import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from '../components/products/ProductItem';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                setError('Could not fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <h2 style={{ textAlign: 'center' }}>Loading our delicious bakes...</h2>;
    }

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    return (
        <div>
            <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#7B3F00' }}>Our Bakes</h2>
            <div style={productsGridStyle}>
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductItem key={product._id} product={product} />
                    ))
                ) : (
                    <p>No products found. The ovens are warming up!</p>
                )}
            </div>
        </div>
    );
};

const productsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
};

export default Products;