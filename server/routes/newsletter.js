const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name, source } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const db = await init();
    const existing = db.prepare('SELECT * FROM newsletter_subscribers WHERE email = ?').get(email);
    if (existing) {
      if (!existing.subscribed) db.prepare('UPDATE newsletter_subscribers SET subscribed = 1, name = COALESCE(?, name) WHERE id = ?').run(name || null, existing.id);
      return res.json({ message: 'Already subscribed' });
    }
    const id = uuidv4();
    db.prepare('INSERT INTO newsletter_subscribers (id, email, name, source) VALUES (?, ?, ?, ?)').run(id, email, name || null, source || 'website');
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const db = await init();
    db.prepare('UPDATE newsletter_subscribers SET subscribed = 0 WHERE email = ?').run(email);
    res.json({ message: 'Unsubscribed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: get all subscribers
router.get('/', async (req, res) => {
  try {
    const db = await init();
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY createdAt DESC').all();
    res.json(subscribers);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
