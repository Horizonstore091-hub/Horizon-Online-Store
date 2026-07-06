const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.post('/claim', async (req, res) => {
  try {
    const { code, newUserId } = req.body;
    if (!code || !newUserId) return res.status(400).json({ error: 'Code and newUserId required' });
    const db = await init();
    const referrer = db.prepare('SELECT * FROM users WHERE referralCode = ?').get(code);
    if (!referrer) return res.status(404).json({ error: 'Invalid referral code' });
    if (referrer.id === newUserId) return res.status(400).json({ error: 'Cannot refer yourself' });
    const alreadyReferred = db.prepare('SELECT id FROM referrals WHERE referredId = ?').get(newUserId);
    if (alreadyReferred) return res.status(400).json({ error: 'Already referred' });
    db.prepare('INSERT INTO referrals (id, referrerId, referredId) VALUES (?, ?, ?)').run(uuidv4(), referrer.id, newUserId);
    db.prepare('UPDATE users SET loyaltyPoints = loyaltyPoints + 10 WHERE id = ?').run(referrer.id);
    db.prepare('UPDATE users SET loyaltyPoints = loyaltyPoints + 5 WHERE id = ?').run(newUserId);
    db.prepare('UPDATE users SET referredBy = ? WHERE id = ?').run(referrer.id, newUserId);
    db.prepare('INSERT INTO notifications (id, userId, title, message, type) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), newUserId, 'Welcome Bonus', 'You earned 5 loyalty points from referral! 10 points = $1 discount.', 'success');
    res.json({ message: 'Referral claimed! You earned 5 points, referrer earned 10 points (10 points = $1 discount).' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:userId', async (req, res) => {
  try { const db = await init(); const referrals = db.prepare('SELECT r.*, u.name as referredName, u.email as referredEmail, u.createdAt as referredDate FROM referrals r JOIN users u ON r.referredId = u.id WHERE r.referrerId = ? ORDER BY r.createdAt DESC').all(req.params.userId); res.json(referrals); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
