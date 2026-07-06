const express = require('express');
const router = express.Router();
const init = require('../db');

router.get('/', async (req, res) => {
  try { const db = await init(); const currencies = db.prepare('SELECT * FROM currencies WHERE active = 1').all(); res.json(currencies); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:code', async (req, res) => {
  try { const db = await init(); const currency = db.prepare('SELECT * FROM currencies WHERE code = ?').get(req.params.code); if (!currency) return res.status(404).json({ error: 'Not found' }); res.json(currency); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
