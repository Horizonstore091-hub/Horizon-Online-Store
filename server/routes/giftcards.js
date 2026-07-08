const express = require('express');
const router = express.Router();
const init = require('../db');

router.post('/redeem', async (req, res) => {
  try {
    const { code, userId } = req.body;
    if (!code || !userId) return res.status(400).json({ error: 'Code and userId required' });
    const db = await init();
    const card = db.prepare('SELECT * FROM gift_cards WHERE code = ? AND active = 1').get(code);
    if (!card) return res.status(404).json({ error: 'Invalid gift card code' });
    if (card.balance <= 0) return res.status(400).json({ error: 'Gift card has no balance' });
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    db.prepare('UPDATE users SET walletBalance = walletBalance + ? WHERE id = ?').run(card.balance, userId);
    db.prepare('UPDATE gift_cards SET balance = 0, active = 0 WHERE id = ?').run(card.id);
    db.prepare('INSERT INTO notifications (id, userId, title, message, type) VALUES (?, ?, ?, ?, ?)').run(require('uuid').v4(), userId, 'Gift Card Redeemed', `$${card.balance} gift card redeemed to your wallet`, 'success');
    res.json({ message: `$${card.balance} added to your wallet`, amount: card.balance });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/check/:code', async (req, res) => {
  try { const db = await init(); const card = db.prepare('SELECT code, amount, balance, senderName, message, active FROM gift_cards WHERE code = ?').get(req.params.code); if (!card) return res.status(404).json({ error: 'Not found' }); res.json(card); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Submit gift card (code or image) for admin review
router.post('/submit', async (req, res) => {
  try {
    const { userId, orderId, cardType, code, imageData, method } = req.body;
    if (!cardType) return res.status(400).json({ error: 'Card type is required' });
    if (!code && !imageData) return res.status(400).json({ error: 'Gift card code or image is required' });
    if (method === 'code' && !code) return res.status(400).json({ error: 'Gift card code is required' });
    if (method === 'image' && !imageData) return res.status(400).json({ error: 'Gift card image is required' });
    const id = require('uuid').v4();
    const db = await init();
    db.prepare('INSERT INTO gift_card_submissions (id, userId, orderId, cardType, code, imageData, method) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, userId || null, orderId || null, cardType, code || null, imageData || null, method || 'code');
    res.status(201).json({ message: 'Gift card submitted for admin review' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: list all gift card submissions
router.get('/submissions', async (req, res) => {
  try {
    const db = await init();
    const submissions = db.prepare('SELECT gs.*, u.name as userName, u.email as userEmail FROM gift_card_submissions gs LEFT JOIN users u ON gs.userId = u.id ORDER BY gs.createdAt DESC').all();
    res.json(submissions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Approve/reject gift card submission
router.put('/submissions/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Valid status required' });
    const db = await init();
    db.prepare('UPDATE gift_card_submissions SET status = ? WHERE id = ?').run(status, req.params.id);
    if (status === 'approved') {
      const sub = db.prepare('SELECT * FROM gift_card_submissions WHERE id = ?').get(req.params.id);
      if (sub && sub.userId) {
        db.prepare('INSERT INTO notifications (id, userId, title, message, type) VALUES (?, ?, ?, ?, ?)').run(require('uuid').v4(), sub.userId, 'Gift Card Approved', 'Your ' + sub.cardType + ' gift card has been approved.', 'success');
        db.prepare('UPDATE users SET walletBalance = walletBalance + 100 WHERE id = ?').run(sub.userId);
      }
    }
    res.json({ message: 'Updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
