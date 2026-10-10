import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { money } from '../components/ProductCard';

const STATUS_CONFIG = {
  placed: { label: 'Placed', color: '#6b7280', bg: '#f3f4f6', icon: '📦' },
  packed: { label: 'Packed', color: '#0369a1', bg: '#e0f2fe', icon: '📫' },
  shipped: { label: 'Shipped', color: '#6d28d9', bg: '#ede9fe', icon: '🚚' },
  delivered: { label: 'Delivered', color: '#059669', bg: '#d1fae5', icon: '✅' },
  cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', icon: '❌' },
};

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: '3px 10px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {c.icon} {c.label}
    </span>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api.get('/orders/mine').then((r) => setOrders(r.data));

  useEffect(() => { load(); }, []);

  const cancel = async (o, i) => {
    setErr('');
    try { await api.put(`/orders/${o._id}/items/${i._id}/cancel`); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  if (!orders) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="skeleton" style={{ height: 32, width: 200, borderRadius: 8 }} />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="panel">
          <div className="skeleton" style={{ height: 18, width: '40%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 14, borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1>My orders</h1>
        <p className="muted">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {err && (
        <div style={{ background: 'var(--madder-pale)', color: 'var(--madder)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.9rem' }}>
          ⚠️ {err}
        </div>
      )}

      {!orders.length && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>You haven't ordered anything yet.</p>
        </div>
      )}

      {orders.map((o) => (
        <div key={o._id} className="panel fade-up" style={{ gap: 0 }}>
          <div className="row between" style={{ margin: '0 0 12px', padding: '0 0 12px', borderBottom: '1px solid var(--line-soft)' }}>
            <div>
              <strong style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Order #{o._id.slice(-6).toUpperCase()}
              </strong>
              <span className="muted" style={{ fontSize: '0.85rem', marginLeft: 12 }}>
                {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <strong style={{ color: 'var(--indigo)' }}>{money(o.total)}</strong>
          </div>

          {o.items.map((i) => (
            <div key={i._id} className="line" style={{ padding: '12px 0' }}>
              <div className="grow">
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{i.title}</span>
                <span className="muted" style={{ marginLeft: 8, fontSize: '0.85rem' }}>× {i.qty}</span>
              </div>
              <StatusBadge status={i.status} />
              <span style={{ minWidth: 80, textAlign: 'right', fontWeight: 600 }}>{money(i.price * i.qty)}</span>
              {i.status === 'placed' && (
                <button className="link danger" onClick={() => cancel(o, i)} style={{ fontSize: '0.85rem', flexShrink: 0 }}>
                  Cancel
                </button>
              )}
            </div>
          ))}

          <div className="row between" style={{ margin: '8px 0 0', padding: '12px 0 0', borderTop: '1px solid var(--line-soft)' }}>
            <span className="muted" style={{ fontSize: '0.85rem' }}>
              📍 {o.shipping.name}, {o.shipping.city} {o.shipping.pincode}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
