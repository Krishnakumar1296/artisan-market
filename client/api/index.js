/**
 * Vercel Serverless Function entry point (Root Directory = client/)
 * Diagnostic build — surfaces the exact failure stage.
 */
let connectDB, app, loadError;
try {
  connectDB = require('../../server/config/db');
  app = require('../../server/server');
} catch (e) {
  loadError = e;
}

module.exports = async (req, res) => {
  const meta = { stage: null, message: null, code: null, hasMongoUri: Boolean(process.env.MONGO_URI) };
  try {
    if (loadError) {
      meta.stage = 'require';
      meta.message = loadError.message;
      meta.code = loadError.code;
      return res.status(500).json(meta);
    }
    meta.stage = 'connectDB';
    await connectDB();
    meta.stage = 'app';
    return app(req, res);
  } catch (err) {
    meta.stage = meta.stage || 'unknown';
    meta.message = err && err.message;
    meta.code = err && err.code;
    meta.name = err && err.name;
    return res.status(500).json(meta);
  }
};
