import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null

export const initDB = async () => {
  if (db) return db

  db = new Database(path.join(__dirname, 'cesizen.db'))
  db.pragma('foreign_keys = ON')

  // On ne recrée pas les tables, mais on s'assure qu'elles existent
  db.exec(`
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
  // db.exec(`
  //   INSERT OR IGNORE INTO emotions (label, category) VALUES
  //   ('Fierté', 'Joie'),
  //   ('Contentement', 'Joie'),
  //   ('Enchantement', 'Joie'),
  //   ('Excitation', 'Joie'),
  //   ('Émerveillement', 'Joie'),
  //   ('Gratitude', 'Joie'),

  //   ('Frustration', 'Colère'),
  //   ('Irritation', 'Colère'),
  //   ('Rage', 'Colère'),
  //   ('Ressentiment', 'Colère'),
  //   ('Agacement', 'Colère'),
  //   ('Hostilité', 'Colère'),

  //   ('Inquiétude', 'Peur'),
  //   ('Anxiété', 'Peur'),
  //   ('Terreur', 'Peur'),
  //   ('Appréhension', 'Peur'),
  //   ('Panique', 'Peur'),
  //   ('Crainte', 'Peur'),

  //   ('Chagrin', 'Tristesse'),
  //   ('Mélancolie', 'Tristesse'),
  //   ('Abattement', 'Tristesse'),
  //   ('Désespoir', 'Tristesse'),
  //   ('Solitude', 'Tristesse'),
  //   ('Dépression', 'Tristesse'),

  //   ('Étonnement', 'Surprise'),
  //   ('Stupéfaction', 'Surprise'),
  //   ('Sidération', 'Surprise'),
  //   ('Incrédulité', 'Surprise'),
  //   ('Émerveillement', 'Surprise'),
  //   ('Confusion', 'Surprise'),

  //   ('Répulsion', 'Dégoût'),
  //   ('Déplaisir', 'Dégoût'),
  //   ('Nausée', 'Dégoût'),
  //   ('Dédain', 'Dégoût'),
  //   ('Horreur', 'Dégoût'),
  //   ('Dégoût profond', 'Dégoût');
  // `)

//   db.exec(`INSERT INTO pages (title, url, content, visible, count_view, menu_id, created_at)
// VALUES
// -- Article 1
// ('Comprendre ses émotions au quotidien', 'https://example.com/emotions-quotidien',
//  'Un article pour mieux appréhender la palette émotionnelle que nous vivons chaque jour.', 1, 0, 1, CURRENT_TIMESTAMP),

// -- Article 2
// ('Les émotions dans le milieu professionnel', 'https://example.com/emotions-travail',
//  'Découvrez comment la gestion émotionnelle influence notre vie au travail.', 1, 0, 1, CURRENT_TIMESTAMP),

// -- Article 3
// ('Éducation émotionnelle : un enjeu de société', 'https://example.com/education-emotionnelle',
//  'Pourquoi enseigner les émotions dès le plus jeune âge est essentiel.', 1, 0, 1, CURRENT_TIMESTAMP),

// -- Article 4
// ('Intelligence émotionnelle et leadership', 'https://example.com/intelligence-emotionnelle-leadership',
//  'Le lien entre émotions maîtrisées et capacité à diriger.', 1, 0, 1, CURRENT_TIMESTAMP),

// -- Article 5
// ('Santé mentale et émotions : quelles connexions ?', 'https://example.com/sante-mentale-emotions',
//  'Une plongée dans les liens entre équilibre émotionnel et bien-être psychique.', 1, 0, 1, CURRENT_TIMESTAMP),

// -- Article 6
// ('Exprimer ses émotions : force ou faiblesse ?', 'https://example.com/exprimer-emotions',
//  'Briser les tabous sur la vulnérabilité émotionnelle dans nos sociétés.', 1, 0, 1, CURRENT_TIMESTAMP),

// -- Article 7
// ('Les émotions sur les réseaux sociaux', 'https://example.com/emotions-reseaux-sociaux',
//  'Comment nos émotions sont exposées, influencées et manipulées en ligne.', 1, 0, 1, CURRENT_TIMESTAMP),

// -- Article 8
// ('Gérer ses émotions en période de crise', 'https://example.com/emotions-crise',
//  'Des techniques concrètes pour garder son calme en situation difficile.', 1, 0, 1, CURRENT_TIMESTAMP);
//   `)

//   db.exec(`INSERT INTO pages (title, url, content, visible, count_view, menu_id, created_at)
// VALUES
// -- Vidéo 1
// ('Les émotions pour enfants | Apprendre à reconnaître et exprimer ses émotions', 'https://www.youtube.com/watch?v=I_YK-E3wkbw',
//  'Vidéo éducative pour aider les tout-petits à identifier et exprimer des émotions comme la joie, la colère, la peur.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 2
// ('Les émotions CP - CE1 - Cycle 2 - Enseignement moral et civique', 'https://www.youtube.com/watch?v=y_UshMDcnV4',
//  'Destinée aux élèves du cycle 2, cette vidéo explore la palette des émotions humaines.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 3
// ('Vocabulaire : les émotions || Français', 'https://www.youtube.com/watch?v=cgdc2IQbLyc',
//  'Apprendre à nommer et reconnaître plus de 30 émotions en français.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 4
// ('Parler des sentiments et des émotions - Vocabulaire français', 'https://www.youtube.com/watch?v=V18sioFhnyU',
//  'Présentation illustrée du vocabulaire des sentiments en français.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 5
// ('Les émotions en français. Apprendre les sentiments en français', 'https://www.youtube.com/watch?v=FpPiYXkGx4c',
//  'Exemples de phrases pour apprendre à exprimer les émotions dans la vie quotidienne.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 6
// ('Comment on dit #18 : les sentiments et les émotions en français', 'https://www.youtube.com/watch?v=OAbHzc5t70U',
//  'Comment parler de ses sentiments en français, du niveau A1 à C2.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 7
// ('Les émotions / Emotions #learning #french #english', 'https://www.youtube.com/watch?v=aOYdpxNCXSE',
//  'Apprentissage bilingue des émotions en français et en anglais.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 8
// ('Les émotions expliquées aux enfants', 'https://www.youtube.com/watch?v=vjKkD3N9y3g',
//  'Une explication simple des émotions primaires pour les plus jeunes.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 9
// ('Apprendre à reconnaître ses émotions', 'https://www.youtube.com/watch?v=2VyaW0SxxJ8',
//  'Des techniques ludiques pour identifier ses émotions au quotidien.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 10
// ('Gérer ses émotions pour mieux vivre', 'https://www.youtube.com/watch?v=fm4R4JzTzG0',
//  'Conseils pour mieux comprendre et gérer ses émotions.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 11
// ('L’intelligence émotionnelle : c’est quoi ?', 'https://www.youtube.com/watch?v=QQZxK-eBJEg',
//  'Présentation claire de l’intelligence émotionnelle et de ses bénéfices.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 12
// ('Les émotions : pourquoi et comment les exprimer ?', 'https://www.youtube.com/watch?v=2UtSWT8GkHs',
//  'Pourquoi il est important d’exprimer ses émotions et comment y parvenir.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 13
// ('Les émotions négatives : en faire une force', 'https://www.youtube.com/watch?v=7I8A4zz0HuA',
//  'Transformer la colère, la peur ou la tristesse en leviers d’action.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 14
// ('La roue des émotions de Plutchik', 'https://www.youtube.com/watch?v=3cqV4kzTjUU',
//  'Découverte de la roue de Plutchik, outil visuel pour comprendre les émotions.', 1, 0, 4, CURRENT_TIMESTAMP),

// -- Vidéo 15
// ('5 techniques pour calmer ses émotions fortes', 'https://www.youtube.com/watch?v=_aqTkN9S7PQ',
//  'Apprendre à se recentrer face à une émotion débordante.', 1, 0, 4, CURRENT_TIMESTAMP);
// `)

  console.log('✅ Base de données SQLite initialisée avec succès')
  return db
}

// 🆕 Getter dynamique pour récupérer db après initialisation
export const getDB = () => {
  if (!db) throw new Error('La base de données n\'a pas été initialisée.')
  return db
}
