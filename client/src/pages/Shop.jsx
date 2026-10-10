import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORY_ICONS = {
  All: '🛍️', Basketry: '🧺', Pottery: '🏺', Textiles: '🧵',
  Jewellery: '💎', 'Home Decor': '🪔', Woodwork: '🪵', Paintings: '🎨', Other: '✨',
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [meta, setMeta] = useState({ categories: [] });
  const [f, setF] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || 'All',
    minPrice: '', maxPrice: '',
    sort: searchParams.get('sort') || 'newest',
    page: 1,
  });
  const [data, setData] = useState({ products: [], total: 0, pages: 1 });
  const [busy, setBusy] = useState(true);

  useEffect(() => { api.get('/products/meta').then((r) => setMeta(r.data)); }, []);

  useEffect(() => {
    setBusy(true);
    const t = setTimeout(() => {
      api.get('/products', { params: { ...f, limit: 12 } })
        .then((r) => setData(r.data))
        .finally(() => setBusy(false));
    }, 250);
    return () => clearTimeout(t);
  }, [f]);

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value, page: 1 }));
  const allCats = ['All', ...meta.categories];
  const hasFilters = f.q || f.category !== 'All' || f.minPrice || f.maxPrice;

  return (
    <div className="shop">
      {/* ── Sidebar filters ────────────────────────────────── */}
      <aside className="filters">
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', margin: 0 }}>
          Filters
        </h3>

        <label>
          Search
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>🔍</span>
            <input
              id="shop-search"
              value={f.q}
              onChange={set('q')}
              placeholder="basket, silk, brass…"
              style={{ paddingLeft: 32 }}
            />
          </div>
        </label>

        <div>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: 8 }}>Category</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {allCats.map((c) => (
              <button
                key={c}
                id={`cat-${c.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setF((prev) => ({ ...prev, category: c, page: 1 }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 11px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: f.category === c ? 'var(--indigo)' : 'transparent',
                  color: f.category === c ? '#fff' : 'var(--ink-soft)',
                  fontWeight: f.category === c ? 600 : 400,
                  fontSize: '0.88rem', textAlign: 'left', transition: 'all 0.18s', width: '100%',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{CATEGORY_ICONS[c] || '✨'}</span> {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: 8 }}>Price range (₹)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" min="0" value={f.minPrice} onChange={set('minPrice')} placeholder="Min" />
            <input type="number" min="0" value={f.maxPrice} onChange={set('maxPrice')} placeholder="Max" />
          </div>
        </div>

        <label>
          Sort by
          <select id="shop-sort" value={f.sort} onChange={set('sort')}>
            <option value="newest">✨ Newest first</option>
            <option value="popular">🔥 Most popular</option>
            <option value="price-asc">↑ Price: low → high</option>
            <option value="price-desc">↓ Price: high → low</option>
          </select>
        </label>

        {hasFilters && (
          <button
            className="btn ghost small"
            style={{ color: 'var(--madder)', borderColor: 'var(--madder)' }}
            onClick={() => setF({ q: '', category: 'All', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}
          >
            ✕ Clear all filters
          </button>
        )}
      </aside>

      {/* ── Product grid ────────────────────────────────────── */}
      <section>
        {/* Results bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--ink)' }}>
              {busy ? 'Searching…' : data.total}
            </span>
            {!busy && (
              <span className="muted" style={{ fontSize: '0.92rem', marginLeft: 6 }}>
                product{data.total !== 1 ? 's' : ''}
                {f.category !== 'All' && ` in ${f.category}`}
                {f.q && ` matching "${f.q}"`}
              </span>
            )}
          </div>
          {hasFilters && !busy && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {f.category !== 'All' && (
                <span className="tag gold">{CATEGORY_ICONS[f.category]} {f.category}</span>
              )}
              {f.q && <span className="tag">🔍 "{f.q}"</span>}
              {(f.minPrice || f.maxPrice) && (
                <span className="tag">₹{f.minPrice || '0'} – ₹{f.maxPrice || '∞'}</span>
              )}
            </div>
          )}
        </div>

        {busy ? (
          <div className="grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="thumb skeleton" style={{ aspectRatio: '1' }} />
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton" style={{ height: 16, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '60%' }} />
                  <div className="skeleton" style={{ height: 16, borderRadius: 4, width: '35%', marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid">
              {data.products.map((p, i) => <ProductCard key={p._id} p={p} index={i} />)}
            </div>
            {!data.products.length && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>Nothing matches your filters.</p>
                <button
                  className="btn ghost small"
                  onClick={() => setF({ q: '', category: 'All', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}

        {data.pages > 1 && (
          <div className="row center" style={{ marginTop: 36, gap: 8 }}>
            <button
              className="btn ghost small"
              disabled={f.page <= 1}
              onClick={() => setF((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              ← Previous
            </button>
            {[...Array(data.pages)].map((_, i) => (
              <button
                key={i}
                className={`btn small ${f.page === i + 1 ? '' : 'ghost'}`}
                style={{ minWidth: 36 }}
                onClick={() => setF((prev) => ({ ...prev, page: i + 1 }))}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn ghost small"
              disabled={f.page >= data.pages}
              onClick={() => setF((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
