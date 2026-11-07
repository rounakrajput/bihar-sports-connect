import { useEffect, useState } from 'react';
import { api } from './api.js';
import Login from './Login.jsx';

const ROLE_LABEL = {
  athlete: 'Athlete',
  organization: 'Organization',
  admin: 'Platform Administrator',
};

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // If a valid session cookie exists, skip the login screen.
  useEffect(() => {
    api.me()
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  async function signOut() {
    await api.logout().catch(() => {});
    setUser(null);
  }

  if (checking) return null;
  if (!user) return <Login onSuccess={setUser} />;

  // Placeholder: real dashboards come in the next step.
  return (
    <main className="page">
      <section className="panel">
        <h1>Hello, {user.name}</h1>
        <p className="sub">Signed in as {ROLE_LABEL[user.role]}. Your dashboard comes next.</p>
        <button className="btn" onClick={signOut}>Sign out</button>
      </section>
    </main>
  );
}
