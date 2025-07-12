// api/tests/setup/cleanTestData.js
import mysql from 'mysql2/promise'
import { config } from 'dotenv'

config({ path: '.env.test' })

export const cleanTestData = async () => {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })

    await db.execute('DELETE FROM entries')
    await db.execute('DELETE FROM pages')
    await db.execute('DELETE FROM users')
    await db.execute('DELETE FROM menus')
    await db.execute('DELETE FROM emotions')

    await db.end()
}
