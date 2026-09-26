import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';
import resumeRoutes from './routes/resume.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/resume', resumeRoutes);

// Central error handler — catches anything thrown/rejected in routes above
// so the server never crashes silently and always returns JSON, not HTML.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
