const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/confidence', authMiddleware, async (req, res) => {
  const db = req.app.get('db');
  const result = await db.query(`
    SELECT 
      (COUNT(*) FILTER (WHERE status='available') * 1.0 / NULLIF(COUNT(*), 0)) as confidence
    FROM events WHERE created_at > NOW() - INTERVAL '48 hours'
  `);
  const confidence = result.rows[0]?.confidence || 0.3;
  res.json({ confidence });
});

router.get('/hourly', authMiddleware, async (req, res) => {
  const db = req.app.get('db');
  const days = req.query.days || 7;
  const data = await db.query(`
    SELECT DATE_TRUNC('hour', created_at) as hour, route, COUNT(*) as total, 
           COUNT(*) FILTER (WHERE status='available') as available
    FROM events WHERE created_at > NOW() - INTERVAL '${parseInt(days)} days'
    GROUP BY hour, route ORDER BY hour DESC
  `);
  res.json(data.rows);
});

module.exports = router;
