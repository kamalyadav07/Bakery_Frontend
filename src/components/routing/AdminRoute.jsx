import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // We need to install jwt-decode

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        // Check if token is expired and if user is an admin
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }
        if (decoded.user.role !== 'admin') {
            return <Navigate to="/" />; // Redirect non-admins to homepage
        }
        return children;
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
};

export default AdminRoute;
