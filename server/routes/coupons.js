const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const db = await init();
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY createdAt DESC').all();
    res.json(coupons);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required' });
    const db = await init();
    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1').get(code.toUpperCase());
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ error: 'Coupon has expired' });
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ error: 'Coupon usage limit reached' });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ error: `Minimum order of $${coupon.minOrder.toFixed(2)} required` });
    const discount = coupon.type === 'percentage' ? orderTotal * (coupon.discount / 100) : coupon.discount;
    res.json({ valid: true, coupon, discount: Math.min(discount, orderTotal) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { code, discount, type, minOrder, usageLimit, expiresAt } = req.body;
    if (!code || !discount) return res.status(400).json({ error: 'Code and discount required' });
    const id = uuidv4();
    const db = await init();
    db.prepare('INSERT INTO coupons (id, code, discount, type, minOrder, usageLimit, expiresAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, code.toUpperCase(), parseFloat(discount), type || 'percentage', parseFloat(minOrder || 0), parseInt(usageLimit || 0), expiresAt || null);
    const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);
    res.status(201).json(coupon);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await init();
    db.prepare('DELETE FROM coupons WHERE id = ?').run(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
