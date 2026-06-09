const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Obter perfil do utilizador
router.get('/profile', verifyToken, async (req, res) => {
  const db = req.app.get('db');
  
  const result = await db.query(
    'SELECT id, email, name, verified, created_at FROM users WHERE id = $1',
    [req.userId]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Utilizador não encontrado' });
  }
  
  res.json(result.rows[0]);
});

// Atualizar perfil
router.put('/profile', verifyToken, async (req, res) => {
  const db = req.app.get('db');
  const { name } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  
  const result = await db.query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, verified, created_at',
    [name.trim(), req.userId]
  );
  
  res.json(result.rows[0]);
});

// Preferências de notificação
router.put('/notifications', verifyToken, async (req, res) => {
  const db = req.app.get('db');
  const { email_alerts, push_alerts } = req.body;
  
  const result = await db.query(
    `UPDATE users SET email_alerts = $1, push_alerts = $2 
     WHERE id = $3 
     RETURNING id, email_alerts, push_alerts`,
    [email_alerts, push_alerts, req.userId]
  );
  
  res.json(result.rows[0]);
});

module.exports = router;
