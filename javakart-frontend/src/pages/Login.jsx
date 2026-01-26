import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial values
  const initialValues = {
    username: '',
    password: '',
  };

  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username or email is required')
      .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      await login(values);
      navigate('/');
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Demo accounts
  const demoAccounts = [
    { username: 'admin', password: 'Admin@123', role: 'Admin' },
    { username: 'testuser', password: 'Test@123', role: 'User' },
  ];

  const useDemoAccount = (account) => {
    document.querySelector('input[name="username"]').value = account.username;
    document.querySelector('input[name="password"]').value = account.password;
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="auth-card shadow-lg">
              <Card.Body className="p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FaSignInAlt size={28} className="text-white" />
                  </div>
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {/* Demo Accounts */}
                <div className="mb-4">
                  <h6 className="mb-2">Demo Accounts:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {demoAccounts.map((account, index) => (
                      <Button
                        key={index}
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => useDemoAccount(account)}
                        className="d-flex align-items-center"
                      >
                        <span className="badge bg-primary me-1">{account.role}</span>
                        {account.username}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      {/* Username/Email Field */}
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label fw-semibold">
                          Username or Email
                        </label>
                        <div className="input-group">
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                            placeholder="Enter username or email"
                          />
                        </div>
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="invalid-feedback d-block"
                        />
                      </div>

                      {/* Password Field */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label htmlFor="password" className="form-label fw-semibold">
                            Password
                          </label>
                          <Link to="/forgot-password" className="text-decoration-none text-primary small">
                            Forgot Password?
                          </Link>
                        </div>
                        <div className="input-group">
                          <Field
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback d-block"
                        />
                      </div>

                      {/* General Error */}
                      {errors.general && (
                        <Alert variant="danger" className="text-center">
                          {errors.general}
                        </Alert>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-100 mb-3"
                        disabled={isSubmitting || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>

                      {/* Social Login (Optional) */}
                      <div className="text-center mb-4">
                        <span className="text-muted">Or sign in with</span>
                        <div className="d-flex justify-content-center gap-3 mt-2">
                          <Button variant="outline-danger" className="rounded-circle">
                            <i className="fab fa-google"></i>
                          </Button>
                          <Button variant="outline-primary" className="rounded-circle">
                            <i className="fab fa-facebook-f"></i>
                          </Button>
                          <Button variant="outline-dark" className="rounded-circle">
                            <i className="fab fa-github"></i>
                          </Button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="position-relative text-center my-4">
                        <hr />
                        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                          or
                        </span>
                      </div>

                      {/* Register Link */}
                      <div className="text-center">
                        <p className="mb-0">
                          Don't have an account?{' '}
                          <Link to="/register" className="text-decoration-none fw-semibold">
                            Sign up here
                          </Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <p className="text-muted small">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;