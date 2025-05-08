import db from '../database/init.js'
import Emotion from '../models/Emotion.js'

class EmotionRepository {
    findAll() {
        const stmt = db.prepare('SELECT * FROM emotions ORDER BY label')
        const rows = stmt.all()

        return rows
            .map(row => {
                try {
                    return new Emotion(row)
                } catch (e) {
                    console.error('[EmotionRepository] Erreur instanciation Emotion:', e.message)
                    return null
                }
            })
            .filter(e => e !== null)
    }

    findById(id) {
        const stmt = db.prepare('SELECT * FROM emotions WHERE id = ?')
        const row = stmt.get(id)

        try {
            return row ? new Emotion(row) : null
        } catch (e) {
            console.error('[EmotionRepository] Données corrompues:', e.message)
            return null
        }
    }

    create({ label, category, emoji }) {
        const stmt = db.prepare(`
      INSERT INTO emotions (label, category, emoji)
      VALUES (?, ?, ?)
    `)
        const result = stmt.run(label, category, emoji)
        return this.findById(result.lastInsertRowid)
    }

    update(id, { label, category, emoji }) {
        const stmt = db.prepare(`
      UPDATE emotions
      SET label = ?, category = ?, emoji = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
        stmt.run(label, category, emoji, id)
        return this.findById(id)
    }

    delete(id) {
        const stmt = db.prepare('DELETE FROM emotions WHERE id = ?')
        const result = stmt.run(id)
        return result.changes > 0
    }
}

export const emotionRepository = new EmotionRepository()
