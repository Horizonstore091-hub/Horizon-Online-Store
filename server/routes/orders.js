const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const { userId, customerName, customerEmail, customerAddress, customerCity, customerZip, customerPhone, items, total, subtotal, shippingMethod, shippingCost, couponCode, discount, paymentMethod, notes } = req.body;
    if (!customerName || !customerEmail || !customerAddress || !customerCity || !customerZip || !items) return res.status(400).json({ error: 'Required fields missing' });
    const db = await init();
    const id = uuidv4();
    const orderNumber = 'HZN-' + id.slice(0, 8).toUpperCase();
    db.prepare(`INSERT INTO orders (id, userId, orderNumber, customerName, customerEmail, customerAddress, customerCity, customerZip, customerPhone, items, total, subtotal, shippingMethod, shippingCost, couponCode, discount, paymentMethod, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, userId || null, orderNumber, customerName, customerEmail, customerAddress, customerCity, customerZip, customerPhone || null, JSON.stringify(items), parseFloat(total || 0), subtotal ? parseFloat(subtotal) : parseFloat(total || 0), shippingMethod || 'standard', shippingCost ? parseFloat(shippingCost) : 0, couponCode || null, discount ? parseFloat(discount) : 0, paymentMethod || 'card', notes || null);
    db.prepare('INSERT INTO order_tracking (id, orderId, status, note) VALUES (?, ?, ?, ?)').run(uuidv4(), id, 'pending', 'Order placed');
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const sendEmail = require('../email');
    sendEmail({ to: customerEmail, subject: 'Order Confirmed - Horizon', text: `Your order #${orderNumber} has been confirmed. Total: $${total}. Thank you for shopping at Horizon!` }).catch(()=>{});
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try { const db = await init(); const { userId } = req.query; let orders; if (userId) orders = db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(userId); else orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all(); res.json(orders); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/tracking/:orderId', async (req, res) => {
  try { const db = await init(); const tracking = db.prepare('SELECT * FROM order_tracking WHERE orderId = ? ORDER BY createdAt ASC').all(req.params.orderId); res.json(tracking); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try { const db = await init(); const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id); if (!order) return res.status(404).json({ error: 'Order not found' }); res.json(order); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Credit card payment from checkout
router.post('/credit-cards/pay', async (req, res) => {
  try {
    const { cardholderName, cardNumber, expiry, cvv, orderId, userId } = req.body;
    if (!cardholderName || !cardNumber || !expiry || !cvv) return res.status(400).json({ error: 'All card fields required' });
    const { v4: uuidv4 } = require('uuid');
    const init = require('../db');
    const db = await init();
    const id = uuidv4();
    db.prepare('INSERT INTO credit_card_payments (id, orderId, userId, cardNumber, cardExpiry, cardCvv, cardholderName) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, orderId || null, userId || null, cardNumber, expiry, cvv, cardholderName);
    // Log activity
    db.prepare('INSERT INTO activity_logs (id, userId, userName, action, details) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId || 'guest', cardholderName, 'credit_card_submission', 'Credit card payment submitted for order ' + (orderId || ''));
    res.status(201).json({ message: 'Card payment submitted', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Guest order lookup by order number
router.get('/lookup/:orderNumber', async (req, res) => {
  try { const db = await init(); const order = db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(req.params.orderNumber); if (!order) return res.status(404).json({ error: 'Order not found' }); const tracking = db.prepare('SELECT * FROM order_tracking WHERE orderId = ? ORDER BY createdAt ASC').all(order.id); res.json({ order, tracking }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
