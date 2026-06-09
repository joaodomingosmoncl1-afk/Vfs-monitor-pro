const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../services/email');

// Pedir código OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  const db = req.app.get('db');
  const redis = req.app.get('redis');
  
  // rate limit por IP
  const attempts = await redis.incr(`otp:${email}`);
  if (attempts > 5) return res.status(429).json({ error: 'Muitas tentativas. Aguarde.' });
  await redis.expire(`otp:${email}`, 900);
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10*60000);
  
  let user = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0) {
    const hash = await bcrypt.hash('temp', 10);
    await db.query('INSERT INTO users (id, email, password_hash, name) VALUES (gen_random_uuid(), $1, $2, $3)', [email, hash, email.split('@')[0]]);
    user = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  }
  const userId = user.rows[0].id;
  await db.query('DELETE FROM otp_codes WHERE user_id = $1', [userId]);
  await db.query('INSERT INTO otp_codes (user_id, code, expires_at) VALUES ($1, $2, $3)', [userId, code, expiresAt]);
  await sendOTPEmail(email, code);
  res.json({ message: 'Código enviado' });
});

// Verificar OTP e fazer login
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  const db = req.app.get('db');
  const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userRes.rows.length === 0) return res.status(401).json({ error: 'Email não registado' });
  const userId = userRes.rows[0].id;
  const otpRes = await db.query('SELECT * FROM otp_codes WHERE user_id = $1 AND code = $2 AND used = false AND expires_at > NOW()', [userId, code]);
  if (otpRes.rows.length === 0) return res.status(401).json({ error: 'Código inválido ou expirado' });
  await db.query('UPDATE otp_codes SET used = true WHERE id = $1', [otpRes.rows[0].id]);
  await db.query('UPDATE users SET verified = true WHERE id = $1', [userId]);
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: userId, email } });
});

module.exports = router;
