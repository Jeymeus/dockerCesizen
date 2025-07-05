// ========================================
// TEST UNITAIRE - authController.test.js
// ========================================

describe('register', () => {
    it('should register a new user successfully', async () => {
      // ARRANGE : On mocke toutes les dépendances
      userRepository.findByEmail.mockResolvedValue(null)           // ← FAKE
      bcrypt.hash.mockResolvedValue('hashedPassword123')           // ← FAKE
      userRepository.create.mockResolvedValue(mockUser)            // ← FAKE
      generateToken.mockReturnValue('jwt-token-123')              // ← FAKE
  
      // ACT : On appelle directement la fonction
      await register(req, res)
  
      // ASSERT : On vérifie que la logique est correcte
      expect(userRepository.create).toHaveBeenCalledWith({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'hashedPassword123',
        role: 'user'
      })
    })
  })
  
  // QUE TESTE-T-ON ?
  // ✅ La logique du controller (if/else, transformations, etc.)
  // ✅ Les appels aux bonnes méthodes avec les bons paramètres
  // ✅ La gestion des erreurs
  // ❌ Pas la vraie base de données
  // ❌ Pas les middlewares
  // ❌ Pas la sérialisation HTTP
  
  // ========================================
  // TEST INTÉGRATION - auth.integration.test.js
  // ========================================
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // ARRANGE : Vraies données
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'password123'
      }
  
      // ACT : Vraie requête HTTP complète
      const response = await request(app)
        .post('/api/auth/register')    // ← VRAIE ROUTE
        .send(userData)                // ← VRAIE SÉRIALISATION
  
      // ASSERT : Vraie réponse HTTP
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('token')
      expect(response.body.user.email).toBe('john@test.com')
      
      // Vérification en base que l'utilisateur existe vraiment
      const [users] = await db.execute('SELECT * FROM users WHERE email = ?', ['john@test.com'])
      expect(users).toHaveLength(1)
    })
  })
  
  // QUE TESTE-T-ON ?
  // ✅ Le pipeline HTTP complet (routing, middlewares, controller, response)
  // ✅ La vraie base de données (insertion, contraintes, etc.)
  // ✅ La sérialisation/désérialisation JSON
  // ✅ L'authentification JWT
  // ✅ Les validations express-validator
  // ✅ Le comportement réel de l'API
  
  // ========================================
  // PYRAMIDE DES TESTS
  // ========================================
  
  /*
                      /\
                     /  \
                    / E2E \     ← Peu, lents, très réalistes
                   /______\
                  /        \
                 / INTÉGRA  \   ← Moyennement, moyens, réalistes
                /____________\
               /              \
              /   UNITAIRES    \  ← Beaucoup, rapides, isolés
             /________________\
  
  RÈGLE : 70% unitaires, 20% intégration, 10% E2E
  */
  
  // ========================================
  // QUAND UTILISER QUOI ?
  // ========================================
  
  // TESTS UNITAIRES pour :
  // ✅ Logique métier complexe
  // ✅ Calculs, transformations
  // ✅ Gestion d'erreurs
  // ✅ Cas limites (edge cases)
  // ✅ Développement TDD
  
  // TESTS INTÉGRATION pour :
  // ✅ Endpoints API complets
  // ✅ Interactions base de données
  // ✅ Middlewares d'authentification
  // ✅ Validation des données
  // ✅ Workflows complets
  
  // EXEMPLE CONCRET DANS VOTRE PROJET :
  
  // TEST UNITAIRE : "La fonction register() hash-t-elle bien le mot de passe ?"
  // TEST INTÉGRATION : "L'endpoint POST /auth/register crée-t-il bien un utilisateur en base ?"



// ========================================
// QUE FAIT LE SETUP DE TEST ?
// ========================================

// 1. ISOLATION DES TESTS
// Le setup crée une base de données séparée pour les tests
beforeAll(async () => {
  await db.execute('CREATE DATABASE IF NOT EXISTS cesizen_test')  // ← DB SÉPARÉE
  await db.execute('USE cesizen_test')                            // ← SWITCH TO TEST DB
})

// POURQUOI ? 
// ✅ Les tests n'interfèrent PAS avec vos vraies données
// ✅ Vous pouvez développer pendant que les tests tournent
// ✅ Pas de risque de corrompre votre DB de développement

// ========================================
// 2. STRUCTURE DE BASE DE DONNÉES IDENTIQUE
// ========================================

// Le setup recrée EXACTEMENT la même structure que votre vraie DB
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
// + toutes les autres tables...

// POURQUOI ?
// ✅ Tests d'intégration peuvent utiliser de VRAIES requêtes SQL
// ✅ Contraintes de clés étrangères testées
// ✅ Indexes, types de données, validations DB testés

