import { personNameInputProps } from '../utils/personName';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { errorMessage } from '../api/client';
import { useAuth } from '../auth/useAuth';
import { Alert } from '../components/Ui';
import { PasswordField } from '../components/PasswordField';

const fields = [
  ['fullName', 'Full name', 'text', 'e.g. Nimal Perera', 'Enter your full name in English, without numbers. Initial letters are capitalized automatically.', 'name'],
  ['email', 'Email address', 'email', 'e.g. nimal@example.com', 'Use your own email address so you can recover your account.', 'email'],
  ['phone', 'Phone number', 'tel', '0701234567 or +94701234567', 'Use 0701234567 or +94701234567. No spaces or hyphens.', 'tel'],
  ['dateOfBirth', 'Date of birth', 'date', '', 'Choose your actual date of birth, for example 20 October 2003.', 'bday'],
] as const;

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', dateOfBirth: '', password: '' });
  const [error, setError] = useState('');
  if (user) return <Navigate to="/" replace />;
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    try { await register(form); navigate('/'); } catch (err) { setError(errorMessage(err)); }
  };
  return <div className="auth-page simple"><section className="auth-form-wrap"><form className="auth-card" onSubmit={submit}>
    <div className="auth-brand dark"><span className="brand-mark"><i className="bi bi-plus-lg" /></span>MediFlow</div>
    <p className="eyebrow mt-4">Patient registration</p><h2>Create your account</h2>
    <p className="text-secondary small">Examples below are a guide only. Enter your own details.</p>
    <Alert message={error} />
    {fields.map(([key, label, type, example, hint, autoComplete]) => <div key={key} className="mt-3">
      <label className="form-label" htmlFor={`register-${key}`}>{label}</label>
      <input id={`register-${key}`} className="form-control" type={type} autoComplete={autoComplete}
        placeholder={example} aria-describedby={`register-${key}-hint`}
        inputMode={key === 'phone' ? 'tel' : undefined}
        pattern={key === 'phone' ? '(?:0[0-9]{9}|\\+94[0-9]{9})' : undefined}
        maxLength={key === 'phone' ? 12 : undefined}
        title={key === 'phone' ? 'Use 0701234567 or +94701234567 (no spaces or hyphens).' : undefined}
        {...(key === 'fullName' ? personNameInputProps(fullName => setForm(previous => ({ ...previous, fullName }))) : {})}
        value={form[key]} onChange={e => setForm(previous => ({ ...previous, [key]: e.target.value }))} required />
      <div id={`register-${key}-hint`} className="form-text">{hint}</div>
    </div>)}
    <div className="mt-3"><PasswordField value={form.password} onChange={password => setForm(previous => ({ ...previous, password }))} /></div>
    <button className="btn btn-primary w-100 mt-4">Register</button>
    <p className="auth-link">Already registered? <Link to="/login">Sign in</Link></p>
  </form></section></div>;
}
