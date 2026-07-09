const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Save abandoned cart
router.post('/', async (req, res) => {
  try {
    const { userId, email, items, subtotal, discount, couponCode, shippingMethod } = req.body;
    if (!userId && !email) return res.status(400).json({ error: 'userId or email required' });
    const db = await init();
    // Check if active abandoned cart exists
    let existing = null;
    if (userId) existing = db.prepare('SELECT * FROM abandoned_carts WHERE userId = ? AND status = ?').get(userId, 'active');
    if (!existing && email) existing = db.prepare('SELECT * FROM abandoned_carts WHERE email = ? AND status = ?').get(email, 'active');
    if (existing) {
      db.prepare('UPDATE abandoned_carts SET items=?, subtotal=?, discount=?, couponCode=?, shippingMethod=?, updatedAt=datetime(\'now\') WHERE id=?').run(JSON.stringify(items), subtotal || 0, discount || 0, couponCode || null, shippingMethod || 'standard', existing.id);
      return res.json({ message: 'Cart updated', id: existing.id });
    }
    const id = uuidv4();
    db.prepare('INSERT INTO abandoned_carts (id, userId, email, items, subtotal, discount, couponCode, shippingMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, userId || null, email || null, JSON.stringify(items), subtotal || 0, discount || 0, couponCode || null, shippingMethod || 'standard');
    res.status(201).json({ message: 'Cart saved', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get active abandoned cart for user
router.get('/:userId', async (req, res) => {
  try {
    const db = await init();
    const cart = db.prepare('SELECT * FROM abandoned_carts WHERE userId = ? AND status = ? ORDER BY updatedAt DESC LIMIT 1').get(req.params.userId, 'active');
    if (cart) cart.items = JSON.parse(cart.items);
    res.json(cart);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Clear abandoned cart (mark recovered)
router.put('/:id/recover', async (req, res) => {
  try {
    const db = await init();
    db.prepare('UPDATE abandoned_carts SET status = ? WHERE id = ?').run('recovered', req.params.id);
    res.json({ message: 'Cart marked recovered' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: get all abandoned carts
router.get('/', async (req, res) => {
  try {
    const db = await init();
    const carts = db.prepare('SELECT a.*, u.name as userName, u.email as userEmail FROM abandoned_carts a LEFT JOIN users u ON a.userId = u.id ORDER BY a.updatedAt DESC').all();
    carts.forEach(c => { if (typeof c.items === 'string') try { c.items = JSON.parse(c.items); } catch {} });
    res.json(carts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: send recovery email
router.post('/:id/send-reminder', async (req, res) => {
  try {
    const db = await init();
    const cart = db.prepare('SELECT * FROM abandoned_carts WHERE id = ?').get(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const email = cart.email || (cart.userId ? db.prepare('SELECT email FROM users WHERE id = ?').get(cart.userId)?.email : null);
    if (!email) return res.status(400).json({ error: 'No email found' });
    const sendEmail = require('../email');
    await sendEmail({ to: email, subject: 'You left something in your cart!', text: `You have items waiting in your cart at Horizon. Complete your purchase now!` });
    db.prepare('UPDATE abandoned_carts SET reminderSent = reminderSent + 1 WHERE id = ?').run(cart.id);
    res.json({ message: 'Reminder sent' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
