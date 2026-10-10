import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { money } from '../components/ProductCard';

const empty = { title: '', price: '', stock: 1, category: 'Other', materials: '', notes: '', keywords: '', descriptions: {} };

function ProductForm({ meta, editing, onDone }) {
  const [f, setF] = useState(editing ? { ...empty, ...editing, keywords: editing.keywords.join(', '), descriptions: editing.descriptions || {}, notes: '' } : empty);
  const [files, setFiles] = useState([]);
  const [langs, setLangs] = useState(['en']);
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggleLang = (l) => setLangs((c) => (c.includes(l) ? c.filter((x) => x !== l) : [...c, l]));

  const generate = async () => {
    setMsg({ type: '', text: '' }); setAiBusy(true);
    const fd = new FormData();
    ['title', 'materials', 'category', 'notes'].forEach((k) => fd.append(k, f[k] || ''));
    fd.append('languages', langs.join(','));
    if (files[0]) fd.append('image', files[0]);
    try {
      const { data } = await api.post('/products/ai/generate', fd);
      setF((cur) => ({ ...cur, category: data.category, keywords: data.keywords.join(', '), descriptions: { ...cur.descriptions, ...data.descriptions } }));
      setMsg({ type: 'ok', text: data.source === 'ai' ? 'Draft ready. Read it, edit anything, then save.' : 'Basic draft added. Set ANTHROPIC_API_KEY on the server for full AI writing and translation.' });
    } catch (x) { setMsg({ type: 'error', text: errMsg(x) }); } finally { setAiBusy(false); }
  };

  const save = async (e) => {
    e.preventDefault(); setMsg({ type: '', text: '' }); setBusy(true);
    const fd = new FormData();
    ['title', 'price', 'stock', 'category', 'materials'].forEach((k) => fd.append(k, f[k]));
    fd.append('keywords', JSON.stringify(f.keywords.split(',').map((k) => k.trim()).filter(Boolean)));
    fd.append('descriptions', JSON.stringify(f.descriptions));
    files.forEach((file) => fd.append('images', file));
    try {
      editing ? await api.put(`/products/${editing._id}`, fd) : await api.post('/products', fd);
      onDone();
    } catch (x) { setMsg({ type: 'error', text: errMsg(x) }); } finally { setBusy(false); }
  };

  return (
    <form className="panel" onSubmit={save}>
      <h2>{editing ? 'Edit product' : 'Add a product'}</h2>
      <div className="two">
        <label>Title<input required value={f.title} onChange={set('title')} /></label>
        <label>Price (₹)<input required type="number" min="0" value={f.price} onChange={set('price')} /></label>
        <label>Stock<input type="number" min="0" value={f.stock} onChange={set('stock')} /></label>
        <label>Category<select value={f.category} onChange={set('category')}>{meta.categories.map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      <label>Materials<input placeholder="e.g. terracotta clay, cotton thread" value={f.materials} onChange={set('materials')} /></label>
      <label>Photos (up to 5, JPG/PNG/WebP)<input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files].slice(0, 5))} /></label>
      {editing?.images?.length > 0 && <div className="row">{editing.images.map((s) => <img key={s} src={s} className="mini" alt="" />)}</div>}

      <div className="ai-box">
        <strong>Write the listing with AI</strong>
        <p className="muted">It looks at your first photo, title and materials. Add a note about how it was made for a better result.</p>
        <label>Notes (optional)<input value={f.notes} onChange={set('notes')} placeholder="e.g. dyed with turmeric, takes 3 days to weave" /></label>
        <div className="row">{Object.entries(meta.languages).map(([code, name]) => <button type="button" key={code} className={`chip ${langs.includes(code) ? 'on' : ''}`} onClick={() => toggleLang(code)}>{name}</button>)}</div>
        <button type="button" className="btn small" disabled={aiBusy || !f.title} onClick={generate}>{aiBusy ? 'Writing…' : 'Generate description and keywords'}</button>
      </div>

      {Object.entries(f.descriptions).map(([code, text]) => (
        <label key={code}>Description ({meta.languages[code] || code})
          <textarea rows="3" value={text} onChange={(e) => setF({ ...f, descriptions: { ...f.descriptions, [code]: e.target.value } })} />
        </label>
      ))}
      <label>Keywords (comma separated)<input value={f.keywords} onChange={set('keywords')} /></label>
      {msg.text && <p className={msg.type === 'error' ? 'error' : 'ok'}>{msg.text}</p>}
      <div className="row"><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button><button type="button" className="btn ghost" onClick={onDone}>Cancel</button></div>
    </form>
  );
}

