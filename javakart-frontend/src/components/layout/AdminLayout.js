// src/components/layout/AdminLayout.js - FIXED
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Button } from 'react-bootstrap';
import { FaTachometerAlt, FaBox, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Fixed path

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-4">
          <h4 className="mb-4">
            <span className="text-primary">Java</span>Kart Admin
          </h4>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/admin" className="text-white mb-2 d-flex align-items-center">
              <FaTachometerAlt className="me-3" />
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className="text-white mb-2 d-flex align-items-center">
              <FaBox className="me-3" />
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white mb-2 d-flex align-items-center">
              <FaUsers className="me-3" />
              Users
            </Nav.Link>
          </Nav>
        </div>
        
        <div className="position-absolute bottom-0 w-100 p-3 border-top">
          <Button
            variant="outline-light"
            className="w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;