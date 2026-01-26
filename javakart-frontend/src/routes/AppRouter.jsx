import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminUsers from '../pages/admin/Users';

const AppRouter = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      {/* Protected Routes */}
      <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
      <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
      <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />

      {/* Admin Routes */}
      <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/admin/products" element={isAdmin ? <AdminProducts /> : <Navigate to="/" />} />
      <Route path="/admin/orders" element={isAdmin ? <AdminOrders /> : <Navigate to="/" />} />
      <Route path="/admin/users" element={isAdmin ? <AdminUsers /> : <Navigate to="/" />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;