function Products({ meta }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null); // null | 'new' | product
  const load = () => api.get('/products/mine/all').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const del = async (p) => { if (confirm(`Delete "${p.title}"?`)) { await api.delete(`/products/${p._id}`); load(); } };
  const toggle = async (p) => { const fd = new FormData(); fd.append('isActive', !p.isActive); await api.put(`/products/${p._id}`, fd); load(); };
  if (form) return <ProductForm meta={meta} editing={form === 'new' ? null : form} onDone={() => { setForm(null); load(); }} />;
  return (
    <>
      <button className="btn" onClick={() => setForm('new')}>Add a product</button>
      <table>
        <thead><tr><th></th><th>Product</th><th>Price</th><th>Stock</th><th>Sold</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {list.map((p) => (
            <tr key={p._id}>
              <td><div className="mini-thumb">{p.images[0] && <img src={p.images[0]} alt="" />}</div></td>
              <td>{p.title}<div className="muted">{p.category}</div></td><td>{money(p.price)}</td><td>{p.stock}</td><td>{p.sold}</td>
              <td><span className={`tag ${p.isActive ? '' : 'danger'}`}>{p.isActive ? 'Live' : 'Hidden'}</span></td>
              <td className="actions"><button className="link" onClick={() => setForm(p)}>Edit</button><button className="link" onClick={() => toggle(p)}>{p.isActive ? 'Hide' : 'Show'}</button><button className="link danger" onClick={() => del(p)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!list.length && <p className="muted">No products yet. Add your first one to start selling.</p>}
    </>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders/artisan').then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);
  const setStatus = async (o, i, status) => { await api.put(`/orders/${o._id}/items/${i._id}/status`, { status }); load(); };
  return (
    <>
      {!orders.length && <p className="muted">No orders yet.</p>}
      {orders.map((o) => (
        <div key={o._id} className="panel">
          <div className="row between"><strong>Order #{o._id.slice(-6)} · {o.customer?.name}</strong><span className="muted">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span></div>
          <p className="muted">Ship to: {o.shipping.name}, {o.shipping.address}, {o.shipping.city} {o.shipping.pincode} · {o.shipping.phone}</p>
          {o.items.map((i) => (
            <div key={i._id} className="line">
              <div className="grow">{i.title} × {i.qty} · {money(i.price * i.qty)}</div>
              {i.status === 'cancelled' ? <span className="tag danger">cancelled</span> : (
                <select value={i.status} onChange={(e) => setStatus(o, i, e.target.value)}>
                  {['placed', 'packed', 'shipped', 'delivered'].map((s) => <option key={s}>{s}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function Analytics() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get('/analytics/artisan').then((r) => setD(r.data)); }, []);
  if (!d) return <p className="muted">Loading…</p>;
  return (
    <>
      <div className="stats">
        <div><span>{money(d.totalRevenue)}</span>Revenue</div><div><span>{d.unitsSold}</span>Units sold</div>
        <div><span>{d.orderLines}</span>Order lines</div><div><span>{d.productCount}</span>Products</div>
      </div>
      <h3>Revenue by day</h3>
      {d.daily.length ? (
        <div className="chart"><ResponsiveContainer><LineChart data={d.daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(v) => money(v)} /><Line type="monotone" dataKey="revenue" stroke="#1d2a62" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
      ) : <p className="muted">Sales will appear here after your first order.</p>}
      <h3>Top products</h3>
      {d.topProducts.length > 0 && <div className="chart"><ResponsiveContainer><BarChart data={d.topProducts}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="title" /><YAxis /><Tooltip formatter={(v) => money(v)} /><Bar dataKey="revenue" fill="#d9981e" /></BarChart></ResponsiveContainer></div>}
    </>
  );
}

function Profile() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ name: user.name, craft: user.craft || '', location: user.location || '', community: user.community || '', bio: user.bio || '' });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setSaved(false); setF({ ...f, [k]: e.target.value }); };
  const save = async (e) => { e.preventDefault(); const { data } = await api.put('/auth/me', f); setUser(data.user); setSaved(true); };
  return (
    <form className="panel narrow" onSubmit={save}>
      <h2>Your public profile</h2>
      <label>Name<input value={f.name} onChange={set('name')} /></label>
      <label>Craft<input value={f.craft} onChange={set('craft')} /></label>
      <label>Location<input value={f.location} onChange={set('location')} /></label>
      <label>Community or collective<input value={f.community} onChange={set('community')} /></label>
      <label>Your story<textarea rows="5" value={f.bio} onChange={set('bio')} /></label>
      <button className="btn">Save profile</button>{saved && <p className="ok">Saved.</p>}
    </form>
  );
}

export default function ArtisanDashboard() {
  const [tab, setTab] = useState('products');
  const [meta, setMeta] = useState({ categories: [], languages: {} });
  useEffect(() => { api.get('/products/meta').then((r) => setMeta(r.data)); }, []);
  const tabs = [['products', 'Products'], ['orders', 'Orders'], ['analytics', 'Sales'], ['profile', 'Profile']];
  return (
    <>
      <h1>Artisan dashboard</h1>
      <div className="tabs">{tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === 'products' && <Products meta={meta} />}
      {tab === 'orders' && <Orders />}
      {tab === 'analytics' && <Analytics />}
      {tab === 'profile' && <Profile />}
    </>
  );
}
