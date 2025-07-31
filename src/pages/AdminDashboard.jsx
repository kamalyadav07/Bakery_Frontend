import React from 'react';
import AddProduct from '../components/admin/AddProduct';
import ViewOrders from '../components/admin/ViewOrders';
import TotalEarnings from '../components/admin/TotalEarnings';
const AdminDashboard = () => {
    return (
        <div>
            <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#7B3F00' }}>Admin Dashboard</h2>
            <TotalEarnings />
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <div style={{ flex: '1 1 400px' }}><AddProduct /></div>
                <div style={{ flex: '2 1 600px' }}><ViewOrders /></div>
            </div>
        </div>
    );
};
export default AdminDashboard;