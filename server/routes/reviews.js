const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try { const db = await init(); const reviews = db.prepare('SELECT r.*, p.name as product FROM reviews r JOIN products p ON r.productId = p.id WHERE r.approved = 1 ORDER BY r.createdAt DESC LIMIT 10').all(); res.json(reviews); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const db = await init();
    const reviews = db.prepare('SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC').all(req.params.productId);
    const avg = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE productId = ?').get(req.params.productId);
    res.json({ reviews, avg: avg ? Math.round(avg.avg * 10) / 10 : 0, count: avg ? avg.count : 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { productId, userId, userName, rating, title, text } = req.body;
    if (!productId || !userName || !rating || !text) return res.status(400).json({ error: 'Missing required fields' });
    const id = uuidv4();
    const db = await init();
    db.prepare('INSERT INTO reviews (id, productId, userId, userName, rating, title, text) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, productId, userId || null, userName, rating, title || null, text);
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
