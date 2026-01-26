// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto">
      <Container className="py-4">
        <Row>
          <Col md={4}>
            <h5>JavaKart</h5>
            <p className="text-muted small">
              Your one-stop destination for all shopping needs. 
              Quality products, best prices.
            </p>
          </Col>
          
          <Col md={4}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="/" className="text-muted">Home</a></li>
              <li><a href="/products" className="text-muted">Products</a></li>
              <li><a href="/about" className="text-muted">About Us</a></li>
              <li><a href="/contact" className="text-muted">Contact</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h6>Connect With Us</h6>
            <div className="d-flex gap-3 mt-2">
              <a href="#" className="text-light"><FaFacebook /></a>
              <a href="#" className="text-light"><FaTwitter /></a>
              <a href="#" className="text-light"><FaInstagram /></a>
              <a href="#" className="text-light"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-4 pt-3 border-top border-secondary">
          <Col className="text-center">
            <small className="text-muted">
              © {new Date().getFullYear()} JavaKart. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;