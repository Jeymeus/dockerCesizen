// api/tests/setup/cleanTestData.js - Version avec DB unique par test
import mysql from 'mysql2/promise'
import { config } from 'dotenv'

config({ path: '.env.test' })

// ✅ Génère un nom de DB unique par run de test
const getUniqueDbName = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `cesizen_test_${timestamp}_${random}`
}

let currentDbName = null

export const createTestDatabase = async () => {
    currentDbName = getUniqueDbName()

    // Connexion sans DB pour la créer
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })

    await db.execute(`CREATE DATABASE \`${currentDbName}\``)
    await db.end()

    // Mettre à jour le nom de DB dans l'env
    process.env.DB_NAME = currentDbName

    return currentDbName
}

export const cleanTestData = async () => {
    if (!currentDbName) {
        currentDbName = process.env.DB_NAME
    }

    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: currentDbName
    })

    try {
        await db.execute('SET FOREIGN_KEY_CHECKS = 0')
        await db.execute('DELETE FROM entries')
        await db.execute('DELETE FROM pages')
        await db.execute('DELETE FROM users')
        await db.execute('DELETE FROM menus')
        await db.execute('DELETE FROM emotions')
        await db.execute('SET FOREIGN_KEY_CHECKS = 1')
    } finally {
        await db.end()
    }
}

export const dropTestDatabase = async () => {
    if (!currentDbName) return

    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })

    try {
        await db.execute(`DROP DATABASE IF EXISTS \`${currentDbName}\``)
    } finally {
        await db.end()
        currentDbName = null
    }
}