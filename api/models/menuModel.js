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

export const getAllMenus = async () => {
    const db = await getDB()
    return db.all(`SELECT * FROM menus ORDER BY id`)
}

export const createMenu = async (title) => {
    const db = await getDB()
    const result = await db.run(`INSERT INTO menus (title) VALUES (?)`, [title])
    return db.get(`SELECT * FROM menus WHERE id = ?`, [result.lastID])
}

export const updateMenu = async (id, title) => {
    const db = await getDB()
    await db.run(`UPDATE menus SET title = ? WHERE id = ?`, [title, id])
    return db.get(`SELECT * FROM menus WHERE id = ?`, [id])
}

export const deleteMenu = async (id) => {
    const db = await getDB()
    await db.run(`DELETE FROM menus WHERE id = ?`, [id])
}
