import { useState } from 'react';
import { api } from './api.js';

const ROLES = [
  { id: 'athlete',      label: 'Athlete',      hint: 'Find events, check eligibility and track your registrations.' },
  { id: 'organization', label: 'Organization', hint: 'Manage your organization profile and the events you submit.' },
  { id: 'admin',        label: 'Administrator', hint: 'Verify organizations and review event submissions.' },
];

export default function Login({ onSuccess }) {
  const [role, setRole] = useState('athlete');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const index = ROLES.findIndex((r) => r.id === role);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ email, password, role });
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <h1>Bihar Sports Connect</h1>
        <p className="sub">Sign in to continue.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="segment" role="radiogroup" aria-label="Sign in as">
            <span
              className="segment-thumb"
              style={{ transform: `translateX(${index * 100}%)` }}
              aria-hidden="true"
            />
            {ROLES.map((r) => (
              <label key={r.id} className={r.id === role ? 'segment-item active' : 'segment-item'}>
                <input
                  type="radio"
                  name="role"
                  value={r.id}
                  checked={r.id === role}
                  onChange={() => { setRole(r.id); setError(''); }}
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
          <p className="hint">{ROLES[index].hint}</p>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="password">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="link"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <p className="error" role="alert">{error}</p>

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
