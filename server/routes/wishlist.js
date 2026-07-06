const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/:userId', async (req, res) => {
  try {
    const db = await init();
    const items = db.prepare(`
      SELECT w.id as wid, w.productId, w.createdAt, p.*
      FROM wishlist w JOIN products p ON w.productId = p.id
      WHERE w.userId = ? ORDER BY w.createdAt DESC
    `).all(req.params.userId);
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'Missing userId or productId' });
    const db = await init();
    const existing = db.prepare('SELECT id FROM wishlist WHERE userId = ? AND productId = ?').get(userId, productId);
    if (existing) return res.json({ message: 'Already in wishlist' });
    const id = uuidv4();
    db.prepare('INSERT INTO wishlist (id, userId, productId) VALUES (?, ?, ?)').run(id, userId, productId);
    res.status(201).json({ id, productId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const db = await init();
    db.prepare('DELETE FROM wishlist WHERE userId = ? AND productId = ?').run(userId, productId);
    res.json({ message: 'Removed from wishlist' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
