import api from './api';

// ─── Admin Auth ───────────────────────────────────────────
export const login = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');

// ─── User Auth ────────────────────────────────────────────
export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const sendOtp = (data) => api.post('/users/send-otp', data);
export const verifyOtp = (data) => api.post('/users/verify-otp', data);
export const getUserMe = (token) =>
  api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (data, token) =>
  api.put('/users/profile', data, { headers: { Authorization: `Bearer ${token}` } });
export const addAddress = (data, token) =>
  api.post('/users/address', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateAddress = (id, data, token) =>
  api.put(`/users/address/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const removeAddress = (id, token) =>
  api.delete(`/users/address/${id}`, { headers: { Authorization: `Bearer ${token}` } });
