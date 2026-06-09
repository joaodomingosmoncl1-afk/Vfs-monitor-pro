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

// Listar eventos do utilizador
router.get('/', verifyToken, async (req, res) => {
  const db = req.app.get('db');
  const { route, status, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM events WHERE user_id = $1';
  let params = [req.userId];
  
  if (route) {
    query += ' AND route = $' + (params.length + 1);
    params.push(route);
  }
  
  if (status) {
    query += ' AND status = $' + (params.length + 1);
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(parseInt(limit), parseInt(offset));
  
  const result = await db.query(query, params);
  res.json(result.rows);
});

// Estatísticas de eventos
router.get('/stats', verifyToken, async (req, res) => {
  const db = req.app.get('db');
  const { route } = req.query;
  
  let query = 'SELECT status, COUNT(*) as count FROM events WHERE user_id = $1';
  let params = [req.userId];
  
  if (route) {
    query += ' AND route = $' + (params.length + 1);
    params.push(route);
  }
  
  query += ' GROUP BY status';
  
  const result = await db.query(query, params);
  res.json(result.rows);
});

module.exports = router;
