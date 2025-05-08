import { initDB, getDB } from '../database/init.js'

export default class BaseModel {
    constructor(tableName) {
        if (!tableName) throw new Error('BaseModel must have a table name')
        this.tableName = tableName
        this.db = null
    }

    async _ready() {
        await initDB()
        this.db = getDB()
    }

    async findAll() {
        await this._ready()
        const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`)
        return stmt.all()
    }

    async findById(id) {
        await this._ready()
        const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
        return stmt.get(id)
    }

    async create(data) {
        await this._ready()
        const keys = Object.keys(data)
        const values = Object.values(data)
        const placeholders = keys.map(() => '?').join(', ')

        const stmt = this.db.prepare(
            `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`
        )
        const result = stmt.run(...values)
        return this.findById(result.lastInsertRowid)
    }

    async update(id, data) {
        await this._ready()
        const keys = Object.keys(data)
        const values = Object.values(data)
        const setters = keys.map(key => `${key} = ?`).join(', ')
        const stmt = this.db.prepare(
            `UPDATE ${this.tableName} SET ${setters}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
        stmt.run(...values, id)
        return this.findById(id)
    }

    async delete(id) {
        await this._ready()
        const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
        const result = stmt.run(id)
        return result.changes > 0
    }
}
