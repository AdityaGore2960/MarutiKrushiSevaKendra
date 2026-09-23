import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
// User routes (/users, /cart) get user_token; admin routes get admin_token
api.interceptors.request.use((config) => {
  const url = config.url || '';
  const isAdminPanel = window.location.pathname.startsWith('/admin');
  
  if (isAdminPanel) {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken && adminToken !== 'undefined') config.headers.Authorization = `Bearer ${adminToken}`;
  } else {
    // Normal user routes
    if (url.startsWith('/users') || url.startsWith('/cart') || url.startsWith('/payment')) {
      const userToken = localStorage.getItem('user_token');
      if (userToken && userToken !== 'undefined') config.headers.Authorization = `Bearer ${userToken}`;
    }
  }
  return config;
});

// Handle 401 responses - clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    if (status === 401 || status === 403) {
      if (url.startsWith('/users') || url.startsWith('/cart')) {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        if (window.location.pathname === '/profile' || window.location.pathname === '/orders') {
          window.location.href = '/';
        }
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
