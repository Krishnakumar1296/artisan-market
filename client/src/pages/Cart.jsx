import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { money } from '../components/ProductCard';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=120&q=80',
  'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=120&q=80',
];

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  if (!items.length) return (
    <>
      <h1>Your cart</h1>
      <div className="empty-state" style={{ marginTop: 40 }}>
        <div className="empty-icon">🛒</div>
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn">Find something handmade</Link>
      </div>
    </>
  );

  return (
    <>
      <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr min(380px, 100%)', gap: 32, alignItems: 'start' }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Your cart</h1>
          <p className="muted" style={{ marginBottom: 20 }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>

          {items.map((i, idx) => (
            <div key={i._id} className="line">
              <div className="mini-thumb">
                <img
                  src={i.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                  alt={i.title}
                  onError={(e) => { e.target.src = FALLBACK_IMAGES[0]; }}
                />
              </div>
              <div className="grow">
                <strong style={{ fontSize: '0.95rem' }}>{i.title}</strong>
                <div className="muted" style={{ fontSize: '0.85rem' }}>{money(i.price)} each</div>
              </div>
              <input
                type="number"
                min="1"
                max={i.stock}
                value={i.qty}
                onChange={(e) => setQty(i._id, +e.target.value)}
                className="qty"
              />
              <strong style={{ color: 'var(--indigo)', minWidth: 72, textAlign: 'right' }}>
                {money(i.price * i.qty)}
              </strong>
              <button className="link danger" onClick={() => remove(i._id)} style={{ fontSize: '0.85rem' }}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ── Order summary ─────────────────────────────── */}
        <div style={{ position: 'sticky', top: 84 }}>
          <div className="panel" style={{ gap: 14 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Order summary</h2>

            {items.map((i) => (
              <div key={i._id} className="row between" style={{ margin: 0, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--ink-soft)' }}>{i.title} × {i.qty}</span>
                <span>{money(i.price * i.qty)}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              <div className="row between" style={{ margin: 0 }}>
                <strong style={{ fontSize: '1.05rem' }}>Total</strong>
                <strong style={{ fontSize: '1.3rem', color: 'var(--indigo)' }}>{money(total)}</strong>
              </div>
              <p className="muted" style={{ fontSize: '0.8rem', margin: '6px 0 0' }}>
                Cash on delivery · Free shipping on orders over ₹999
              </p>
            </div>

            {user?.role && user.role !== 'customer' ? (
              <div style={{ background: 'var(--madder-pale)', color: 'var(--madder)', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500 }}>
                Only customer accounts can place orders.
              </div>
            ) : (
              <button
                className="btn gold"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => nav(user ? '/checkout' : '/login')}
              >
                {user ? 'Proceed to checkout →' : 'Log in to checkout →'}
              </button>
            )}

            <Link to="/shop" className="btn ghost small" style={{ textAlign: 'center', width: '100%', justifyContent: 'center' }}>
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
