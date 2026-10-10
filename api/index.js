/**
 * Vercel Serverless Function entry point
 * All /api/* and /uploads/* requests are routed here by vercel.json
 */
const path = require('path');

// Load .env when running locally via `vercel dev`
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');
const app = require('../server/server');

// Cache the DB connection across warm Vercel invocations
let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  // Delegate to the Express app
  return app(req, res);
};
