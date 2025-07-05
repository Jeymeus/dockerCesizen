import db from '../database/db.js';
import Menu from '../models/Menu.js';

class MenuRepository {
    async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM menus');

            return rows
                .map(row => {
                    try {
                        return new Menu(row);
                    } catch (e) {
                        console.error('[MenuRepository] Erreur instanciation Menu:', e.message);
                        return null;
                    }
                })
                .filter(m => m !== null);
        } catch (err) {
            console.error('[MenuRepository] Erreur findAll:', err.message);
            return [];
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM menus WHERE id = ?', [id]);
            const row = rows[0];

            return row ? new Menu(row) : null;
        } catch (e) {
            console.error('[MenuRepository] Données corrompues:', e.message);
            return null;
        }
    }

    async create(data) {
        try {
            const [result] = await db.execute(
                `INSERT INTO menus (title, type) VALUES (?, ?)`,
                [data.title, data.type || 'articles']
            );

            return this.findById(result.insertId);
        } catch (err) {
            console.error('[MenuRepository] Erreur create:', err.message);
            throw err;
        }
    }

    async update(id, data) {
        try {
            await db.execute(
                `UPDATE menus SET title = ?, type = ? WHERE id = ?`,
                [data.title, data.type, id]
            );

            return this.findById(id);
        } catch (err) {
            console.error('[MenuRepository] Erreur update:', err.message);
            throw err;
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM menus WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('[MenuRepository] Erreur delete:', err.message);
            return false;
        }
    }
}

export const menuRepository = new MenuRepository();
