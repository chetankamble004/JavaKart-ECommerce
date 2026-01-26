// src/pages/Admin/Products.js
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Table,
  Form, Modal, Alert, Spinner, Badge,
  InputGroup, Dropdown, Pagination, Image
} from 'react-bootstrap';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaEye,
  FaFilter, FaSortAmountDown, FaSortAmountUp,
  FaBox, FaExclamationTriangle, FaUpload
} from 'react-icons/fa';
import { productAPI, adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  
  // Form state
  const [productForm, setProductForm] = useState({
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!productForm.productName.trim()) {
      errors.productName = 'Product name is required';
    }
    
    if (!productForm.price) {
      errors.price = 'Price is required';
    } else if (isNaN(productForm.price) || parseFloat(productForm.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!productForm.stockQuantity) {
      errors.stockQuantity = 'Stock quantity is required';
    } else if (isNaN(productForm.stockQuantity) || parseInt(productForm.stockQuantity) < 0) {
      errors.stockQuantity = 'Stock quantity must be a non-negative number';
    }
    
    if (!productForm.categoryName.trim()) {
      errors.categoryName = 'Category is required';
    }
    
    return errors;
  };

  const handleAddProduct = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity),
        rating: 0
      };

      await adminAPI.createProduct(productData);
      toast.success('Product added successfully');
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity)
      };

      await adminAPI.updateProduct(selectedProduct.productId, productData);
      toast.success('Product updated successfully');
      setShowEditModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await adminAPI.deleteProduct(selectedProduct.productId);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setProductForm({
      productName: '',
      description: '',
      price: '',
      stockQuantity: '',
      imageUrl: '',
      categoryName: ''
    });
    setFormErrors({});
    setSelectedProduct(null);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setProductForm({
      productName: product.productName,
      description: product.description || '',
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      imageUrl: product.imageUrl || '',
      categoryName: product.categoryName || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
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
    <Container fluid className="p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Product Management</h2>
          <p className="text-muted mb-0">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold mb-2">{products.length}</h3>
              <p className="text-muted mb-0">Total Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-success mb-2">
                {products.filter(p => p.stockQuantity > 10).length}
              </h3>
              <p className="text-muted mb-0">In Stock</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-warning mb-2">
                {products.filter(p => p.stockQuantity <= 10 && p.stockQuantity > 0).length}
              </h3>
              <p className="text-muted mb-0">Low Stock</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-danger mb-2">
                {products.filter(p => p.stockQuantity === 0).length}
              </h3>
              <p className="text-muted mb-0">Out of Stock</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <div className="d-flex gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    <FaFilter className="me-2" />
                    Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>All Products</Dropdown.Item>
                    <Dropdown.Item>In Stock</Dropdown.Item>
                    <Dropdown.Item>Low Stock</Dropdown.Item>
                    <Dropdown.Item>Out of Stock</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    <FaSortAmountDown className="me-2" />
                    Sort
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Newest First</Dropdown.Item>
                    <Dropdown.Item>Price: Low to High</Dropdown.Item>
                    <Dropdown.Item>Price: High to Low</Dropdown.Item>
                    <Dropdown.Item>Stock: Low to High</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Products List</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredProducts.length > 0 ? (
            <>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th width="60">Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th width="120">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>
                        <Image
                          src={product.imageUrl || 'https://via.placeholder.com/40x40'}
                          alt={product.productName}
                          width={40}
                          height={40}
                          className="rounded border"
                          style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div>
                          <strong className="d-block">{product.productName}</strong>
                          <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                            {product.description || 'No description'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info">{product.categoryName || 'Uncategorized'}</Badge>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td>
                        <div>
                          <span className={`
                            fw-bold
                            ${product.stockQuantity === 0 ? 'text-danger' : ''}
                            ${product.stockQuantity > 0 && product.stockQuantity <= 10 ? 'text-warning' : ''}
                          `}>
                            {product.stockQuantity}
                          </span>
                          {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
                            <small className="ms-2 text-warning">
                              (Low)
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="text-warning me-1">★</span>
                          <span>{product.rating?.toFixed(1) || 0}</span>
                        </div>
                      </td>
                      <td>
                        <Badge 
                          bg={
                            product.stockQuantity === 0 ? 'danger' :
                            product.stockQuantity <= 10 ? 'warning' : 'success'
                          }
                        >
                          {product.stockQuantity === 0 ? 'Out of Stock' :
                           product.stockQuantity <= 10 ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <FaTrash />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            as="a"
                            href={`/products/${product.productId}`}
                            target="_blank"
                          >
                            <FaEye />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center p-3">
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
            <div className="text-center py-5">
              <FaBox size={48} className="text-muted mb-3" />
              <h5>No products found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try changing your search term' : 'Add your first product to get started'}
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus className="me-2" />
                Add Product
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => { setShowAddModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="productName"
                    value={productForm.productName}
                    onChange={handleFormChange}
                    placeholder="Enter product name"
                    isInvalid={!!formErrors.productName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.productName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    name="categoryName"
                    value={productForm.categoryName}
                    onChange={handleFormChange}
                    placeholder="e.g., Electronics, Fashion"
                    isInvalid={!!formErrors.categoryName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.categoryName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={productForm.description}
                onChange={handleFormChange}
                placeholder="Enter product description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={productForm.price}
                    onChange={handleFormChange}
                    placeholder="Enter price"
                    isInvalid={!!formErrors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="stockQuantity"
                    value={productForm.stockQuantity}
                    onChange={handleFormChange}
                    placeholder="Enter stock quantity"
                    isInvalid={!!formErrors.stockQuantity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.stockQuantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={productForm.imageUrl}
                  onChange={handleFormChange}
                  placeholder="Enter image URL"
                />
                <Button variant="outline-secondary">
                  <FaUpload />
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Enter a direct image URL or upload an image
              </Form.Text>
            </Form.Group>

            {productForm.imageUrl && (
              <div className="mb-3 text-center">
                <Image
                  src={productForm.imageUrl}
                  alt="Preview"
                  style={{ maxHeight: '200px', maxWidth: '100%' }}
                  className="border rounded"
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddProduct} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              'Add Product'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="productName"
                    value={productForm.productName}
                    onChange={handleFormChange}
                    isInvalid={!!formErrors.productName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.productName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    name="categoryName"
                    value={productForm.categoryName}
                    onChange={handleFormChange}
                    isInvalid={!!formErrors.categoryName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.categoryName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={productForm.description}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={productForm.price}
                    onChange={handleFormChange}
                    isInvalid={!!formErrors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="stockQuantity"
                    value={productForm.stockQuantity}
                    onChange={handleFormChange}
                    isInvalid={!!formErrors.stockQuantity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.stockQuantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={productForm.imageUrl}
                  onChange={handleFormChange}
                />
                <Button variant="outline-secondary">
                  <FaUpload />
                </Button>
              </InputGroup>
            </Form.Group>

            {productForm.imageUrl && (
              <div className="mb-3 text-center">
                <Image
                  src={productForm.imageUrl}
                  alt="Preview"
                  style={{ maxHeight: '200px', maxWidth: '100%' }}
                  className="border rounded"
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditProduct} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Product'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <FaExclamationTriangle className="me-2" />
            This action cannot be undone!
          </Alert>
          <p>
            Are you sure you want to delete <strong>{selectedProduct?.productName}</strong>?
          </p>
          <p className="text-muted small">
            This product will be permanently removed from the system.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProducts;