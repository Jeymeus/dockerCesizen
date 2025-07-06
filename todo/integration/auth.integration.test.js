// api/tests/integration/auth.integration.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import authRoutes from '../../routes/authRoutes.js'
import { cleanTestData } from '../setup/testConfig.js'

// Création de l'app de test
const createTestApp = () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/auth', authRoutes)
    return app
}

describe('Auth API Integration Tests', () => {
    let app

    beforeEach(async () => {
        app = createTestApp()
        await cleanTestData()  // ← REMPLACE le DELETE FROM users
    })

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                password: 'password123'
            }

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('token')
            expect(response.body).toHaveProperty('user')
            expect(response.body.user).toMatchObject({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                role: 'user'
            })
            expect(response.body.user).not.toHaveProperty('password')
        })

        it('should not register user with missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    firstname: 'John',
                    email: 'john@test.com'
                    // missing lastname and password
                })

            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('error')
        })

        it('should not register user with existing email', async () => {
            const userData = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                password: 'password123'
            }

            // Premier enregistrement
            await request(app)
                .post('/api/auth/register')
                .send(userData)

            // Tentative de doublon
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)

            expect(response.status).toBe(409)
            expect(response.body.error).toBe('Email déjà utilisé')
        })

        it('should register admin user when role is specified', async () => {
            const userData = {
                firstname: 'Admin',
                lastname: 'User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            }

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)

            expect(response.status).toBe(201)
            expect(response.body.user.role).toBe('admin')
        })
    })

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Créer un utilisateur de test
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstname: 'Test',
                    lastname: 'User',
                    email: 'test@test.com',
                    password: 'password123'
                })
        })

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                })

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('token')
            expect(response.body).toHaveProperty('user')
            expect(response.body.user.email).toBe('test@test.com')
        })

        it('should not login with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@test.com',
                    password: 'password123'
                })

            expect(response.status).toBe(401)
            expect(response.body.error).toBe('Email ou mot de passe invalide')
        })

        it('should not login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                })

            expect(response.status).toBe(401)
            expect(response.body.error).toBe('Email ou mot de passe invalide')
        })
    })

    describe('POST /api/auth/forgot-password', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstname: 'Test',
                    lastname: 'User',
                    email: 'test@test.com',
                    password: 'password123'
                })
        })

        it('should generate reset link for existing user', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'test@test.com'
                })

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('message')
            expect(response.body).toHaveProperty('resetLink')
            expect(response.body.resetLink).toContain('/reset-password/')
        })

        it('should return 400 for missing email', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({})

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Email requis')
        })

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'nonexistent@test.com'
                })

            expect(response.status).toBe(404)
        })
    })

    describe('POST /api/auth/reset-password/:token', () => {
        let resetToken

        beforeEach(async () => {
            // Créer un utilisateur
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstname: 'Test',
                    lastname: 'User',
                    email: 'test@test.com',
                    password: 'password123'
                })

            // Obtenir un token de reset
            const forgotResponse = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'test@test.com'
                })

            resetToken = forgotResponse.body.resetLink.split('/').pop()
        })

        it('should reset password with valid token', async () => {
            const response = await request(app)
                .post(`/api/auth/reset-password/${resetToken}`)
                .send({
                    newPassword: 'newpassword123'
                })

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Mot de passe mis à jour avec succès')

            // Vérifier que le nouveau mot de passe fonctionne
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'newpassword123'
                })

            expect(loginResponse.status).toBe(200)
        })

        it('should return 400 for missing new password', async () => {
            const response = await request(app)
                .post(`/api/auth/reset-password/${resetToken}`)
                .send({})

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Nouveau mot de passe requis')
        })

        it('should return 400 for invalid token', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password/invalidtoken')
                .send({
                    newPassword: 'newpassword123'
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Lien invalide ou expiré')
        })
    })

    describe('PATCH /api/auth/reset-password (authenticated)', () => {
        let userToken

        beforeEach(async () => {
            // Créer et connecter un utilisateur
            const registerResponse = await request(app)
                .post('/api/auth/register')
                .send({
                    firstname: 'Test',
                    lastname: 'User',
                    email: 'test@test.com',
                    password: 'password123'
                })

            userToken = registerResponse.body.token
        })

        it('should reset password for authenticated user', async () => {
            const response = await request(app)
                .patch('/api/auth/reset-password')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    oldPassword: 'password123',
                    newPassword: 'newpassword123'
                })

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Mot de passe mis à jour avec succès')
        })

        it('should return 401 for wrong old password', async () => {
            const response = await request(app)
                .patch('/api/auth/reset-password')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    oldPassword: 'wrongpassword',
                    newPassword: 'newpassword123'
                })

            expect(response.status).toBe(401)
            expect(response.body.error).toBe('Ancien mot de passe incorrect')
        })

        it('should return 401 for missing token', async () => {
            const response = await request(app)
                .patch('/api/auth/reset-password')
                .send({
                    oldPassword: 'password123',
                    newPassword: 'newpassword123'
                })

            expect(response.status).toBe(401)
        })
    })
})