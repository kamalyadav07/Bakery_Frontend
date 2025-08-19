import React, { useState } from 'react';
import ViewOrders from '../components/admin/ViewOrders';
import ManageProducts from '../components/admin/ManageProducts'; // New component
import TotalEarnings from '../components/admin/TotalEarnings';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div>
            <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#7B3F00' }}>Admin Dashboard</h2>
            <TotalEarnings />
            <div style={tabsContainerStyle}>
                <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? activeTabStyle : tabStyle}>Manage Orders</button>
                <button onClick={() => setActiveTab('products')} style={activeTab === 'products' ? activeTabStyle : tabStyle}>Manage Products</button>
            </div>
            <div style={tabContentStyle}>
                {activeTab === 'orders' && <ViewOrders />}
                {activeTab === 'products' && <ManageProducts />}
            </div>
        </div>
    );
};
const tabsContainerStyle = { display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0', borderBottom: '2px solid #eee', paddingBottom: '1rem' };
const tabStyle = { padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', background: 'transparent', border: 'none', fontWeight: '600', color: '#6c757d' };
const activeTabStyle = { ...tabStyle, color: '#7B3F00', borderBottom: '3px solid #7B3F00' };
const tabContentStyle = { marginTop: '2rem' };
export default AdminDashboard;