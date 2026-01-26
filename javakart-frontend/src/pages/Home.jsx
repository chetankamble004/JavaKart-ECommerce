import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFire, FaTag, FaShippingFast, FaShieldAlt, FaHeadphones } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  useEffect(() => {
    if (products) {
      // Get 6 random featured products
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 6));
      setLoading(false);
    }
  }, [products]);

  // Hero carousel items
  const carouselItems = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Summer Sale',
      description: 'Up to 50% off on all electronics',
      buttonText: 'Shop Now',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'New Arrivals',
      description: 'Discover the latest fashion trends',
      buttonText: 'Explore',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Free Shipping',
      description: 'On orders above ₹999',
      buttonText: 'Start Shopping',
    },
  ];

  // Features
  const features = [
    {
      icon: <FaShippingFast size={40} />,
      title: 'Free Shipping',
      description: 'On orders above ₹999',
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: <FaHeadphones size={40} />,
      title: '24/7 Support',
      description: 'Dedicated customer support',
    },
    {
      icon: <FaTag size={40} />,
      title: 'Best Prices',
      description: 'Guaranteed best prices',
    },
  ];

  // Categories
  const categories = [
    { name: 'Electronics', icon: '💻', count: 120, color: 'primary' },
    { name: 'Fashion', icon: '👕', count: 85, color: 'success' },
    { name: 'Home & Kitchen', icon: '🏠', count: 67, color: 'warning' },
    { name: 'Books', icon: '📚', count: 42, color: 'info' },
  ];

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Carousel fade className="mb-5">
        {carouselItems.map((item) => (
          <Carousel.Item key={item.id}>
            <div
              className="d-block w-100"
              style={{
                height: '500px',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="carousel-caption d-flex flex-column justify-content-center h-100">
                <h1 className="display-4 fw-bold mb-3">{item.title}</h1>
                <p className="lead mb-4">{item.description}</p>
                <Button as={Link} to="/products" variant="primary" size="lg">
                  {item.buttonText}
                </Button>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container>
        {/* Features Section */}
        <section className="features-section mb-5">
          <h2 className="text-center mb-4">Why Choose JavaKart?</h2>
          <Row>
            {features.map((feature, index) => (
              <Col md={3} sm={6} key={index} className="mb-4">
                <div className="text-center p-4 border rounded-3 h-100">
                  <div className="text-primary mb-3">{feature.icon}</div>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* Categories Section */}
        <section className="categories-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Shop by Category</h2>
            <Link to="/products" className="text-decoration-none">
              View All →
            </Link>
          </div>
          <Row>
            {categories.map((category, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card 
                  as={Link} 
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="text-decoration-none text-dark h-100 border-0 shadow-sm"
                >
                  <Card.Body className="text-center p-4">
                    <div className={`display-4 mb-3 text-${category.color}`}>
                      {category.icon}
                    </div>
                    <Card.Title className="fw-bold">{category.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {category.count} products
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Featured Products */}
        <section className="featured-products mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <FaFire className="text-danger me-2" />
              Featured Products
            </h2>
            <Link to="/products" className="btn btn-outline-primary">
              View All Products
            </Link>
          </div>

          {loading || isLoading ? (
            <Row>
              {[...Array(4)].map((_, index) => (
                <Col lg={3} md={6} key={index} className="mb-4">
                  <Skeleton height={300} />
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              {featuredProducts.map((product) => (
                <Col lg={3} md={6} key={product.productId} className="mb-4">
                  <Card className="product-card h-100">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                        alt={product.productName}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      {product.stockQuantity < 10 && (
                        <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold">{product.productName}</Card.Title>
                      <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        {product.description?.substring(0, 60)}...
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <span className="fs-5 fw-bold text-primary">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-muted text-decoration-line-through ms-2">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" />
                          <span>{product.rating || 0}</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <Button 
                          as={Link} 
                          to={`/products/${product.productId}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                        <Button variant="primary" size="sm">
                          <FaShoppingCart className="me-1" /> Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* Call to Action */}
        <section className="cta-section mb-5">
          <div className="bg-primary text-white rounded-3 p-5 text-center">
            <h2 className="display-5 fw-bold mb-3">Start Shopping Today!</h2>
            <p className="lead mb-4">
              Join thousands of satisfied customers. Sign up now and get 10% off your first order.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/register" variant="light" size="lg">
                Sign Up Free
              </Button>
              <Button as={Link} to="/products" variant="outline-light" size="lg">
                Browse Products
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Home;