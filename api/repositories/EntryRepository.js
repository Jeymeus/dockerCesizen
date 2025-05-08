import { initDB, getDB } from '../database/init.js'
import Entry from '../models/Entry.js'

class EntryRepository {
  async findById(id) {
    await initDB()
    const db = getDB()

    const stmt = db.prepare('SELECT * FROM entries WHERE id = ?')
    const row = stmt.get(id)

    try {
      return row ? new Entry(row) : null
    } catch (e) {
      console.error('[EntryRepository] Données corrompues:', e.message)
      return null
    }
  }

  async findByUser(userId) {
    await initDB()
    const db = getDB()

    const stmt = db.prepare(`
      SELECT e.*, emo.label, emo.category, emo.emoji
      FROM entries e
      JOIN emotions emo ON e.emotion_id = emo.id
      WHERE e.user_id = ?
      ORDER BY e.date_entry DESC
    `)

    const rows = stmt.all(userId)

    return rows
      .map(row => {
        try {
          const entry = new Entry(row)
          entry.emotion = {
            label: row.label,
            category: row.category,
            emoji: row.emoji
          }
          return entry
        } catch (e) {
          console.error('[EntryRepository] Erreur instanciation Entry:', e.message)
          return null
        }
      })
      .filter(e => e !== null)
  }

  async create({ user_id, emotion_id, note, date_entry }) {
    await initDB()
    const db = getDB()

    const stmt = db.prepare(`
      INSERT INTO entries (user_id, emotion_id, note, date_entry)
      VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(user_id, emotion_id, note, date_entry)
    return this.findById(result.lastInsertRowid)
  }

  async update(id, { emotion_id, note, date_entry }) {
    await initDB()
    const db = getDB()

    const stmt = db.prepare(`
      UPDATE entries
      SET emotion_id = ?, note = ?, date_entry = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    stmt.run(emotion_id, note, date_entry, id)
    return this.findById(id)
  }

  async delete(id) {
    await initDB()
    const db = getDB()

    const stmt = db.prepare('DELETE FROM entries WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  async getReportByPeriod(userId, startDate, endDate) {
    await initDB()
    const db = getDB()

    const stmt = db.prepare(`
      SELECT emo.category, emo.label, COUNT(*) as count
      FROM entries e
      JOIN emotions emo ON e.emotion_id = emo.id
      WHERE e.user_id = ?
      AND e.date_entry BETWEEN ? AND ?
      GROUP BY emo.category, emo.label
      ORDER BY count DESC
    `)

    return stmt.all(userId, startDate, endDate)
  }
}

export const entryRepository = new EntryRepository()
