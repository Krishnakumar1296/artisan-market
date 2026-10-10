import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { label: 'Basketry',   icon: '🧺', img: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=300&q=80' },
  { label: 'Pottery',    icon: '🏺', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&q=80' },
  { label: 'Textiles',   icon: '🧵', img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&q=80' },
  { label: 'Jewellery',  icon: '💎', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80' },
  { label: 'Woodwork',   icon: '🪵', img: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=300&q=80' },
  { label: 'Paintings',  icon: '🎨', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&q=80' },
  { label: 'Home Decor', icon: '🪔', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80' },
];

const FEATURES = [
  { icon: '🤝', title: 'Direct from makers', body: 'Every purchase goes straight to the artisan — no middlemen, no factories, no compromise.' },
  { icon: '🌍', title: 'Rooted in communities', body: 'We partner with village self-help groups and craft collectives across all 28 states of India.' },
  { icon: '🤖', title: 'AI-powered listings', body: 'Our AI writes product descriptions in 8 languages so every maker can list and sell with ease.' },
  { icon: '✅', title: 'Authentic & traceable', body: 'See exactly who made your item, where they live, and the craft tradition behind every piece.' },
];

const ARTISAN_SPOTLIGHTS = [
  {
    name: 'Meena Devi',
    craft: 'Palm-leaf basketry · Erode, TN',
    quote: '"I learned to weave from my mother. Now my daughter is learning from me. Kaivinai helped us reach customers all over India."',
    img: '/artisan_weaving.jpg',
    color: '#1d2a62',
  },
  {
    name: 'Kavitha Raj',
    craft: 'Brass metalwork · Thanjavur, TN',
    quote: '"The lost-wax technique I use is 4,000 years old. With Kaivinai, it will survive another 4,000 more."',
    img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&q=80',
    color: '#7c3d0c',
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products', { params: { limit: 8, sort: 'popular' } })
      .then((r) => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero-section fade-up">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">✨ India's artisan marketplace</div>
          <h1>Buy handmade, directly from the person who made it.</h1>
          <p>
            Kaivinai connects village and community artisans with customers across India.
            Makers upload a photo; AI writes the listing in their language.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn gold" id="hero-shop-btn">Browse the shop →</Link>
            <Link to="/register" className="btn" style={{
              background: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
            }}>
              Sell your craft
            </Link>
          </div>
          <div className="hero-stats">
            <div><span className="hero-stat-num">7</span><span className="hero-stat-label">Artisans</span></div>
            <div><span className="hero-stat-num">27+</span><span className="hero-stat-label">Products</span></div>
            <div><span className="hero-stat-num">8</span><span className="hero-stat-label">Languages</span></div>
            <div><span className="hero-stat-num">18</span><span className="hero-stat-label">States</span></div>
          </div>
        </div>
      </section>

      {/* ── Categories with photos ─────────────────────────────────── */}
      <div className="section-header fade-up-2" style={{ marginTop: 48 }}>
        <h2>Shop by craft</h2>
        <Link to="/shop" className="link" style={{ fontSize: '0.92rem' }}>All categories →</Link>
      </div>
      <div className="cat-photo-grid" style={
        {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 14,
          marginBottom: 48,
        }
      } >
        {CATEGORIES.map((c) => (
          <Link
            key={c.label}
            to={`/shop?category=${encodeURIComponent(c.label)}`}
            style={{
              borderRadius: 14,
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '1',
              display: 'block',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="cat-photo-card"
          >
            <img
              src={c.img}
              alt={c.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
              onError={(e) => { e.target.style.background = '#e8e4f0'; e.target.style.display = 'none'; }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%)',
            }} />
            <div style={{
              position: 'absolute', bottom: 10, left: 10, right: 10,
              color: '#fff',
            }}>
              <div style={{ fontSize: '1.2rem', lineHeight: 1 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: 3, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Popular products ──────────────────────────────────────── */}
      <div className="section-header fade-up-3">
        <h2>Popular right now 🔥</h2>
        <Link to="/shop?sort=popular" className="btn ghost small">See all</Link>
      </div>

      {loading ? (
        <div className="grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card">
              <div className="thumb skeleton" style={{ aspectRatio: '1' }} />
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton" style={{ height: 16, borderRadius: 4, width: '75%' }} />
                <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '55%' }} />
                <div className="skeleton" style={{ height: 16, borderRadius: 4, width: '38%', marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid fade-up-3">
            {products.map((p, i) => <ProductCard key={p._id} p={p} index={i} />)}
          </div>
          {!products.length && (
            <div className="empty-state">
              <div className="empty-icon">🧺</div>
              <p>No products yet. Artisans can add the first one after joining.</p>
              <Link to="/register" className="btn">Become a maker</Link>
            </div>
          )}
          {products.length > 0 && (
            <div className="row center" style={{ marginTop: 28 }}>
              <Link to="/shop" className="btn ghost">View all products →</Link>
            </div>
          )}
        </>
      )}

      {/* ── Artisan spotlights ────────────────────────────────────── */}
      <h2 style={{ marginTop: 60 }}>Meet the makers</h2>
      <div className="artisan-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 12 }}>
        {ARTISAN_SPOTLIGHTS.map((a) => (
          <div key={a.name} style={{
            borderRadius: 18,
            overflow: 'hidden',
            background: a.color,
            display: 'grid',
            gridTemplateColumns: '1fr 140px',
            minHeight: 220,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.92rem', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 16px' }}>
                  {a.quote}
                </p>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1rem' }}>{a.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{a.craft}</div>
              </div>
            </div>
            <div className="artisan-spotlight-img" style={{
              background: `url('${a.img}') center/cover`,
              minHeight: 180,
            }} />
          </div>
        ))}
      </div>
      <div className="row center" style={{ marginTop: 20, marginBottom: 48 }}>
        <Link to="/artisans" className="btn">Meet all 7 makers →</Link>
      </div>

      {/* ── Why Kaivinai ──────────────────────────────────────────── */}
      <div style={{
        background: 'var(--paper-warm)',
        border: '1px solid var(--line)',
        borderRadius: 20,
        padding: '48px 40px',
        margin: '0 0 40px',
      }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 8px' }}>Why Kaivinai?</h2>
        <p className="muted" style={{ textAlign: 'center', margin: '0 0 36px' }}>
          Not just a shop — a movement to preserve India's craft heritage
        </p>
        <div className="features-grid" style={{ margin: 0 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card" style={{ background: '#fff' }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 style={{ marginBottom: 6 }}>{f.title}</h3>
              <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA banner ────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        borderRadius: 20,
        padding: '40px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-gold)',
        marginBottom: 8,
      }}>
        <div>
          <h2 style={{ color: '#1b1e2e', margin: '0 0 6px', fontSize: 'clamp(1.3rem, 3vw, 1.7rem)' }}>
            Are you an artisan? 🎨
          </h2>
          <p style={{ color: 'rgba(27,30,46,0.75)', margin: 0, maxWidth: '50ch' }}>
            Join 7+ makers already selling on Kaivinai. List your products for free — our AI writes the description in multiple languages.
          </p>
        </div>
        <Link to="/register" className="btn" style={{
          background: 'var(--indigo)',
          borderColor: 'var(--indigo)',
          flexShrink: 0,
        }}>
          Start selling for free →
        </Link>
      </div>
    </>
  );
}
