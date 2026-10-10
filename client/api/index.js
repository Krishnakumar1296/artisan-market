/**
 * Vercel Serverless Function — runs from client/ root
 * All /api/* and /uploads/* requests are routed here by vercel.json
 * 
 * Paths are relative to this file: client/api/index.js
 * → ../../server/  points to the repo's server/ folder
 */
const path = require('path');

// Load .env when using `vercel dev` locally
require('dotenv').config({ path: path.join(__dirname, '../../server/.env') });

const connectDB = require('../../server/config/db');
const app      = require('../../server/server');

// Cache the DB connection across warm Vercel invocations
let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  return app(req, res);
};
