import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { initDB } from './database/init.js'
import emotionRoutes from './routes/emotionRoutes.js'
import journalRoutes from './routes/journalRoutes.js'

dotenv.config() // Charge le .env AVANT d'en avoir besoin

// Initialise la base SQLite
await initDB()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/emotions', emotionRoutes)
app.use('/api/journal', journalRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Serveur API lancé sur http://localhost:${PORT}`))
