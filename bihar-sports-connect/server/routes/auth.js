import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const ROLES = ['athlete', 'organization', 'admin'];

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
};

// Used so a wrong email takes as long to reject as a wrong password.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again in a few minutes.' },
});

router.post('/login', loginLimiter, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const role = String(req.body?.role || '');

  if (!email || !password || !ROLES.includes(role)) {
    return res.status(400).json({ error: 'Enter your email and password.' });
  }

  try {
    // Parameterised query: input is never concatenated into SQL.
    const [rows] = await pool.execute(
      'SELECT user_id, name, email, password_hash, role, account_status FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const user = rows[0];
    const passwordOk = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

    // One message for every failure so the form never reveals which accounts exist.
    if (!user || !passwordOk || user.role !== role) {
      return res.status(401).json({ error: 'Email, password or role is incorrect.' });
    }
    if (user.account_status !== 'active') {
      return res.status(403).json({ error: 'This account is suspended. Contact the administrator.' });
    }

    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });
    res.cookie('token', token, cookieOptions);
    res.json({ user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Something went wrong on our side. Try again.' });
  }
});

router.get('/me', requireAuth(), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, name, email, role, account_status FROM users WHERE user_id = ? LIMIT 1',
      [req.user.id]
    );
    const u = rows[0];
    if (!u || u.account_status !== 'active') {
      res.clearCookie('token');
      return res.status(401).json({ error: 'Please sign in.' });
    }
    res.json({ user: { id: u.user_id, name: u.name, email: u.email, role: u.role } });
  } catch (err) {
    console.error('Me error:', err.message);
    res.status(500).json({ error: 'Something went wrong on our side. Try again.' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

export default router;
