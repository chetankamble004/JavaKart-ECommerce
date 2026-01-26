// src/routes/AppRouter.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';           
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TestConnection from '../components/TestConnection';

// Protected Pages
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminProducts from '../pages/Admin/Products';
import AdminUsers from '../pages/Admin/Users';
import AdminOrders from '../pages/Admin/Orders';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test" element={<TestConnection />} />

      {/* Protected Routes */}
      <Route path="/cart" element={
        <PrivateRoute>
          <Layout><Cart /></Layout>
        </PrivateRoute>
      } />
      <Route path="/checkout" element={
        <PrivateRoute>
          <Layout><Checkout /></Layout>
        </PrivateRoute>
      } />
      <Route path="/orders" element={
        <PrivateRoute>
          <Layout><Orders /></Layout>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Layout><Profile /></Layout>
        </PrivateRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <PrivateRoute adminOnly>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/products" element={
        <PrivateRoute adminOnly>
          <AdminLayout><AdminProducts /></AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/users" element={
        <PrivateRoute adminOnly>
          <AdminLayout><AdminUsers /></AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/orders" element={
        <PrivateRoute adminOnly>
          <AdminLayout><AdminOrders /></AdminLayout>
        </PrivateRoute>
      } />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;