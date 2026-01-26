import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial values
  const initialValues = {
    username: '',
    email: '',
    mobile: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  };

  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username cannot exceed 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name cannot exceed 50 characters'),
    
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      // Prepare registration data (remove confirmPassword)
      const { confirmPassword, ...registrationData } = values;
      await register(registrationData);
      navigate('/');
      toast.success('Registration successful! Welcome to JavaKart!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
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
                    <FaUserPlus size={28} className="text-white" />
                  </div>
                  <h2 className="fw-bold">Create Account</h2>
                  <p className="text-muted">Join JavaKart today</p>
                </div>

                {/* Form */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <Row>
                        {/* Full Name */}
                        <Col md={6} className="mb-3">
                          <label htmlFor="fullName" className="form-label fw-semibold">
                            Full Name *
                          </label>
                          <Field
                            type="text"
                            id="fullName"
                            name="fullName"
                            className={`form-control ${errors.fullName && touched.fullName ? 'is-invalid' : ''}`}
                            placeholder="Enter your full name"
                          />
                          <ErrorMessage
                            name="fullName"
                            component="div"
                            className="invalid-feedback d-block"
                          />
                        </Col>

                        {/* Username */}
                        <Col md={6} className="mb-3">
                          <label htmlFor="username" className="form-label fw-semibold">
                            Username *
                          </label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                            placeholder="Choose a username"
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="invalid-feedback d-block"
                          />
                        </Col>
                      </Row>

                      {/* Email */}
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">
                          Email Address *
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                          placeholder="Enter your email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback d-block"
                        />
                      </div>

                      {/* Mobile */}
                      <div className="mb-3">
                        <label htmlFor="mobile" className="form-label fw-semibold">
                          Mobile Number *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">+91</span>
                          <Field
                            type="tel"
                            id="mobile"
                            name="mobile"
                            className={`form-control ${errors.mobile && touched.mobile ? 'is-invalid' : ''}`}
                            placeholder="Enter 10-digit mobile number"
                            maxLength="10"
                          />
                        </div>
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="invalid-feedback d-block"
                        />
                      </div>

                      <Row>
                        {/* Password */}
                        <Col md={6} className="mb-3">
                          <label htmlFor="password" className="form-label fw-semibold">
                            Password *
                          </label>
                          <div className="input-group">
                            <Field
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              name="password"
                              className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                              placeholder="Create password"
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
                          <small className="text-muted">
                            At least 6 characters with uppercase, lowercase, and number
                          </small>
                        </Col>

                        {/* Confirm Password */}
                        <Col md={6} className="mb-4">
                          <label htmlFor="confirmPassword" className="form-label fw-semibold">
                            Confirm Password *
                          </label>
                          <div className="input-group">
                            <Field
                              type={showConfirmPassword ? 'text' : 'password'}
                              id="confirmPassword"
                              name="confirmPassword"
                              className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                              placeholder="Confirm password"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="invalid-feedback d-block"
                          />
                        </Col>
                      </Row>

                      {/* Terms and Conditions */}
                      <div className="mb-4">
                        <div className="form-check">
                          <Field
                            type="checkbox"
                            id="terms"
                            name="terms"
                            className="form-check-input"
                            required
                          />
                          <label htmlFor="terms" className="form-check-label">
                            I agree to the{' '}
                            <Link to="/terms" className="text-decoration-none">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-decoration-none">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                      </div>

                      {/* General Error */}
                      {errors.general && (
                        <Alert variant="danger" className="text-center mb-3">
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
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>

                      {/* Divider */}
                      <div className="position-relative text-center my-4">
                        <hr />
                        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                          Already have an account?
                        </span>
                      </div>

                      {/* Login Link */}
                      <div className="text-center">
                        <p className="mb-0">
                          <Link to="/login" className="text-decoration-none fw-semibold">
                            Sign in to your account
                          </Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>

            {/* Benefits */}
            <div className="mt-4 p-4 bg-light rounded-3">
              <h6 className="fw-bold mb-3">Benefits of joining JavaKart:</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">✓ Fast and secure checkout</li>
                <li className="mb-2">✓ Track your orders in real-time</li>
                <li className="mb-2">✓ Exclusive member-only deals</li>
                <li className="mb-2">✓ Save your shipping addresses</li>
                <li>✓ 24/7 customer support</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;