import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


// Request interceptor
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  



// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

// Auth services
// Add register function to authService
export const authService = {
    login: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    },
    register: async (userData) => {
      const response = await api.post('/auth/register', userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    },
    logout: () => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };


// Property service methods
export const propertyService = {
    getAllProperties: async () => {
      try {
        const response = await api.get('/properties');
        console.log('Properties response:', response);
        return response;
      } catch (error) {
        console.error('Get properties error:', error);
        throw error;
      }
    },
    
    createProperty: (data) => api.post('/properties', data),
    getPropertyById: (id) => api.get(`/properties/${id}`),
    updateProperty: (id, data) => api.put(`/properties/${id}`, data),
    deleteProperty: (id) => api.delete(`/properties/${id}`)
  };
  
export default api;