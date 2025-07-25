// api/tests/setup/testTables.js
import mysql from 'mysql2/promise'
import { config } from 'dotenv'

config({ path: '.env.test' })

let db

beforeAll(async () => {
    db = await mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10
    })

    await db.execute(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`)

    await db.execute(`CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'articles'
  )`)

    await db.execute(`CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    content TEXT,
    visible BOOLEAN DEFAULT 1,
    count_view INT DEFAULT 0,
    menu_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
  )`)

    await db.execute(`CREATE TABLE IF NOT EXISTS emotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(label, category)
  )`)

    await db.execute(`CREATE TABLE IF NOT EXISTS entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    emotion_id INT NOT NULL,
    note TEXT,
    date_entry DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (emotion_id) REFERENCES emotions(id)
  )`)

    await db.execute(`INSERT IGNORE INTO emotions (label, category, emoji) VALUES
    ('Joie', 'Joie', '😊'),
    ('Tristesse', 'Tristesse', '😢'),
    ('Colère', 'Colère', '😡'),
    ('Peur', 'Peur', '😱'),
    ('Surprise', 'Surprise', '😮'),
    ('Dégoût', 'Dégoût', '🤢')`)

    console.log('✅ Tables de test créées')
})


export { cleanTestData } from './cleanTestData.js'