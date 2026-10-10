require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ── CORS ───────────────────────────────────────────────────────────
// Allow all origins in production (Vercel assigns dynamic preview URLs)
// In local dev, restrict to the Vite dev server
app.use(cors({
  origin: isProd ? true : (process.env.CLIENT_URL || 'http://localhost:5173'),
  credentials: true,
}));

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

// ── Serve React build (Render / local production preview) ─────────
// On Vercel this block is never reached (Vercel serves static files itself)
if (isProd && process.env.VERCEL !== '1') {
  const clientBuild = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) =>
    res.sendFile(path.join(clientBuild, 'index.html'))
  );
} else if (!isProd) {
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

// ── Export for Vercel / tests ──────────────────────────────────────
module.exports = app;

// ── Start locally (not on Vercel) ─────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() =>
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
    )
  );
}
