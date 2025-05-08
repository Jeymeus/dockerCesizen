import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null

// Fonction d'initialisation de la base de données (Singleton)
export const initDB = async () => {
  if (db) return db  // Si la base est déjà initialisée, on renvoie l'instance existante
  db = await open({
    filename: path.join(__dirname, 'cesizen.db'),
    driver: sqlite3.Database
  })

  // Active les contraintes de clé étrangère
  await db.exec('PRAGMA foreign_keys = ON;')

  // On ne recrée pas les tables, mais on s'assure qu'elles existent
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      content TEXT,
      visible INTEGER DEFAULT 1,
      count_view INTEGER DEFAULT 0,
      menu_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (menu_id) REFERENCES menus(id)
    );

    CREATE TABLE IF NOT EXISTS emotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      category TEXT NOT NULL,
      emoji TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      UNIQUE(label, category)
    );

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      emotion_id INTEGER NOT NULL,
      note TEXT,
      date_entry DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (emotion_id) REFERENCES emotions(id)
    );
  `)

  // Insérer les émotions préconfigurées si elles n'existent pas
  await db.exec(`
    INSERT OR IGNORE INTO emotions (label, category) VALUES
    ('Fierté', 'Joie'),
    ('Contentement', 'Joie'),
    ('Enchantement', 'Joie'),
    ('Excitation', 'Joie'),
    ('Émerveillement', 'Joie'),
    ('Gratitude', 'Joie'),

    ('Frustration', 'Colère'),
    ('Irritation', 'Colère'),
    ('Rage', 'Colère'),
    ('Ressentiment', 'Colère'),
    ('Agacement', 'Colère'),
    ('Hostilité', 'Colère'),

    ('Inquiétude', 'Peur'),
    ('Anxiété', 'Peur'),
    ('Terreur', 'Peur'),
    ('Appréhension', 'Peur'),
    ('Panique', 'Peur'),
    ('Crainte', 'Peur'),

    ('Chagrin', 'Tristesse'),
    ('Mélancolie', 'Tristesse'),
    ('Abattement', 'Tristesse'),
    ('Désespoir', 'Tristesse'),
    ('Solitude', 'Tristesse'),
    ('Dépression', 'Tristesse'),

    ('Étonnement', 'Surprise'),
    ('Stupéfaction', 'Surprise'),
    ('Sidération', 'Surprise'),
    ('Incrédulité', 'Surprise'),
    ('Émerveillement', 'Surprise'),
    ('Confusion', 'Surprise'),

    ('Répulsion', 'Dégoût'),
    ('Déplaisir', 'Dégoût'),
    ('Nausée', 'Dégoût'),
    ('Dédain', 'Dégoût'),
    ('Horreur', 'Dégoût'),
    ('Dégoût profond', 'Dégoût');
  `)

  console.log('✅ Base de données SQLite initialisée avec succès')
  return db
}

// Exporter l'instance DB pour les autres fichiers
export default db
