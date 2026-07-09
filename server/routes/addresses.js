const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get all addresses for a user
router.get('/:userId', async (req, res) => {
  try {
    const db = await init();
    const addresses = db.prepare('SELECT * FROM addresses WHERE userId = ? ORDER BY isDefault DESC, createdAt DESC').all(req.params.userId);
    res.json(addresses);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add address
router.post('/', async (req, res) => {
  try {
    const { userId, label, fullName, street, city, state, zip, country, phone, isDefault } = req.body;
    if (!userId || !fullName || !street || !city || !zip) return res.status(400).json({ error: 'Required fields missing' });
    const db = await init();
    const id = uuidv4();
    if (isDefault) db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ?').run(userId);
    db.prepare('INSERT INTO addresses (id, userId, label, fullName, street, city, state, zip, country, phone, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, userId, label || 'Home', fullName, street, city, state || null, zip, country || 'US', phone || null, isDefault ? 1 : 0);
    const address = db.prepare('SELECT * FROM addresses WHERE id = ?').get(id);
    res.status(201).json(address);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update address
router.put('/:id', async (req, res) => {
  try {
    const { label, fullName, street, city, state, zip, country, phone, isDefault } = req.body;
    const db = await init();
    const existing = db.prepare('SELECT * FROM addresses WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Address not found' });
    if (isDefault) db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ?').run(existing.userId);
    db.prepare('UPDATE addresses SET label=?, fullName=?, street=?, city=?, state=?, zip=?, country=?, phone=?, isDefault=? WHERE id=?').run(
      label || existing.label, fullName || existing.fullName, street || existing.street,
      city || existing.city, state !== undefined ? state : existing.state,
      zip || existing.zip, country || existing.country,
      phone !== undefined ? phone : existing.phone,
      isDefault ? 1 : (existing.isDefault ? (isDefault === false ? 0 : 1) : 0),
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM addresses WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete address
router.delete('/:id', async (req, res) => {
  try {
    const db = await init();
    db.prepare('DELETE FROM addresses WHERE id = ?').run(req.params.id);
    res.json({ message: 'Address deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
