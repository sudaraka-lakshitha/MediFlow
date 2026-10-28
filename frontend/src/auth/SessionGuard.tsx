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
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [idleMinutes, setIdleMinutes] = useState(30);
  // Show a "warming up" hint after 5 s of initial session check with no response
  const [warmingUp, setWarmingUp] = useState(false);
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
    setWarmingUp(false);
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
    // A request can lock the session before this effect subscribes.
    state();
    const requestUnlock = () => {
      setPassword(''); setError(''); setRenew(true); setWorkspaceLocked(true);
    };
    const refresh = () => { setChecking(true); void sync(); };
    const interact = (event: Event) => {
      if (!event.isTrusted || document.hidden || workspaceLocked() || paused.current) return;
      activityPending.current = true;
      if (Date.now() - lastSent.current >= 30_000) void activity();
    };
    const visibility = () => {
      // Background validation must not interrupt a valid workspace.
      if (!document.hidden) void sync();
    };
    const preferences = () => { setIdleMinutes(current.current?.idleMinutes ?? 30); setPreferencesOpen(true); setError(''); };
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
        if (pendingWrites() === 0) void sync();
      }
      if (activityPending.current && Date.now() - lastSent.current >= 30_000 && !document.hidden) void activity();
    }, 1000);
    const poll = window.setInterval(() => { if (!document.hidden && pendingWrites() === 0) void sync(); }, 60_000);
    window.addEventListener('mediflow:session-state', state);
    window.addEventListener('mediflow:session-preferences', preferences);
    window.addEventListener('mediflow:request-unlock', requestUnlock);
    window.addEventListener('mediflow:session-refresh', refresh);
    window.addEventListener('storage', storage);
    document.addEventListener('visibilitychange', visibility);
    for (const event of ['pointerdown', 'keydown', 'scroll']) window.addEventListener(event, interact, { passive: true });
    return () => {
      mounted.current = false; clearInterval(timer); clearInterval(poll);
      window.removeEventListener('mediflow:session-state', state);
      window.removeEventListener('mediflow:session-preferences', preferences);
      window.removeEventListener('mediflow:request-unlock', requestUnlock);
      window.removeEventListener('mediflow:session-refresh', refresh);
      window.removeEventListener('storage', storage);
      document.removeEventListener('visibilitychange', visibility);
      for (const event of ['pointerdown', 'keydown', 'scroll']) window.removeEventListener(event, interact);
    };
  }, [activity, sync, user?.id]);

  // Show "warming up" hint after 5 s of waiting for the initial session check
  useEffect(() => {
    if (!checking) { setWarmingUp(false); return; }
    const timer = window.setTimeout(() => setWarmingUp(true), 5000);
    return () => window.clearTimeout(timer);
  }, [checking]);

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

  // The workspace is only fully blocked for lock/renew states.
  // During the initial session check we show content optimistically behind
  // a non-blocking banner — avoids a blank-screen on cold-start servers.
  const hidden = locked || renew;
  const showCheckingBanner = checking && !hidden;

  const absoluteWarning = Boolean(view && now >= view.expiresAt - 5 * 60_000);
  const idleWarning = Boolean(view && now >= view.warningAt);
  return <>
    {/* Non-blocking session-checking banner shown during initial validation */}
    {showCheckingBanner && <div className="session-checking-bar" role="status" aria-live="polite">
      {!error && <span className="session-checking-spinner" aria-hidden="true" />}
      <span>
        {error ? `Session check could not finish: ${error}` : warmingUp
          ? 'The server is taking longer than usual. Please wait…'
          : 'Verifying your session…'}
      </span>
      {error && <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => { setError(''); void sync(); }}>Retry session check</button>}
    </div>}
    {!hidden && (absoluteWarning || idleWarning) && <div className="session-warning" role="alert">
      <strong>{absoluteWarning ? 'Password verification needed soon' : 'Still working?'}</strong>
      <p>{absoluteWarning ? `Your session expires in ${Math.max(0, Math.ceil((view!.expiresAt - now) / 60_000))} minute(s). Save your work or verify your password now to renew it.`
        : `You will be signed out in ${Math.max(0, Math.ceil((view!.lockAt - now) / 1000))} seconds due to inactivity. Save your work or continue working.`}</p>
      <button type="button" className="btn btn-primary" disabled={writes > 0} onClick={() => absoluteWarning ? void verifyEarly() : void activity()}>{absoluteWarning ? 'Verify password now' : 'Continue working'}</button>
      {writes > 0 && <small className="d-block">Your current request is finishing. It will not be cancelled.</small>}
    </div>}
    <div inert={hidden} aria-hidden={hidden || undefined} style={hidden ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}>{children}</div>
    {preferencesOpen && !hidden && <Modal title="Session preferences" onClose={() => { if (!busy) setPreferencesOpen(false); }} size="sm">
      <p>Sign out after inactivity. You receive a one-minute warning. Closing this tab normally clears its login; browser restore features may restore tabs, so always sign out on shared devices.</p>
      <label className="form-label" htmlFor="session-idle">Inactive time</label>
      <select id="session-idle" className="form-select" value={idleMinutes} onChange={e => setIdleMinutes(Number(e.target.value))}>
        {[15, 30, 60, 90, 120].map(minutes => <option key={minutes} value={minutes}>{minutes} minutes</option>)}
      </select>
      <p className="text-secondary mt-2">Sessions also expire after at most 8 hours. Background refreshes do not count as activity.</p>
      {error && <p role="alert" className="text-danger">{error}</p>}
      <button className="btn btn-primary mt-2" disabled={busy} onClick={async () => {
        setBusy(true); setError('');
        try { const response = await api.put('/auth/session/preferences', { idleMinutes }); apply(response.data.session); setPreferencesOpen(false); }
        catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
      }}>Save preference</button>
    </Modal>}
    {hidden && <div className="session-shield">
      <Modal title={renew ? 'Workspace locked' : locked && !checking ? 'Workspace locked' : 'Checking your session'} closable={false} onClose={() => {}} size="sm">
        <p>{renew || locked ? 'Enter your password to continue. Unsaved forms are still here; do not refresh or close this page.' : 'Confirming your session before showing the workspace.'}</p>
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
