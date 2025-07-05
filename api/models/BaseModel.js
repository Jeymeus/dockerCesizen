import db from '../database/db.js';

export default class BaseModel {
    constructor(tableName) {
        if (!tableName) throw new Error('BaseModel must have a table name');
        this.tableName = tableName;
    }

    async findAll() {
        const [rows] = await db.execute(`SELECT * FROM ${this.tableName}`);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');

        const [result] = await db.execute(
            `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
            values
        );

        return this.findById(result.insertId);
    }

    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setters = keys.map(key => `${key} = ?`).join(', ');

        await db.execute(
            `UPDATE ${this.tableName} SET ${setters}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
