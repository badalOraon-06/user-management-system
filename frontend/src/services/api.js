import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'https://user-management-system-iip6.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log errors
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout')
};

// User endpoints
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/change-password', data),
  getAllUsers: (page = 1, limit = 10) => API.get(`/users?page=${page}&limit=${limit}`),
  activateUser: (id) => API.patch(`/users/${id}/activate`),
  deactivateUser: (id) => API.patch(`/users/${id}/deactivate`)
};

export default API;