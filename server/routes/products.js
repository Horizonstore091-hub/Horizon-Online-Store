const express = require('express');
const router = express.Router();
const init = require('../db');

router.get('/', async (req, res) => {
  try {
    const db = await init();
    const { category, featured, search, brand, sort, limit } = req.query;
    let sql = 'SELECT * FROM products WHERE published = 1';
    const params = [];
    if (category && category !== 'All') { sql += ' AND category = ?'; params.push(category); }
    if (featured === 'true') { sql += ' AND featured = 1'; }
    if (brand) { sql += ' AND brandId = ?'; params.push(brand); }
    if (search) { sql += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (sort === 'price_asc') sql += ' ORDER BY price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
    else if (sort === 'newest') sql += ' ORDER BY createdAt DESC';
    else if (sort === 'name') sql += ' ORDER BY name ASC';
    else sql += ' ORDER BY createdAt DESC';
    if (limit) sql += ' LIMIT ?';
    if (params.length === 0 || !limit) {
      // no limit param
    }
    const products = db.prepare(limit ? sql + ' LIMIT ?' : sql).all(...params, ...(limit ? [parseInt(limit)] : []));
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/categories', async (req, res) => {
  try { const db = await init(); const cats = db.prepare('SELECT DISTINCT category FROM products WHERE published = 1 ORDER BY category ASC').all(); res.json(cats.map(c => c.category)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/brands', async (req, res) => {
  try { const db = await init(); const brands = db.prepare('SELECT DISTINCT brandId FROM products WHERE brandId IS NOT NULL AND published = 1').all(); res.json(brands.map(b => b.brandId)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await init();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    db.prepare('UPDATE products SET views = views + 1 WHERE id = ?').run(req.params.id);
    const related = db.prepare('SELECT * FROM products WHERE category = ? AND id != ? AND published = 1 ORDER BY RANDOM() LIMIT 4').all(product.category, product.id);
    res.json({ ...product, related });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id/images', async (req, res) => {
  try { const db = await init(); const images = db.prepare('SELECT * FROM product_images WHERE productId = ? ORDER BY sortOrder ASC').all(req.params.id); res.json(images); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
