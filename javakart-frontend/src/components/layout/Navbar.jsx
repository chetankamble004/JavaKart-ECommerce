import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { Navbar, Nav, Container, NavDropdown, Badge, Button, Form, FormControl } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt, FaHome, FaBox, FaShoppingBag, FaUserCircle } from 'react-icons/fa';
import { CURRENCY } from '../../utils/constants';

const NavigationBar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartItemsCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal = cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaShoppingBag className="me-2" />
          <span className="fw-bold">JavaKart</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          {/* Search Bar */}
          <Form className="d-flex mx-3" onSubmit={handleSearch}>
            <div className="input-group">
              <FormControl
                type="search"
                placeholder="Search products..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <FaSearch />
              </Button>
            </div>
          </Form>

          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              <FaBox className="me-1" /> Products
            </Nav.Link>
            
            {isAdmin && (
              <NavDropdown title="Admin" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/admin/dashboard">
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/products">
                  Products
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orders">
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">
                  Users
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          {/* Right-side Navigation */}
          <Nav className="align-items-center">
            {/* Cart */}
            <Nav.Link as={Link} to="/cart" className="position-relative mx-2">
              <FaShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <Badge 
                  bg="danger" 
                  pill 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.7rem' }}
                >
                  {cartItemsCount}
                </Badge>
              )}
              <span className="ms-1 d-none d-lg-inline">
                Cart {cartTotal > 0 && `(${CURRENCY}${cartTotal.toFixed(2)})`}
              </span>
            </Nav.Link>

            {/* User Profile */}
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <span>
                    <FaUserCircle className="me-1" />
                    {user?.fullName || user?.username}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  <FaBox className="me-2" /> My Orders
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2">
                  Login
                </Nav.Link>
                <Button as={Link} to="/register" variant="outline-light">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;