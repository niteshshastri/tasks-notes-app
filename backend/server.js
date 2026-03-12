const express = require('express');
const cors    = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/:taskId/notes', noteRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
