// src/pages/Register.js - UPDATED VERSION
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Spinner
} from 'react-bootstrap';
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaEye, FaEyeSlash, FaUserPlus, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    mobile: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mobile: formData.mobile
      };

      console.log('Registering user:', userData);
      const result = await register(userData);
      console.log('Registration result:', result);
      
      if (result.success) {
        setRegisteredUser(result.data);
        setSuccess(true);
        toast.success('Registration successful! Please login.');
        
        // Auto login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ server: result.error || 'Registration failed' });
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ server: 'Cannot connect to server. Please check if backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  if (success && registeredUser) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-lg text-center">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <FaCheckCircle size={80} className="text-success" />
                </div>
                <h3 className="fw-bold mb-3">Registration Successful!</h3>
                <p className="text-muted mb-4">
                  Welcome to JavaKart, <strong>{registeredUser.fullName}</strong>!
                </p>
                <Alert variant="success" className="text-start">
                  <p className="mb-2">Account created successfully!</p>
                  <p className="mb-0">Redirecting to login page...</p>
                </Alert>
                <div className="mt-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              {/* JavaKart Logo & Title */}
              <div className="text-center mb-4">
                <h1 className="fw-bold mb-3" style={{ 
                  color: '#000',
                  fontSize: '2.5rem',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <span style={{ color: '#f0c14b' }}>Java</span>
                  <span style={{ color: '#232f3e' }}>Kart</span>
                </h1>
                <p className="text-muted">Create your JavaKart account</p>
              </div>

              {/* Server Error Alert */}
              {errors.server && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <FaUserPlus className="me-2" />
                  {errors.server}
                </Alert>
              )}

              {/* Registration Form */}
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Full Name */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-medium">
                        <FaUser className="me-2" />
                        Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        isInvalid={!!errors.fullName}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Mobile */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-medium">
                        <FaPhone className="me-2" />
                        Mobile Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter 10-digit mobile"
                        isInvalid={!!errors.mobile}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobile}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Username */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-medium">
                    <FaUser className="me-2" />
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    isInvalid={!!errors.username}
                    className="py-2"
                  />
                  <Form.Text className="text-muted small">
                    This will be your unique identifier
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-medium">
                    <FaEnvelope className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    isInvalid={!!errors.email}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  {/* Password */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-medium">
                        <FaLock className="me-2" />
                        Password
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          isInvalid={!!errors.password}
                          className="py-2"
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 top-50 translate-middle-y"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </div>
                      <Form.Text className="text-muted small">
                        At least 6 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Confirm Password */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-medium">
                        <FaLock className="me-2" />
                        Confirm Password
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          isInvalid={!!errors.confirmPassword}
                          className="py-2"
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 top-50 translate-middle-y"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Terms Agreement */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label={
                      <span className="small">
                        I agree to the{' '}
                        <Link to="/terms" className="text-decoration-none">Terms & Conditions</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                      </span>
                    }
                    required
                  />
                </Form.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2" />
                      Create Account
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;