// api/tests/controllers/authController.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    register,
    login,
    resetPassword,
    forgotPassword,
    publicResetPassword
} from '../../controllers/authController.js'
import { userRepository } from '../../repositories/UserRepository.js'
import { generateToken, verifyToken } from '../../utils/jwt.js'
import bcrypt from 'bcryptjs'
import db from '../../database/db.js'

// Mock des dépendances
vi.mock('../../repositories/UserRepository.js')
vi.mock('../../utils/jwt.js')
vi.mock('bcryptjs')
vi.mock('../../database/db.js')

describe('AuthController - Unit Tests', () => {
    let req, res

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock des objets request et response
        req = {
            body: {},
            params: {},
            user: { id: 1 }
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn()
        }
    })

    describe('register', () => {
        beforeEach(() => {
            req.body = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                password: 'password123',
                role: 'user'
            }
        })

        it('should register a new user successfully', async () => {
            // Arrange
            userRepository.findByEmail.mockResolvedValue(null)
            bcrypt.hash.mockResolvedValue('hashedPassword123')

            const mockUser = {
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                role: 'user'
            }

            userRepository.create.mockResolvedValue(mockUser)
            generateToken.mockReturnValue('jwt-token-123')

            // Act
            await register(req, res)

            // Assert
            expect(userRepository.findByEmail).toHaveBeenCalledWith('john@test.com')
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
            expect(userRepository.create).toHaveBeenCalledWith({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                password: 'hashedPassword123',
                role: 'user'
            })
            expect(generateToken).toHaveBeenCalledWith({ id: 1, role: 'user' })
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                token: 'jwt-token-123',
                user: mockUser
            })
        })

        it('should return 400 if required fields are missing', async () => {
            // Arrange
            req.body.firstname = ''

            // Act
            await register(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Tous les champs sont requis'
            })
            expect(userRepository.findByEmail).not.toHaveBeenCalled()
        })

        it('should return 409 if email already exists', async () => {
            // Arrange
            const existingUser = { id: 1, email: 'john@test.com' }
            userRepository.findByEmail.mockResolvedValue(existingUser)

            // Act
            await register(req, res)

            // Assert
            expect(userRepository.findByEmail).toHaveBeenCalledWith('john@test.com')
            expect(res.status).toHaveBeenCalledWith(409)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Email déjà utilisé'
            })
            expect(bcrypt.hash).not.toHaveBeenCalled()
            expect(userRepository.create).not.toHaveBeenCalled()
        })

        it('should use default role if not provided', async () => {
            // Arrange
            delete req.body.role
            userRepository.findByEmail.mockResolvedValue(null)
            bcrypt.hash.mockResolvedValue('hashedPassword123')

            const mockUser = {
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                role: 'user'
            }

            userRepository.create.mockResolvedValue(mockUser)
            generateToken.mockReturnValue('jwt-token-123')

            // Act
            await register(req, res)

            // Assert
            expect(userRepository.create).toHaveBeenCalledWith({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                password: 'hashedPassword123',
                role: 'user'
            })
        })

        it('should handle database errors', async () => {
            // Arrange
            userRepository.findByEmail.mockResolvedValue(null)
            bcrypt.hash.mockResolvedValue('hashedPassword123')
            userRepository.create.mockRejectedValue(new Error('Database error'))

            // Act
            await register(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Database error'
            })
        })
    })

    describe('login', () => {
        beforeEach(() => {
            req.body = {
                email: 'john@test.com',
                password: 'password123'
            }
        })

        it('should login user with valid credentials', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                email: 'john@test.com',
                password: 'hashedPassword123',
                role: 'user'
            }

            userRepository.findByEmail.mockResolvedValue(mockUser)
            bcrypt.compare.mockResolvedValue(true)
            generateToken.mockReturnValue('jwt-token-123')

            // Act
            await login(req, res)

            // Assert
            expect(userRepository.findByEmail).toHaveBeenCalledWith('john@test.com')
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123')
            expect(generateToken).toHaveBeenCalledWith({ id: 1, role: 'user' })
            expect(res.json).toHaveBeenCalledWith({
                token: 'jwt-token-123',
                user: mockUser
            })
        })

        it('should return 401 if user not found', async () => {
            // Arrange
            userRepository.findByEmail.mockResolvedValue(null)

            // Act
            await login(req, res)

            // Assert
            expect(userRepository.findByEmail).toHaveBeenCalledWith('john@test.com')
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Email ou mot de passe invalide'
            })
            expect(bcrypt.compare).not.toHaveBeenCalled()
        })

        it('should return 401 if password is incorrect', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                email: 'john@test.com',
                password: 'hashedPassword123',
                role: 'user'
            }

            userRepository.findByEmail.mockResolvedValue(mockUser)
            bcrypt.compare.mockResolvedValue(false)

            // Act
            await login(req, res)

            // Assert
            expect(userRepository.findByEmail).toHaveBeenCalledWith('john@test.com')
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123')
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Email ou mot de passe invalide'
            })
            expect(generateToken).not.toHaveBeenCalled()
        })
    })

    describe('resetPassword', () => {
        beforeEach(() => {
            req.body = {
                oldPassword: 'oldPassword123',
                newPassword: 'newPassword123'
            }
            req.user = { id: 1 }
        })

        it('should reset password successfully', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                password: 'hashedOldPassword'
            }

            userRepository.findById.mockResolvedValue(mockUser)
            bcrypt.compare.mockResolvedValue(true)
            bcrypt.hash.mockResolvedValue('hashedNewPassword')
            db.execute.mockResolvedValue()

            // Act
            await resetPassword(req, res)

            // Assert
            expect(userRepository.findById).toHaveBeenCalledWith(1)
            expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword123', 'hashedOldPassword')
            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10)
            expect(db.execute).toHaveBeenCalledWith(
                'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                ['hashedNewPassword', 1]
            )
            expect(res.json).toHaveBeenCalledWith({
                message: 'Mot de passe mis à jour avec succès'
            })
        })

        it('should return 400 if required fields are missing', async () => {
            // Arrange
            req.body.oldPassword = ''

            // Act
            await resetPassword(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Ancien et nouveau mot de passe requis'
            })
            expect(userRepository.findById).not.toHaveBeenCalled()
        })

        it('should return 401 if old password is incorrect', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                password: 'hashedOldPassword'
            }

            userRepository.findById.mockResolvedValue(mockUser)
            bcrypt.compare.mockResolvedValue(false)

            // Act
            await resetPassword(req, res)

            // Assert
            expect(userRepository.findById).toHaveBeenCalledWith(1)
            expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword123', 'hashedOldPassword')
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Ancien mot de passe incorrect'
            })
            expect(bcrypt.hash).not.toHaveBeenCalled()
        })

        it('should handle database errors', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                password: 'hashedOldPassword'
            }

            userRepository.findById.mockResolvedValue(mockUser)
            bcrypt.compare.mockResolvedValue(true)
            bcrypt.hash.mockResolvedValue('hashedNewPassword')
            db.execute.mockRejectedValue(new Error('Database error'))

            // Act
            await resetPassword(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la réinitialisation du mot de passe'
            })
        })
    })

    describe('forgotPassword', () => {
        beforeEach(() => {
            req.body = {
                email: 'john@test.com'
            }
        })

        it('should generate reset link for existing user', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                email: 'john@test.com'
            }

            userRepository.findByEmail.mockResolvedValue(mockUser)
            generateToken.mockReturnValue('reset-token-123')

            // Act
            await forgotPassword(req, res)

            // Assert
            expect(userRepository.findByEmail).toHaveBeenCalledWith('john@test.com')
            expect(generateToken).toHaveBeenCalledWith({ id: 1 }, '15m')
            expect(res.json).toHaveBeenCalledWith({
                message: 'Lien généré',
                resetLink: '/reset-password/reset-token-123'
            })
        })

        it('should return 400 if email is missing', async () => {
            // Arrange
            req.body.email = ''

            // Act
            await forgotPassword(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Email requis'
            })
            expect(userRepository.findByEmail).not.toHaveBeenCalled()
        })

        it('should return 404 if user not found', async () => {
            // Arrange
            userRepository.findByEmail.mockResolvedValue(null)

            // Act
            await forgotPassword(req, res)

            // Assert
            expect(userRepository.findByEmail).toHaveBeenCalledWith('john@test.com')
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Si l\'utilisateur existe vous recevrez un lien de réinitialisation sur votre boite mail'
            })
            expect(generateToken).not.toHaveBeenCalled()
        })

        it('should handle errors', async () => {
            // Arrange
            userRepository.findByEmail.mockRejectedValue(new Error('Database error'))

            // Act
            await forgotPassword(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la génération du lien'
            })
        })
    })

    describe('publicResetPassword', () => {
        beforeEach(() => {
            req.params = {
                token: 'reset-token-123'
            }
            req.body = {
                newPassword: 'newPassword123'
            }
        })

        it('should reset password with valid token', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                email: 'john@test.com'
            }

            verifyToken.mockReturnValue({ id: 1 })
            userRepository.findById.mockResolvedValue(mockUser)
            bcrypt.hash.mockResolvedValue('hashedNewPassword')
            db.execute.mockResolvedValue()

            // Act
            await publicResetPassword(req, res)

            // Assert
            expect(verifyToken).toHaveBeenCalledWith('reset-token-123')
            expect(userRepository.findById).toHaveBeenCalledWith(1)
            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10)
            expect(db.execute).toHaveBeenCalledWith(
                'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                ['hashedNewPassword', 1]
            )
            expect(res.json).toHaveBeenCalledWith({
                message: 'Mot de passe mis à jour avec succès'
            })
        })

        it('should return 400 if new password is missing', async () => {
            // Arrange
            req.body.newPassword = ''

            // Act
            await publicResetPassword(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Nouveau mot de passe requis'
            })
            expect(verifyToken).not.toHaveBeenCalled()
        })

        it('should return 404 if user not found', async () => {
            // Arrange
            verifyToken.mockReturnValue({ id: 1 })
            userRepository.findById.mockResolvedValue(null)

            // Act
            await publicResetPassword(req, res)

            // Assert
            expect(verifyToken).toHaveBeenCalledWith('reset-token-123')
            expect(userRepository.findById).toHaveBeenCalledWith(1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Utilisateur introuvable'
            })
            expect(bcrypt.hash).not.toHaveBeenCalled()
        })

        it('should return 400 if token is invalid', async () => {
            // Arrange
            verifyToken.mockImplementation(() => {
                throw new Error('Invalid token')
            })

            // Act
            await publicResetPassword(req, res)

            // Assert
            expect(verifyToken).toHaveBeenCalledWith('reset-token-123')
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Lien invalide ou expiré'
            })
            expect(userRepository.findById).not.toHaveBeenCalled()
        })

        it('should handle database errors', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                email: 'john@test.com'
            }

            verifyToken.mockReturnValue({ id: 1 })
            userRepository.findById.mockResolvedValue(mockUser)
            bcrypt.hash.mockResolvedValue('hashedNewPassword')
            db.execute.mockRejectedValue(new Error('Database error'))

            // Act
            await publicResetPassword(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Lien invalide ou expiré'
            })
        })
    })
})