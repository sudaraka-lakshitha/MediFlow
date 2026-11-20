// FORGOT PASSWORD PAGE
// Three steps: enter email, enter the code sent by email, choose a new password.

import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../api/client';
import { Alert } from '../components/Ui';
import { PasswordField } from '../components/PasswordField';

type Step = 'email' | 'otp' | 'password' | 'complete';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(
      () => setResendIn((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const requestCode = async (event?: FormEvent) => {
    event?.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      setStep('otp'); setResendIn(60);
    } catch (caught) { setError(errorMessage(caught)); }
    finally { setBusy(false); }
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await api.post('/auth/verify-reset-otp', { email, otp });
      setResetToken(response.data.resetToken); setMessage('Code verified. Choose your new password.'); setStep('password');
    } catch (caught) { setError(errorMessage(caught)); }
    finally { setBusy(false); }
  };

  const reset = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (passwords.password !== passwords.confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      const response = await api.post('/auth/reset-password', { resetToken, newPassword: passwords.password });
      setMessage(response.data.message); setStep('complete'); setResetToken(''); setOtp('');
    } catch (caught) { setError(errorMessage(caught)); }
    finally { setBusy(false); }
  };

  const heading = step === 'email' ? 'Reset your password' : step === 'otp' ? 'Enter your email code' : step === 'password' ? 'Choose a new password' : 'Password changed';
  return <div className="auth-page simple"><section className="auth-form-wrap"><form className="auth-card" onSubmit={step === 'email' ? requestCode : step === 'otp' ? verifyCode : reset}>
    <div className="auth-brand dark"><span className="brand-mark"><i className="bi bi-plus-lg" /></span>MediFlow</div>
    <p className="eyebrow mt-4">Secure account recovery</p><h2>{heading}</h2>
    {step === 'email' && <p className="text-secondary">We will send a six-digit one-time code to your registered email address.</p>}
    {step === 'otp' && <p className="text-secondary">Enter the code sent to <strong>{email}</strong>. It expires in 10 minutes.</p>}
    {step === 'password' && <p className="text-secondary">Choose a strong password. The checklist below updates as you type.</p>}
    <Alert message={error} />{message && <div className="alert alert-success py-2">{message}</div>}

    {step === 'email' && <div><label className="form-label">Email address</label><input className="form-control" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus /></div>}
    {step === 'otp' && <><label className="form-label">Six-digit code</label><input className="form-control form-control-lg text-center" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required autoFocus /><div className="d-flex justify-content-between mt-2"><button type="button" className="btn btn-link btn-sm px-0" onClick={() => { setStep('email'); setOtp(''); setMessage(''); }}>Change email</button><button type="button" className="btn btn-link btn-sm px-0" disabled={busy || resendIn > 0} onClick={() => requestCode()}>{resendIn ? `Resend in ${resendIn}s` : 'Resend code'}</button></div></>}
    {step === 'password' && <div className="d-grid gap-3"><PasswordField label="New password" value={passwords.password} onChange={(password) => setPasswords({ ...passwords, password })} /><PasswordField label="Confirm new password" value={passwords.confirm} onChange={(confirm) => setPasswords({ ...passwords, confirm })} /></div>}
    {step !== 'complete' && <button className="btn btn-primary w-100 mt-4" disabled={busy || (step === 'otp' && otp.length !== 6)}>{busy ? 'Please wait…' : step === 'email' ? 'Send reset code' : step === 'otp' ? 'Verify code' : 'Reset password'}</button>}
    <p className="auth-link"><Link to="/login">{step === 'complete' ? 'Sign in with your new password' : 'Back to sign in'}</Link></p>
  </form></section></div>;
}
