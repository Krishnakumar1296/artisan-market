import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  const home = user?.role === 'artisan' ? '/artisan' : user?.role === 'admin' ? '/admin' : '/orders';
  const isShopper = user?.role !== 'artisan' && user?.role !== 'admin';

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
            {isShopper && (
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

          {/* ── Mobile top-right ────────────────────── */}
          <div className="nav-mobile-right">
            {user ? (
              <button
                className="nav-logout-icon"
                onClick={() => { logout(); nav('/'); }}
                aria-label="Log out"
                title="Log out"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            ) : (
              <Link to="/register" className="nav-mobile-join">Join free</Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile bottom tab bar ─────────────────── */}
      <nav className="mobile-tabbar">
        <NavLink to="/" end className="mtab">
          <span className="mtab-icon">🏠</span>
          <span className="mtab-label">Home</span>
        </NavLink>
        <NavLink to="/shop" className="mtab">
          <span className="mtab-icon">🛍️</span>
          <span className="mtab-label">Shop</span>
        </NavLink>
        <NavLink to="/artisans" className="mtab">
          <span className="mtab-icon">👩‍🎨</span>
          <span className="mtab-label">Makers</span>
        </NavLink>
        {isShopper && (
          <NavLink to="/cart" className="mtab">
            <span className="mtab-icon">
              🛒
              {count > 0 && <span className="mtab-badge">{count}</span>}
            </span>
            <span className="mtab-label">Cart</span>
          </NavLink>
        )}
        <NavLink to={user ? home : '/login'} className="mtab">
          <span className="mtab-icon">👤</span>
          <span className="mtab-label">{user ? (user.role === 'customer' ? 'My Orders' : 'Dashboard') : 'Log in'}</span>
        </NavLink>
      </nav>
    </>
  );
}
