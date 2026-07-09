const express = require('express');
const router = express.Router();
const init = require('../db');
const { v4: uuidv4 } = require('uuid');

// Social login (Google/Facebook OAuth token verification)
router.post('/login', async (req, res) => {
  try {
    const { provider, providerId, email, name, avatar } = req.body;
    if (!provider || !providerId) return res.status(400).json({ error: 'Provider and providerId required' });
    const db = await init();

    // Check if social login exists
    let social = db.prepare('SELECT * FROM social_logins WHERE provider = ? AND providerId = ?').get(provider, providerId);
    if (social) {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(social.userId);
      if (!user) return res.status(404).json({ error: 'Linked user not found' });
      const { password, ...safe } = user;
      db.prepare('UPDATE users SET lastLogin = datetime(\'now\') WHERE id = ?').run(user.id);
      db.prepare('INSERT INTO activity_logs (id, userId, userName, action, details) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), user.id, user.name, 'social_login', `Logged in via ${provider}`);
      return res.json({ user: safe, token: user.id });
    }

    // If email provided, try to link to existing user
    if (email) {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        db.prepare('INSERT INTO social_logins (id, userId, provider, providerId, email, name, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), existingUser.id, provider, providerId, email || null, name || null, avatar || null);
        const { password, ...safe } = existingUser;
        db.prepare('UPDATE users SET lastLogin = datetime(\'now\') WHERE id = ?').run(existingUser.id);
        return res.json({ user: safe, token: existingUser.id });
      }
    }

    // Create new user
    const userId = uuidv4();
    const referralCode = 'HZN' + userId.slice(0, 6).toUpperCase();
    const displayName = name || email?.split('@')[0] || provider + '_user';
    const userEmail = email || `${providerId}@${provider}.social`;
    const randomPass = uuidv4();
    db.prepare('INSERT INTO users (id, name, email, password, avatar, referralCode) VALUES (?, ?, ?, ?, ?, ?)').run(userId, displayName, userEmail, randomPass, avatar || null, referralCode);
    db.prepare('INSERT INTO social_logins (id, userId, provider, providerId, email, name, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuidv4(), userId, provider, providerId, email || null, name || null, avatar || null);
    const user = db.prepare('SELECT id, name, email, phone, avatar, role, addresses, walletBalance, loyaltyPoints, referralCode, createdAt FROM users WHERE id = ?').get(userId);
    res.status(201).json({ user, token: userId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
