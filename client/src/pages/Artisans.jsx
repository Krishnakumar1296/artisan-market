import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CRAFT_EMOJIS = {
  'Basketry': '🧺', 'Palm-leaf basketry': '🧺',
  'Pottery': '🏺', 'Textiles': '🧵', 'Weaving': '🧵', 'Handloom': '🧵',
  'Jewellery': '💎', 'Woodwork': '🪵', 'Paintings': '🎨', 'Metalwork': '⚒️',
};

export default function Artisans() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/artisans').then((r) => setList(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <h1>Meet the makers</h1>
        <p className="muted" style={{ maxWidth: '60ch', fontSize: '1.05rem' }}>
          Every product on Kaivinai is made by hand by an individual artisan or a community collective.
          Browse their profiles and see the craft traditions they carry forward.
        </p>
      </div>

      {loading ? (
        <div className="grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="artisan-card">
              <div className="skeleton" style={{ height: 80 }} />
              <div className="card-body" style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton" style={{ height: 18, width: '60%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 13, width: '80%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 13, width: '70%', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid fade-up">
          {list.map((a) => {
            const emoji = CRAFT_EMOJIS[a.craft] || '✨';
            const initial = a.name?.[0]?.toUpperCase() || '?';
            return (
              <Link key={a._id} to={`/artisans/${a._id}`} className="artisan-card">
                <div className="artisan-card-header" />
                <div className="artisan-avatar">{initial}</div>
                <div className="artisan-card-body">
                  <h3 style={{ marginBottom: 2 }}>{a.name}</h3>
                  <p className="muted" style={{ fontSize: '0.85rem', margin: '0 0 8px' }}>
                    {emoji} {[a.craft, a.location].filter(Boolean).join(' · ')}
                  </p>
                  {a.bio && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: '0 0 12px', lineHeight: 1.55 }}>
                      {a.bio.slice(0, 100)}{a.bio.length > 100 ? '…' : ''}
                    </p>
                  )}
                  <div className="row" style={{ margin: 0, gap: 6 }}>
                    <span className="tag">
                      {a.productCount} product{a.productCount === 1 ? '' : 's'}
                    </span>
                    {a.community && <span className="tag gold">{a.community}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && !list.length && (
        <div className="empty-state">
          <div className="empty-icon">👩‍🎨</div>
          <p>No artisans have joined yet.</p>
          <Link to="/register" className="btn">Become a maker</Link>
        </div>
      )}
    </>
  );
}
