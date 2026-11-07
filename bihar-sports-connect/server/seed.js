// Creates one demo account per role so you can test login.
// Run once after creating the database:  npm run seed
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const demo = [
  { name: 'Demo Athlete',      email: 'athlete@demo.com', password: 'Athlete@123', role: 'athlete' },
  { name: 'Demo Organization', email: 'org@demo.com',     password: 'Org@12345',   role: 'organization' },
  { name: 'Platform Admin',    email: 'admin@demo.com',   password: 'Admin@123',   role: 'admin' },
];

for (const u of demo) {
  const hash = await bcrypt.hash(u.password, 10);
  await pool.execute(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role)`,
    [u.name, u.email, hash, u.role]
  );
  console.log(`Seeded ${u.role}: ${u.email} / ${u.password}`);
}
await pool.end();
