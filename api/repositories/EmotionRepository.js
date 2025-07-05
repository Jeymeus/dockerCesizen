import db from '../database/db.js';
import Emotion from '../models/Emotion.js';

class EmotionRepository {
    async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM emotions ORDER BY label');

            return rows
                .map(row => {
                    try {
                        return new Emotion(row);
                    } catch (e) {
                        console.error('[EmotionRepository] Erreur instanciation Emotion:', e.message);
                        return null;
                    }
                })
                .filter(e => e !== null);
        } catch (err) {
            console.error('[EmotionRepository] Erreur findAll:', err.message);
            return [];
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM emotions WHERE id = ?', [id]);
            const row = rows[0];
            return row ? new Emotion(row) : null;
        } catch (e) {
            console.error('[EmotionRepository] Données corrompues:', e.message);
            return null;
        }
    }

    async create({ label, category, emoji }) {
        try {
            const [result] = await db.execute(
                `INSERT INTO emotions (label, category, emoji) VALUES (?, ?, ?)`,
                [label, category, emoji]
            );
            return this.findById(result.insertId);
        } catch (err) {
            console.error('[EmotionRepository] Erreur création:', err.message);
            throw err;
        }
    }

    async update(id, { label, category, emoji }) {
        try {
            await db.execute(
                `UPDATE emotions
                 SET label = ?, category = ?, emoji = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [label, category, emoji, id]
            );
            return this.findById(id);
        } catch (err) {
            console.error('[EmotionRepository] Erreur update:', err.message);
            throw err;
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM emotions WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('[EmotionRepository] Erreur delete:', err.message);
            return false;
        }
    }
}

export const emotionRepository = new EmotionRepository();
