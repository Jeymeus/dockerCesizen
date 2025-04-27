import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../database/cesizen.db')

const getDB = async () => {
    return open({ filename: dbPath, driver: sqlite3.Database })
}

// 🔥 CRUD du journal

export const insertEntry = async ({ userId, emotionId, note, dateEntry }) => {
    const db = await getDB()
    const result = await db.run(
        `INSERT INTO journal_entries (user_id, emotion_id, note, date_entry) VALUES (?, ?, ?, ?)`,
        [userId, emotionId, note, dateEntry]
    )
    return db.get(`SELECT * FROM journal_entries WHERE id = ?`, [result.lastID])
}

export const updateEntry = async (entryId, { emotionId, note, dateEntry }) => {
    const db = await getDB()
    await db.run(
        `UPDATE journal_entries
         SET emotion_id = ?, note = ?, date_entry = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [emotionId, note, dateEntry, entryId]
    )
    return db.get(`SELECT * FROM journal_entries WHERE id = ?`, [entryId])
}

export const deleteEntry = async (entryId) => {
    const db = await getDB()
    return db.run(`DELETE FROM journal_entries WHERE id = ?`, [entryId])
}

export const getEntriesByUser = async (userId) => {
    const db = await getDB()
    return db.all(
        `SELECT je.*, e.label, e.category, e.emoji
         FROM journal_entries je
         JOIN emotions e ON je.emotion_id = e.id
         WHERE je.user_id = ?
         ORDER BY je.date_entry DESC`,
        [userId]
    )
}

export const getEntryById = async (entryId) => {
    const db = await getDB()
    return db.get(`SELECT * FROM journal_entries WHERE id = ?`, [entryId])
}

// 🔥 Générer un rapport d'émotions par période
export const getReportByPeriod = async (userId, startDate, endDate) => {
    const db = await getDB()
    return db.all(
        `SELECT e.category, e.label, COUNT(*) as count
         FROM journal_entries je
         JOIN emotions e ON je.emotion_id = e.id
         WHERE je.user_id = ?
         AND je.date_entry BETWEEN ? AND ?
         GROUP BY e.category, e.label
         ORDER BY count DESC`,
        [userId, startDate, endDate]
    )
}
