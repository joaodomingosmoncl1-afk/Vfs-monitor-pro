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

// Obter estatísticas gerais
router.get('/', verifyToken, async (req, res) => {
  const db = req.app.get('db');
  const redis = req.app.get('redis');
  
  // Tentar obter do cache
  const cached = await redis.get(`stats:${req.userId}`);
  if (cached) return res.json(JSON.parse(cached));
  
  // Estatísticas do último mês
  const stats = await db.query(
    `SELECT 
      COUNT(*) as total_events,
      SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_slots,
      SUM(CASE WHEN status = 'unavailable' THEN 1 ELSE 0 END) as unavailable,
      MAX(created_at) as last_check
    FROM events 
    WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'`,
    [req.userId]
  );
  
  const result = stats.rows[0];
  
  // Cache por 5 minutos
  await redis.setEx(`stats:${req.userId}`, 300, JSON.stringify(result));
  
  res.json(result);
});

// Estatísticas por rota
router.get('/by-route', verifyToken, async (req, res) => {
  const db = req.app.get('db');
  
  const result = await db.query(
    `SELECT 
      route,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
      MAX(created_at) as last_check
    FROM events 
    WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'
    GROUP BY route
    ORDER BY last_check DESC`,
    [req.userId]
  );
  
  res.json(result.rows);
});

module.exports = router;
