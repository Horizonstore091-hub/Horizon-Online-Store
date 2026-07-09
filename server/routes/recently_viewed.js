const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Track a view
router.post('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'userId and productId required' });
    const db = await init();
    // Remove old entry for same product
    db.prepare('DELETE FROM recently_viewed WHERE userId = ? AND productId = ?').run(userId, productId);
    // Keep only last 20
    const count = db.prepare('SELECT COUNT(*) as cnt FROM recently_viewed WHERE userId = ?').get(userId).cnt;
    if (count >= 20) {
      const oldest = db.prepare('SELECT id FROM recently_viewed WHERE userId = ? ORDER BY viewedAt ASC LIMIT 1').get(userId);
      if (oldest) db.prepare('DELETE FROM recently_viewed WHERE id = ?').run(oldest.id);
    }
    db.prepare('INSERT INTO recently_viewed (id, userId, productId) VALUES (?, ?, ?)').run(uuidv4(), userId, productId);
    res.status(201).json({ message: 'Tracked' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get recently viewed for user
router.get('/:userId', async (req, res) => {
  try {
    const db = await init();
    const views = db.prepare(`
      SELECT rv.*, p.id as productId, p.name, p.price, p.image, p.featured as slug
      FROM recently_viewed rv
      JOIN products p ON rv.productId = p.id
      WHERE rv.userId = ?
      ORDER BY rv.viewedAt DESC
      LIMIT 12
    `).all(req.params.userId);
    res.json(views);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
