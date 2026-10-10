import { Link } from 'react-router-dom';

export const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
export const desc = (p, lang = 'en') =>
  p.descriptions?.[lang] || p.descriptions?.en || Object.values(p.descriptions || {})[0] || '';

// Curated category-matched Unsplash fallbacks
const CATEGORY_FALLBACKS = {
  Basketry:   'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=500&q=80',
  Pottery:    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80',
  Textiles:   'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80',
  Jewellery:  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
  Woodwork:   'https://images.unsplash.com/photo-1558882224-dda166733046?w=500&q=80',
  Paintings:  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80',
  'Home Decor':'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
  Other:      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80',
};

const FALLBACKS = [
  'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=500&q=80',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80',
  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
  'https://images.unsplash.com/photo-1558882224-dda166733046?w=500&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80',
];

export default function ProductCard({ p, index = 0 }) {
  const fallback = CATEGORY_FALLBACKS[p.category] || FALLBACKS[index % FALLBACKS.length];
  const imgSrc = p.images?.[0] || fallback;

  return (
    <Link to={`/product/${p._id}`} className="card product" id={`product-${p._id}`}>
      <div className="thumb">
        <img
          src={imgSrc}
          alt={p.title}
          loading="lazy"
          onError={(e) => { if (e.target.src !== fallback) e.target.src = fallback; }}
        />
        {p.sold > 10 && p.stock > 0 && <div className="thumb-badge gold">🔥 Popular</div>}
        {p.stock === 0 && <div className="thumb-badge">Sold out</div>}
        {p.stock > 0 && p.stock <= 3 && <div className="thumb-badge" style={{ background: 'rgba(185,28,28,0.85)' }}>Only {p.stock} left!</div>}
      </div>
      <div className="card-body">
        <h3 style={{ marginBottom: 4, fontSize: '0.97rem', lineHeight: 1.35, color: 'var(--ink)' }}>{p.title}</h3>
        <p className="muted" style={{ fontSize: '0.82rem', margin: '0 0 10px' }}>
          {p.artisan?.name}
          {p.artisan?.location ? <> · <span style={{ color: 'var(--muted-light)' }}>{p.artisan.location.split(',')[0]}</span></> : ''}
        </p>
        <div className="row between" style={{ margin: 0, alignItems: 'center' }}>
          <strong style={{ fontSize: '1.05rem', color: 'var(--indigo)' }}>{money(p.price)}</strong>
          <span className="tag" style={{ fontSize: '0.75rem' }}>{p.category}</span>
        </div>
      </div>
    </Link>
  );
}
