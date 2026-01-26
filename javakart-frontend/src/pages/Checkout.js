// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Button, Form,
  Alert, Spinner, Tab, Tabs, ListGroup, Image,
  Modal
} from 'react-bootstrap';
import {
  FaCreditCard, FaMoneyBillWave, FaWallet,
  FaMapMarkerAlt, FaTruck, FaShieldAlt,
  FaCheckCircle, FaLock, FaTimes
} from 'react-icons/fa';
import { cartAPI, orderAPI, paymentAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('address');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Form states
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    isDefault: true
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  useEffect(() => {
    if (!cart || cart.cartItems?.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const calculateTotal = () => {
    if (!cart || !cart.cartItems) return 0;
    const subtotal = cart.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 499 ? 0 : 49;
    return subtotal + tax + shipping;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setActiveTab('payment');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' || paymentMethod === 'online') {
      // Validate card details for card payments
      if (paymentMethod === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.nameOnCard) {
          toast.error('Please fill all card details');
          return;
        }
      }
    }

    setProcessingPayment(true);
    try {
      // Step 1: Create order
      const orderResponse = await orderAPI.create();
      const order = orderResponse.data;

      // Step 2: Process payment
      let paymentResponse;
      if (paymentMethod === 'cod') {
        paymentResponse = await paymentAPI.processPayment(order.orderId, 'COD');
      } else if (paymentMethod === 'online') {
        paymentResponse = await paymentAPI.createPayment({
          orderId: order.orderId,
          amount: calculateTotal(),
          paymentMethod: 'ONLINE'
        });
        
        // For online payments, we would redirect to payment gateway
        // For now, we'll simulate successful payment
        await paymentAPI.verifyPayment({
          transactionId: paymentResponse.data.transactionId,
          status: 'SUCCESS'
        });
      } else if (paymentMethod === 'card') {
        // Process card payment
        paymentResponse = await paymentAPI.createPayment({
          orderId: order.orderId,
          amount: calculateTotal(),
          paymentMethod: 'CARD'
        });
        
        // Simulate card payment verification
        await paymentAPI.verifyPayment({
          transactionId: paymentResponse.data.transactionId,
          status: 'SUCCESS'
        });
      }

      setOrderDetails({
        ...order,
        payment: paymentResponse.data
      });

      // Clear cart
      await clearCart();
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/orders');
  };

  if (!cart || cart.cartItems?.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Redirecting to cart...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="fw-bold mb-4">Checkout</h1>
      
      <Row>
        {/* Checkout Steps */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="address" title={
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" />
                    <span>Address</span>
                  </div>
                }>
                  <div className="p-3">
                    <h5 className="mb-4">Shipping Address</h5>
                    <Form onSubmit={handleAddressSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Street Address</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter street address"
                            value={address.street}
                            onChange={(e) => setAddress({...address, street: e.target.value})}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter city"
                            value={address.city}
                            onChange={(e) => setAddress({...address, city: e.target.value})}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter state"
                            value={address.state}
                            onChange={(e) => setAddress({...address, state: e.target.value})}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>ZIP Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter ZIP code"
                            value={address.zipCode}
                            onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                            required
                          />
                        </Col>
                        <Col md={12} className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            value={address.country}
                            disabled
                          />
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-primary"
                          onClick={() => navigate('/cart')}
                        >
                          Back to Cart
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab>
                
                <Tab eventKey="payment" title={
                  <div className="d-flex align-items-center">
                    <FaCreditCard className="me-2" />
                    <span>Payment</span>
                  </div>
                }>
                  <div className="p-3">
                    <h5 className="mb-4">Payment Method</h5>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-4">
                      <Form.Check
                        type="radio"
                        id="cod"
                        label={
                          <div className="d-flex align-items-center">
                            <FaMoneyBillWave className="me-2 text-success" />
                            <div>
                              <div className="fw-medium">Cash on Delivery</div>
                              <small className="text-muted">Pay when you receive your order</small>
                            </div>
                          </div>
                        }
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mb-3 p-3 border rounded"
                      />
                      
                      <Form.Check
                        type="radio"
                        id="card"
                        label={
                          <div className="d-flex align-items-center">
                            <FaCreditCard className="me-2 text-primary" />
                            <div>
                              <div className="fw-medium">Credit/Debit Card</div>
                              <small className="text-muted">Visa, MasterCard, RuPay</small>
                            </div>
                          </div>
                        }
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mb-3 p-3 border rounded"
                      />
                      
                      <Form.Check
                        type="radio"
                        id="online"
                        label={
                          <div className="d-flex align-items-center">
                            <FaWallet className="me-2 text-warning" />
                            <div>
                              <div className="fw-medium">Online Payment</div>
                              <small className="text-muted">UPI, Net Banking, Wallets</small>
                            </div>
                          </div>
                        }
                        name="paymentMethod"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="mb-3 p-3 border rounded"
                      />
                    </div>
                    
                    {/* Card Details (shown only when card is selected) */}
                    {paymentMethod === 'card' && (
                      <Card className="mb-4 border-primary">
                        <Card.Body>
                          <h6 className="mb-3">Card Details</h6>
                          <Row>
                            <Col md={12} className="mb-3">
                              <Form.Label>Name on Card</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter name as on card"
                                value={paymentDetails.nameOnCard}
                                onChange={(e) => setPaymentDetails({...paymentDetails, nameOnCard: e.target.value})}
                              />
                            </Col>
                            <Col md={8} className="mb-3">
                              <Form.Label>Card Number</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={paymentDetails.cardNumber}
                                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                              />
                            </Col>
                            <Col md={4} className="mb-3">
                              <Form.Label>CVV</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="123"
                                value={paymentDetails.cvv}
                                onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                              />
                            </Col>
                            <Col md={12} className="mb-3">
                              <Form.Label>Expiry Date</Form.Label>
                              <Form.Control
                                type="month"
                                value={paymentDetails.expiryDate}
                                onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                              />
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    )}
                    
                    {/* Online Payment Info */}
                    {paymentMethod === 'online' && (
                      <Alert variant="info" className="mb-4">
                        <FaShieldAlt className="me-2" />
                        You will be redirected to a secure payment gateway to complete your transaction.
                      </Alert>
                    )}
                    
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="outline-primary"
                        onClick={() => setActiveTab('address')}
                      >
                        Back to Address
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handlePaymentSubmit}
                        disabled={processingPayment}
                      >
                        {processingPayment ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Processing...
                          </>
                        ) : (
                          'Place Order'
                        )}
                      </Button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
              
              {/* Security Assurance */}
              <div className="border-top pt-3 mt-3">
                <div className="d-flex align-items-center">
                  <FaLock className="me-2 text-success" />
                  <div>
                    <small className="text-muted">
                      <strong>Secure checkout:</strong> Your payment information is encrypted and secure.
                    </small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Order Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              {/* Cart Items */}
              <div className="mb-3">
                <h6 className="mb-3">Items in Cart ({cart.cartItems?.length})</h6>
                <ListGroup variant="flush" className="mb-3">
                  {cart.cartItems?.map((item) => (
                    <ListGroup.Item key={item.cartItemId} className="px-0">
                      <div className="d-flex align-items-center">
                        <Image
                          src={item.imageUrl || 'https://via.placeholder.com/60x60'}
                          alt={item.productName}
                          width={60}
                          height={60}
                          className="rounded me-3"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="mb-1 small fw-medium">{item.productName}</p>
                              <p className="mb-0 small text-muted">Qty: {item.quantity}</p>
                            </div>
                            <span className="small fw-bold">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              
              {/* Price Breakdown */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>
                    ₹{cart.cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className={cart.cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) > 499 ? 'text-success' : ''}>
                    {cart.cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) > 499 ? 'FREE' : '₹49'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (18%)</span>
                  <span>
                    ₹{(cart.cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.18).toFixed(2)}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h5">Total</span>
                  <span className="h5 text-success">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Delivery Info */}
              <div className="border-top pt-3">
                <div className="d-flex align-items-start mb-2">
                  <FaTruck className="me-2 text-primary mt-1" />
                  <div>
                    <small className="fw-medium">Delivery to {address.city || 'your city'}</small>
                    <br />
                    <small className="text-muted">Expected delivery: 3-5 business days</small>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <FaShieldAlt className="me-2 text-success mt-1" />
                  <div>
                    <small className="fw-medium">30-Day Return Policy</small>
                    <br />
                    <small className="text-muted">Easy returns if you're not satisfied</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Body className="text-center p-5">
          <div className="mb-4">
            <FaCheckCircle size={80} className="text-success" />
          </div>
          <h3 className="mb-3">Order Placed Successfully!</h3>
          <p className="text-muted mb-4">
            Thank you for your order. Your order number is <strong>{orderDetails?.orderId}</strong>.
          </p>
          {orderDetails?.payment && (
            <div className="mb-4">
              <p className="mb-2">
                Payment Amount: <strong>₹{orderDetails.totalAmount?.toFixed(2)}</strong>
              </p>
              <p className="mb-2">
                Payment Method: <strong>{orderDetails.payment.paymentMethod}</strong>
              </p>
              <p className="mb-2">
                Transaction ID: <strong>{orderDetails.payment.transactionId}</strong>
              </p>
            </div>
          )}
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="outline-primary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
            <Button
              variant="primary"
              onClick={handleCloseSuccessModal}
            >
              View Order Details
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Checkout;