import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { money, desc } from '../components/ProductCard';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
  'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=600&q=80',
];

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const [p, setP] = useState(null);
  const [meta, setMeta] = useState({ languages: {} });
  const [lang, setLang] = useState('en');
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setP(r.data)).catch(() => setP(false));
    api.get('/products/meta').then((r) => setMeta(r.data));
  }, [id]);

  if (p === null) return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 16 }}>
      <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
        {[200, 100, 160, 80, 120].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: i === 0 ? 36 : 16, width: w, borderRadius: 8 }} />
        ))}
      </div>
    </div>
  );

  if (p === false) return (
    <div className="empty-state">
      <div className="empty-icon">😕</div>
      <p>This product could not be found.</p>
      <Link to="/shop" className="btn">Back to shop</Link>
    </div>
  );

  const available = Object.keys(p.descriptions || {});
  const canBuy = (!user || user.role === 'customer') && p.stock > 0;
  const imgSrc = p.images[img] || FALLBACK_IMAGES[img % FALLBACK_IMAGES.length];

  return (
    <div className="detail fade-up">
      {/* ── Images ─────────────────────────────────────── */}
      <div>
        <div className="big-img">
          <img
            src={imgSrc}
            alt={p.title}
            onError={(e) => { e.target.src = FALLBACK_IMAGES[0]; }}
          />
        </div>
        {p.images.length > 1 && (
          <div className="row" style={{ marginTop: 12, gap: 8 }}>
            {p.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`mini ${i === img ? 'on' : ''}`}
                onClick={() => setImg(i)}
                onError={(e) => { e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]; }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Info ───────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ marginBottom: 8 }}>
          <span className="tag">{p.category}</span>
        </div>
        <h1 style={{ marginBottom: 4 }}>{p.title}</h1>
        <p className="price">{money(p.price)}</p>

        <p style={{ margin: '4px 0 16px', color: 'var(--muted)' }}>
          Made by{' '}
          <Link to={`/artisans/${p.artisan._id}`} style={{ fontWeight: 600 }}>
            {p.artisan.name}
          </Link>
          {p.artisan.location && ` · ${p.artisan.location}`}
        </p>

        {available.length > 1 && (
          <div className="row" style={{ margin: '0 0 12px' }}>
            {available.map((l) => (
              <button key={l} className={`chip ${lang === l ? 'on' : ''}`} onClick={() => setLang(l)}>
                {meta.languages[l] || l}
              </button>
            ))}
          </div>
        )}

        <p className="desc" style={{ margin: '0 0 20px' }}>{desc(p, lang)}</p>

        <dl style={{ marginBottom: 20 }}>
          <dt>Category</dt><dd>{p.category}</dd>
          {p.materials && <><dt>Materials</dt><dd>{p.materials}</dd></>}
          <dt>Availability</dt>
          <dd>
            {p.stock > 0
              ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ {p.stock} in stock</span>
              : <span style={{ color: 'var(--madder)', fontWeight: 600 }}>Sold out</span>
            }
          </dd>
        </dl>

        {p.keywords.length > 0 && (
          <div className="row" style={{ margin: '0 0 20px', gap: 6 }}>
            {p.keywords.map((k) => <span key={k} className="tag">#{k}</span>)}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {canBuy && (
            <button className="btn gold" onClick={() => { add(p); setAdded(true); }}>
              {added ? '✓ Added — add another' : '🛒 Add to cart'}
            </button>
          )}
          {added && (
            <Link to="/cart" className="btn ghost">View cart & checkout →</Link>
          )}
          {p.stock === 0 && (
            <div style={{ padding: '12px 16px', background: 'var(--madder-pale)', borderRadius: 8, color: 'var(--madder)', fontWeight: 500, fontSize: '0.9rem' }}>
              This item is currently out of stock.
            </div>
          )}
        </div>

        {/* Artisan mini-card */}
        <div style={{
          marginTop: 28, padding: '16px', background: 'var(--paper-warm)',
          border: '1px solid var(--line)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--turmeric), var(--turmeric-light))',
            display: 'grid', placeItems: 'center',
            font: '700 1.1rem Bricolage Grotesque, sans-serif', color: 'var(--ink)'
          }}>
            {p.artisan.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.artisan.name}</div>
            {p.artisan.craft && <div className="muted" style={{ fontSize: '0.82rem' }}>{p.artisan.craft}</div>}
          </div>
          <Link to={`/artisans/${p.artisan._id}`} className="btn ghost small">View profile</Link>
        </div>
      </div>
    </div>
  );
}
