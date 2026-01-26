// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      const allProducts = response.data;
      setProducts(allProducts.slice(0, 8));
      setFeaturedProducts(allProducts.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success('Added to cart successfully!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const carouselItems = [
    {
      id: 1,
      title: 'Great Indian Festival',
      description: 'Up to 70% off | Electronics, Fashion, Home & more',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      bgColor: '#FFD814'
    },
    {
      id: 2,
      title: 'Best of Electronics',
      description: 'Laptops, Mobiles, TVs & more starting from ₹8,999',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
      bgColor: '#146EB4'
    },
    {
      id: 3,
      title: 'Fashion Sale',
      description: 'Min. 60% off | Clothing, Shoes, Watches',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w-1200',
      bgColor: '#FF9900'
    }
  ];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Carousel className="mb-4">
        {carouselItems.map((item) => (
          <Carousel.Item key={item.id}>
            <div 
              className="d-block w-100" 
              style={{
                height: '400px',
                background: `linear-gradient(135deg, ${item.bgColor} 0%, ${item.bgColor}80 100%)`,
                position: 'relative'
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center">
                <Container>
                  <Row className="align-items-center">
                    <Col md={6}>
                      <h1 className="display-4 fw-bold text-white mb-3">{item.title}</h1>
                      <p className="lead text-white mb-4">{item.description}</p>
                      <Button 
                        variant="light" 
                        size="lg" 
                        className="fw-bold px-4"
                        as={Link}
                        to="/products"
                      >
                        Shop Now <FaArrowRight className="ms-2" />
                      </Button>
                    </Col>
                    <Col md={6} className="text-center">
                      <div className="position-relative">
                        <div className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle" 
                             style={{ width: '300px', height: '300px', opacity: 0.1 }}></div>
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          className="img-fluid rounded shadow-lg"
                          style={{ maxHeight: '300px', objectFit: 'cover' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container>
        {/* Featured Categories */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Shop by Category</h2>
            <Link to="/products" className="text-decoration-none text-primary">
              See all <FaArrowRight />
            </Link>
          </div>
          <Row>
            {['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Beauty', 'Sports'].map((cat, idx) => (
              <Col md={2} sm={4} xs={6} key={idx} className="mb-3">
                <Card className="h-100 text-center border-0 shadow-sm hover-shadow">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                    <div className="mb-3 bg-light rounded-circle p-3">
                      <span className="fs-4">📱</span>
                    </div>
                    <Card.Text className="fw-medium text-dark">{cat}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Featured Products */}
        <section className="mb-5">
          <h2 className="fw-bold mb-4">Featured Products</h2>
          <Row>
            {featuredProducts.map((product) => (
              <Col lg={3} md={4} sm={6} xs={12} key={product.productId} className="mb-4">
                <Card className="h-100 product-card border-0 shadow-sm">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={product.imageUrl || 'https://via.placeholder.com/300x200'} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <span className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 small">
                        Only {product.stockQuantity} left!
                      </span>
                    )}
                    {product.stockQuantity === 0 && (
                      <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-6 text-truncate-2 mb-2">
                      {product.productName}
                    </Card.Title>
                    <div className="d-flex align-items-center mb-2">
                      <div className="text-warning">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'} 
                            size={14}
                          />
                        ))}
                      </div>
                      <span className="ms-2 small text-muted">({product.rating || 0})</span>
                    </div>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 mb-0 text-success">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-muted text-decoration-line-through small">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="w-100 d-flex align-items-center justify-content-center"
                        onClick={() => handleAddToCart(product.productId)}
                        disabled={product.stockQuantity === 0}
                      >
                        <FaShoppingCart className="me-2" />
                        {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Banner Section */}
        <section className="mb-5">
          <div className="bg-gradient rounded-3 p-5 text-white" 
               style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Row className="align-items-center">
              <Col md={8}>
                <h2 className="display-6 fw-bold mb-3">Free Delivery on Your First Order!</h2>
                <p className="lead mb-4">
                  Sign up today and get free delivery on your first purchase. 
                  No minimum order value required.
                </p>
                <Button 
                  variant="light" 
                  size="lg" 
                  className="fw-bold px-4"
                  as={Link}
                  to="/register"
                >
                  Sign Up Free
                </Button>
              </Col>
              <Col md={4} className="text-center">
                <div className="fs-1">🚚</div>
              </Col>
            </Row>
          </div>
        </section>

        {/* More Products */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Latest Products</h2>
            <Link to="/products" className="btn btn-outline-primary">
              View All Products
            </Link>
          </div>
          <Row>
            {products.map((product) => (
              <Col lg={3} md={4} sm={6} xs={12} key={product.productId} className="mb-4">
                <Card className="h-100 product-card border-0 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={product.imageUrl || 'https://via.placeholder.com/300x200'} 
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-6 text-truncate-2 mb-2">
                      <Link to={`/products/${product.productId}`} className="text-dark text-decoration-none">
                        {product.productName}
                      </Link>
                    </Card.Title>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 mb-0 text-success">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </span>
                        <span className="badge bg-info">{product.categoryName}</span>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-100"
                        onClick={() => handleAddToCart(product.productId)}
                        disabled={product.stockQuantity === 0}
                      >
                        {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Home;