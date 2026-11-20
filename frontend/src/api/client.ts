// THE CONNECTION TO THE SERVER
// Every request from the website goes through `api` below. Before each request it:
//   - adds the sign-in pass, and a retry key for payments, sales and stock changes (stops double
// actions)
//   - gives slow actions (uploads, payments, dispensing) more time
//   - blocks changes while the screen is locked or while someone else is editing the same record
// After each reply it signs the user out if the session has ended, or shows the lock screen if it
// was locked.
// `errorMessage` turns any error into one plain sentence to show the user.

import axios from 'axios';
import { clearSession, sessionToken, sessionUser } from '../auth/authStorage';
import { operationAttempt, finishOperation, retryProtectedPath } from '../utils/operationAttempt';
import { pendingWrites, setWorkspaceLocked, trackWrite, workspaceLocked } from '../auth/workspaceLock';
import type { InternalAxiosRequestConfig } from 'axios';
import { workflowClientId, workflowLeaseToken, waitForWorkflow } from './workflowState';
type TrackedConfig = InternalAxiosRequestConfig & { workspaceWrite?: boolean; operationStorageKey?: string };
// True for the sign-in session addresses, which must still work while the screen is locked.
const sessionControl = (url = '') => url.startsWith('/auth/session');
// Marks a saving request as finished (used to warn before leaving a page mid-save).
const finishWrite = (config?: TrackedConfig) => {
  if (config?.workspaceWrite) { config.workspaceWrite = false; trackWrite(-1); }
};

const defaultApiUrl = '/api';
// The shared connection. Requests time out after 30 seconds unless given more time below.
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || defaultApiUrl, timeout: 30000 });
let redirectingToLogin = false;
api.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase() || '';
  const path = (config.url || '').split('?')[0];
  // Large file writes and cashier/dispensing transactions may need more than
  // the ordinary API window when the hosted MySQL connection is slow. Database
  // transactions remain separately bounded; this only prevents Axios from
  // abandoning a request before those limits are reached.
  if (['POST', 'PUT', 'PATCH'].includes(method)
    && /^\/(?:prescription-uploads(?:\/|$)|prescriptions(?:\/\d+\/(?:dispense|payment-request))?$|payment-requests\/\d+\/(?:pay|fulfill-retail|slip|delivery))/.test(path)) {
    config.timeout = Math.max(config.timeout || 0, 60_000);
  }
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && /^\/(prescriptions|prescription-uploads|payment-requests|sales)(?:\/|$)/.test(path)) {
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

// The message to show the user for any error (the server's own message when there is one).
export const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    const requestId = error.response?.data?.requestId;
    if (requestId && message.includes('contact the pharmacy with this request reference')) {
      return `${message} Reference: ${requestId}`;
    }
    return message;
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
};
