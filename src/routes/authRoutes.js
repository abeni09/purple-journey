const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Get user from database
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create and sign JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password (protected route)
router.post('/change-password', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }

        // Get user from database
        const [users] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
