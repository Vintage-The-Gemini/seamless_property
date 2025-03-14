import api from './api';

export const propertyService = {
  // Property CRUD
  getAllProperties: () => api.get('/properties'),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),

  // Floor operations
  getFloors: (propertyId) => api.get(`/properties/${propertyId}/floors`),
  addFloor: (propertyId, data) => api.post(`/properties/${propertyId}/floors`, data),
  updateFloor: (propertyId, floorId, data) => 
    api.put(`/properties/${propertyId}/floors/${floorId}`, data),

  // Unit operations
  getUnits: (propertyId, floorId) => 
    api.get(`/properties/${propertyId}/floors/${floorId}/units`),
  addUnit: (propertyId, floorId, data) => 
    api.post(`/properties/${propertyId}/floors/${floorId}/units`, data),
  updateUnit: (propertyId, floorId, unitId, data) => 
    api.put(`/properties/${propertyId}/floors/${floorId}/units/${unitId}`, data),

  // Property statistics
  getPropertyStats: (propertyId) => api.get(`/properties/${propertyId}/stats`),
  getVacancyRate: (propertyId) => api.get(`/properties/${propertyId}/vacancy-rate`),
  getRevenueStats: (propertyId) => api.get(`/properties/${propertyId}/revenue`),
};

export default propertyService;