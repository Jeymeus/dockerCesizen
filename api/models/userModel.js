import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../database/cesizen.db')

// 
export const getDB = async () => {
    return open({ filename: dbPath, driver: sqlite3.Database })
}

// Liste de tous les utilisateurs (admin only)
export const findAllUsers = async () => {
    const db = await getDB()
    return db.all(`SELECT id, firstname, lastname, email, role, active, created_at, updated_at FROM users ORDER BY created_at DESC`)
}


// Trouver un utilisateur par son email
export const findUserByEmail = async (email) => {
    const db = await getDB()
    return db.get('SELECT * FROM users WHERE email = ?', [email])
}

// Trouver un utilisateur par son id
export const findUserById = async (id) => {
    const db = await getDB()
    return db.get('SELECT * FROM users WHERE id = ?', [id])
}

//
export const createUser = async ({ firstname, lastname, email, password, role }) => {
    const db = await getDB()
    const result = await db.run(
        'INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [firstname, lastname, email, password, role]
    )
    return findUserById(result.lastID)
}

// Modifier firstname / lastname / email (user ou admin)
export const updateUserProfile = async (id, { firstname, lastname, email }) => {
    const db = await getDB()
    await db.run(
        `UPDATE users SET firstname = ?, lastname = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [firstname, lastname, email, id]
    )
    return findUserById(id)
}

// Changer le rôle d'un utilisateur (admin only)
export const updateUserRole = async (id, role) => {
    const db = await getDB()
    await db.run(
        `UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [role, id]
    )
    return findUserById(id)
}

// Active/Désactive un utilisateur (admin only)
export const setUserActiveStatus = async (id, isActive) => {
    const db = await getDB();
    await db.run('UPDATE users SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [isActive ? 1 : 0, id]);
    return findUserById(id);
}


// Supprimer définitivement un utilisateur (admin only)
export const deleteUser = async (id) => {
    const db = await getDB()
    await db.run(
        `DELETE FROM users WHERE id = ?`,
        [id]
    )
}

