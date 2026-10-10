import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function ArtisanProfile() {
  const { id } = useParams();
  const [d, setD] = useState(null);

  useEffect(() => {
    api.get(`/artisans/${id}`).then((r) => setD(r.data)).catch(() => setD(false));
  }, [id]);

  if (d === null) return (
    <div>
      <div className="skeleton" style={{ height: 180, borderRadius: 16, marginBottom: 24 }} />
      <div className="grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="thumb skeleton" style={{ aspectRatio: '1' }} />
            <div className="card-body">
              <div className="skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (d === false) return (
    <div className="empty-state">
      <div className="empty-icon">😕</div>
      <p>Artisan not found.</p>
      <Link to="/artisans" className="btn">Back to makers</Link>
    </div>
  );

  const { artisan: a, products } = d;
  const initial = a.name?.[0]?.toUpperCase() || '?';

  return (
    <>
      <section className="profile fade-up">
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--turmeric), var(--turmeric-light))',
            display: 'grid', placeItems: 'center',
            font: '700 2rem Bricolage Grotesque, sans-serif', color: 'var(--ink)',
            border: '3px solid rgba(255,255,255,0.3)'
          }}>
            {initial}
          </div>
          <div style={{ flex: 1 }}>
            <h1>{a.name}</h1>
            <p className="muted" style={{ fontSize: '1rem', margin: '4px 0 12px' }}>
              {[a.craft, a.location, a.community].filter(Boolean).join(' · ')}
            </p>
            <p className="desc" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '64ch' }}>
              {a.bio || 'This maker has not added a story yet.'}
            </p>
          </div>
        </div>
      </section>

      <div className="section-header fade-up-2" style={{ marginTop: 32 }}>
        <h2>Portfolio</h2>
        <span className="tag">{products.length} product{products.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid fade-up-2">
        {products.map((p, i) => <ProductCard key={p._id} p={{ ...p, artisan: a }} index={i} />)}
      </div>

      {!products.length && (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <p>No products listed yet.</p>
        </div>
      )}
    </>
  );
}
