// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status  = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[${status}] ${req.method} ${req.path} — ${message}`);
  res.status(status).json({ success: false, message });
};
