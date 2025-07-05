// // api/tests/integration/pages.integration.test.js
// import { describe, it, expect, beforeEach } from 'vitest'
// import request from 'supertest'
// import express from 'express'
// import cors from 'cors'
// import authRoutes from '../../routes/authRoutes.js'
// import pageRoutes from '../../routes/pageRoutes.js'
// import menuRoutes from '../../routes/menuRoutes.js'
// import { cleanTestData } from '../setup/testConfig.js'

// // Création de l'app de test
// const createTestApp = () => {
//     const app = express()
//     app.use(cors())
//     app.use(express.json())
//     app.use('/api/auth', authRoutes)
//     app.use('/api/pages', pageRoutes)
//     app.use('/api/menus', menuRoutes)
//     return app
// }

// describe('Pages API Integration Tests', () => {
//     let adminToken, userToken, menuId, app

//     beforeEach(async () => {
//         app = createTestApp()
//         await cleanTestData()

//         // Create admin user
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

//         // Create regular user
//         const userResponse = await request(app)
//             .post('/api/auth/register')
//             .send({
//                 firstname: 'Regular',
//                 lastname: 'User',
//                 email: 'user@test.com',
//                 password: 'password123'
//             })
//         userToken = userResponse.body.token

//         // Create test menu
//         const menuResponse = await request(app)
//             .post('/api/menus')
//             .set('Authorization', `Bearer ${adminToken}`)
//             .send({
//                 title: 'Test Menu',
//                 type: 'articles'
//             })
//         menuId = menuResponse.body.id
//     })

//     describe('GET /api/pages', () => {
//         it('should return visible pages', async () => {
//             // Create visible page
//             await request(app)
//                 .post('/api/pages')
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({
//                     title: 'Visible Page',
//                     url: 'https://example.com',
//                     content: 'Test content',
//                     visible: true,
//                     menu_id: menuId
//                 })

//             // Create hidden page
//             await request(app)
//                 .post('/api/pages')
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({
//                     title: 'Hidden Page',
//                     url: 'https://example.com/hidden',
//                     content: 'Hidden content',
//                     visible: false,
//                     menu_id: menuId
//                 })

//             const response = await request(app)
//                 .get('/api/pages')

//             expect(response.status).toBe(200)
//             expect(response.body).toHaveLength(1)
//             expect(response.body[0]).toMatchObject({
//                 title: 'Visible Page',
//                 visible: true
//             })
//         })

//         it('should filter pages by menu', async () => {
//             // Create page in menu
//             await request(app)
//                 .post('/api/pages')
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({
//                     title: 'Page in Menu',
//                     url: 'https://example.com',
//                     content: 'Test content',
//                     visible: true,
//                     menu_id: menuId
//                 })

//             const response = await request(app)
//                 .get('/api/pages')
//                 .query({ menuId: menuId })

//             expect(response.status).toBe(200)
//             expect(response.body).toHaveLength(1)
//             expect(response.body[0]).toMatchObject({
//                 title: 'Page in Menu',
//                 menu_id: menuId
//             })
//         })
//     })

//     describe('POST /api/pages', () => {
//         it('should create page as admin', async () => {
//             const response = await request(app)
//                 .post('/api/pages')
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({
//                     title: 'New Page',
//                     url: 'https://example.com/new',
//                     content: 'New content',
//                     visible: true,
//                     menu_id: menuId
//                 })

//             expect(response.status).toBe(201)
//             expect(response.body).toMatchObject({
//                 title: 'New Page',
//                 url: 'https://example.com/new',
//                 content: 'New content',
//                 visible: true,
//                 menu_id: menuId
//             })
//         })

//         it('should return 404 for non-admin user', async () => {
//             const response = await request(app)
//                 .post('/api/pages')
//                 .set('Authorization', `Bearer ${userToken}`)
//                 .send({
//                     title: 'New Page',
//                     url: 'https://example.com/new',
//                     content: 'New content',
//                     visible: true,
//                     menu_id: menuId
//                 })

//             expect(response.status).toBe(404)
//         })
//     })

//     describe('GET /api/pages/menu/:id', () => {
//         it('should get pages by menu id', async () => {
//             // Create page in menu
//             await request(app)
//                 .post('/api/pages')
//                 .set('Authorization', `Bearer ${adminToken}`)
//                 .send({
//                     title: 'Page in Menu',
//                     url: 'https://example.com',
//                     content: 'Test content',
//                     visible: true,
//                     menu_id: menuId
//                 })

//             const response = await request(app)
//                 .get(`/api/pages/menu/${menuId}`)

//             expect(response.status).toBe(200)
//             expect(response.body).toHaveProperty('menu')
//             expect(response.body).toHaveProperty('pages')
//             expect(response.body.pages).toHaveLength(1)
//             expect(response.body.pages[0]).toMatchObject({
//                 title: 'Page in Menu',
//                 menu_id: menuId
//             })
//         })

//         it('should return 404 for non-existent menu', async () => {
//             const response = await request(app)
//                 .get('/api/pages/menu/999')

//             expect(response.status).toBe(404)
//             expect(response.body.error).toBe('Menu introuvable')
//         })
//     })
// })