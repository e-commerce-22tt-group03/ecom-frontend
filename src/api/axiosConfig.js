import axios from 'axios';

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env)
  ? (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3000/api/v1'))
  : '/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // always send cookies (guest_session, etc.)
});

// Attach Authorization header if a JWT exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize error messages and preserve status
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      const err = new Error(message);
      err.status = error.response.status;
      return Promise.reject(err);
    }
    if (error.request) {
      const err = new Error('Network error - please check your connection');
      err.status = 0;
      return Promise.reject(err);
    }
    const err = new Error('Request failed');
    err.status = -1;
    return Promise.reject(err);
  }
);

export default api;