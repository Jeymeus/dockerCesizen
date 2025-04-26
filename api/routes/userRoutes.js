import express from 'express'
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js'
import { updateProfile, changeUserRole, updateUserActiveStatus, removeAccount, listUsers, getUserById } from '../controllers/userController.js'

const router = express.Router()

router.get('/me', authenticate, (req, res) => {
    res.json(req.user)
})

router.get('/', authenticate, isAdmin, listUsers)

router.get('/:id', authenticate, isAdmin, getUserById)

router.patch('/me', authenticate, updateProfile)

router.patch('/:id/role', authenticate, isAdmin, changeUserRole)

router.patch('/:id/status', authenticate, isAdmin, updateUserActiveStatus)

router.delete('/:id', authenticate, isAdmin, removeAccount)

export default router
