const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT role FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0 || rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (error) {
        console.error('Error checking admin status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authenticateToken,
    isAdmin
};
