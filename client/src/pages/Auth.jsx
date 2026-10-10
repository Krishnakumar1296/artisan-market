import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';

const homeFor = (u) => (u.role === 'artisan' ? '/artisan' : u.role === 'admin' ? '/admin' : '/shop');

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { nav(homeFor(await login(f.email, f.password))); }
    catch (x) { setErr(errMsg(x)); setBusy(false); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🙏</div>
          <h1 style={{ marginBottom: 4 }}>Welcome back</h1>
          <p className="muted">Sign in to continue to Kaivinai</p>
        </div>
        <form className="panel" onSubmit={submit} style={{ gap: 18 }}>
          {err && (
            <div style={{ background: 'var(--madder-pale)', color: 'var(--madder)', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500 }}>
              ⚠️ {err}
            </div>
          )}
          <label>
            Email address
            <input
              id="login-email"
              type="email"
              required
              value={f.email}
              autoComplete="email"
              onChange={(e) => setF({ ...f, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              id="login-password"
              type="password"
              required
              value={f.password}
              autoComplete="current-password"
              onChange={(e) => setF({ ...f, password: e.target.value })}
              placeholder="••••••••"
            />
          </label>
          <button className="btn" id="login-submit" disabled={busy} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {busy ? 'Signing in…' : 'Sign in →'}
          </button>
          <p className="muted" style={{ textAlign: 'center', margin: 0 }}>
            New here? <Link to="/register">Create a free account</Link>
          </p>
        </form>

        <div style={{ marginTop: 20, padding: '14px', background: 'var(--paper-warm)', border: '1px solid var(--line)', borderRadius: 10 }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
            <strong>Demo accounts:</strong><br />
            Admin: admin@artisan.local / Admin@12345<br />
            Artisan: meena@artisan.local / Artisan@123
          </p>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'customer', craft: '', location: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { nav(homeFor(await register(f))); }
    catch (x) { setErr(errMsg(x)); setBusy(false); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>✨</div>
          <h1 style={{ marginBottom: 4 }}>Join Kaivinai</h1>
          <p className="muted">Start buying or selling handmade crafts today</p>
        </div>
        <form className="panel" onSubmit={submit} style={{ gap: 18 }}>
          {err && (
            <div style={{ background: 'var(--madder-pale)', color: 'var(--madder)', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500 }}>
              ⚠️ {err}
            </div>
          )}

          <div>
            <p style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>I want to…</p>
            <div className="auth-role-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { role: 'customer', emoji: '🛒', title: 'Buy crafts', desc: 'Shop from artisans' },
                { role: 'artisan', emoji: '🎨', title: 'Sell my craft', desc: 'List and sell products' },
              ].map((opt) => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => setF({ ...f, role: opt.role })}
                  style={{
                    padding: '14px', borderRadius: 10, border: `2px solid ${f.role === opt.role ? 'var(--indigo)' : 'var(--line)'}`,
                    background: f.role === opt.role ? 'var(--indigo-glow)' : '#fff',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{opt.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: f.role === opt.role ? 'var(--indigo)' : 'var(--ink)' }}>{opt.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <label>
            Full name
            <input id="reg-name" required value={f.name} onChange={set('name')} placeholder="Your full name" />
          </label>
          <label>
            Email address
            <input id="reg-email" type="email" required value={f.email} onChange={set('email')} placeholder="you@example.com" />
          </label>
          <label>
            Password <span className="muted">(6+ characters)</span>
            <input id="reg-password" type="password" minLength={6} required value={f.password} onChange={set('password')} placeholder="••••••••" />
          </label>

          {f.role === 'artisan' && (
            <div style={{ padding: '16px', background: 'var(--turmeric-pale)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--terracotta)', fontSize: '0.9rem' }}>🎨 Tell customers about your craft</p>
              <label>
                Your craft
                <input placeholder="e.g. Pottery, handloom weaving" value={f.craft} onChange={set('craft')} />
              </label>
              <label>
                Town or village
                <input value={f.location} onChange={set('location')} placeholder="e.g. Erode, Tamil Nadu" />
              </label>
            </div>
          )}

          <button className="btn gold" id="reg-submit" disabled={busy} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {busy ? 'Creating account…' : 'Create account →'}
          </button>
          <p className="muted" style={{ textAlign: 'center', margin: 0 }}>
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
