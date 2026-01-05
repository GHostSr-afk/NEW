import axios from 'axios';

// Use relative URL in production, localhost in development
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  }
};

export const clothesService = {
  upload: async (formData) => {
    const response = await api.post('/clothes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/clothes?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clothes/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/clothes/${id}`);
    return response.data;
  },

  updateLastWorn: async (id) => {
    const response = await api.patch(`/clothes/${id}/wear`);
    return response.data;
  }
};

export const outfitService = {
  suggest: async (season = 'Summer') => {
    const response = await api.get(`/outfit/suggest?season=${season}`);
    return response.data;
  },

  save: async (itemIds) => {
    const response = await api.post('/outfit/save', { item_ids: itemIds });
    return response.data;
  },

  getSaved: async () => {
    const response = await api.get('/outfit/saved');
    return response.data;
  }
};

export default api;
