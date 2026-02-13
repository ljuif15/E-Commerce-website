import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Product endpoints
export const productAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/products?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category, page = 1) => api.get(`/products/category/${category}?page=${page}`),
  search: (query, page = 1) => api.get(`/products/search/${query}?page=${page}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
};

// Cart endpoints
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (id, data) => api.put(`/cart/items/${id}`, data),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  clearCart: () => api.delete('/cart'),
};

// Wishlist endpoints
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addItem: (data) => api.post('/wishlist', data),
  removeItem: (id) => api.delete(`/wishlist/${id}`),
  check: (id) => api.get(`/wishlist/check/${id}`),
  clear: () => api.delete('/wishlist'),
};

// Order endpoints
export const orderAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/orders?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  cancel: (id) => api.delete(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  updatePayment: (id, data) => api.put(`/orders/${id}/payment`, data),
  getStats: () => api.get('/orders/stats/dashboard'),
};

export default api;
