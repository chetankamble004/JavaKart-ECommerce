// src/pages/Cart.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Button, Table,
  Image, Form, Alert, Spinner, Modal, InputGroup // InputGroup added
} from 'react-bootstrap';
import {
  FaTrash, FaPlus, FaMinus, FaShoppingBag,
  FaArrowLeft, FaArrowRight, FaExclamationCircle
} from 'react-icons/fa';
import { cartAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await updateCartItem(itemId, newQuantity);
    if (result.success) {
      toast.success('Cart updated successfully');
    } else {
      toast.error(result.error || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success('Item removed from cart');
    } else {
      toast.error(result.error || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      toast.success('Cart cleared successfully');
      setShowClearModal(false);
    } else {
      toast.error(result.error || 'Failed to clear cart');
    }
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = subtotal > 499 ? 0 : 49;
    return subtotal + tax + shipping;
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please login to proceed');
      navigate('/login');
      return;
    }

    if (cart?.cartItems?.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }

    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <FaExclamationCircle className="me-2" />
          Please login to view your cart
        </Alert>
        <div className="text-center mt-4">
          <Button variant="primary" as={Link} to="/login">
            Login
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your cart...</p>
      </Container>
    );
  }

  if (!cart || cart.cartItems?.length === 0) {
    return (
      <Container className="py-5">
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="mb-4">
              <FaShoppingBag size={80} className="text-muted" />
            </div>
            <h3 className="mb-3">Your cart is empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              variant="primary"
              size="lg"
              as={Link}
              to="/products"
              className="px-4"
            >
              <FaArrowLeft className="me-2" />
              Continue Shopping
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="fw-bold mb-4">Shopping Cart</h1>
      
      <Row>
        {/* Cart Items */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cart Items ({cart.cartItems?.length || 0})</h5>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShowClearModal(true)}
              >
                <FaTrash className="me-1" />
                Clear Cart
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th width="40%">Product</th>
                    <th width="20%">Price</th>
                    <th width="20%">Quantity</th>
                    <th width="15%">Total</th>
                    <th width="5%"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartItems?.map((item) => (
                    <tr key={item.cartItemId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.imageUrl || 'https://via.placeholder.com/80x80'}
                            alt={item.productName}
                            width={80}
                            height={80}
                            className="me-3 rounded border"
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="mb-1">
                              <Link to={`/products/${item.productId}`} className="text-dark">
                                {item.productName}
                              </Link>
                            </h6>
                            <p className="text-muted small mb-0">SKU: {item.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          ₹{item.price?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </Button>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (val >= 1) {
                                handleQuantityChange(item.cartItemId, val);
                              }
                            }}
                            className="mx-2 text-center"
                            style={{ width: '60px' }}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.cartItemId)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-primary"
              as={Link}
              to="/products"
            >
              <FaArrowLeft className="me-2" />
              Continue Shopping
            </Button>
            <Button
              variant="warning"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
              <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span className="fw-bold">
                    ₹{calculateSubtotal().toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className={calculateSubtotal() > 499 ? 'text-success' : ''}>
                    {calculateSubtotal() > 499 ? 'FREE' : '₹49'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (18% GST)</span>
                  <span>₹{calculateTax().toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h5">Total</span>
                  <span className="h5 text-success">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>

                {/* Discount Code */}
                <div className="mb-4">
                  <Form.Label className="small">Have a discount code?</Form.Label>
                  <InputGroup>
                    <Form.Control placeholder="Enter code" />
                    <Button variant="outline-secondary">Apply</Button>
                  </InputGroup>
                </div>

                {/* Checkout Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>

                {/* Security Info */}
                <div className="text-center">
                  <p className="small text-muted">
                    <FaShoppingBag className="me-1" />
                    Secure checkout powered by JavaKart
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-top pt-3">
                <h6 className="mb-3">What's included:</h6>
                <ul className="small text-muted mb-0">
                  <li>Free delivery on orders above ₹499</li>
                  <li>30-day return policy</li>
                  <li>Secure payment options</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Clear Cart Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to clear your cart? This action cannot be undone.</p>
          <p className="text-danger">
            All {cart.cartItems?.length} items will be removed from your cart.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;