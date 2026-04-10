import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // ✅ CRITICAL: Send cookies with requests
});

// Request interceptor - Use token from localStorage
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth on 401/403
      localStorage.removeItem('authToken');
      // Backend will clear cookie automatically
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('api/auth/register', data),
  login: (data) => api.post('api/auth/login', data),
  logout: () => api.post('api/auth/logout'),  // Backend should clear cookie
  getme:() => api.get('api/auth/me'),
  get_analytics:() => api.get('api/analytics/logs'),
  getProfile: () => api.get('api/auth/profile'),
  forgetPassword: (email) => api.post('api/auth/forget-password',{email}),
  updatePassword: (data) => api.post('api/auth/update-password',data),
  updateKeyStatus: (keyId, data) => api.put(`api/keys/apikey/${keyId}/status`, data),
};

export default api;