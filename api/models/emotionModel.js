import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../database/cesizen.db')

const getDB = async () => {
    return open({ filename: dbPath, driver: sqlite3.Database })
}

export const getAllEmotions = async () => {
    const db = await getDB()
    return db.all(`SELECT * FROM emotions ORDER BY category, label`)
}

export const getAllCategories = async () => {
    const db = await getDB()
    return db.all('SELECT DISTINCT category FROM emotions ORDER BY category')
}
