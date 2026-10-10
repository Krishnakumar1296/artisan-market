import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const home = user?.role === 'artisan' ? '/artisan' : user?.role === 'admin' ? '/admin' : '/orders';

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand" style={{ padding: 0 }}>
            {/* Full logo on desktop, icon-only on mobile */}
            <img
              src="/logo.jpg"
              alt="Kaivinai"
              className="logo-full"
              style={{ height: 38, width: 'auto', objectFit: 'contain', display: 'block' }}
            />
            <img
              src="/favicon.jpg"
              alt="Kaivinai"
              className="logo-icon"
              style={{ height: 34, width: 34, objectFit: 'cover', borderRadius: 8, display: 'none' }}
            />
          </Link>

          {/* ── Desktop nav ─────────────────────────── */}
          <nav className="nav-desktop">
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/artisans">Makers</NavLink>
            {user?.role !== 'artisan' && user?.role !== 'admin' && (
              <NavLink to="/cart">
                Cart{count > 0 && <span className="badge">{count}</span>}
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink to={home}>
                  {user.role === 'customer' ? 'My orders' : 'Dashboard'}
                </NavLink>
                <button className="link" onClick={() => { logout(); nav('/'); }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <Link to="/register" className="btn-nav">Join free</Link>
              </>
            )}
          </nav>

          {/* ── Mobile right side ───────────────────── */}
          <div className="nav-mobile-right">
            {user?.role !== 'artisan' && user?.role !== 'admin' && count > 0 && (
              <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', position: 'relative' }}>
                🛒<span className="badge" style={{ position: 'absolute', top: -6, right: -8 }}>{count}</span>
              </Link>
            )}
            <button
              className="hamburger"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              id="nav-hamburger"
            >
              <span className={`ham-line ${open ? 'open' : ''}`} />
              <span className={`ham-line ${open ? 'open' : ''}`} />
              <span className={`ham-line ${open ? 'open' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer overlay ─────────────────── */}
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}

      <div className={`nav-drawer ${open ? 'open' : ''}`}>
        <div className="nav-drawer-inner">
          {user && (
            <div className="nav-drawer-user">
              <div className="nav-drawer-avatar">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{user.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            </div>
          )}

          <nav className="nav-drawer-links">
            <NavLink to="/shop" className="drawer-link">🛍️ Shop</NavLink>
            <NavLink to="/artisans" className="drawer-link">👩‍🎨 Makers</NavLink>
            {user?.role !== 'artisan' && user?.role !== 'admin' && (
              <NavLink to="/cart" className="drawer-link">
                🛒 Cart {count > 0 && <span className="badge">{count}</span>}
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink to={home} className="drawer-link">
                  {user.role === 'customer' ? '📦 My orders' : '📊 Dashboard'}
                </NavLink>
                <div className="drawer-divider" />
                <button
                  className="drawer-link drawer-link-danger"
                  onClick={() => { logout(); nav('/'); setOpen(false); }}
                >
                  🚪 Log out
                </button>
              </>
            ) : (
              <>
                <div className="drawer-divider" />
                <NavLink to="/login" className="drawer-link">Log in</NavLink>
                <Link to="/register" className="btn gold" style={{ marginTop: 8, textAlign: 'center', justifyContent: 'center' }}>
                  Join free — it's quick!
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
