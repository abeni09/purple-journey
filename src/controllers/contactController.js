const pool = require('../config/database');

const contactController = {
    submitContact: async (req, res) => {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        try {
            const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
            await pool.query(query, [name, email, message]);
            res.json({ message: 'Thank you for your message. We will get back to you soon!' });
        } catch (err) {
            console.error('Error saving contact form:', err);
            res.status(500).json({ error: 'Error saving your message' });
        }
    }
};

module.exports = contactController;
