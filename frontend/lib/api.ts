import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized (e.g., redirect to login or refresh token)
    if (error.response && error.response.status === 401) {
       // Optional: Clear token if invalid
       // localStorage.removeItem('access_token');
       // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
