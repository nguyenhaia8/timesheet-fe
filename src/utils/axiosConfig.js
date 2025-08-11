import axios from 'axios';

// Configure axios defaults for CORS credentials
axios.defaults.withCredentials = true;

// Create a configured axios instance
const apiClient = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://128.203.177.65:8080/api'
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('timetracker_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('timetracker_token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
