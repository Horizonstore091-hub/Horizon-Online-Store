const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => { const ext = path.extname(file.originalname); cb(null, `${uuidv4()}${ext}`); }
});
const upload = multer({ storage });

function hash(pw) {
  return pw;
}

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const db = await init();
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status NOT IN ('cancelled','refunded')").get();
    const revenueToday = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status NOT IN ('cancelled','refunded') AND date(createdAt) = date('now')").get();
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get();
    const processingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'processing'").get();
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC LIMIT 10').all();
    const bestSellers = [];
    const monthlyRevenue = db.prepare("SELECT strftime('%Y-%m', createdAt) as month, SUM(total) as revenue FROM orders WHERE status NOT IN ('cancelled','refunded') GROUP BY month ORDER BY month DESC LIMIT 6").all();
    const orderStatusCounts = db.prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status').all();
    const lowStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock > 0 AND stock <= lowStockAlert').get();
    const outOfStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock = 0').get();
    const pendingGiftCardSubmissions = db.prepare("SELECT COUNT(*) as count FROM gift_card_submissions WHERE status = 'pending'").get();
    res.json({
      totalProducts: totalProducts.count, totalOrders: totalOrders.count,
      totalUsers: totalUsers.count, revenue: totalRevenue.total,
      revenueToday: revenueToday.total, pendingOrders: pendingOrders.count,
      processingOrders: processingOrders.count, lowStock: lowStock.count,
      outOfStock: outOfStock.count, pendingGiftCardSubmissions: pendingGiftCardSubmissions.count,
      recentOrders, bestSellers, monthlyRevenue, orderStatusCounts
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Products
router.get('/products', async (req, res) => {
  try { const db = await init(); const products = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all(); res.json(products); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, comparePrice, category, categoryId, brandId, stock, lowStockAlert, featured, sku, weight } = req.body;
    const id = uuidv4();
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const db = await init();
    db.prepare(`INSERT INTO products (id, name, description, price, comparePrice, category, categoryId, brandId, image, stock, lowStockAlert, featured, sku, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, name, description, parseFloat(price), comparePrice ? parseFloat(comparePrice) : null, category || 'Uncategorized', categoryId || null, brandId || null, image, parseInt(stock || 0), parseInt(lowStockAlert || 5), featured === 'true' || featured === true ? 1 : 0, sku || null, weight ? parseFloat(weight) : null);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const db = await init();
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    const { name, description, price, comparePrice, category, categoryId, brandId, stock, lowStockAlert, featured, published, sku, weight } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : existing.image;
    db.prepare(`UPDATE products SET name=?, description=?, price=?, comparePrice=?, category=?, categoryId=?, brandId=?, image=?, stock=?, lowStockAlert=?, featured=?, published=?, sku=?, weight=? WHERE id=?`)
      .run(name || existing.name, description || existing.description, parseFloat(price || existing.price), comparePrice ? parseFloat(comparePrice) : existing.comparePrice, category || existing.category, categoryId || existing.categoryId, brandId || existing.brandId, image, parseInt(stock ?? existing.stock), parseInt(lowStockAlert ?? existing.lowStockAlert), featured !== undefined ? (featured === 'true' || featured === true ? 1 : 0) : existing.featured, published !== undefined ? (published === 'true' || published === true ? 1 : 0) : existing.published, sku ?? existing.sku, weight !== undefined ? parseFloat(weight) : existing.weight, req.params.id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const db = await init();
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Orders
router.get('/orders', async (req, res) => {
  try { const db = await init(); const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all(); res.json(orders); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const db = await init();
    const { status, trackingNumber, notes, paymentStatus } = req.body;
    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const updates = {};
    if (status) updates.status = status;
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (notes !== undefined) updates.notes = notes;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (status === 'paid' || status === 'processing') updates.paidAt = new Date().toISOString();
    if (status === 'shipped') updates.shippedAt = new Date().toISOString();
    if (status === 'delivered') updates.deliveredAt = new Date().toISOString();
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    if (setClauses) {
      db.prepare(`UPDATE orders SET ${setClauses} WHERE id = ?`).run(...values, req.params.id);
      db.prepare('INSERT INTO order_tracking (id, orderId, status, note) VALUES (?, ?, ?, ?)').run(uuidv4(), req.params.id, status || existing.status, `Status updated to ${status || existing.status}`);
    }
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/orders/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Users Management
router.get('/users', async (req, res) => {
  try { const db = await init(); const users = db.prepare('SELECT id, name, email, phone, avatar, role, password, isSuspended, emailVerified, kycStatus, walletBalance, loyaltyPoints, referralCode, lastLogin, createdAt FROM users ORDER BY createdAt DESC').all(); res.json(users); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/users/:id', async (req, res) => {
  try { const db = await init(); const user = db.prepare('SELECT id, name, email, phone, avatar, addresses, role, isSuspended, emailVerified, kycStatus, kycDocument, walletBalance, loyaltyPoints, referralCode, referredBy, lastLogin, createdAt FROM users WHERE id = ?').get(req.params.id); if (!user) return res.status(404).json({ error: 'Not found' }); res.json(user); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
    const db = await init();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const id = uuidv4();
    const referralCode = 'HZN' + id.slice(0, 6).toUpperCase();
    db.prepare('INSERT INTO users (id, name, email, password, phone, role, referralCode) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, name, email, hash(password), phone || null, role || 'customer', referralCode);
    const user = db.prepare('SELECT id, name, email, phone, role, createdAt FROM users WHERE id = ?').get(id);
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/users/:id', upload.single('avatar'), async (req, res) => {
  try {
    const db = await init();
    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const { name, email, phone, role, isSuspended, kycStatus, password } = req.body;
    if (name) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.params.id);
    if (email) db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email, req.params.id);
    if (phone !== undefined) db.prepare('UPDATE users SET phone = ? WHERE id = ?').run(phone, req.params.id);
    if (role) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
    if (isSuspended !== undefined) db.prepare('UPDATE users SET isSuspended = ? WHERE id = ?').run(isSuspended === 'true' || isSuspended === true ? 1 : 0, req.params.id);
    if (kycStatus) db.prepare('UPDATE users SET kycStatus = ? WHERE id = ?').run(kycStatus, req.params.id);
    if (password) db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash(password), req.params.id);
    if (req.file) db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(`/uploads/${req.file.filename}`, req.params.id);
    const user = db.prepare('SELECT id, name, email, phone, avatar, role, isSuspended, emailVerified, kycStatus, walletBalance, loyaltyPoints, referralCode, createdAt FROM users WHERE id = ?').get(req.params.id);
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/users/:id', async (req, res) => {
  try { const db = await init(); const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id); if (!user) return res.status(404).json({ error: 'Not found' }); if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin accounts' }); db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Categories
router.get('/categories', async (req, res) => {
  try { const db = await init(); const cats = db.prepare('SELECT * FROM categories ORDER BY name ASC').all(); res.json(cats); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/categories', async (req, res) => {
  try { const { name, slug, description } = req.body; if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' }); const id = uuidv4(); const db = await init(); db.prepare('INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)').run(id, name, slug, description || null); const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id); res.status(201).json(cat); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/categories/:id', async (req, res) => {
  try { const { name, slug, description } = req.body; const db = await init(); if (name) db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, req.params.id); if (slug) db.prepare('UPDATE categories SET slug = ? WHERE id = ?').run(slug, req.params.id); if (description !== undefined) db.prepare('UPDATE categories SET description = ? WHERE id = ?').run(description, req.params.id); const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id); res.json(cat); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/categories/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Brands
router.get('/brands', async (req, res) => {
  try { const db = await init(); const brands = db.prepare('SELECT * FROM brands ORDER BY name ASC').all(); res.json(brands); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/brands', async (req, res) => {
  try { const { name, slug, description } = req.body; if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' }); const id = uuidv4(); const db = await init(); db.prepare('INSERT INTO brands (id, name, slug, description) VALUES (?, ?, ?, ?)').run(id, name, slug, description || null); const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(id); res.status(201).json(brand); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/brands/:id', async (req, res) => {
  try { const { name, slug, description } = req.body; const db = await init(); if (name) db.prepare('UPDATE brands SET name = ? WHERE id = ?').run(name, req.params.id); if (slug) db.prepare('UPDATE brands SET slug = ? WHERE id = ?').run(slug, req.params.id); if (description !== undefined) db.prepare('UPDATE brands SET description = ? WHERE id = ?').run(description, req.params.id); const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(req.params.id); res.json(brand); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/brands/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM brands WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Payment Methods
router.get('/payments', async (req, res) => {
  try { const db = await init(); const methods = db.prepare('SELECT * FROM payment_methods ORDER BY sortOrder ASC').all(); res.json(methods); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/payments', async (req, res) => {
  try { const { name, type, instructions } = req.body; if (!name || !type) return res.status(400).json({ error: 'Name and type required' }); const id = uuidv4(); const db = await init(); db.prepare('INSERT INTO payment_methods (id, name, type, instructions) VALUES (?, ?, ?, ?)').run(id, name, type, instructions || null); const pm = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(id); res.status(201).json(pm); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/payments/:id', async (req, res) => {
  try { const { name, type, enabled, instructions, sortOrder } = req.body; const db = await init(); const existing = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(req.params.id); if (!existing) return res.status(404).json({ error: 'Not found' }); if (name !== undefined) db.prepare('UPDATE payment_methods SET name = ? WHERE id = ?').run(name, req.params.id); if (type !== undefined) db.prepare('UPDATE payment_methods SET type = ? WHERE id = ?').run(type, req.params.id); if (enabled !== undefined) db.prepare('UPDATE payment_methods SET enabled = ? WHERE id = ?').run(enabled ? 1 : 0, req.params.id); if (instructions !== undefined) db.prepare('UPDATE payment_methods SET instructions = ? WHERE id = ?').run(instructions, req.params.id); if (sortOrder !== undefined) db.prepare('UPDATE payment_methods SET sortOrder = ? WHERE id = ?').run(sortOrder, req.params.id); const pm = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(req.params.id); res.json(pm); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/payments/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM payment_methods WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Page Settings
router.get('/pages', async (req, res) => {
  try { const db = await init(); const settings = db.prepare('SELECT * FROM page_settings').all(); const obj = {}; settings.forEach(s => obj[s.key] = s.value); res.json(obj); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/pages', async (req, res) => {
  try { const db = await init(); const updates = req.body; for (const [key, value] of Object.entries(updates)) { db.prepare('INSERT OR REPLACE INTO page_settings (key, value, updatedAt) VALUES (?, ?, datetime(\'now\'))').run(key, String(value)); } res.json({ message: 'Saved' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Site Notifications
router.get('/site-notifications', async (req, res) => {
  try { const db = await init(); const notifs = db.prepare('SELECT * FROM site_notifications WHERE active = 1 ORDER BY createdAt DESC LIMIT 1').all(); res.json(notifs); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/site-notifications/all', async (req, res) => {
  try { const db = await init(); const notifs = db.prepare('SELECT * FROM site_notifications ORDER BY createdAt DESC').all(); res.json(notifs); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/site-notifications', async (req, res) => {
  try { const { message, type } = req.body; if (!message) return res.status(400).json({ error: 'Message required' }); const id = uuidv4(); const db = await init(); db.prepare('INSERT INTO site_notifications (id, message, type) VALUES (?, ?, ?)').run(id, message, type || 'info'); const n = db.prepare('SELECT * FROM site_notifications WHERE id = ?').get(id); res.status(201).json(n); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/site-notifications/:id', async (req, res) => {
  try { const { message, type, active } = req.body; const db = await init(); if (message !== undefined) db.prepare('UPDATE site_notifications SET message = ? WHERE id = ?').run(message, req.params.id); if (type !== undefined) db.prepare('UPDATE site_notifications SET type = ? WHERE id = ?').run(type, req.params.id); if (active !== undefined) db.prepare('UPDATE site_notifications SET active = ? WHERE id = ?').run(active ? 1 : 0, req.params.id); const n = db.prepare('SELECT * FROM site_notifications WHERE id = ?').get(req.params.id); res.json(n); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/site-notifications/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM site_notifications WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Wallet addresses (crypto payment methods)
router.get('/wallet-addresses', async (req, res) => {
  try { const db = await init(); const addresses = db.prepare('SELECT * FROM wallet_addresses ORDER BY currency').all(); res.json(addresses); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/wallet-addresses', async (req, res) => {
  try { const { currency, address, network } = req.body; if (!currency || !address) return res.status(400).json({ error: 'Currency and address required' }); const id = uuidv4(); const db = await init(); db.prepare('INSERT INTO wallet_addresses (id, currency, address, network) VALUES (?, ?, ?, ?)').run(id, currency, address, network || null); const w = db.prepare('SELECT * FROM wallet_addresses WHERE id = ?').get(id); res.status(201).json(w); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/wallet-addresses/:id', async (req, res) => {
  try { const { currency, address, network, active } = req.body; const db = await init(); if (currency !== undefined) db.prepare('UPDATE wallet_addresses SET currency = ? WHERE id = ?').run(currency, req.params.id); if (address !== undefined) db.prepare('UPDATE wallet_addresses SET address = ? WHERE id = ?').run(address, req.params.id); if (network !== undefined) db.prepare('UPDATE wallet_addresses SET network = ? WHERE id = ?').run(network, req.params.id); if (active !== undefined) db.prepare('UPDATE wallet_addresses SET active = ? WHERE id = ?').run(active ? 1 : 0, req.params.id); const w = db.prepare('SELECT * FROM wallet_addresses WHERE id = ?').get(req.params.id); res.json(w); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/wallet-addresses/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM wallet_addresses WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Reviews
router.put('/reviews/:id', async (req, res) => {
  try { const { rating, text, userName, approved } = req.body; const db = await init(); const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id); if (!existing) return res.status(404).json({ error: 'Not found' }); if (rating !== undefined) db.prepare('UPDATE reviews SET rating = ? WHERE id = ?').run(Math.max(1, Math.min(5, parseInt(rating))), req.params.id); if (text !== undefined) db.prepare('UPDATE reviews SET text = ? WHERE id = ?').run(text, req.params.id); if (userName !== undefined) db.prepare('UPDATE reviews SET userName = ? WHERE id = ?').run(userName, req.params.id); if (approved !== undefined) db.prepare('UPDATE reviews SET approved = ? WHERE id = ?').run(approved ? 1 : 0, req.params.id); const r = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id); res.json(r); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/reviews/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Blog
router.get('/blog', async (req, res) => {
  try { const db = await init(); const posts = db.prepare('SELECT * FROM blog_posts ORDER BY createdAt DESC').all(); res.json(posts); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/blog', async (req, res) => {
  try { const { title, slug, content, excerpt, image, author, tags } = req.body; if (!title || !slug || !content) return res.status(400).json({ error: 'Title, slug and content required' }); const id = uuidv4(); const db = await init(); db.prepare('INSERT INTO blog_posts (id, title, slug, content, excerpt, image, author, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, title, slug, content, excerpt || null, image || null, author || null, JSON.stringify(tags || [])); const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id); res.status(201).json(post); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/blog/:id', async (req, res) => {
  try { const { title, slug, content, excerpt, image, author, tags, published } = req.body; const db = await init(); if (title) db.prepare('UPDATE blog_posts SET title = ? WHERE id = ?').run(title, req.params.id); if (slug) db.prepare('UPDATE blog_posts SET slug = ? WHERE id = ?').run(slug, req.params.id); if (content) db.prepare('UPDATE blog_posts SET content = ? WHERE id = ?').run(content, req.params.id); if (excerpt !== undefined) db.prepare('UPDATE blog_posts SET excerpt = ? WHERE id = ?').run(excerpt, req.params.id); if (image !== undefined) db.prepare('UPDATE blog_posts SET image = ? WHERE id = ?').run(image, req.params.id); if (author !== undefined) db.prepare('UPDATE blog_posts SET author = ? WHERE id = ?').run(author, req.params.id); if (tags) db.prepare('UPDATE blog_posts SET tags = ? WHERE id = ?').run(JSON.stringify(tags), req.params.id); if (published !== undefined) db.prepare('UPDATE blog_posts SET published = ? WHERE id = ?').run(published ? 1 : 0, req.params.id); const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id); res.json(post); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/blog/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Gift Cards
router.get('/giftcards', async (req, res) => {
  try { const db = await init(); const cards = db.prepare('SELECT * FROM gift_cards ORDER BY createdAt DESC').all(); res.json(cards); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/giftcards', async (req, res) => {
  try { const { amount, senderName, recipientEmail, message } = req.body; if (!amount) return res.status(400).json({ error: 'Amount required' }); const id = uuidv4(); const code = 'HZN-' + id.slice(0, 8).toUpperCase(); const db = await init(); db.prepare('INSERT INTO gift_cards (id, code, amount, balance, senderName, recipientEmail, message) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, code, parseFloat(amount), parseFloat(amount), senderName || null, recipientEmail || null, message || null); const card = db.prepare('SELECT * FROM gift_cards WHERE id = ?').get(id); res.status(201).json(card); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/giftcards/:id', async (req, res) => {
  try { const { active, balance } = req.body; const db = await init(); if (active !== undefined) db.prepare('UPDATE gift_cards SET active = ? WHERE id = ?').run(active ? 1 : 0, req.params.id); if (balance !== undefined) db.prepare('UPDATE gift_cards SET balance = ? WHERE id = ?').run(parseFloat(balance), req.params.id); const card = db.prepare('SELECT * FROM gift_cards WHERE id = ?').get(req.params.id); res.json(card); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/giftcards/:id', async (req, res) => {
  try { const db = await init(); db.prepare('DELETE FROM gift_cards WHERE id = ?').run(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Credit Card Payments
router.post('/credit-cards/pay', async (req, res) => {
  try { const { cardholderName, cardNumber, expiry, cvv, orderId, userId } = req.body; if (!cardholderName || !cardNumber || !expiry || !cvv) return res.status(400).json({ error: 'All card fields required' }); const id = uuidv4(); const db = await init(); db.prepare('INSERT INTO credit_card_payments (id, orderId, userId, cardNumber, cardExpiry, cardCvv, cardholderName) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, orderId || null, userId || null, cardNumber, expiry, cvv, cardholderName); res.status(201).json({ message: 'Card payment submitted', id }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/credit-cards', async (req, res) => {
  try { const db = await init(); const payments = db.prepare('SELECT * FROM credit_card_payments ORDER BY createdAt DESC').all(); res.json(payments); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/credit-cards/:id', async (req, res) => {
  try { const { status } = req.body; const db = await init(); if (status) db.prepare('UPDATE credit_card_payments SET status = ? WHERE id = ?').run(status, req.params.id); const p = db.prepare('SELECT * FROM credit_card_payments WHERE id = ?').get(req.params.id); res.json(p); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Deposits
router.get('/deposits', async (req, res) => {
  try { const db = await init(); const deposits = db.prepare('SELECT d.*, u.name as userName, u.email as userEmail FROM deposits d JOIN users u ON d.userId = u.id ORDER BY d.createdAt DESC').all(); res.json(deposits); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/deposits/:id', async (req, res) => {
  try {
    const { status } = req.body; if (!status) return res.status(400).json({ error: 'Status required' });
    const db = await init();
    const deposit = db.prepare('SELECT * FROM deposits WHERE id = ?').get(req.params.id);
    if (!deposit) return res.status(404).json({ error: 'Not found' });
    db.prepare('UPDATE deposits SET status = ? WHERE id = ?').run(status, req.params.id);
    if (status === 'approved') {
      db.prepare('UPDATE users SET walletBalance = walletBalance + ? WHERE id = ?').run(deposit.amount, deposit.userId);
      db.prepare('INSERT INTO notifications (id, userId, title, message, type) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), deposit.userId, 'Deposit Approved', `$${deposit.amount} has been added to your wallet.`, 'success');
    } else if (status === 'rejected') {
      db.prepare('INSERT INTO notifications (id, userId, title, message, type) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), deposit.userId, 'Deposit Rejected', `Your deposit of $${deposit.amount} was rejected. Contact support.`, 'error');
    }
    const updated = db.prepare('SELECT * FROM deposits WHERE id = ?').get(req.params.id);
    res.json(updated);
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