// ========================================
// 3. NETTOYAGE AUTOMATIQUE
// ========================================

afterAll(async () => {
  await db.execute('DROP DATABASE IF EXISTS cesizen_test')  // ← CLEANUP
  await db.end()                                            // ← CLOSE CONNECTION
})

// POURQUOI ?
// ✅ Pas d'accumulation de données de test
// ✅ Chaque run de test repart de zéro
// ✅ Pas de fuites de connexions

// ========================================
// CONFIGURATION DANS vitest.config.js
// ========================================

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup/testConfig.js'],  // ← EXÉCUTÉ AVANT TOUS LES TESTS
    // ...
  }
})

// ========================================
// CYCLE DE VIE COMPLET
// ========================================

/*
1. 🚀 npm run test
2. 📋 Vitest lit vitest.config.js
3. 🔧 Exécute setupFiles (testConfig.js)
 ├── Crée cesizen_test DB
 ├── Crée toutes les tables
 └── Configure l'environnement
4. ▶️ Exécute tous les tests .test.js
 ├── auth.integration.test.js
 ├── users.integration.test.js
 └── etc.
5. 🧹 Cleanup automatique
 ├── Drop cesizen_test DB
 └── Ferme connexions
6. ✅ Tests terminés
*/

// ========================================
// AVANTAGES DU SETUP
// ========================================

// ✅ ISOLATION
beforeEach(async () => {
  await db.execute('DELETE FROM users')  // ← Chaque test repart propre
})

// ✅ RÉUTILISABILITÉ  
// Tous vos tests d'intégration utilisent la même config

// ✅ COHÉRENCE
// Structure DB identique = comportement identique

// ✅ RAPIDITÉ
// Pas besoin de recréer la DB à chaque test

// ========================================
// SANS SETUP vs AVEC SETUP
// ========================================

// ❌ SANS SETUP - Dans chaque fichier de test :
describe('Users Integration', () => {
  beforeAll(async () => {
    // 😰 Répété dans CHAQUE fichier de test
    await db.execute('CREATE DATABASE cesizen_test')
    await db.execute('USE cesizen_test')
    await db.execute('CREATE TABLE users...')
    await db.execute('CREATE TABLE menus...')
    await db.execute('CREATE TABLE pages...')
    // etc.
  })
})

// ✅ AVEC SETUP - Configuration centralisée :
// testConfig.js fait tout ça UNE SEULE FOIS pour TOUS les tests

// ========================================
// SETUP AVANCÉ - Ce qu'on pourrait ajouter
// ========================================

export const setupTestDatabase = () => {
  beforeAll(async () => {
    // Configuration DB
    await createTestDatabase()

    // 🔧 Configuration des variables d'environnement
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = 'test-secret'

    // 📊 Données de test communes
    await seedTestData()

    // 🔍 Configuration des logs
    console.log = vi.fn() // Silence les logs pendant tests
  })

  beforeEach(async () => {
    // 🧹 Nettoyage entre chaque test
    await cleanDatabase()
  })

  afterAll(async () => {
    // 🗑️ Cleanup final
    await dropTestDatabase()
  })
}

// ========================================
// DONNÉES DE TEST PARTAGÉES
// ========================================

const seedTestData = async () => {
  // Émotions de test
  await db.execute(`
      INSERT INTO emotions (label, category, emoji) VALUES
      ('Joie', 'Positive', '😊'),
      ('Tristesse', 'Négative', '😢'),
      ('Colère', 'Négative', '😡')
  `)

  // Menus de test
  await db.execute(`
      INSERT INTO menus (title, type) VALUES
      ('Articles', 'articles'),
      ('Vidéos', 'videos')
  `)
}

// ========================================
// RÉSUMÉ
// ========================================

/*
Le setup de test c'est comme préparer une cuisine avant de cuisiner :

🏠 SETUP = Préparer la cuisine
├── 🔧 Installer les équipements (tables DB)
├── 🧹 Nettoyer les surfaces (vider les données)
├── 📦 Sortir les ingrédients (données de test)
└── 🔥 Allumer le four (connexions DB)

🍳 TESTS = Cuisiner les plats
├── Test 1: Faire un gâteau
├── Test 2: Cuisiner des pâtes  
└── Test 3: Préparer une salade

🧽 CLEANUP = Nettoyer la cuisine
├── 🗑️ Jeter les déchets (drop DB)
├── 🧼 Laver la vaisselle (close connections)
└── 🔒 Fermer la cuisine (fin des tests)

SANS setup = refaire toute la préparation pour CHAQUE plat 😵
AVEC setup = préparer UNE FOIS, cuisiner N fois 🎯
*/