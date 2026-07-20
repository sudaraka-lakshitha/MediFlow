import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Alert } from "../components/Ui";
import { PasswordField } from "../components/PasswordField";

const demoAccounts = [
  { role: "Admin", email: "pharmacy.mediflow+admin@gmail.com" },
  { role: "Pharmacist", email: "pharmacy.mediflow+pharmacist@gmail.com" },
  { role: "Cashier", email: "pharmacy.mediflow+cashier@gmail.com" },
  { role: "Patient", email: "pharmacy.mediflow+patient@gmail.com" },
];

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-story">
        <div className="auth-brand">
          <span className="brand-mark"><i className="bi bi-plus-lg" /></span>
          MediFlow
        </div>
        <div>
          <span className="eyebrow">Prescription to patient</span>
          <h1>Safer dispensing.<br />Smarter stock.</h1>
          <p>One connected workspace for prescriptions, batches, inventory, and pharmacy reporting.</p>
        </div>
        <small>Secure • Auditable • Reliable</small>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-card" onSubmit={submit}>
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to MediFlow</h2>
          <p className="text-secondary">Use your pharmacy account to continue.</p>
          <Alert message={error} />
          <label className="form-label">Email address</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
          <div className="mt-3">
            <PasswordField value={password} onChange={setPassword} autoComplete="current-password" />
          </div>
          <button className="btn btn-primary w-100 mt-4" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <p className="auth-link"><Link to="/forgot-password">Forgot password?</Link></p>
          <p className="auth-link">New patient? <Link to="/register">Create an account</Link></p>
          <div className="demo-note">
            <div className="demo-note-heading">
              <strong>Test accounts</strong>
              <small>Click an account to use its email</small>
            </div>
            <div className="demo-account-list">
              {demoAccounts.map((account) => (
                <button
                  type="button"
                  className={email === account.email ? "demo-account selected" : "demo-account"}
                  key={account.role}
                  onClick={() => setEmail(account.email)}
                >
                  <strong>{account.role}</strong>
                  <span>{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
