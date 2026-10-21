import axios from 'axios';
import { clearSession, sessionToken } from '../auth/authStorage';
import { setWorkspaceLocked, trackWrite, workspaceLocked } from '../auth/workspaceLock';
import type { InternalAxiosRequestConfig } from 'axios';
import { workflowClientId, workflowLeaseToken, waitForWorkflow } from './workflowState';
type TrackedConfig = InternalAxiosRequestConfig & { workspaceWrite?: boolean };
const sessionControl = (url = '') => url.startsWith('/auth/session');
const finishWrite = (config?: TrackedConfig) => {
  if (config?.workspaceWrite) { config.workspaceWrite = false; trackWrite(-1); }
};

const defaultApiUrl = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || defaultApiUrl, timeout: 15000 });
let redirectingToLogin = false;
api.interceptors.request.use(async (config) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '') && /^\/(prescriptions|prescription-uploads|payment-requests|sales)(?:\/|$)/.test(config.url || '')) {
    if (!(await waitForWorkflow())) throw new axios.CanceledError('Editing access unavailable. Close this form and refresh.');
  }
  if (redirectingToLogin) throw new axios.CanceledError('Session ended; returning to login.');
  if (workspaceLocked() && !sessionControl(config.url) && !['/auth/login', '/auth/register'].includes(config.url || '')) {
    throw new axios.CanceledError('Workspace locked. Unlock to continue.');
  }
  const token = sessionToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['X-Workflow-Client'] = workflowClientId;
  const lease = workflowLeaseToken();
  if (lease && !config.url?.startsWith('/workflow-locks')) config.headers['X-Workflow-Lease'] = lease;
  if (token && !sessionControl(config.url) && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
    (config as TrackedConfig).workspaceWrite = true;
    trackWrite(1);
  }
  return config;
});
api.interceptors.response.use((response) => {
  finishWrite(response.config);
  window.dispatchEvent(new CustomEvent('mediflow:connectivity', { detail: true }));
  const method = response.config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && !sessionControl(response.config.url) && !response.config.url?.startsWith('/workflow-locks') && !response.config.url?.endsWith('/catalog/products/bulk')) {
    const message = response.data?.message || (method === 'DELETE' ? 'Record removed successfully.' : 'Changes saved successfully.');
    window.dispatchEvent(new CustomEvent('mediflow:success', { detail: message }));
    window.dispatchEvent(new Event('mediflow:attention-refresh'));
  }
  return response;
}, (error) => {
  finishWrite(error.config);
  if (error.response?.data?.details?.code === 'WORKFLOW_BUSY') window.dispatchEvent(new CustomEvent('mediflow:workflow-conflict', { detail: error.response.data.message }));
  if (error.response?.status === 423 && error.response.data?.details?.code === 'SESSION_LOCKED'
    && error.config?.headers?.Authorization === `Bearer ${sessionToken()}`) setWorkspaceLocked(true);
  if (!error.response && !axios.isCancel(error)) window.dispatchEvent(new CustomEvent('mediflow:connectivity', { detail: false }));
  if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
    const token = sessionToken();
    // A delayed response from an older login must not clear a newer session.
    if (!redirectingToLogin && token && error.config?.headers?.Authorization === `Bearer ${token}`) {
      redirectingToLogin = true;
      clearSession();
      window.location.replace('/login');
    }
  }
  return Promise.reject(error);
});

export const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message;
  return error instanceof Error ? error.message : 'Something went wrong.';
};
