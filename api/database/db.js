// database/db.js
import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Charger le bon fichier d'environnement selon le contexte
if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    config({ path: '.env.test' });
} else {
    config();
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cesizen',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;