import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { money } from '../components/ProductCard';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [s, setS] = useState({ name: user.name, phone: '', address: '', city: '', pincode: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setS({ ...s, [k]: e.target.value });

  const place = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      await api.post('/orders', { items: items.map((i) => ({ productId: i._id, qty: i.qty })), shipping: s });
      clear(); nav('/orders');
    } catch (x) { setErr(errMsg(x)); setBusy(false); }
  };

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr min(360px, 100%)', gap: 32, alignItems: 'start' }}>
      <form onSubmit={place}>
        <h1 style={{ marginBottom: 6 }}>Delivery details</h1>
        <p className="muted" style={{ marginBottom: 24 }}>Enter your shipping information below</p>

        <div className="panel" style={{ gap: 16 }}>
          {err && (
            <div style={{ background: 'var(--madder-pale)', color: 'var(--madder)', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500 }}>
              ⚠️ {err}
            </div>
          )}

          <div className="two">
            <label>Full name <input required value={s.name} onChange={set('name')} /></label>
            <label>Phone <input required type="tel" value={s.phone} onChange={set('phone')} placeholder="10-digit mobile" /></label>
          </div>

          <label>
            Delivery address
            <textarea required rows="3" value={s.address} onChange={set('address')} placeholder="House no, street, area…" />
          </label>

          <div className="two">
            <label>City <input required value={s.city} onChange={set('city')} /></label>
            <label>Pincode <input required value={s.pincode} onChange={set('pincode')} placeholder="6-digit pincode" /></label>
          </div>

          <div style={{ background: 'var(--paper-warm)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
              💳 <strong>Payment:</strong> Cash on delivery only. Online payment can be added with Razorpay or Stripe (see README).
            </p>
          </div>
        </div>

        <button className="btn gold" disabled={busy} style={{ width: '100%', justifyContent: 'center', marginTop: 16, fontSize: '1rem', padding: '14px' }}>
          {busy ? 'Placing order…' : `Place order · ${money(total)}`}
        </button>
      </form>

      {/* ── Order summary ──────────────────────────────── */}
      <div style={{ position: 'sticky', top: 84 }}>
        <div className="panel" style={{ gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Order summary</h2>
          {items.map((i) => (
            <div key={i._id} className="row between" style={{ margin: 0, fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--ink-soft)' }}>{i.title} × {i.qty}</span>
              <span>{money(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }} className="row between">
            <strong>Total</strong>
            <strong style={{ color: 'var(--indigo)', fontSize: '1.2rem' }}>{money(total)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
