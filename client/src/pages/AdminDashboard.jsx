import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import { money } from '../components/ProductCard';

const COLORS = ['#1d2a62', '#d9981e', '#b8442f', '#2f7d6d', '#6a4c93', '#8a8f98'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const load = () => {
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/users').then((r) => setUsers(r.data));
    api.get('/admin/products').then((r) => setProducts(r.data));
    api.get('/admin/orders').then((r) => setOrders(r.data));
  };
  useEffect(load, []);
  const block = async (u) => { await api.put(`/admin/users/${u._id}/block`); load(); };
  const toggle = async (p) => { await api.put(`/admin/products/${p._id}/toggle`); load(); };
  const del = async (p) => { if (confirm(`Delete "${p.title}" permanently?`)) { await api.delete(`/products/${p._id}`); load(); } };

  return (
    <>
      <h1>Admin dashboard</h1>
      <div className="tabs">{['overview', 'users', 'products', 'orders'].map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>

      {tab === 'overview' && stats && (
        <>
          <div className="stats">
            <div><span>{stats.customers}</span>Customers</div><div><span>{stats.artisans}</span>Artisans</div>
            <div><span>{stats.products}</span>Products</div><div><span>{stats.orders}</span>Orders</div>
            <div><span>{money(stats.revenue)}</span>Revenue</div>
          </div>
          <h3>Products by category</h3>
          <div className="chart"><ResponsiveContainer><PieChart><Pie data={stats.byCategory} dataKey="count" nameKey="category" outerRadius={90} label>{stats.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
        </>
      )}

      {tab === 'users' && (
        <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
              <td><button className={`link ${u.isBlocked ? '' : 'danger'}`} onClick={() => block(u)}>{u.isBlocked ? 'Unblock' : 'Block'}</button></td></tr>
          ))}</tbody></table>
      )}

      {tab === 'products' && (
        <table><thead><tr><th>Product</th><th>Artisan</th><th>Price</th><th>Status</th><th></th></tr></thead>
          <tbody>{products.map((p) => (
            <tr key={p._id}><td>{p.title}</td><td>{p.artisan?.name}</td><td>{money(p.price)}</td><td>{p.isActive ? 'Live' : 'Hidden'}</td>
              <td className="actions"><button className="link" onClick={() => toggle(p)}>{p.isActive ? 'Hide' : 'Show'}</button><button className="link danger" onClick={() => del(p)}>Delete</button></td></tr>
          ))}</tbody></table>
      )}

      {tab === 'orders' && (
        <table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th></tr></thead>
          <tbody>{orders.map((o) => (
            <tr key={o._id}><td>#{o._id.slice(-6)}</td><td>{o.customer?.name}</td><td>{o.items.length}</td><td>{money(o.total)}</td><td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td></tr>
          ))}</tbody></table>
      )}
    </>
  );
}
