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

export const getAllEmotions = async () => {
    const db = await getDB()
    return db.all(`SELECT * FROM emotions ORDER BY category, label`)
}

export const getAllCategories = async () => {
    const db = await getDB()
    return db.all('SELECT DISTINCT category FROM emotions ORDER BY category')
}


export const insertEmotion = async ({ label, category, emoji }) => {
    const db = await getDB();
    const result = await db.run(
        `INSERT INTO emotions (label, category, emoji) VALUES (?, ?, ?)`,
        [label, category, emoji]
    );
    return db.get(`SELECT * FROM emotions WHERE id = ?`, [result.lastID]);
};

export const updateEmotionById = async (id, { label, category, emoji }) => {
    const db = await getDB();
    await db.run(
        `UPDATE emotions SET label = ?, category = ?, emoji = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [label, category, emoji, id]
    );
    return db.get(`SELECT * FROM emotions WHERE id = ?`, [id]);
};

export const deleteEmotionById = async (id) => {
    const db = await getDB();
    return db.run(`DELETE FROM emotions WHERE id = ?`, [id]);
};
