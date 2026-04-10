import api from './api';

export const apiKeyAPI = {
  // Generate new API key (protected)
  generate: (data) => api.post('api/keys/register', data),
  
  // Get all API keys (public - adjust if needed)
  getAll: () => api.get('api/keys'),
  getStats: () => api.get('api/keys/apiKeystat')
};