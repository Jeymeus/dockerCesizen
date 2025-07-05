// api/tests/setup/testConfig.js
import { beforeAll, afterAll } from 'vitest'
import db from '../database/db.js'

export const setupTestDatabase = () => {
    beforeAll(async () => {
        // Switch to test database
        await db.execute('CREATE DATABASE IF NOT EXISTS cesizen_test')
        await db.execute('USE cesizen_test')

        // Create tables
        await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

        await db.execute(`
      CREATE TABLE IF NOT EXISTS menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'articles'
      )
    `)

        await db.execute(`
      CREATE TABLE IF NOT EXISTS pages (
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
      )
    `)

        await db.execute(`
      CREATE TABLE IF NOT EXISTS emotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        emoji VARCHAR(10),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE(label, category)
      )
    `)

        await db.execute(`
      CREATE TABLE IF NOT EXISTS entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        emotion_id INT NOT NULL,
        note TEXT,
        date_entry DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (emotion_id) REFERENCES emotions(id)
      )
    `)
    })

    afterAll(async () => {
        // Clean up and close connection
        await db.execute('DROP DATABASE IF EXISTS cesizen_test')
        await db.end()
    })
}
