import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// NO interceptors for now - simplest version
export const testBackend = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/test`);
    return response.data;
  } catch (error) {
    console.error('Backend connection failed:', error.message);
    throw error;
  }
};

export const testHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/test/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw error;
  }
};

export default api;