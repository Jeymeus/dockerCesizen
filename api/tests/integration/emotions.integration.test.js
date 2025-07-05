// api/tests/integration/emotions.integration.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server.js'
import db from '../database/db.js'

describe('Emotions API Integration Tests', () => {
    let adminToken, userToken

    beforeEach(async () => {
        // Clean database
        await db.execute('DELETE FROM emotions')
        await db.execute('DELETE FROM users')

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

    describe('GET /api/emotions', () => {
        it('should return all emotions', async () => {
            // Arrange - Create test emotion
            await request(app)
                .post('/api/emotions')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    label: 'Joie',
                    category: 'Positive',
                    emoji: '😊'
                })

            // Act
            const response = await request(app)
                .get('/api/emotions')
                .set('Authorization', `Bearer ${userToken}`)

            // Assert
            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(1)
            expect(response.body[0]).toMatchObject({
                label: 'Joie',
                category: 'Positive',
                emoji: '😊'
            })
        })

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .get('/api/emotions')

            expect(response.status).toBe(401)
        })
    })

    describe('POST /api/emotions', () => {
        it('should create emotion as admin', async () => {
            const response = await request(app)
                .post('/api/emotions')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    label: 'Tristesse',
                    category: 'Negative',
                    emoji: '😢'
                })

            expect(response.status).toBe(201)
            expect(response.body).toMatchObject({
                label: 'Tristesse',
                category: 'Negative',
                emoji: '😢'
            })
        })

        it('should return 404 for non-admin user', async () => {
            const response = await request(app)
                .post('/api/emotions')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    label: 'Tristesse',
                    category: 'Negative',
                    emoji: '😢'
                })

            expect(response.status).toBe(404)
        })
    })

    describe('PUT /api/emotions/:id', () => {
        it('should update emotion as admin', async () => {
            // Create emotion
            const createResponse = await request(app)
                .post('/api/emotions')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    label: 'Joie',
                    category: 'Positive',
                    emoji: '😊'
                })

            const emotionId = createResponse.body.id

            // Update emotion
            const response = await request(app)
                .put(`/api/emotions/${emotionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    label: 'Bonheur',
                    category: 'Positive',
                    emoji: '😄'
                })

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                label: 'Bonheur',
                category: 'Positive',
                emoji: '😄'
            })
        })
    })

    describe('DELETE /api/emotions/:id', () => {
        it('should delete emotion as admin', async () => {
            // Create emotion
            const createResponse = await request(app)
                .post('/api/emotions')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    label: 'Joie',
                    category: 'Positive',
                    emoji: '😊'
                })

            const emotionId = createResponse.body.id

            // Delete emotion
            const response = await request(app)
                .delete(`/api/emotions/${emotionId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            expect(response.status).toBe(204)
        })
    })
})
