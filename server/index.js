const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] } });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/giftcards', require('./routes/giftcards'));
app.use('/api/loyalty', require('./routes/loyalty'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/currencies', require('./routes/currencies'));
app.use('/api/activity', require('./routes/activity'));

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('join', (room) => { socket.join(room); });
  socket.on('disconnect', () => {});
});
app.set('io', io);

// Mount new route modules
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/social-login', require('./routes/social'));
app.use('/api/abandoned-carts', require('./routes/abandoned_carts'));
app.use('/api/page-meta', require('./routes/page_meta'));
app.use('/api/bulk-pricing', require('./routes/bulk_pricing'));
app.use('/api/recently-viewed', require('./routes/recently_viewed'));
app.use('/api/push-subscriptions', require('./routes/push_subscriptions'));

// Auto-log helper available to all routes
app.use((req, res, next) => { req.logActivity = async (userId, userName, action, details) => { try { const { v4: uuidv4 } = require('uuid'); const init = require('./db'); const db = await init(); db.prepare('INSERT INTO activity_logs (id, userId, userName, action, details) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId || null, userName || '', action || '', details || ''); } catch(e){} }; next(); });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

// Auto-seed if DB doesn't exist (handles ephemeral SQLite on free hosting)
const dbPath = path.join(__dirname, '..', 'data', 'horizon.db');

function startServer() {
  server.listen(PORT, () => {
    console.log(`Horizon running on http://localhost:${PORT}`);
  });
}

if (!fs.existsSync(dbPath)) {
  console.log('No database found, running seed...');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const seedProcess = fork(path.join(__dirname, 'seed.js'));
  seedProcess.on('exit', () => { console.log('Seed complete'); startServer(); });
} else {
  startServer();
}
