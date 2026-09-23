import api from './api';

// --- Orders ---
export const getAllOrders = () => {
  return api.get('/orders');
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const updateOrderStatus = (id, orderStatus) => {
  return api.put(`/orders/${id}/status`, { orderStatus });
};

// --- Brands ---
export const getBrands = () => api.get('/brands');
export const createBrand = (data) => api.post('/brands', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBrand = (id, data) => api.put(`/brands/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteBrand = (id) => api.delete(`/brands/${id}`);
export const getProductsByBrand = (name) => api.get(`/brands/${name}/products`);

// --- Settings ---
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// --- Notifications ---
export const getNotifications = () => api.get('/notifications');
export const getUnreadNotificationCount = () => api.get('/notifications/unread-count');
export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// --- Contact Messages ---
export const getContactMessages = () => api.get('/contact');
export const updateMessageStatus = (id, status) => api.put(`/contact/${id}/status`, { status });
export const replyToMessage = (id, reply) => api.put(`/contact/${id}/reply`, { reply });
export const deleteMessage = (id) => api.delete(`/contact/${id}`);

// --- Users ---
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);

// --- Products (admin operations) ---
export const getProductById = (id) => api.get(`/products/${id}`);
export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

