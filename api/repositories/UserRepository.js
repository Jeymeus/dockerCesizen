import db from '../database/init.js'
import User from '../models/User.js'

class UserRepository {
    findAll() {
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

    findById(id) {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
        const row = stmt.get(id)

        try {
            return row ? new User(row) : null
        } catch (e) {
            console.error('[UserRepository] Données corrompues:', e.message)
            return null
        }
    }

    findByEmail(email) {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
        const row = stmt.get(email)

        try {
            return row ? new User(row) : null
        } catch (e) {
            console.error('[UserRepository] Données corrompues:', e.message)
            return null
        }
    }

    create(data) {
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

    update(id, data) {
        const fields = Object.keys(data)
        const values = Object.values(data)
        const setters = fields.map(f => `${f} = ?`).join(', ')
        const stmt = db.prepare(
            `UPDATE users SET ${setters}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
        stmt.run(...values, id)
        return this.findById(id)
    }

    delete(id) {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?')
        const result = stmt.run(id)
        return result.changes > 0
    }

    setActive(id, isActive) {
        const stmt = db.prepare(`
      UPDATE users SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
        stmt.run(isActive ? 1 : 0, id)
        return this.findById(id)
    }

    updateRole(id, role) {
        const stmt = db.prepare(`
      UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
        stmt.run(role, id)
        return this.findById(id)
    }
}

export const userRepository = new UserRepository()
