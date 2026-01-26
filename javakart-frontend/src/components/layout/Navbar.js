// src/components/layout/Navbar.js - FIXED
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Fixed path
import { useCart } from '../../context/CartContext'; // Fixed path

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          🛒 JavaKart
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                {user?.role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                )}
              </>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/cart" className="position-relative me-3">
                  <FaShoppingCart className="me-1" />
                  Cart
                  {getItemCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {getItemCount()}
                    </span>
                  )}
                </Nav.Link>
                
                <Nav.Link as={Link} to="/profile" className="me-3">
                  <FaUser className="me-1" />
                  {user?.fullName || user?.username}
                </Nav.Link>
                
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;