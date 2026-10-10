/**
 * Vercel Serverless Function entry point (Root Directory = repo root).
 *
 * Used when the Vercel project's Root Directory is the repository root.
 * Env vars (MONGO_URI, JWT_SECRET, ...) are provided by Vercel;
 * dotenv is loaded inside server/server.js from server/node_modules.
 */
const connectDB = require('../server/config/db');
const app = require('../server/server');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
