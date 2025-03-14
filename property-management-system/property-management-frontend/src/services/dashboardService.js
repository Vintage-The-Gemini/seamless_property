// src/services/dashboardService.js
import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueData: () => api.get('/dashboard/revenue'),
  getActivities: () => api.get('/dashboard/activities'),
  getAlerts: () => api.get('/dashboard/alerts'),
};

export default dashboardService;