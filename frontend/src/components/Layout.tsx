import { useEffect, useState, type FormEvent } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { api, errorMessage } from '../api/client';
import { type Role } from '../auth/AuthSession';
import { useAuth } from '../auth/useAuth';
import { Modal, ModalActions } from './Modal';
import { PasswordField } from './PasswordField';
import { Alert } from './Ui';
import { MyActivityModal } from './MyActivityModal';

type AttentionKey = 'prescriptions' | 'prescriptionUploads' | 'cashier' | 'inventory' | 'sales' | 'audit';
type AttentionSummary = Partial<Record<AttentionKey, { count: number; label: string; tone: 'danger' | 'warning' | 'info' | 'neutral' }>>;

const items: { to: string; label: string; icon: string; roles?: Role[]; attentionKey?: AttentionKey }[] = [
  { to: '/', label: 'Dashboard', icon: 'grid-1x2-fill' },
  { to: '/prescriptions', label: 'Prescriptions', icon: 'file-medical-fill', roles: ['ADMIN', 'PHARMACIST', 'PATIENT'], attentionKey: 'prescriptions' },
  { to: '/prescription-uploads', label: 'Prescription uploads', icon: 'cloud-arrow-up-fill', roles: ['ADMIN', 'PHARMACIST', 'PATIENT'], attentionKey: 'prescriptionUploads' },
  { to: '/cashier', label: 'Cashier payments', icon: 'cash-coin', roles: ['ADMIN', 'PHARMACIST', 'CASHIER'], attentionKey: 'cashier' },
  { to: '/patients', label: 'Patients', icon: 'person-vcard-fill', roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/catalog', label: 'Products', icon: 'capsule', roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/inventory', label: 'Inventory', icon: 'boxes', roles: ['ADMIN', 'PHARMACIST'], attentionKey: 'inventory' },
  { to: '/drug-research', label: 'Drug research', icon: 'globe2', roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/sales', label: 'Sales & billing', icon: 'receipt', roles: ['ADMIN', 'PHARMACIST', 'PATIENT'], attentionKey: 'sales' },
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
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [attention, setAttention] = useState<AttentionSummary>({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const forcedPasswordChange = Boolean(user?.mustChangePassword);
  const canReviewOwnActivity = user?.role !== 'PATIENT';
  useEffect(() => { if (forcedPasswordChange) setPasswordOpen(true); }, [forcedPasswordChange]);
  useEffect(() => { setMobileNavOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileNavOpen(false); };
    document.body.classList.add('mobile-nav-active');
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.classList.remove('mobile-nav-active'); window.removeEventListener('keydown', onKeyDown); };
  }, [mobileNavOpen]);
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

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNavOpen ? 'mobile-open' : ''}`} id="mobile-navigation" aria-label="Workspace navigation">
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
            <NavLink key={item.to} to={item.to} end={item.to === '/'} title={itemAttention?.count ? itemAttention.label : undefined}>
              <span className="nav-icon"><i className={`bi bi-${item.icon}`} /></span>
              <span className="nav-label">{item.label}</span>
              {Boolean(itemAttention?.count) && (
                <span className={`nav-attention nav-attention-${itemAttention!.tone}`} aria-label={`${itemAttention!.count} items need attention`}>
                  {itemAttention!.count > 99 ? '99+' : itemAttention!.count}
                </span>
              )}
              <i className="bi bi-chevron-right nav-chevron" />
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
          <button title="Sign out" aria-label="Sign out" onClick={logout}><i className="bi bi-box-arrow-right" /></button>
        </span>
      </div>
    </aside>
    <main className="main-content">
      <header className="topbar">
        <button className="mobile-menu-button" type="button" aria-label="Open navigation menu" aria-controls="mobile-navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(true)}>
          <i className="bi bi-list" />
        </button>
        <div className="topbar-context">
          <p><span>Workspace</span><i className="bi bi-chevron-right" />{current}</p>
          <h1>{current}</h1>
        </div>
        <div className="topbar-meta">
          <span className="topbar-date"><i className="bi bi-calendar3" />{today}</span>
          <span className="live-pill"><i className="bi bi-circle-fill" /> System online</span>
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
      <div className="content"><Outlet /></div>
    </main>
    {mobileNavOpen && <button className="mobile-nav-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)} />}
    {passwordOpen && <Modal title={forcedPasswordChange ? 'Replace temporary password' : 'Change my password'} onClose={() => !forcedPasswordChange && setPasswordOpen(false)} size="sm" closable={!forcedPasswordChange}><form onSubmit={changePassword}><Alert message={passwordError} />{passwordMessage && <div className="alert alert-success py-2">{passwordMessage}</div>}<div className="d-grid gap-3"><PasswordField label="Current password" value={passwords.currentPassword} onChange={(currentPassword) => setPasswords({ ...passwords, currentPassword })} autoComplete="current-password" /><PasswordField label="New password" value={passwords.newPassword} onChange={(newPassword) => setPasswords({ ...passwords, newPassword })} /><PasswordField label="Confirm new password" value={passwords.confirmPassword} onChange={(confirmPassword) => setPasswords({ ...passwords, confirmPassword })} /></div><ModalActions onClose={() => setPasswordOpen(false)} submitLabel="Change password" busy={busy} showCancel={!forcedPasswordChange} /></form></Modal>}
    {activityOpen && canReviewOwnActivity && <MyActivityModal user={user!} onClose={() => setActivityOpen(false)} />}
  </div>;
}
