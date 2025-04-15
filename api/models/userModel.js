import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../database/cesizen.db')

export const getDB = async () => {
    return open({ filename: dbPath, driver: sqlite3.Database })
}

export const findUserByEmail = async (email) => {
    const db = await getDB()
    return db.get('SELECT * FROM users WHERE email = ?', [email])
}

export const findUserById = async (id) => {
    const db = await getDB()
    return db.get('SELECT * FROM users WHERE id = ?', [id])
}

export const createUser = async ({ firstname, lastname, email, password, role }) => {
    const db = await getDB()
    const result = await db.run(
        'INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [firstname, lastname, email, password, role]
    )
    return findUserById(result.lastID)
}
