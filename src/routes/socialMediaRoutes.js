const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const socialMediaService = require('../services/socialMediaService');

// Get all social media counts (public route)
router.get('/counts', async (req, res) => {
    try {
        const counts = await socialMediaService.getAllCounts();
        res.json(counts);
    } catch (error) {
        console.error('Error in /counts route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update social media count (protected route)
router.put('/update/:platform', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { platform } = req.params;
        const { count, url } = req.body;

        if (!count || count < 0) {
            return res.status(400).json({ error: 'Valid count is required' });
        }

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        await socialMediaService.updateCount(platform, count, url);
        res.json({ success: true, message: 'Count updated successfully' });
    } catch (error) {
        console.error('Error in update route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
