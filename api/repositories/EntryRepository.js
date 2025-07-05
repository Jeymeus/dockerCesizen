import db from '../database/db.js';
import Entry from '../models/Entry.js';

class EntryRepository {
  async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM entries WHERE id = ?', [id]);
      const row = rows[0];

      return row ? new Entry(row) : null;
    } catch (e) {
      console.error('[EntryRepository] Données corrompues:', e.message);
      return null;
    }
  }

  async findByUser(userId) {
    try {
      const [rows] = await db.execute(`
        SELECT e.*, emo.label, emo.category, emo.emoji
        FROM entries e
        JOIN emotions emo ON e.emotion_id = emo.id
        WHERE e.user_id = ?
        ORDER BY e.date_entry DESC
      `, [userId]);

      return rows
        .map(row => {
          try {
            const entry = new Entry(row);
            entry.emotion = {
              label: row.label,
              category: row.category,
              emoji: row.emoji
            };
            return entry;
          } catch (e) {
            console.error('[EntryRepository] Erreur instanciation Entry:', e.message);
            return null;
          }
        })
        .filter(e => e !== null);
    } catch (err) {
      console.error('[EntryRepository] Erreur findByUser:', err.message);
      return [];
    }
  }

  async create({ user_id, emotion_id, note, date_entry }) {
    try {
      const [result] = await db.execute(`
        INSERT INTO entries (user_id, emotion_id, note, date_entry)
        VALUES (?, ?, ?, ?)
      `, [user_id, emotion_id, note, date_entry]);

      return this.findById(result.insertId);
    } catch (err) {
      console.error('[EntryRepository] Erreur create:', err.message);
      throw err;
    }
  }

  async update(id, { emotion_id, note, date_entry }) {
    try {
      await db.execute(`
        UPDATE entries
        SET emotion_id = ?, note = ?, date_entry = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [emotion_id, note, date_entry, id]);

      return this.findById(id);
    } catch (err) {
      console.error('[EntryRepository] Erreur update:', err.message);
      throw err;
    }
  }

  async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM entries WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error('[EntryRepository] Erreur delete:', err.message);
      return false;
    }
  }

  async getReportByPeriod(userId, startDate, endDate) {
    try {
      const [rows] = await db.execute(`
        SELECT emo.category, emo.label, COUNT(*) as count
        FROM entries e
        JOIN emotions emo ON e.emotion_id = emo.id
        WHERE e.user_id = ?
        AND e.date_entry BETWEEN ? AND ?
        GROUP BY emo.category, emo.label
        ORDER BY count DESC
      `, [userId, startDate, endDate]);

      return rows;
    } catch (err) {
      console.error('[EntryRepository] Erreur getReportByPeriod:', err.message);
      return [];
    }
  }
}

export const entryRepository = new EntryRepository();
