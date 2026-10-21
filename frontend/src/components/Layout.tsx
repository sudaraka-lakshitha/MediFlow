import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { api, errorMessage } from '../api/client';
import { type Role } from '../auth/AuthSession';
import { useAuth } from '../auth/useAuth';
import { Modal, ModalActions } from './Modal';
import { PasswordField } from './PasswordField';
import { Alert, Loading } from './Ui';
import { MyActivityModal } from './MyActivityModal';
import { ConfirmModal } from './ConfirmModal';
import { SessionGuard } from '../auth/SessionGuard';

type AttentionKey = 'prescriptions' | 'prescriptionUploads' | 'cashier' | 'inventory' | 'sales' | 'audit';
type AttentionSummary = Partial<Record<AttentionKey, { count: number; label: string; tone: 'danger' | 'warning' | 'info' | 'neutral' }>>;

const items: { to: string; label: string; icon: string; roles?: Role[]; attentionKey?: AttentionKey }[] = [
  { to: '/', label: 'Dashboard', icon: 'grid-1x2-fill' },
  { to: '/prescriptions', label: 'Prescriptions', icon: 'file-medical-fill', roles: ['ADMIN', 'PHARMACIST', 'PATIENT'], attentionKey: 'prescriptions' },
  { to: '/prescription-uploads', label: 'Prescription uploads', icon: 'cloud-arrow-up-fill', roles: ['ADMIN', 'PHARMACIST', 'PATIENT', 'CASHIER'], attentionKey: 'prescriptionUploads' },
  { to: '/cashier', label: 'Cashier payments', icon: 'cash-coin', roles: ['ADMIN', 'PHARMACIST', 'CASHIER'], attentionKey: 'cashier' },
  { to: '/patients', label: 'Patients', icon: 'person-vcard-fill', roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/catalog', label: 'Products', icon: 'capsule', roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/inventory', label: 'Inventory', icon: 'boxes', roles: ['ADMIN', 'PHARMACIST'], attentionKey: 'inventory' },
  { to: '/drug-research', label: 'Drug research', icon: 'globe2', roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/sales', label: 'Sales & billing', icon: 'receipt', roles: ['ADMIN', 'PHARMACIST', 'CASHIER', 'PATIENT'], attentionKey: 'sales' },
  { to: '/deliveries', label: 'Home deliveries', icon: 'truck', roles: ['ADMIN', 'PHARMACIST', 'CASHIER', 'PATIENT'] },
  { to: '/profile', label: 'My profile', icon: 'person-circle', roles: ['PATIENT'] },
  { to: '/health-record', label: 'My health record', icon: 'clipboard2-pulse', roles: ['PATIENT'] },
  { to: '/reports', label: 'Reports', icon: 'bar-chart-fill', roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/users', label: 'Users', icon: 'people-fill', roles: ['ADMIN'] },
  { to: '/discounts', label: 'Discounts', icon: 'percent', roles: ['ADMIN'] },
  { to: '/data-exports', label: 'Data exports', icon: 'database-down', roles: ['ADMIN'] },
  { to: '/audit', label: 'Audit logs', icon: 'shield-check', roles: ['ADMIN'], attentionKey: 'audit' },
  { to: '/settings', label: 'System settings', icon: 'sliders', roles: ['ADMIN'] },
];

export function Layout() {
  const { user, logout, passwordChanged, acceptSession } = useAuth();
  const location = useLocation();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [attention, setAttention] = useState<AttentionSummary>({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileViewport, setMobileViewport] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const navigationRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [online, setOnline] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const forcedPasswordChange = Boolean(user?.mustChangePassword);
  const canReviewOwnActivity = user?.role !== 'PATIENT';
  useEffect(() => { if (forcedPasswordChange) setPasswordOpen(true); }, [forcedPasswordChange]);
  useEffect(() => { setMobileNavOpen(false); }, [location.pathname]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const changed = () => {
      setMobileViewport(media.matches);
      setMobileNavOpen(false);
    };
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);
  useEffect(() => {
    if (!mobileNavOpen || !mobileViewport) return;
    const navigation = navigationRef.current;
    const opener = menuButtonRef.current;
    if (!navigation) return;
    const focusable = () => Array.from(navigation.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      .filter(element => element.getClientRects().length > 0);
    const focusMenu = () => focusable()[0]?.focus();
    const onFocus = (event: FocusEvent) => {
      if (!navigation.contains(event.target as Node)) focusMenu();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setMobileNavOpen(false); }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.body.classList.add('mobile-nav-active');
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocus);
    focusMenu();
    return () => {
      document.body.classList.remove('mobile-nav-active');
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocus);
      if (opener?.isConnected && opener.getClientRects().length) opener.focus();
    };
  }, [mobileNavOpen, mobileViewport]);
  useEffect(() => {
    let successTimer = 0;
    const connectivity = (event: Event) => setOnline(Boolean((event as CustomEvent<boolean>).detail));
    const success = (event: Event) => {
      setSuccessMessage(String((event as CustomEvent<string>).detail || 'Changes saved successfully.'));
      window.clearTimeout(successTimer);
      successTimer = window.setTimeout(() => setSuccessMessage(''), 4000);
    };
    window.addEventListener('mediflow:connectivity', connectivity);
    window.addEventListener('mediflow:success', success);
    return () => {
      window.clearTimeout(successTimer);
      window.removeEventListener('mediflow:connectivity', connectivity);
      window.removeEventListener('mediflow:success', success);
    };
  }, []);
  useEffect(() => {
    let active = true;
    const loadAttention = async () => {
      try {
        const response = await api.get('/navigation/attention');
        if (active) setAttention(response.data.data);
      } catch {
        // Navigation counts are helpful but should never interrupt the workspace.
      }
    };
    loadAttention();
    const timer = window.setInterval(loadAttention, 30_000);
    const onFocus = () => loadAttention();
    const onAttentionRefresh = () => loadAttention();
    window.addEventListener('focus', onFocus);
    window.addEventListener('mediflow:attention-refresh', onAttentionRefresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('mediflow:attention-refresh', onAttentionRefresh);
    };
  }, [location.pathname]);
  const visible = items.filter((item) => (!item.roles || item.roles.includes(user!.role)) && (item.to !== '/cashier' || user!.role === 'ADMIN' || user!.role === 'CASHIER' || Boolean(user!.cashierAccess)));
  const current = visible.find((item) => item.to === location.pathname)?.label || 'MediFlow';
  const initials = user!.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('');
  const today = new Intl.DateTimeFormat('en-LK', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date());
  const openPassword = () => {
    setMobileNavOpen(false);
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError(''); setPasswordMessage(''); setPasswordOpen(true);
  };
  const changePassword = async (event: FormEvent) => {
    event.preventDefault(); setPasswordError(''); setPasswordMessage('');
    if (passwords.newPassword !== passwords.confirmPassword) { setPasswordError('New password and confirmation do not match.'); return; }
    try {
      setBusy(true);
      const response = await api.post('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswordMessage(response.data.message);
      if (response.data.token && response.data.user) acceptSession(response.data);
      else passwordChanged();
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) { setPasswordError(errorMessage(error)); } finally { setBusy(false); }
  };

  return <SessionGuard><div className="app-shell">
    <aside ref={navigationRef} className={`sidebar ${mobileNavOpen ? 'mobile-open' : ''}`} id="mobile-navigation" role={mobileViewport && mobileNavOpen ? 'dialog' : undefined} aria-modal={mobileViewport && mobileNavOpen ? true : undefined} aria-label="Workspace navigation" inert={mobileViewport && !mobileNavOpen}>
      <div className="brand">
        <span className="brand-mark"><i className="bi bi-plus-lg" /></span>
        <div><strong>MediFlow</strong><small>Pharmacy operations</small></div>
        <button className="mobile-menu-close" type="button" aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)}><i className="bi bi-x-lg" /></button>
      </div>
      <div className="sidebar-caption">Workspace</div>
      <nav aria-label="Primary navigation">
        {visible.map((item) => {
          const itemAttention = item.attentionKey ? attention[item.attentionKey] : undefined;
          return (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} title={itemAttention?.count ? itemAttention.label : undefined} onClick={() => setMobileNavOpen(false)}>
              <span className="nav-icon" aria-hidden="true"><i className={`bi bi-${item.icon}`} /></span>
              <span className="nav-label">{item.label}</span>
              {Boolean(itemAttention?.count) && (
                <span className={`nav-attention nav-attention-${itemAttention!.tone}`} aria-label={`${itemAttention!.count} items need attention`}>
                  {itemAttention!.count > 99 ? '99+' : itemAttention!.count}
                </span>
              )}
              <i className="bi bi-chevron-right nav-chevron" aria-hidden="true" />
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-user">
        <span className="avatar">{initials}</span>
        <div className="sidebar-user-copy">
          <strong>{user!.fullName}</strong>
          <small>{user!.role.toLowerCase().replace('_', ' ')}</small>
        </div>
        <span className="sidebar-actions">
          <button title="Change password" aria-label="Change password" onClick={openPassword}><i className="bi bi-key" /></button>
          <button type="button" title="Sign out" aria-label="Sign out" onClick={() => { setMobileNavOpen(false); setLogoutOpen(true); }}><i className="bi bi-box-arrow-right" /></button>
        </span>
      </div>
    </aside>
    <main className="main-content" inert={mobileViewport && mobileNavOpen}>
      <header className="topbar">
        <button ref={menuButtonRef} className="mobile-menu-button" type="button" aria-label="Open navigation menu" aria-controls="mobile-navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(true)}>
          <i className="bi bi-list" />
        </button>
        <div className="topbar-context">
          <p><span>Workspace</span><i className="bi bi-chevron-right" />{current}</p>
          <h1>{current}</h1>
        </div>
        <div className="topbar-meta">
          <span className="topbar-date"><i className="bi bi-calendar3" />{today}</span>
          <span className={`live-pill ${online ? '' : 'offline'}`} role="status"><i className="bi bi-circle-fill" /> {online ? 'System online' : 'Connection interrupted'}</span>
          <button
            className="topbar-profile"
            type="button"
            title={canReviewOwnActivity ? 'Open my activity' : 'Change my password'}
            aria-label={canReviewOwnActivity ? `Open ${user!.fullName}'s activity` : 'Change my password'}
            onClick={() => canReviewOwnActivity ? setActivityOpen(true) : openPassword()}
          >
            <span className="topbar-avatar">{initials}</span>
            <span className="topbar-profile-copy"><strong>{user!.fullName}</strong><small>{canReviewOwnActivity ? 'My activity' : 'My account'}</small></span>
          </button>
        </div>
      </header>
      <div className="content">
        <Suspense fallback={<div className="route-loading"><Loading /></div>}><Outlet /></Suspense>
      </div>
    </main>
    {successMessage && <div className="success-toast" role="status" aria-live="polite"><i className="bi bi-check-circle-fill" aria-hidden="true" /><span>{successMessage}</span><button type="button" aria-label="Dismiss notification" onClick={() => setSuccessMessage('')}><i className="bi bi-x-lg" /></button></div>}
    {mobileNavOpen && <button className="mobile-nav-backdrop" type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)} />}
    {passwordOpen && <Modal title={forcedPasswordChange ? 'Replace temporary password' : 'Change my password'} onClose={() => !forcedPasswordChange && setPasswordOpen(false)} size="sm" closable={!forcedPasswordChange}><form onSubmit={changePassword}><Alert message={passwordError} />{passwordMessage && <div className="alert alert-success py-2">{passwordMessage}</div>}<div className="d-grid gap-3"><PasswordField label="Current password" value={passwords.currentPassword} onChange={(currentPassword) => setPasswords({ ...passwords, currentPassword })} autoComplete="current-password" /><PasswordField label="New password" value={passwords.newPassword} onChange={(newPassword) => setPasswords({ ...passwords, newPassword })} /><PasswordField label="Confirm new password" value={passwords.confirmPassword} onChange={(confirmPassword) => setPasswords({ ...passwords, confirmPassword })} /></div><ModalActions onClose={() => setPasswordOpen(false)} submitLabel="Change password" busy={busy} showCancel={!forcedPasswordChange} /></form></Modal>}
    {activityOpen && canReviewOwnActivity && <MyActivityModal user={user!} onClose={() => setActivityOpen(false)} />}
    {logoutOpen && <ConfirmModal title="Sign out of MediFlow?" message={logoutError || 'Are you sure you want to sign out? Any unsaved changes will be lost.'} confirmLabel="Sign out" danger={false} busy={logoutBusy} onClose={() => { if (!logoutBusy) { setLogoutOpen(false); setLogoutError(''); } }} onConfirm={() => { setLogoutBusy(true); void logout().catch(error => setLogoutError(errorMessage(error))).finally(() => setLogoutBusy(false)); }} />}
  </div></SessionGuard>;
}
