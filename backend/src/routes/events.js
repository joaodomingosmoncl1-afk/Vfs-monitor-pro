const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  const db = req.app.get('db');
  const events = await db.query('SELECT * FROM events ORDER BY created_at DESC LIMIT 200');
  res.json(events.rows);
});

module.exports = router;
