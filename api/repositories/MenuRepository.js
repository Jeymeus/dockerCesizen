import { initDB, getDB } from '../database/init.js'
import Menu from '../models/Menu.js'

class MenuRepository {
    async findAll() {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('SELECT * FROM menus')
        const rows = stmt.all()

        return rows
            .map(row => {
                try {
                    return new Menu(row)
                } catch (e) {
                    console.error('[MenuRepository] Erreur instanciation Menu:', e.message)
                    return null
                }
            })
            .filter(m => m !== null)
    }

    async findById(id) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('SELECT * FROM menus WHERE id = ?')
        const row = stmt.get(id)

        try {
            return row ? new Menu(row) : null
        } catch (e) {
            console.error('[MenuRepository] Données corrompues:', e.message)
            return null
        }
    }

    async create(data) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare(`
            INSERT INTO menus (title, position, visible)
            VALUES (?, ?, ?)
        `)
        const result = stmt.run(data.title, data.position, data.visible)
        return this.findById(result.lastInsertRowid)
    }

    async update(id, data) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare(`
            UPDATE menus
            SET title = ?, position = ?, visible = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)
        stmt.run(data.title, data.position, data.visible, id)
        return this.findById(id)
    }

    async delete(id) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('DELETE FROM menus WHERE id = ?')
        const result = stmt.run(id)
        return result.changes > 0
    }
}

export const menuRepository = new MenuRepository()
