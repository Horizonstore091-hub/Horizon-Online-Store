const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get pricing for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const db = await init();
    const tiers = db.prepare('SELECT * FROM bulk_pricing WHERE productId = ? ORDER BY minQty ASC').all(req.params.productId);
    res.json(tiers);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add pricing tier
router.post('/', async (req, res) => {
  try {
    const { productId, minQty, maxQty, pricePerUnit } = req.body;
    if (!productId || !minQty || !pricePerUnit) return res.status(400).json({ error: 'productId, minQty, pricePerUnit required' });
    const db = await init();
    const id = uuidv4();
    db.prepare('INSERT INTO bulk_pricing (id, productId, minQty, maxQty, pricePerUnit) VALUES (?, ?, ?, ?, ?)').run(id, productId, minQty, maxQty || null, pricePerUnit);
    const tier = db.prepare('SELECT * FROM bulk_pricing WHERE id = ?').get(id);
    res.status(201).json(tier);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete tier
router.delete('/:id', async (req, res) => {
  try {
    const db = await init();
    db.prepare('DELETE FROM bulk_pricing WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get best price for a quantity
router.get('/price/:productId/:qty', async (req, res) => {
  try {
    const db = await init();
    const qty = parseInt(req.params.qty);
    const product = db.prepare('SELECT price FROM products WHERE id = ?').get(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const tier = db.prepare('SELECT * FROM bulk_pricing WHERE productId = ? AND minQty <= ? AND (maxQty IS NULL OR maxQty >= ?) ORDER BY minQty DESC LIMIT 1').get(req.params.productId, qty, qty);
    res.json({ basePrice: product.price, tier, finalPrice: tier ? tier.pricePerUnit : product.price });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
