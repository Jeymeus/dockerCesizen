// api/tests/controllers/userController.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    listUsers,
    getUserById,
    updateProfile,
    updateUser,
    changeUserRole,
    updateUserActiveStatus,
    getUserProfile,
    removeAccount
} from '../../controllers/userController.js'
import { userRepository } from '../../repositories/UserRepository.js'
import { verifyToken } from '../../utils/jwt.js'
import { sanitizeUserPayload } from '../../utils/sanitize.js'
import bcrypt from 'bcryptjs'

vi.mock('../../repositories/UserRepository.js')
vi.mock('../../utils/jwt.js')
vi.mock('../../utils/sanitize.js')
vi.mock('bcryptjs')

describe('UserController', () => {
    let req, res

    beforeEach(() => {
        vi.clearAllMocks()
        req = {
            params: { id: 1 },
            body: {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                password: 'newpassword123',
                role: 'user',
                active: true
            },
            user: { id: 1, role: 'admin' },
            headers: { authorization: 'Bearer validtoken' }
        }
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn()
        }
    })

    describe('listUsers', () => {
        it('should return all users', async () => {
            // Arrange
            const mockUsers = [
                { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com' },
                { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com' }
            ]
            userRepository.findAll.mockResolvedValue(mockUsers)

            // Act
            await listUsers(req, res)

            // Assert
            expect(res.json).toHaveBeenCalledWith(mockUsers)
        })

        it('should handle errors when listing users', async () => {
            // Arrange
            userRepository.findAll.mockRejectedValue(new Error('DB Error'))

            // Act
            await listUsers(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la récupération des utilisateurs'
            })
        })
    })

    describe('getUserById', () => {
        it('should return user by id', async () => {
            // Arrange
            const mockUser = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com' }
            userRepository.findById.mockResolvedValue(mockUser)

            // Act
            await getUserById(req, res)

            // Assert
            expect(userRepository.findById).toHaveBeenCalledWith(1)
            expect(res.json).toHaveBeenCalledWith(mockUser)
        })

        it('should return 404 if user not found', async () => {
            // Arrange
            userRepository.findById.mockResolvedValue(null)

            // Act
            await getUserById(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Utilisateur non trouvé'
            })
        })

        it('should handle errors when getting user by id', async () => {
            // Arrange
            userRepository.findById.mockRejectedValue(new Error('DB Error'))

            // Act
            await getUserById(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: "Erreur lors de la récupération de l'utilisateur"
            })
        })
    })

    describe('updateProfile', () => {
        it('should update user profile without password', async () => {
            // Arrange
            const mockUser = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com' }
            req.body.password = ''
            userRepository.update.mockResolvedValue(mockUser)

            // Act
            await updateProfile(req, res)

            // Assert
            expect(userRepository.update).toHaveBeenCalledWith(1, {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@example.com'
            })
            expect(res.json).toHaveBeenCalledWith(mockUser)
        })

        it('should update user profile with password', async () => {
            // Arrange
            const mockUser = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com' }
            bcrypt.hash.mockResolvedValue('hashedpassword')
            userRepository.update.mockResolvedValue(mockUser)

            // Act
            await updateProfile(req, res)

            // Assert
            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10)
            expect(userRepository.update).toHaveBeenCalledWith(1, {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                password: 'hashedpassword'
            })
            expect(res.json).toHaveBeenCalledWith(mockUser)
        })

        it('should return 400 if required fields are missing', async () => {
            // Arrange
            req.body.firstname = ''

            // Act
            await updateProfile(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Tous les champs sont requis'
            })
        })

        it('should handle errors when updating profile', async () => {
            // Arrange
            userRepository.update.mockRejectedValue(new Error('DB Error'))

            // Act
            await updateProfile(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la mise à jour du profil'
            })
        })
    })

    describe('updateUser', () => {
        it('should update user', async () => {
            // Arrange
            const cleanData = { firstname: 'John', lastname: 'Doe', email: 'john@example.com' }
            const mockUser = { id: 1, ...cleanData }

            sanitizeUserPayload.mockReturnValue(cleanData)
            userRepository.update.mockResolvedValue(mockUser)

            // Act
            await updateUser(req, res)

            // Assert
            expect(sanitizeUserPayload).toHaveBeenCalledWith(req.body)
            expect(userRepository.update).toHaveBeenCalledWith(1, cleanData)
            expect(res.json).toHaveBeenCalledWith(mockUser)
        })

        it('should handle errors when updating user', async () => {
            // Arrange
            sanitizeUserPayload.mockReturnValue(req.body)
            userRepository.update.mockRejectedValue(new Error('DB Error'))

            // Act
            await updateUser(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la mise à jour de l\'utilisateur'
            })
        })
    })

    describe('changeUserRole', () => {
        it('should change user role', async () => {
            // Arrange
            req.body.role = 'admin'
            const mockUser = { id: 1, role: 'admin' }
            userRepository.updateRole.mockResolvedValue(mockUser)

            // Act
            await changeUserRole(req, res)

            // Assert
            expect(userRepository.updateRole).toHaveBeenCalledWith(1, 'admin')
            expect(res.json).toHaveBeenCalledWith(mockUser)
        })

        it('should return 400 for invalid role', async () => {
            // Arrange
            req.body.role = 'invalid'

            // Act
            await changeUserRole(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Rôle invalide'
            })
        })

        it('should handle errors when changing user role', async () => {
            // Arrange
            req.body.role = 'admin'
            userRepository.updateRole.mockRejectedValue(new Error('DB Error'))

            // Act
            await changeUserRole(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: "Erreur lors du changement de rôle"
            })
        })
    })

    describe('updateUserActiveStatus', () => {
        it('should update user active status', async () => {
            // Arrange
            req.body.active = false
            const mockUser = { id: 1, active: false }
            userRepository.setActive.mockResolvedValue(mockUser)

            // Act
            await updateUserActiveStatus(req, res)

            // Assert
            expect(userRepository.setActive).toHaveBeenCalledWith(1, false)
            expect(res.json).toHaveBeenCalledWith(mockUser)
        })

        it('should return 400 for invalid active value', async () => {
            // Arrange
            req.body.active = 'invalid'

            // Act
            await updateUserActiveStatus(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: "Le champ 'active' doit être un booléen."
            })
        })

        it('should handle errors when updating active status', async () => {
            // Arrange
            req.body.active = false
            userRepository.setActive.mockRejectedValue(new Error('DB Error'))

            // Act
            await updateUserActiveStatus(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la mise à jour du statut du compte'
            })
        })
    })

    describe('getUserProfile', () => {
        it('should get user profile', async () => {
            // Arrange
            const mockUser = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com' }
            verifyToken.mockReturnValue({ id: 1 })
            userRepository.findById.mockResolvedValue(mockUser)

            // Act
            await getUserProfile(req, res)

            // Assert
            expect(verifyToken).toHaveBeenCalledWith('validtoken')
            expect(userRepository.findById).toHaveBeenCalledWith(1)
            expect(res.json).toHaveBeenCalledWith(mockUser)
        })

        it('should return 401 if token is missing', async () => {
            // Arrange
            req.headers.authorization = null

            // Act
            await getUserProfile(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Token manquant'
            })
        })

        it('should return 404 if user not found', async () => {
            // Arrange
            verifyToken.mockReturnValue({ id: 1 })
            userRepository.findById.mockResolvedValue(null)

            // Act
            await getUserProfile(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Utilisateur non trouvé'
            })
        })

        it('should return 401 for invalid token', async () => {
            // Arrange
            verifyToken.mockImplementation(() => {
                throw new Error('Invalid token')
            })

            // Act
            await getUserProfile(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Token invalide'
            })
        })
    })

    describe('removeAccount', () => {
        it('should remove user account', async () => {
            // Arrange
            const mockUser = { id: 1, firstname: 'John', lastname: 'Doe' }
            userRepository.findById.mockResolvedValue(mockUser)
            userRepository.delete.mockResolvedValue(true)

            // Act
            await removeAccount(req, res)

            // Assert
            expect(userRepository.findById).toHaveBeenCalledWith(1)
            expect(userRepository.delete).toHaveBeenCalledWith(1)
            expect(res.status).toHaveBeenCalledWith(204)
            expect(res.send).toHaveBeenCalled()
        })

        it('should return 404 if user not found', async () => {
            // Arrange
            userRepository.findById.mockResolvedValue(null)

            // Act
            await removeAccount(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Utilisateur non trouvé'
            })
        })

        it('should return 500 if deletion fails', async () => {
            // Arrange
            const mockUser = { id: 1, firstname: 'John', lastname: 'Doe' }
            userRepository.findById.mockResolvedValue(mockUser)
            userRepository.delete.mockResolvedValue(false)

            // Act
            await removeAccount(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la suppression'
            })
        })

        it('should handle errors when removing account', async () => {
            // Arrange
            userRepository.findById.mockRejectedValue(new Error('DB Error'))

            // Act
            await removeAccount(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la suppression du compte'
            })
        })
    })
})