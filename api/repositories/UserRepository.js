import { initDB, getDB } from '../database/init.js'
import User from '../models/User.js'

class UserRepository {
    async findAll() {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('SELECT * FROM users')
        const rows = stmt.all()

        return rows
            .map(row => {
                try {
                    return new User(row)
                } catch (e) {
                    console.error('[UserRepository] Erreur instanciation User:', e.message)
                    return null
                }
            })
            .filter(u => u !== null)
    }

    async findById(id) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
        const row = stmt.get(id)

        try {
            return row ? new User(row) : null
        } catch (e) {
            console.error('[UserRepository] Données corrompues:', e.message)
            return null
        }
    }

    async findByEmail(email) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
        const row = stmt.get(email)

        try {
            return row ? new User(row) : null
        } catch (e) {
            console.error('[UserRepository] Données corrompues:', e.message)
            return null
        }
    }

    async create(data) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare(`
            INSERT INTO users (firstname, lastname, email, password, role)
            VALUES (?, ?, ?, ?, ?)
        `)
        const result = stmt.run(
            data.firstname,
            data.lastname,
            data.email,
            data.password,
            data.role
        )
        return this.findById(result.lastInsertRowid)
    }

    async update(id, data) {
        await initDB()
        const db = getDB()

        const fields = Object.keys(data)
        const values = Object.values(data)
        const setters = fields.map(f => `${f} = ?`).join(', ')
        const stmt = db.prepare(
            `UPDATE users SET ${setters}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
        stmt.run(...values, id)
        return this.findById(id)
    }

    async delete(id) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare('DELETE FROM users WHERE id = ?')
        const result = stmt.run(id)
        return result.changes > 0
    }

    async setActive(id, isActive) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare(`
            UPDATE users SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `)
        stmt.run(isActive ? 1 : 0, id)
        return this.findById(id)
    }

    async updateRole(id, role) {
        await initDB()
        const db = getDB()

        const stmt = db.prepare(`
            UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `)
        stmt.run(role, id)
        return this.findById(id)
    }
}

export const userRepository = new UserRepository()
