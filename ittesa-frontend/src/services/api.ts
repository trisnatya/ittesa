import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

// Employees API
export const employeesApi = {
  getAll: (params?: { status?: string; search?: string }) =>
    api.get('/employees', { params }),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/employees/${id}/status`, { status }),
  export: () => api.get('/employees/export', { responseType: 'blob' }),
};

// Request Types API
export const requestTypesApi = {
  getAll: () => api.get('/request-types'),
  getById: (id: string) => api.get(`/request-types/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/request-types', data),
};

// Requests API
export const requestsApi = {
  getAll: (params?: { requestTypeId?: string; status?: string; userId?: string }) =>
    api.get('/requests', { params }),
  getById: (id: string) => api.get(`/requests/${id}`),
  create: (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/requests/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateStatus: (id: string, status: string) =>
    api.patch(`/requests/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/requests/${id}`),
};

// Templates API
export const templatesApi = {
  getAll: (params?: { requestTypeId?: string }) =>
    api.get('/templates', { params }),
  getById: (id: string) => api.get(`/templates/${id}`),
  create: (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/templates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/templates/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/templates/${id}`),
};

// Email Templates API
export const emailTemplatesApi = {
  getAll: () => api.get('/email-templates'),
  getById: (id: string) => api.get(`/email-templates/${id}`),
  create: (data: { name: string; subject: string; body: string }) =>
    api.post('/email-templates', data),
  update: (id: string, data: { name?: string; subject?: string; body?: string }) =>
    api.put(`/email-templates/${id}`, data),
  delete: (id: string) => api.delete(`/email-templates/${id}`),
  send: (id: string, data: { to: string; replacements?: Record<string, string> }) =>
    api.post(`/email-templates/${id}/send`, data),
};

// FAQs API
export const faqsApi = {
  getAll: (params?: { category?: string }) => api.get('/faqs', { params }),
  getById: (id: string) => api.get(`/faqs/${id}`),
  create: (data: { question: string; answer: string; category?: string; order?: number }) =>
    api.post('/faqs', data),
  update: (id: string, data: { question?: string; answer?: string; category?: string; order?: number }) =>
    api.put(`/faqs/${id}`, data),
  delete: (id: string) => api.delete(`/faqs/${id}`),
};

// Questions API
export const questionsApi = {
  getAll: (params?: { status?: string; userId?: string }) =>
    api.get('/questions', { params }),
  getById: (id: string) => api.get(`/questions/${id}`),
  create: (question: string) => api.post('/questions', { question }),
  answer: (id: string, answer: string) => api.put(`/questions/${id}/answer`, { answer }),
  delete: (id: string) => api.delete(`/questions/${id}`),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; fullName: string; roleId?: string }) =>
    api.post('/users', data),
  update: (id: string, data: { fullName?: string; password?: string; isActive?: boolean }) =>
    api.put(`/users/${id}`, data),
  updateRole: (id: string, roleId: string) =>
    api.patch(`/users/${id}/role`, { roleId }),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Roles API
export const rolesApi = {
  getAll: () => api.get('/roles'),
  getById: (id: string) => api.get(`/roles/${id}`),
  create: (data: { name: string; permissions?: Record<string, string[]> }) =>
    api.post('/roles', data),
  update: (id: string, data: { name?: string; permissions?: Record<string, string[]> }) =>
    api.put(`/roles/${id}`, data),
  delete: (id: string) => api.delete(`/roles/${id}`),
};

// User Logs API
export const userLogsApi = {
  getAll: (params?: { userId?: string; action?: string; module?: string; startDate?: string; endDate?: string }) =>
    api.get('/user-logs', { params }),
  export: () => api.get('/user-logs/export', { responseType: 'blob' }),
};