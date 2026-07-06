const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/:userId', async (req, res) => {
  try { const db = await init(); const user = db.prepare('SELECT loyaltyPoints FROM users WHERE id = ?').get(req.params.userId); if (!user) return res.status(404).json({ error: 'Not found' }); const history = db.prepare('SELECT * FROM loyalty_transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 20').all(req.params.userId); res.json({ points: user.loyaltyPoints, history }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/earn', async (req, res) => {
  try {
    const { userId, points, description } = req.body;
    if (!userId || !points) return res.status(400).json({ error: 'UserId and points required' });
    const db = await init();
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    db.prepare('UPDATE users SET loyaltyPoints = loyaltyPoints + ? WHERE id = ?').run(Math.abs(parseInt(points)), userId);
    db.prepare('INSERT INTO loyalty_transactions (id, userId, points, type, description) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId, Math.abs(parseInt(points)), 'earned', description || 'Points earned');
    res.json({ message: 'Points added' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/redeem', async (req, res) => {
  try {
    const { userId, points, description } = req.body;
    if (!userId || !points) return res.status(400).json({ error: 'UserId and points required' });
    const db = await init();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    if ((user.loyaltyPoints || 0) < Math.abs(parseInt(points))) return res.status(400).json({ error: 'Insufficient points' });
    db.prepare('UPDATE users SET loyaltyPoints = loyaltyPoints - ? WHERE id = ?').run(Math.abs(parseInt(points)), userId);
    db.prepare('INSERT INTO loyalty_transactions (id, userId, points, type, description) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId, Math.abs(parseInt(points)), 'redeemed', description || 'Points redeemed');
    res.json({ message: 'Points redeemed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
