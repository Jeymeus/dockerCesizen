// api/tests/setup/globalTeardown.js
import mysql from 'mysql2/promise'
import { config } from 'dotenv'

config({ path: '.env.test' })

export default async function () {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })

    await db.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``)
    await db.end()

    console.log('🧹 Base de test supprimée')
}
