import api from './api';

const BASE = '/cart';

export const getCart = () => api.get(BASE);
export const addToCart = (productId, quantity = 1, packSize = '', name = '', imageUrl = '') =>
  api.post(`${BASE}/add`, { productId, quantity, packSize, name, imageUrl });
export const updateCartItem = (itemId, quantity) =>
  api.put(`${BASE}/${itemId}`, { quantity });
export const removeCartItem = (itemId) =>
  api.delete(`${BASE}/${itemId}`);
export const clearCart = () => api.delete(BASE);
export const mergeCart = (guestItems) =>
  api.post(`${BASE}/merge`, { guestItems });
