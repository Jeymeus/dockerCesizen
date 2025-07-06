// api/tests/integration/entries.integration.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import authRoutes from '../../routes/authRoutes.js'
import entryRoutes from '../../routes/entryRoutes.js'
import emotionRoutes from '../../routes/emotionRoutes.js'
import { cleanTestData } from '../setup/testConfig.js'

// Création de l'app de test
const createTestApp = () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/auth', authRoutes)
    app.use('/api/entries', entryRoutes)
    app.use('/api/emotions', emotionRoutes)
    return app
}

describe('Entries API Integration Tests', () => {
    let userToken, emotionId, app

    beforeEach(async () => {
        app = createTestApp()
        await cleanTestData()

        // Create user
        const userResponse = await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Test',
                lastname: 'User',
                email: 'test@test.com',
                password: 'password123'
            })
        userToken = userResponse.body.token

        // Create admin and emotion
        const adminResponse = await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Admin',
                lastname: 'User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            })

        const emotionResponse = await request(app)
            .post('/api/emotions')
            .set('Authorization', `Bearer ${adminResponse.body.token}`)
            .send({
                label: 'Joie',
                category: 'Positive',
                emoji: '😊'
            })
        emotionId = emotionResponse.body.id
    })

    describe('POST /api/entries', () => {
        it('should create entry', async () => {
            const response = await request(app)
                .post('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    emotion_id: emotionId,
                    note: 'Test entry',
                    date_entry: '2024-01-15'
                })

            expect(response.status).toBe(201)
            expect(response.body).toMatchObject({
                emotion_id: emotionId,
                note: 'Test entry',
                date_entry: '2024-01-15'
            })
        })

        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    note: 'Test entry'
                    // Missing emotion_id and date_entry
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Emotion ID et date d\'entrée requis')
        })
    })

    describe('GET /api/entries', () => {
        it('should get user entries', async () => {
            // Create entry
            await request(app)
                .post('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    emotion_id: emotionId,
                    note: 'Test entry',
                    date_entry: '2024-01-15'
                })

            const response = await request(app)
                .get('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(1)
            expect(response.body[0]).toMatchObject({
                emotion_id: emotionId,
                note: 'Test entry',
                date_entry: '2024-01-15'
            })
        })
    })

    describe('PUT /api/entries/:id', () => {
        it('should update entry', async () => {
            // Create entry
            const createResponse = await request(app)
                .post('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    emotion_id: emotionId,
                    note: 'Original note',
                    date_entry: '2024-01-15'
                })

            const entryId = createResponse.body.id

            // Update entry
            const response = await request(app)
                .put(`/api/entries/${entryId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    emotion_id: emotionId,
                    note: 'Updated note',
                    date_entry: '2024-01-16'
                })

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                note: 'Updated note',
                date_entry: '2024-01-16'
            })
        })
    })

    describe('DELETE /api/entries/:id', () => {
        it('should delete entry', async () => {
            // Create entry
            const createResponse = await request(app)
                .post('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    emotion_id: emotionId,
                    note: 'Test entry',
                    date_entry: '2024-01-15'
                })

            const entryId = createResponse.body.id

            // Delete entry
            const response = await request(app)
                .delete(`/api/entries/${entryId}`)
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.status).toBe(204)
        })
    })

    describe('GET /api/entries/report/user', () => {
        it('should generate user report', async () => {
            // Create multiple entries
            await request(app)
                .post('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    emotion_id: emotionId,
                    note: 'Entry 1',
                    date_entry: '2024-01-15'
                })

            await request(app)
                .post('/api/entries')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    emotion_id: emotionId,
                    note: 'Entry 2',
                    date_entry: '2024-01-16'
                })

            const response = await request(app)
                .get('/api/entries/report/user')
                .set('Authorization', `Bearer ${userToken}`)
                .query({ start: '2024-01-01', end: '2024-01-31' })

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
        })

        it('should return 400 for missing date parameters', async () => {
            const response = await request(app)
                .get('/api/entries/report/user')
                .set('Authorization', `Bearer ${userToken}`)
                .query({ start: '2024-01-01' }) // Missing end date

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Dates de début et de fin requises (start, end)')
        })
    })
})