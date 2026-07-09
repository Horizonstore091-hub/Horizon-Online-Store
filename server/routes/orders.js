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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, userId || null, orderNumber, customerName, customerEmail, customerAddress, customerCity, customerZip, customerPhone || null, JSON.stringify(items), parseFloat(total || 0), subtotal ? parseFloat(subtotal) : parseFloat(total || 0), shippingMethod || 'standard', shippingCost ? parseFloat(shippingCost) : 0, couponCode || null, discount ? parseFloat(discount) : 0, paymentMethod || 'crypto', notes || null);
    db.prepare('INSERT INTO order_tracking (id, orderId, status, note) VALUES (?, ?, ?, ?)').run(uuidv4(), id, 'pending', 'Order placed');
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const sendEmail = require('../email');
    sendEmail({ to: customerEmail, subject: 'Order Confirmed - Horizon', text: `Your order #${orderNumber} has been confirmed. Total: $${total}. Thank you for shopping at Horizon!` }).catch(()=>{});
    db.prepare('INSERT INTO activity_logs (id, userId, userName, action, details) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId || 'guest', customerName, 'order_placed', `Order #${orderNumber} placed - $${total}`);
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

// Crypto payment submission
router.post('/crypto-pay', async (req, res) => {
  try {
    const { orderId, userId, currency, amount, walletAddress, txHash } = req.body;
    if (!currency || !amount) return res.status(400).json({ error: 'Currency and amount required' });
    const { v4: uuidv4 } = require('uuid');
    const init = require('../db');
    const db = await init();
    const id = uuidv4();
    db.prepare('INSERT INTO crypto_payments (id, orderId, userId, currency, amount, walletAddress, txHash) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, orderId || null, userId || null, currency, amount, walletAddress || null, txHash || null);
    db.prepare('UPDATE orders SET paymentStatus = ?, status = ? WHERE id = ?').run('paid', 'pending', orderId);
    // Log activity
    db.prepare('INSERT INTO activity_logs (id, userId, userName, action, details) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId || 'guest', '', 'crypto_payment', `Crypto payment of $${amount} via ${currency}`);
    res.status(201).json({ message: 'Crypto payment recorded', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Guest order lookup by order number
router.get('/lookup/:orderNumber', async (req, res) => {
  try { const db = await init(); const order = db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(req.params.orderNumber); if (!order) return res.status(404).json({ error: 'Order not found' }); const tracking = db.prepare('SELECT * FROM order_tracking WHERE orderId = ? ORDER BY createdAt ASC').all(order.id); res.json({ order, tracking }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
