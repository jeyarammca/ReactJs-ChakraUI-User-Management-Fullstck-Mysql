require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        console.log('Connecting to MySQL...');
        
        // Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database "${process.env.DB_NAME}" created or already exists.`);

        // Switch to the database
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);

        // Read schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');

        // Split by semicolon and filter out empty strings
        const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

        console.log('Executing schema statements...');
        for (let statement of statements) {
            // Skip USE and CREATE DATABASE as we already handled them or want to be safe
            if (statement.toUpperCase().startsWith('CREATE DATABASE') || statement.toUpperCase().startsWith('USE')) {
                continue;
            }
            await connection.query(statement);
        }

        console.log('Database setup complete!');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await connection.end();
    }
}

setupDatabase();
