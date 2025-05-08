import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { initDB } from './database/init.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import emotionRoutes from './routes/emotionRoutes.js'
import entryRoutes from './routes/entryRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import pageRoutes from './routes/pageRoutes.js'

// 🔧 Chargement des variables d'environnement
dotenv.config()

// 🔌 Initialisation de la base SQLite
await initDB()

const app = express()

// 🛡️ Middlewares globaux
app.use(cors())
app.use(express.json())

// 📦 Routes API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/emotions', emotionRoutes)
app.use('/api/entries', entryRoutes)      // anciennement "journal"
app.use('/api/menus', menuRoutes)
app.use('/api/pages', pageRoutes)

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`✅ API CesiZen en ligne : http://localhost:${PORT}`)
})
