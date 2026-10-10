require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ── CORS ───────────────────────────────────────────────────────────
// In production the client is served by the same Express process,
// so CORS is only needed in local dev (Vite dev server on a different port).
if (!isProd) {
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
}

app.use(express.json({ limit: '10mb' }));

// ── Static: uploaded product images ───────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API routes ─────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/artisans',  require('./routes/artisans'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/admin',     require('./routes/admin'));
app.get('/api/health',    (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

// ── Serve React build in production ───────────────────────────────
if (isProd) {
  const clientBuild = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuild));
  // SPA fallback — send index.html for any non-API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
} else {
  app.use((req, res) => res.status(404).json({ message: 'Not found' }));
}

// ── Global error handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.name === 'CastError' ? 400 : err.status || 500;
  res.status(status).json({
    message: err.name === 'CastError' ? 'Invalid id' : err.message || 'Something went wrong',
  });
});

// ── Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
));
