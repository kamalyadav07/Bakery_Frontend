import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import LoginChooser from './pages/LoginChooser';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/routing/AdminRoute';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import CartState from './context/cart/CartState';
import './index.css';
const App = () => {
  return (
    <CartState>
      <Router>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginChooser />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route 
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </CartState>
  );
};
export default App;