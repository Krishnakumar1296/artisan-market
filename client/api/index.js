/**
 * Vercel Serverless Function entry point (Root Directory = client/)
 *
 * This file lives at client/api/index.js, so it is detected as the
 * serverless function when Vercel's Root Directory is set to `client`.
 * Paths are relative to this file: ../../server points to the repo's server/.
 *
 * Env vars (MONGO_URI, JWT_SECRET, ...) come from Vercel.
 * dotenv is loaded inside server/server.js from server/node_modules.
 */
const connectDB = require('../../server/config/db');
const app = require('../../server/server');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
