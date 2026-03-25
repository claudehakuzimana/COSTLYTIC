import axios from 'axios';

// Use same-origin proxy by default to avoid hardcoding backend ports.
// Vite dev config proxies `/api` to the backend.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
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

// Response interceptor — only redirect on 401 for protected routes.
// Login/register return 401/400 for bad credentials; redirecting here breaks error UI and causes confusing "login failed" loops.
function isAuthPublicRequest(config) {
  const url = (config?.url || '').toString();
  // With baseURL '/api', url is like '/auth/login'
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/oauth/status') ||
    url.includes('/auth/google')
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && error.config && !isAuthPublicRequest(error.config)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      try {
        sessionStorage.removeItem('auth-store');
      } catch (_) {}
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  getOAuthStatus: () => api.get('/auth/oauth/status')
};

// Usage endpoints
export const usageAPI = {
  getAIUsage: (params) => api.get('/usage/ai', { params }),
  getInfraUsage: (params) => api.get('/usage/infrastructure', { params }),
  getVectorUsage: (params) => api.get('/usage/vector', { params })
};

// Analytics endpoints
export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  getSpendByProvider: (params) => api.get('/analytics/spend-by-provider', { params }),
  getCostByTeam: (params) => api.get('/analytics/cost-by-team', { params }),
  getTokenTrends: (params) => api.get('/analytics/token-trends', { params }),
  getForecast: (params) => api.get('/analytics/forecast', { params }),
  // Back-compat aliases (some pages may still reference these)
  getCostTrends: (params) => api.get('/analytics/token-trends', { params }),
  getCostByProvider: (params) => api.get('/analytics/spend-by-provider', { params }),
  getTokenDistribution: (params) => api.get('/analytics/token-trends', { params }),
  predictMonthlySpend: (params) => api.get('/analytics/forecast', { params })
};

// Organization endpoints
export const organizationAPI = {
  getAll: () => api.get('/organizations'),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`)
};

// Integrations endpoints
export const integrationsAPI = {
  list: () => api.get('/integrations'),
  connect: (provider, data) => api.put(`/integrations/${provider}`, data),
  test: (provider) => api.post(`/integrations/${provider}/test`),
  disconnect: (provider) => api.delete(`/integrations/${provider}`)
};

// AI helper endpoints
export const aiAPI = {
  getImplementationKit: (data) => api.post('/ai/implementation-kit', data)
};

// Subscription endpoints
export const subscriptionAPI = {
  getInfo: () => api.get('/subscription/info'),
  getTiers: () => api.get('/subscription/tiers'),
  upgrade: (tier) => api.post('/subscription/upgrade', { tier }),
  cancel: () => api.post('/subscription/cancel')
};

export default api;
