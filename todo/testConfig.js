// api/tests/setup/testConfig.js
import { beforeAll, afterAll } from 'vitest'
import mysql from 'mysql2/promise'
import { config } from 'dotenv'

// Charger les variables d'environnement de test
config({ path: '.env.test' })

let db

// Charger les variables d'environnement depuis le fichier .env.test
config({ path: '.env.test' })

// ⚠️ IMPORTANT: Ce code s'exécute directement, pas dans une fonction
beforeAll(async () => {
  console.log('🔧 Setup: Création de la base de données de test...')

  // Étape 1 : Connexion sans base pour la créer
  const tempConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'cesi',
    password: process.env.DB_PASSWORD || ''
  })
  await tempConn.query('CREATE DATABASE IF NOT EXISTS cesizen_test')
  await tempConn.end()

  // Étape 2 : Connexion au pool sur la vraie base
  db = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'cesi',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cesizen_test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })

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

  // Seed some test emotions
  await db.execute(`
        INSERT IGNORE INTO emotions (label, category, emoji) VALUES
        ('Joie', 'Joie', '😊'),
        ('Tristesse', 'Tristesse', '😢'),
        ('Colère', 'Colère', '😡'),
        ('Peur', 'Peur', '😱'),
        ('Surprise', 'Surprise', '😮'),
        ('Dégoût', 'Dégoût', '🤢')
    `)

  console.log('✅ Setup: Base de données de test prête!')
})

afterAll(async () => {
  console.log('🧹 Cleanup: Suppression de la base de données de test...')

  // Clean up and close connection
  await db.execute('DROP DATABASE IF EXISTS cesizen_test')
  await db.end()

  console.log('✅ Cleanup: Terminé!')
})

// Fonction utilitaire pour nettoyer entre les tests
export const cleanTestData = async () => {
  await db.execute('DELETE FROM entries')
  await db.execute('DELETE FROM pages')
  await db.execute('DELETE FROM users')
  await db.execute('DELETE FROM menus')
  // On garde les émotions car elles sont statiques
}