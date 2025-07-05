// // api/tests/integration/users.integration.test.js
// import { describe, it, expect, beforeEach } from 'vitest'
// import request from 'supertest'
// import express from 'express'
// import cors from 'cors'
// import authRoutes from '../../routes/authRoutes.js'
// import userRoutes from '../../routes/userRoutes.js'
// import { cleanTestData } from '../setup/testConfig.js'

// // Création de l'app de test
// const createTestApp = () => {
//     const app = express()
//     app.use(cors())
//     app.use(express.json())
//     app.use('/api/auth', authRoutes)
//     app.use('/api/users', userRoutes)
//     return app
// }

// describe('Users API Integration Tests', () => {
//     let app
//     let userToken, adminToken
//     let userId, adminId

//     beforeEach(async () => {
//         app = createTestApp()
//         await cleanTestData()

//         // Créer un utilisateur normal
//         const userResponse = await request(app)
//             .post('/api/auth/register')
//             .send({
//                 firstname: 'John',
//                 lastname: 'Doe',
//                 email: 'user@test.com',
//                 password: 'password123',
//                 role: 'user'
//             })

//         userToken = userResponse.body.token
//         userId = userResponse.body.user.id

//         // Créer un admin
//         const adminResponse = await request(app)
//             .post('/api/auth/register')
//             .send({
//                 firstname: 'Admin',
//                 lastname: 'User',
//                 email: 'admin@test.com',
//                 password: 'password123',
//                 role: 'admin'
//             })

//         adminToken = adminResponse.body.token
//         adminId = adminResponse.body.user.id
//     })

//     describe('GET /api/users/me', () => {
//         it('should get user profile with valid token', async () => {
//             const response = await request(app)
//                 .get('/api/users/me')
//                 .set('Authorization', `Bearer ${userToken}`)

//             expect(response.status).toBe(200)
//             expect(response.body).toMatchObject({
//                 firstname: 'John',
//                 lastname: 'Doe',
//                 email: 'user@test.com',
//                 role: 'user'
//             })
//             expect(response.body).not.toHaveProperty('password')
//         })

//         it('should return 401 without token', async () => {
//             const response = await request(app)
//                 .get('/api/users/me')

//             expect(response.status).toBe(401)
//             expect(response.body.error).toBe('Token manquant')
//         })

//         it('should return 401 with invalid token', async () => {
//             const response = await request(app)
//                 .get('/api/users/me')
//                 .set('Authorization', 'Bearer invalidtoken')

//             expect(response.status).toBe(401)
//             expect(response.body.error).toBe('Token invalide')
//         })
//     })

//     describe('PUT /api/users/profile', () => {
//         it('should update user profile', async () => {
//             const updateData = {
//                 firstname: 'Jane',
//                 lastname: 'Smith',
//                 email: 'jane@test.com'
//             }

//             const response = await request(app)
//                 .put('/api/users/profile')
//                 .set('Authorization', `Bearer ${userToken}`)
//                 .send(updateData)

//             expect(response.status).toBe(200)
//             expect(response.body).toMatchObject({
//                 firstname: 'Jane',
//                 lastname: 'Smith',
//                 email: 'jane@test.com'
//             })

//             // Vérifier en base que les données sont bien mises à jour
//             const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
//             expect(users[0]).toMatchObject({
//                 firstname: 'Jane',
//                 lastname: 'Smith',
//                 email: 'jane@test.com'
//             })
//         })

//         it('should update profile with new password', async () => {
//             const updateData = {
//                 firstname: 'John',
//                 lastname: 'Doe',
//                 email: 'user@test.com',
//                 password: 'newpassword123'
//             }

//             const response = await request(app)
//                 .put('/api/users/profile')
//                 .set('Authorization', `Bearer ${userToken}`)
//                 .send(updateData)

//             expect(response.status).toBe(200)

//             // Vérifier que le nouveau mot de passe fonctionne
//             const loginResponse = await request(app)
//                 .post('/api/auth/login')
//                 .send({
//                     email: 'user@test.com',
//                     password: 'newpassword123'
//                 })

//             expect(loginResponse.status).toBe(200)
//         })

//         it('should return 400 for missing required fields', async () => {
//             const response = await request(app)
//                 .put('/api/users/profile')
//                 .set('Authorization', `Bearer ${userToken}`)
//                 .send({
//                     firstname: '',
//                     lastname: 'Doe',
//                     email: 'user@test.com'
//                 })

//             expect(response.status).toBe(400)
//             expect(response.body.error).toBe('Tous les champs sont requis')
//         })

//         it('should return 401 without authentication', async () => {
//             const response = await request(app)
//                 .put('/api/users/profile')
//                 .send({
//                     firstname: 'Jane',
//                     lastname: 'Smith',
//                     email: 'jane@test.com'
//                 })

//             expect(response.status).toBe(401)
//         })
//     })

//     describe('GET /api/users (Admin only)', () => {
//         it('should list all users as admin', async () => {
//             const response = await request(app)
//                 .get('/api/users')
//                 .set('Authorization', `Bearer ${adminToken}`)

//             expect(response.status).toBe(200)
//             expect(Array.isArray(response.body)).toBe(true)
//             expect(response.body).toHaveLength(2) // user + admin
//             expect(response.body.some(u => u.email === 'user@test.com')).toBe(true)
//             expect(response.body.some(u => u.email === 'admin@test.com')).toBe(true)
//         })

//         it('should return 404 for non-admin user', async () => {
//             const response = await request(app)
//                 .get('/api/users')
//                 .set('Authorization', `Bearer ${userToken}`)

