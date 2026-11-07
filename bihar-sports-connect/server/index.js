import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy .env.example to .env and set it.');
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch {
    res.status(500).json({ ok: false, database: 'unreachable' });
  }
});

app.use('/api/auth', authRoutes);

const port = Number(process.env.PORT) || 5000;
app.listen(port, async () => {
  console.log(`API running on http://localhost:${port}`);
  try {
    await pool.query('SELECT 1');
    console.log('MySQL connected');
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
});
