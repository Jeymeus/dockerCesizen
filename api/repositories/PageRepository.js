import db from '../database/db.js';
import Page from '../models/Page.js';

class PageRepository {
    async findAllVisible(menuId = null) {
        try {
            const query = menuId
                ? 'SELECT * FROM pages WHERE visible = 1 AND menu_id = ? ORDER BY id'
                : 'SELECT * FROM pages WHERE visible = 1 ORDER BY id';

            const [rows] = await db.execute(query, menuId ? [menuId] : []);

            return rows
                .map(row => {
                    try {
                        return new Page(row);
                    } catch (e) {
                        console.error('[PageRepository] Erreur instanciation Page:', e.message);
                        return null;
                    }
                })
                .filter(p => p !== null);
        } catch (err) {
            console.error('[PageRepository] Erreur findAllVisible:', err.message);
            return [];
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM pages WHERE id = ?', [id]);
            const row = rows[0];
            return row ? new Page(row) : null;
        } catch (e) {
            console.error('[PageRepository] Données corrompues:', e.message);
            return null;
        }
    }

    async create(data) {
        try {
            const [result] = await db.execute(`
        INSERT INTO pages (menu_id, title, url, content, visible)
        VALUES (?, ?, ?, ?, ?)
      `, [
                data.menuId,
                data.title,
                data.url,
                data.content,
                data.visible
            ]);

            return this.findById(result.insertId);
        } catch (err) {
            console.error('[PageRepository] Erreur création:', err.message);
            throw err;
        }
    }

    async update(id, data) {
        try {
            await db.execute(`
        UPDATE pages
        SET menu_id = ?, title = ?, url = ?, content = ?, visible = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
                data.menuId,
                data.title,
                data.url,
                data.content,
                data.visible,
                id
            ]);

            return this.findById(id);
        } catch (err) {
            console.error('[PageRepository] Erreur update:', err.message);
            throw err;
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM pages WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('[PageRepository] Erreur delete:', err.message);
            return false;
        }
    }

    async findByMenuId(menuId) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM pages WHERE menu_id = ? AND visible = 1',
                [menuId]
            );
            return rows.map(row => new Page(row));
        } catch (err) {
            console.error('[PageRepository] Erreur findByMenuId:', err.message);
            return [];
        }
    }
}

export const pageRepository = new PageRepository();
