const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function initializeDatabase() {
    try {
        // Create connection without database
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        await connection.query(`USE ${DB_NAME}`);

        // Create users table with appropriate field lengths
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create social_media_counts table with appropriate field lengths
        await connection.query(`
            CREATE TABLE IF NOT EXISTS social_media_counts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                platform VARCHAR(30) NOT NULL UNIQUE,
                platform_url VARCHAR(200) NOT NULL,
                follower_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Insert default social media platforms if they don't exist
        const platforms = [
            ['telegram', 'https://t.me/purplejourney', 0],
            ['instagram', 'https://instagram.com/purplejourney', 0],
            ['youtube', 'https://youtube.com/@purplejourney', 0],
            ['tiktok', 'https://tiktok.com/@purplejourney', 0]
        ];

        for (const [platform, url, count] of platforms) {
            await connection.query(`
                INSERT IGNORE INTO social_media_counts (platform, platform_url, follower_count)
                VALUES (?, ?, ?)
            `, [platform, url, count]);
        }

        // Create default admin user if it doesn't exist
        const [adminExists] = await connection.query(
            'SELECT id FROM users WHERE username = ?',
            ['admin']
        );

        if (adminExists.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.query(`
                INSERT INTO users (username, email, password, role)
                VALUES (?, ?, ?, ?)
            `, ['admin', 'admin@purplejourney.com', hashedPassword, 'admin']);
            console.log('Default admin user created successfully');
        }

        console.log('Database initialized successfully');
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = initializeDatabase;