//             expect(response.status).toBe(404)
//             expect(response.body.error).toBe('Route inexistante')
//         })

//         it('should return 401 without authentication', async () => {
//             const response = await request(app)
//                 .get('/api/users')

//             expect(response.status).toBe(401)
//         })
//     })

//     describe('GET /api/users/:id (Admin only)', () => {
//         it('should get user by id as admin', async () => {
//             const response = await request(app)
//                 .get(`/api/users/${userId}`)
//                 .set('Authorization', `Bearer ${adminToken}`)

//             expect(response.status).toBe(200)
//             expect(response.body).toMatchObject({
//                 firstname: 'John',
//                 lastname: 'Doe',
//                 email: 'user@test.com',
//                 role: 'user'
//             })
//         })

//         it('should return 404 for non-existent user', async () => {
//             const response = await request(app)
//                 .get('/api/users/999')
//                 .set('Authorization', `Bearer ${adminToken}`)

//             expect(response.status).toBe(404)
//             expect(response.body.error).toBe('Utilisateur non trouvé')
//         })

//         it('should return 404 for non-admin user', async () => {
//             const response = await request(app)
//                 .get(`/api/users/${userId}`)
//                 .set('Authorization', `Bearer ${userToken}`)

//             expect(response.status).toBe(404)
//         })
//     })

//     describe('PATCH /api/users/:id/role (Admin only)', () => {
//         it('should change user role as admin', async () => {
//             const response = await request(app)
//                 .patch(`/api/users/${userId}/role`)
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({ role: 'admin' })

//             expect(response.status).toBe(200)
//             expect(response.body.role).toBe('admin')

//             // Vérifier en base
//             const [users] = await db.execute('SELECT role FROM users WHERE id = ?', [userId])
//             expect(users[0].role).toBe('admin')
//         })

//         it('should return 400 for invalid role', async () => {
//             const response = await request(app)
//                 .patch(`/api/users/${userId}/role`)
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({ role: 'invalid' })

//             expect(response.status).toBe(400)
//             expect(response.body.error).toBe('Rôle invalide')
//         })

//         it('should return 404 for non-admin user', async () => {
//             const response = await request(app)
//                 .patch(`/api/users/${userId}/role`)
//                 .set('Authorization', `Bearer ${userToken}`)
//                 .send({ role: 'admin' })

//             expect(response.status).toBe(404)
//         })
//     })

//     describe('PATCH /api/users/:id/active (Admin only)', () => {
//         it('should activate/deactivate user as admin', async () => {
//             const response = await request(app)
//                 .patch(`/api/users/${userId}/active`)
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({ active: false })

//             expect(response.status).toBe(200)
//             expect(response.body.active).toBe(false)

//             // Vérifier en base
//             const [users] = await db.execute('SELECT active FROM users WHERE id = ?', [userId])
//             expect(users[0].active).toBe(0) // false en MySQL
//         })

//         it('should return 400 for invalid active value', async () => {
//             const response = await request(app)
//                 .patch(`/api/users/${userId}/active`)
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({ active: 'invalid' })

//             expect(response.status).toBe(400)
//             expect(response.body.error).toBe("Le champ 'active' doit être un booléen.")
//         })

//         it('should return 404 for non-admin user', async () => {
//             const response = await request(app)
//                 .patch(`/api/users/${userId}/active`)
//                 .set('Authorization', `Bearer ${userToken}`)
//                 .send({ active: false })

//             expect(response.status).toBe(404)
//         })
//     })

//     describe('PUT /api/users/:id (Admin only)', () => {
//         it('should update any user as admin', async () => {
//             const updateData = {
//                 firstname: 'Updated',
//                 lastname: 'Name',
//                 email: 'updated@test.com',
//                 role: 'user',
//                 active: true
//             }

//             const response = await request(app)
//                 .put(`/api/users/${userId}`)
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send(updateData)

//             expect(response.status).toBe(200)
//             expect(response.body).toMatchObject({
//                 firstname: 'Updated',
//                 lastname: 'Name',
//                 email: 'updated@test.com'
//             })
//         })

//         it('should return 404 for non-admin user', async () => {
//             const response = await request(app)
//                 .put(`/api/users/${userId}`)
//                 .set('Authorization', `Bearer ${userToken}`)
//                 .send({
//                     firstname: 'Hacker',
//                     lastname: 'Attempt',
//                     email: 'hack@test.com'
//                 })

//             expect(response.status).toBe(404)
//         })
//     })

//     describe('DELETE /api/users/:id (Admin only)', () => {
//         it('should delete user as admin', async () => {
//             const response = await request(app)
//                 .delete(`/api/users/${userId}`)
//                 .set('Authorization', `Bearer ${adminToken}`)

//             expect(response.status).toBe(204)

//             // Vérifier que l'utilisateur est supprimé
//             const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
//             expect(users).toHaveLength(0)
//         })

//         it('should return 404 for non-existent user', async () => {
//             const response = await request(app)
//                 .delete('/api/users/999')
//                 .set('Authorization', `Bearer ${adminToken}`)

//             expect(response.status).toBe(404)
//             expect(response.body.error).toBe('Utilisateur non trouvé')
//         })

//         it('should return 404 for non-admin user', async () => {
//             const response = await request(app)
//                 .delete(`/api/users/${adminId}`)
//                 .set('Authorization', `Bearer ${userToken}`)

//             expect(response.status).toBe(404)
//         })

//         it('should return 401 without authentication', async () => {
//             const response = await request(app)
//                 .delete(`/api/users/${userId}`)

//             expect(response.status).toBe(401)
//         })
//     })
// })