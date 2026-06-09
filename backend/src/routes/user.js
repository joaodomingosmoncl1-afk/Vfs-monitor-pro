const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/preferences', authMiddleware, async (req, res) => {
  const db = req.app.get('db');
  const userId = req.userId;
  const pref = await db.query('SELECT waitlist_route FROM user_preferences WHERE user_id = $1', [userId]);
  res.json({ waitlist_route: pref.rows[0]?.waitlist_route || 'both' });
});

router.post('/preferences', authMiddleware, async (req, res) => {
  const { waitlist_route } = req.body;
  const db = req.app.get('db');
  const userId = req.userId;
  await db.query(`
    INSERT INTO user_preferences (user_id, waitlist_route) VALUES ($1, $2)
    ON CONFLICT (user_id) DO UPDATE SET waitlist_route = $2
  `, [userId, waitlist_route]);
  res.json({ success: true });
});

module.exports = router;
