const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const initializeDatabase = require('./config/initDb');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const contactRoutes = require('./routes/contactRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/contact', contactRoutes);
app.use('/api/social', socialMediaRoutes);
app.use('/api/auth', authRoutes);

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3003;

// Initialize database and start server
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
