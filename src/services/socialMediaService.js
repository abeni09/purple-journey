const pool = require('../config/database');

async function getAllCounts() {
    try {
        const [rows] = await pool.query(
            'SELECT platform, follower_count, platform_url FROM social_media_counts ORDER BY platform'
        );
        return rows;
    } catch (error) {
        console.error('Error fetching social media counts:', error);
        throw error;
    }
}

async function updateCount(platform, count, url) {
    try {
        await pool.query(
            'UPDATE social_media_counts SET follower_count = ?, platform_url = ? WHERE platform = ?',
            [count, url, platform]
        );
        return { success: true };
    } catch (error) {
        console.error('Error updating social media count:', error);
        throw error;
    }
}

async function getPlatformCount(platform) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM social_media_counts WHERE platform = ?',
            [platform]
        );
        return rows[0] || null;
    } catch (error) {
        console.error(`Error fetching ${platform} count:`, error);
        throw error;
    }
}

module.exports = {
    getAllCounts,
    updateCount,
    getPlatformCount
};
