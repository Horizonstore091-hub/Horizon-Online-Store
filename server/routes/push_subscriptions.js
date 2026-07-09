const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Save push subscription
router.post('/', async (req, res) => {
  try {
    const { userId, endpoint, p256dh, auth } = req.body;
    if (!userId || !endpoint) return res.status(400).json({ error: 'userId and endpoint required' });
    const db = await init();
    const id = uuidv4();
    db.prepare('INSERT INTO push_subscriptions (id, userId, endpoint, p256dh, auth) VALUES (?, ?, ?, ?, ?)').run(id, userId, endpoint, p256dh || null, auth || null);
    res.status(201).json({ message: 'Subscribed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Remove subscription
router.delete('/:endpoint', async (req, res) => {
  try {
    const db = await init();
    db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(req.params.endpoint);
    res.json({ message: 'Unsubscribed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
