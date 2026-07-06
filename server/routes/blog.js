const express = require('express');
const router = express.Router();
const init = require('../db');

router.get('/', async (req, res) => {
  try { const db = await init(); const posts = db.prepare('SELECT id, title, slug, excerpt, image, author, tags, published, createdAt FROM blog_posts WHERE published = 1 ORDER BY createdAt DESC').all(); res.json(posts); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try { const db = await init(); const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ? AND published = 1').get(req.params.slug); if (!post) return res.status(404).json({ error: 'Post not found' }); res.json(post); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
