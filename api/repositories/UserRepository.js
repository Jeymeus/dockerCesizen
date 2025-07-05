import db from '../database/db.js';
import User from '../models/User.js';

class UserRepository {
    async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM users');
            return rows
                .map(row => {
                    try {
                        return new User(row);
                    } catch (e) {
                        console.error('[UserRepository] Erreur instanciation User:', e.message);
                        return null;
                    }
                })
                .filter(u => u !== null);
        } catch (err) {
            console.error('[UserRepository] Erreur findAll:', err.message);
            return [];
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
            const row = rows[0];
            return row ? new User(row) : null;
        } catch (e) {
            console.error('[UserRepository] Données corrompues:', e.message);
            return null;
        }
    }

    async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            const row = rows[0];
            return row ? new User(row) : null;
        } catch (e) {
            console.error('[UserRepository] Données corrompues:', e.message);
            return null;
        }
    }

    async create(data) {
        try {
            const [result] = await db.execute(`
        INSERT INTO users (firstname, lastname, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `, [
                data.firstname,
                data.lastname,
                data.email,
                data.password,
                data.role
            ]);
            return this.findById(result.insertId);
        } catch (err) {
            console.error('[UserRepository] Erreur création:', err.message);
            throw err;
        }
    }

    async update(id, data) {
        try {
            const fields = Object.keys(data);
            const values = Object.values(data);
            const setters = fields.map(f => `${f} = ?`).join(', ');
            await db.execute(
                `UPDATE users SET ${setters}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [...values, id]
            );
            return this.findById(id);
        } catch (err) {
            console.error('[UserRepository] Erreur update:', err.message);
            throw err;
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('[UserRepository] Erreur delete:', err.message);
            return false;
        }
    }

    async setActive(id, isActive) {
        try {
            await db.execute(`
        UPDATE users SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `, [isActive ? 1 : 0, id]);
            return this.findById(id);
        } catch (err) {
            console.error('[UserRepository] Erreur setActive:', err.message);
            throw err;
        }
    }

    async updateRole(id, role) {
        try {
            await db.execute(`
        UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `, [role, id]);
            return this.findById(id);
        } catch (err) {
            console.error('[UserRepository] Erreur updateRole:', err.message);
            throw err;
        }
    }
}

export const userRepository = new UserRepository();
