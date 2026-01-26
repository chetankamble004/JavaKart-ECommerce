// src/components/TestConnection.jsx
import React, { useState } from 'react';
import { Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaServer, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { testBackend, testHealth } from '../services/api';

const TestConnection = () => {
  const [backendStatus, setBackendStatus] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState({ backend: false, health: false });

  const testBackendConnection = async () => {
    setLoading({ ...loading, backend: true });
    try {
      const response = await testBackend();
      setBackendStatus({
        success: true,
        data: response.data
      });
    } catch (error) {
      setBackendStatus({
        success: false,
        error: error.message
      });
    }
    setLoading({ ...loading, backend: false });
  };

  const testHealthCheck = async () => {
    setLoading({ ...loading, health: true });
    try {
      const response = await testHealth();
      setHealthStatus({
        success: true,
        data: response.data
      });
    } catch (error) {
      setHealthStatus({
        success: false,
        error: error.message
      });
    }
    setLoading({ ...loading, health: false });
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white d-flex align-items-center">
        <FaServer className="me-2" />
        <h5 className="mb-0">Backend Connection Test</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h6>API URL: {process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}</h6>
          <p className="text-muted small">Test if frontend can connect to backend</p>
        </div>

        <div className="d-flex gap-3 mb-4">
          <Button
            variant="outline-primary"
            onClick={testBackendConnection}
            disabled={loading.backend}
            className="d-flex align-items-center"
          >
            {loading.backend ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Testing...
              </>
            ) : (
              'Test Backend'
            )}
          </Button>
          <Button
            variant="outline-success"
            onClick={testHealthCheck}
            disabled={loading.health}
            className="d-flex align-items-center"
          >
            {loading.health ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Testing...
              </>
            ) : (
              'Test Health'
            )}
          </Button>
        </div>

        {backendStatus && (
          <Alert variant={backendStatus.success ? 'success' : 'danger'} className="d-flex align-items-center">
            {backendStatus.success ? (
              <FaCheckCircle className="me-2 fs-4" />
            ) : (
              <FaExclamationCircle className="me-2 fs-4" />
            )}
            <div className="flex-grow-1">
              <strong>Backend Test:</strong> {backendStatus.success ? 'Connected Successfully' : 'Connection Failed'}
              {backendStatus.success && backendStatus.data && (
                <div className="small mt-1">
                  <div className="bg-dark text-light p-2 rounded">
                    <pre className="mb-0">{JSON.stringify(backendStatus.data, null, 2)}</pre>
                  </div>
                </div>
              )}
              {!backendStatus.success && (
                <div className="small mt-1">Error: {backendStatus.error}</div>
              )}
            </div>
          </Alert>
        )}

        {healthStatus && (
          <Alert variant={healthStatus.success ? 'success' : 'warning'} className="d-flex align-items-center">
            {healthStatus.success ? (
              <FaCheckCircle className="me-2 fs-4" />
            ) : (
              <FaExclamationCircle className="me-2 fs-4" />
            )}
            <div className="flex-grow-1">
              <strong>Health Check:</strong> {healthStatus.success ? 'Backend is Healthy' : 'Health Check Failed'}
              {healthStatus.success && healthStatus.data && (
                <div className="small mt-1">
                  <div className="bg-dark text-light p-2 rounded">
                    <pre className="mb-0">{JSON.stringify(healthStatus.data, null, 2)}</pre>
                  </div>
                </div>
              )}
              {!healthStatus.success && (
                <div className="small mt-1">Error: {healthStatus.error}</div>
              )}
            </div>
          </Alert>
        )}

        {!backendStatus && !healthStatus && (
          <Alert variant="info">
            Click buttons above to test backend connection. Make sure backend is running on port 8080.
          </Alert>
        )}

        <div className="mt-4 p-3 bg-light rounded">
          <h6>Troubleshooting Tips:</h6>
          <ul className="small mb-0">
            <li>Ensure backend server is running: <code>java -jar target/javakart-backend-0.0.1-SNAPSHOT.jar</code></li>
            <li>Check if MySQL database is running on port 3306</li>
            <li>Verify CORS is configured in backend</li>
            <li>Check browser console for detailed errors (F12)</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TestConnection;