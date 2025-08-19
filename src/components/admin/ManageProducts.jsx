import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import AddProduct from './AddProduct';
import EditProductModal from './EditProductModal';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const { data } = await api.get('/api/products');
            setProducts(data);
        } catch (error) {
            if (error.response?.data?.msg === 'Token is not valid') {
                localStorage.removeItem('token');
                navigate('/login');
            }
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAvailabilityToggle = async (product) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
            const body = { isAvailable: !product.isAvailable };
            await api.put(`/api/products/${product._id}/availability`, body);
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error("Failed to update availability", error);
        }
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap-reverse'}}>
            <div style={{flex: '2 1 600px'}}>
                <h3>All Products</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Product</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Stock</th>
                            <th style={thStyle}>Available</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id}>
                                <td style={tdStyle}>{p.name}</td>
                                <td style={tdStyle}>₹{p.price}</td>
                                <td style={tdStyle}>{p.stock}</td>
                                <td style={tdStyle}>
                                    <input type="checkbox" checked={p.isAvailable} onChange={() => handleAvailabilityToggle(p)} />
                                </td>
                                <td style={tdStyle}>
                                    <button onClick={() => setEditingProduct(p)} style={editBtnStyle}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{flex: '1 1 400px'}}>
                <AddProduct onProductAdded={fetchProducts} />
            </div>

            {editingProduct && (
                <EditProductModal 
                    product={editingProduct} 
                    onClose={() => setEditingProduct(null)}
                    onProductUpdated={fetchProducts}
                />
            )}
        </div>
    );
};
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { background: '#f8f9fa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #dee2e6' };
const editBtnStyle = { padding: '6px 10px', fontSize: '0.9rem', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' };
export default ManageProducts;
