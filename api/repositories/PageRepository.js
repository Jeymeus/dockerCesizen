import { initDB, getDB } from '../database/init.js'
import Page from '../models/Page.js'

class PageRepository {
    async findAllVisible(menuId = null) {
        await initDB()
        const db = getDB()

        const stmt = menuId
            ? db.prepare('SELECT * FROM pages WHERE visible = 1 AND menu_id = ? ORDER BY id')
            : db.prepare('SELECT * FROM pages WHERE visible = 1 ORDER BY id')

        const rows = menuId ? stmt.all(menuId) : stmt.all()

        return rows
            .map(row => {
                try {
                    return new Page(row)
                } catch (e) {
                    console.error('[PageRepository] Erreur instanciation Page:', e.message)
                    return null
                }
            })
            .filter(p => p !== null)
    }

    async findById(id) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('SELECT * FROM pages WHERE id = ?')
        const row = stmt.get(id)

        try {
            return row ? new Page(row) : null
        } catch (e) {
            console.error('[PageRepository] Données corrompues:', e.message)
            return null
        }
    }

    async create(data) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare(`
            INSERT INTO pages (menu_id, title, url, content, visible)
            VALUES (?, ?, ?, ?, ?)
        `)
        const result = stmt.run(
            data.menuId,
            data.title,
            data.url,
            data.content,
            data.visible
        )
        return this.findById(result.lastInsertRowid)
    }

    async update(id, data) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare(`
            UPDATE pages
            SET menu_id = ?, title = ?, url = ?, content = ?, visible = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)
        stmt.run(
            data.menuId,
            data.title,
            data.url,
            data.content,
            data.visible,
            id
        )
        return this.findById(id)
    }

    async delete(id) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('DELETE FROM pages WHERE id = ?')
        const result = stmt.run(id)
        return result.changes > 0
    }

    async findByMenuId(menuId) {
        await initDB()
        const db = getDB()
        const stmt = db.prepare('SELECT * FROM pages WHERE menu_id = ? AND visible = 1')
        const rows = stmt.all(menuId)
        return rows.map(row => new Page(row))
    }
      
}

export const pageRepository = new PageRepository()
