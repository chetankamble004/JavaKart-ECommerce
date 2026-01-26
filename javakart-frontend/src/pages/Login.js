// src/pages/Login.js - UPDATED VERSION
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Spinner
} from 'react-bootstrap';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Log the request for debugging
      console.log('Login attempt with:', { username: formData.username });
      
      const result = await login(formData);
      console.log('Login result:', result);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Cannot connect to server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
                <p className="text-muted mb-0">Sign in to your account</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <FaSignInAlt className="me-2" />
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Form onSubmit={handleSubmit}>
                {/* Username/Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-medium">
                    <FaEnvelope className="me-2" />
                    Username or Email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username or email"
                    required
                    className="py-2"
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="small fw-medium">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <Link to="/forgot-password" className="small text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="py-2"
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                {/* Remember Me */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    className="small"
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </Form>

              {/* Sign Up Link */}
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none fw-medium">
                    Create one now
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="text-decoration-none">Terms</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;