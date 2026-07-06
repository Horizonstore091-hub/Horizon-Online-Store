const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message required' });
    const id = uuidv4();
    const db = await init();
    db.prepare('INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)').run(id, name, email, subject || null, message);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const db = await init();
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY createdAt DESC').all();
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
