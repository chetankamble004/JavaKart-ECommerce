// src/pages/Products.js
import React, { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, 
  InputGroup, Dropdown, Pagination, Spinner,
  Badge, Modal, Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaFilter, FaStar, FaShoppingCart, 
  FaSortAmountDown, FaSortAmountUp, FaTimes
} from 'react-icons/fa';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, categoryFilter, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      const data = response.data;
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(p => p.categoryName).filter(Boolean))];
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.categoryName === categoryFilter);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success('Added to cart successfully!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setCategoryFilter(category === categoryFilter ? '' : category);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPriceRange([0, 100000]);
    setSortBy('default');
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold">Products</h1>
        <p className="text-muted">
          {filteredProducts.length} products found
          {categoryFilter && ` in ${categoryFilter}`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      <Row>
        {/* Filters Sidebar (Mobile Modal) */}
        <Col lg={3} className="d-none d-lg-block">
          <Card className="shadow-sm mb-4 sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0 d-flex align-items-center">
                <FaFilter className="me-2" />
                Filters
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Search */}
              <div className="mb-4">
                <h6 className="mb-2">Search</h6>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h6 className="mb-2">Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      pill
                      bg={categoryFilter === category ? 'primary' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleCategorySelect(category)}
                      style={{ cursor: 'pointer' }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h6 className="mb-2">Price Range</h6>
                <Form.Range
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                />
                <div className="d-flex justify-content-between mt-2">
                  <small>₹0</small>
                  <small>₹{priceRange[1].toLocaleString('en-IN')}</small>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || categoryFilter || priceRange[1] < 100000) && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100"
                  onClick={clearFilters}
                >
                  <FaTimes className="me-1" />
                  Clear Filters
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Mobile Filters Button */}
        <div className="d-lg-none mb-3">
          <Button
            variant="outline-primary"
            className="w-100 d-flex align-items-center justify-content-center"
            onClick={() => setShowFilters(true)}
          >
            <FaFilter className="me-2" />
            Show Filters
          </Button>
        </div>

        {/* Products Grid */}
        <Col lg={9}>
          {/* Toolbar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="text-muted">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </span>
            </div>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                {sortBy === 'default' && <>Sort by: Default</>}
                {sortBy === 'price-low' && <>Sort by: Price: Low to High</>}
                {sortBy === 'price-high' && <>Sort by: Price: High to Low</>}
                {sortBy === 'rating' && <>Sort by: Rating</>}
                {sortBy === 'name' && <>Sort by: Name</>}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSortChange('default')}>
                  Default
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange('price-low')}>
                  <FaSortAmountDown className="me-2" />
                  Price: Low to High
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange('price-high')}>
                  <FaSortAmountUp className="me-2" />
                  Price: High to Low
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange('rating')}>
                  <FaStar className="me-2" />
                  Rating
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange('name')}>
                  Name A-Z
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Products */}
          {currentProducts.length > 0 ? (
            <>
              <Row>
                {currentProducts.map((product) => (
                  <Col xl={3} lg={4} md={6} sm={6} xs={12} key={product.productId} className="mb-4">
                    <Card className="h-100 product-card border-0 shadow-sm">
                      <Link to={`/products/${product.productId}`}>
                        <Card.Img
                          variant="top"
                          src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                          style={{ height: '200px', objectFit: 'cover' }}
                          className="p-3"
                        />
                      </Link>
                      <Card.Body className="d-flex flex-column">
                        <Link to={`/products/${product.productId}`} className="text-decoration-none">
                          <Card.Title className="fs-6 text-truncate-2 text-dark mb-2">
                            {product.productName}
                          </Card.Title>
                        </Link>
                        <div className="d-flex align-items-center mb-2">
                          <div className="text-warning">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'}
                                size={12}
                              />
                            ))}
                          </div>
                          <span className="ms-2 small text-muted">({product.rating || 0})</span>
                        </div>
                        <Card.Text className="small text-muted text-truncate-3 mb-3">
                          {product.description}
                        </Card.Text>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="h5 mb-0 text-success">
                              ₹{product.price?.toLocaleString('en-IN')}
                            </span>
                            <Badge bg="info">{product.categoryName}</Badge>
                          </div>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="flex-grow-1"
                              onClick={() => handleAddToCart(product.productId)}
                              disabled={product.stockQuantity === 0}
                            >
                              <FaShoppingCart className="me-2" />
                              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              as={Link}
                              to={`/products/${product.productId}`}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <Alert variant="info" className="text-center py-5">
              <h4>No products found</h4>
              <p>Try adjusting your filters or search term</p>
              <Button variant="outline-primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Alert>
          )}
        </Col>
      </Row>

      {/* Mobile Filters Modal */}
      <Modal show={showFilters} onHide={() => setShowFilters(false)} fullscreen="sm-down">
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mobile filter content */}
          <div className="mb-4">
            <h6 className="mb-2">Search</h6>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className="mb-4">
            <h6 className="mb-2">Categories</h6>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  pill
                  bg={categoryFilter === category ? 'primary' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => handleCategorySelect(category)}
                  style={{ cursor: 'pointer' }}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="mb-2">Price Range</h6>
            <Form.Range
              min="0"
              max="100000"
              step="1000"
              value={priceRange[1]}
              onChange={handlePriceChange}
            />
            <div className="d-flex justify-content-between mt-2">
              <small>₹0</small>
              <small>₹{priceRange[1].toLocaleString('en-IN')}</small>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilters(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowFilters(false)}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Products;