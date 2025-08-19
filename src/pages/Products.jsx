import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import ProductItem from '../components/products/ProductItem';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/api/products');
                // Filter for available products on the frontend
                setProducts(res.data.filter(p => p.isAvailable));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <h2 style={{ textAlign: 'center' }}>Loading our delicious bakes...</h2>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#7B3F00' }}>Our Bakes</h2>
            <div style={productsGridStyle}>
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductItem key={product._id} product={product} />
                    ))
                ) : (
                    <p style={{textAlign: 'center'}}>No products are available at the moment. Please check back soon!</p>
                )}
            </div>
        </div>
    );
};

const productsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' };
export default Products;