import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <Container>
        <Row>
          {/* Company Info */}
          <Col lg={4} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">
              <span className="text-primary">Java</span>Kart
            </h5>
            <p className="text-muted">
              Your one-stop destination for all shopping needs. 
              We provide quality products with excellent customer service.
            </p>
            <div className="d-flex mt-3">
              <a href="#" className="text-white me-3"><FaFacebook size={20} /></a>
              <a href="#" className="text-white me-3"><FaTwitter size={20} /></a>
              <a href="#" className="text-white me-3"><FaInstagram size={20} /></a>
              <a href="#" className="text-white me-3"><FaLinkedin size={20} /></a>
              <a href="#" className="text-white"><FaGithub size={20} /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/products" className="text-muted text-decoration-none">Products</Link></li>
              <li className="mb-2"><Link to="/cart" className="text-muted text-decoration-none">Cart</Link></li>
              <li className="mb-2"><Link to="/orders" className="text-muted text-decoration-none">Orders</Link></li>
              <li><Link to="/profile" className="text-muted text-decoration-none">Profile</Link></li>
            </ul>
          </Col>

          {/* Categories */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/products?category=electronics" className="text-muted text-decoration-none">Electronics</Link></li>
              <li className="mb-2"><Link to="/products?category=fashion" className="text-muted text-decoration-none">Fashion</Link></li>
              <li className="mb-2"><Link to="/products?category=home" className="text-muted text-decoration-none">Home & Kitchen</Link></li>
              <li className="mb-2"><Link to="/products?category=books" className="text-muted text-decoration-none">Books</Link></li>
              <li><Link to="/products?category=sports" className="text-muted text-decoration-none">Sports</Link></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={4} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-primary" />
                <span className="text-muted">123 Shopping Street, Mumbai, India - 400001</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2 text-primary" />
                <a href="tel:+911234567890" className="text-muted text-decoration-none">+91 12345 67890</a>
              </li>
              <li className="d-flex align-items-center">
                <FaEnvelope className="me-2 text-primary" />
                <a href="mailto:support@javakart.com" className="text-muted text-decoration-none">support@javakart.com</a>
              </li>
            </ul>
            <div className="mt-3">
              <h6 className="fw-bold mb-2">Newsletter</h6>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email" 
                />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 text-muted">
              &copy; {currentYear} JavaKart. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link to="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-muted text-decoration-none me-3">Terms of Service</Link>
            <Link to="/refund" className="text-muted text-decoration-none">Refund Policy</Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;