// src/pages/Admin/Orders.js
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button,
  Badge, Alert, Spinner, Dropdown, Form,
  Modal, Pagination, InputGroup
} from 'react-bootstrap';
import {
  FaShoppingBag, FaEye, FaEdit, FaTrash,
  FaTruck, FaCheckCircle, FaExclamationTriangle,
  FaFilter, FaSortAmountDown, FaSearch, FaCalendar,
  FaUser, FaRupeeSign, FaMapMarkerAlt
} from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders();
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(searchTerm) ||
        order.userId.toString().includes(searchTerm) ||
        order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(selectedOrder.orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      setShowUpdateModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
      setSelectedOrder(null);
      setNewStatus('');
    }
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setShowUpdateModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'info';
      case 'SHIPPED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <FaExclamationTriangle className="me-1" />;
      case 'PROCESSING': return <FaEdit className="me-1" />;
      case 'SHIPPED': return <FaTruck className="me-1" />;
      case 'DELIVERED': return <FaCheckCircle className="me-1" />;
      case 'CANCELLED': return <FaTrash className="me-1" />;
      default: return null;
    }
  };

  const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading orders...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Order Management</h2>
          <p className="text-muted mb-0">
            Manage and track all customer orders
          </p>
        </div>
        <Button variant="primary" size="sm">
          <FaCalendar className="me-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold mb-2">{orders.length}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-success mb-2">
                {orders.filter(o => o.orderStatus === 'DELIVERED').length}
              </h3>
              <p className="text-muted mb-0">Delivered</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-warning mb-2">
                {orders.filter(o => o.orderStatus === 'PENDING').length}
              </h3>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-info mb-2">
                {orders.filter(o => o.orderStatus === 'PROCESSING' || o.orderStatus === 'SHIPPED').length}
              </h3>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by order ID, user ID, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  <FaFilter className="me-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setStatusFilter('all')}>
                    All Orders
                  </Dropdown.Item>
                  {statusOptions.map((status) => (
                    <Dropdown.Item key={status} onClick={() => setStatusFilter(status)}>
                      {status}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  <FaSortAmountDown className="me-2" />
                  Sort
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Newest First</Dropdown.Item>
                  <Dropdown.Item>Oldest First</Dropdown.Item>
                  <Dropdown.Item>Amount: High to Low</Dropdown.Item>
                  <Dropdown.Item>Amount: Low to High</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Orders</h5>
          <Badge bg="primary" pill>
            {filteredOrders.length} orders
          </Badge>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredOrders.length > 0 ? (
            <>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Shipping</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="fw-medium">#{order.orderId}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle p-2 me-2">
                            <FaUser />
                          </div>
                          <div>
                            <div className="small fw-medium">User #{order.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaRupeeSign className="text-success me-1" />
                          <span className="fw-bold text-success">
                            {order.totalAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusColor(order.orderStatus)} className="d-flex align-items-center" style={{ width: 'fit-content' }}>
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaMapMarkerAlt className="text-muted me-1" />
                          <small className="text-truncate" style={{ maxWidth: '150px' }}>
                            {order.shippingAddress || 'No address'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleUpdateClick(order)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            as="a"
                            href={`/orders/${order.orderId}`}
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
              <FaShoppingBag size={48} className="text-muted mb-3" />
              <h5>No orders found</h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' ? 'Try changing your filters' : 'No orders placed yet'}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Update status for Order <strong>#{selectedOrder?.orderId}</strong>
          </p>
          <div className="mb-3">
            <Form.Label>Current Status:</Form.Label>
            <div>
              <Badge bg={getStatusColor(selectedOrder?.orderStatus)}>
                {selectedOrder?.orderStatus}
              </Badge>
            </div>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>New Status:</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Alert variant="info">
            <FaExclamationTriangle className="me-2" />
            Updating order status will notify the customer via email.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateStatus}
            disabled={updating || !newStatus || newStatus === selectedOrder?.orderStatus}
          >
            {updating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;