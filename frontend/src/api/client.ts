import axios from 'axios';
import { clearSession, sessionToken, sessionUser } from '../auth/authStorage';
import { operationAttempt, finishOperation, retryProtectedPath } from '../utils/operationAttempt';
import { pendingWrites, setWorkspaceLocked, trackWrite, workspaceLocked } from '../auth/workspaceLock';
import type { InternalAxiosRequestConfig } from 'axios';
import { workflowClientId, workflowLeaseToken, waitForWorkflow } from './workflowState';
type TrackedConfig = InternalAxiosRequestConfig & { workspaceWrite?: boolean; operationStorageKey?: string };
const sessionControl = (url = '') => url.startsWith('/auth/session');
const finishWrite = (config?: TrackedConfig) => {
  if (config?.workspaceWrite) { config.workspaceWrite = false; trackWrite(-1); }
};

const defaultApiUrl = '/api';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || defaultApiUrl, timeout: 30000 });
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
  const actor = sessionUser<{ id: number }>();
  if (token && actor && retryProtectedPath(config.method || '', config.url || '')) {
    const attempt = await operationAttempt(actor.id, config.url!, config.data);
    config.headers['Idempotency-Key'] = attempt.key;
    (config as TrackedConfig).operationStorageKey = attempt.storageKey;
  }
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
  finishOperation((response.config as TrackedConfig).operationStorageKey);
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
  if (error.response?.status === 423 && (error.response.data?.details?.code === 'SESSION_LOCKED'
    || /^Unlock your workspace to continue\.?$/i.test(error.response.data?.message || ''))
    && error.config?.headers?.Authorization === `Bearer ${sessionToken()}`) setWorkspaceLocked(true);
  if (!error.response && !axios.isCancel(error)) window.dispatchEvent(new CustomEvent('mediflow:connectivity', { detail: false }));
  if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
    const token = sessionToken();
    // A delayed response from an older login must not clear a newer session.
    if (!redirectingToLogin && token && error.config?.headers?.Authorization === `Bearer ${token}`) {
      redirectingToLogin = true;
      const finishSignOut = () => {
        if (pendingWrites() > 0) return;
        window.removeEventListener('mediflow:session-state', finishSignOut);
        if (sessionToken() !== token) { redirectingToLogin = false; return; }
        clearSession();
        window.location.replace('/login?reason=session-ended');
      };
      if (pendingWrites() > 0) window.addEventListener('mediflow:session-state', finishSignOut);
      else finishSignOut();
    }
  }
  return Promise.reject(error);
});

export const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message;
  return error instanceof Error ? error.message : 'Something went wrong.';
};
