require('dotenv').config();

module.exports = {
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        channelUsername: process.env.TELEGRAM_CHANNEL_USERNAME
    },
    instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
        userId: process.env.INSTAGRAM_USER_ID
    },
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY,
        channelId: process.env.YOUTUBE_CHANNEL_ID
    },
    tiktok: {
        accessToken: process.env.TIKTOK_ACCESS_TOKEN,
        openApiKey: process.env.TIKTOK_OPEN_API_KEY
    }
};
