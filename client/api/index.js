/**
 * Vercel Serverless Function entry point (Root Directory = client/).
 *
 * NOTE: client/package.json declares "type": "module", which would make
 * this file an ES module. client/api/package.json overrides that to
 * CommonJS so we can require the CommonJS server below.
 */
const connectDB = require('../../server/config/db');
const app = require('../../server/server');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
