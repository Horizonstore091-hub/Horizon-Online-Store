const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const { userId, userName, action, details } = req.body;
    if (!action) return res.status(400).json({ error: 'Action is required' });
    const db = await init();
    const id = uuidv4();
    db.prepare('INSERT INTO activity_logs (id, userId, userName, action, details) VALUES (?, ?, ?, ?, ?)').run(id, userId || null, userName || '', action, details || '');
    res.status(201).json({ message: 'Activity logged', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const db = await init();
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const logs = db.prepare('SELECT * FROM activity_logs ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM activity_logs').get().count;
    res.json({ logs, total, limit, offset });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
