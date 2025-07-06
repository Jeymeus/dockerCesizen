// api/tests/integration/menus.integration.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import authRoutes from '../../routes/authRoutes.js'
import menuRoutes from '../../routes/menuRoutes.js'
import { cleanTestData } from '../setup/testConfig.js'

// Création de l'app de test
const createTestApp = () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/auth', authRoutes)
    app.use('/api/menus', menuRoutes)
    return app
}

describe('Menus API Integration Tests', () => {
    let adminToken, userToken, app

    beforeEach(async () => {
        app = createTestApp()
        await cleanTestData()

        // Create admin user
        const adminResponse = await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Admin',
                lastname: 'User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            })
        adminToken = adminResponse.body.token

        // Create regular user
        const userResponse = await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Regular',
                lastname: 'User',
                email: 'user@test.com',
                password: 'password123'
            })
        userToken = userResponse.body.token
    })

    describe('GET /api/menus', () => {
        it('should return all menus (public access)', async () => {
            // Create test menu
            await request(app)
                .post('/api/menus')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Test Menu',
                    type: 'articles'
                })

            // Act - No authentication required
            const response = await request(app)
                .get('/api/menus')

            // Assert
            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(1)
            expect(response.body[0]).toMatchObject({
                title: 'Test Menu',
                type: 'articles'
            })
        })
    })

    describe('POST /api/menus', () => {
        it('should create menu as admin', async () => {
            const response = await request(app)
                .post('/api/menus')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'New Menu',
                    type: 'videos'
                })

            expect(response.status).toBe(201)
            expect(response.body).toMatchObject({
                title: 'New Menu',
                type: 'videos'
            })
        })

        it('should return 404 for non-admin user', async () => {
            const response = await request(app)
                .post('/api/menus')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'New Menu',
                    type: 'videos'
                })

            expect(response.status).toBe(404)
        })
    })

    describe('PUT /api/menus/:id', () => {
        it('should update menu as admin', async () => {
            // Create menu
            const createResponse = await request(app)
                .post('/api/menus')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Original Menu',
                    type: 'articles'
                })

            const menuId = createResponse.body.id

            // Update menu
            const response = await request(app)
                .put(`/api/menus/${menuId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Updated Menu',
                    type: 'videos'
                })

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                title: 'Updated Menu',
                type: 'videos'
            })
        })
    })

    describe('DELETE /api/menus/:id', () => {
        it('should delete menu as admin', async () => {
            // Create menu
            const createResponse = await request(app)
                .post('/api/menus')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Menu to Delete',
                    type: 'articles'
                })

            const menuId = createResponse.body.id

            // Delete menu
            const response = await request(app)
                .delete(`/api/menus/${menuId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            expect(response.status).toBe(204)
        })
    })
})
