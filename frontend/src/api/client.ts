import axios from 'axios';

const defaultApiUrl = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || defaultApiUrl, timeout: 15000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => {
  window.dispatchEvent(new CustomEvent('mediflow:connectivity', { detail: true }));
  const method = response.config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && !response.config.url?.endsWith('/catalog/products/bulk')) {
    const message = response.data?.message || (method === 'DELETE' ? 'Record removed successfully.' : 'Changes saved successfully.');
    window.dispatchEvent(new CustomEvent('mediflow:success', { detail: message }));
    window.dispatchEvent(new Event('mediflow:attention-refresh'));
  }
  return response;
}, (error) => {
  if (!error.response) window.dispatchEvent(new CustomEvent('mediflow:connectivity', { detail: false }));
  if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
    localStorage.removeItem('mediflow_token'); localStorage.removeItem('mediflow_user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message;
  return error instanceof Error ? error.message : 'Something went wrong.';
};
