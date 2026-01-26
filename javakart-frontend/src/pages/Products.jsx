import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter, FaSort, FaSearch, FaEye } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const itemsPerPage = 12;

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', searchQuery, category],
    queryFn: () => {
      if (searchQuery) {
        return productService.searchProducts(searchQuery);
      }
      if (category) {
        return productService.getProductsByCategory(1); // This needs actual category ID
      }
      return productService.getProducts();
    },
  });

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.price);
    return price >= priceRange.min && price <= priceRange.max;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
        break;
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'name':
      default:
        aValue = a.productName.toLowerCase();
        bValue = b.productName.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category) params.set('category', category);
    setSearchParams(params);
  };

  // Handle category change
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    setSearchParams(params);
  };

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'books', name: 'Books' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'sports', name: 'Sports' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Highest Rated' },
  ];

  // Handle sort change
  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split('-');
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  // Add to cart handler
  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  return (
    <Container className="py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold">Products</h1>
        <p className="text-muted">
          {searchQuery ? `Search results for "${searchQuery}"` : 
           category ? `Category: ${category}` : 
           'Browse our collection of products'}
        </p>
      </div>

      <Row>
        {/* Sidebar Filters */}
        <Col lg={3} className="mb-4">
          <Card className="sticky-top" style={{ top: '80px' }}>
            <Card.Body>
              {/* Search */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">
                  <FaSearch className="me-2" />
                  Search
                </h6>
                <Form onSubmit={handleSearch}>
                  <Form.Control
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  <Button type="submit" variant="primary" className="w-100">
                    Search
                  </Button>
                </Form>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">
                  <FaFilter className="me-2" />
                  Categories
                </h6>
                <div className="d-flex flex-column gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={category === cat.id ? 'primary' : 'outline-secondary'}
                      onClick={() => handleCategoryChange(cat.id === 'all' ? '' : cat.id)}
                      className="text-start"
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Price Range</h6>
                <div className="px-2">
                  <Form.Range
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="mb-2"
                  />
                  <div className="d-flex justify-content-between">
                    <span>₹{priceRange.min}</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h6 className="fw-bold mb-3">
                  <FaSort className="me-2" />
                  Sort By
                </h6>
                <Dropdown className="w-100">
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    {sortOptions.find(opt => opt.value === `${sortBy}-${sortOrder}`)?.label || 'Sort By'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {sortOptions.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        active={`${sortBy}-${sortOrder}` === option.value}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col lg={9}>
          {/* Results Info */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="mb-0">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
            <div>
              <Badge bg="primary" className="me-2">
                Page {currentPage} of {totalPages}
              </Badge>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <Row>
              {[...Array(8)].map((_, index) => (
                <Col md={6} lg={4} xl={3} key={index} className="mb-4">
                  <Skeleton height={300} />
                </Col>
              ))}
            </Row>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-3">😞</div>
              <h4>No products found</h4>
              <p className="text-muted mb-4">
                {searchQuery 
                  ? `No products found for "${searchQuery}"`
                  : 'Try adjusting your filters or search term'}
              </p>
              <Button variant="primary" onClick={() => {
                setSearchQuery('');
                setCategory('');
                setSearchParams({});
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <Row>
                {paginatedProducts.map((product) => (
                  <Col md={6} lg={4} xl={3} key={product.productId} className="mb-4">
                    <Card className="product-card h-100">
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                          alt={product.productName}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                          <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                            Low Stock
                          </Badge>
                        )}
                        {product.stockQuantity === 0 && (
                          <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold" style={{ fontSize: '1rem' }}>
                          {product.productName}
                        </Card.Title>
                        <Card.Text className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.9rem' }}>
                          {product.description?.substring(0, 80)}...
                        </Card.Text>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="fs-5 fw-bold text-primary">₹{product.price}</span>
                            {product.categoryName && (
                              <Badge bg="secondary" className="ms-2">
                                {product.categoryName}
                              </Badge>
                            )}
                          </div>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" />
                            <span>{product.rating || 0}</span>
                          </div>
                        </div>

                        <div className="d-flex gap-2 mt-auto">
                          <Button 
                            as={Link} 
                            to={`/products/${product.productId}`}
                            variant="outline-primary"
                            size="sm"
                            className="flex-grow-1"
                          >
                            <FaEye className="me-1" /> View
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="flex-grow-1"
                            onClick={() => handleAddToCart(product.productId)}
                            disabled={product.stockQuantity === 0}
                          >
                            <FaShoppingCart className="me-1" /> Cart
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                      disabled={currentPage === 1}
                    />
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Products;