// src/pages/Admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Table, Spinner,
  Badge, Button, ProgressBar, Alert
} from 'react-bootstrap';
import {
  FaUsers, FaBox, FaShoppingCart, FaRupeeSign,
  FaChartLine, FaArrowUp, FaArrowDown, FaEye,
  FaCalendarAlt, FaExclamationTriangle
} from 'react-icons/fa';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { analyticsAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboardStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      </Container>
    );
  }

  // Chart data for sales
  const salesChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: 'Orders',
        data: [42, 48, 40, 65, 58, 72, 68],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 5,
      }
    ]
  };

  // Chart data for order status
  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [15, 25, 30, 120, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 1
      }
    ]
  };

  // Recent orders data
  const recentOrders = [
    { id: '#ORD-1001', customer: 'John Doe', amount: '₹2,499', status: 'Delivered', date: '2024-01-25' },
    { id: '#ORD-1002', customer: 'Jane Smith', amount: '₹1,899', status: 'Processing', date: '2024-01-25' },
    { id: '#ORD-1003', customer: 'Bob Johnson', amount: '₹4,299', status: 'Shipped', date: '2024-01-24' },
    { id: '#ORD-1004', customer: 'Alice Brown', amount: '₹899', status: 'Pending', date: '2024-01-24' },
    { id: '#ORD-1005', customer: 'Charlie Wilson', amount: '₹6,499', status: 'Delivered', date: '2024-01-23' },
  ];

  // Low stock products
  const lowStockProducts = [
    { name: 'iPhone 13 Pro', stock: 3, threshold: 10 },
    { name: 'Samsung TV 55"', stock: 5, threshold: 10 },
    { name: 'Nike Air Max', stock: 2, threshold: 10 },
    { name: 'MacBook Pro', stock: 4, threshold: 10 },
    { name: 'Sony Headphones', stock: 1, threshold: 10 },
  ];

  return (
    <Container fluid className="p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard Overview</h2>
          <p className="text-muted mb-0">
            <FaCalendarAlt className="me-2" />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button variant="primary" size="sm">
          <FaChartLine className="me-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Users</h6>
                  <h3 className="fw-bold mb-0">{stats?.totalUsers || 0}</h3>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    12% from last month
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FaUsers size={24} className="text-primary" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Products</h6>
                  <h3 className="fw-bold mb-0">{stats?.totalProducts || 0}</h3>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    8% from last month
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <FaBox size={24} className="text-success" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Orders</h6>
                  <h3 className="fw-bold mb-0">{stats?.totalOrders || 0}</h3>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    15% from last month
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <FaShoppingCart size={24} className="text-warning" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Revenue</h6>
                  <h3 className="fw-bold mb-0">
                    ₹{stats?.totalRevenue?.toLocaleString('en-IN') || '0'}
                  </h3>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    20% from last month
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <FaRupeeSign size={24} className="text-info" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Sales Overview</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line 
                  data={salesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Status</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Button variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td className="fw-medium">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="fw-bold">{order.amount}</td>
                      <td>
                        <Badge 
                          bg={
                            order.status === 'Delivered' ? 'success' :
                            order.status === 'Processing' ? 'warning' :
                            order.status === 'Shipped' ? 'info' :
                            order.status === 'Pending' ? 'secondary' : 'danger'
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <Button variant="outline-primary" size="sm">
                          <FaEye />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Low Stock Products</h5>
              <Badge bg="warning" pill>
                {lowStockProducts.length} items
              </Badge>
            </Card.Header>
            <Card.Body>
              {lowStockProducts.map((product, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-medium">{product.name}</span>
                    <span className={`small ${
                      product.stock <= 2 ? 'text-danger fw-bold' : 'text-warning'
                    }`}>
                      {product.stock} left
                    </span>
                  </div>
                  <ProgressBar 
                    now={(product.stock / product.threshold) * 100}
                    variant={
                      product.stock <= 2 ? 'danger' :
                      product.stock <= 5 ? 'warning' : 'info'
                    }
                    style={{ height: '6px' }}
                  />
                </div>
              ))}
              <div className="mt-4">
                <Button variant="outline-warning" size="sm" className="w-100">
                  View All Low Stock
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="text-muted mb-3">Pending Orders</h6>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="fw-bold mb-0">{stats?.pendingOrders || 0}</h3>
                <Badge bg="secondary">Need Action</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="text-muted mb-3">Delivered Orders</h6>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="fw-bold mb-0">{stats?.deliveredOrders || 0}</h3>
                <Badge bg="success">Completed</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="text-muted mb-3">Low Stock Products</h6>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="fw-bold mb-0">{stats?.lowStockProducts || 0}</h3>
                <Badge bg="warning">Need Restock</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;