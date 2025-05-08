import express from 'express'
import {
    listUsers,
    getUserById,
    updateProfile,
    changeUserRole,
    updateUserActiveStatus,
    getUserProfile,
    removeAccount
} from '../controllers/userController.js'

import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/me', authenticateToken, getUserProfile)
router.get('/', authenticateToken, requireAdmin, listUsers)
router.get('/:id', authenticateToken, requireAdmin, getUserById)
router.put('/profile', authenticateToken, updateProfile)
router.patch('/:id/role', authenticateToken, requireAdmin, changeUserRole)
router.patch('/:id/active', authenticateToken, requireAdmin, updateUserActiveStatus)
router.delete('/:id', authenticateToken, requireAdmin, removeAccount)

export default router
