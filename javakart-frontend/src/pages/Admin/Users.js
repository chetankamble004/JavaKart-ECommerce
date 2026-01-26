// src/pages/Admin/Users.js
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button,
  Form, Modal, Alert, Spinner, Badge,
  InputGroup, Pagination, Dropdown
} from 'react-bootstrap';
import {
  FaUsers, FaSearch, FaEdit, FaTrash, FaBan,
  FaCheckCircle, FaUserShield, FaUser, FaEye,
  FaFilter, FaSortAmountDown
} from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleBlockUser = async (userId, block = true) => {
    try {
      if (block) {
        await adminAPI.blockUser(userId);
        toast.success('User blocked successfully');
      } else {
        await adminAPI.unblockUser(userId);
        toast.success('User unblocked successfully');
      }
      fetchUsers();
      setShowBlockModal(false);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error(error.response?.data?.message || 'Failed to block user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await adminAPI.deleteUser(selectedUser.userId);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBlockClick = (user) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading users...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">User Management</h2>
          <p className="text-muted mb-0">
            Manage registered users and their permissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold mb-2">{users.length}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-success mb-2">
                {users.filter(u => u.isActive !== false).length}
              </h3>
              <p className="text-muted mb-0">Active Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-danger mb-2">
                {users.filter(u => u.isActive === false).length}
              </h3>
              <p className="text-muted mb-0">Blocked Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="fw-bold text-primary mb-2">
                {users.filter(u => u.role === 'ADMIN').length}
              </h3>
              <p className="text-muted mb-0">Admin Users</p>
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
                  placeholder="Search users by name, email, or mobile..."
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
                    <Dropdown.Item>All Users</Dropdown.Item>
                    <Dropdown.Item>Active Users</Dropdown.Item>
                    <Dropdown.Item>Blocked Users</Dropdown.Item>
                    <Dropdown.Item>Admin Users</Dropdown.Item>
                    <Dropdown.Item>Regular Users</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    <FaSortAmountDown className="me-2" />
                    Sort
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Newest First</Dropdown.Item>
                    <Dropdown.Item>Oldest First</Dropdown.Item>
                    <Dropdown.Item>A-Z by Name</Dropdown.Item>
                    <Dropdown.Item>Role</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Users List</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredUsers.length > 0 ? (
            <>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th width="150">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>
                        <div>
                          <strong className="d-block">{user.fullName || user.username}</strong>
                          <small className="text-muted">@{user.username}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="small">{user.email}</div>
                          {user.mobile && (
                            <div className="small text-muted">{user.mobile}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge 
                          bg={user.role === 'ADMIN' ? 'primary' : 'secondary'}
                          className="d-flex align-items-center"
                          style={{ width: 'fit-content' }}
                        >
                          {user.role === 'ADMIN' ? (
                            <FaUserShield className="me-1" />
                          ) : (
                            <FaUser className="me-1" />
                          )}
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          bg={user.isActive === false ? 'danger' : 'success'}
                          className="d-flex align-items-center"
                          style={{ width: 'fit-content' }}
                        >
                          {user.isActive === false ? (
                            <FaBan className="me-1" />
                          ) : (
                            <FaCheckCircle className="me-1" />
                          )}
                          {user.isActive === false ? 'Blocked' : 'Active'}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {user.isActive === false ? (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleBlockUser(user.userId, false)}
                              title="Unblock User"
                            >
                              <FaCheckCircle />
                            </Button>
                          ) : (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleBlockClick(user)}
                              title="Block User"
                            >
                              <FaBan />
                            </Button>
                          )}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            title="Delete User"
                          >
                            <FaTrash />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as="a"
                            href={`/profile/${user.userId}`}
                            target="_blank"
                            title="View Profile"
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
              <FaUsers size={48} className="text-muted mb-3" />
              <h5>No users found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try changing your search term' : 'No users registered yet'}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Block/Unblock Modal */}
      <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser?.isActive !== false ? 'Block User' : 'Unblock User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser?.isActive !== false ? (
            <>
              <Alert variant="warning">
                <FaBan className="me-2" />
                Are you sure you want to block this user?
              </Alert>
              <p>
                User <strong>{selectedUser?.fullName || selectedUser?.username}</strong> will:
              </p>
              <ul className="text-muted">
                <li>Not be able to login</li>
                <li>Not be able to place orders</li>
                <li>Not be able to access their account</li>
              </ul>
            </>
          ) : (
            <>
              <Alert variant="success">
                <FaCheckCircle className="me-2" />
                Are you sure you want to unblock this user?
              </Alert>
              <p>
                User <strong>{selectedUser?.fullName || selectedUser?.username}</strong> will regain full access to their account.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={selectedUser?.isActive !== false ? 'warning' : 'success'}
            onClick={() => handleBlockUser(selectedUser?.userId, selectedUser?.isActive !== false)}
          >
            {selectedUser?.isActive !== false ? 'Block User' : 'Unblock User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <FaTrash className="me-2" />
            This action is permanent and cannot be undone!
          </Alert>
          <p>
            Are you sure you want to delete user <strong>{selectedUser?.fullName || selectedUser?.username}</strong>?
          </p>
          <p className="text-muted small">
            All user data including orders, reviews, and personal information will be permanently deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsers;