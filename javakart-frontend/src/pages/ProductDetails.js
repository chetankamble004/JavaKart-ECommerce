// src/pages/ProductDetails.js (Updated version)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Button, Image,
  Badge, Alert, Spinner, Tabs, Tab, Form,
  ListGroup, Modal
} from 'react-bootstrap';
import {
  FaStar, FaShoppingCart, FaHeart, FaShareAlt,
  FaTruck, FaShieldAlt, FaUndo, FaStarHalfAlt,
  FaPlus, FaMinus, FaCheckCircle
} from 'react-icons/fa';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Custom Star Rating Component
const StarRating = ({ rating, onRatingChange = null, size = 20, readonly = false }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          fontSize: `${size}px`,
          cursor: onRatingChange && !readonly ? 'pointer' : 'default',
          color: i <= rating ? '#ffc107' : '#e4e5e9',
          marginRight: '4px',
          transition: 'color 0.2s'
        }}
        onClick={() => !readonly && onRatingChange && onRatingChange(i)}
        onMouseEnter={(e) => {
          if (!readonly && onRatingChange) {
            e.target.style.color = '#ffc107';
          }
        }}
        onMouseLeave={(e) => {
          if (!readonly && onRatingChange) {
            e.target.style.color = i <= rating ? '#ffc107' : '#e4e5e9';
          }
        }}
      >
        ★
      </span>
    );
  }
  
  return <div>{stars}</div>;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    }
  };

  const fetchReviews = async () => {
    try {
      const [reviewsRes, avgRes] = await Promise.all([
        reviewAPI.getByProduct(id),
        reviewAPI.getAverage(id)
      ]);
      setReviews(reviewsRes.data);
      setAverageRating(avgRes.data || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < (product?.stockQuantity || 0)) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const result = await addToCart(product.productId, quantity);
    if (result.success) {
      toast.success(`${quantity} ${product.productName} added to cart!`);
      setShowSuccessModal(true);
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to purchase');
      navigate('/login');
      return;
    }

    const result = await addToCart(product.productId, quantity);
    if (result.success) {
      navigate('/checkout');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to submit a review');
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewAPI.add({
        productId: id,
        userId: user.userId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      toast.success('Review submitted successfully!');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-muted" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Product not found</h4>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* Product Images */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-3">
                <Image
                  src={product.imageUrl || 'https://via.placeholder.com/500x500'}
                  alt={product.productName}
                  fluid
                  className="rounded"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
              <div className="d-flex justify-content-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="border rounded p-1" style={{ width: '60px', height: '60px' }}>
                    <Image
                      src={product.imageUrl || 'https://via.placeholder.com/60x60'}
                      alt={`Thumbnail ${num}`}
                      fluid
                      className="h-100 w-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Product Info */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb small">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/products">Products</a>
                  </li>
                  {product.categoryName && (
                    <li className="breadcrumb-item">
                      <a href={`/products?category=${product.categoryName}`}>
                        {product.categoryName}
                      </a>
                    </li>
                  )}
                  <li className="breadcrumb-item active" aria-current="page">
                    {product.productName}
                  </li>
                </ol>
              </nav>

              {/* Product Title & Rating */}
              <h1 className="h2 fw-bold mb-2">{product.productName}</h1>
              <div className="d-flex align-items-center mb-3">
                <div className="d-flex align-items-center me-3">
                  <div className="me-2">
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-muted">({averageRating.toFixed(1)})</span>
                </div>
                <Badge bg="info">{product.categoryName}</Badge>
                {product.stockQuantity > 0 && (
                  <Badge bg="success" className="ms-2">
                    In Stock
                  </Badge>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <h2 className="text-success fw-bold">
                  ₹{product.price?.toLocaleString('en-IN')}
                </h2>
                <p className="text-muted small">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Stock Status */}
              {product.stockQuantity > 0 ? (
                <Alert variant="success" className="d-flex align-items-center">
                  <FaTruck className="me-2" />
                  <div>
                    <strong>Available</strong>
                    {product.stockQuantity < 10 && (
                      <span className="ms-2">
                        Only {product.stockQuantity} left in stock
                      </span>
                    )}
                  </div>
                </Alert>
              ) : (
                <Alert variant="danger" className="d-flex align-items-center">
                  <FaTruck className="me-2" />
                  <div>
                    <strong>Out of Stock</strong>
                    <span className="ms-2">This item is currently unavailable</span>
                  </div>
                </Alert>
              )}

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="form-label fw-medium">Quantity:</label>
                <div className="d-flex align-items-center" style={{ maxWidth: '150px' }}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stockQuantity) {
                        setQuantity(val);
                      }
                    }}
                    className="text-center mx-2"
                    style={{ width: '60px' }}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= product.stockQuantity}
                  >
                    <FaPlus />
                  </Button>
                  <span className="ms-3 small text-muted">
                    {product.stockQuantity} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                >
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="warning"
                  size="lg"
                  className="flex-grow-1"
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                >
                  Buy Now
                </Button>
                <Button variant="outline-secondary" size="lg">
                  <FaHeart />
                </Button>
                <Button variant="outline-secondary" size="lg">
                  <FaShareAlt />
                </Button>
              </div>

              {/* Delivery Info */}
              <Card className="bg-light border-0 mb-4">
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3 mb-md-0">
                      <div className="d-flex align-items-start">
                        <FaTruck className="text-primary me-2 mt-1" />
                        <div>
                          <h6 className="mb-1">Free Delivery</h6>
                          <p className="small mb-0">Order above ₹499</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <FaShieldAlt className="text-success me-2 mt-1" />
                        <div>
                          <h6 className="mb-1">Secure Payment</h6>
                          <p className="small mb-0">100% Secure</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Product Tabs */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="description" title="Description">
                  <div className="p-3">
                    <h5 className="mb-3">Product Description</h5>
                    <p className="mb-4">{product.description || 'No description available.'}</p>
                    
                    <h6 className="mb-2">Key Features:</h6>
                    <ul>
                      <li>High quality materials</li>
                      <li>Manufacturer warranty included</li>
                      <li>Easy to use and maintain</li>
                      <li>Customer support available</li>
                    </ul>
                  </div>
                </Tab>
                
                <Tab eventKey="specifications" title="Specifications">
                  <div className="p-3">
                    <h5 className="mb-3">Product Specifications</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Product Name</span>
                        <span>{product.productName}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Category</span>
                        <span>{product.categoryName}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Price</span>
                        <span>₹{product.price?.toLocaleString('en-IN')}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Stock Available</span>
                        <span>{product.stockQuantity} units</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Average Rating</span>
                        <span>{averageRating.toFixed(1)} / 5.0</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </Tab>
                
                <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
                  <div className="p-3">
                    {/* Overall Rating */}
                    <div className="mb-4 p-4 bg-light rounded">
                      <Row className="align-items-center">
                        <Col md={4} className="text-center mb-3 mb-md-0">
                          <div className="display-4 fw-bold text-warning">
                            {averageRating.toFixed(1)}
                          </div>
                          <div className="small">
                            {renderStars(averageRating)}
                          </div>
                          <p className="mt-2 small text-muted">
                            {reviews.length} customer reviews
                          </p>
                        </Col>
                        <Col md={8}>
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.filter(r => r.rating === star).length;
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                              <div key={star} className="d-flex align-items-center mb-2">
                                <span className="small me-2">{star} star</span>
                                <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                  <div
                                    className="progress-bar bg-warning"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="small ms-2" style={{ minWidth: '30px' }}>
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </Col>
                      </Row>
                    </div>

                    {/* Add Review Form */}
                    {isAuthenticated && (
                      <Card className="mb-4 border">
                        <Card.Body>
                          <h6>Write a Review</h6>
                          <Form onSubmit={handleSubmitReview}>
                            <div className="mb-3">
                              <label className="form-label">Rating</label>
                              <div>
                                <StarRating
                                  rating={newReview.rating}
                                  onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                                  size={24}
                                />
                              </div>
                            </div>
                            <Form.Group className="mb-3">
                              <Form.Label>Your Review</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Share your experience with this product..."
                                required
                              />
                            </Form.Group>
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={submittingReview}
                            >
                              {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    )}

                    {/* Reviews List */}
                    <div>
                      <h6 className="mb-3">Customer Reviews</h6>
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <Card key={review.reviewId} className="mb-3 border-0 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">{review.userName}</h6>
                                  <div className="d-flex align-items-center">
                                    <div className="text-warning me-2">
                                      {renderStars(review.rating)}
                                    </div>
                                    <span className="small text-muted">
                                      {new Date(review.reviewDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                {review.isVerifiedPurchase && (
                                  <Badge bg="success">Verified Purchase</Badge>
                                )}
                              </div>
                              <p className="mb-0">{review.comment}</p>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <Alert variant="info">
                          No reviews yet. Be the first to review this product!
                        </Alert>
                      )}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Similar Products */}
      <Row className="mt-5">
        <Col>
          <h4 className="mb-4">Similar Products</h4>
          <Row>
            {/* This would fetch similar products from API */}
            <Col lg={3} md={4} sm={6} xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src="https://via.placeholder.com/300x200"
                  style={{ height: '150px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="fs-6">Similar Product</Card.Title>
                  <Card.Text className="text-success fw-bold">₹999</Card.Text>
                  <Button variant="outline-primary" size="sm">
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Body className="text-center p-5">
          <div className="mb-4">
            <FaCheckCircle size={80} className="text-success" />
          </div>
          <h3 className="mb-3">Added to Cart!</h3>
          <p className="text-muted mb-4">
            {quantity} × {product.productName} has been added to your cart.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="outline-primary"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/products');
              }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/cart');
              }}
            >
              View Cart
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProductDetails;