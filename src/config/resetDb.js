const mysql = require('mysql2/promise');
require('dotenv').config();
const initializeDatabase = require('./initDb');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function resetDatabase() {
    try {
        // Create connection without database
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        // Drop database if exists
        await connection.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
        console.log('Database dropped successfully');

        // Initialize fresh database
        await connection.end();
        await initializeDatabase();
        
        console.log('Database reset completed successfully');
    } catch (error) {
        console.error('Error resetting database:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    resetDatabase().catch(console.error);
}

module.exports = resetDatabase;
