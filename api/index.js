/**
 * TEMPORARY isolation test — no requires at all (root entry).
 */
module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, marker: 'root-minimal-v1', path: req.url }));
};
