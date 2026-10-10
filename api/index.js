/**
 * Vercel Serverless Function entry point (Root Directory = repo root)
 * Diagnostic build — surfaces the exact failure stage.
 */
let connectDB, app, loadError;
try {
  connectDB = require('../server/config/db');
  app = require('../server/server');
} catch (e) {
  loadError = e;
}

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  if (loadError) {
    return send(res, 500, {
      stage: 'require',
      message: loadError.message,
      code: loadError.code,
      stack: (loadError.stack || '').split('\n').slice(0, 5),
    });
  }
  try {
    await connectDB();
  } catch (e) {
    return send(res, 500, {
      stage: 'connectDB',
      name: e.name,
      message: e.message,
      code: e.code,
      hasMongoUri: Boolean(process.env.MONGO_URI),
    });
  }
  try {
    return app(req, res);
  } catch (e) {
    return send(res, 500, { stage: 'app', message: e.message, code: e.code });
  }
};
