import api from './api';

export const apiKeyAPI = {
  // Generate new API key (protected)
  generate: (data) => api.post('/keys/register', data),
  
  // Get all API keys (public - adjust if needed)
  getAll: () => api.get('/keys')
};