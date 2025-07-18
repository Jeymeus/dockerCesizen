import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config() // Charger avant tout

import db from './database/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import emotionRoutes from './routes/emotionRoutes.js'
import entryRoutes from './routes/entryRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import pageRoutes from './routes/pageRoutes.js'

const app = express()

// 🛡️ Middlewares globaux
app.use(cors())
app.use(express.json())

// 🏠 Route de base pour tester
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API CesiZen fonctionne !',
        version: '1.0.0',
        status: 'OK'
    })
})

// 📦 Routes API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/emotions', emotionRoutes)
app.use('/api/entries', entryRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/pages', pageRoutes)


// 🚀 Lancement du serveur après test DB
const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        await db.execute('SELECT 1') // ping test
        console.log('✅ Connexion MariaDB établie avec succès')

        app.listen(PORT, () => {
            console.log(`🚀 API CesiZen en ligne : http://localhost:${PORT}`)
        })
    } catch (err) {
        console.error('❌ Échec de connexion à MariaDB :', err.message)
        process.exit(1)
    }
}

startServer()
