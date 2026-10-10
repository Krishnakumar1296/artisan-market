/**
 * Vercel Serverless Function entry point
 * All /api/* and /uploads/* requests are routed here by vercel.json
 *
 * Note: env vars (MONGO_URI, JWT_SECRET, ...) are provided by Vercel.
 * dotenv is loaded inside server/server.js from server/node_modules.
 */
const connectDB = require('../server/config/db');
const app = require('../server/server');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
