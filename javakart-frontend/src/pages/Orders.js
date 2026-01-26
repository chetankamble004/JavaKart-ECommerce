// src/pages/Orders.js
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Table,
  Badge, Alert, Spinner, Dropdown, Form,
  Modal, Pagination, InputGroup // InputGroup added
} from 'react-bootstrap';
import {
  FaShoppingBag, FaEye, FaTimes, FaRedo,
  FaTruck, FaCheckCircle, FaExclamationTriangle,
  FaFilter, FaSortAmountDown, FaSearch, FaFileInvoice
} from 'react-icons/fa';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
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

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    setCancelling(true);
    try {
      await orderAPI.cancel(selectedOrder.orderId);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
      setSelectedOrder(null);
    }
  };

  const handleCancelClick = (order) => {
    if (order.orderStatus !== 'PENDING') {
      toast.warning('Only pending orders can be cancelled');
      return;
    }
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <FaExclamationTriangle className="text-warning" />;
      case 'PROCESSING': return <FaRedo className="text-info" />;
      case 'SHIPPED': return <FaTruck className="text-primary" />;
      case 'DELIVERED': return <FaCheckCircle className="text-success" />;
      case 'CANCELLED': return <FaTimes className="text-danger" />;
      default: return null;
    }
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

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="fw-bold mb-4">My Orders</h1>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold mb-2">{orders.length}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-success mb-2">
                {orders.filter(o => o.orderStatus === 'DELIVERED').length}
              </h3>
              <p className="text-muted mb-0">Delivered</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-warning mb-2">
                {orders.filter(o => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length}
              </h3>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-danger mb-2">
                {orders.filter(o => o.orderStatus === 'CANCELLED').length}
              </h3>
              <p className="text-muted mb-0">Cancelled</p>
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
                  placeholder="Search by order ID or address..."
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
                  <Dropdown.Item onClick={() => setStatusFilter('PENDING')}>
                    Pending
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter('PROCESSING')}>
                    Processing
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter('SHIPPED')}>
                    Shipped
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter('DELIVERED')}>
                    Delivered
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter('CANCELLED')}>
                    Cancelled
                  </Dropdown.Item>
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
                  <Dropdown.Item>Price: High to Low</Dropdown.Item>
                  <Dropdown.Item>Price: Low to High</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders List */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Order History</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredOrders.length > 0 ? (
            <>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Shipping Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="fw-medium">#{order.orderId}</td>
                      <td>
                        <small className="text-muted">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td>
                        <Badge bg={getStatusColor(order.orderStatus)} className="d-flex align-items-center" style={{ width: 'fit-content' }}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ms-1">{order.orderStatus}</span>
                        </Badge>
                      </td>
                      <td>
                        <small className="text-truncate d-block" style={{ maxWidth: '200px' }}>
                          {order.shippingAddress || 'No address provided'}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as="a"
                            href={`/orders/${order.orderId}`}
                          >
                            <FaEye />
                          </Button>
                          {order.orderStatus === 'PENDING' && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancelClick(order)}
                            >
                              <FaTimes />
                            </Button>
                          )}
                          {order.orderStatus === 'DELIVERED' && (
                            <Button
                              variant="outline-success"
                              size="sm"
                            >
                              <FaFileInvoice />
                            </Button>
                          )}
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
              <p className="text-muted mb-4">
                {searchTerm || statusFilter !== 'all' ? 'Try changing your filters' : 'You haven\'t placed any orders yet'}
              </p>
              <Button variant="primary" as="a" href="/products">
                Start Shopping
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Cancel Order Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order #{selectedOrder?.orderId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <FaExclamationTriangle className="me-2" />
            Are you sure you want to cancel this order?
          </Alert>
          <p>
            Order Details:
          </p>
          <ul className="text-muted">
            <li>Order ID: #{selectedOrder?.orderId}</li>
            <li>Amount: ₹{selectedOrder?.totalAmount?.toLocaleString('en-IN')}</li>
            <li>Date: {selectedOrder && new Date(selectedOrder.orderDate).toLocaleDateString()}</li>
          </ul>
          <p className="text-danger small">
            Note: Once cancelled, this action cannot be undone. Any payment made will be refunded within 5-7 business days.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Order
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Cancelling...
              </>
            ) : (
              'Cancel Order'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;