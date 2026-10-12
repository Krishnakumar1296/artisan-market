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

  // Lock body scroll when dropdown open
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
              className={`hamburger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              id="nav-hamburger"
            >
              <span className={`ham-line ${open ? 'open' : ''}`} />
              <span className={`ham-line ${open ? 'open' : ''}`} />
              <span className={`ham-line ${open ? 'open' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ───────────────────────── */}
        <div className={`nav-dropdown ${open ? 'open' : ''}`} id="nav-dropdown">
          <div className="nav-dropdown-inner">

            {/* User info pill (if logged in) */}
            {user && (
              <div className="nav-dropdown-user">
                <div className="nav-dropdown-avatar">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{user.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', textTransform: 'capitalize' }}>{user.role}</div>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="nav-dropdown-links">
              <NavLink to="/shop" className="dd-link">
                <span className="dd-icon">🛍️</span> Shop
              </NavLink>
              <NavLink to="/artisans" className="dd-link">
                <span className="dd-icon">👩‍🎨</span> Makers
              </NavLink>
              {user?.role !== 'artisan' && user?.role !== 'admin' && (
                <NavLink to="/cart" className="dd-link">
                  <span className="dd-icon">🛒</span> Cart
                  {count > 0 && <span className="badge" style={{ marginLeft: 6 }}>{count}</span>}
                </NavLink>
              )}
              {user ? (
                <>
                  <NavLink to={home} className="dd-link">
                    <span className="dd-icon">{user.role === 'customer' ? '📦' : '📊'}</span>
                    {user.role === 'customer' ? 'My Orders' : 'Dashboard'}
                  </NavLink>
                  <div className="dd-divider" />
                  <button
                    className="dd-link dd-link-danger"
                    onClick={() => { logout(); nav('/'); setOpen(false); }}
                  >
                    <span className="dd-icon">🚪</span> Log out
                  </button>
                </>
              ) : (
                <>
                  <div className="dd-divider" />
                  <div className="dd-auth-row">
                    <Link to="/login" className="dd-btn-login">Log in</Link>
                    <Link to="/register" className="dd-btn-join">Join free</Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Overlay to close dropdown */}
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
