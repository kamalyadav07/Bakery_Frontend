import React from 'react';
import AddProduct from '../components/admin/AddProduct';
import ViewOrders from '../components/admin/ViewOrders'; // Import the new component

const AdminPanel = () => {
    return (
        <div>
            <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#7B3F00' }}>Admin Dashboard</h2>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 400px' }}><AddProduct /></div>
                <div style={{ flex: '2 1 600px' }}><ViewOrders /></div>
            </div>
        </div>
    );
};

export default AdminPanel;
