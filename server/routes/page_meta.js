const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get meta for a page
router.get('/:page', async (req, res) => {
  try {
    const db = await init();
    const meta = db.prepare('SELECT * FROM page_meta WHERE page = ?').get(req.params.page);
    res.json(meta || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Upsert meta
router.put('/:page', async (req, res) => {
  try {
    const { title, description, ogImage } = req.body;
    const db = await init();
    const existing = db.prepare('SELECT * FROM page_meta WHERE page = ?').get(req.params.page);
    if (existing) {
      db.prepare('UPDATE page_meta SET title=?, description=?, ogImage=?, updatedAt=datetime(\'now\') WHERE page=?').run(
        title !== undefined ? title : existing.title,
        description !== undefined ? description : existing.description,
        ogImage !== undefined ? ogImage : existing.ogImage,
        req.params.page
      );
    } else {
      db.prepare('INSERT INTO page_meta (id, page, title, description, ogImage) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), req.params.page, title || '', description || '', ogImage || '');
    }
    const meta = db.prepare('SELECT * FROM page_meta WHERE page = ?').get(req.params.page);
    res.json(meta);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: get all
router.get('/', async (req, res) => {
  try {
    const db = await init();
    const metas = db.prepare('SELECT * FROM page_meta ORDER BY page').all();
    res.json(metas);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
