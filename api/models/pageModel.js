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

// ➔ Voir toutes les pages visibles (optionnel par menu)
export const getVisiblePages = async (menuId = null) => {
    const db = await getDB()
    if (menuId) {
        return db.all(`SELECT * FROM pages WHERE visible = 1 AND menu_id = ? ORDER BY id`, [menuId])
    } else {
        return db.all(`SELECT * FROM pages WHERE visible = 1 ORDER BY id`)
    }
}

// ➔ Voir une seule page
export const getPageById = async (id) => {
    const db = await getDB()
    return db.get(`SELECT * FROM pages WHERE id = ? AND visible = 1`, [id])
}

// ➔ Créer une page
export const createPage = async ({ menuId, title, url, content, visible }) => {
    const db = await getDB()
    const result = await db.run(
        `INSERT INTO pages (menu_id, title, url, content, visible) VALUES (?, ?, ?, ?, ?)`,
        [menuId, title, url, content, visible]
    )
    return db.get(`SELECT * FROM pages WHERE id = ?`, [result.lastID])
}

// ➔ Modifier une page
export const updatePage = async (id, { menuId, title, url, content, visible }) => {
    const db = await getDB()
    await db.run(
        `UPDATE pages
         SET menu_id = ?, title = ?, url = ?, content = ?, visible = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [menuId, title, url, content, visible, id]
    )
    return db.get(`SELECT * FROM pages WHERE id = ?`, [id])
}

// ➔ Supprimer une page
export const deletePage = async (id) => {
    const db = await getDB()
    await db.run(`DELETE FROM pages WHERE id = ?`, [id])
}
