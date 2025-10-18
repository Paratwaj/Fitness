import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if backend URL differs
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized: clear auth and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Plans endpoints
export const plansAPI = {
  getAll: () => api.get('/plans'),
  create: (planData) => api.post('/plans', planData),
  update: (id, planData) => api.put(`/plans/${id}`, planData),
  delete: (id) => api.delete(`/plans/${id}`),
};

// Subscriptions endpoints
export const subscriptionsAPI = {
  getByUser: (userId) => api.get(`/subscriptions/${userId}`),
  create: (subscriptionData) => api.post('/subscriptions', subscriptionData),
  update: (id, updateData) => api.put(`/subscriptions/${id}`, updateData),
  getAll: () => api.get('/subscriptions'), // For admin
};

// Content endpoints (workout/diet)
export const contentAPI = {
  getWorkouts: () => api.get('/content/workout'),
  getDiets: () => api.get('/content/diet'),
  getFeed: () => api.get('/content/feed'),
  getRecommendations: () => api.get('/ai/for-you'),
  assign: (assignData) => api.post('/content/assign', assignData),
};

// Progress endpoints
export const progressAPI = {
  getByUser: (userId) => api.get(`/progress/${userId}`),
  create: (progressData) => api.post('/progress', progressData),
};

// Payments endpoints
export const paymentsAPI = {
  getByUser: (userId) => api.get(`/payments/${userId}`),
  create: (paymentData) => api.post('/payments', paymentData),
  getAll: () => api.get('/payments'), // For admin
};

// Users endpoints
export const usersAPI = {
  getMembersByTrainer: (trainerId) => api.get(`/users?trainerId=${trainerId}`),
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
