import { useCallback, useEffect, useRef, useState, type ReactNode, type FormEvent } from 'react';
import { api, errorMessage } from '../api/client';
import { useAuth } from './useAuth';
import { pendingWrites, setWorkspaceLocked, workspaceLocked, workspaceLockVersion } from './workspaceLock';
import { sessionToken, sessionUser } from './authStorage';
import type { User } from './AuthSession';
import { Modal } from '../components/Modal';
import { PasswordField } from '../components/PasswordField';
import './sessionLock.css';

type SessionView = { serverNow: number; warningAt: number; lockAt: number; expiresAt: number; locked: boolean; idleMinutes: number };

export function SessionGuard({ children }: { children: ReactNode }) {
  const { user, acceptSession, logout } = useAuth();
  const [view, setView] = useState<SessionView | null>(null);
  const [checking, setChecking] = useState(true);
  const [locked, setLocked] = useState(workspaceLocked);
  const [now, setNow] = useState(Date.now());
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [writes, setWrites] = useState(pendingWrites);
  const [renew, setRenew] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const offset = useRef(0);
  const current = useRef<SessionView | null>(null);
  const syncing = useRef(false);
  const activityPending = useRef(false);
  const lastSent = useRef(0);
  const mounted = useRef(true);
  const paused = useRef(true);
  paused.current = checking || renew;
  const apply = useCallback((next: SessionView) => {
    offset.current = next.serverNow - Date.now();
    current.current = next; setView(next); setNow(next.serverNow);
    setWorkspaceLocked(next.locked); setChecking(false); setError('');
  }, []);
  const sync = useCallback(async () => {
    if (syncing.current) return;
    syncing.current = true;
    const token = sessionToken();
    const version = workspaceLockVersion();
    try {
      const response = await api.get('/auth/session');
      if (mounted.current && token === sessionToken() && version === workspaceLockVersion()) apply(response.data.session);
    } catch (e) { if (mounted.current) setError(errorMessage(e)); }
    finally { syncing.current = false; }
  }, [apply]);
  const activity = useCallback(async () => {
    if (workspaceLocked() || !current.current || current.current.locked) return;
    activityPending.current = false; lastSent.current = Date.now();
    const token = sessionToken();
    const version = workspaceLockVersion();
    try {
      const response = await api.post('/auth/session/activity');
      if (mounted.current && token === sessionToken() && version === workspaceLockVersion()) apply(response.data.session);
    } catch (e) { if (mounted.current) setError(errorMessage(e)); }
  }, [apply]);
  useEffect(() => {
    mounted.current = true;
    void sync();
    const state = () => { setLocked(workspaceLocked()); setWrites(pendingWrites()); };
    const refresh = () => { setChecking(true); void sync(); };
    const interact = (event: Event) => {
      if (!event.isTrusted || document.hidden || workspaceLocked() || paused.current) return;
      activityPending.current = true;
      if (Date.now() - lastSent.current >= 30_000) void activity();
    };
    const visibility = () => {
      // Hide cached clinical screens until the server checks the session again.
      setChecking(true);
      if (!document.hidden) void sync();
    };
    const storage = (event: StorageEvent) => {
      if (event.key && !['mediflow_token', 'mediflow_user'].includes(event.key)) return;
      const stored = sessionUser<User>();
      if (!stored || stored.id !== user?.id) {
        // Never place another account into this user's unsaved workspace.
        setWorkspaceLocked(true); window.location.replace('/login');
      } else { setChecking(true); void sync(); }
    };
    const timer = window.setInterval(() => {
      const time = Date.now() + offset.current; setNow(time);
      const snapshot = current.current;
      if (snapshot && time >= snapshot.lockAt && !workspaceLocked() && !document.hidden) {
        setChecking(true); void sync();
      }
      if (activityPending.current && Date.now() - lastSent.current >= 30_000 && !document.hidden) void activity();
    }, 1000);
    const poll = window.setInterval(() => { if (!document.hidden) void sync(); }, 30_000);
    window.addEventListener('mediflow:session-state', state);
    window.addEventListener('mediflow:session-refresh', refresh);
    window.addEventListener('storage', storage);
    document.addEventListener('visibilitychange', visibility);
    for (const event of ['pointerdown', 'keydown', 'scroll']) window.addEventListener(event, interact, { passive: true });
    return () => {
      mounted.current = false; clearInterval(timer); clearInterval(poll);
      window.removeEventListener('mediflow:session-state', state);
      window.removeEventListener('mediflow:session-refresh', refresh);
      window.removeEventListener('storage', storage);
      document.removeEventListener('visibilitychange', visibility);
      for (const event of ['pointerdown', 'keydown', 'scroll']) window.removeEventListener(event, interact);
    };
  }, [activity, sync, user?.id]);
  const unlock = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await api.post('/auth/session/unlock', { password });
      // Same identity only: the server obtains the user from the signed session.
      acceptSession({ token: response.data.token, user: user! });
      apply(response.data.session); setPassword(''); setRenew(false);
      // GET requests may be refreshed by the user; failed writes are never replayed.
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  };
  const signOut = async () => {
    setBusy(true); setError('');
    try { await logout(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };
  const verifyEarly = async () => {
    setRenew(true); setWorkspaceLocked(true); setError('');
    try { await api.post('/auth/session/lock'); setWorkspaceLocked(true); }
    catch (e) { setError(errorMessage(e)); }
  };
  const hidden = locked || checking || renew;
  const absoluteWarning = Boolean(view && now >= view.expiresAt - 5 * 60_000);
  const idleWarning = Boolean(view && now >= view.warningAt);
  return <>
    {!hidden && (absoluteWarning || idleWarning) && <div className="session-warning" role="alert">
      <strong>{absoluteWarning ? 'Password verification needed soon' : 'Still working?'}</strong>
      <p>{absoluteWarning ? `Your session reaches its limit in ${Math.max(0, Math.ceil((view!.expiresAt - now) / 60_000))} minute(s). Finish your current step. Unsaved forms will remain open.`
        : `Your workspace will lock in ${Math.max(0, Math.ceil((view!.lockAt - now) / 1000))} seconds. Your unsaved forms will remain open.`}</p>
      <button type="button" className="btn btn-primary" disabled={writes > 0} onClick={() => absoluteWarning ? void verifyEarly() : void activity()}>{absoluteWarning ? 'Verify password now' : 'Continue working'}</button>
      {writes > 0 && <small className="d-block">Your current request is finishing. It will not be cancelled.</small>}
    </div>}
    <div inert={hidden} aria-hidden={hidden || undefined} style={hidden ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}>{children}</div>
    {hidden && <div className="session-shield">
      <Modal title={checking && !locked && !renew ? 'Checking your session' : 'Workspace locked'} closable={false} onClose={() => {}} size="sm">
        <p>{checking && !locked && !renew ? 'Confirming your session before showing the workspace.' : 'Enter your password to continue. Unsaved forms are still here; do not refresh or close this page.'}</p>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {locked || renew ? <form onSubmit={unlock}>
          <p className="text-secondary">{user?.fullName}</p>
          <PasswordField label="Your password" value={password} onChange={setPassword} autoComplete="current-password" />
          <button className="btn btn-primary mt-3" type="submit" disabled={busy || writes > 0 || !password}>{busy ? 'Please wait…' : 'Unlock and continue'}</button>
          {writes > 0 && <p role="status">Waiting for your current request to finish. It has not been cancelled.</p>}
          <button type="button" className="btn btn-link mt-3" disabled={busy || writes > 0} onClick={() => setConfirmLogout(true)}>Sign out instead</button>
        </form> : <button className="btn btn-outline-primary" onClick={() => void sync()}>Retry session check</button>}
        {confirmLogout && <div className="mt-3"><p>Sign out and discard unsaved changes?</p><button className="btn btn-light" disabled={busy} onClick={() => setConfirmLogout(false)}>Cancel</button><button className="btn btn-danger ms-2" disabled={busy} onClick={() => void signOut()}>Confirm sign out</button></div>}
      </Modal>
    </div>}
  </>;
}
