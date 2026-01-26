// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Spinner, Tab, Tabs, ListGroup, Badge,
  Modal, Image
} from 'react-bootstrap';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaEdit, FaSave, FaTimes, FaHistory, FaStar,
  FaShoppingBag, FaCreditCard, FaLock, FaBell,
  FaCamera, FaTrash, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!profileForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!profileForm.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(profileForm.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Password change validation
    if (profileForm.currentPassword || profileForm.newPassword || profileForm.confirmPassword) {
      if (!profileForm.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }

      if (!profileForm.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (profileForm.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }

      if (profileForm.newPassword !== profileForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateProfileForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        fullName: profileForm.fullName,
        mobile: profileForm.mobile
      };

      // Include password if changing
      if (profileForm.newPassword) {
        updateData.password = profileForm.newPassword;
        updateData.currentPassword = profileForm.currentPassword;
      }

      const result = await updateProfile(updateData);
      
      if (result.success) {
        toast.success('Profile updated successfully');
        setEditMode(false);
        setFormErrors({});
        // Reset password fields
        setProfileForm({
          ...profileForm,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileForm({
      fullName: user.fullName || '',
      email: user.email || '',
      mobile: user.mobile || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'PROCESSING': return 'info';
      case 'SHIPPED': return 'primary';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={4} className="mb-4">
          {/* Profile Card */}
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Body className="text-center">
              {/* Profile Picture */}
              <div className="mb-3">
                <div className="position-relative mx-auto" style={{ width: '120px', height: '120px' }}>
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=random&size=200`}
                    alt={user.fullName || user.username}
                    className="rounded-circle border shadow-sm w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="position-absolute bottom-0 end-0 rounded-circle"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <FaCamera />
                  </Button>
                </div>
              </div>

              {/* User Info */}
              <h4 className="fw-bold mb-1">{user.fullName || user.username}</h4>
              <p className="text-muted mb-2">@{user.username}</p>
              <Badge bg={user.role === 'ADMIN' ? 'primary' : 'secondary'} className="mb-3">
                {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
              </Badge>

              {/* Stats */}
              <div className="row text-center mt-4">
                <div className="col-4">
                  <h5 className="fw-bold mb-1">{orders.length}</h5>
                  <small className="text-muted">Orders</small>
                </div>
                <div className="col-4">
                  <h5 className="fw-bold mb-1">4.8</h5>
                  <small className="text-muted">Rating</small>
                </div>
                <div className="col-4">
                  <h5 className="fw-bold mb-1">2</h5>
                  <small className="text-muted">Years</small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4">
                {!editMode ? (
                  <Button
                    variant="primary"
                    className="w-100 mb-2"
                    onClick={() => setEditMode(true)}
                  >
                    <FaEdit className="me-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className="w-100 mb-2"
                      onClick={handleProfileSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      onClick={handleCancelEdit}
                    >
                      <FaTimes className="me-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Quick Links */}
          <Card className="border-0 shadow-sm mt-3">
            <Card.Body>
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ListGroup variant="flush">
                <ListGroup.Item action className="d-flex align-items-center border-0 px-0 py-2">
                  <FaHistory className="me-3 text-primary" />
                  <span>Order History</span>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center border-0 px-0 py-2">
                  <FaStar className="me-3 text-warning" />
                  <span>My Reviews</span>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center border-0 px-0 py-2">
                  <FaShoppingBag className="me-3 text-success" />
                  <span>Wishlist</span>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center border-0 px-0 py-2">
                  <FaCreditCard className="me-3 text-info" />
                  <span>Payment Methods</span>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center border-0 px-0 py-2">
                  <FaBell className="me-3 text-secondary" />
                  <span>Notifications</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                {/* Profile Tab */}
                <Tab eventKey="profile" title={
                  <span className="d-flex align-items-center">
                    <FaUser className="me-2" />
                    Profile
                  </span>
                }>
                  <div className="p-3">
                    <h5 className="mb-4">Personal Information</h5>
                    
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaUser className="me-2" />
                              Full Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="fullName"
                              value={profileForm.fullName}
                              onChange={handleFormChange}
                              disabled={!editMode}
                              isInvalid={!!formErrors.fullName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.fullName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaEnvelope className="me-2" />
                              Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              value={profileForm.email}
                              disabled
                              readOnly
                            />
                            <Form.Text className="text-muted">
                              Email cannot be changed
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaPhone className="me-2" />
                          Mobile Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobile"
                          value={profileForm.mobile}
                          onChange={handleFormChange}
                          disabled={!editMode}
                          isInvalid={!!formErrors.mobile}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.mobile}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Password Change Section */}
                      {editMode && (
                        <div className="border-top pt-4 mt-4">
                          <h6 className="mb-3">
                            <FaLock className="me-2" />
                            Change Password
                          </h6>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="currentPassword"
                              value={profileForm.currentPassword}
                              onChange={handleFormChange}
                              isInvalid={!!formErrors.currentPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.currentPassword}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                  type="password"
                                  name="newPassword"
                                  value={profileForm.newPassword}
                                  onChange={handleFormChange}
                                  isInvalid={!!formErrors.newPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.newPassword}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                  type="password"
                                  name="confirmPassword"
                                  value={profileForm.confirmPassword}
                                  onChange={handleFormChange}
                                  isInvalid={!!formErrors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.confirmPassword}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      )}

                      {editMode && (
                        <div className="d-flex gap-2 mt-4">
                          <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button variant="outline-secondary" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Form>

                    {/* Account Actions */}
                    {!editMode && (
                      <div className="border-top pt-4 mt-4">
                        <h6 className="mb-3">Account Actions</h6>
                        <div className="d-flex flex-wrap gap-2">
                          <Button variant="outline-warning" size="sm">
                            Deactivate Account
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>

                {/* Orders Tab */}
                <Tab eventKey="orders" title={
                  <span className="d-flex align-items-center">
                    <FaShoppingBag className="me-2" />
                    Orders
                    <Badge bg="primary" className="ms-2">{orders.length}</Badge>
                  </span>
                }>
                  <div className="p-3">
                    <h5 className="mb-4">Order History</h5>
                    
                    {ordersLoading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading orders...</p>
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="list-group">
                        {orders.map((order) => (
                          <div key={order.orderId} className="list-group-item border-0 shadow-sm mb-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="mb-1">Order #{order.orderId}</h6>
                                <small className="text-muted">
                                  Placed on {new Date(order.orderDate).toLocaleDateString()}
                                </small>
                              </div>
                              <Badge bg={getStatusColor(order.orderStatus)}>
                                {order.orderStatus}
                              </Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className="fw-bold text-success">
                                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                                </span>
                                <small className="text-muted ms-2">
                                  {order.shippingAddress ? 'Delivered to: ' + order.shippingAddress.split(',')[0] : ''}
                                </small>
                              </div>
                              <div className="d-flex gap-2">
                                <Button variant="outline-primary" size="sm">
                                  View Details
                                </Button>
                                {order.orderStatus === 'PENDING' && (
                                  <Button variant="outline-danger" size="sm">
                                    Cancel
                                  </Button>
                                )}
                                {order.orderStatus === 'DELIVERED' && (
                                  <Button variant="outline-success" size="sm">
                                    Rate & Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="info" className="text-center">
                        <FaShoppingBag className="me-2" />
                        You haven't placed any orders yet.
                        <div className="mt-2">
                          <Button variant="primary" as="a" href="/products">
                            Start Shopping
                          </Button>
                        </div>
                      </Alert>
                    )}
                  </div>
                </Tab>

                {/* Addresses Tab */}
                <Tab eventKey="addresses" title={
                  <span className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" />
                    Addresses
                  </span>
                }>
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Saved Addresses</h5>
                      <Button variant="primary" size="sm">
                        <FaEdit className="me-2" />
                        Add New Address
                      </Button>
                    </div>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Card className="border-primary">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">Home</h6>
                              <Badge bg="primary">Default</Badge>
                            </div>
                            <p className="mb-2">
                              123 Main Street<br />
                              New Delhi, Delhi 110001<br />
                              India
                            </p>
                            <div className="d-flex gap-2">
                              <Button variant="outline-primary" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                Remove
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Card className="border-0 shadow-sm">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">Work</h6>
                            </div>
                            <p className="mb-2">
                              456 Business Avenue<br />
                              Mumbai, Maharashtra 400001<br />
                              India
                            </p>
                            <div className="d-flex gap-2">
                              <Button variant="outline-primary" size="sm">
                                Set as Default
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                Remove
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <FaTrash className="me-2" />
            This action is permanent and cannot be undone!
          </Alert>
          <p>
            Are you sure you want to delete your account? This will:
          </p>
          <ul className="text-muted">
            <li>Permanently delete all your personal information</li>
            <li>Remove all your orders and order history</li>
            <li>Delete all your reviews and ratings</li>
            <li>Remove your cart and wishlist items</li>
          </ul>
          <Form.Group className="mb-3">
            <Form.Label>Type "DELETE" to confirm:</Form.Label>
            <Form.Control type="text" placeholder="Type DELETE here" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" disabled>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;